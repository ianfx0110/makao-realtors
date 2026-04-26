import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PropertyCard } from '../property/PropertyCard';
import { listingService } from '../../services/listingService';
import { Property } from '../../types';

export const FeaturedListings = () => {
  const [properties, setProperties] = React.useState<Property[]>([]);

  React.useEffect(() => {
    const fetch = async () => {
      const data = await listingService.getListings();
      setProperties(data.slice(0, 3));
    };
    fetch();
  }, []);

  return (
    <section className="py-24 bg-brand-secondary">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-[0.4em] font-medium text-brand-accent">
              Curated Selection
            </span>
            <h2 className="text-4xl md:text-6xl font-serif text-brand-primary">
              Featured <span className="italic">Exclusives</span>
            </h2>
          </div>
          <Link 
            to="/listings" 
            className="group flex items-center gap-2 text-sm uppercase tracking-widest font-bold text-brand-primary hover:text-brand-accent transition-colors"
          >
            View All Properties
            <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        {properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property, idx) => (
              <PropertyCard key={property.id} property={property} index={idx} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-stone-50 rounded-3xl border border-stone-100">
            <p className="text-stone-400 font-display italic">New exclusives coming soon...</p>
          </div>
        )}
      </div>
    </section>
  );
};
