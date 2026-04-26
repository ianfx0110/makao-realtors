import React from 'react';
import { motion } from 'motion/react';
import { MessageCircle, Send, Phone, Mail } from 'lucide-react';

export const Support = () => {
  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <h1 className="text-4xl font-serif text-brand-primary mb-4">Support Center</h1>
        <p className="text-stone-500 mb-12">How can we help you today? Our team is typically available 24/7 for premium members.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="p-8 bg-white border border-stone-100 rounded-3xl shadow-sm space-y-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
              <MessageCircle size={24} />
            </div>
            <h3 className="text-xl font-bold">WhatsApp Support</h3>
            <p className="text-stone-500 text-sm">Instant messaging for quick queries and document sharing.</p>
            <a 
              href="https://wa.me/254115481162?text=Hello%20Makao%20Realtors%20Support%2C%20I%20have%20an%20inquiry." 
              className="inline-block text-brand-accent font-bold hover:underline"
            >
              Start Chat
            </a>
          </div>

          <div className="p-8 bg-white border border-stone-100 rounded-3xl shadow-sm space-y-4">
            <div className="w-12 h-12 bg-stone-50 text-brand-primary rounded-full flex items-center justify-center">
              <Mail size={24} />
            </div>
            <h3 className="text-xl font-bold">Email Inquiry</h3>
            <p className="text-stone-500 text-sm">For formal requests, partnership inquiries or technical issues.</p>
            <a href="mailto:info@maskani.co.ke" className="inline-block text-brand-accent font-bold hover:underline">
              Send Email
            </a>
          </div>
        </div>

        <div className="bg-stone-900 text-white p-10 rounded-[3rem] space-y-6">
          <h2 className="text-2xl font-serif">Submit a Ticket</h2>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400 block mb-2">Subject</label>
              <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-accent" placeholder="What is your issue?" />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400 block mb-2">Message</label>
              <textarea rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-accent" placeholder="Describe your issue in detail..." />
            </div>
            <button className="bg-brand-accent text-white px-8 py-3 rounded-full font-bold uppercase text-[10px] tracking-widest hover:bg-white hover:text-brand-accent transition-all">
              Submit Ticket
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
