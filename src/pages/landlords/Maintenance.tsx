import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Wrench, Clock, AlertTriangle, CheckCircle2, MessageSquare, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export const MaintenanceHub = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);

  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  }, [user]);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select(`
          *,
          listings (title, neighborhood)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (err) {
      console.error('Error fetching maintenance:', err);
    } finally {
      setLoading(false);
    }
  };

  const priorityColors: Record<string, string> = {
    low: 'bg-blue-50 text-blue-700',
    medium: 'bg-amber-50 text-amber-700',
    high: 'bg-orange-50 text-orange-700',
    emergency: 'bg-red-50 text-red-700 animate-pulse'
  };

  return (
    <div className="pt-32 px-6 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-display mb-2">Maintenance <span className="text-brand-accent italic">Hub</span></h1>
          <p className="text-stone-500 font-light">Efficiently manage repairs and tenant requests.</p>
        </div>
        <button 
          onClick={() => setShowNewForm(true)}
          className="flex items-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-brand-accent transition-all"
        >
          <Plus size={16} /> New Request
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-48 bento-card animate-pulse bg-stone-100" />)}
        </div>
      ) : requests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req) => (
            <motion.div 
              key={req.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bento-card p-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className={`px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest ${priorityColors[req.priority]}`}>
                    {req.priority}
                  </div>
                  <div className="text-[10px] items-center gap-1 flex text-stone-400 font-bold uppercase tracking-widest">
                    <Clock size={12} /> {new Date(req.created_at).toLocaleDateString()}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-serif text-xl mb-1">{req.subject}</h3>
                  <p className="text-xs text-stone-400">{req.listings?.title || 'Unknown Property'}</p>
                </div>

                <p className="text-sm text-stone-500 line-clamp-3 font-light leading-relaxed">
                  {req.description}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-stone-100 flex justify-between items-center">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-stone-600">
                  <span className={`w-2 h-2 rounded-full ${req.status === 'resolved' ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`} />
                  {req.status.replace('_', ' ')}
                </div>
                <button className="text-brand-accent hover:text-brand-primary transition-colors">
                  <MessageSquare size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bento-card py-20 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto text-stone-300">
            <Wrench size={32} />
          </div>
          <h2 className="text-2xl font-serif">Quiet day today</h2>
          <p className="text-stone-500 font-light">No active maintenance requests found. Tenants can submit these via their dashboard.</p>
        </div>
      )}

      {showNewForm && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bento-card max-w-xl w-full p-10 bg-white"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-serif">Report <span className="text-brand-accent italic">Issue</span></h2>
              <button onClick={() => setShowNewForm(false)} className="text-stone-400 hover:text-stone-900">×</button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const subject = (form.elements.namedItem('subject') as HTMLInputElement).value;
              const description = (form.elements.namedItem('description') as HTMLTextAreaElement).value;
              const priority = (form.elements.namedItem('priority') as HTMLSelectElement).value;

              try {
                const { error } = await supabase.from('maintenance_requests').insert({
                  tenant_id: user?.id,
                  subject,
                  description,
                  priority,
                  status: 'open'
                });
                if (error) throw error;
                setShowNewForm(false);
                fetchRequests();
              } catch (err: any) {
                alert(err.message || 'Failed to submit request');
              }
            }} className="space-y-6">
              <div>
                <label className="text-[10px] uppercase font-bold text-stone-400 block mb-2">Subject</label>
                <input name="subject" required className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 outline-none" placeholder="e.g. Broken AC in Bedroom" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-stone-400 block mb-2">Priority</label>
                  <select name="priority" className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 outline-none">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-stone-400 block mb-2">Property</label>
                  <select name="property" className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 outline-none">
                    <option>Select My Home</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-stone-400 block mb-2">Description</label>
                <textarea name="description" required className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 outline-none h-32" placeholder="Tell us more about the issue..." />
              </div>
              <button type="submit" className="w-full py-4 bg-brand-primary text-white font-bold uppercase text-[10px] tracking-widest rounded-xl">Submit Request</button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
