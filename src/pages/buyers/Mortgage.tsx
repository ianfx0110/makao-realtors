import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calculator, Landmark, ShieldCheck, CheckCircle, TrendingUp, Info } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export const BuyerMortgage = () => {
  const [formData, setFormData] = useState({
    amount: '',
    lender_name: 'Equity Bank',
    interest_rate: '13.5',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const lenders = [
    { name: 'Equity Bank', rate: '13.5%' },
    { name: 'KCB Bank', rate: '14.2%' },
    { name: 'NCBA', rate: '13.8%' },
    { name: 'Standard Chartered', rate: '12.9%' },
    { name: 'Co-op Bank', rate: '14.0%' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('Please sign in to apply for a mortgage.');
        return;
      }

      const { error } = await supabase.from('mortgage_applications').insert({
        user_id: user.id,
        amount: Number(formData.amount),
        lender_name: formData.lender_name,
        interest_rate: Number(formData.interest_rate),
        notes: formData.notes,
        status: 'pending'
      });

      if (error) throw error;
      setSuccess(true);
    } catch (err: any) {
      console.error('Mortgage error:', err);
      alert(err.message || 'Failed to submit application.');
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
          <h1 className="text-3xl font-display">Application Sent</h1>
          <p className="text-stone-500">Your mortgage pre-qualification request has been shared with {formData.lender_name}. They will contact you shortly.</p>
          <button onClick={() => setSuccess(false)} className="btn-pill bg-brand-primary text-white">New Application</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 px-6 max-w-7xl mx-auto pb-20">
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-8">
          <div>
            <h1 className="text-5xl font-display mb-4 italic text-brand-accent">Mortgage <span className="text-brand-primary not-italic">Hub</span></h1>
            <p className="text-stone-500 font-light">Get pre-qualified for your dream home with Kenya's leading financial institutions.</p>
          </div>

          <div className="space-y-4">
            <div className="p-6 bg-white border border-stone-100 rounded-3xl shadow-sm">
              <TrendingUp className="text-brand-accent mb-4" />
              <h3 className="font-bold text-stone-900">Current Market Rates</h3>
              <p className="text-xs text-stone-400 mt-1">Average mortgage rates in Kenya currently hover between 12.5% and 15%.</p>
            </div>
            
            <div className="p-6 bg-white border border-stone-100 rounded-3xl shadow-sm">
              <ShieldCheck className="text-green-500 mb-4" />
              <h3 className="font-bold text-stone-900">Secure Processing</h3>
              <p className="text-xs text-stone-400 mt-1">Your financial data is encrypted and shared only with your chosen lender.</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bento-card p-10">
            <div className="flex items-center gap-3 mb-8 pb-8 border-b border-stone-100">
              <Landmark className="text-brand-accent" size={24} />
              <h2 className="text-2xl font-serif">Prequalification Form</h2>
            </div>

            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
              <div className="md:col-span-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400 block mb-3">Target Loan Amount (KES)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 15,000,000"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-4 text-xl font-serif outline-none focus:ring-2 focus:ring-brand-accent/10"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400 block mb-3">Preferred Lender</label>
                <select
                  className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 outline-none"
                  value={formData.lender_name}
                  onChange={(e) => setFormData({...formData, lender_name: e.target.value})}
                >
                  {lenders.map(l => (
                    <option key={l.name} value={l.name}>{l.name} (approx {l.rate})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400 block mb-3">Interest Rate Preference</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={formData.interest_rate}
                    onChange={(e) => setFormData({...formData, interest_rate: e.target.value})}
                    className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 outline-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-stone-400">%</span>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400 block mb-3">Additional Financial Details</label>
                <textarea
                  placeholder="Mention your monthly income, current debts, or other relevant info..."
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 outline-none h-32"
                />
              </div>

              <div className="md:col-span-2 flex items-center gap-2 bg-stone-50 p-4 rounded-xl text-[10px] text-stone-400">
                <Info size={14} /> This application does not affect your credit score and is a preliminary interest check.
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="md:col-span-2 py-4 bg-brand-primary text-white font-bold uppercase text-xs tracking-widest rounded-xl hover:bg-brand-accent transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Send Application'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
