import React from "react";
import { User, Property, ConnectionRequest } from "../../types";

interface BuyerDashboardPageProps {
  currentUser: User;
  properties: Property[];
  connections: ConnectionRequest[];
  setActiveTab: (tab: string) => void;
}

export default function BuyerDashboardPage({
  currentUser,
  properties,
  connections,
  setActiveTab
}: BuyerDashboardPageProps) {
  const saleProps = properties.filter((p) => p.listingType === "sale");
  const myRevealed = connections.filter((c) => c.renterId === currentUser.id && c.status === "approved").length;

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-sm border border-slate-850">
        <h3 className="font-serif text-lg font-bold text-[#F5A623]">Buyer Asset Ledger Control Panel</h3>
        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
          Unlock premium land parcels, maisonettes, and commercial properties. Pay safely to unlock verified owner details using our secure escrow review model and connect with absolute ease.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-5 border rounded-xl shadow-3xs">
          <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase font-mono">Real Estate For Sale</p>
          <p className="text-3xl font-bold font-serif text-[#1B6B3A] mt-2">{saleProps.length}</p>
        </div>
        <div className="bg-white p-5 border rounded-xl shadow-3xs">
          <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase font-mono">My Owner Connexions</p>
          <p className="text-3xl font-bold font-serif text-amber-600 mt-2">{myRevealed}</p>
        </div>
        <div className="bg-white p-5 border rounded-xl shadow-3xs">
          <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase font-mono">Security Model</p>
          <p className="text-xs font-bold text-green-700 bg-green-50 py-1 px-2.5 rounded border border-green-150 inline-block mt-3 uppercase font-mono">
            ESCROW VERIFIED
          </p>
        </div>
      </div>

      <div className="bg-white p-6 border rounded-xl shadow-2xs text-center space-y-4">
        <h4 className="text-sm font-bold text-gray-800 font-serif">Begin your direct purchase journey</h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          View plot sizes, verified land deeds, visual galleries, and initiate instant direct connections with landlords.
        </p>
        <button
          type="button"
          onClick={() => setActiveTab("browse")}
          className="bg-[#1B6B3A] hover:bg-[#0D4F2B] text-white py-2.5 px-6 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer inline-block"
        >
          Explore Houses & Lands For Sale
        </button>
      </div>
    </div>
  );
}
