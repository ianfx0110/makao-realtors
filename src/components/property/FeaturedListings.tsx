import React from 'react';
import { mockProperties } from '../../data/mockData';
import { PropertyCard } from './PropertyCard';

export const FeaturedListings = () => {
  const featured = mockProperties.slice(0, 3);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {featured.map((property, idx) => (
        <PropertyCard key={property.id} property={property} index={idx} />
      ))}
    </div>
  );
};
