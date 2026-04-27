import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, Video, User, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export const RealEstateConsult = () => {
  const [formData, setFormData] = useState({
    expert_type: 'legal',
    scheduled_at: '',
    topic: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('Please sign in to book a consultation.');
        return;
      }

      const { error } = await supabase.from('consultations').insert({
        user_id: user.id,
        expert_type: formData.expert_type,
        scheduled_at: formData.scheduled_at,
        topic: formData.topic,
        status: 'pending'
      });

      if (error) throw error;
      setSuccess(true);
    } catch (err: any) {
      console.error('Consultation error:', err);
      alert(err.message || 'Failed to book consultation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="pt-32 px-6 max-w-lg mx-auto text-center">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bento-card space-y-6 py-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
            <CheckCircle size={40} />
          </div>
          <h1 className="text-3xl font-display">Booking Confirmed</h1>
          <p className="text-stone-500">Your consultation has been requested. We will send you a meeting link once an advisor is assigned.</p>
          <button onClick={() => setSuccess(false)} className="btn-pill bg-brand-primary text-white">Book Another Session</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 mb-20">
      <div className="space-y-6">
        <h1 className="text-5xl font-display">Expert <span className="text-brand-accent italic">Consultations</span></h1>
        <p className="text-xl text-stone-500 max-w-md">Navigate the Kenyan real estate market with confidence. Book sessions with legal, financial, and market experts.</p>
        
        <div className="space-y-4 pt-6">
          {[
            { icon: <Calendar />, title: "Flexible Scheduling", desc: "Choose a time that works best for you." },
            { icon: <Video />, title: "Remote Sessions", desc: "Join via Google Meet or Zoom from anywhere." },
            { icon: <CheckCircle />, title: "Certified Experts", desc: "All our advisors are vetted and licensed professionals." }
          ].map((item, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="w-10 h-10 bg-brand-secondary rounded-xl flex items-center justify-center text-brand-accent">
                {item.icon}
              </div>
              <div>
                <h3 className="font-bold text-stone-900">{item.title}</h3>
                <p className="text-stone-500 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bento-card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400 block mb-3">Advisor Type</label>
            <div className="grid grid-cols-3 gap-3">
              {['legal', 'financial', 'real_estate'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({...formData, expert_type: type})}
                  className={`py-3 px-2 rounded-xl text-[10px] uppercase font-bold border transition-all ${
                    formData.expert_type === type ? 'bg-brand-primary text-white border-brand-primary' : 'bg-white border-stone-200 text-stone-600 hover:border-brand-accent'
                  }`}
                >
                  {type.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400 block mb-3">Date & Time</label>
            <input
              type="datetime-local"
              required
              value={formData.scheduled_at}
              onChange={(e) => setFormData({...formData, scheduled_at: e.target.value})}
              className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand-accent/10"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400 block mb-3">Consultation Topic</label>
            <textarea
              required
              placeholder="Briefly describe what you'd like to discuss..."
              value={formData.topic}
              onChange={(e) => setFormData({...formData, topic: e.target.value})}
              className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand-accent/10 h-32"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-brand-accent text-white font-bold uppercase text-xs tracking-widest rounded-xl hover:bg-brand-primary transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Processing...' : 'Request Consultation'}
          </button>
        </form>
      </div>
    </div>
  );
};
