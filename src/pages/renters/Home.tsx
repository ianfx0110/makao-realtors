import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { LayoutDashboard, Heart, History, Clock, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { PropertyCard } from '../../components/property/PropertyCard';
import { Link } from 'react-router-dom';

export const RenterHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    savedProperties: 0,
    activeApplications: 0,
    tourHistory: 0
  });
  const [recentSaved, setRecentSaved] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRenterData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        const [savedCountRes, appsRes, toursRes, recentSavedRes] = await Promise.all([
          supabase.from('saved_properties').select('id', { count: 'exact' }).eq('user_id', user.id),
          supabase.from('property_applications').select('id', { count: 'exact' }).eq('user_id', user.id).neq('status', 'rejected'),
          supabase.from('property_tours').select('id', { count: 'exact' }).eq('user_id', user.id).eq('status', 'completed'),
          supabase.from('saved_properties')
            .select('listings(*)')
            .eq('user_id', user.id)
            .limit(3)
        ]);

        setStats({
          savedProperties: savedCountRes.count || 0,
          activeApplications: appsRes.count || 0,
          tourHistory: toursRes.count || 0
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
        console.error('Error fetching renter data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRenterData();
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
        <h1 className="text-4xl font-serif text-brand-primary mb-2">Welcome back, {user?.name.split(' ')[0]}</h1>
        <p className="text-stone-500 mb-12">Here's what's happening with your property search.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="p-8 bg-white border border-stone-100 rounded-3xl shadow-sm">
            <Heart className="text-brand-accent mb-4" size={24} />
            <div className="text-3xl font-serif mb-1">{stats.savedProperties}</div>
            <div className="text-xs uppercase font-bold tracking-widest text-stone-400">Saved Properties</div>
          </div>
          <div className="p-8 bg-white border border-stone-100 rounded-3xl shadow-sm">
            <Clock className="text-blue-500 mb-4" size={24} />
            <div className="text-3xl font-serif mb-1">{stats.activeApplications}</div>
            <div className="text-xs uppercase font-bold tracking-widest text-stone-400">Active Applications</div>
          </div>
          <div className="p-8 bg-white border border-stone-100 rounded-3xl shadow-sm">
            <History className="text-emerald-500 mb-4" size={24} />
            <div className="text-3xl font-serif mb-1">{stats.tourHistory}</div>
            <div className="text-xs uppercase font-bold tracking-widest text-stone-400">Tour History</div>
          </div>
        </div>

        {recentSaved.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-serif text-brand-primary">Recently Saved</h2>
              <Link to="/favorites" className="flex items-center gap-2 text-brand-accent text-xs font-bold uppercase tracking-widest hover:gap-3 transition-all">
                View All <ArrowRight size={14} />
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
