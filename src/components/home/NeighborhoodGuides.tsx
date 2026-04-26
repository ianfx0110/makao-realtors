import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Info, ShieldCheck, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Neighborhood {
  id: string;
  name: string;
  description: string;
  image_url: string;
  avg_price: number;
  amenities: string[];
  safety_rating?: number;
  commute_score?: number;
}

export const NeighborhoodGuides = () => {
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNeighborhoods = async () => {
      const { data } = await supabase.from('neighborhoods').select('*').order('name');
      if (data) setNeighborhoods(data);
      setLoading(false);
    };
    fetchNeighborhoods();
  }, []);

  if (loading) {
    return (
      <div className="pt-40 pb-20 flex justify-center">
        <Loader2 className="animate-spin text-brand-accent" size={32} />
      </div>
    );
  }

  if (neighborhoods.length === 0) {
    return (
      <div className="pt-24 min-h-screen bg-brand-secondary text-stone-900 flex flex-col items-center justify-center p-6 text-center">
        <MapPin size={48} className="text-brand-accent mb-6" />
        <h2 className="text-2xl font-serif text-brand-primary mb-4">Neighborhood Guides Coming Soon</h2>
        <p className="text-stone-500 font-light max-w-md">
          Our team is currently curating professional insights for Kenya's premium residential areas. Check back soon for in-depth profiles.
        </p>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-brand-secondary text-stone-900">
      <section className="py-20 bg-brand-primary text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-accent/10 -skew-x-12 translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6 max-w-2xl"
          >
            <span className="text-xs uppercase tracking-[0.4em] font-medium text-brand-accent mb-2 block">Curated Living</span>
            <h1 className="text-5xl md:text-7xl font-serif">Neighborhood <span className="italic">Guides</span></h1>
            <p className="text-xl text-white/60 font-light leading-relaxed">
              In-depth insights into Kenya's most sought-after residential and commercial areas to help you find your perfect match.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="space-y-32">
            {neighborhoods.map((area, idx) => (
              <motion.div
                key={area.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-16 items-center`}
              >
                <div className="lg:w-1/2 relative group">
                  <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-brand-accent z-0" />
                  <div className="relative z-10 aspect-[4/3] overflow-hidden shadow-2xl">
                    <img 
                      src={area.image_url} 
                      alt={area.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="absolute -bottom-8 -right-8 bg-brand-accent text-brand-primary p-8 shadow-xl hidden md:block">
                    <div className="text-[10px] uppercase tracking-widest font-bold mb-2 text-brand-primary/80">Avg. Entry Price</div>
                    <div className="text-2xl font-serif">KES {area.avg_price.toLocaleString()}</div>
                  </div>
                </div>

                <div className="lg:w-1/2 space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-px bg-brand-accent" />
                      <span className="text-xs uppercase tracking-[0.2em] font-bold text-stone-400">Neighborhood Profile</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <h2 className="text-4xl md:text-6xl font-serif text-brand-primary">{area.name}</h2>
                      <div className="flex gap-4 pb-2">
                         <div className="text-center">
                            <div className="text-[8px] uppercase font-bold text-stone-300">Safety</div>
                            <div className="text-sm font-bold text-brand-accent">{area.safety_rating || 5}/5</div>
                         </div>
                         <div className="text-center">
                            <div className="text-[8px] uppercase font-bold text-stone-300">Commute</div>
                            <div className="text-sm font-bold text-brand-accent">{area.commute_score || 80}/100</div>
                         </div>
                      </div>
                    </div>
                    <p className="text-lg text-stone-500 font-light leading-relaxed italic">"{area.description}"</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 font-serif text-xl">
                        <Info size={20} className="text-brand-accent" />
                        Makao Insight
                      </div>
                      <p className="text-sm text-gray-500 font-light">
                        Our platform analytics show high demand in {area.name} for premium houses with reliable amenities and infrastructure.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 font-serif text-xl">
                        <ShieldCheck size={20} className="text-brand-accent" />
                        Verified Status
                      </div>
                      <p className="text-sm text-gray-500 font-light">
                        Every property listed in {area.name} on Makao Realtors undergoes a rigorous authentication protocol.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-400 flex items-center gap-2">
                       <MapPin size={12} className="text-brand-accent" /> Local Hotspots
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {area.amenities.map((item, i) => (
                        <span key={i} className="px-4 py-2 bg-white border border-gray-100 text-xs text-brand-primary font-medium hover:border-brand-accent transition-colors">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button className="px-8 py-4 bg-brand-primary text-white text-[10px] uppercase tracking-widest font-bold hover:bg-brand-accent transition-colors flex items-center gap-2 group">
                    View Listings in {area.name}
                    <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                      <MapPin size={14} />
                    </motion.div>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
