import React, { useState } from "react";
import { Search, Compass, LogIn, ArrowRight, CheckCircle, Smartphone, Menu, X, PlusCircle, HelpCircle } from "lucide-react";
import { Property } from "../types";
import MakaoLogo from "./MakaoLogo";

// Constant counties cloud
const COVERED_COUNTIES = ["Nairobi", "Kiambu", "Machakos", "Mombasa", "Kisumu", "Nakuru", "Uasin Gishu", "Kajiado", "Kilifi"];

interface LandingPageProps {
  properties: Property[];
  onOpenAuth: (mode: "login" | "signup", role?: string) => void;
  onExploreProperties: (filters: { county: string; type: string }) => void;
}

export default function LandingPage({
  properties,
  onOpenAuth,
  onExploreProperties
}: LandingPageProps) {
  const [searchCounty, setSearchCounty] = useState("All Counties");
  const [searchType, setSearchType] = useState("All Types");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onExploreProperties({
      county: searchCounty,
      type: searchType
    });
  };

  const publishedProps = properties.filter(p => p.status === "published" && p.available);
  const featuredProperties = publishedProps.slice(0, 6);

  return (
    <div className="flex-1 overflow-y-auto bg-[#F7F9F7]" style={{ fontFamily: "Calibri, system-ui, sans-serif" }}>
      
      {/* A. RESPONSIVE STICKY TOP HEADER */}
      <header className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-gray-100 z-40 transition-all shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          
          {/* Logo Brand Cluster */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-[#1B6B3A]/5 hover:bg-[#1B6B3A]/10 rounded-xl flex items-center justify-center shrink-0 border border-emerald-800/10 shadow-3xs transition-colors">
              <MakaoLogo size={28} strokeColor="#F5A623" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-serif font-black tracking-tight leading-none text-[#1B6B3A]">
                MAKAO REALTORS
              </h1>
              <span className="text-[9px] sm:text-[10px] tracking-wide font-extrabold text-amber-600 uppercase block mt-1 leading-none">
                Secure Kenyan Intermediary
              </span>
            </div>
          </div>

          {/* Desktop & Laptop Horizontal Navigation (lg:flex hidden) */}
          <div className="hidden lg:flex items-center gap-6">
            <button
              onClick={() => onExploreProperties({ county: "All Counties", type: "All Types" })}
              className="text-xs font-bold uppercase text-gray-700 hover:text-[#1B6B3A] tracking-wider transition-colors cursor-pointer"
            >
              Browse Listings
            </button>
            <button
              onClick={() => onOpenAuth("signup", "landlord")}
              className="text-xs font-bold uppercase text-gray-700 hover:text-[#1B6B3A] tracking-wider transition-colors cursor-pointer"
            >
              Post Property (KES 100)
            </button>

            <span className="w-px h-5 bg-gray-200"></span>

            <button
              onClick={() => onOpenAuth("login")}
              className="px-4 py-2.5 text-xs text-gray-700 font-bold uppercase tracking-wider hover:text-[#1B6B3A] hover:bg-slate-50 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-[#F5A623]" /> Sign In
            </button>
            <button
              onClick={() => onOpenAuth("signup")}
              className="px-5 py-2.5 bg-[#1B6B3A] border border-emerald-850 text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-[#0D4F2B] hover:shadow-md transition-all active:scale-95 cursor-pointer"
            >
              Register Account
            </button>
          </div>

          {/* Mobile hamburger icon (< lg:flex hidden) */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2.5 hover:bg-slate-50 border border-gray-150 rounded-xl transition-all cursor-pointer text-gray-800"
            aria-label="Open mobile navigation"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* B. FROSTED MOBILE DRAWER OVERLAY */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Glass/blur background backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Frosted Container Drawer right aligned */}
          <div className="fixed inset-y-0 right-0 w-80 bg-white/95 backdrop-blur-lg text-gray-900 p-6 flex flex-col justify-between border-l border-gray-200 z-50 shadow-2xl animate-in slide-in-from-right duration-250">
            <div>
              {/* Drawer Top Branding Header */}
              <div className="flex items-center justify-between pb-6 border-b border-gray-100 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#1B6B3A]/5 rounded-xl flex items-center justify-center border border-emerald-800/10 shrink-0">
                    <MakaoLogo size={22} strokeColor="#F5A623" />
                  </div>
                  <div>
                    <h1 className="text-sm font-black font-serif tracking-tight leading-none text-[#1B6B3A]">MAKAO REALTORS</h1>
                    <span className="text-[8px] tracking-widest text-[#F5A623] font-black uppercase">Intermediary</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 hover:bg-red-50 text-red-600 border border-gray-200 hover:border-red-300 rounded-lg cursor-pointer transition-all"
                  aria-label="Close mobile navigation"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Options inside drawer */}
              <div className="space-y-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">Real Estate Hub</p>
                
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onExploreProperties({ county: "All Counties", type: "All Types" });
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl border border-gray-100 hover:border-[#1B6B3A] hover:bg-emerald-50/30 flex items-center gap-3 transition-all cursor-pointer font-bold text-xs uppercase text-gray-800"
                >
                  <span className="text-base text-emerald-700">🧭</span> Explore Vetted Directory
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAuth("signup", "landlord");
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl border border-gray-100 hover:border-[#1B6B3A] hover:bg-emerald-50/30 flex items-center gap-3 transition-all cursor-pointer font-bold text-xs uppercase text-gray-800"
                >
                  <span className="text-base text-[#F5A623]">➕</span> Direct Landlord Post (KES 100)
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAuth("signup", "seller");
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl border border-gray-100 hover:border-[#1B6B3A] hover:bg-emerald-50/30 flex items-center gap-3 transition-all cursor-pointer font-bold text-xs uppercase text-gray-800"
                >
                  <span className="text-base text-[#F5A623]">🏢</span> Sell Vetted Land / Plot
                </button>
              </div>
            </div>

            {/* Quick Action Accounts Trigger Footer */}
            <div className="pt-6 border-t border-gray-100 bg-linear-to-b from-white to-slate-50/40 p-4 rounded-xl">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAuth("login");
                  }}
                  className="w-full py-3 border border-gray-200 hover:border-[#1B6B3A] text-gray-700 font-bold text-center text-xs uppercase rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAuth("signup");
                  }}
                  className="w-full py-3 bg-[#1B6B3A] text-white font-bold text-center text-xs uppercase rounded-xl hover:bg-[#0D4F2B] transition-all shadow-sm cursor-pointer"
                >
                  Join Makao
                </button>
              </div>
              <p className="text-[9px] text-gray-400 mt-4 text-center">
                🛡️ Safaricom STK Intermediated Ledger
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-cover bg-center py-20 lg:py-28 bg-[#1A2420]/5 flex items-center justify-center">
        {/* Abstract Savanna/Green Accent backgrounds */}
        <div className="absolute inset-0 z-0 bg-linear-to-tr from-[#1B6B3A]/10 via-transparent to-[#F5A623]/10"></div>
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#1B6B3A]/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#F5A623]/5 rounded-full blur-3xl"></div>

        <div className="max-w-4xl mx-auto text-center px-6 relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-[#1B6B3A]/10 text-[#1B6B3A] border border-[#1B6B3A]/25 px-3 py-1 rounded-full text-xs font-bold mb-6 font-mono uppercase tracking-wider">
            Verified Brokerage Platform 🇰🇪
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-gray-900 tracking-tight leading-none mb-6" style={{ fontFamily: "Georgia, serif" }}>
            The Direct Path to <br />
            <span className="text-[#1B6B3A]">Verified Kenyan Properties</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Connecting direct landlords and real estate sellers with vetted renters and buyers. Pay a minor intermediation fee to securely reveal premium contacts without external commissions.
          </p>

          {/* Quick Search Panel */}
          <form onSubmit={handleSearchSubmit} className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-xl max-w-3xl mx-auto flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 text-left mb-1.5 font-mono">Kenyan County</label>
              <select
                className="w-full bg-slate-50 border border-gray-200 rounded-lg p-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#1B6B3A]"
                value={searchCounty}
                onChange={(e) => setSearchCounty(e.target.value)}
              >
                <option value="All Counties">All Counties (Kenya)</option>
                {COVERED_COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="flex-1 border-gray-100 md:border-l md:pl-3">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 text-left mb-1.5 font-mono">Property Category</label>
              <select
                className="w-full bg-slate-50 border border-gray-200 rounded-lg p-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#1B6B3A]"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
              >
                <option value="All Types">All Types</option>
                <option value="Apartment">Apartment</option>
                <option value="Bedsitter">Bedsitter/Studio</option>
                <option value="Bungalow">Bungalow</option>
                <option value="Maisonette">Maisonette</option>
                <option value="Commercial">Commercial</option>
                <option value="Land">Land / Plots</option>
              </select>
            </div>

            <div className="md:w-36 flex items-end">
              <button
                type="submit"
                className="w-full bg-[#1B6B3A] hover:bg-[#0D4F2B] text-white py-3 px-4 rounded-lg font-bold text-xs uppercase flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <Search className="w-4 h-4" /> Search
              </button>
            </div>
          </form>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap justify-center items-center gap-5 text-xs font-bold uppercase">
            <button
              onClick={() => onOpenAuth("signup", "landlord")}
              className="text-[#1B6B3A] underline decoration-dotted decoration-2 hover:text-[#0D4F2B] cursor-pointer"
            >
              List My Landlord Property
            </button>
            <span className="text-gray-300">•</span>
            <button
              onClick={() => onExploreProperties({ county: "All Counties", type: "All Types" })}
              className="text-gray-600 hover:text-gray-900 cursor-pointer"
            >
              Browse All Listings
            </button>
          </div>
        </div>
      </section>

      {/* Statistics Strip */}
      <section className="bg-white border-y border-gray-100 py-10">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-3xl font-bold text-[#1B6B3A] font-serif">145+</p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Verified Lands</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-800 font-serif">KES 100</p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Listing Charge</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-[#F5A623] font-serif">10%</p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Connection Fee</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-800 font-serif">47</p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Counties Vetted</p>
          </div>
        </div>
      </section>

      {/* How It Works Flow chart */}
      <section className="py-16 max-w-6xl mx-auto px-6">
        <h3 className="text-2xl font-bold text-center text-gray-800 font-serif mb-3" style={{ fontFamily: "Georgia, serif" }}>How Makao Realtors Operates</h3>
        <p className="text-slate-500 text-xs text-center max-w-lg mx-auto mb-12">
          An automated, safe escrow verification model that connects homeowners directly to verified renters/buyers without third-party brokers.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs relative">
            <span className="absolute top-4 right-4 text-3xl font-extrabold text-[#F5A623]/25 font-mono select-none">01</span>
            <div className="w-10 h-10 rounded-full bg-[#1B6B3A]/10 text-[#1B6B3A] font-bold flex items-center justify-center text-sm mb-4">Register</div>
            <h4 className="font-bold text-sm text-gray-800 mb-2">Create Account</h4>
            <p className="text-xs text-gray-500 leading-relaxed">Sign up instantly. Declare your role (Renter, Buyer, Landlord, or Selling Owner) with your Kenyan +254 phone.</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs relative">
            <span className="absolute top-4 right-4 text-3xl font-extrabold text-[#F5A623]/25 font-mono select-none">02</span>
            <div className="w-10 h-10 rounded-full bg-[#1B6B3A]/10 text-[#1B6B3A] font-bold flex items-center justify-center text-sm mb-4">Browse</div>
            <h4 className="font-bold text-sm text-gray-800 mb-2">Explore Real Estate</h4>
            <p className="text-xs text-gray-500 leading-relaxed">Filter rent listings or properties for sale by county, budget limits, or standard amenities.</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs relative">
            <span className="absolute top-4 right-4 text-3xl font-extrabold text-[#F5A623]/25 font-mono select-none">03</span>
            <div className="w-10 h-10 rounded-full bg-[#1B6B3A]/10 text-[#1B6B3A] font-bold flex items-center justify-center text-sm mb-4">Pay</div>
            <h4 className="font-bold text-sm text-gray-800 mb-2">Safaricom STK Push</h4>
            <p className="text-xs text-gray-500 leading-relaxed">Landlords pay KES 100 per listing. Renters pay a single 10% connection fee securely via instant M-PESA prompting.</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs relative">
            <span className="absolute top-4 right-4 text-3xl font-extrabold text-[#F5A623]/25 font-mono select-none">04</span>
            <div className="w-10 h-10 rounded-full bg-[#1B6B3A]/10 text-[#1B6B3A] font-bold flex items-center justify-center text-sm mb-4">Reveal</div>
            <h4 className="font-bold text-sm text-gray-800 mb-2">Direct Connection</h4>
            <p className="text-xs text-gray-500 leading-relaxed">Our staff verifies the payment instantly. Renter obtains the owner's phone, WhatsApp and details directly!</p>
          </div>
        </div>
      </section>

      {/* Vetted Counties badges */}
      <section className="bg-[#1A2420] text-white py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-lg font-bold font-serif text-[#F5A623] uppercase tracking-wider mb-2">Vetted Counties Cover</h3>
          <p className="text-xs text-gray-400 mb-6">Listed property units across the main residential zones in Kenya:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {COVERED_COUNTIES.map(c => (
              <span
                key={c}
                onClick={() => onExploreProperties({ county: c, type: "All Types" })}
                className="bg-white/10 hover:bg-[#F5A623] hover:text-[#1B6B3A] px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border border-white/5 active:scale-95"
              >
                {c} County
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties Row preview */}
      <section className="py-16 max-w-6xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-baseline justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold font-serif text-gray-900" style={{ fontFamily: "Georgia, serif" }}>Latest Published Listings</h3>
            <p className="text-xs text-gray-500 mt-1">Directly listed by authenticated local landlords and developers</p>
          </div>
          <button
            onClick={() => onExploreProperties({ county: "All Counties", type: "All Types" })}
            className="text-[#1B6B3A] text-xs font-bold uppercase tracking-wider hover:underline flex items-center gap-1.5 cursor-pointer mt-3 sm:mt-0"
          >
            Explore the Directory <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {featuredProperties.length === 0 ? (
          <div className="bg-white border rounded-xl p-12 text-center text-slate-500 text-xs">
            No live properties published yet. Be the first to list!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map(p => {
              // Extract preview photo or solid fallback gradient
              const picUrl = p.images && p.images[0] ? p.images[0] : "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80";
              return (
                <div
                  key={p.id}
                  onClick={() => onExploreProperties({ county: p.county, type: p.propertyType })}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
                >
                  <div className="h-44 overflow-hidden bg-slate-100 relative">
                    <img
                      src={picUrl}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#1B6B3A] text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-green-500 shadow-sm">
                      For {p.listingType}
                    </div>
                  </div>
                  <div className="p-4">
                    <span className="text-[10px] font-bold text-gray-400 tracking-wider font-mono uppercase">{p.propertyType} • {p.town}, {p.county}</span>
                    <h4 className="font-bold text-sm text-gray-800 truncate mt-1">{p.name}</h4>
                    <div className="mt-3 flex items-baseline justify-between border-t border-gray-50 pt-3">
                      <span className="text-base font-extrabold text-[#1B6B3A]">
                        KES {p.price.toLocaleString()}
                        <span className="text-[10px] text-gray-400 font-normal">{p.listingType === "rent" ? "/mo" : ""}</span>
                      </span>
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">Verify Direct</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Flat Rate Landlord pricing scheme info */}
      <section className="bg-slate-50 border-t border-gray-100 py-16 px-6">
        <div className="max-w-4xl mx-auto rounded-2xl bg-white border border-gray-200 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-5">
          <div className="md:col-span-3 p-8 sm:p-10 flex flex-col justify-center">
            <span className="text-[10px] font-bold font-mono uppercase tracking-widest text-[#F5A623] mb-2">Our Transparent Pricing</span>
            <h4 className="text-xl sm:text-2xl font-serif font-bold text-slate-800 mb-4" style={{ fontFamily: "Georgia, serif" }}>Are You a Landlord or Selling Agent?</h4>
            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              We charge a flat standard rate of <span className="font-bold text-[#1B6B3A]">KES 100</span> per listing to verify and host. No hidden monthly dues, no complex billing. Just a standard checkout via safe Safaricom STK Push and your apartment or land is visible to thousands of direct shoppers instantly.
            </p>
            <div className="space-y-2 text-xs text-slate-600 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                <span>Upload up to 5 clean property layout photos</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                <span>Optimize listing description instantly using embedded AI models</span>
              </div>
            </div>
          </div>
          <div className="md:col-span-2 bg-[#1B6B3A] text-white p-8 flex flex-col justify-center text-center">
            <span className="text-[10px] font-mono tracking-widest opacity-80 uppercase font-bold mb-1">Standard Flat Fee</span>
            <span className="text-4xl font-extrabold text-[#F5A623] font-serif">KES 100</span>
            <span className="text-[11px] opacity-70 mt-1 uppercase font-bold">One-Time Posting Limit</span>
            <div className="h-px bg-white/10 my-6"></div>
            <button
              onClick={() => onOpenAuth("signup", "landlord")}
              className="w-full py-3 bg-[#F5A623] hover:bg-[#d98b11] text-[#1B6B3A] font-bold text-xs uppercase rounded-lg active:scale-95 transition-all shadow-md cursor-pointer"
            >
              Start Listing Now
            </button>
          </div>
        </div>
      </section>

      {/* Footnote */}
      <footer className="bg-[#111815] text-[#71 8096] text-xs py-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-gray-500">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/5 rounded flex items-center justify-center">
              <MakaoLogo size={20} strokeColor="#F5A623" />
            </div>
            <div>
              <p className="font-bold text-white tracking-wide" style={{ fontFamily: "Georgia, serif" }}>Makao Realtors</p>
              <p className="text-[10px] opacity-65 uppercase tracking-wide">Secure Kenyan Intermediary</p>
            </div>
          </div>
          <p className="text-center font-mono text-[11px] opacity-60">© 2026 Makao Realtors (makaorealtors.co.ke). Powered by Lipa Na M-PESA & Gemini AI.</p>
        </div>
      </footer>
    </div>
  );
}
