import React from 'react';

export const AboutMakao = () => (
  <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto text-left">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
      <div className="bento-card bg-brand-primary text-white p-12 rounded-[3.5rem]">
        <h1 className="text-5xl font-serif mb-6 tracking-tight">Our Mission is <br /><span className="text-brand-accent italic">Excellence.</span></h1>
        <p className="text-stone-400 font-light leading-relaxed mb-8">
          Makao Realtors is not just a locator; it's a gateway to premium living in Kenya. We bridge the gap between 
          discerning residents and high-quality spaces through technology, verification, and transparency.
        </p>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <span className="block text-3xl font-display">47</span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-stone-500">Counties Covered</span>
          </div>
          <div>
            <span className="block text-3xl font-display">100%</span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-stone-500">Verified Units</span>
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <div className="bento-card rounded-[2.5rem]">
          <h3 className="text-xl font-serif text-brand-primary mb-2">Transparency</h3>
          <p className="text-stone-500 text-sm font-light">Every listing on Makao undergoes a rigorous verification process by our ground agents.</p>
        </div>
        <div className="bento-card">
          <h3 className="text-xl font-bold mb-2">Accessibility</h3>
          <p className="text-stone-500 text-sm">From urban apartments in Nairobi to coastal villas in Lamu, we cover the entire nation.</p>
        </div>
      </div>
    </div>
  </div>
);
