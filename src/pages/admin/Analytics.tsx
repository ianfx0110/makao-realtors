import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { TrendingUp, TrendingDown, Eye, Users, Home, Wallet, MapPin, ArrowUpRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';

export const PlatformAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [
          { data: listings },
          { data: users },
          { data: views },
          { data: payments }
        ] = await Promise.all([
          supabase.from('listings').select('*'),
          supabase.from('user_profiles').select('*'),
          supabase.from('listing_views').select('*'),
          supabase.from('payments').select('*')
        ]);

        // Process Regional Distribution
        const regions: Record<string, number> = {};
        listings?.forEach(l => {
          const region = l.location.split(',').pop()?.trim() || 'Other';
          regions[region] = (regions[region] || 0) + 1;
        });

        const regionalData = Object.entries(regions).map(([name, value]) => ({ name, value }));

        // Process Revenue by Month (Last 6 months)
        const monthlyRevenue = [0, 0, 0, 0, 0, 0].map((_, i) => {
          const d = new Date();
          d.setMonth(d.getMonth() - i);
          return {
            month: d.toLocaleString('default', { month: 'short' }),
            monthIndex: d.getMonth(),
            year: d.getFullYear(),
            revenue: 0
          };
        }).reverse();

        payments?.forEach(p => {
          const d = new Date(p.created_at);
          const item = monthlyRevenue.find(m => m.monthIndex === d.getMonth() && m.year === d.getFullYear());
          if (item) item.revenue += Number(p.amount);
        });

        setData({
          totalListings: listings?.length || 0,
          totalUsers: users?.length || 0,
          totalViews: views?.length || 0,
          totalRevenue: payments?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0,
          regionalData,
          monthlyRevenue
        });
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return (
    <div className="pt-32 px-6 max-w-7xl mx-auto text-center py-20 text-stone-400 animate-pulse">
      Crunching platform performance metrics...
    </div>
  );

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="mb-12">
        <span className="text-brand-accent uppercase tracking-widest text-[10px] font-bold mb-2 block">Intelligence Dashboard</span>
        <h1 className="text-4xl font-serif text-brand-primary mb-2">Platform <span className="text-brand-accent">Analytics</span></h1>
        <p className="text-stone-500 text-sm font-light">Real-time performance metrics and market health indicators.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Platform Value', value: `KES ${(data.totalRevenue / 1000).toFixed(1)}K`, icon: Wallet, color: 'text-brand-accent' },
          { label: 'Citizen Base', value: data.totalUsers, icon: Users, color: 'text-blue-500' },
          { label: 'Asset Volume', value: data.totalListings, icon: Home, color: 'text-green-500' },
          { label: 'Public Interest', value: data.totalViews >= 1000 ? (data.totalViews / 1000).toFixed(1) + 'K' : data.totalViews, icon: Eye, color: 'text-purple-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-6">
              <div className={`p-3 bg-stone-50 rounded-xl ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <ArrowUpRight size={16} className="text-stone-200" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-stone-300 tracking-widest mb-1">{stat.label}</div>
              <div className="text-2xl font-serif text-brand-primary">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[2.5rem] border border-stone-100 shadow-sm">
          <h3 className="text-xl font-serif text-brand-primary mb-8">Revenue Growth</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.monthlyRevenue}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C19A6B" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#C19A6B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#A8A29E' }} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '10px', fontWeight: 'bold', color: '#1C1917' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#C19A6B" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] border border-stone-100 shadow-sm">
          <h3 className="text-xl font-serif text-brand-primary mb-8 flex items-center gap-3">
            <MapPin size={20} className="text-brand-accent" />
            Regional Distribution
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.regionalData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f5f5f5" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#A8A29E' }} width={80} />
                <Tooltip 
                  cursor={{ fill: '#f5f5f5' }}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                />
                <Bar dataKey="value" fill="#1C1917" radius={[0, 10, 10, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
