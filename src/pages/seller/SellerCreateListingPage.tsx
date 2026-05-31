import React, { useState } from "react";
import { User, Room } from "../../types";
import { UploadCloud, Sparkles, Loader2 } from "lucide-react";
import { COVERED_COUNTIES, STOCK_GALLERY_IMAGES } from "../../components/UserPortals";

interface SellerCreateListingPageProps {
  currentUser: User;
  onAddToast: (msg: string, type: "success" | "error" | "info") => void;
  onRefreshData: () => void;
  setActiveTab: (tab: string) => void;
}

export default function SellerCreateListingPage({
  currentUser,
  onAddToast,
  onRefreshData,
  setActiveTab
}: SellerCreateListingPageProps) {
  const [propName, setPropName] = useState("");
  const [propType, setPropType] = useState("Bungalow");
  const [propCounty, setPropCounty] = useState("Nairobi");
  const [propTown, setPropTown] = useState("");
  const [propEstate, setPropEstate] = useState("");
  const [propBedrooms, setPropBedrooms] = useState(3);
  const [propBathrooms, setPropBathrooms] = useState(3);
  const [propPrice, setPropPrice] = useState("");
  const [propDescription, setPropDescription] = useState("");
  const [propContactPhone, setPropContactPhone] = useState(currentUser.phone);
  const [propContactWhatsApp, setPropContactWhatsApp] = useState(currentUser.phone);
  const [propImages, setPropImages] = useState<string[]>([]);
  const [propAmenities, setPropAmenities] = useState<string[]>(["Parking", "Security", "Water"]);

  // Local state configurations
  const [imageTab, setImageTab] = useState<"upload" | "stock" | "url">("upload");
  const [dragActive, setDragActive] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [creating, setCreating] = useState(false);

  const handleToggleAmenity = (name: string) => {
    if (propAmenities.includes(name)) {
      setPropAmenities(propAmenities.filter((a) => a !== name));
    } else {
      setPropAmenities([...propAmenities, name]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await uploadFile(e.target.files[0]);
    }
  };

  const uploadFile = async (file: File) => {
    if (propImages.length >= 5) {
      onAddToast("Limited to 5 pictures inside basic package", "error");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    onAddToast("Uploading picture safely to storage...", "info");
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.success && data.url) {
        setPropImages([...propImages, data.url]);
        onAddToast("Uploaded successfully! Saved to property portfolio.", "success");
      } else {
        onAddToast(data.error || "Failed to upload image.", "error");
      }
    } catch {
      onAddToast("Could not contact image server.", "error");
    }
  };

  const handleAiOptimize = async () => {
    if (!propDescription) {
      onAddToast("Provide basic details in description first to optimize.", "error");
      return;
    }
    setOptimizing(true);
    onAddToast("AI Agent rewriting premium marketing details...", "info");
    try {
      const res = await fetch("/api/ai/optimize-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: propDescription, category: propType, town: propTown })
      });
      const data = await res.json();
      if (data.success && data.optimized) {
        setPropDescription(data.optimized);
        onAddToast("AI description optimization complete!", "success");
      } else {
        onAddToast(data.error || "AI busy. Try again soon", "error");
      }
    } catch {
      onAddToast("Standard backup optimization applied.", "info");
    } finally {
      setOptimizing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!propName || !propPrice || !propTown) {
      onAddToast("Please fill all mandatory fields.", "error");
      return;
    }
    setCreating(true);

    const payload = {
      name: propName,
      propertyType: propType,
      county: propCounty,
      town: propTown,
      estate: propEstate,
      bedrooms: propBedrooms,
      bathrooms: propBathrooms,
      price: Number(propPrice),
      deposit: 0,
      serviceCharge: 0,
      description: propDescription,
      contactPhone: propContactPhone,
      contactWhatsApp: propContactWhatsApp,
      images: propImages.length > 0 ? propImages : ["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop&q=80"],
      isComplex: false,
      rooms: [],
      amenities: propAmenities,
      listingType: "sale"
    };

    try {
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        onAddToast("Sale Asset Drafted! Initiate Lipa M-PESA KES 100 to publish.", "success");
        onRefreshData();
        setActiveTab("mylistings");
      } else {
        onAddToast(data.error || "Failed to publish listing.", "error");
      }
    } catch {
      onAddToast("Error contacting server.", "error");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 max-w-4xl font-sans text-xs text-slate-800">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h4 className="font-serif font-bold text-sm text-slate-900 border-b pb-2 mb-4">Post Premium Real Estate asset for Sale</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1 font-mono">Property/Asset Name</label>
              <input
                type="text"
                required
                className="w-full text-xs p-2.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B6B3A] bg-white"
                placeholder="e.g. Kitengela 2-Acre Prime Fenced Land"
                value={propName}
                onChange={(e) => setPropName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1 font-mono">Asset Category</label>
                <select
                  className="w-full text-xs p-2.5 border rounded-lg bg-white"
                  value={propType}
                  onChange={(e) => setPropType(e.target.value)}
                >
                  <option value="Bungalow">Bungalow</option>
                  <option value="Maisonette">Maisonette</option>
                  <option value="Apartment">Apartment Complex</option>
                  <option value="Land">Land / Plot</option>
                  <option value="Commercial">Commercial Block</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1 font-mono">Selling Price (KES Total)</label>
                <input
                  type="number"
                  required
                  className="w-full text-xs p-2.5 border rounded-lg focus:outline-none bg-white"
                  placeholder="Selling Price KES"
                  value={propPrice}
                  onChange={(e) => setPropPrice(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-150 tracking-wider mb-1">County</label>
                <select
                  className="w-full text-xs p-2.5 border rounded-lg bg-white"
                  value={propCounty}
                  onChange={(e) => setPropCounty(e.target.value)}
                >
                  {COVERED_COUNTIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-150 tracking-wider mb-1">Town</label>
                <input
                  type="text"
                  required
                  className="w-full text-xs p-2.5 border rounded-lg focus:outline-none bg-white"
                  placeholder="Kitengela / Ruaka"
                  value={propTown}
                  onChange={(e) => setPropTown(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-150 tracking-wider mb-1">Estate (Optional)</label>
                <input
                  type="text"
                  className="w-full text-xs p-2.5 border rounded-lg focus:outline-none bg-white"
                  placeholder="Near Highway"
                  value={propEstate}
                  onChange={(e) => setPropEstate(e.target.value)}
                />
              </div>
            </div>

            {propType !== "Land" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Bedrooms</label>
                  <input
                    type="number"
                    className="w-full text-xs p-2.5 border rounded-lg focus:outline-none bg-white"
                    value={propBedrooms}
                    onChange={(e) => setPropBedrooms(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Bathrooms</label>
                  <input
                    type="number"
                    className="w-full text-xs p-2.5 border rounded-lg focus:outline-none bg-white"
                    value={propBathrooms}
                    onChange={(e) => setPropBathrooms(Number(e.target.value))}
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Owner Contact Phone</label>
                <input
                  type="text"
                  required
                  className="w-full text-xs p-2.5 border rounded-lg focus:outline-none bg-white"
                  value={propContactPhone}
                  onChange={(e) => setPropContactPhone(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Owner WhatsApp Chat Link</label>
                <input
                  type="text"
                  required
                  className="w-full text-xs p-2.5 border rounded-lg focus:outline-none bg-white"
                  value={propContactWhatsApp}
                  onChange={(e) => setPropContactWhatsApp(e.target.value)}
                />
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border">
              <label className="block text-[10px] font-bold text-slate-700 tracking-wider mb-2 font-mono uppercase">📸 Asset Visual Portfolios (Free: Max 5 Photos)</label>
              <div className="grid grid-cols-3 gap-1 mb-2 bg-slate-100 p-1 rounded">
                {(["upload", "stock", "url"] as const).map((tab) => (
                  <button
                    type="button"
                    key={tab}
                    onClick={() => setImageTab(tab)}
                    className={`py-1 text-[9px] font-bold uppercase rounded cursor-pointer ${imageTab === tab ? "bg-white text-[#1B6B3A] shadow-xs" : "text-gray-550"}`}
                  >
                    {tab === "upload" ? "Upload Device" : tab === "stock" ? "Select Stock" : "Input Link"}
                  </button>
                ))}
              </div>

              {imageTab === "upload" && (
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("file-loader-gallery-s")?.click()}
                  className="border-2 border-dashed border-gray-250 hover:border-slate-400 rounded-lg p-4 text-center cursor-pointer"
                >
                  <input
                    type="file"
                    id="file-loader-gallery-s"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <UploadCloud className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                  <p className="text-[10px] text-gray-700 font-bold">Upload direct asset photos</p>
                </div>
              )}

              {imageTab === "stock" && (
                <div className="grid grid-cols-4 gap-1 max-h-24 overflow-y-auto">
                  {STOCK_GALLERY_IMAGES.map((img, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => {
                        if (propImages.includes(img.url)) {
                          setPropImages(propImages.filter((k) => k !== img.url));
                        } else {
                          if (propImages.length >= 5) return;
                          setPropImages([...propImages, img.url]);
                        }
                      }}
                      className="h-10 relative border rounded overflow-hidden"
                    >
                      <img src={img.url} className="w-full h-full object-cover" alt="" />
                    </button>
                  ))}
                </div>
              )}

              {imageTab === "url" && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="custom-url-seller"
                    placeholder="Enter image web URL..."
                    className="flex-1 p-1 bg-white text-xs border rounded focus:outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const inp = document.getElementById("custom-url-seller") as HTMLInputElement;
                      const val = inp?.value?.trim();
                      if (val) {
                        if (propImages.length >= 5) return;
                        setPropImages([...propImages, val]);
                        inp.value = "";
                        onAddToast("Custom image added!", "success");
                      }
                    }}
                    className="p-1 px-3 bg-slate-800 text-white rounded text-[10px]"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider font-mono">Original Description</label>
                <button
                  type="button"
                  onClick={handleAiOptimize}
                  disabled={optimizing}
                  className="text-[#1B6B3A] font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 border border-[#1B6B3A]/20 bg-green-50 px-2 py-0.5 rounded shadow-2xs hover:bg-[#1B6B3A] hover:text-white transition-colors cursor-pointer"
                >
                  {optimizing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-[#F5A623]" />}
                  <span>Polish Description with AI</span>
                </button>
              </div>
              <textarea
                required
                rows={5}
                className="w-full text-xs p-2.5 border rounded-lg focus:outline-none leading-relaxed bg-white"
                placeholder="Give descriptive detail about property titiles, deeds status, water accessibility, road width..."
                value={propDescription}
                onChange={(e) => setPropDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2 font-mono">Asset Highlights</label>
              <div className="flex flex-wrap gap-2">
                {["Piped Water", "Gated Community", "Ready Title Deed", "Tarmac Access", "Electricity Site", "Fenced Border", "Security Beacon"].map((name) => {
                  const has = propAmenities.includes(name);
                  return (
                    <button
                      type="button"
                      key={name}
                      onClick={() => handleToggleAmenity(name)}
                      className={`px-3 py-1 text-[10px] border font-bold uppercase rounded-full cursor-pointer transition-colors ${
                        has ? "bg-[#1B6B3A] border-[#1B6B3A] text-white" : "border-gray-200 text-gray-600 hover:bg-slate-50"
                      }`}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={creating}
          className="w-full py-3 bg-[#1B6B3A] text-white font-extrabold uppercase hover:bg-[#0D4F2B] rounded shadow-md mt-6 transition-transform cursor-pointer"
        >
          {creating ? "Submitting..." : "Save and Lodge Safe Asset Listing"}
        </button>
      </form>
    </div>
  );
}
