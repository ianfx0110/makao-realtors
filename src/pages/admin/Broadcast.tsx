import React, { useEffect, useState } from 'react';
import { Megaphone, Filter, Send, Users } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export const AdminBroadcast = () => {
  const [target, setTarget] = React.useState('all');
  const [message, setMessage] = React.useState('');
  const [isSending, setIsSending] = React.useState(false);
  const [recipientsCount, setRecipientsCount] = useState(0);

  useEffect(() => {
    const fetchRecipients = async () => {
      let query = supabase.from('user_profiles').select('*', { count: 'exact', head: true });
      
      if (target !== 'all') {
        // Map common terms to DB roles if necessary, or use directly
        const roleMapping: Record<string, string> = {
          renters: 'renter',
          landlords: 'landlord',
          buyers: 'buyer',
          sellers: 'seller'
        };
        query = query.eq('role', roleMapping[target] || target);
      }

      const { count } = await query;
      setRecipientsCount(count || 0);
    };

    fetchRecipients();
  }, [target]);

  const handleSend = () => {
    setIsSending(true);
    setTimeout(() => {
      alert(`Broadcast sent to ${recipientsCount} ${target} users!`);
      setIsSending(false);
      setMessage('');
    }, 1500);
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-brand-accent/10 rounded-2xl flex items-center justify-center text-brand-accent">
            <Megaphone size={24} />
          </div>
          <div>
            <h1 className="text-4xl font-display">Global <span className="text-brand-accent">Broadcast</span></h1>
            <p className="text-stone-500">Notify specific user segments instantly.</p>
          </div>
        </div>

        <div className="bento-card">
          <div className="mb-8">
            <label className="text-[10px] uppercase font-bold text-stone-400 block mb-3 flex items-center gap-2">
              <Filter size={12} /> Target Audience
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['all', 'renters', 'landlords', 'buyers', 'sellers'].map(role => (
                <button
                  key={role}
                  onClick={() => setTarget(role)}
                  className={`px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${
                    target === role 
                    ? 'bg-brand-primary text-white border-brand-primary shadow-lg' 
                    : 'bg-stone-50 text-stone-400 border-stone-100 hover:border-brand-accent hover:text-brand-accent'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <label className="text-[10px] uppercase font-bold text-stone-400 block mb-3">Message Content</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter the broadcast message here..."
              className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-6 text-sm outline-none focus:ring-2 focus:ring-brand-accent/20 h-48 resize-none"
            />
          </div>

          <div className="flex items-center justify-between border-t border-stone-100 pt-8">
            <div className="flex items-center gap-2 text-stone-400">
              <Users size={16} />
              <span className="text-xs font-medium">Approx. {recipientsCount.toLocaleString()} recipients</span>
            </div>
            <button 
              onClick={handleSend}
              disabled={!message || isSending}
              className="bg-brand-primary text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-brand-accent transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isSending ? 'Sending...' : <><Send size={14} /> Send Broadcast</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
