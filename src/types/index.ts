export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  neighborhood: string;
  county?: string;
  type: 'bedsitter' | 'studio' | 'apartment' | 'townhouse' | 'villa' | 'mansion' | 'penthouse' | 'land';
  status: 'sale' | 'rent';
  beds: number;
  baths: number;
  sqft: number;
  images: string[];
  features: string[];
  virtualTourUrl?: string;
  verified?: boolean;
  landlord?: {
    name: string;
    phone: string;
    email: string;
    image: string;
  };
  reviews: Review[];
  createdAt: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Neighborhood {
  id: string;
  name: string;
  description: string;
  image: string;
  avgPrice: number;
  amenities: string[];
}
