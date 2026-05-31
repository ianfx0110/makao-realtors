import React from "react";
import { User, Property } from "../../types";

interface LandlordDashboardPageProps {
  currentUser: User;
  properties: Property[];
  setActiveTab: (tab: string) => void;
}

export default function LandlordDashboardPage({
  currentUser,
  properties,
  setActiveTab
}: LandlordDashboardPageProps) {
  const landlordProps = properties.filter((p) => p.landlordId === currentUser.id);
  const activeCount = landlordProps.filter((p) => p.status === "published").length;
  const pendingCount = landlordProps.filter((p) => p.status === "pending").length;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#1B6B3A] to-[#0E3A20] p-6 rounded-2xl text-white shadow-sm">
        <h3 className="font-serif text-lg font-bold">Landlord Executive Ledger</h3>
        <p className="text-xs text-emerald-100/90 mt-1 leading-relaxed">
          Manage your highrise apartments, complexes, and bedsitters directly. Track real-time views, saves, and connectivity requests from verified tenants inside Nairobi and other covered areas.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-5 border rounded-xl shadow-3xs">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">My Listings Count</p>
          <p className="text-3xl font-bold font-serif text-[#1B6B3A] mt-2">{landlordProps.length}</p>
        </div>
        <div className="bg-white p-5 border rounded-xl shadow-3xs">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">Published Live</p>
          <p className="text-3xl font-bold font-serif text-green-700 mt-2">{activeCount}</p>
        </div>
        <div className="bg-white p-5 border rounded-xl shadow-3xs">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">Drafts Pending</p>
          <p className="text-2xl font-bold font-serif text-amber-600 mt-2">{pendingCount}</p>
        </div>
      </div>

      <div className="bg-white p-6 border rounded-xl shadow-3xs flex flex-col items-center justify-center text-center space-y-3">
        <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-[#1B6B3A] text-lg font-bold shadow-2xs">
          🏠
        </div>
        <h4 className="text-sm font-bold text-gray-800 font-serif">Want to register a new tenant-seeking estate?</h4>
        <p className="text-xs text-gray-400 max-w-sm">
          List bedsitters, apartments, bungalows, townhouses, and land plots with Lipa Na M-PESA fast-track publishing.
        </p>
        <button
          type="button"
          onClick={() => setActiveTab("createlisting")}
          className="bg-[#1B6B3A] hover:bg-[#0D4F2B] text-white py-2 px-5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-md"
        >
          Add property listing
        </button>
      </div>
    </div>
  );
}
