import React from "react";
import { Property, ConnectionRequest } from "../../types";
import { Heart } from "lucide-react";
import { COVERED_COUNTIES, PropertyImageSlider } from "../../components/UserPortals";

interface BuyerBrowsePageProps {
  filteredProperties: Property[];
  savedPropertyIds: string[];
  myApprovedReveals: ConnectionRequest[];
  filterCounty: string;
  setFilterCounty: (val: string) => void;
  filterType: string;
  setFilterType: (val: string) => void;
  filterMaxPrice: string;
  setFilterMaxPrice: (val: string) => void;
  filterSearch: string;
  setFilterSearch: (val: string) => void;
  handleSavePropertyToggle: (id: string, name: string) => void;
  handleRegisterRenterConnection: (id: string, name: string) => void;
}

export default function BuyerBrowsePage({
  filteredProperties,
  savedPropertyIds,
  myApprovedReveals,
  filterCounty,
  setFilterCounty,
  filterType,
  setFilterType,
  filterMaxPrice,
  setFilterMaxPrice,
  filterSearch,
  setFilterSearch,
  handleSavePropertyToggle,
  handleRegisterRenterConnection
}: BuyerBrowsePageProps) {
  // Buyers view listingType === "sale"
  const saleProperties = filteredProperties.filter((p) => p.listingType === "sale");

  return (
    <div className="space-y-6 text-xs text-slate-800 font-sans">
      {/* Advance Filters block */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 font-mono">County location</label>
            <select
              className="w-full p-2.5 border rounded-lg bg-white font-bold text-slate-800"
              value={filterCounty}
              onChange={(e) => setFilterCounty(e.target.value)}
            >
              <option value="All Counties">All Counties</option>
              {COVERED_COUNTIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 font-mono">Unit Category</label>
            <select
              className="w-full p-2.5 border rounded-lg bg-white"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="All Types">All Categories</option>
              <option value="Bungalow">Bungalow</option>
              <option value="Maisonette">Maisonette</option>
              <option value="Apartment">Apartment Complex</option>
              <option value="Land">Land / plots</option>
              <option value="Commercial">Commercial Block</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 font-mono">Maximum Sale Budget (KES)</label>
            <input
              type="number"
              placeholder="e.g. 1500000"
              className="w-full p-2.5 border rounded-lg focus:outline-none bg-white font-mono"
              value={filterMaxPrice}
              onChange={(e) => setFilterMaxPrice(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search Sale keywords, plot beacon numbers, road locations..."
            className="flex-1 text-xs border rounded-lg px-4 py-2.5 focus:outline-none bg-white"
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Listings grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {saleProperties.map((p) => {
          const alreadySaved = savedPropertyIds.includes(p.id);
          const connectionApproved = myApprovedReveals.find((c) => c.propertyId === p.id);

          return (
            <div key={p.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col">
              <div className="h-44 overflow-hidden relative bg-slate-100">
                <PropertyImageSlider images={p.images} propertyName={p.name} />
                <div className="absolute top-3 left-3 bg-slate-900 text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-slate-705 shadow-sm z-10">
                  For Sale
                </div>
                <button
                  onClick={() => handleSavePropertyToggle(p.id, p.name)}
                  className="absolute top-3 right-3 bg-white hover:bg-red-50 text-slate-500 hover:text-red-600 p-2 rounded-full shadow-sm transition-all cursor-pointer z-10 border-none"
                >
                  <Heart className={`w-3.5 h-3.5 ${alreadySaved ? "fill-red-600 text-red-600" : "text-slate-400"}`} />
                </button>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] font-bold text-gray-400 font-mono tracking-wider uppercase">{p.propertyType} • {p.town}, {p.county}</span>
                    <span className="text-[9px] bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full font-bold uppercase">Direct Seller</span>
                  </div>
                  <h3 className="font-bold font-serif text-sm text-gray-800 tracking-wide mt-1.5 leading-normal">{p.name}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed mt-2 line-clamp-3 whitespace-pre-wrap">{p.description}</p>
                </div>

                {p.amenities && p.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {p.amenities.map((a) => (
                      <span key={a} className="bg-teal-50 text-teal-700 text-[9px] font-bold px-2 py-0.5 rounded uppercase font-mono tracking-wide">
                        {a}
                      </span>
                    ))}
                  </div>
                )}

                <div className="border-t pt-4 mt-4 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block font-mono">Total Asset Pricing</span>
                    <span className="text-base font-extrabold text-[#1B6B3A]">
                      KES {p.price.toLocaleString()}
                    </span>
                  </div>

                  {connectionApproved ? (
                    <div className="bg-green-50 border border-green-200 text-green-700 p-2 rounded-lg text-[10px]">
                      <p className="font-bold uppercase tracking-wider leading-none mb-1 font-mono text-[9px]">Direct Seller Contact:</p>
                      <a href={`tel:${p.contactPhone}`} className="hover:underline font-mono font-bold block text-xs">{p.contactPhone}</a>
                      {p.contactWhatsApp && (
                        <a
                          href={`https://wa.me/${p.contactWhatsApp.replace("+", "")}`}
                          target="_blank"
                          className="text-emerald-600 underline font-extrabold mt-1 block"
                        >
                          Direct WhatsApp Chat
                        </a>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => handleRegisterRenterConnection(p.id, p.name)}
                      className="px-4 py-2 bg-[#1B6B3A] hover:bg-[#0D4F2B] text-white rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer shadow-sm active:scale-95 transition-all text-center flex items-center gap-1 border-none"
                    >
                      Bypass Broker: Connect Direct
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {saleProperties.length === 0 && (
          <div className="md:col-span-2 bg-white border p-12 rounded-xl text-center text-xs text-slate-400">
            No active vetted listings for sale found. Try refining options.
          </div>
        )}
      </div>
    </div>
  );
}
