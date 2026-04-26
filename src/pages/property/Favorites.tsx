import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Search, Home, ChevronRight, Share2, Trash2, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Property } from '../../types';

export const Favorites = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('saved_properties')
          .select(`
            listing_id,
            listings (*)
          `)
          .eq('user_id', user.id);

        if (error) throw error;
        
        // Transform the data to match Property type
        const properties = data.map((item: any) => {
          const p = item.listings;
          return {
            id: p.id,
            title: p.title,
            description: p.description,
            price: p.price,
            location: p.location,
            neighborhood: p.neighborhood,
            type: p.type,
            status: p.status,
            beds: p.beds,
            baths: p.baths,
            sqft: p.area,
            images: p.images || [],
            features: p.features || [],
            amenities: p.amenities || [],
            verified: p.verified,
            landlord: { name: 'Agent' } // We don't have landlord details joined here yet
          };
        });

        setFavorites(properties);
      } catch (err) {
        console.error('Error fetching favorites:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  const removeFavorite = async (id: string) => {
    if (!user) return;
    try {
      await supabase
        .from('saved_properties')
        .delete()
        .eq('user_id', user.id)
        .eq('listing_id', id);
      
      setFavorites(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error removing favorite:', err);
    }
  };

  if (!user && !loading) {
    navigate('/signin');
    return null;
  }

  return (
    <div className="pt-32 pb-20 min-h-screen bg-brand-secondary">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:row justify-between items-start md:items-end gap-12 mb-20">
          <div>
            <span className="text-brand-accent uppercase tracking-widest text-[10px] font-bold mb-4 block">Personal Selection</span>
            <h1 className="text-5xl md:text-6xl font-serif text-brand-primary mb-6 leading-tight">Your Saved <span className="text-brand-accent italic">Curations</span></h1>
            <p className="text-stone-500 text-lg font-light leading-relaxed max-w-xl">
              A private collection of properties that caught your eye. Keep track of price changes and availability.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="bg-white border border-stone-100 p-4 rounded-full text-stone-400 hover:text-brand-accent transition-colors shadow-sm">
              <Share2 size={24} />
            </button>
            <Link to="/listings" className="bg-brand-primary text-white px-10 py-5 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-brand-accent transition-all shadow-2xl flex items-center gap-3 active:scale-95">
              <Search size={18} /> Find More
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-40">
            <Loader2 className="animate-spin text-brand-accent" size={48} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-10">
            <AnimatePresence mode="popLayout">
              {favorites.length > 0 ? (
                favorites.map((p, i) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white rounded-[3rem] border border-stone-100 shadow-sm overflow-hidden flex flex-col md:flex-row group"
                  >
                    <div className="md:w-96 h-80 relative overflow-hidden flex-shrink-0">
                      <img 
                        src={p.images[0]} 
                        alt={p.title} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute top-8 left-8">
                        <span className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest text-brand-primary border border-white/50">
                          {p.type}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex-1 p-12 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <h3 className="text-3xl font-serif text-brand-primary mb-2">{p.title}</h3>
                            <div className="flex items-center gap-2 text-stone-400 text-sm font-light">
                              <Home size={14} className="text-brand-accent" />
                              {p.neighborhood}, {p.location.split(',')[0]}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-[10px] uppercase font-bold text-stone-300 tracking-[0.2em] mb-1">List Price</div>
                            <div className="text-2xl font-serif text-brand-accent">KES {p.price.toLocaleString()}</div>
                          </div>
                        </div>

                        <div className="flex gap-8 mb-8 border-y border-stone-50 py-6">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-stone-50 rounded-lg text-stone-400">
                              <Search size={16} />
                            </div>
                            <span className="text-xs font-bold text-brand-primary uppercase">{p.beds} <span className="font-light text-stone-400">Beds</span></span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-stone-50 rounded-lg text-stone-400">
                              <Search size={16} />
                            </div>
                            <span className="text-xs font-bold text-brand-primary uppercase">{p.baths} <span className="font-light text-stone-400">Baths</span></span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-stone-50 rounded-lg text-stone-400">
                              <Search size={16} />
                            </div>
                            <span className="text-xs font-bold text-brand-primary uppercase">{p.sqft.toLocaleString()} <span className="font-light text-stone-400">Sqft</span></span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Link to={`/property/${p.id}`} className="bg-brand-primary text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-brand-accent transition-colors flex items-center gap-3 shadow-xl">
                            View Details <ChevronRight size={14} />
                          </Link>
                          <button className="text-stone-300 hover:text-emerald-600 transition-colors p-4 hover:bg-emerald-50 rounded-2xl">
                            <Share2 size={20} />
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => removeFavorite(p.id)}
                          className="flex items-center gap-3 text-stone-300 hover:text-red-500 transition-all font-bold uppercase tracking-widest text-[10px] group/del"
                        >
                          <span className="opacity-0 group-hover/del:opacity-100 transition-opacity">Remove</span>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-40 text-center"
                >
                  <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-8 text-stone-300">
                    <Heart size={40} />
                  </div>
                  <h3 className="text-3xl font-serif text-brand-primary mb-4">No Heartbeats Yet</h3>
                  <p className="text-stone-400 font-light mb-12 max-w-sm mx-auto">
                    You haven't saved any listings to your favorites list. Start exploring our premium collection.
                  </p>
                  <Link 
                    to="/listings" 
                    className="inline-block bg-brand-accent text-white px-10 py-5 rounded-full font-bold uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-2xl"
                  >
                    Start Exploring
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};
