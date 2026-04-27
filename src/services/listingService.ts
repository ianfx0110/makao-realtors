import { supabase } from '../lib/supabase';
import { Property } from '../types';
import { mockProperties } from '../data/mockData';

export interface ListingFilters {
  search?: string;
  county?: string;
  type?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
}

export const listingService = {
  async getListings(filters?: ListingFilters): Promise<Property[]> {
    try {
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        return [];
      }

      let query = supabase
        .from('listings')
        .select(`
          *,
          landlord:user_profiles!listings_owner_id_fkey (
            name,
            phone,
            email,
            image:avatar_url
          ),
          property_reviews:reviews (
            id,
            rating,
            comment,
            date:created_at,
            reviewer:user_profiles (
              name
            )
          )
        `);

      if (filters) {
        if (filters.search) {
          query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,neighborhood.ilike.%${filters.search}%`);
        }
        if (filters.county && filters.county !== 'all') {
          query = query.eq('location', filters.county);
        }
        if (filters.type && filters.type !== 'all') {
          query = query.eq('type', filters.type);
        }
        if (filters.status && filters.status !== 'all') {
          query = query.eq('status', filters.status);
        }
        if (filters.minPrice) {
          query = query.gte('price', filters.minPrice);
        }
        if (filters.maxPrice) {
          query = query.lte('price', filters.maxPrice);
        }
        if (filters.minArea) {
          query = query.gte('area', filters.minArea);
        }
        if (filters.maxArea) {
          query = query.lte('area', filters.maxArea);
        }
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      
      if (!data || data.length === 0) {
        return [];
      }

      // Map snake_case to camelCase and handle nested data
      return data.map(item => ({
        ...item,
        sqft: item.area,
        virtualTourUrl: item.virtual_tour_url,
        createdAt: item.created_at,
        landlord: item.landlord || { name: 'Unknown', phone: 'N/A', email: 'N/A', image: '' },
        reviews: (item.property_reviews || []).map((r: any) => ({
          id: r.id,
          userName: r.reviewer?.name || 'Anonymous',
          rating: r.rating,
          comment: r.comment,
          date: new Date(r.date).toLocaleDateString()
        }))
      })) as Property[];
    } catch (error) {
      console.error('Error fetching listings:', error);
      return [];
    }
  },

  async getListingById(id: string): Promise<Property | null> {
    try {
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        return null;
      }

      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          landlord:user_profiles!listings_owner_id_fkey (
            name,
            phone,
            email,
            image:avatar_url
          ),
          property_reviews:reviews (
            id,
            rating,
            comment,
            date:created_at,
            reviewer:user_profiles (
              name
            )
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return null;

      return {
        ...data,
        sqft: data.area,
        virtualTourUrl: data.virtual_tour_url,
        createdAt: data.created_at,
        landlord: data.landlord || { name: 'Unknown', phone: 'N/A', email: 'N/A', image: '' },
        reviews: (data.property_reviews || []).map((r: any) => ({
          id: r.id,
          userName: r.reviewer?.name || 'Anonymous',
          rating: r.rating,
          comment: r.comment,
          date: new Date(r.date).toLocaleDateString()
        }))
      } as Property;
    } catch (error) {
      console.error('Error fetching listing:', error);
      return null;
    }
  },

  async recordView(listingId: string): Promise<void> {
    try {
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) return;
      
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from('listing_views').insert({
        listing_id: listingId,
        viewer_id: user?.id || null
      });
    } catch (error) {
      console.error('Error recording view:', error);
    }
  },

  async createListing(property: Omit<Property, 'id' | 'createdAt' | 'reviews'>): Promise<Property | null> {
    try {
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        console.warn('Real database not connected. Listing would be lost on refresh.');
        return { ...property, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString(), reviews: [] } as Property;
      }

      const listingData = {
        title: property.title,
        description: property.description,
        location: property.location,
        neighborhood: property.neighborhood,
        county: property.county || property.location,
        price: property.price,
        type: property.type,
        status: property.status,
        beds: property.beds,
        baths: property.baths,
        area: property.sqft,
        floor_level: (property as any).floor_level,
        furnished: (property as any).furnished,
        images: property.images,
        features: property.features,
        virtual_tour_url: property.virtualTourUrl,
        owner_id: (await supabase.auth.getUser()).data.user?.id,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('listings')
        .insert([listingData])
        .select()
        .single();

      if (error) throw error;
      
      return {
        ...data,
        sqft: data.area,
        virtualTourUrl: data.virtual_tour_url,
        createdAt: data.created_at
      } as Property;
    } catch (error) {
      console.error('Error creating listing:', error);
      throw error;
    }
  }
};
