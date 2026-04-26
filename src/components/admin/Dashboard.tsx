import React, { useEffect, useState } from 'react';
import { 
  Home, 
  Users, 
  Eye, 
  TrendingUp, 
  CheckCircle2,
  Megaphone,
  MessageSquare,
  Plus,
  ShieldCheck,
  Search,
  Activity,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { formatDistanceToNow, subDays } from 'date-fns';

interface DashboardStats {
  totalListings: number;
  activeUsers: number;
  marketViews: number;
  revenue: number;
  listingTrend: string;
  userTrend: string;
  viewTrend: string;
  revenueTrend: string;
}

interface ActivityItem {
  id: string;
  type: 'user' | 'listing' | 'application' | 'ticket';
  message: string;
  timestamp: string;
}

export const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalListings: 0,
    activeUsers: 0,
    marketViews: 0,
    revenue: 0,
    listingTrend: '+0%',
    userTrend: '+0%',
    viewTrend: '+0%',
    revenueTrend: '+0%'
  });
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [recentListings, setRecentListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const thirtyDaysAgo = subDays(new Date(), 30).toISOString();
        const sixtyDaysAgo = subDays(new Date(), 60).toISOString();

        const [
          { count: listingsCount },
          { count: prevListingsCount },
          { count: usersCount },
          { count: prevUsersCount },
          { data: viewsData },
          { data: prevViewsData },
          { data: revenueData },
          { data: prevRevenueData },
          { data: latestListings },
          { data: latestUsers },
          { data: latestApps },
          { data: latestRoleReqs }
        ] = await Promise.all([
          supabase.from('listings').select('*', { count: 'exact', head: true }),
          supabase.from('listings').select('*', { count: 'exact', head: true }).lt('created_at', thirtyDaysAgo),
          supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
          supabase.from('user_profiles').select('*', { count: 'exact', head: true }).lt('created_at', thirtyDaysAgo),
          supabase.from('listing_views').select('*'),
          supabase.from('listing_views').select('*').lt('viewed_at', thirtyDaysAgo).gt('viewed_at', sixtyDaysAgo),
          supabase.from('payments').select('amount').eq('status', 'completed'),
          supabase.from('payments').select('amount').eq('status', 'completed').lt('created_at', thirtyDaysAgo),
          supabase.from('listings').select('*, user_profiles(name, email)').order('created_at', { ascending: false }).limit(5),
          supabase.from('user_profiles').select('*').order('created_at', { ascending: false }).limit(3),
          supabase.from('property_applications').select('*, listings(title)').order('created_at', { ascending: false }).limit(3),
          supabase.from('role_change_requests').select('*, user_profiles(name)').eq('status', 'pending').order('created_at', { ascending: false }).limit(2)
        ]);

        const currentRevenue = revenueData?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;
        const prevRevenue = prevRevenueData?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;
        
        const currentViews = viewsData?.length || 0;
        const prevViews = prevViewsData?.length || 0;

        const calculateTrend = (curr: number, prev: number) => {
          if (prev === 0) return '+0%';
          const diff = ((curr - prev) / prev) * 100;
          return `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}%`;
        };

        setStats({
          totalListings: listingsCount || 0,
          activeUsers: usersCount || 0,
          marketViews: currentViews,
          revenue: currentRevenue,
          listingTrend: calculateTrend(listingsCount || 0, prevListingsCount || 0),
          userTrend: calculateTrend(usersCount || 0, prevUsersCount || 0),
          viewTrend: calculateTrend(currentViews, prevViews),
          revenueTrend: calculateTrend(currentRevenue, prevRevenue)
        });

        if (latestListings) setRecentListings(latestListings);

        const newActivities: ActivityItem[] = [];
        latestUsers?.forEach(u => newActivities.push({
          id: u.id,
          type: 'user',
          message: `New ${u.role} joined: ${u.name}`,
          timestamp: u.created_at
        }));
        latestListings?.slice(0, 2).forEach(l => newActivities.push({
          id: l.id,
          type: 'listing',
          message: `New listing posted in ${l.location}`,
          timestamp: l.created_at
        }));
        latestApps?.forEach(a => newActivities.push({
          id: a.id,
          type: 'application',
          message: `Application received for ${a.listings?.title || 'a property'}`,
          timestamp: a.created_at
        }));
        latestRoleReqs?.forEach(r => newActivities.push({
          id: r.id,
          type: 'ticket',
          message: `Category change request: ${r.user_profiles?.name} wants to be a ${r.requested_role}`,
          timestamp: r.created_at
        }));

        setActivities(newActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    // Set up real-time subscriptions
    const channel = supabase.channel('admin-dashboard');
    
    channel
      .on('postgres_changes', { event: '*', schema: 'public', table: 'listings' }, () => fetchDashboardData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_profiles' }, () => fetchDashboardData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'listing_views' }, () => fetchDashboardData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'payments' }, () => fetchDashboardData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'role_change_requests' }, () => fetchDashboardData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'property_applications' }, () => fetchDashboardData())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const statCards = [
    { label: 'Total Listings', value: stats.totalListings.toLocaleString(), icon: Home, trend: stats.listingTrend, color: 'text-blue-500' },
    { label: 'Active Users', value: stats.activeUsers.toLocaleString(), icon: Users, trend: stats.userTrend, color: 'text-green-500' },
    { label: 'Market Views', value: stats.marketViews >= 1000 ? (stats.marketViews / 1000).toFixed(1) + 'K' : stats.marketViews.toLocaleString(), icon: Eye, trend: stats.viewTrend, color: 'text-purple-500' },
    { label: 'Revenue', value: stats.revenue >= 1000000 ? `KES ${(stats.revenue / 1000000).toFixed(1)}M` : `KES ${(stats.revenue / 1000).toFixed(1)}K`, icon: TrendingUp, trend: stats.revenueTrend, color: 'text-brand-accent' },
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 bg-stone-50 text-stone-900">
      <div className="max-w-7xl mx-auto px-6">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
          <div>
            <span className="text-brand-accent uppercase tracking-widest text-[10px] font-bold mb-2 block flex items-center gap-2">
              <ShieldCheck size={14} /> Platform Administration
            </span>
            <h1 className="text-4xl font-serif text-brand-primary">Control <span className="text-brand-accent">Center</span></h1>
            <p className="text-stone-400 text-sm font-light mt-1">Manage Makao Realtors platform users and listings</p>
          </div>
          <div className="flex gap-3">
            <Link to="/admin/blogs" className="bg-white border border-stone-100 text-stone-500 px-6 py-3 rounded-2xl text-[10px] uppercase font-bold tracking-widest hover:bg-stone-50 flex items-center gap-2 shadow-sm transition-all">
              <FileText size={14} /> Blog
            </Link>
            <Link to="/admin/broadcast" className="bg-white border border-stone-100 text-stone-500 px-6 py-3 rounded-2xl text-[10px] uppercase font-bold tracking-widest hover:bg-stone-50 flex items-center gap-2 shadow-sm transition-all">
              <Megaphone size={14} /> Broadcast
            </Link>
            <Link 
              to="/create-listing" 
              className="bg-brand-primary text-white px-6 py-3 rounded-2xl text-[10px] uppercase font-bold tracking-widest hover:bg-brand-secondary flex items-center gap-2 shadow-xl transition-all"
            >
              <Plus size={14} /> Add Listing
            </Link>
          </div>
        </header>

        {/* Global Search Bar */}
        <div className="mb-12">
          <div className="relative max-w-2xl group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-brand-accent transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search users, listings, counties or tickets..."
              className="w-full bg-white border border-stone-200 rounded-3xl py-5 pl-12 pr-4 text-sm focus:ring-4 focus:ring-brand-accent/5 focus:border-brand-accent outline-none shadow-sm transition-all font-light"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex gap-2">
              <span className="px-3 py-1 bg-stone-50 rounded-lg text-[8px] font-bold text-stone-400 border border-stone-100 font-mono tracking-tighter">CMD K</span>
            </div>
          </div>
        </div>

        {/* Management Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {statCards.map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 bg-stone-50 rounded-2xl group-hover:bg-brand-accent group-hover:text-white transition-all duration-300`}>
                  <stat.icon size={24} className={stat.color + " group-hover:text-white transition-colors"} />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-green-500 bg-green-50 px-2 py-1 rounded-lg">{stat.trend}</span>
                </div>
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-bold mb-2">{stat.label}</div>
              <div className="text-3xl font-serif text-brand-primary">{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Table */}
          <div className="lg:col-span-2 bg-white rounded-[2rem] border border-stone-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-8 border-b border-stone-100 flex justify-between items-center bg-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-stone-50 rounded-lg">
                  <Activity size={18} className="text-brand-accent" />
                </div>
                <h3 className="text-xl font-serif text-brand-primary">Recent Listings</h3>
              </div>
              <Link to="/listings" className="text-[10px] font-bold uppercase text-brand-accent tracking-widest hover:underline decoration-2 underline-offset-4">Full Database</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <tbody className="divide-y divide-stone-50">
                  {recentListings.map((p) => (
                    <tr key={p.id} className="hover:bg-stone-50/50 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm">
                            <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80'} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-brand-primary mb-0.5">{p.title}</div>
                            <div className="text-[10px] text-stone-400 uppercase font-bold tracking-widest flex items-center gap-1.5">
                              <span className="w-1 h-1 rounded-full bg-stone-300" /> {p.type} • {p.status === 'rent' ? 'Rent' : 'Sale'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="text-[10px] uppercase font-bold text-stone-300 mb-0.5 tracking-widest">Owner</div>
                        <div className="text-xs font-bold text-brand-primary">{p.user_profiles?.name || 'Unknown'}</div>
                        <div className="text-[10px] text-stone-400 font-light">{p.user_profiles?.email || 'N/A'}</div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="text-[10px] uppercase font-bold text-stone-300 mb-0.5 tracking-widest">Pricing</div>
                        <div className="text-xs font-bold text-brand-accent">KES {p.price?.toLocaleString()}</div>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full w-fit ${p.verified ? 'text-green-600 bg-green-50' : 'text-amber-600 bg-amber-50'}`}>
                          {p.verified ? <CheckCircle2 size={12} /> : <Activity size={12} />}
                          {p.verified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <Link to={`/admin/listings`} className="bg-stone-100 text-stone-400 p-2 rounded-xl hover:bg-brand-accent hover:text-white transition-all inline-block">
                          <Plus size={16} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {recentListings.length === 0 && !loading && (
                    <tr>
                      <td colSpan={4} className="p-20 text-center text-stone-400 italic">No listings found in the database.</td>
                    </tr>
                  )}
                  {loading && (
                    <tr>
                      <td colSpan={4} className="p-20 text-center text-stone-400 animate-pulse">Loading platform data...</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Link to="/admin/support" className="bg-brand-primary p-10 rounded-[2rem] block group hover:scale-[1.02] transition-all relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 -skew-x-12 translate-x-8 -translate-y-8" />
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white mb-10 group-hover:bg-brand-accent transition-all duration-300">
                <MessageSquare size={24} />
              </div>
              <h3 className="text-2xl font-serif text-white mb-3">Resolution Center</h3>
              <p className="text-white/50 font-light text-sm leading-relaxed">System monitoring flagged 14 new support tickets. Review and resolve merchant disputes.</p>
            </Link>
            
            <div className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm font-sans">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-serif text-lg text-brand-primary">Platform Activity</h3>
                <Activity size={16} className="text-stone-300" />
              </div>
              <div className="space-y-6">
                {activities.map((activity, i) => (
                  <div key={i} className="flex gap-4 relative group">
                    {i !== activities.length - 1 && (
                      <div className="absolute left-1 top-6 bottom-0 w-px bg-stone-50 group-hover:bg-brand-accent/20 transition-colors" />
                    )}
                    <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 z-10 ring-4 ring-white ${
                      activity.type === 'listing' ? 'bg-blue-400' : 
                      activity.type === 'user' ? 'bg-green-400' : 
                      'bg-brand-accent'
                    }`} />
                    <div className="flex-1">
                      <p className="text-xs text-stone-600 font-light mb-1">{activity.message}</p>
                      <span className="text-[8px] uppercase font-bold text-stone-300 tracking-widest">
                        {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                ))}
                {activities.length === 0 && !loading && (
                  <div className="text-center py-10">
                    <p className="text-[10px] uppercase font-bold text-stone-300 tracking-widest">Watching for signals...</p>
                  </div>
                )}
              </div>
              <button className="w-full mt-8 py-4 bg-stone-50 hover:bg-stone-100 rounded-2xl text-[10px] uppercase font-bold tracking-[0.2em] text-stone-400 transition-all">
                Full Systems Log
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
