import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { LayoutDashboard, Briefcase, TrendingUp, Users, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { PropertyCard } from '../../components/property/PropertyCard';
import { Link } from 'react-router-dom';

export const LandlordHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    revenue: 0,
    tenants: 0,
    activeListings: 0,
    occupancyRate: 0
  });
  const [myProperties, setMyProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLandlordData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        // Fetch properties owned by landlord
        const { data: properties } = await supabase.from('listings').select('*').eq('owner_id', user.id);
        const propertyIds = properties?.map(p => p.id) || [];

        // Fetch accepted applications for these properties (tenants)
        const { count: tenantCount } = await supabase.from('property_applications').select('id', { count: 'exact' }).in('listing_id', propertyIds).eq('status', 'accepted');

        // Revenue based on accepted applications (sum of prices)
        const { data: acceptedApps } = await supabase.from('property_applications').select('listing_id').in('listing_id', propertyIds).eq('status', 'accepted');
        const revenue = acceptedApps?.reduce((acc, app) => {
          const prop = properties?.find(p => p.id === app.listing_id);
          return acc + (prop?.price || 0);
        }, 0) || 0;

        setStats({
          revenue,
          tenants: tenantCount || 0,
          activeListings: propertyIds.length,
          occupancyRate: propertyIds.length > 0 ? Math.round(((tenantCount || 0) / propertyIds.length) * 100) : 0
        });

        if (properties) {
          setMyProperties(properties.map(p => ({
            ...p,
            sqft: p.area || 0,
            landlord: { name: user.name }
          })));
        }
      } catch (error) {
        console.error('Error fetching landlord data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLandlordData();
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
            <h1 className="text-4xl font-serif text-brand-primary mb-2">Portfolio Overview</h1>
            <p className="text-stone-500">Manage your properties and tenants from one place.</p>
          </div>
          <Link 
            to="/create-listing"
            className="flex items-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-2xl text-[10px] uppercase font-bold tracking-widest shadow-xl hover:scale-105 transition-all"
          >
            <Briefcase size={14} /> Add Property
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div className="p-6 bg-white border border-stone-100 rounded-3xl shadow-sm">
            <TrendingUp className="text-brand-accent mb-4" size={24} />
            <div className="text-2xl font-serif mb-1">KES {stats.revenue.toLocaleString()}</div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-stone-400">Monthly Revenue</div>
          </div>
          <div className="p-6 bg-white border border-stone-100 rounded-3xl shadow-sm">
            <Users className="text-blue-500 mb-4" size={24} />
            <div className="text-2xl font-serif mb-1">{stats.tenants}</div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-stone-400">Total Tenants</div>
          </div>
          <div className="p-6 bg-white border border-stone-100 rounded-3xl shadow-sm">
            <Briefcase className="text-emerald-500 mb-4" size={24} />
            <div className="text-2xl font-serif mb-1">{stats.activeListings}</div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-stone-400">Active Listings</div>
          </div>
          <div className="p-6 bg-white border border-stone-100 rounded-3xl shadow-sm">
            <TrendingUp className="text-amber-500 mb-4" size={24} />
            <div className="text-2xl font-serif mb-1">{stats.occupancyRate}%</div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-stone-400">Occupancy Rate</div>
          </div>
        </div>

        {myProperties.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-serif text-brand-primary">Your Properties</h2>
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
