import React from 'react';

export const MakaoLogo = ({ className = '', light = false }: { className?: string, light?: boolean }) => {
  return (
    <div className={`flex items-center gap-3 ${className} transition-all duration-300`}>
      <div className={`w-12 h-12 rounded-[1.25rem] flex items-center justify-center transform -rotate-6 hover:rotate-0 transition-transform duration-500 shadow-xl border border-white/10 ${light ? 'bg-white' : 'bg-brand-primary'}`}>
        <div className="relative">
          <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ring-2 ${light ? 'bg-brand-primary ring-white' : 'bg-brand-accent ring-brand-primary'}`} />
          <span className={`text-2xl font-serif italic font-bold ${light ? 'text-brand-primary' : 'text-white'}`}>M</span>
        </div>
      </div>
      <div className="flex flex-col text-left">
        <div className={`text-2xl font-serif tracking-tighter leading-none flex items-baseline gap-1 ${light ? 'text-white' : 'text-brand-primary'}`}>
          <span className="font-bold">Makao</span>
          <span className={`${light ? 'text-white/70' : 'text-brand-accent'} italic font-medium`}>Realtors</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className={`h-px w-4 ${light ? 'bg-white/20' : 'bg-stone-200'}`} />
          <span className={`text-[7px] uppercase tracking-[0.4em] font-black ${light ? 'text-white/40' : 'text-stone-400'}`}>
            Elevating Kenyan Living
          </span>
        </div>
      </div>
    </div>
  );
};
