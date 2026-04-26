import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Map, Plus, Edit2, Trash2, X, Save, Loader2, Image as ImageIcon } from 'lucide-react';
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

export const NeighborhoodManagement = () => {
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: '',
    avg_price: 0,
    amenities: '',
    safety_rating: 5,
    commute_score: 80
  });

  const fetchNeighborhoods = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('neighborhoods').select('*').order('name');
    if (data) setNeighborhoods(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchNeighborhoods();
  }, []);

  const handleSave = async () => {
    const payload = {
      ...formData,
      amenities: formData.amenities.split(',').map(s => s.trim()).filter(s => s !== '')
    };

    if (editingId) {
      const { error } = await supabase.from('neighborhoods').update(payload).eq('id', editingId);
      if (!error) setIsModalOpen(false);
    } else {
      const { error } = await supabase.from('neighborhoods').insert([payload]);
      if (!error) setIsModalOpen(false);
    }
    fetchNeighborhoods();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this neighborhood?')) {
      const { error } = await supabase.from('neighborhoods').delete().eq('id', id);
      fetchNeighborhoods();
    }
  };

  const openEdit = (n: Neighborhood) => {
    setEditingId(n.id);
    setFormData({
      name: n.name,
      description: n.description,
      image_url: n.image_url,
      avg_price: n.avg_price,
      amenities: n.amenities.join(', '),
      safety_rating: n.safety_rating || 5,
      commute_score: n.commute_score || 80
    });
    setIsModalOpen(true);
  };

  const openAdd = () => {
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      image_url: '',
      avg_price: 0,
      amenities: '',
      safety_rating: 5,
      commute_score: 80
    });
    setIsModalOpen(true);
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-serif text-brand-primary mb-2">Neighborhood Guides</h1>
          <p className="text-stone-500">Manage the areas featured on the platform.</p>
        </div>
        <button 
          onClick={openAdd}
          className="flex items-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-full font-bold uppercase text-[10px] tracking-widest hover:bg-brand-accent transition-all"
        >
          <Plus size={16} /> Add Neighborhood
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-brand-accent" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {neighborhoods.map((n) => (
            <motion.div 
              layout
              key={n.id} 
              className="bg-white border border-stone-100 rounded-[2.5rem] overflow-hidden shadow-sm group"
            >
              <div className="h-48 relative overflow-hidden">
                {n.image_url ? (
                  <img src={n.image_url} alt={n.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full bg-stone-100 flex items-center justify-center text-stone-300">
                    <ImageIcon size={48} />
                  </div>
                )}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button 
                    onClick={() => openEdit(n)}
                    className="p-2 bg-white/90 backdrop-blur rounded-full text-brand-primary hover:bg-white shadow-sm"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(n.id)}
                    className="p-2 bg-white/90 backdrop-blur rounded-full text-red-500 hover:bg-white shadow-sm"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-xl font-bold mb-2">{n.name}</h3>
                <p className="text-sm text-stone-500 mb-4 line-clamp-2">{n.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {n.amenities.slice(0, 3).map((a, i) => (
                    <span key={i} className="px-3 py-1 bg-stone-50 text-[10px] font-bold uppercase tracking-widest text-stone-400 rounded-full">{a}</span>
                  ))}
                  {n.amenities.length > 3 && <span className="text-[10px] font-bold text-stone-300 py-1">+{n.amenities.length - 3} more</span>}
                </div>
                <div className="flex gap-4 pt-4 border-t border-stone-50">
                  <div>
                    <div className="text-[8px] uppercase font-bold tracking-widest text-stone-300">Safety</div>
                    <div className="text-xs font-bold text-stone-600">{n.safety_rating || 5}/5</div>
                  </div>
                  <div>
                    <div className="text-[8px] uppercase font-bold tracking-widest text-stone-300">Commute</div>
                    <div className="text-xs font-bold text-stone-600">{n.commute_score || 80}/100</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[3rem] p-10 overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-serif text-brand-primary">{editingId ? 'Edit' : 'Add'} Neighborhood</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-stone-50 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400 block mb-2">Name</label>
                    <input 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 outline-none focus:border-brand-accent transition-all" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400 block mb-2">Avg. Price (KES)</label>
                    <input 
                      type="number"
                      value={formData.avg_price}
                      onChange={(e) => setFormData({...formData, avg_price: Number(e.target.value)})}
                      className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 outline-none focus:border-brand-accent transition-all" 
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400 block mb-2">Description</label>
                  <textarea 
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 outline-none focus:border-brand-accent transition-all" 
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400 block mb-2">Image URL</label>
                  <input 
                    value={formData.image_url}
                    onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                    placeholder="https://..."
                    className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 outline-none focus:border-brand-accent transition-all" 
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400 block mb-2">Amenities (Comma separated)</label>
                  <input 
                    value={formData.amenities}
                    onChange={(e) => setFormData({...formData, amenities: e.target.value})}
                    placeholder="Schools, Malls, Parks..."
                    className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 outline-none focus:border-brand-accent transition-all" 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400 block mb-2">Safety Rating (1-5)</label>
                    <input 
                      type="number"
                      min="1"
                      max="5"
                      value={formData.safety_rating}
                      onChange={(e) => setFormData({...formData, safety_rating: Number(e.target.value)})}
                      className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 outline-none focus:border-brand-accent transition-all" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400 block mb-2">Commute Score (0-100)</label>
                    <input 
                      type="number"
                      min="0"
                      max="100"
                      value={formData.commute_score}
                      onChange={(e) => setFormData({...formData, commute_score: Number(e.target.value)})}
                      className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 outline-none focus:border-brand-accent transition-all" 
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={handleSave}
                    className="w-full bg-brand-primary text-white py-4 rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:bg-brand-accent transition-all flex items-center justify-center gap-2"
                  >
                    <Save size={16} /> Save Neighborhood
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
