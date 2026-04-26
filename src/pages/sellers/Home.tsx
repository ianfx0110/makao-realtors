import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Tag, Users, BarChart3, Clock, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { PropertyCard } from '../../components/property/PropertyCard';
import { Link } from 'react-router-dom';

export const SellerHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    leads: 0,
    views: 0,
    activeListings: 0,
    avgTimeToSale: 'N/A'
  });
  const [myProperties, setMyProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellerData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        // Fetch seller listings
        const { data: listings } = await supabase.from('listings').select('*').eq('owner_id', user.id);
        const listingIds = listings?.map(l => l.id) || [];

        // Fetch leads for these listings
        const { count: leadCount } = await supabase.from('leads').select('id', { count: 'exact' }).in('listing_id', listingIds);

        // Fetch views for these listings
        const { count: viewCount } = await supabase.from('listing_views').select('id', { count: 'exact' }).in('listing_id', listingIds);

        setStats({
          leads: leadCount || 0,
          views: viewCount || 0,
          activeListings: listingIds.length,
          avgTimeToSale: '14 days'
        });

        if (listings) {
          setMyProperties(listings.map(l => ({
            ...l,
            sqft: l.area || 0,
            landlord: { name: user.name }
          })));
        }
      } catch (error) {
        console.error('Error fetching seller data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerData();
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
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-4xl font-serif text-brand-primary mb-2">Seller Dashboard</h1>
            <p className="text-stone-500">Track your listing performance and buyer interest.</p>
          </div>
          <Link 
            to="/create-listing"
            className="flex items-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-2xl text-[10px] uppercase font-bold tracking-widest shadow-xl hover:scale-105 transition-all"
          >
            <Tag size={14} /> Create Listing
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div className="p-6 bg-white border border-stone-100 rounded-3xl shadow-sm">
            <Users className="text-brand-accent mb-4" size={24} />
            <div className="text-2xl font-serif mb-1">{stats.leads}</div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-stone-400">Total Leads</div>
          </div>
          <div className="p-6 bg-white border border-stone-100 rounded-3xl shadow-sm">
            <BarChart3 className="text-blue-500 mb-4" size={24} />
            <div className="text-2xl font-serif mb-1">{stats.views > 1000 ? (stats.views / 1000).toFixed(1) + 'k' : stats.views}</div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-stone-400">Listing Views</div>
          </div>
          <div className="p-6 bg-white border border-stone-100 rounded-3xl shadow-sm">
            <Tag className="text-emerald-500 mb-4" size={24} />
            <div className="text-2xl font-serif mb-1">{stats.activeListings}</div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-stone-400">Active Listings</div>
          </div>
          <div className="p-6 bg-white border border-stone-100 rounded-3xl shadow-sm">
            <Clock className="text-amber-500 mb-4" size={24} />
            <div className="text-2xl font-serif mb-1">{stats.avgTimeToSale}</div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-stone-400">Avg. Time to Sale</div>
          </div>
        </div>

        {myProperties.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-serif text-brand-primary">Your Premium Listings</h2>
              <Link to="/listings" className="text-brand-accent text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                All Listings <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {myProperties.map((property, idx) => (
                <PropertyCard key={property.id} property={property} index={idx} />
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
