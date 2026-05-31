import React from "react";
import { User, Property, ConnectionRequest } from "../../types";

interface RenterDashboardPageProps {
  currentUser: User;
  properties: Property[];
  connections: ConnectionRequest[];
  setActiveTab: (tab: string) => void;
}

export default function RenterDashboardPage({
  currentUser,
  properties,
  connections,
  setActiveTab
}: RenterDashboardPageProps) {
  const rentalProps = properties.filter((p) => p.listingType === "rent");
  const myRevealed = connections.filter((c) => c.renterId === currentUser.id && c.status === "approved").length;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#1B6B3A] to-[#124B28] p-6 rounded-2xl text-white shadow-sm">
        <h3 className="font-serif text-lg font-bold">Renter Portal Control Panel</h3>
        <p className="text-xs text-emerald-100/90 mt-1 leading-relaxed">
          Welcome to the direct landlord-tenant exchange! You can browse bedsitters, apartments, bungalows, and executive suites around Nairobi, Kiambu, Ruaka, and Syokimau. Zero brokerage agents, zero middleman markups.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-5 border rounded-xl shadow-3xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Total Available Rentals</p>
          <p className="text-3xl font-bold font-serif text-[#1B6B3A] mt-2">{rentalProps.length}</p>
        </div>
        <div className="bg-white p-5 border rounded-xl shadow-3xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">My Connected Owners</p>
          <p className="text-3xl font-bold font-serif text-emerald-850 mt-2">{myRevealed}</p>
        </div>
        <div className="bg-white p-5 border rounded-xl shadow-3xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Covered Kenyan Towns</p>
          <p className="text-2xl font-bold font-serif text-amber-700 mt-2">Ruaka, Kilimani, Kiambu +</p>
        </div>
      </div>

      <div className="bg-white p-6 border rounded-xl shadow-3xs text-center space-y-4">
        <h4 className="text-sm font-bold text-gray-800 font-serif">Ready to find your next home?</h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Filter easily by price, bedroom count, location county, deposit terms, and select verified listings.
        </p>
        <button
          type="button"
          onClick={() => setActiveTab("browse")}
          className="bg-[#1B6B3A] hover:bg-[#0D4F2B] text-white py-2.5 px-6 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
        >
          Browse Homes and Rentals Here
        </button>
      </div>
    </div>
  );
}
