import React from 'react';
import { motion } from 'motion/react';
import { Search, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover brightness-50"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-modern-house-with-a-swimming-pool-and-manicured-lawn-32865-large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/60 via-transparent to-brand-primary/80" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 w-full text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl inline-flex items-center gap-3"
          >
            <div className="w-2 h-2 bg-brand-accent rounded-full animate-pulse" />
            <span className="text-white/60 text-[10px] uppercase font-bold tracking-[0.3em] mt-0.5">Elevating Kenyan Living</span>
          </motion.div>

          <h1 className="text-6xl md:text-[7.5rem] font-serif leading-[0.85] text-white mb-10 tracking-tighter">
            Makao <span className="text-brand-accent italic">Realtors</span>
          </h1>
          <p className="text-lg md:text-xl text-stone-400 font-light max-w-2xl mx-auto font-sans tracking-wide">
            Discover a wide range of properties, from cozy bedsitters and modern studios to luxury villas and grand mansions across Kenya.
          </p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col md:flex-row items-center justify-center gap-4 pt-10"
          >
            <div className="relative w-full max-w-md group">
              <input
                type="text"
                placeholder="Search by neighborhood (e.g. Westlands)"
                className="w-full px-8 py-5 bg-white/10 backdrop-blur-md border border-white/20 text-stone-200 placeholder:text-stone-400/60 focus:outline-none focus:ring-1 focus:ring-brand-accent transition-all rounded-none"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Search size={20} className="text-brand-accent" />
              </div>
            </div>
            <button 
              onClick={() => navigate('/listings')}
              className="w-full md:w-auto px-10 py-5 bg-brand-accent text-brand-primary font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-white transition-all group"
            >
              Explore Collection
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative vertical rail text */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center space-y-12">
        <span className="[writing-mode:vertical-rl] text-[10px] uppercase tracking-[0.6em] text-white/30 rotate-180">
          Nairobi • Mombasa • Eldoret • Kisumu • Nakuru
        </span>
        <div className="w-px h-24 bg-white/20" />
      </div>
    </section>
  );
};
