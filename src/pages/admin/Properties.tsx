import React, { useEffect, useState } from 'react';
import { ShieldCheck, XCircle, MoreVertical, Search, ExternalLink } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';

export const AdminProperties = () => {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*, user_profiles(name, email)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      console.error('Error fetching admin listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id: string, verified: boolean) => {
    try {
      const { error } = await supabase
        .from('listings')
        .update({ verified })
        .eq('id', id);

      if (error) throw error;
      fetchListings();
    } catch (error) {
      console.error('Error updating listing verification:', error);
    }
  };

  const filteredListings = listings.filter(l => 
    l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <span className="text-brand-accent uppercase tracking-widest text-[10px] font-bold mb-2 block">Administration</span>
          <h1 className="text-4xl font-serif text-brand-primary mb-2">Properties <span className="text-brand-accent">Database</span></h1>
          <p className="text-stone-500 text-sm font-light">Review, verify and manage all property listings on the platform.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
          <input 
            type="text"
            placeholder="Search by title, location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-stone-100 rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-4 focus:ring-brand-accent/5 outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white border border-stone-100 rounded-[2rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-stone-50/50 border-b border-stone-100">
                <th className="px-8 py-5 text-[10px] uppercase font-bold tracking-widest text-stone-400">Property</th>
                <th className="px-8 py-5 text-[10px] uppercase font-bold tracking-widest text-stone-400">Owner</th>
                <th className="px-8 py-5 text-[10px] uppercase font-bold tracking-widest text-stone-400">Financials</th>
                <th className="px-8 py-5 text-[10px] uppercase font-bold tracking-widest text-stone-400">Status</th>
                <th className="px-8 py-5 text-[10px] uppercase font-bold tracking-widest text-stone-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-stone-400 animate-pulse">Loading listings...</td>
                </tr>
              ) : filteredListings.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50/30 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-stone-100 flex-shrink-0">
                        {p.images?.[0] ? (
                          <img src={p.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-300">N/A</div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-brand-primary flex items-center gap-2">
                          {p.title}
                          <Link to={`/properties/${p.id}`} className="text-stone-300 hover:text-brand-accent"><ExternalLink size={14} /></Link>
                        </div>
                        <div className="text-[10px] text-stone-400 uppercase font-bold tracking-widest">{p.type} • {p.status}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="text-sm font-medium text-stone-700">{p.user_profiles?.name || 'Unknown'}</div>
                    <div className="text-[10px] text-stone-400">{p.user_profiles?.email || 'N/A'}</div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="text-[10px] uppercase font-bold text-stone-300 mb-0.5">Price</div>
                    <div className="text-xs font-bold text-brand-accent">KES {p.price?.toLocaleString()}</div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest ${
                      p.verified ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      <div className={`w-1 h-1 rounded-full ${p.verified ? 'bg-green-500' : 'bg-amber-500'}`} />
                      {p.verified ? 'Verified' : 'Pending Review'}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-end gap-2 text-right">
                      {!p.verified ? (
                        <button 
                          onClick={() => handleVerify(p.id, true)}
                          className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-xl text-[8px] uppercase font-bold tracking-widest transition-all"
                        >
                          <ShieldCheck size={14} /> Verify
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleVerify(p.id, false)}
                          className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl text-[8px] uppercase font-bold tracking-widest transition-all"
                        >
                          <XCircle size={14} /> Unverify
                        </button>
                      )}
                      <button className="p-2 text-stone-400 hover:bg-stone-100 rounded-xl transition-all"><MoreVertical size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filteredListings.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-stone-400 italic font-light">No properties matching your search were found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
