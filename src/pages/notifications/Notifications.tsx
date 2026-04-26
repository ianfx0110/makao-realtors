import React from 'react';
import { motion } from 'motion/react';
import { Bell, Info, CheckCircle, AlertTriangle } from 'lucide-react';

export const Notifications = () => {
  const notifications = [
    { id: 1, type: 'info', title: 'Welcome to Makao', message: 'Thank you for joining Kenya\'s premium property network.', time: '2 mins ago' },
    { id: 2, type: 'success', title: 'Listing Verified', message: 'Your "Kilimani Modern Apartment" listing is now live.', time: '1 hour ago' },
    { id: 3, type: 'warning', title: 'Security Alert', message: 'New login detected from a new device in Nakuru.', time: '3 hours ago' },
  ];

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <h1 className="text-4xl font-serif text-brand-primary mb-4">Notifications</h1>
        <p className="text-stone-500 mb-12">Stay updated with the latest activity on your account.</p>

        <div className="space-y-4">
          {notifications.map((n) => (
            <div key={n.id} className="p-6 bg-white border border-stone-100 rounded-3xl flex gap-6 hover:shadow-md transition-shadow">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                n.type === 'info' ? "bg-blue-50 text-blue-600" :
                n.type === 'success' ? "bg-emerald-50 text-emerald-600" :
                "bg-amber-50 text-amber-600"
              )}>
                {n.type === 'info' ? <Info size={24} /> : n.type === 'success' ? <CheckCircle size={24} /> : <AlertTriangle size={24} />}
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-brand-primary">{n.title}</h3>
                  <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">{n.time}</span>
                </div>
                <p className="text-sm text-stone-500">{n.message}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
