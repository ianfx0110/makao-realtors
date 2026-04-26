import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Home, Search, Heart, User, LayoutDashboard, Menu, X, LogOut, Plus, Settings, ChevronDown, Bell, MessageCircle, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { MakaoLogo } from '../brand/MakaoLogo';

export const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [savedCount, setSavedCount] = React.useState(0);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/listings?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsOpen(false);
    }
  };

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    const fetchSavedCount = async () => {
      if (!user) {
        setSavedCount(0);
        return;
      }
      try {
        const { count, error } = await supabase
          .from('saved_properties')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);
        
        if (error) throw error;
        setSavedCount(count || 0);
      } catch (err) {
        console.error('Error fetching saved count:', err);
      }
    };

    fetchSavedCount();

    // Subscribe to changes in saved_properties
    const channel = supabase
      .channel(`saved_properties_count_${user?.id}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'saved_properties', 
        filter: `user_id=eq.${user?.id}` 
      }, () => {
        fetchSavedCount();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const navItems = user ? [
    { name: 'Home', path: user.role === 'admin' ? '/admin/dashboard' : `/${user.role}/home`, icon: Home },
    { name: 'Listings', path: user.role === 'admin' ? '/admin/listings' : `/${user.role}/listings`, icon: Search },
    { name: 'Favorites', path: '/favorites', icon: Heart, badge: savedCount },
    { name: 'Blog', path: '/blog', icon: BookOpen },
    { name: 'Notifications', path: user.role === 'admin' ? '/admin/broadcast' : `/${user.role}/notifications`, icon: Bell },
    { name: 'Support', path: user.role === 'admin' ? '/admin/support' : `/${user.role}/support`, icon: MessageCircle },
    { name: 'Settings', path: '/settings', icon: Settings },
  ] : [
    { name: 'Explore', path: '/', icon: Home },
    { name: 'Listings', path: '/listings', icon: Search },
    { name: 'Blog', path: '/blog', icon: BookOpen },
    { name: 'Services', path: '/services', icon: LayoutDashboard },
    { name: 'About', path: '/about', icon: LayoutDashboard },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled ? "bg-white/80 backdrop-blur-md py-3 shadow-sm border-b border-stone-200" : "bg-transparent py-4"
    )}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center gap-8">
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <MakaoLogo className="scale-75 origin-left" />
        </Link>

        {/* Global Search Bar */}
        <div className="hidden lg:flex flex-1 max-w-md">
          <form onSubmit={handleSearch} className="relative w-full group">
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search neighborhood (e.g. Westlands)..."
              className="w-full bg-stone-100 hover:bg-stone-200/50 focus:bg-white border border-stone-200 focus:border-brand-accent/30 rounded-full py-2.5 pl-11 pr-4 text-xs font-medium text-stone-600 focus:outline-none focus:ring-4 focus:ring-brand-accent/5 transition-all outline-none"
            />
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-brand-accent transition-colors" />
          </form>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          <div className="flex items-center gap-6 text-xs font-semibold uppercase tracking-widest text-stone-500">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => cn(
                  "hover:text-brand-primary transition-colors flex items-center gap-1.5",
                  isActive && "text-brand-accent"
                )}
              >
                {item.name}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="flex items-center justify-center bg-brand-accent text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px]">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <a 
              href="https://wa.me/254115481162?text=Hello%20Makao%20Realtors%20Support%2C%20I%20have%20an%20inquiry." 
              target="_blank" 
              rel="noreferrer"
              className="hidden lg:flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              <MessageCircle size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Support</span>
            </a>
            {user ? (
              <div className="flex items-center gap-4 relative">
                {(user.role === 'landlord' || user.role === 'seller' || user.role === 'admin') && (
                  <Link to="/create-listing" className="hidden lg:flex items-center gap-2 text-[10px] items-center gap-2 uppercase font-bold tracking-widest text-brand-accent hover:text-brand-primary transition-colors pr-4 border-r border-stone-200">
                    <Plus size={14} /> Create Listing
                  </Link>
                )}
                
                <div className="relative">
                  <button 
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-stone-200 hover:border-brand-accent hover:shadow-sm transition-all"
                  >
                    <div className="w-6 h-6 rounded-full bg-brand-accent text-white flex items-center justify-center text-[10px] font-bold">
                      {user.name[0].toUpperCase()}
                    </div>
                    <div className="text-left hidden lg:block">
                      <div className="text-[10px] font-bold leading-tight">{user.name.split(' ')[0]}</div>
                      <div className="text-[8px] uppercase tracking-tighter text-stone-400 font-bold">{user.role}</div>
                    </div>
                    <ChevronDown size={14} className={cn("text-stone-400 transition-transform", userMenuOpen && "rotate-180")} />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-stone-100 py-2 overflow-hidden ring-1 ring-black/5"
                      >
                        <div className="px-4 py-3 border-b border-stone-50 mb-2">
                           <div className="text-xs font-bold text-brand-primary">{user.name}</div>
                           <div className="text-[10px] uppercase font-bold text-stone-400 tracking-widest">{user.role}</div>
                        </div>
                        
                        <Link to={user.role === 'admin' ? '/admin/dashboard' : `/${user.role}/home`} onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2 text-xs font-bold uppercase tracking-wider text-stone-500 hover:bg-stone-50 hover:text-brand-accent transition-colors">
                          <Home size={14} /> Home
                        </Link>
                        <Link to={user.role === 'admin' ? '/admin/listings' : `/${user.role}/listings`} onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2 text-xs font-bold uppercase tracking-wider text-stone-500 hover:bg-stone-50 hover:text-brand-accent transition-colors">
                          <Search size={14} /> Listings
                        </Link>
                        <Link to={user.role === 'admin' ? '/admin/broadcast' : `/${user.role}/notifications`} onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2 text-xs font-bold uppercase tracking-wider text-stone-500 hover:bg-stone-50 hover:text-brand-accent transition-colors">
                          <Bell size={14} /> Notifications
                        </Link>
                        <Link to={user.role === 'admin' ? '/admin/support' : `/${user.role}/support`} onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2 text-xs font-bold uppercase tracking-wider text-stone-500 hover:bg-stone-50 hover:text-brand-accent transition-colors">
                          <MessageCircle size={14} /> Support
                        </Link>
                        <Link to="/settings" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2 text-xs font-bold uppercase tracking-wider text-stone-500 hover:bg-stone-50 hover:text-brand-accent transition-colors">
                          <Settings size={14} /> Settings
                        </Link>

                        {user.role === 'admin' && (
                          <>
                            <div className="h-px bg-stone-50 my-1" />
                            <Link to="/admin/users" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2 text-xs font-bold uppercase tracking-wider text-stone-400 hover:bg-stone-50 hover:text-brand-accent transition-colors">
                              <User size={14} /> User Management
                            </Link>
                            <Link to="/admin/neighborhoods" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2 text-xs font-bold uppercase tracking-wider text-stone-400 hover:bg-stone-50 hover:text-brand-accent transition-colors">
                              <Search size={14} /> Neighborhoods
                            </Link>
                          </>
                        )}
                        
                        <div className="h-px bg-stone-50 my-2" />
                        
                        <button 
                          onClick={() => { signOut(); navigate('/'); setUserMenuOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-xs font-bold uppercase tracking-wider text-red-500 hover:bg-red-50 transition-colors font-bold"
                        >
                          <LogOut size={14} /> Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/signin" className="text-xs font-semibold uppercase tracking-widest text-stone-500 hover:text-brand-primary">Sign In</Link>
                <Link 
                  to="/signup" 
                  className="bg-brand-primary text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-brand-accent transition-colors"
                >
                  Join Now
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-stone-200 overflow-hidden"
          >
            <div className="p-6 flex flex-col space-y-6">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative w-full group">
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Neighborhood (e.g. Westlands)..."
                  className="w-full bg-stone-100 border border-stone-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium text-stone-600 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 transition-all"
                />
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
              </form>

              {user ? (
                <>
                  <div className="flex items-center gap-3 p-4 bg-stone-50 rounded-2xl mb-4">
                    <div className="w-12 h-12 rounded-full bg-brand-accent text-white flex items-center justify-center font-bold text-lg">
                      {user.name[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-brand-primary leading-tight">{user.name}</div>
                      <div className="text-[10px] uppercase font-bold text-stone-400 tracking-widest leading-tight">{user.role}</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-1">
                    <Link to={user.role === 'admin' ? '/admin/dashboard' : `/${user.role}/home`} onClick={() => setIsOpen(false)} className="flex items-center justify-between p-3 text-xs font-bold uppercase tracking-widest text-stone-600 hover:text-brand-accent">
                      <div className="flex items-center gap-3">
                        <Home size={18} /> Home
                      </div>
                    </Link>
                    <Link to={user.role === 'admin' ? '/admin/listings' : `/${user.role}/listings`} onClick={() => setIsOpen(false)} className="flex items-center justify-between p-3 text-xs font-bold uppercase tracking-widest text-stone-600 hover:text-brand-accent">
                      <div className="flex items-center gap-3">
                        <Search size={18} /> Listings
                      </div>
                    </Link>
                    <Link to="/favorites" onClick={() => setIsOpen(false)} className="flex items-center justify-between p-3 text-xs font-bold uppercase tracking-widest text-stone-600 hover:text-brand-accent">
                      <div className="flex items-center gap-3">
                        <Heart size={18} /> Favorites
                      </div>
                      {savedCount > 0 && (
                        <span className="bg-brand-accent text-white text-[10px] flex items-center justify-center min-w-[20px] h-5 rounded-full">
                          {savedCount}
                        </span>
                      )}
                    </Link>
                    <Link to={user.role === 'admin' ? '/admin/broadcast' : `/${user.role}/notifications`} onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 text-xs font-bold uppercase tracking-widest text-stone-600 hover:text-brand-accent">
                      <Bell size={18} /> Notifications
                    </Link>
                    <Link to={user.role === 'admin' ? '/admin/support' : `/${user.role}/support`} onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 text-xs font-bold uppercase tracking-widest text-stone-600 hover:text-brand-accent">
                      <MessageCircle size={18} /> Support
                    </Link>
                    <Link to="/settings" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 text-xs font-bold uppercase tracking-widest text-stone-600 hover:text-brand-accent">
                      <Settings size={18} /> Settings
                    </Link>

                    {user.role === 'admin' && (
                      <div className="flex flex-col space-y-1 pt-2">
                        <Link to="/admin/users" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 text-xs font-bold uppercase tracking-widest text-stone-400">
                          <User size={18} /> Users
                        </Link>
                        <Link to="/admin/neighborhoods" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 text-xs font-bold uppercase tracking-widest text-stone-400">
                          <Search size={18} /> Neighborhoods
                        </Link>
                      </div>
                    )}
                    
                    <div className="h-px bg-stone-100 my-2" />
                    
                    <button 
                      onClick={() => { signOut(); navigate('/'); setIsOpen(false); }}
                      className="flex items-center gap-3 p-3 text-xs font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={18} /> Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col space-y-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className="text-xs font-bold uppercase tracking-widest text-stone-500 hover:text-brand-primary"
                    >
                      {item.name}
                    </Link>
                  ))}
                  <Link to="/signup" onClick={() => setIsOpen(false)} className="bg-brand-primary text-white p-4 text-center rounded-2xl text-xs font-bold uppercase tracking-widest shadow-lg">Join Makao Realtors</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
