import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { CreditCard, Download, ExternalLink, Calendar, DollarSign } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export const PaymentHistory = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPayments();
    }
  }, [user]);

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (err) {
      console.error('Error fetching payments:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 px-6 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-display mb-2">Payment <span className="text-brand-accent italic">History</span></h1>
          <p className="text-stone-500 font-light">Securely track your financial transactions with Makao Realtors.</p>
        </div>
        <button className="flex items-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-brand-accent transition-all">
          <Download size={16} /> Export All
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-20 bento-card animate-pulse bg-stone-100" />)}
        </div>
      ) : payments.length > 0 ? (
        <div className="bento-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-stone-100">
                  <th className="px-6 py-4 text-[10px] uppercase font-bold text-stone-400 tracking-widest">Date</th>
                  <th className="px-6 py-4 text-[10px] uppercase font-bold text-stone-400 tracking-widest">Purpose</th>
                  <th className="px-6 py-4 text-[10px] uppercase font-bold text-stone-400 tracking-widest">Amount</th>
                  <th className="px-6 py-4 text-[10px] uppercase font-bold text-stone-400 tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] uppercase font-bold text-stone-400 tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-stone-600 text-sm">
                        <Calendar size={14} className="text-stone-300" />
                        {new Date(p.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-stone-900 text-sm capitalize">
                      {p.purpose.replace('_', ' ')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center font-bold text-brand-primary">
                        <span className="text-[10px] mr-1 font-sans text-stone-400">KES</span>
                        {p.amount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-stone-400 hover:text-brand-accent transition-colors">
                        <ExternalLink size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bento-card py-20 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto text-stone-300">
            <DollarSign size={32} />
          </div>
          <h2 className="text-2xl font-serif">No transactions found</h2>
          <p className="text-stone-500 font-light">Payments will appear here once you book a service or start a rental agreement.</p>
        </div>
      )}
    </div>
  );
};
