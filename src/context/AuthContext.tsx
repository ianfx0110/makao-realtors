import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'renter' | 'landlord' | 'buyer' | 'seller';
  name: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  signIn: (email: string, role: string, name?: string, phone?: string) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('maskani_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const signIn = (email: string, role: any, name?: string, phone?: string) => {
    const newUser: User = { 
      id: Math.random().toString(36).substr(2, 9), 
      email, 
      role, 
      name: name || email.split('@')[0],
      phone
    };
    setUser(newUser);
    localStorage.setItem('maskani_user', JSON.stringify(newUser));
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('maskani_user');
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
