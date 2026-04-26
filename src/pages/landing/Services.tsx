import React from 'react';
import { Camera, ShieldCheck, Map, CreditCard } from 'lucide-react';

export const OurServices = () => (
  <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
    <div className="text-center mb-16">
      <h1 className="text-5xl font-display mb-4">Premium <span className="text-brand-accent">Solutions</span></h1>
      <p className="text-stone-500">More than just listings—we offer a complete property ecosystem.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bento-card">
        <Camera className="text-brand-accent mb-4" size={32} />
        <h3 className="text-lg font-bold mb-2">Virtual Tours</h3>
        <p className="text-sm text-stone-500">Experience properties in high-definition 3D without leaving your home.</p>
      </div>
      <div className="bento-card">
        <ShieldCheck className="text-brand-accent mb-4" size={32} />
        <h3 className="text-lg font-bold mb-2">Legal Verification</h3>
        <p className="text-sm text-stone-500">We verify title deeds and KRA compliance for every sale listing.</p>
      </div>
      <div className="bento-card">
        <Map className="text-brand-accent mb-4" size={32} />
        <h3 className="text-lg font-bold mb-2">County Insights</h3>
        <p className="text-sm text-stone-500">Get detailed data on lifestyle, safety, and price trends for all 47 counties.</p>
      </div>
      <div className="bento-card">
        <CreditCard className="text-brand-accent mb-4" size={32} />
        <h3 className="text-lg font-bold mb-2">Escrow Payments</h3>
        <p className="text-sm text-stone-500">Secure your transactions with our integrated Kenyan escrow system.</p>
      </div>
    </div>
  </div>
);
