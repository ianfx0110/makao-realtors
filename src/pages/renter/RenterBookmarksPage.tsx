import React from "react";
import { Property } from "../../types";
import { Trash2 } from "lucide-react";

interface RenterBookmarksPageProps {
  properties: Property[];
  savedPropertyIds: string[];
  handleSavePropertyToggle: (id: string, name: string) => void;
  setActiveTab: (tab: string) => void;
}

export default function RenterBookmarksPage({
  properties,
  savedPropertyIds,
  handleSavePropertyToggle,
  setActiveTab
}: RenterBookmarksPageProps) {
  const bookmarked = properties.filter((p) => savedPropertyIds.includes(p.id) && p.listingType === "rent");

  return (
    <div className="space-y-4 text-xs text-slate-800 font-sans">
      <h3 className="font-serif font-bold text-gray-800 text-sm">Interactive Saved Rental Homes</h3>
      
      {bookmarked.length === 0 ? (
        <div className="bg-white border text-center p-12 rounded-xl text-xs text-slate-400">
          You have not bookmarked any rental listings yet. Browse listings to save favorites!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookmarked.map((p) => {
            const pic = p.images && p.images[0] ? p.images[0] : "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80";
            return (
              <div key={p.id} className="bg-white rounded-xl border p-4 flex gap-4 text-xs hover:shadow-xs justify-between items-center bg-white">
                <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                  <img src={pic} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-800 truncate leading-none mb-1">{p.name}</h4>
                  <span className="text-[10px] font-bold text-gray-400 font-mono tracking-wider uppercase block">{p.propertyType} • {p.town}</span>
                  <span className="font-bold text-[#1B6B3A] block mt-1.5">KES {p.price.toLocaleString()}/mo</span>
                </div>
                <div className="flex flex-col justify-between text-right shrink-0">
                  <button
                    onClick={() => handleSavePropertyToggle(p.id, p.name)}
                    className="bg-red-50 hover:bg-red-200 text-red-555 p-1.5 rounded cursor-pointer border-none"
                  >
                    <Trash2 className="w-4 h-4 text-red-650" />
                  </button>
                  <button
                    onClick={() => setActiveTab("browse")}
                    className="text-[#1B6B3A] hover:underline uppercase text-[9px] font-bold font-mono tracking-wider mt-2 block cursor-pointer border-none bg-transparent"
                  >
                    Reveal Contacts
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
