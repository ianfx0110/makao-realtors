import React from 'react';
import { Search, SlidersHorizontal, MapPin, Bed, Bath, Move, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { mockProperties } from '../../data/mockData';
import { KENYA_COUNTIES, POPULAR_PLACES } from '../../constants/kenya';

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

import { Property } from '../../types';
import { listingService } from '../../services/listingService';

export const Listings = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const querySearch = searchParams.get('q') || searchParams.get('search') || '';

  const [properties, setProperties] = React.useState<Property[]>([]);
  const [loading, setLoading] = React.useState(true);
  
  const getDefaultStatus = () => {
    if (user?.role === 'renter') return 'rent';
    if (user?.role === 'buyer') return 'sale';
    return 'all';
  };

  const [showDetailedFilters, setShowDetailedFilters] = React.useState(false);
  const [filters, setFilters] = React.useState({
    search: querySearch,
    county: 'all',
    place: 'all',
    type: 'all',
    status: getDefaultStatus(),
    minPrice: '',
    maxPrice: '',
    minSqft: '',
    maxSqft: '',
  });

  React.useEffect(() => {
    if (querySearch) {
      setFilters(prev => ({ ...prev, search: querySearch }));
    }
  }, [querySearch]);

  const fetchListings = async () => {
    setLoading(true);
    const data = await listingService.getListings({
      search: filters.search,
      county: filters.county,
      type: filters.type,
      status: filters.status,
      minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
      maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
      minArea: filters.minSqft ? Number(filters.minSqft) : undefined,
      maxArea: filters.maxSqft ? Number(filters.maxSqft) : undefined,
    });
    setProperties(data);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchListings();
  }, [filters.county, filters.type, filters.status]); // Only re-fetch on major category changes for now, or use a "Apply" button

  // For immediate search/price/sqft updates, we can either debounce or use an Apply button
  // Let's add an Apply button for the detailed filters to prevent too many requests.

  React.useEffect(() => {
    setFilters(prev => ({ ...prev, status: getDefaultStatus() }));
  }, [user?.role]);

  const countyPlaces = filters.county !== 'all' ? POPULAR_PLACES[filters.county] || [] : [];

  const filteredProperties = properties.filter(p => {
    const searchLow = filters.search.toLowerCase();
    const matchesSearch = 
      p.title.toLowerCase().includes(searchLow) || 
      p.neighborhood.toLowerCase().includes(searchLow) || 
      p.location.toLowerCase().includes(searchLow);
    const matchesCounty = filters.county === 'all' || p.location.includes(filters.county);
    const matchesType = filters.type === 'all' || p.type === filters.type;
    const matchesStatus = filters.status === 'all' || p.status === filters.status;
    
    // Client-side fallback or additional filtering
    const matchesPrice = (!filters.minPrice || p.price >= Number(filters.minPrice)) && 
                         (!filters.maxPrice || p.price <= Number(filters.maxPrice));
    const matchesSqft = (!filters.minSqft || p.sqft >= Number(filters.minSqft)) && 
                        (!filters.maxSqft || p.sqft <= Number(filters.maxSqft));

    return matchesSearch && matchesCounty && matchesType && matchesStatus && matchesPrice && matchesSqft;
  });

  return (
    <div className="min-h-screen bg-stone-50 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
            <div>
              <span className="text-brand-accent uppercase tracking-[0.2em] text-[10px] font-bold mb-2 block">Premium Locator</span>
              <h1 className="text-4xl md:text-5xl font-serif leading-tight">Find Your <span className="italic font-light text-brand-accent">Makao</span></h1>
            </div>
            <div className="relative w-full md:w-96 group">
              <input 
                type="text" 
                placeholder="Search properties or builders..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="w-full bg-white border border-stone-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-brand-accent/20 transition-all text-sm"
              />
              <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 items-center mb-6">
            <div 
              onClick={() => setShowDetailedFilters(!showDetailedFilters)}
              className={cn(
                "flex items-center gap-2 border rounded-full px-4 py-2 transition-colors cursor-pointer",
                showDetailedFilters ? "bg-brand-accent border-brand-accent text-white" : "bg-white border-stone-200 hover:border-brand-accent text-stone-900"
              )}
            >
              <SlidersHorizontal size={14} className={showDetailedFilters ? "text-white" : "text-brand-accent"} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Filters</span>
            </div>

            <select 
              value={filters.county}
              onChange={(e) => setFilters({...filters, county: e.target.value, place: 'all'})}
              className="bg-white border border-stone-200 rounded-full px-5 py-2 text-[10px] font-bold uppercase tracking-widest outline-none appearance-none cursor-pointer hover:bg-stone-50"
            >
              <option value="all">All 47 Counties</option>
              {KENYA_COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <select 
              value={filters.place}
              disabled={countyPlaces.length === 0}
              onChange={(e) => setFilters({...filters, place: e.target.value})}
              className="bg-white border border-stone-200 rounded-full px-5 py-2 text-[10px] font-bold uppercase tracking-widest outline-none disabled:opacity-30 appearance-none cursor-pointer"
            >
              <option value="all">Select Place</option>
              {countyPlaces.map(p => <option key={p} value={p}>{p}</option>)}
            </select>

            <select 
              value={filters.type}
              onChange={(e) => setFilters({...filters, type: e.target.value})}
              className="bg-white border border-stone-200 rounded-full px-5 py-2 text-[10px] font-bold uppercase tracking-widest outline-none appearance-none cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="bedsitter">Bedsitters</option>
              <option value="studio">Studios</option>
              <option value="apartment">Apartments</option>
              <option value="townhouse">Townhouses</option>
              <option value="villa">Villas</option>
              <option value="mansion">Mansions</option>
              <option value="penthouse">Penthouses</option>
              <option value="land">Commercial/Land</option>
            </select>

            <div className="flex bg-white p-1 rounded-full border border-stone-200">
              {['all', 'rent', 'sale'].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilters({...filters, status: s})}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all",
                    filters.status === s ? "bg-brand-primary text-white" : "text-stone-400 hover:text-brand-primary"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {showDetailedFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="bg-white border border-stone-200 rounded-3xl p-6 mb-8 overflow-hidden grid grid-cols-1 md:grid-cols-4 gap-6"
            >
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Price Range (KES)</label>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    placeholder="Min" 
                    value={filters.minPrice}
                    onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                    className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-accent/10"
                  />
                  <input 
                    type="number" 
                    placeholder="Max" 
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                    className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-accent/10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Size (Sqft)</label>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    placeholder="Min" 
                    value={filters.minSqft}
                    onChange={(e) => setFilters({...filters, minSqft: e.target.value})}
                    className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-accent/10"
                  />
                  <input 
                    type="number" 
                    placeholder="Max" 
                    value={filters.maxSqft}
                    onChange={(e) => setFilters({...filters, maxSqft: e.target.value})}
                    className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-accent/10"
                  />
                </div>
              </div>
              <div className="md:col-span-2 flex items-end">
                <button 
                  onClick={fetchListings}
                  className="w-full bg-brand-primary text-white rounded-xl py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          )}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="bento-card aspect-[4/5] animate-pulse bg-stone-100" />
            ))
          ) : filteredProperties.length > 0 ? (
            filteredProperties.map((property, idx) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bento-card p-0 overflow-hidden group relative"
              >
                <Link to={`/property/${property.id}`} className="block relative aspect-[4/3] overflow-hidden">
                  <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 bg-brand-accent text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase shadow-lg">
                    {property.status === 'sale' ? 'For Sale' : 'For Rent'}
                  </div>
                </Link>
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-1 group-hover:text-brand-accent transition-colors truncate">{property.title}</h3>
                  <p className="text-stone-500 text-xs flex items-center gap-1 mb-4">
                    <MapPin size={12} className="text-brand-accent" /> {property.neighborhood}, {property.location}
                  </p>
                  <div className="flex items-center gap-4 text-[10px] uppercase font-bold text-stone-400 mb-6 border-y border-stone-50 py-3">
                    <span className="flex items-center gap-1"><Bed size={14} /> {property.beds} Bed</span>
                    <span className="flex items-center gap-1"><Bath size={14} /> {property.baths} Bath</span>
                    <span className="flex items-center gap-1"><Move size={14} /> {property.sqft} sqft</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="font-display font-bold text-xl text-brand-primary">
                      <span className="text-[10px] text-stone-400 mr-1 uppercase">KES</span>
                      {property.price.toLocaleString()}
                    </div>
                    <button 
                      onClick={async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        try {
                          const { data: { user: currentUser } } = await supabase.auth.getUser();
                          if (!currentUser) {
                            alert('Please sign in to save properties.');
                            return;
                          }
                          await supabase
                            .from('saved_properties')
                            .upsert({ user_id: currentUser.id, listing_id: property.id });
                          alert('Property added to favorites!');
                        } catch (err) {
                          console.error(err);
                        }
                      }}
                      className="text-stone-300 hover:text-red-500 p-2 rounded-xl transition-all"
                    >
                      <Heart size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-300">
                <Search size={32} />
              </div>
              <h3 className="text-xl font-bold">No Listings Found</h3>
              <p className="text-stone-400 text-sm mt-2">Try adjusting your filters or check back later.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
