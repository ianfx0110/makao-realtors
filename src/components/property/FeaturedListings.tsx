import React, { useEffect, useState } from 'react';
import { listingService } from '../../services/listingService';
import { Property } from '../../types';
import { PropertyCard } from './PropertyCard';

export const FeaturedListings = () => {
  const [featured, setFeatured] = useState<Property[]>([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      const listings = await listingService.getListings();
      setFeatured(listings.slice(0, 3));
    };
    fetchFeatured();
  }, []);
  
  if (featured.length === 0) {
    return (
      <div className="text-center py-20 text-stone-500">
        No featured properties available at the moment.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {featured.map((property, idx) => (
        <PropertyCard key={property.id} property={property} index={idx} />
      ))}
    </div>
  );
};
