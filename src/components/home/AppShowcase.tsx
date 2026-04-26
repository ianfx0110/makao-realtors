import React from 'react';
import { motion } from 'motion/react';
import { Smartphone, Bell, ShieldCheck, Zap, Download } from 'lucide-react';

export const AppShowcase = () => {
  return (
    <section className="py-24 bg-stone-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent/20 border border-brand-accent/30 text-brand-accent text-[10px] font-bold uppercase tracking-widest">
              <Smartphone size={12} /> Mobile First Experience
            </div>
            
            <h2 className="text-4xl md:text-6xl font-serif leading-tight">
              Manage Your Property <br />
              <span className="text-brand-accent italic">From Anywhere</span>
            </h2>
            
            <p className="text-stone-400 text-lg font-light leading-relaxed max-w-xl">
              The Makao Realtors app brings the entire real estate ecosystem to your pocket. From virtual tours to secure payments and maintenance tracking.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {[
                {
                  icon: <Bell size={20} />,
                  title: "Instant Alerts",
                  desc: "Be the first to know when a property matching your criteria hits the market."
                },
                {
                  icon: <ShieldCheck size={20} />,
                  title: "Secure Portal",
                  desc: "Verified landlords and encrypted payment tracking for absolute peace of mind."
                },
                {
                  icon: <Zap size={20} />,
                  title: "Virtual Tours",
                  desc: "Immersive 3D walk-throughs that save you time and travel expenses."
                },
                {
                  icon: <Download size={20} />,
                  title: "Paperless Docs",
                  desc: "Sign leases and manage title deeds directly within our secure vault."
                }
              ].map((feature, idx) => (
                <div key={idx} className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-brand-accent/50 transition-all">
                  <div className="text-brand-accent mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h4 className="font-bold mb-2">{feature.title}</h4>
                  <p className="text-stone-500 text-xs leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>


          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, type: "spring" }}
            className="relative hidden lg:block"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-accent/10 rounded-full blur-[120px]" />
            <div className="relative z-10 mx-auto w-[320px] aspect-[9/19] bg-stone-800 rounded-[3rem] border-[8px] border-stone-700 shadow-2xl overflow-hidden">
              {/* App Mockup Content */}
              <div className="w-full h-full bg-stone-50 p-4 pt-8">
                <div className="flex justify-between items-center mb-6 px-2">
                  <div className="h-4 w-4 bg-stone-200 rounded-full" />
                  <div className="h-6 w-24 bg-brand-accent/20 rounded-full" />
                  <div className="h-4 w-4 bg-stone-200 rounded-full" />
                </div>
                
                <div className="space-y-4">
                  <div className="h-40 w-full bg-stone-200 rounded-2xl overflow-hidden relative">
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent p-3">
                      <div className="h-2 w-20 bg-white/50 rounded" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-24 bg-stone-100 rounded-xl" />
                    <div className="h-24 bg-stone-100 rounded-xl" />
                  </div>
                  <div className="h-32 bg-stone-100 rounded-2xl" />
                  <div className="h-12 bg-brand-primary rounded-xl" />
                </div>
              </div>
            </div>
            
            {/* Floating UI elements */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-20 -right-10 z-20 bg-white p-4 rounded-2xl shadow-xl text-black border border-stone-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <Zap size={16} />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase text-stone-400">Success</div>
                  <div className="text-xs font-bold leading-none">Payment Verified</div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-40 -left-20 z-20 bg-white p-4 rounded-2xl shadow-xl text-black border border-stone-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-accent/10 rounded-lg overflow-hidden">
                  <div className="w-full h-full bg-stone-200" />
                </div>
                <div>
                  <div className="text-xs font-bold">Kilimani Penthouse</div>
                  <div className="text-[10px] text-stone-500">Virtual Tour Available</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
