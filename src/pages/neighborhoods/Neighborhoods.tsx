import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Search as SearchIcon, ChevronRight, TrendingUp, Shield, Users, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

interface Neighborhood {
  id: string;
  name: string;
  description: string;
  image_url: string;
  stats?: string;
  tags?: string[];
}

export const Neighborhoods = () => {
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchNeighborhoods = async () => {
      try {
        const { data, error } = await supabase
          .from('neighborhoods')
          .select('*')
          .order('name');
        
        if (error) throw error;
        if (data) setNeighborhoods(data);
      } catch (err) {
        console.error('Error fetching neighborhoods:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNeighborhoods();
  }, []);

  const filteredNeighborhoods = neighborhoods.filter(n => 
    n.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pt-32 pb-20 min-h-screen bg-brand-secondary">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:row justify-between items-start md:items-end gap-12 mb-20">
          <div className="max-w-2xl">
            <span className="text-brand-accent uppercase tracking-[0.25em] text-[10px] font-bold mb-4 block">Regional Intelligence</span>
            <h1 className="text-5xl md:text-6xl font-serif text-brand-primary mb-6 leading-tight">Explore the Best <span className="text-brand-accent italic">Neighborhoods</span></h1>
            <p className="text-stone-500 text-lg font-light leading-relaxed">
              From the bustling streets of Westlands to the serene gardens of Elgon View, 
              find the perfect location that matches your lifestyle and investment goals.
            </p>
          </div>
          
          <div className="relative w-full md:w-96">
            <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300" size={20} />
            <input 
              type="text" 
              placeholder="Search areas, counties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/50 border border-stone-200 rounded-[2rem] py-6 pl-16 pr-8 focus:ring-4 focus:ring-brand-accent/5 outline-none transition-all placeholder:text-stone-300 font-light"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-brand-accent" size={32} />
          </div>
        ) : filteredNeighborhoods.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredNeighborhoods.map((n, i) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="h-[400px] rounded-[3rem] overflow-hidden relative mb-8">
                  <img 
                    src={n.image_url} 
                    alt={n.name} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                  
                  {n.stats && (
                    <div className="absolute top-8 right-8 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2">
                      <TrendingUp size={14} className="text-white" />
                      <span className="text-white text-[10px] font-bold uppercase tracking-widest leading-none mt-0.5">{n.stats}</span>
                    </div>
                  )}

                  <div className="absolute bottom-10 left-10 right-10">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(n.tags || ['Premium', 'Verified']).map(tag => (
                        <span key={tag} className="text-[8px] uppercase tracking-widest font-bold text-brand-accent bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-2xl font-serif text-white mb-2">{n.name}</h3>
                    <div className="flex items-center gap-2 group/btn">
                      <span className="text-white/60 text-[10px] uppercase font-bold tracking-[0.2em]">Explore Area</span>
                      <ChevronRight size={14} className="text-brand-accent transform group-hover/btn:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
                <p className="text-stone-500 font-light px-4">{n.description}</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-[3.5rem] border border-stone-100 shadow-sm">
            <MapPin size={48} className="text-stone-200 mx-auto mb-6" />
            <h2 className="text-2xl font-serif text-brand-primary mb-2">No areas found</h2>
            <p className="text-stone-400 font-light">We are expanding our reach. New neighborhood guides are coming soon.</p>
          </div>
        )}

        <div className="mt-32 bg-white rounded-[3.5rem] p-16 border border-stone-100 shadow-sm relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
            <div>
              <h2 className="text-4xl font-serif text-brand-primary mb-6">Can't decide on a <span className="text-brand-accent">Location?</span></h2>
              <p className="text-stone-500 font-light mb-10 leading-relaxed">
                Connect with our neighborhood specialists who have lived and worked in these areas 
                for decades. Get insider knowledge on schools, traffic patterns, and future developments.
              </p>
              <div className="flex flex-col sm:row gap-4">
                <button className="bg-brand-primary text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-brand-accent transition-colors shadow-xl">
                  Talk to a Specialist
                </button>
                <Link to="/services" className="bg-stone-50 text-stone-600 px-8 py-4 rounded-full font-bold uppercase tracking-widest text-[10px] border border-stone-100 hover:bg-stone-100 transition-colors text-center">
                  View Localization Services
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: Shield, title: 'Safety Audits', desc: 'Detailed crime & security data' },
                { icon: Users, title: 'Demographics', desc: 'Know your future neighbors' },
                { icon: MapPin, title: 'Walkability', desc: 'Proximity to daily essentials' },
                { icon: TrendingUp, title: 'Appreciation', desc: '5-year value growth analysis' }
              ].map((item, i) => (
                <div key={i} className="bg-stone-50 p-8 rounded-[2rem] border border-stone-100/50">
                  <item.icon size={24} className="text-brand-accent mb-6" />
                  <h4 className="font-bold text-brand-primary text-sm mb-2">{item.title}</h4>
                  <p className="text-xs text-stone-400 leading-relaxed font-light">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
