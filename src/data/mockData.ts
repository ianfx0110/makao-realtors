import { Property, Neighborhood } from '../types';

export const neighborhoods: Neighborhood[] = [
  {
    id: 'n1',
    name: 'Kilimani',
    description: 'A vibrant residential and commercial hub known for its trendy cafes, shopping malls, and proximity to the city center.',
    image: 'https://images.unsplash.com/photo-1542662565-7e4b66bae529?auto=format&fit=crop&q=80&w=800',
    avgPrice: 15000000,
    amenities: ['Yaya Centre', 'French School', 'Kilimani Police Station']
  },
  {
    id: 'n2',
    name: 'Westlands',
    description: 'The social heart of Nairobi, offering premium office spaces, luxury hotels, and the best nightlife in the city.',
    image: 'https://images.unsplash.com/photo-1549111056-3eb6dd6012ac?auto=format&fit=crop&q=80&w=800',
    avgPrice: 25000000,
    amenities: ['Sarit Centre', 'Westgate Mall', 'Global Trade Centre']
  },
  {
    id: 'n3',
    name: 'Kapsoya',
    description: 'A serene and rapidly growing residential suburb in Eldoret, favored for its quiet atmosphere and accessibility.',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
    avgPrice: 12000000,
    amenities: ['Rupa\'s Mall', 'Eldoret Hospital', 'Reeves School']
  },
  {
    id: 'n4',
    name: 'Elgon View',
    description: 'The most prestigious residential address in Eldoret, home to elite estates and high-end amenities.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
    avgPrice: 35000000,
    amenities: ['Eldoret Club', 'Hill School', 'Poa Place']
  }
];

export const mockProperties: Property[] = [];
