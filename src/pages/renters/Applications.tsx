import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { FileText, MapPin, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export const RentalApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user]);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('property_applications')
        .select(`
          *,
          listings (
            title,
            location,
            neighborhood,
            images,
            price
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const statusIcons: Record<string, any> = {
    pending: <Clock className="text-amber-500" size={18} />,
    under_review: <AlertCircle className="text-blue-500" size={18} />,
    accepted: <CheckCircle2 className="text-green-500" size={18} />,
    rejected: <XCircle className="text-red-500" size={18} />
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700 border-amber-100',
    under_review: 'bg-blue-50 text-blue-700 border-blue-100',
    accepted: 'bg-green-50 text-green-700 border-green-100',
    rejected: 'bg-red-50 text-red-700 border-red-100'
  };

  return (
    <div className="pt-32 px-6 max-w-7xl mx-auto pb-20">
      <div className="mb-12">
        <h1 className="text-4xl font-display mb-2">My <span className="text-brand-accent italic">Applications</span></h1>
        <p className="text-stone-500 font-light">Track the progress of your rental requests.</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-24 bento-card animate-pulse bg-stone-100" />)}
        </div>
      ) : applications.length > 0 ? (
        <div className="space-y-4">
          {applications.map((app) => (
            <motion.div 
              key={app.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bento-card flex flex-col md:flex-row items-center gap-6 p-6"
            >
              <div className="w-full md:w-40 h-24 rounded-2xl overflow-hidden shrink-0">
                <img src={app.listings.images[0]} alt="" className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-1 space-y-1">
                <h3 className="text-xl font-serif">{app.listings.title}</h3>
                <div className="flex items-center gap-4 text-xs text-stone-400">
                  <span className="flex items-center gap-1"><MapPin size={12} /> {app.listings.neighborhood}</span>
                  <span className="font-bold text-brand-accent">KES {app.listings.price.toLocaleString()}/mo</span>
                </div>
              </div>

              <div className="flex items-center gap-6 w-full md:w-auto border-t md:border-t-0 md:border-l border-stone-100 pt-4 md:pt-0 md:pl-8">
                <div className={`flex items-center gap-2 px-4 py-2 border rounded-full text-[10px] font-bold uppercase tracking-widest ${statusColors[app.status]}`}>
                  {statusIcons[app.status]}
                  {app.status.replace('_', ' ')}
                </div>
                <div className="text-right hidden md:block">
                  <div className="text-[10px] uppercase font-bold text-stone-300 tracking-widest">Applied On</div>
                  <div className="text-sm font-medium">{new Date(app.created_at).toLocaleDateString()}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bento-card py-20 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto text-stone-300">
            <FileText size={32} />
          </div>
          <h2 className="text-2xl font-serif">No applications yet</h2>
          <p className="text-stone-500 font-light">Found a place you like? Submit an application directly from the listing page.</p>
          <button className="btn-pill bg-brand-primary text-white mt-4">Browse Listings</button>
        </div>
      )}
    </div>
  );
};
