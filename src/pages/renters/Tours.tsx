import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, Video, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export const VirtualTours = () => {
  const { user } = useAuth();
  const [tours, setTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTours();
    }
  }, [user]);

  const fetchTours = async () => {
    try {
      const { data, error } = await supabase
        .from('property_tours')
        .select(`
          *,
          listings (
            title,
            location,
            neighborhood,
            images
          )
        `)
        .eq('user_id', user?.id)
        .order('scheduled_at', { ascending: true });

      if (error) throw error;
      setTours(data || []);
    } catch (err) {
      console.error('Error fetching tours:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 px-6 max-w-7xl mx-auto pb-20">
      <div className="mb-12">
        <h1 className="text-4xl font-display mb-2">My Virtual <span className="text-brand-accent italic">Tours</span></h1>
        <p className="text-stone-500 font-light">Manage your scheduled viewings and 3D walkthroughs.</p>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-64 bento-card animate-pulse bg-stone-100" />)}
        </div>
      ) : tours.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map((tour) => (
            <motion.div 
              key={tour.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bento-card overflow-hidden group"
            >
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={tour.listings.images[0]} 
                  alt={tour.listings.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 capitalize px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold shadow-sm">
                  {tour.status}
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-serif text-xl mb-1">{tour.listings.title}</h3>
                  <div className="flex items-center gap-1 text-stone-400 text-xs">
                    <MapPin size={12} /> {tour.listings.neighborhood}, {tour.listings.location}
                  </div>
                </div>
                
                <div className="p-4 bg-stone-50 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-sm text-stone-600">
                    <Calendar size={14} className="text-brand-accent" />
                    {new Date(tour.scheduled_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-stone-600">
                    <Clock size={14} className="text-brand-accent" />
                    {new Date(tour.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 py-3 bg-brand-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-brand-accent transition-all flex items-center justify-center gap-2">
                    <Video size={14} /> Join Tour
                  </button>
                  <button 
                    onClick={async () => {
                      if (!confirm('Cancel this tour?')) return;
                      const { error } = await supabase
                        .from('property_tours')
                        .update({ status: 'cancelled' })
                        .eq('id', tour.id);
                      if (!error) fetchTours();
                    }}
                    className="p-3 border border-stone-100 text-stone-400 hover:text-red-500 hover:border-red-100 rounded-xl transition-all"
                  >
                    <XCircle size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bento-card py-20 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto text-stone-300">
            <Calendar size={32} />
          </div>
          <h2 className="text-2xl font-serif">No tours scheduled</h2>
          <p className="text-stone-500 font-light">Browse our premium listings and book a physical or virtual viewing today.</p>
          <button className="btn-pill bg-brand-primary text-white mt-4">Browse Listings</button>
        </div>
      )}
    </div>
  );
};
