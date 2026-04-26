import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { User, Shield, CheckCircle2, XCircle, Clock, Search, Filter, Mail, Phone, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface RoleRequest {
  id: string;
  user_id: string;
  requested_role: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  user_profiles: {
    name: string;
    email: string;
    role: string;
  };
}

export const UserManagement = () => {
  const [requests, setRequests] = useState<RoleRequest[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'requests'>('requests');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: reqData } = await supabase
        .from('role_change_requests')
        .select('*, user_profiles(name, email, role)')
        .order('created_at', { ascending: false });
      
      const { data: userData } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (reqData) setRequests(reqData);
      if (userData) setUsers(userData);
    } catch (error) {
      console.error('Error fetching admin user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (requestId: string, userId: string, newRole: string, status: 'approved' | 'rejected') => {
    try {
      if (status === 'approved') {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .update({ role: newRole })
          .eq('id', userId);
        
        if (profileError) throw profileError;
      }

      const { error: requestError } = await supabase
        .from('role_change_requests')
        .update({ status })
        .eq('id', requestId);

      if (requestError) throw requestError;

      alert(`Request ${status} successfully!`);
      fetchData();
    } catch (error) {
      console.error('Error handling role request:', error);
      alert('Failed to update request status.');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingRequests = requests.filter(r => r.status === 'pending');

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <span className="text-brand-accent uppercase tracking-widest text-[10px] font-bold mb-2 block">Administration</span>
          <h1 className="text-4xl font-serif text-brand-primary">User <span className="text-brand-accent">Management</span></h1>
          <p className="text-stone-400 text-sm font-light mt-1">Review account upgrades and manage platform members.</p>
        </div>
        
        <div className="flex bg-white p-1 rounded-2xl border border-stone-100 shadow-sm">
          <button 
            onClick={() => setActiveTab('requests')}
            className={`px-6 py-2.5 rounded-xl text-[10px] uppercase font-bold tracking-widest transition-all ${
              activeTab === 'requests' ? 'bg-brand-primary text-white shadow-lg' : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            Role Requests {pendingRequests.length > 0 && <span className="ml-2 bg-brand-accent text-white px-2 py-0.5 rounded-full text-[8px]">{pendingRequests.length}</span>}
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-6 py-2.5 rounded-xl text-[10px] uppercase font-bold tracking-widest transition-all ${
              activeTab === 'users' ? 'bg-brand-primary text-white shadow-lg' : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            All Users
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Search & Filter */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
          <input 
            type="text"
            placeholder="Search by name, email or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-stone-100 rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-4 focus:ring-brand-accent/5 outline-none transition-all shadow-sm"
          />
        </div>

        {activeTab === 'requests' ? (
          <div className="grid grid-cols-1 gap-6">
            {pendingRequests.length === 0 ? (
              <div className="bento-card p-20 text-center flex flex-col items-center">
                <Shield size={48} className="text-stone-100 mb-6" />
                <h4 className="text-xl font-bold text-stone-300">No Pending Requests</h4>
                <p className="text-stone-400 text-sm font-light mt-2">All role change requests have been processed.</p>
              </div>
            ) : (
              pendingRequests.map((req) => (
                <div key={req.id} className="bg-white border border-stone-100 rounded-[2rem] p-8 shadow-sm flex flex-col md:row justify-between items-center gap-8 group hover:shadow-xl transition-all">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-stone-50 flex items-center justify-center text-brand-primary border border-stone-100 group-hover:bg-brand-accent group-hover:text-white transition-all">
                      <User size={32} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-brand-primary">{req.user_profiles.name}</h4>
                      <div className="flex flex-wrap gap-4 mt-2">
                        <span className="flex items-center gap-2 text-[10px] uppercase font-bold text-stone-400">
                          <Mail size={12} /> {req.user_profiles.email}
                        </span>
                        <span className="flex items-center gap-2 text-[10px] uppercase font-bold text-stone-400">
                          <Clock size={12} /> {format(new Date(req.created_at), 'MMM dd, yyyy')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <div className="text-[8px] uppercase font-bold text-stone-300 mb-1">Current</div>
                      <div className="px-3 py-1 bg-stone-100 rounded-lg text-[10px] font-bold text-stone-500 uppercase tracking-widest">{req.user_profiles.role}</div>
                    </div>
                    <div className="text-stone-200">→</div>
                    <div className="text-center">
                      <div className="text-[8px] uppercase font-bold text-stone-300 mb-1">Requested</div>
                      <div className="px-3 py-1 bg-brand-accent/10 rounded-lg text-[10px] font-bold text-brand-accent uppercase tracking-widest">{req.requested_role}</div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleAction(req.id, req.user_id, req.requested_role, 'rejected')}
                      className="p-4 rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                    >
                      <XCircle size={20} />
                    </button>
                    <button 
                      onClick={() => handleAction(req.id, req.user_id, req.requested_role, 'approved')}
                      className="px-8 py-4 rounded-2xl bg-green-500 text-white font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-green-500/20 hover:scale-105 transition-all flex items-center gap-2"
                    >
                      <CheckCircle2 size={16} /> Approve Upgrade
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="bg-white rounded-[2rem] border border-stone-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-stone-50/50">
                    <th className="px-8 py-5 text-[10px] uppercase font-bold text-stone-400 tracking-widest leading-none">User Profile</th>
                    <th className="px-8 py-5 text-[10px] uppercase font-bold text-stone-400 tracking-widest leading-none">Contact</th>
                    <th className="px-8 py-5 text-[10px] uppercase font-bold text-stone-400 tracking-widest leading-none">Role</th>
                    <th className="px-8 py-5 text-[10px] uppercase font-bold text-stone-400 tracking-widest leading-none">Joined</th>
                    <th className="px-8 py-5 text-[10px] uppercase font-bold text-stone-400 tracking-widest leading-none text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-stone-50/30 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-400 font-bold group-hover:bg-brand-accent group-hover:text-white transition-all">
                            {u.name[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-brand-primary">{u.name}</div>
                            <div className="text-[10px] text-stone-400 font-light">{u.is_verified ? 'Verified Citizen' : 'Unverified'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex flex-col gap-1">
                          <div className="text-xs text-stone-600 flex items-center gap-2"><Mail size={12} className="text-stone-300" /> {u.email}</div>
                          <div className="text-[10px] text-stone-400 flex items-center gap-2"><Phone size={12} className="text-stone-300" /> {u.phone || 'N/A'}</div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-lg text-[8px] font-bold uppercase tracking-widest ${
                          u.role === 'admin' ? 'bg-stone-900 text-white' : 
                          u.role === 'landlord' ? 'bg-blue-50 text-blue-600' :
                          u.role === 'seller' ? 'bg-green-50 text-green-600' :
                          'bg-stone-100 text-stone-500'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="text-xs text-stone-500 flex items-center gap-2">
                          <Calendar size={12} className="text-stone-300" />
                          {format(new Date(u.created_at), 'MMM yyyy')}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button className="text-stone-300 hover:text-brand-accent transition-colors p-2">
                          <Filter size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
