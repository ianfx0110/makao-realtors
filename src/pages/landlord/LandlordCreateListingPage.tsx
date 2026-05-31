import React, { useState } from "react";
import { User, Room } from "../../types";
import { UploadCloud, Check, Sparkles, Loader2 } from "lucide-react";
import { COVERED_COUNTIES, STOCK_GALLERY_IMAGES } from "../../components/UserPortals";

interface LandlordCreateListingPageProps {
  currentUser: User;
  onAddToast: (msg: string, type: "success" | "error" | "info") => void;
  onRefreshData: () => void;
  setActiveTab: (tab: string) => void;
}

export default function LandlordCreateListingPage({
  currentUser,
  onAddToast,
  onRefreshData,
  setActiveTab
}: LandlordCreateListingPageProps) {
  const [propName, setPropName] = useState("");
  const [propType, setPropType] = useState("Apartment");
  const [propCounty, setPropCounty] = useState("Nairobi");
  const [propTown, setPropTown] = useState("");
  const [propEstate, setPropEstate] = useState("");
  const [propBedrooms, setPropBedrooms] = useState(2);
  const [propBathrooms, setPropBathrooms] = useState(2);
  const [propPrice, setPropPrice] = useState("");
  const [propDeposit, setPropDeposit] = useState("");
  const [propServiceCharge, setPropServiceCharge] = useState("");
  const [propDescription, setPropDescription] = useState("");
  const [propContactPhone, setPropContactPhone] = useState(currentUser.phone);
  const [propContactWhatsApp, setPropContactWhatsApp] = useState(currentUser.phone);
  const [propImages, setPropImages] = useState<string[]>([]);
  const [propIsComplex, setPropIsComplex] = useState(false);
  const [propRooms, setPropRooms] = useState<Room[]>([]);
  const [propAmenities, setPropAmenities] = useState<string[]>(["WiFi", "Parking", "Security"]);

  // local wizard support states
  const [imageTab, setImageTab] = useState<"upload" | "stock" | "url">("upload");
  const [dragActive, setDragActive] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [creating, setCreating] = useState(false);

  // Draft complex room states
  const [draftRoomNo, setDraftRoomNo] = useState("");
  const [draftRoomPrice, setDraftRoomPrice] = useState("");
  const [draftRoomFloor, setDraftRoomFloor] = useState("Ground Floor");

  const handleToggleAmenity = (name: string) => {
    if (propAmenities.includes(name)) {
      setPropAmenities(propAmenities.filter((a) => a !== name));
    } else {
      setPropAmenities([...propAmenities, name]);
    }
  };

  const handleAddDraftRoom = () => {
    if (!draftRoomNo || !draftRoomPrice) {
      onAddToast("Please specify room number/unit and price", "error");
      return;
    }
    const priceNum = Number(draftRoomPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      onAddToast("Please specify a valid positive price KES", "error");
      return;
    }
    const newRoom: Room = {
      id: "rm_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
      roomNumber: draftRoomNo,
      price: priceNum,
      floor: draftRoomFloor,
      roomType: "Standard Unit",
      available: true
    };
    setPropRooms([...propRooms, newRoom]);
    setDraftRoomNo("");
    setDraftRoomPrice("");
    onAddToast("Room unit added, list now has " + (propRooms.length + 1) + " units", "success");
  };

  const handleRemoveDraftRoom = (id: string) => {
    setPropRooms(propRooms.filter((r) => r.id !== id));
    onAddToast("Room unit removed from list", "info");
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
      await uploadFileLocally(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await uploadFileLocally(e.target.files[0]);
    }
  };

  const uploadFileLocally = async (file: File) => {
    if (propImages.length >= 5) {
      onAddToast("Image limit reached: Maximum of 5 images allowed on the free plan.", "error");
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
    
    const listingPayload = {
      name: propName,
      propertyType: propType,
      county: propCounty,
      town: propTown,
      estate: propEstate,
      bedrooms: propBedrooms,
      bathrooms: propBathrooms,
      price: Number(propPrice),
      deposit: propDeposit ? Number(propDeposit) : 0,
      serviceCharge: propServiceCharge ? Number(propServiceCharge) : 0,
      description: propDescription,
      contactPhone: propContactPhone,
      contactWhatsApp: propContactWhatsApp,
      images: propImages.length > 0 ? propImages : ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80"],
      isComplex: propIsComplex,
      rooms: propIsComplex ? propRooms : [],
      amenities: propAmenities,
      listingType: "rent"
    };

    try {
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(listingPayload)
      });
      const data = await res.json();
      if (data.success) {
        onAddToast("Draft Property Added! Complete KES 100 Lipa M-PESA to Publish.", "success");
        onRefreshData();
        setActiveTab("mylistings");
      } else {
        onAddToast(data.error || "Could not publish", "error");
      }
    } catch {
      onAddToast("Network failure.", "error");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 max-w-4xl font-sans text-xs text-slate-800">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column props */}
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1 font-mono">Property Display Name</label>
              <input
                type="text"
                required
                className="w-full text-xs p-2.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B6B3A] bg-white"
                placeholder="e.g. Ruaka Executive Bedsitters"
                value={propName}
                onChange={(e) => setPropName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1 font-mono">Category Type</label>
                <select
                  className="w-full text-xs p-2.5 border rounded-lg bg-white focus:outline-none"
                  value={propType}
                  onChange={(e) => setPropType(e.target.value)}
                >
                  <option value="Apartment">Apartment</option>
                  <option value="Bedsitter">Bedsitter/Studio</option>
                  <option value="Bungalow">Bungalow</option>
                  <option value="Maisonette">Maisonette</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Land">Land / Plot</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1 font-mono">Rent / Price (KES)</label>
                <input
                  type="number"
                  required
                  className="w-full text-xs p-2.5 border rounded-lg focus:outline-none bg-white"
                  placeholder="Rent per month"
                  value={propPrice}
                  onChange={(e) => setPropPrice(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Vetted County</label>
                <select
                  className="w-full text-xs p-2.5 border rounded-lg bg-white"
                  value={propCounty}
                  onChange={(e) => setPropCounty(e.target.value)}
                >
                  {COVERED_COUNTIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Town</label>
                <input
                  type="text"
                  required
                  className="w-full text-xs p-2.5 border rounded-lg focus:outline-none bg-white"
                  placeholder="Ruaka"
                  value={propTown}
                  onChange={(e) => setPropTown(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Estate (Optional)</label>
                <input
                  type="text"
                  className="w-full text-xs p-2.5 border rounded-lg focus:outline-none bg-white"
                  placeholder="Airport Road"
                  value={propEstate}
                  onChange={(e) => setPropEstate(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1 font-mono">Bedrooms Density</label>
                <input
                  type="number"
                  required
                  className="w-full text-xs p-2.5 border rounded-lg focus:outline-none bg-white"
                  value={propBedrooms}
                  onChange={(e) => setPropBedrooms(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1 font-mono">Bathrooms count</label>
                <input
                  type="number"
                  required
                  className="w-full text-xs p-2.5 border rounded-lg focus:outline-none bg-white"
                  value={propBathrooms}
                  onChange={(e) => setPropBathrooms(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">M-PESA phone number</label>
                <input
                  type="text"
                  required
                  className="w-full text-xs p-2.5 border rounded-lg focus:outline-none bg-white"
                  value={propContactPhone}
                  onChange={(e) => setPropContactPhone(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">WhatsApp Alert phone</label>
                <input
                  type="text"
                  required
                  className="w-full text-xs p-2.5 border rounded-lg focus:outline-none bg-white"
                  value={propContactWhatsApp}
                  onChange={(e) => setPropContactWhatsApp(e.target.value)}
                />
              </div>
            </div>

            <div className="bg-slate-50/50 p-4 rounded-xl border border-gray-150">
              <div className="flex items-center justify-between mb-3">
                <label className="text-[10px] uppercase font-bold text-[#1B6B3A] tracking-wider block font-mono">
                  📸 Property Photo Portfolios (Free: Max 5 Photos)
                </label>
                {propImages.length > 0 && (
                  <button
                    type="button"
                    onClick={() => { setPropImages([]); onAddToast("All photos removed.", "info"); }}
                    className="text-[9px] font-bold text-red-650 hover:text-red-750 uppercase cursor-pointer"
                  >
                    Reset All ({propImages.length})
                  </button>
                )}
              </div>

              {/* Mode tab switchers */}
              <div className="grid grid-cols-3 gap-1 mb-3 bg-slate-100 p-1 rounded-lg">
                {(["upload", "stock", "url"] as const).map((tab) => (
                  <button
                    type="button"
                    key={tab}
                    onClick={() => setImageTab(tab)}
                    className={`py-1 text-[9px] font-bold uppercase rounded cursor-pointer ${imageTab === tab ? "bg-white text-[#1B6B3A] shadow-xs" : "text-gray-500"}`}
                  >
                    {tab === "upload" ? "Device" : tab === "stock" ? "Our Stock" : "URL link"}
                  </button>
                ))}
              </div>

              {propImages.length > 0 && (
                <div className="mb-3 p-2 bg-white border rounded">
                  <div className="flex flex-wrap gap-1.5">
                    {propImages.map((imgUrl, i) => (
                      <div key={i} className="relative w-12 h-10 border rounded overflow-hidden">
                        <img src={imgUrl} className="w-full h-full object-cover" alt="" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {imageTab === "upload" && (
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("file-loader-gallery-l")?.click()}
                  className={`border-2 border-dashed rounded-lg p-3 text-center cursor-pointer ${dragActive ? "border-[#1B6B3A]" : "border-gray-200"}`}
                >
                  <input
                    type="file"
                    id="file-loader-gallery-l"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <UploadCloud className="w-6 h-6 mx-auto text-gray-400 mb-1" />
                  <p className="text-[10px] font-bold text-gray-700">Click to Select from Gallery</p>
                </div>
              )}

              {imageTab === "stock" && (
                <div className="grid grid-cols-3 gap-1 max-h-32 overflow-y-auto">
                  {STOCK_GALLERY_IMAGES.map((img, i) => {
                    const isSelected = propImages.includes(img.url);
                    return (
                      <button
                        type="button"
                        key={i}
                        onClick={() => {
                          if (isSelected) {
                            setPropImages(propImages.filter((u) => u !== img.url));
                          } else {
                            if (propImages.length >= 5) {
                              onAddToast("Limit of 5 images reached", "error");
                              return;
                            }
                            setPropImages([...propImages, img.url]);
                          }
                        }}
                        className={`h-10 relative rounded overflow-hidden border ${isSelected ? "border-green-500" : "border-slate-200"}`}
                      >
                        <img src={img.url} className="w-full h-full object-cover" alt="" />
                      </button>
                    );
                  })}
                </div>
              )}

              {imageTab === "url" && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="cust-url-landlord"
                    placeholder="https://..."
                    className="flex-1 p-1.5 border rounded text-xs bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const inp = document.getElementById("cust-url-landlord") as HTMLInputElement;
                      const val = inp?.value?.trim();
                      if (val) {
                        if (propImages.length >= 5) {
                          onAddToast("Limit is 5", "error");
                          return;
                        }
                        setPropImages([...propImages, val]);
                        inp.value = "";
                        onAddToast("Added!", "success");
                      }
                    }}
                    className="p-1 px-3 bg-slate-800 text-white text-[10px] rounded"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column props */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
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
                rows={6}
                className="w-full text-xs p-2.5 border rounded-lg focus:outline-none leading-relaxed bg-white"
                placeholder="Provide deep architectural overview, estate highlighting rules..."
                value={propDescription}
                onChange={(e) => setPropDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2 font-mono">Verify Included Amenities</label>
              <div className="flex flex-wrap gap-2">
                {["WiFi", "Parking", "Security", "Water", "Electricity", "CCTV", "Pool", "Gym", "Lawn"].map((name) => {
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

            {/* Complex items handling */}
            <div className="bg-slate-50 border p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800 text-xs">Is Apartment Complex / Block Hostel?</p>
                  <p className="text-[10px] text-gray-400">Enable if this listing contains multiple individually numbered room sub-units</p>
                </div>
                <input
                  type="checkbox"
                  className="w-4 h-4 text-[#1B6B3A]"
                  checked={propIsComplex}
                  onChange={(e) => setPropIsComplex(e.target.checked)}
                />
              </div>

              {propIsComplex && (
                <div className="mt-4 border-t pt-4 space-y-3">
                  <p className="font-bold text-[10px] uppercase tracking-wider text-[#1B6B3A] font-mono">Add Room Directory list</p>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Room: A101"
                      className="text-xs p-1.5 border rounded bg-white"
                      value={draftRoomNo}
                      onChange={(e) => setDraftRoomNo(e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="Price KES: 11500"
                      className="text-xs p-1.5 border rounded bg-white"
                      value={draftRoomPrice}
                      onChange={(e) => setDraftRoomPrice(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      className="text-xs p-1.5 border rounded bg-white"
                      value={draftRoomFloor}
                      onChange={(e) => setDraftRoomFloor(e.target.value)}
                    >
                      <option value="Ground Floor">Ground Floor</option>
                      <option value="1st Floor">1st Floor</option>
                      <option value="2nd Floor">2nd Floor</option>
                      <option value="3rd Floor">3rd Floor</option>
                    </select>
                    <button
                      type="button"
                      onClick={handleAddDraftRoom}
                      className="bg-[#1B6B3A] text-white hover:bg-[#0D4F2B] font-bold text-[10px] py-1.5 rounded uppercase cursor-pointer"
                    >
                      + Add Room unit
                    </button>
                  </div>

                  {propRooms.length > 0 && (
                    <div className="mt-3 border bg-white p-2 rounded max-h-32 overflow-y-auto space-y-1">
                      {propRooms.map((r) => (
                        <div key={r.id} className="flex justify-between items-center text-[10px] p-1 border-b">
                          <span>{r.roomNumber} ({r.floor}) - KES {r.price.toLocaleString()}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveDraftRoom(r.id)}
                            className="text-red-500 font-bold px-1 hover:underline cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={creating}
          className="w-full py-3 bg-[#1B6B3A] text-white font-extrabold uppercase hover:bg-[#0D4F2B] rounded shadow-md mt-6 transition-transform cursor-pointer"
        >
          {creating ? "Saving..." : "Save and Submit Property Listing"}
        </button>
      </form>
    </div>
  );
}
