import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  email: string;
  role: 'admin' | 'renter' | 'landlord' | 'buyer' | 'seller';
  name: string;
  phone?: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (sessionUser: SupabaseUser) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', sessionUser.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        // Fallback to basic user info if profile query fails
        setUser({
          id: sessionUser.id,
          email: sessionUser.email || '',
          role: 'renter', // Default role
          name: sessionUser.email?.split('@')[0] || 'User',
        });
      } else {
        setUser(data as UserProfile);
      }
    } catch (err) {
      console.error('Unexpected error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check active sessions and sets up the observer
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        await fetchProfile(session.user);
      } else {
        setLoading(false);
      }

      // Test Connection (as per guidelines for full-stack/supabase)
      try {
        const { error } = await supabase.from('neighborhoods').select('count', { count: 'exact', head: true });
        if (error) console.warn('Supabase initial connection check:', error.message);
      } catch (err) {
        console.error('Connection test failed:', err);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchProfile(session.user);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const refreshProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await fetchProfile(session.user);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
