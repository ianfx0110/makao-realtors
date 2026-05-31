import React from "react";
import { User, Property } from "../../types";

interface SellerDashboardPageProps {
  currentUser: User;
  properties: Property[];
  setActiveTab: (tab: string) => void;
}

export default function SellerDashboardPage({
  currentUser,
  properties,
  setActiveTab
}: SellerDashboardPageProps) {
  const sellerProps = properties.filter((p) => p.landlordId === currentUser.id);
  const totalListed = sellerProps.length;
  const activeCount = sellerProps.filter((p) => p.status === "published").length;

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-sm border border-slate-850">
        <h3 className="font-serif text-lg font-bold text-[#F5A623]">Selling Owner Ledger Hub</h3>
        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
          List lands, residential estates, bungalows, commercial buildings, and prime properties for direct sale. Bypass intermediary agencies and connect with qualified buyers with Lipa Na M-PESA.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white p-6 border rounded-xl shadow-3xs">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">My Advertised Estates</p>
          <p className="text-3xl font-bold font-serif text-[#1B6B3A] mt-2">{totalListed}</p>
        </div>
        <div className="bg-white p-6 border rounded-xl shadow-3xs">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">Verified Published</p>
          <p className="text-3xl font-bold font-serif text-green-750 mt-2">{activeCount}</p>
        </div>
      </div>

      <div className="bg-white p-8 border rounded-xl shadow-3xs text-center space-y-4">
        <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-[#F5A623] text-lg font-bold mx-auto">
          🏗️
        </div>
        <h4 className="text-xs font-bold uppercase tracking-widest text-[#1B6B3A] font-mono">Accelerate Real Estate Sales</h4>
        <p className="text-xs text-gray-500 max-w-md mx-auto">
          Add description, size, location maps, multiple highrise images, and connect direct customer leads standardly.
        </p>
        <button
          type="button"
          onClick={() => setActiveTab("createlisting")}
          className="bg-[#1B6B3A] hover:bg-[#0D4F2B] text-white py-2.5 px-6 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-md mx-auto inline-block cursor-pointer"
        >
          Publish Property for Sale
        </button>
      </div>
    </div>
  );
}
