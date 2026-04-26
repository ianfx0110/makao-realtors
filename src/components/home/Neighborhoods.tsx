import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Neighborhood {
  id: string;
  name: string;
  image_url: string;
  avg_price: number;
}

export const Neighborhoods = () => {
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNeighborhoods = async () => {
      try {
        const { data, error } = await supabase
          .from('neighborhoods')
          .select('id, name, image_url, avg_price')
          .limit(4);
        
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

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <Loader2 className="animate-spin text-brand-accent" size={32} />
      </div>
    );
  }

  if (neighborhoods.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-16 space-y-4">
          <span className="text-xs uppercase tracking-[0.4em] font-medium text-brand-accent">
            Local Heritage
          </span>
          <h2 className="text-4xl md:text-6xl font-serif text-brand-primary">
            Explore <span className="italic">Neighborhoods</span>
          </h2>
          <p className="max-w-2xl mx-auto text-gray-500 font-light">
            Each area in Nairobi has its own rhythm and character. Discover where you truly belong.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {neighborhoods.map((area, idx) => (
            <motion.div
              key={area.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative aspect-[3/4] overflow-hidden bg-brand-primary rounded-[2rem]"
            >
              <img
                src={area.image_url}
                alt={area.name}
                className="w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700"
              />
              <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                <h3 className="text-3xl font-serif mb-2">{area.name}</h3>
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-brand-accent opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                  Discovery Guide
                  <ArrowRight size={14} />
                </div>
                <div className="mt-4 pt-4 border-t border-white/20">
                  <div className="text-[10px] uppercase text-white/50 mb-1">Average Price</div>
                  <div className="text-sm">KES {area.avg_price.toLocaleString()}</div>
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-1 bg-brand-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
