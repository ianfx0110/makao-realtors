import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Search, Map, CreditCard, Calendar, Loader2, Heart, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { PropertyCard } from '../../components/property/PropertyCard';
import { Link } from 'react-router-dom';

export const BuyerHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    savedSearches: 0,
    mortgageStatus: 'Not Started',
    upcomingTours: 0,
    savedProperties: 0
  });
  const [recentSaved, setRecentSaved] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBuyerData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        // Parallel fetch for buyer stats
        const [searchesRes, mortgageRes, toursRes, savedCountRes, recentSavedRes] = await Promise.all([
          supabase.from('saved_searches').select('id', { count: 'exact' }).eq('user_id', user.id),
          supabase.from('mortgage_applications').select('status').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1),
          supabase.from('property_tours').select('id', { count: 'exact' }).eq('user_id', user.id).eq('status', 'scheduled'),
          supabase.from('saved_properties').select('id', { count: 'exact' }).eq('user_id', user.id),
          supabase.from('saved_properties').select('listings(*)').eq('user_id', user.id).limit(3)
        ]);

        setStats({
          savedSearches: searchesRes.count || 0,
          mortgageStatus: mortgageRes.data?.[0]?.status || 'Not Started',
          upcomingTours: toursRes.count || 0,
          savedProperties: savedCountRes.count || 0
        });

        if (recentSavedRes.data) {
          setRecentSaved(recentSavedRes.data.map((item: any) => {
            const p = item.listings;
            return {
              ...p,
              sqft: p.area || 0,
              landlord: { name: 'Agent' }
            };
          }));
        }
      } catch (error) {
        console.error('Error fetching buyer data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBuyerData();
  }, [user]);

  if (loading) {
    return (
      <div className="pt-32 pb-20 px-6 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="animate-spin text-brand-accent" size={32} />
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-serif text-brand-primary mb-2">Buyer Portal</h1>
        <p className="text-stone-500 mb-12">Your gateway to owning premium Kenyan real estate.</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div className="p-6 bg-white border border-stone-100 rounded-3xl shadow-sm">
            <Heart className="text-brand-accent mb-4" size={24} />
            <div className="text-2xl font-serif mb-1">{stats.savedProperties}</div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-stone-400">Favorites</div>
          </div>
          <div className="p-6 bg-white border border-stone-100 rounded-3xl shadow-sm">
            <Map className="text-blue-500 mb-4" size={24} />
            <div className="text-2xl font-serif mb-1">{stats.savedSearches}</div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-stone-400">Saved Searches</div>
          </div>
          <div className="p-6 bg-white border border-stone-100 rounded-3xl shadow-sm">
            <CreditCard className="text-emerald-500 mb-4" size={24} />
            <div className="text-xl font-serif mb-1 capitalize truncate">{stats.mortgageStatus}</div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-stone-400">Mortgage Status</div>
          </div>
          <div className="p-6 bg-white border border-stone-100 rounded-3xl shadow-sm">
            <Calendar className="text-amber-500 mb-4" size={24} />
            <div className="text-2xl font-serif mb-1">{stats.upcomingTours}</div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-stone-400">Upcoming Viewings</div>
          </div>
        </div>

        {recentSaved.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-serif text-brand-primary">Curated Favorites</h2>
              <Link to="/favorites" className="flex items-center gap-2 text-brand-accent text-xs font-bold uppercase tracking-widest hover:gap-3 transition-all">
                View Selection <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentSaved.map((property, idx) => (
                <PropertyCard key={property.id} property={property} index={idx} />
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
