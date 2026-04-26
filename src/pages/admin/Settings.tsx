import React from 'react';

export const AdminSettings = () => (
  <div className="pt-32 px-6 max-w-7xl mx-auto">
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-serif text-brand-primary mb-2">System Settings</h1>
        <p className="text-stone-500">Global configuration for the Makao Realtors platform.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="p-8 bg-white border border-stone-100 rounded-3xl shadow-sm">
          <h3 className="font-bold text-lg mb-6">Platform Fees</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-stone-600">Sellers Commission</span>
              <input type="text" className="bg-stone-50 border border-stone-100 rounded-lg px-4 py-2 w-20 text-right text-xs font-bold" defaultValue="2.5%" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-stone-600">Landlord Listing Fee</span>
              <input type="text" className="bg-stone-50 border border-stone-100 rounded-lg px-4 py-2 w-20 text-right text-xs font-bold" defaultValue="KES 5k" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
