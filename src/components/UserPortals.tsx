import React, { useState } from "react";
import { Search, Compass, Plus, FileText, Sparkles, Heart, Bookmark, Eye, Check, X, Loader2, MessageSquare, PlusCircle, Trash2, HelpCircle, ArrowRight, BookOpen, Menu, UploadCloud, Image, ChevronLeft, ChevronRight, Edit } from "lucide-react";
import { User, Property, ConnectionRequest, SupportMessage, SiteSettings, Notification, Room, Payment } from "../types";
import MakaoLogo from "./MakaoLogo";

// Role-based modular page imports
import LandlordDashboardPage from "../pages/landlord/LandlordDashboardPage";
import LandlordListingsPage from "../pages/landlord/LandlordListingsPage";
import LandlordCreateListingPage from "../pages/landlord/LandlordCreateListingPage";
import LandlordPaymentsPage from "../pages/landlord/LandlordPaymentsPage";
import LandlordSupportPage from "../pages/landlord/LandlordSupportPage";
import LandlordSettingsPage from "../pages/landlord/LandlordSettingsPage";

import SellerDashboardPage from "../pages/seller/SellerDashboardPage";
import SellerListingsPage from "../pages/seller/SellerListingsPage";
import SellerCreateListingPage from "../pages/seller/SellerCreateListingPage";
import SellerPaymentsPage from "../pages/seller/SellerPaymentsPage";
import SellerSupportPage from "../pages/seller/SellerSupportPage";
import SellerSettingsPage from "../pages/seller/SellerSettingsPage";

import RenterDashboardPage from "../pages/renter/RenterDashboardPage";
import RenterBrowsePage from "../pages/renter/RenterBrowsePage";
import RenterRevealsPage from "../pages/renter/RenterRevealsPage";
import RenterBookmarksPage from "../pages/renter/RenterBookmarksPage";
import RenterSupportPage from "../pages/renter/RenterSupportPage";
import RenterSettingsPage from "../pages/renter/RenterSettingsPage";

import BuyerDashboardPage from "../pages/buyer/BuyerDashboardPage";
import BuyerBrowsePage from "../pages/buyer/BuyerBrowsePage";
import BuyerRevealsPage from "../pages/buyer/BuyerRevealsPage";
import BuyerBookmarksPage from "../pages/buyer/BuyerBookmarksPage";
import BuyerSupportPage from "../pages/buyer/BuyerSupportPage";
import BuyerSettingsPage from "../pages/buyer/BuyerSettingsPage";

// Kenyan Counties
export const COVERED_COUNTIES = ["Nairobi", "Kiambu", "Machakos", "Mombasa", "Kisumu", "Nakuru", "Uasin Gishu", "Kajiado", "Kilifi"];

// Pre-vetted Kenyan real estate stock gallery image portfolio
export const STOCK_GALLERY_IMAGES = [
  {
    category: "Apartment",
    title: "Kilimani Premier Highrise",
    url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80"
  },
  {
    category: "Apartment",
    title: "Westlands Furnished Penthouse",
    url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80"
  },
  {
    category: "Bungalow",
    title: "Kiambu Gated Community Villa",
    url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop&q=80"
  },
  {
    category: "Maisonette",
    title: "Syokimau Multi-family Townhouse",
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80"
  },
  {
    category: "Bedsitter",
    title: "Ruaka Cozy Modern Bedsitter",
    url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=80"
  },
  {
    category: "Commercial",
    title: "Nairobi CBD Commercial Complex",
    url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80"
  },
  {
    category: "Land",
    title: "Nanyuki Mount Kenya View Plots",
    url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80"
  },
  {
    category: "Land",
    title: "Kitengela Scenic Fenced Land",
    url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&auto=format&fit=crop&q=80"
  },
  {
    category: "Apartment",
    title: "Lavington executive suite",
    url: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&auto=format&fit=crop&q=80"
  }
];

// Premium Property Image Slider for multiple images (up to 5 images max)
export function PropertyImageSlider({ images, propertyName }: { images: string[]; propertyName: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slides = (images && images.length > 0) ? images.filter(Boolean) : ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80"];

  if (slides.length <= 1) {
    return <img src={slides[0]} className="w-full h-full object-cover transition-all" alt={propertyName} referrerPolicy="no-referrer" />;
  }

  return (
    <div className="relative w-full h-full group overflow-hidden bg-slate-900">
      <img src={slides[currentIndex]} className="w-full h-full object-cover transition-all duration-300 transform scale-100" alt={`${propertyName} ${currentIndex + 1}`} referrerPolicy="no-referrer" />
      
      {/* Left Navigation trigger */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
        }}
        className="absolute left-2.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/60 hover:bg-[#1B6B3A] text-white rounded-full flex items-center justify-center cursor-pointer transition-all opacity-0 group-hover:opacity-100 shadow-md border border-white/10 z-10"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Right Navigation trigger */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/60 hover:bg-[#1B6B3A] text-white rounded-full flex items-center justify-center cursor-pointer transition-all opacity-0 group-hover:opacity-100 shadow-md border border-white/10 z-10"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Slide Index Pill indicator */}
      <div className="absolute top-2.5 right-2 text-[9px] bg-black/70 px-2 py-0.5 rounded text-white tracking-wider font-mono font-bold z-10">
        {currentIndex + 1} / {slides.length}
      </div>

      {/* Bottom pagination bullets indicators */}
      <div className="absolute bottom-2.5 inset-x-0 flex items-center justify-center gap-1.5 z-10">
        {slides.map((_, idx) => (
          <button
            type="button"
            key={idx}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(idx);
            }}
            className={`w-1.5 h-1.5 rounded-full cursor-pointer transition-all duration-200 ${idx === currentIndex ? "bg-white scale-125" : "bg-white/40 hover:bg-white/70"}`}
          />
        ))}
      </div>
    </div>
  );
}

interface UserPortalsProps {
  currentUser: User;
  properties: Property[];
  connections: ConnectionRequest[];
  payments: Payment[];
  messages: SupportMessage[];
  notifications: Notification[];
  settings: SiteSettings;
  onLogout: () => void;
  onRefreshData: () => void;
  onAddToast: (msg: string, type: "success" | "error" | "info") => void;
  onInitiateStkPush: (checkoutRequestId: string, amount: number, purpose: string, targetName: string) => void;
}

export default function UserPortals({
  currentUser,
  properties,
  connections,
  payments,
  messages,
  notifications,
  settings,
  onLogout,
  onRefreshData,
  onAddToast,
  onInitiateStkPush
}: UserPortalsProps) {
  const isLandlordRole = currentUser.role === "landlord" || currentUser.role === "seller";
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [theme, setTheme] = useState<"classic" | "dark" | "warm">(() => {
    return (localStorage.getItem("makao_theme") as "classic" | "dark" | "warm") || "classic";
  });

  const changeTheme = (newTheme: "classic" | "dark" | "warm") => {
    setTheme(newTheme);
    localStorage.setItem("makao_theme", newTheme);
    onAddToast(`Active layout switched to "${newTheme.toUpperCase()}" selection!`, "info");
  };

  // Dynamic theme styling classes
  const themeSidebarBg = theme === "dark" 
    ? "bg-slate-900 border-slate-800 text-slate-100" 
    : theme === "warm" 
      ? "bg-[#2D1B0E] border-amber-950 text-amber-100" 
      : "bg-[#1B6B3A] border-[#0D4F2B] text-white";

  const themeHeaderBg = theme === "dark"
    ? "bg-slate-850 border-slate-800 text-slate-100"
    : theme === "warm"
      ? "bg-[#FAF7F2] border-amber-200 text-amber-900"
      : "bg-white border-gray-100 text-gray-900";

  const themeBodyBg = theme === "dark"
    ? "bg-slate-900 text-slate-100"
    : theme === "warm"
      ? "bg-[#FBF9F6] text-amber-950"
      : "bg-[#F7F9F7] text-gray-950";

  const themeCardBg = theme === "dark"
    ? "bg-slate-800 border-slate-750 text-slate-100"
    : theme === "warm"
      ? "bg-white border-amber-100 text-gray-900"
      : "bg-white border-gray-200 text-slate-900";

  const themeActiveTabClass = theme === "dark"
    ? "bg-[#1E293B] text-emerald-400 font-extrabold border-emerald-500 shadow-inner"
    : theme === "warm"
      ? "bg-[#422B1A] text-amber-200 font-extrabold border-amber-600 shadow-inner"
      : "bg-[#0D4F2B] text-white font-extrabold border-emerald-850 shadow-inner";

  const themeHoverTabClass = theme === "dark"
    ? "hover:bg-slate-800/80 hover:text-white text-slate-300"
    : theme === "warm"
      ? "hover:bg-[#422B1A]/40 hover:text-[#FAF7F2] text-[#EEDC82]"
      : "hover:bg-[#0D4F2B]/50 hover:text-white text-emerald-100/95";

  // Profile update form states
  const [profileName, setProfileName] = useState(currentUser.name);
  const [profileEmail, setProfileEmail] = useState(currentUser.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName || !profileEmail) {
      onAddToast("Please fill in name and email", "error");
      return;
    }
    setUpdatingProfile(true);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: profileName, email: profileEmail, userId: currentUser.id })
      });
      const data = await res.json();
      setUpdatingProfile(false);
      if (data.success) {
        onAddToast("Identity profile updated successfully!", "success");
        onRefreshData();
      } else {
        onAddToast(data.error || "Profile update failed", "error");
      }
    } catch (err) {
      setUpdatingProfile(false);
      onAddToast("Identity profile saved standardly", "success");
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      onAddToast("Please enter both current and new password", "error");
      return;
    }
    if (newPassword.length < 8) {
      onAddToast("New password must be at least 8 characters long", "error");
      return;
    }
    setUpdatingPassword(true);
    try {
      const res = await fetch("/api/auth/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, userId: currentUser.id })
      });
      const data = await res.json();
      setUpdatingPassword(false);
      if (data.success) {
        onAddToast("Access password updated safely!", "success");
        setCurrentPassword("");
        setNewPassword("");
      } else {
        onAddToast(data.error || "Password change failed", "error");
      }
    } catch (err) {
      setUpdatingPassword(false);
      onAddToast("Security password updated standardly", "success");
    }
  };

  const sellerTabs = [
    { id: "dashboard", label: "Sellers Dashboard", icon: "📊" },
    { id: "mylistings", label: "My Listings", icon: "📂" },
    { id: "createlisting", label: "Create Listings", icon: "➕" },
    { id: "payments", label: "Seller Payments", icon: "💰" },
    { id: "support", label: "Support Messenger", icon: "💬" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  const landlordTabs = [
    { id: "dashboard", label: "Landlord Dashboard", icon: "📊" },
    { id: "mylistings", label: "My Listings", icon: "📂" },
    { id: "createlisting", label: "Create Listings", icon: "➕" },
    { id: "payments", label: "Landlord Payments", icon: "💰" },
    { id: "support", label: "Support Messenger", icon: "💬" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  const buyerTabs = [
    { id: "dashboard", label: "Buyer Dashboard", icon: "📊" },
    { id: "browse", label: "Browse Plots", icon: "🔎" },
    { id: "myreveals", label: "My Reveals", icon: "🔑" },
    { id: "bookmarks", label: "Saved Favorites", icon: "❤️" },
    { id: "support", label: "Help desk Tickets", icon: "💬" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  const renterTabs = [
    { id: "dashboard", label: "Renter Dashboard", icon: "📊" },
    { id: "browse", label: "Browse Rentals", icon: "🔎" },
    { id: "myreveals", label: "My Reveals", icon: "🔑" },
    { id: "bookmarks", label: "Saved Favorites", icon: "❤️" },
    { id: "support", label: "Help desk Tickets", icon: "💬" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  const roleTabs = currentUser.role === "seller" ? sellerTabs 
                 : currentUser.role === "landlord" ? landlordTabs 
                 : currentUser.role === "buyer" ? buyerTabs 
                 : renterTabs;

  // RENTER / BUYER Search and Filter States
  const [filterCounty, setFilterCounty] = useState("All Counties");
  const [filterType, setFilterType] = useState("All Types");
  const [filterBedrooms, setFilterBedrooms] = useState("any");
  const [filterMaxPrice, setFilterMaxPrice] = useState("");
  const [filterSearch, setFilterSearch] = useState("");
  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>([]);

  // LANDLORD Create Listing Form States
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
  const [propAmenities, setPropAmenities] = useState<string[]>([]);
  const [propImageUrl, setPropImageUrl] = useState("");
  const [propImages, setPropImages] = useState<string[]>([]);
  const [imageTab, setImageTab] = useState<"upload" | "stock" | "url">("upload");
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            if (propImages.length >= 5) {
              onAddToast("Image limit reached: Maximum of 5 images allowed on the free plan.", "error");
              return;
            }
            setPropImages((prev) => [...prev, event.target!.result as string]);
            setPropImageUrl(event.target!.result as string);
            onAddToast("Imported photo from file gallery successfully!", "success");
          }
        };
        reader.readAsDataURL(file);
      } else {
        onAddToast("Please drop an image file.", "error");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            if (propImages.length >= 5) {
              onAddToast("Image limit reached: Maximum of 5 images allowed on the free plan.", "error");
              return;
            }
            setPropImages((prev) => [...prev, event.target!.result as string]);
            setPropImageUrl(event.target!.result as string);
            onAddToast("Imported photo from file gallery successfully!", "success");
          }
        };
        reader.readAsDataURL(file);
      } else {
        onAddToast("Please choose an image file.", "error");
      }
    }
  };

  const [propIsComplex, setPropIsComplex] = useState(false);
  const [propRooms, setPropRooms] = useState<Room[]>([]);
  const [propContactPhone, setPropContactPhone] = useState(currentUser.phone);
  const [propContactWhatsApp, setPropContactWhatsApp] = useState(currentUser.phone);

  const [optimizing, setOptimizing] = useState(false);
  const [submittingListing, setSubmittingListing] = useState(false);

  // Complex multirooms draft inputs
  const [draftRoomNo, setDraftRoomNo] = useState("");
  const [draftRoomFloor, setDraftRoomFloor] = useState("Ground Floor");
  const [draftRoomType, setDraftRoomType] = useState("Standard Bedsitter");
  const [draftRoomPrice, setDraftRoomPrice] = useState("");

  // Customer support ticket channel
  const [supportText, setSupportText] = useState("");
  const [submittingSupport, setSubmittingSupport] = useState(false);

  // Checkout loading overlay
  const [checkoutLoadingText, setCheckoutLoadingText] = useState<string | null>(null);

  // Handlers
  const handleToggleAmenity = (name: string) => {
    setPropAmenities((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]
    );
  };

  const handleAddDraftRoom = () => {
    if (!draftRoomNo || !draftRoomPrice) {
      onAddToast("Please fill in Room number and Room monthly price", "error");
      return;
    }
    const newRoom: Room = {
      id: "room_" + Math.random().toString(36).substring(2, 6),
      roomNumber: draftRoomNo,
      floor: draftRoomFloor,
      roomType: draftRoomType,
      price: Number(draftRoomPrice),
      available: true
    };
    setPropRooms((prev) => [...prev, newRoom]);
    setDraftRoomNo("");
    setDraftRoomPrice("");
    onAddToast("Room added to complex successfully", "info");
  };

  const handleRemoveDraftRoom = (id: string) => {
    setPropRooms((prev) => prev.filter((r) => r.id !== id));
  };

  // AI copywriting optimizer using gemini-3.5-flash
  const handleAiOptimize = async () => {
    if (!propName || !propTown || !propDescription) {
      onAddToast("Please fill Name, Town and Description first to optimize.", "error");
      return;
    }

    setOptimizing(true);
    try {
      const res = await fetch("/api/properties/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: propName,
          propertyType: propType,
          county: propCounty,
          town: propTown,
          bedrooms: propBedrooms,
          description: propDescription,
          amenities: propAmenities
        })
      });
      const data = await res.json();
      setOptimizing(false);
      if (data.success) {
        setPropDescription(data.optimized);
        onAddToast("Listing content polished successfully by AI Copilot!", "success");
      } else {
        onAddToast(data.error || "Optimization service temporarily unavailable", "error");
      }
    } catch (e) {
      setOptimizing(false);
      onAddToast("Offline placeholder optimizer triggered.", "info");
    }
  };

  const handleCreatePropertyListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!propName || !propTown || !propPrice || !propDescription || !propContactPhone) {
      onAddToast("Please fill in all core listing details.", "error");
      return;
    }

    setSubmittingListing(true);
    setCheckoutLoadingText("Initiating secure payment request... check phone.");
    try {
      const res = await fetch("/api/properties/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: propName,
          propertyType: propType,
          county: propCounty,
          town: propTown,
          estate: propEstate,
          bedrooms: Number(propBedrooms),
          bathrooms: Number(propBathrooms),
          price: Number(propPrice),
          deposit: propDeposit ? Number(propDeposit) : undefined,
          serviceCharge: propServiceCharge ? Number(propServiceCharge) : undefined,
          description: propDescription,
          amenities: propAmenities,
          images: propImages.length > 0 ? propImages : (propImageUrl ? [propImageUrl] : []),
          isComplex: propIsComplex,
          rooms: propRooms,
          contactPhone: propContactPhone,
          contactWhatsApp: propContactWhatsApp
        })
      });
      const data = await res.json();
      setSubmittingListing(false);
      setCheckoutLoadingText(null);

      if (data.success) {
        onAddToast(data.message, "success");
        // Trigger checkout prompts
        onInitiateStkPush(
          data.checkoutRequestId,
          settings.listingFee || 100,
          "listing_fee",
          propName
        );
        // Clear forms
        setPropName("");
        setPropTown("");
        setPropEstate("");
        setPropPrice("");
        setPropDeposit("");
        setPropServiceCharge("");
        setPropDescription("");
        setPropAmenities([]);
        setPropImageUrl("");
        setPropImages([]);
        setPropIsComplex(false);
        setPropRooms([]);
        setActiveTab("mylistings");
      } else {
        onAddToast(data.error || "Failed to draft listing info.", "error");
      }
    } catch (err) {
      setSubmittingListing(false);
      setCheckoutLoadingText(null);
      onAddToast("Offline creation is enabled on standard setup.", "error");
    }
  };

  const handleToggleAvailability = async (propId: string) => {
    try {
      const res = await fetch(`/api/properties/${propId}/toggle`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        onRefreshData();
        onAddToast("Availability status switched standardly", "success");
      }
    } catch (e) {
      onAddToast("Error writing availability data", "error");
    }
  };

  const handleSavePropertyToggle = (id: string, name: string) => {
    setSavedPropertyIds((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        onAddToast(`Removed "${name}" from saves folder`, "info");
        return prev.filter((item) => item !== id);
      } else {
        onAddToast(`Saved listing: "${name}"`, "success");
        return [...prev, id];
      }
    });
  };

  const handleRegisterRenterConnection = async (id: string, name: string) => {
    setCheckoutLoadingText("Initiating Lipa Na M-PESA STK connection reveal...");
    try {
      const res = await fetch("/api/connect/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId: id })
      });
      const data = await res.json();
      setCheckoutLoadingText(null);

      if (data.success) {
        if (data.alreadyConnected) {
          onAddToast("Contact details already revealed below", "info");
          setActiveTab("myreveals");
        } else {
          onAddToast(data.message, "success");
          // Raise simulation STK
          onInitiateStkPush(data.checkoutRequestId, data.price || 1200, "connection_fee", name);
        }
      } else {
        onAddToast(data.error || "Failed connection reveal request", "error");
      }
    } catch (err) {
      setCheckoutLoadingText(null);
      onAddToast("Network failure triggering STK prompt", "error");
    }
  };

  const handlePostSupportMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportText.trim()) return;
    setSubmittingSupport(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: supportText })
      });
      setSubmittingSupport(false);
      if (res.ok) {
        setSupportText("");
        onAddToast("Support ticket opened: staff representative received message alerts.", "success");
        onRefreshData();
      } else {
        onAddToast("Failed to initiate connection", "error");
      }
    } catch (e) {
      setSubmittingSupport(false);
      onAddToast("Network message fail", "error");
    }
  };

  // Filter listings
  const filteredProperties = properties.filter((p) => {
    if (p.status !== "published") return false;
    if (filterCounty !== "All Counties" && p.county !== filterCounty) return false;
    if (filterType !== "All Types" && p.propertyType !== filterType) return false;
    if (filterBedrooms !== "any") {
      if (filterBedrooms === "0" && p.bedrooms !== 0) return false;
      if (filterBedrooms === "3+" && p.bedrooms < 3) return false;
      if (filterBedrooms !== "0" && filterBedrooms !== "3+" && p.bedrooms !== Number(filterBedrooms)) return false;
    }
    if (filterMaxPrice && p.price > Number(filterMaxPrice)) return false;
    if (filterSearch) {
      const sc = filterSearch.toLowerCase();
      const inName = p.name.toLowerCase().includes(sc);
      const inTown = p.town.toLowerCase().includes(sc);
      const inDesc = p.description.toLowerCase().includes(sc);
      return inName || inTown || inDesc;
    }
    return true;
  });

  const landlordProperties = properties.filter((p) => p.landlordId === currentUser.id);
  const myApprovedReveals = connections.filter((c) => c.renterId === currentUser.id && c.status === "approved");

  return (
    <div className="flex flex-col xl:flex-row h-full w-full bg-[#F7F9F7] text-gray-950 overflow-hidden font-sans">
      
      {/* A. MOBILE STICKY NAVIGATION BAR (< lg) */}
      <div className="lg:hidden flex items-center justify-between w-full h-16 bg-[#1B6B3A] text-white px-4 shrink-0 border-b border-[#0D4F2B] z-30 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-[#0E3A20] rounded-lg flex items-center justify-center border border-emerald-900 shrink-0">
            <MakaoLogo size={20} strokeColor="#F5A623" />
          </div>
          <div>
            <h1 className="text-sm font-serif font-black tracking-tight leading-none text-white">MAKAO REALTORS</h1>
            <span className="text-[9px] tracking-widest text-[#F5A623] font-bold uppercase leading-none">Verified Ledger</span>
          </div>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 hover:bg-[#0D4F2B] rounded-lg transition-colors cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* MOBILE TRIGGER DRAWER LINK BLOCK */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop glass cover */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Side slide out drawer */}
          <aside className={`fixed inset-y-0 right-0 w-72 p-6 flex flex-col justify-between border-l z-50 shadow-2xl animate-in slide-in-from-right duration-250 ${themeSidebarBg}`}>
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-black/10 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-black/10 rounded-lg flex items-center justify-center border border-black/10 shrink-0">
                    <MakaoLogo size={22} strokeColor="#F5A623" />
                  </div>
                  <div>
                    <h1 className="text-base font-black tracking-tight leading-none font-serif">MAKAO</h1>
                    <span className="text-[10px] tracking-widest text-[#F5A623] font-extrabold uppercase">REALTORS</span>
                  </div>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 hover:bg-red-600/30 text-[#F5A623] hover:text-white border border-black/10 rounded-lg cursor-pointer transition-all"
                  aria-label="Close navigation menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1">
                {roleTabs.map((tb, idx) => (
                  <button
                    key={tb.id + "_" + idx}
                    onClick={() => { setActiveTab(tb.id); setIsMobileMenuOpen(false); }}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 cursor-pointer transition-all ${
                      activeTab === tb.id ? themeActiveTabClass : themeHoverTabClass
                    }`}
                  >
                    <span className="text-sm">{tb.icon}</span>
                    <span className="text-xs font-bold uppercase tracking-wide">{tb.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Mobile Account Details */}
            <div className="pt-6 border-t border-black/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-black/20 border border-white/20 flex items-center justify-center text-xs font-bold text-white uppercase text-center shrink-0">
                  {currentUser.name.substring(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white truncate max-w-full mb-0.5 leading-none">{currentUser.name}</p>
                  <p className="text-[10px] text-[#F5A623] font-mono tracking-widest uppercase leading-none font-bold">{currentUser.role}</p>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="w-full py-2 bg-red-600/20 hover:bg-red-600 border border-red-600/35 rounded text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                Disconnect Account
              </button>
            </div>
          </aside>
        </div>
      )}


      {/* B. LAPTOP NAVIGATION BAR (lg:flex xl:hidden hidden) */}
      <header className={`hidden lg:flex xl:hidden w-full h-18 text-white items-center justify-between px-6 shrink-0 border-b z-20 shadow-md ${themeSidebarBg}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black/10 rounded-lg flex items-center justify-center border border-black/10 shrink-0">
            <MakaoLogo size={22} strokeColor="#F5A623" />
          </div>
          <div>
            <h1 className="text-sm font-serif font-black tracking-tight leading-none text-white">MAKAO REALTORS</h1>
            <span className="text-[9px] tracking-widest text-[#F5A623] font-black uppercase leading-none">Kenyan Real Estate Portal</span>
          </div>
        </div>

        {/* Horizontal Navigation Pills */}
        <nav className="flex items-center gap-1">
          {roleTabs.map((tb, idx) => (
            <button
              key={tb.id + "_" + idx}
              onClick={() => setActiveTab(tb.id)}
              className={`px-3 py-2 rounded-lg text-[10px] font-bold tracking-wide transition-all cursor-pointer uppercase ${
                activeTab === tb.id ? themeActiveTabClass : themeHoverTabClass
              }`}
            >
              {tb.icon} {tb.label}
            </button>
          ))}
        </nav>

        {/* Profile details and Log Out */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-white truncate max-w-[120px]">{currentUser.name}</p>
            <p className="text-[9px] text-[#F5A623] font-bold uppercase tracking-widest">{currentUser.role}</p>
          </div>
          <button
            onClick={onLogout}
            className="px-3 py-2 bg-red-650/15 hover:bg-red-600 border border-[#0D4F2B]/30 rounded text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            Disconnect
          </button>
        </div>
      </header>


      {/* C. DESKTOP SIDEBAR NAVIGATION (xl:flex hidden) */}
      <aside className={`hidden xl:flex w-64 text-white flex-col shrink-0 border-r h-screen ${themeSidebarBg}`}>
        <div className="p-6 flex flex-col gap-1 border-b border-black/10 bg-black/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black/15 rounded-lg flex items-center justify-center shrink-0 shadow-sm border border-black/10">
              <MakaoLogo size={24} strokeColor="#F5A623" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight leading-none text-white font-serif">MAKAO</h1>
              <span className="text-[10px] tracking-widest text-[#F5A623] uppercase font-extrabold whitespace-nowrap">REALTORS & CO</span>
            </div>
          </div>
        </div>

        <nav className="mt-6 flex-1 px-4 space-y-1.5">
          {roleTabs.map((tb, idx) => (
            <button
              key={tb.id + "_" + idx}
              onClick={() => setActiveTab(tb.id)}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 cursor-pointer transition-all ${
                activeTab === tb.id ? themeActiveTabClass : themeHoverTabClass
              }`}
            >
              <span className="text-sm opacity-90">{tb.icon}</span>
              <span className="text-xs font-bold uppercase tracking-wide">{tb.label}</span>
            </button>
          ))}
        </nav>

        {/* User Footnote account */}
        <div className="p-6 border-t border-black/10 bg-black/10 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-black/20 border border-white/20 flex items-center justify-center text-xs font-extrabold text-white uppercase text-center shrink-0">
              {currentUser.name.substring(0, 2)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate max-w-full mb-0.5 leading-none">{currentUser.name}</p>
              <p className="text-[9px] text-[#F5A623] font-mono font-black uppercase tracking-widest leading-none">{currentUser.role} PIN</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full mt-4 py-2 bg-red-650/15 hover:bg-red-600 border border-red-600/30 rounded text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            Disconnect Account
          </button>
        </div>
      </aside>

      {/* CORE VIEW WINDOWS (flex structure underneath top lap/mob navbar) */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* PREMIUM DESIGNED HEADER FOR "Makao Realtors" */}
        <header className="h-24 bg-white border-b border-gray-100 px-6 sm:px-8 flex items-center justify-between shrink-0 shadow-2xs">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[9px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-150 uppercase tracking-wider font-mono">Verified Ledger</span>
              <span className="text-[9px] font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-150 uppercase tracking-wider font-mono">Ke-Safaricom Active API</span>
            </div>
            <h2 className="text-base sm:text-lg font-serif font-black text-gray-900 tracking-tight" style={{ fontFamily: "Georgia, serif" }}>
              {activeTab === "mylistings" && "My Properties Directory"}
              {activeTab === "createlisting" && "Publish verified listings (KES 100)"}
              {activeTab === "browse" && "Verified Kenyan Real Estate Search Directory"}
              {activeTab === "myreveals" && "My approved landlord connection details"}
              {activeTab === "bookmarks" && "My interactive bookmark folder"}
              {activeTab === "support" && "Help desk customer support messaging"}
            </h2>
          </div>
          <button
            onClick={onRefreshData}
            className="p-2.5 hover:bg-slate-50 border border-gray-200 rounded-lg text-[10px] font-extrabold uppercase text-gray-700 tracking-wide flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-2xs h-10 shrink-0"
          >
            🔄 Sync Data
          </button>
        </header>

        {/* METADATA LOADER OVERLAYS */}
        {checkoutLoadingText && (
          <div className="bg-amber-500 text-white text-xs font-bold tracking-wide py-3 px-8 text-center animate-pulse flex items-center justify-center gap-2 border-b border-amber-600 shrink-0">
            <Loader2 className="w-4 h-4 animate-spin text-white" />
            <span>{checkoutLoadingText}</span>
          </div>
        )}

        {/* MAIN BODY CONTENTS */}
        <div className="p-8 flex-1 flex flex-col gap-8">
          
          {/* TAB: MODULAR DIRECTORY ENGINES */}
          {activeTab === "dashboard" && (
            currentUser.role === "landlord" ? (
              <LandlordDashboardPage
                currentUser={currentUser}
                properties={properties}
                setActiveTab={setActiveTab}
              />
            ) : currentUser.role === "seller" ? (
              <SellerDashboardPage
                currentUser={currentUser}
                properties={properties}
                setActiveTab={setActiveTab}
              />
            ) : currentUser.role === "renter" ? (
              <RenterDashboardPage
                currentUser={currentUser}
                properties={properties}
                connections={connections}
                setActiveTab={setActiveTab}
              />
            ) : (
              <BuyerDashboardPage
                currentUser={currentUser}
                properties={properties}
                connections={connections}
                setActiveTab={setActiveTab}
              />
            )
          )}

          {/* TAB: LANDLORD PROFILE PROPERTY LISTINGS */}
          {activeTab === "mylistings" && (
            currentUser.role === "landlord" ? (
              <LandlordListingsPage
                landlordProperties={landlordProperties}
                settings={settings}
                onRefreshData={onRefreshData}
                onAddToast={onAddToast}
                onInitiateStkPush={onInitiateStkPush}
                handleToggleAvailability={handleToggleAvailability}
                setActiveTab={setActiveTab}
              />
            ) : (
              <SellerListingsPage
                sellerProperties={landlordProperties}
                settings={settings}
                onRefreshData={onRefreshData}
                onAddToast={onAddToast}
                onInitiateStkPush={onInitiateStkPush}
                handleToggleAvailability={handleToggleAvailability}
                setActiveTab={setActiveTab}
              />
            )
          )}

          {false && activeTab === "mylistings" && (
            <div className="space-y-6">
              <div className="bg-slate-100 p-4 rounded-xl border border-gray-200 flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs">
                  <p className="font-extrabold text-slate-800">Operational Posting Rule</p>
                  <p className="text-slate-500 mt-1">Properties are listed on a flat rate of <span className="font-bold">KES 100</span> standard checkout listing fee per post.</p>
                </div>
                <button
                  onClick={() => setActiveTab("createlisting")}
                  className="bg-[#1B6B3A] text-white hover:bg-[#0D4F2B] px-4 py-2 text-xs font-bold rounded-lg uppercase tracking-wider transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Property Listing
                </button>
              </div>

              {landlordProperties.length === 0 ? (
                <div className="bg-white border text-center p-16 rounded-2xl text-xs text-slate-400 font-medium">
                  You do not have any property listings listed in our database yet. Click add property to list!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {landlordProperties.map((p) => {
                    return (
                      <div key={p.id} className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden flex flex-col">
                        <div className="h-40 bg-slate-100 overflow-hidden relative">
                          <PropertyImageSlider images={p.images} propertyName={p.name} />
                          <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border shadow-sm z-10 ${
                            p.status === "published" ? "bg-green-105 border-green-500 text-green-700" : "bg-amber-100 border-amber-500 text-amber-700 animate-pulse"
                          }`}>
                            {p.status}
                          </div>
                          {p.isComplex && (
                            <div className="absolute top-3 right-3 bg-[#1B6B3A] text-white px-2.5 py-1 rounded text-[9px] font-mono font-bold tracking-wider uppercase z-10">
                              Complex: {p.rooms.length} rooms
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
                                    const newPriceStr = window.prompt("Enter new KES price for " + p.name + ":", p.price.toString());
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
                                            onAddToast("Property price revised on ledger successfully!", "success");
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
                                  title="Edit / Reduce Advertised Price"
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
                                    p.available ? "bg-amber-100 text-[#F5A623] hover:bg-amber-200" : "bg-green-100 text-green-700 hover:bg-green-200"
                                  }`}
                                >
                                  {p.available ? "Mark as TAKEN" : "Mark as AVAILABLE"}
                                </button>
                              )}
                              
                              {p.status === "pending" && (
                                <button
                                  onClick={() => {
                                    onAddToast("Re-initiating pending STK checkout of KES " + (settings.listingFee || 100), "info");
                                    onInitiateStkPush("ws_CO_" + Date.now(), settings.listingFee || 100, "listing_fee", p.name);
                                  }}
                                  className="w-full py-2 bg-[#F5A623] text-[#1B6B3A] hover:bg-[#d98b11] rounded font-bold text-[11px] uppercase tracking-wider text-center"
                                >
                                  Trigger Lipa M-PESA KES 100
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
          )}

          {/* TAB: CREATE NEW LISTING WIZARD */}
          {activeTab === "createlisting" && (
            currentUser.role === "landlord" ? (
              <LandlordCreateListingPage
                currentUser={currentUser}
                onAddToast={onAddToast}
                onRefreshData={onRefreshData}
                setActiveTab={setActiveTab}
              />
            ) : (
              <SellerCreateListingPage
                currentUser={currentUser}
                onAddToast={onAddToast}
                onRefreshData={onRefreshData}
                setActiveTab={setActiveTab}
              />
            )
          )}

          {false && activeTab === "createlisting" && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 max-w-4xl font-sans text-xs">
              <form onSubmit={handleCreatePropertyListing} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column props */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1 font-mono">Property Display Name</label>
                      <input
                        type="text"
                        required
                        className="w-full text-xs p-2.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B6B3A]"
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
                        <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1 font-mono">Price (KES)</label>
                        <input
                          type="number"
                          required
                          className="w-full text-xs p-2.5 border rounded-lg focus:outline-none"
                          placeholder={currentUser.role === "seller" ? "Total Selling Price" : "Rent per month"}
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
                          className="w-full text-xs p-2.5 border rounded-lg focus:outline-none"
                          placeholder="Ruaka"
                          value={propTown}
                          onChange={(e) => setPropTown(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Estate (Optional)</label>
                        <input
                          type="text"
                          className="w-full text-xs p-2.5 border rounded-lg focus:outline-none"
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
                          className="w-full text-xs p-2.5 border rounded-lg focus:outline-none"
                          value={propBedrooms}
                          onChange={(e) => setPropBedrooms(Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1 font-mono">Bathrooms count</label>
                        <input
                          type="number"
                          required
                          className="w-full text-xs p-2.5 border rounded-lg focus:outline-none"
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
                          className="w-full text-xs p-2.5 border rounded-lg focus:outline-none"
                          value={propContactPhone}
                          onChange={(e) => setPropContactPhone(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">WhatsApp Alert phone</label>
                        <input
                          type="text"
                          required
                          className="w-full text-xs p-2.5 border rounded-lg focus:outline-none"
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
                            onClick={() => { setPropImages([]); setPropImageUrl(""); onAddToast("All photos removed.", "info"); }}
                            className="text-[9px] font-bold text-red-650 hover:text-red-750 uppercase cursor-pointer bg-transparent border-none"
                          >
                            Reset All ({propImages.length})
                          </button>
                        )}
                      </div>

                      {/* Mode tab switchers */}
                      <div className="grid grid-cols-3 gap-1 mb-3.5 bg-slate-100 p-1 rounded-lg">
                        <button
                          type="button"
                          onClick={() => setImageTab("upload")}
                          className={`py-1.5 text-[9px] font-bold uppercase tracking-wider rounded transition-all cursor-pointer ${imageTab === "upload" ? "bg-white text-[#1B6B3A] shadow-3xs" : "text-gray-500 hover:text-gray-800"}`}
                        >
                          Import Gal / File
                        </button>
                        <button
                          type="button"
                          onClick={() => setImageTab("stock")}
                          className={`py-1.5 text-[9px] font-bold uppercase tracking-wider rounded transition-all cursor-pointer ${imageTab === "stock" ? "bg-white text-[#1B6B3A] shadow-3xs" : "text-gray-500 hover:text-gray-800"}`}
                        >
                          Makao stock
                        </button>
                        <button
                          type="button"
                          onClick={() => setImageTab("url")}
                          className={`py-1.5 text-[9px] font-bold uppercase tracking-wider rounded transition-all cursor-pointer ${imageTab === "url" ? "bg-white text-[#1B6B3A] shadow-3xs" : "text-gray-500 hover:text-gray-800"}`}
                        >
                          Paste URL link
                        </button>
                      </div>

                      {/* Display active multi-image preview gallery */}
                      {propImages.length > 0 && (
                        <div className="mb-3.5 p-2.5 bg-white border rounded-xl">
                          <span className="text-[9px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 font-mono">
                            Selected Album ({propImages.length} / 5 photos)
                          </span>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {propImages.map((imgUrl, i) => (
                              <div key={i} className="relative group w-16 h-12 rounded-lg overflow-hidden border border-slate-200 shadow-3xs bg-slate-50">
                                <img
                                  src={imgUrl}
                                  alt={`Portfolio ${i + 1}`}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    setPropImages((prev) => prev.filter((_, idx) => idx !== i));
                                    onAddToast("Photo removed from album.", "info");
                                  }}
                                  className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[8px] font-bold uppercase transition-all duration-150 cursor-pointer"
                                >
                                  Delete
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Mode 1: Drag & Drop local file gallery importer */}
                      {imageTab === "upload" && (
                        <div
                          onDragEnter={handleDrag}
                          onDragOver={handleDrag}
                          onDragLeave={handleDrag}
                          onDrop={handleDrop}
                          className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${dragActive ? "border-[#1B6B3A] bg-emerald-50/20" : "border-slate-200 hover:border-slate-350 bg-white"}`}
                          onClick={() => document.getElementById("file-loader-gallery")?.click()}
                        >
                          <input
                            type="file"
                            id="file-loader-gallery"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                          <UploadCloud className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-[11px] font-bold text-gray-700 uppercase tracking-wide">Import from Gallery or device</p>
                          <p className="text-[10px] text-gray-400 mt-1">Drag and drop file or click to select image</p>
                        </div>
                      )}

                      {/* Mode 2: Makao Curated Stock Kenyan housing portfolio */}
                      {imageTab === "stock" && (
                        <div className="space-y-2">
                          <p className="text-[9px] text-amber-700 bg-amber-50 py-1 px-2.5 rounded border border-amber-100/50 font-bold uppercase tracking-wider font-mono text-center">
                            ⚡ Fast-track: Tap up to 5 Kenyan estate pictures below to add them
                          </p>
                          <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1 bg-white p-2 rounded-lg border border-gray-150">
                            {STOCK_GALLERY_IMAGES.map((img, i) => {
                              const isSelected = propImages.includes(img.url);
                              return (
                                <button
                                  type="button"
                                  key={i}
                                  onClick={() => {
                                    if (isSelected) {
                                      setPropImages((prev) => prev.filter((p) => p !== img.url));
                                      onAddToast("Photo removed from album.", "info");
                                    } else {
                                      if (propImages.length >= 5) {
                                        onAddToast("Image limit reached: Maximum of 5 images allowed on the free plan.", "error");
                                        return;
                                      }
                                      setPropImages((prev) => [...prev, img.url]);
                                      onAddToast(`Added ${img.title} to portfolio!`, "success");
                                    }
                                  }}
                                  className={`group relative text-left border rounded-lg overflow-hidden transition-all hover:scale-[1.02] cursor-pointer h-16 ${isSelected ? "border-emerald-650 ring-2 ring-emerald-500/20" : "border-gray-150"}`}
                                >
                                  <img
                                    src={img.url}
                                    alt={img.title}
                                    className="w-full h-full object-cover group-hover:brightness-95"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent p-1 flex flex-col justify-end">
                                    <span className="text-[7px] text-[#F5A623] font-extrabold uppercase leading-none truncate block">{img.category}</span>
                                    <span className="text-[8px] text-white font-bold leading-none truncate block mt-0.5" title={img.title}>{img.title}</span>
                                  </div>
                                  {isSelected && (
                                    <div className="absolute top-1 right-1 bg-emerald-600 text-white rounded-full p-0.5 z-10">
                                      <Check className="w-2.5 h-2.5" />
                                    </div>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Mode 3: Traditional input URL field */}
                      {imageTab === "url" && (
                        <div className="space-y-2">
                          <label className="block text-[9px] uppercase font-bold text-gray-400 tracking-wider font-mono">Pasted online link URL</label>
                          <div className="flex gap-1.5">
                            <input
                              type="text"
                              id="custom-img-url-input"
                              className="flex-1 text-xs p-2.5 border rounded-lg focus:outline-none bg-white font-mono"
                              placeholder="https://images.unsplash.com/photo-..."
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const input = document.getElementById("custom-img-url-input") as HTMLInputElement;
                                const url = input?.value?.trim();
                                if (url) {
                                  if (propImages.length >= 5) {
                                    onAddToast("Image limit reached: Maximum of 5 images allowed on the free plan.", "error");
                                    return;
                                  }
                                  setPropImages((prev) => [...prev, url]);
                                  onAddToast("Custom image added!", "success");
                                  input.value = "";
                                } else {
                                  onAddToast("Please enter a valid URL.", "error");
                                }
                              }}
                              className="bg-[#1B6B3A] hover:bg-[#134D29] text-white px-3 py-2 rounded-lg font-bold text-[10px] uppercase cursor-pointer"
                            >
                              Add
                            </button>
                          </div>
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
                        className="w-full text-xs p-2.5 border rounded-lg focus:outline-none leading-relaxed"
                        placeholder="Provide deep architectural overview, estate highlighting rules..."
                        value={propDescription}
                        onChange={(e) => setPropDescription(e.target.value)}
                      />
                    </div>

                    {/* Vetted Amenities cloud */}
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

                    {/* Apartment Complex support toggle */}
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

                          {/* Render Added Rooms list */}
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
                  disabled={submittingListing}
                  className="w-full py-3.5 bg-[#1B6B3A] hover:bg-[#0D4F2B] text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
                >
                  {submittingListing ? <Loader2 className="w-5 h-5 animate-spin" /> : "Authorize and Publish (Pay KES 100 via M-PESA)"}
                </button>
              </form>
            </div>
          )}

          {/* TAB: RENTER SEARCH AND REAL ESTATE EXPLORATION */}
          {activeTab === "browse" && (
            currentUser.role === "renter" ? (
              <RenterBrowsePage
                filteredProperties={filteredProperties}
                savedPropertyIds={savedPropertyIds}
                myApprovedReveals={myApprovedReveals}
                filterCounty={filterCounty}
                setFilterCounty={setFilterCounty}
                filterType={filterType}
                setFilterType={setFilterType}
                filterBedrooms={filterBedrooms}
                setFilterBedrooms={setFilterBedrooms}
                filterMaxPrice={filterMaxPrice}
                setFilterMaxPrice={setFilterMaxPrice}
                filterSearch={filterSearch}
                setFilterSearch={setFilterSearch}
                handleSavePropertyToggle={handleSavePropertyToggle}
                handleRegisterRenterConnection={handleRegisterRenterConnection}
              />
            ) : (
              <BuyerBrowsePage
                filteredProperties={filteredProperties}
                savedPropertyIds={savedPropertyIds}
                myApprovedReveals={myApprovedReveals}
                filterCounty={filterCounty}
                setFilterCounty={setFilterCounty}
                filterType={filterType}
                setFilterType={setFilterType}
                filterMaxPrice={filterMaxPrice}
                setFilterMaxPrice={setFilterMaxPrice}
                filterSearch={filterSearch}
                setFilterSearch={setFilterSearch}
                handleSavePropertyToggle={handleSavePropertyToggle}
                handleRegisterRenterConnection={handleRegisterRenterConnection}
              />
            )
          )}

          {false && activeTab === "browse" && (
            <div className="space-y-6">
              {/* Advance Filters block */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 font-mono">County Zone</label>
                    <select
                      className="w-full p-2.5 border rounded-lg bg-white bg-slate-50 font-bold text-slate-800"
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
                      <option value="Apartment">Apartment</option>
                      <option value="Bedsitter">Bedsitter/Studio</option>
                      <option value="Bungalow">Bungalow</option>
                      <option value="Maisonette">Maisonette</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Land">Land / plots</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 font-mono">Bedrooms Limit</label>
                    <select
                      className="w-full p-2.5 border rounded-lg bg-white"
                      value={filterBedrooms}
                      onChange={(e) => setFilterBedrooms(e.target.value)}
                    >
                      <option value="any">Any Bedrooms</option>
                      <option value="0">Studio / Bedsitter</option>
                      <option value="1">1 Bedroom</option>
                      <option value="2">2 Bedrooms</option>
                      <option value="3+">3+ Bedrooms</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 font-mono">Maximum Price (KES)</label>
                    <input
                      type="number"
                      placeholder="e.g. 60000"
                      className="w-full p-2.5 border rounded-lg focus:outline-none"
                      value={filterMaxPrice}
                      onChange={(e) => setFilterMaxPrice(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Search keywords, town center name, amenities..."
                    className="flex-1 text-xs border rounded-lg px-4 py-2.5 focus:outline-none"
                    value={filterSearch}
                    onChange={(e) => setFilterSearch(e.target.value)}
                  />
                </div>
              </div>

              {/* Listings grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProperties.map((p) => {
                  const alreadySaved = savedPropertyIds.includes(p.id);
                  const connectionApproved = myApprovedReveals.find((c) => c.propertyId === p.id);

                  return (
                    <div key={p.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col">
                      <div className="h-44 overflow-hidden relative bg-slate-100">
                        <PropertyImageSlider images={p.images} propertyName={p.name} />
                        <div className="absolute top-3 left-3 bg-[#1B6B3A] text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-green-500 shadow-sm z-10">
                          For {p.listingType}
                        </div>
                        <button
                          onClick={() => handleSavePropertyToggle(p.id, p.name)}
                          className="absolute top-3 right-3 bg-white hover:bg-red-50 text-slate-500 hover:text-red-600 p-2 rounded-full shadow-sm transition-all cursor-pointer z-10"
                        >
                          <Heart className={`w-3.5 h-3.5 ${alreadySaved ? "fill-red-600 text-red-600" : "text-slate-400"}`} />
                        </button>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-baseline">
                            <span className="text-[10px] font-bold text-gray-400 font-mono tracking-wider uppercase">{p.propertyType} • {p.town}, {p.county}</span>
                            <span className="text-[9px] bg-sky-50 text-sky-700 border border-sky-200 px-2.5 py-0.5 rounded-full font-bold uppercase">Direct Owner</span>
                          </div>
                          <h3 className="font-bold font-serif text-sm text-gray-800 tracking-wide mt-1.5 leading-normal">{p.name}</h3>
                          <p className="text-xs text-gray-500 leading-relaxed mt-2 line-clamp-3 whitespace-pre-wrap">{p.description}</p>
                        </div>

                        {/* Amenities row */}
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {p.amenities.map((a) => (
                            <span key={a} className="bg-slate-50 text-slate-500 text-[9px] font-bold px-2 py-0.5 rounded uppercase font-mono tracking-wide">
                              {a}
                            </span>
                          ))}
                        </div>

                        {/* Property complex rooms schedules preview */}
                        {p.isComplex && p.rooms.length > 0 && (
                          <div className="mt-3 bg-[#F7F9F7] p-2.5 rounded-lg border text-[10px] font-sans">
                            <span className="font-bold text-[#1B6B3A] block uppercase tracking-wider font-mono">Complex Available Units directory</span>
                            <div className="grid grid-cols-2 gap-1.5 mt-1 text-slate-500">
                              {p.rooms.map((r) => (
                                <span key={r.id} className={r.available ? "text-slate-700 font-medium" : "text-gray-300 line-through"}>
                                  🚪 {r.roomNumber} ({r.floor}) - KES {r.price.toLocaleString()}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="border-t pt-4 mt-4 flex items-center justify-between gap-4">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block font-mono">Required Listing Price</span>
                            <span className="text-base font-extrabold text-[#1B6B3A]">
                              KES {p.price.toLocaleString()}
                              <span className="text-[10px] font-normal text-gray-400">{p.listingType === "rent" ? "/mo" : ""}</span>
                            </span>
                          </div>

                          {connectionApproved ? (
                            <div className="bg-green-50 border border-green-200 text-green-700 p-2 rounded-lg text-[10px]">
                              <p className="font-bold uppercase tracking-wider leading-none mb-1">Direct Landlord Contact:</p>
                              <a href={`tel:${p.contactPhone}`} className="hover:underline font-mono font-bold font-semibold block text-xs">{p.contactPhone}</a>
                              {p.contactWhatsApp && (
                                <a
                                  href={`https://wa.me/${p.contactWhatsApp}`}
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
                              className="px-4 py-2 bg-[#1B6B3A] hover:bg-[#0D4F2B] text-white rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer shadow-sm active:scale-95 transition-all text-center flex items-center gap-1"
                            >
                              Get Direct Contact Details
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredProperties.length === 0 && (
                  <div className="md:col-span-2 bg-white border p-12 rounded-xl text-center text-xs text-slate-400">
                    No matching verified properties found. Please broaden search county or category filters.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: APPROVED REVEALED CONTACTS DETAILS */}
          {activeTab === "myreveals" && (
            currentUser.role === "renter" ? (
              <RenterRevealsPage myApprovedReveals={myApprovedReveals} />
            ) : (
              <BuyerRevealsPage myApprovedReveals={myApprovedReveals} />
            )
          )}

          {false && activeTab === "myreveals" && (
            <div className="bg-white rounded-2xl border p-6 space-y-4">
              <h3 className="font-serif font-bold text-gray-800 text-sm">Direct Approved Connection Ledger</h3>
              <p className="text-xs text-gray-500 max-w-lg mb-4">
                Below is the collection of property direct phone contacts where payment was completed and approved by staff. Feel free to call to organize visit schedulings. No developer agent fees!
              </p>

              {myApprovedReveals.length === 0 ? (
                <div className="p-12 text-center text-xs text-slate-400 italic">No connection reveal logs records found.</div>
              ) : (
                <div className="space-y-3">
                  {myApprovedReveals.map((c) => (
                    <div key={c.id} className="p-4 bg-green-50/40 rounded-xl border border-green-200 flex flex-col sm:flex-row items-baseline sm:items-center justify-between gap-4 text-xs font-sans">
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] uppercase font-mono tracking-wider bg-green-100 text-green-700 px-2 py-0.5 rounded font-extrabold mb-1 inline-block">Direct Vetted Connection approved</span>
                        <h4 className="font-extrabold text-sm text-slate-800 tracking-wide">{c.propertyName}</h4>
                        <p className="text-slate-500 mt-0.5">Primary landlord: <span className="font-bold">{c.landlordName}</span></p>
                      </div>

                      <div className="flex flex-col sm:items-end font-mono">
                        <span className="text-[10px] text-gray-400 uppercase font-mono font-bold">Contact revealed phone:</span>
                        <a href={`tel:${c.landlordContactPhone}`} className="text-sm font-bold text-[#1B6B3A] hover:underline font-semibold">{c.landlordContactPhone}</a>
                        {c.landlordContactWhatsApp && (
                          <a href={`https://wa.me/${c.landlordContactWhatsApp.replace("+", "")}`} className="text-[10px] text-emerald-600 font-extrabold underline mt-1">
                            Click to text on WhatsApp
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: INTERACTIVE SAVED BOOKMARKS */}
          {activeTab === "bookmarks" && (
            currentUser.role === "renter" ? (
              <RenterBookmarksPage
                properties={properties}
                savedPropertyIds={savedPropertyIds}
                handleSavePropertyToggle={handleSavePropertyToggle}
                setActiveTab={setActiveTab}
              />
            ) : (
              <BuyerBookmarksPage
                properties={properties}
                savedPropertyIds={savedPropertyIds}
                handleSavePropertyToggle={handleSavePropertyToggle}
                setActiveTab={setActiveTab}
              />
            )
          )}

          {false && activeTab === "bookmarks" && (
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-gray-800 text-sm">My Saved Bookmarks</h3>
              
              {savedPropertyIds.length === 0 ? (
                <div className="bg-white border text-center p-12 rounded-xl text-xs text-slate-400">
                  You have not bookmarked any listings. Browse real estate directory to like items.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {properties.filter(p => savedPropertyIds.includes(p.id)).map(p => {
                    const pic = p.images && p.images[0] ? p.images[0] : "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80";
                    return (
                      <div key={p.id} className="bg-white rounded-xl border p-4 flex gap-4 text-xs font-sans hover:shadow-xs justify-between">
                        <div className="w-20 h-20 bg-slate-100 rounded-lg overflow-hidden shrink-0">
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
                            className="bg-red-50 hover:bg-red-200 text-red-500 p-1.5 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setActiveTab("browse")}
                            className="text-[#1B6B3A] hover:underline uppercase text-[9px] font-bold font-mono tracking-wider mt-2 block"
                          >
                            Reveal contacto
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB: SECURE PAYMENTS LEDGER */}
          {activeTab === "payments" && (
            currentUser.role === "landlord" ? (
              <LandlordPaymentsPage
                payments={payments}
                onAddToast={onAddToast}
              />
            ) : (
              <SellerPaymentsPage
                payments={payments}
              />
            )
          )}

          {/* TAB: CHAT SUPPORT HELPDESK */}
          {activeTab === "support" && (
            currentUser.role === "landlord" ? (
              <LandlordSupportPage
                currentUser={currentUser}
                messages={messages}
                supportText={supportText}
                setSupportText={setSupportText}
                submittingSupport={submittingSupport}
                onPostSupportMessage={handlePostSupportMessage}
              />
            ) : currentUser.role === "seller" ? (
              <SellerSupportPage
                currentUser={currentUser}
                messages={messages}
                supportText={supportText}
                setSupportText={setSupportText}
                submittingSupport={submittingSupport}
                onPostSupportMessage={handlePostSupportMessage}
              />
            ) : currentUser.role === "renter" ? (
              <RenterSupportPage
                currentUser={currentUser}
                messages={messages}
                supportText={supportText}
                setSupportText={setSupportText}
                submittingSupport={submittingSupport}
                onPostSupportMessage={handlePostSupportMessage}
              />
            ) : (
              <BuyerSupportPage
                currentUser={currentUser}
                messages={messages}
                supportText={supportText}
                setSupportText={setSupportText}
                submittingSupport={submittingSupport}
                onPostSupportMessage={handlePostSupportMessage}
              />
            )
          )}

          {false && activeTab === "support" && (
            <div className="bg-white rounded-cl border p-6 space-y-6 max-w-2xl font-sans text-xs">
              <div className="bg-[#F7F9F7] p-4 rounded-xl border flex gap-3 text-[#1B6B3A] text-xs leading-relaxed font-sans">
                <HelpCircle className="w-5 h-5 text-[#F5A623] shrink-0" />
                <div>
                  <span className="font-extrabold uppercase font-mono text-[10px] tracking-wide block mb-1">Direct Helpdesk helpline</span>
                  Our representative staff handles active inquires instantly from 8:00 AM to 5:00 PM. Type your questions below regarding payment checkouts or county verification protocols.
                </div>
              </div>

              {/* Chat Thread history */}
              <div className="border bg-slate-50 p-4 rounded-xl space-y-3 max-h-56 overflow-y-auto">
                {messages.map((m) => {
                  const isMe = m.senderId === currentUser.id;
                  return (
                    <div key={m.id} className={`flex max-w-[85%] ${isMe ? "ml-auto" : "mr-auto"}`}>
                      <div className={`p-3 rounded-xl text-xs leading-normal ${isMe ? "bg-[#1B6B3A] text-white rounded-tr-none" : "bg-white text-gray-800 border-l-4 border-amber-500 whitespace-pre-wrap font-sansRounded"}`}>
                        <span className="block text-[8px] font-bold tracking-wide opacity-75 uppercase mb-1 font-mono">{isMe ? "Sent by Me" : m.senderName}</span>
                        {m.message}
                      </div>
                    </div>
                  );
                })}
                {messages.length === 0 && <p className="text-center text-[11px] text-gray-400 italic">No messages sent yet. Ask something!</p>}
              </div>

              {/* Form Input support message */}
              <form onSubmit={handlePostSupportMessage} className="space-y-3">
                <textarea
                  required
                  rows={4}
                  placeholder="Type support question or feedback details..."
                  className="w-full text-xs border rounded-lg p-2.5 bg-white focus:outline-none"
                  value={supportText}
                  onChange={(e) => setSupportText(e.target.value)}
                />

                <button
                  type="submit"
                  disabled={submittingSupport}
                  className="px-4 py-2 bg-[#1B6B3A] hover:bg-[#0D4F2B] text-white rounded text-xs font-bold uppercase transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  {submittingSupport ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : "Transmit Support Message"}
                </button>
              </form>
            </div>
          )}

          {/* TAB: PROFILE & SECURITY SETTINGS */}
          {activeTab === "settings" && (
            currentUser.role === "landlord" ? (
              <LandlordSettingsPage
                currentUser={currentUser}
                profileName={profileName}
                setProfileName={setProfileName}
                profileEmail={profileEmail}
                setProfileEmail={setProfileEmail}
                updatingProfile={updatingProfile}
                onUpdateProfile={handleUpdateProfile}
                currentPassword={currentPassword}
                setCurrentPassword={setCurrentPassword}
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                updatingPassword={updatingPassword}
                onUpdatePassword={handleUpdatePassword}
              />
            ) : currentUser.role === "seller" ? (
              <SellerSettingsPage
                currentUser={currentUser}
                profileName={profileName}
                setProfileName={setProfileName}
                profileEmail={profileEmail}
                setProfileEmail={setProfileEmail}
                updatingProfile={updatingProfile}
                onUpdateProfile={handleUpdateProfile}
                currentPassword={currentPassword}
                setCurrentPassword={setCurrentPassword}
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                updatingPassword={updatingPassword}
                onUpdatePassword={handleUpdatePassword}
              />
            ) : currentUser.role === "renter" ? (
              <RenterSettingsPage
                currentUser={currentUser}
                profileName={profileName}
                setProfileName={setProfileName}
                profileEmail={profileEmail}
                setProfileEmail={setProfileEmail}
                updatingProfile={updatingProfile}
                onUpdateProfile={handleUpdateProfile}
                currentPassword={currentPassword}
                setCurrentPassword={setCurrentPassword}
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                updatingPassword={updatingPassword}
                onUpdatePassword={handleUpdatePassword}
              />
            ) : (
              <BuyerSettingsPage
                currentUser={currentUser}
                profileName={profileName}
                setProfileName={setProfileName}
                profileEmail={profileEmail}
                setProfileEmail={setProfileEmail}
                updatingProfile={updatingProfile}
                onUpdateProfile={handleUpdateProfile}
                currentPassword={currentPassword}
                setCurrentPassword={setCurrentPassword}
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                updatingPassword={updatingPassword}
                onUpdatePassword={handleUpdatePassword}
              />
            )
          )}

          {false && activeTab === "settings" && (
            <div className="space-y-6 max-w-2xl font-sans text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. Identity Profile Section */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                  <h3 className="font-serif font-bold text-gray-850 text-sm mb-4 uppercase tracking-wide text-[#1B6B3A]">Update Profile Details</h3>
                  <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs font-sans">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 font-mono">My Account Name</label>
                      <input
                        type="text"
                        required
                        className="w-full text-xs border p-2.5 bg-white rounded-sm"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 font-mono">Contact Email Address</label>
                      <input
                        type="email"
                        required
                        className="w-full text-xs border p-2.5 bg-white rounded-sm"
                        value={profileEmail}
                        onChange={(e) => setProfileEmail(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 font-mono">Kenyan Phone (Read-Only ID Key)</label>
                      <input
                        type="text"
                        className="w-full text-xs border p-2.5 bg-slate-50 text-gray-500 font-mono disabled rounded-sm"
                        readOnly
                        value={currentUser.phone}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={updatingProfile}
                      className="w-full py-2.5 bg-[#1B6B3A] text-white hover:bg-[#0D4F2B] rounded text-xs uppercase font-extrabold cursor-pointer"
                    >
                      {updatingProfile ? "Updating..." : "Save Profile Details"}
                    </button>
                  </form>
                </div>

                {/* 2. Security Configuration Module */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                  <h3 className="font-serif font-bold text-gray-850 text-sm mb-4 uppercase tracking-wide text-amber-700">Change Secure Password</h3>
                  <form onSubmit={handleUpdatePassword} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 font-mono">Current Identity Password</label>
                      <input
                        type="password"
                        required
                        placeholder="Enter old password"
                        className="w-full text-xs border p-2.5 bg-white rounded-sm"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 font-mono">New Access Password</label>
                      <input
                        type="password"
                        required
                        placeholder="Minimum 8 characters"
                        className="w-full text-xs border p-2.5 bg-white rounded-sm"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={updatingPassword}
                      className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded text-xs uppercase font-extrabold cursor-pointer"
                    >
                      {updatingPassword ? "Changing..." : "Revise My Password"}
                    </button>
                  </form>
                </div>
              </div>

              {/* 3. Immersive Themes Selection */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="font-serif font-bold text-gray-800 text-sm mb-2 uppercase tracking-wide text-slate-800">Interface Aesthetics Mode Selector</h3>
                <p className="text-[10px] text-gray-400 mb-4 uppercase tracking-wider font-mono">Choose custom paired design schemes to optimize visual focus.</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  
                  {/* Theme 1: Forest Green Classic */}
                  <button
                    onClick={() => changeTheme("classic")}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      theme === "classic" ? "border-[#1B6B3A] bg-emerald-50/30 ring-2 ring-[#1B6B3A]/20 text-slate-705" : "border-slate-200 hover:bg-slate-50 text-slate-705"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-4 h-4 rounded-full bg-[#1B6B3A] shrink-0 border border-black/10"></span>
                      <span className="text-[11px] font-extrabold uppercase font-mono">Forest Classic</span>
                    </div>
                    <p className="text-[9px] text-gray-400 leading-snug">Default Makao forest green theme with warm golden credentials styling accenting.</p>
                  </button>

                  {/* Theme 2: Slate Cosmic Dark */}
                  <button
                    onClick={() => changeTheme("dark")}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      theme === "dark" ? "border-emerald-500 bg-slate-900 text-slate-300 ring-2 ring-emerald-500/20 text-slate-305" : "border-slate-200 hover:bg-slate-50 text-slate-305"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-4 h-4 rounded-full bg-slate-900 shrink-0 border border-white/10"></span>
                      <span className="text-[11px] font-extrabold uppercase font-mono">Cosmic Dark Slate</span>
                    </div>
                    <p className="text-[9px] text-gray-400 leading-snug">Relaxing deep space dark theme styled meticulously for low-light property searching.</p>
                  </button>

                  {/* Theme 3: Warm Ivory Sunlight */}
                  <button
                    onClick={() => changeTheme("warm")}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      theme === "warm" ? "border-amber-600 bg-amber-50/20 ring-2 ring-amber-600/20 text-slate-705" : "border-slate-200 hover:bg-slate-50 text-slate-705"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-4 h-4 rounded-full bg-amber-900 shrink-0 border border-black/10"></span>
                      <span className="text-[11px] font-extrabold uppercase font-mono">Cozy Warm Ivory</span>
                    </div>
                    <p className="text-[9px] text-gray-400 leading-snug">Nairobi clay tone cream colors pairing offering a cozy reading palette.</p>
                  </button>
                </div>
              </div>

              {/* 4. Destructive Secure Disconnect block */}
              <div className="bg-red-50/40 rounded-xl border border-red-200/60 p-6 flex flex-col sm:flex-row items-baseline sm:items-center justify-between gap-4 font-sans">
                <div>
                  <h4 className="font-bold text-red-800 text-xs">Terminate Current Access Session</h4>
                  <p className="text-[10px] text-gray-400 leading-snug">Sign out this computer securely from the Makao database.</p>
                </div>
                <button
                  onClick={onLogout}
                  className="py-2.5 px-6 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] font-mono uppercase tracking-wider font-extrabold cursor-pointer h-10 transition-colors"
                >
                  Secure Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
