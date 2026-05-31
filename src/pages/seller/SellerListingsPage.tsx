import React from "react";
import { Property, SiteSettings } from "../../types";
import { Plus, Edit } from "lucide-react";
import { PropertyImageSlider } from "../../components/UserPortals";

interface SellerListingsPageProps {
  sellerProperties: Property[];
  settings: SiteSettings;
  onRefreshData: () => void;
  onAddToast: (msg: string, type: "success" | "error" | "info") => void;
  onInitiateStkPush: (id: string, amount: number, purpose: string, targetName: string) => void;
  handleToggleAvailability: (id: string) => void;
  setActiveTab: (tab: string) => void;
}

export default function SellerListingsPage({
  sellerProperties,
  settings,
  onRefreshData,
  onAddToast,
  onInitiateStkPush,
  handleToggleAvailability,
  setActiveTab
}: SellerListingsPageProps) {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 text-white p-4 rounded-xl flex flex-wrap items-center justify-between gap-4">
        <div className="text-xs">
          <p className="font-extrabold text-[#F5A623]">Seller Direct Listing Policy</p>
          <p className="text-gray-300 mt-1">Sellers publish verified properties directly with an instant <span className="font-bold">KES {settings.listingFee || 100}</span> Lipa Na M-PESA checkout listing fee.</p>
        </div>
        <button
          onClick={() => setActiveTab("createlisting")}
          className="bg-[#1B6B3A] text-white hover:bg-[#0D4F2B] px-4 py-2 text-xs font-bold rounded-lg uppercase tracking-wider transition-all cursor-pointer shadow-sm flex items-center gap-1.5 border-none"
        >
          <Plus className="w-4 h-4" /> Advertise For Sale
        </button>
      </div>

      {sellerProperties.length === 0 ? (
        <div className="bg-white border text-center p-16 rounded-2xl text-xs text-slate-400 font-medium">
          You do not have any properties listed for sale on your dashboard. Start listing now!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sellerProperties.map((p) => {
            return (
              <div key={p.id} className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden flex flex-col">
                <div className="h-40 bg-slate-100 overflow-hidden relative">
                  <PropertyImageSlider images={p.images} propertyName={p.name} />
                  <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border shadow-sm z-10 ${
                    p.status === "published" ? "bg-green-105 border-green-500 text-green-700" : "bg-amber-100 border-amber-500 text-amber-700 animate-pulse"
                  }`}>
                    {p.status}
                  </div>
                  {p.isComplex ? (
                    <div className="absolute top-3 right-3 bg-amber-500 text-slate-900 px-2.5 py-1 rounded text-[9px] font-mono font-bold tracking-wider uppercase z-10">
                      Estate Blocks
                    </div>
                  ) : (
                    <div className="absolute top-3 right-3 bg-teal-600 text-white px-2.5 py-1 rounded text-[9px] font-mono font-bold tracking-wider uppercase z-10">
                      Direct Sale Plot
                    </div>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 font-mono tracking-wider uppercase">{p.propertyType} • {p.town}, {p.county}</span>
                    <h3 className="font-bold font-serif text-sm text-gray-800 tracking-wide mt-1 leading-normal">{p.name}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-2 leading-relaxed whitespace-pre-wrap">{p.description}</p>
                  </div>

                  <div className="border-t pt-4 mt-4 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="font-extrabold text-[#1B6B3A] text-sm">KES {p.price.toLocaleString()}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const newPriceStr = window.prompt("Enter revised selling price KES for " + p.name + ":", p.price.toString());
                            if (newPriceStr !== null) {
                              const num = Number(newPriceStr);
                              if (!isNaN(num) && num > 0) {
                                fetch(`/api/properties/${p.id}/price`, {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ price: num })
                                })
                                .then(res => res.json())
                                .then(data => {
                                  if (data.success) {
                                    onAddToast("Selling price revised successfully on ledger!", "success");
                                    onRefreshData();
                                  } else {
                                    onAddToast(data.error || "Failed to update price", "error");
                                  }
                                })
                                .catch(() => {
                                  onAddToast("Error connecting to server.", "error");
                                });
                              } else {
                                  onAddToast("Please enter a valid positive number", "error");
                              }
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-[#1B6B3A] hover:bg-slate-50 border border-slate-150 rounded transition-all cursor-pointer flex items-center justify-center h-6 w-6"
                          title="Revise Selling Asset Price"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex gap-4 text-[11px] font-mono text-gray-400">
                        <span className="flex items-center gap-1">👁️ {p.views || 0}</span>
                        <span className="flex items-center gap-1">❤️ {p.likes || 0}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 text-xs">
                      {p.status === "published" && (
                        <button
                          onClick={() => handleToggleAvailability(p.id)}
                          className={`flex-1 py-2 rounded font-bold uppercase text-[11px] cursor-pointer text-center tracking-wider transition-all ${
                            p.available ? "bg-amber-105 text-[#F5A623] hover:bg-amber-200" : "bg-green-105 text-green-750 hover:bg-green-200"
                          }`}
                        >
                          {p.available ? "Mark as SOLD" : "Mark as AVAILABLE FOR SALE"}
                        </button>
                      )}
                      
                      {p.status === "pending" && (
                        <button
                          onClick={() => {
                            onAddToast("Re-initiating pending STK checkout of KES " + (settings.listingFee || 100), "info");
                            onInitiateStkPush("ws_CO_" + Date.now(), settings.listingFee || 100, "listing_fee", p.name);
                          }}
                          className="w-full py-2 bg-[#F5A623] text-[#1B6B3A] hover:bg-[#d98b11] rounded font-bold text-[11px] uppercase tracking-wider text-center cursor-pointer"
                        >
                          Trigger Sale Listing M-PESA KES {settings.listingFee || 100}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
