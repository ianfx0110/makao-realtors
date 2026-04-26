import { supabase } from '../lib/supabase';
import { Property } from '../types';
import { mockProperties } from '../data/mockData';

export const listingService = {
  async getListings(): Promise<Property[]> {
    try {
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        return mockProperties;
      }

      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      if (!data || data.length === 0) {
        return mockProperties;
      }

      // Map snake_case to camelCase
      return data.map(item => ({
        ...item,
        sqft: item.area,
        virtualTourUrl: item.virtual_tour_url,
        createdAt: item.created_at
      })) as Property[];
    } catch (error) {
      console.error('Error fetching listings:', error);
      return mockProperties;
    }
  },

  async getListingById(id: string): Promise<Property | null> {
    try {
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        return mockProperties.find(p => p.id === id) || null;
      }

      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return null;

      return {
        ...data,
        sqft: data.area,
        virtualTourUrl: data.virtual_tour_url,
        createdAt: data.created_at
      } as Property;
    } catch (error) {
      console.error('Error fetching listing:', error);
      return mockProperties.find(p => p.id === id) || null;
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
