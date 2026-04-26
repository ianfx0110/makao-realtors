import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bed, Bath, Move, Heart, MapPin, ShieldCheck, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Property } from '../../types';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

interface PropertyCardProps {
  property: Property;
  index: number;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, index }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const checkIfSaved = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('saved_properties')
          .select('id')
          .eq('user_id', user.id)
          .eq('listing_id', property.id)
          .single();
        
        if (data) setIsSaved(true);
      } catch (err) {
        // Not found is fine
      }
    };
    checkIfSaved();
  }, [user, property.id]);

  const toggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate('/signin');
      return;
    }

    try {
      setSaving(true);
      if (isSaved) {
        await supabase
          .from('saved_properties')
          .delete()
          .eq('user_id', user.id)
          .eq('listing_id', property.id);
        setIsSaved(false);
      } else {
        await supabase
          .from('saved_properties')
          .insert({ user_id: user.id, listing_id: property.id });
        setIsSaved(true);
      }
    } catch (err) {
      console.error('Error toggling save:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="bento-card group p-0 relative overflow-hidden"
    >
      <Link to={`/property/${property.id}`} className="block relative aspect-[4/3] overflow-hidden">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <div className="bg-brand-accent text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-2xl backdrop-blur-md">
            {property.status === 'sale' ? 'Premium Sale' : 'Premium Rental'}
          </div>
          {property.verified ? (
            <div className="bg-emerald-500 text-white text-[8px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-1 self-start border border-emerald-400/30">
              <ShieldCheck size={10} /> Verified Listing
            </div>
          ) : (
            <div className="bg-amber-500/90 text-white text-[8px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-1 self-start border border-amber-400/30">
              Unverified Listing
            </div>
          )}
        </div>
      </Link>

      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold leading-tight group-hover:text-brand-accent transition-colors truncate">{property.title}</h3>
        </div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-stone-500 text-[10px] flex items-center gap-1">
            <MapPin size={12} className="text-brand-accent" /> {property.neighborhood}, {property.location}
          </p>
          <div className="text-[8px] uppercase tracking-widest font-bold text-stone-400 bg-stone-50 px-2 py-1 rounded border border-stone-100">
             Listed by {property.landlord?.name?.split(' ')[0] || 'Agent'}
          </div>
        </div>

        <div className="flex items-center gap-4 text-[10px] uppercase font-bold text-stone-400 mb-6">
          <span className="flex items-center gap-1"><Bed size={14} /> {property.beds} Bed</span>
          <span className="flex items-center gap-1"><Bath size={14} /> {property.baths} Bath</span>
          <span className="flex items-center gap-1"><Move size={14} /> {property.sqft} sqft</span>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-stone-100">
          <div className="font-display font-bold text-xl text-brand-primary">
            <span className="text-[10px] text-stone-400 mr-1 uppercase">KES</span>
            {property.price.toLocaleString()}
          </div>
          <button 
            onClick={toggleSave}
            disabled={saving}
            className={`p-2 rounded-xl transition-all border ${
              isSaved 
                ? "bg-brand-accent text-white border-brand-accent" 
                : "text-brand-accent border-brand-accent/20 hover:bg-brand-accent hover:text-white"
            }`}
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Heart size={18} fill={isSaved ? "currentColor" : "none"} />}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
