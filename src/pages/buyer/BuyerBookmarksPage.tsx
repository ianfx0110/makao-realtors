import React from "react";
import { Property } from "../../types";
import { Trash2 } from "lucide-react";

interface BuyerBookmarksPageProps {
  properties: Property[];
  savedPropertyIds: string[];
  handleSavePropertyToggle: (id: string, name: string) => void;
  setActiveTab: (tab: string) => void;
}

export default function BuyerBookmarksPage({
  properties,
  savedPropertyIds,
  handleSavePropertyToggle,
  setActiveTab
}: BuyerBookmarksPageProps) {
  const bookmarked = properties.filter((p) => savedPropertyIds.includes(p.id) && p.listingType === "sale");

  return (
    <div className="space-y-4 text-xs text-slate-800 font-sans">
      <h3 className="font-serif font-bold text-gray-800 text-sm">Interactive Saved Sale Listings</h3>
      
      {bookmarked.length === 0 ? (
        <div className="bg-white border text-center p-12 rounded-xl text-xs text-slate-400">
          You have not bookmarked any listings for sale yet. Browse listings to save favorites!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-4 rounded-xl">
          {bookmarked.map((p) => {
            const pic = p.images && p.images[0] ? p.images[0] : "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&auto=format&fit=crop&q=80";
            return (
              <div key={p.id} className="bg-white p-4 rounded-xl border flex gap-4 text-xs justify-between items-center">
                <div className="w-16 h-16 bg-slate-100 rounded overflow-hidden shrink-0">
                  <img src={pic} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-800 truncate leading-none mb-1">{p.name}</h4>
                  <span className="text-[10px] font-bold text-gray-400 font-mono tracking-wider uppercase block">{p.propertyType} • {p.town}</span>
                  <span className="font-bold text-[#1B6B3A] block mt-1.5">KES {p.price.toLocaleString()}</span>
                </div>
                <div className="flex flex-col justify-between text-right shrink-0">
                  <button
                    onClick={() => handleSavePropertyToggle(p.id, p.name)}
                    className="bg-red-50 hover:bg-red-200 text-red-500 p-1.5 rounded cursor-pointer border-none"
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
