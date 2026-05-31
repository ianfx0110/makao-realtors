import React, { useState, useEffect } from "react";
import { User, Property, Payment, ConnectionRequest, SupportMessage, SiteSettings, Notification } from "./types";
import LandingPage from "./components/LandingPage";
import AdminStaffDashboard from "./components/AdminStaffDashboard";
import UserPortals from "./components/UserPortals";
import MpesaPrompt from "./components/MpesaPrompt";
import AiAdvisor from "./components/AiAdvisor";
import MakaoLogo from "./components/MakaoLogo";
import { LogIn, KeyRound, Smartphone, Sparkles, RefreshCw, X, Loader2, Eye, EyeOff } from "lucide-react";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

export default function App() {
  // Global Session state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  // Authentications states modules
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: "login" | "signup"; preferredRole?: string }>({
    isOpen: false,
    mode: "login"
  });
  const [authName, setAuthName] = useState("");
  const [authPhone, setAuthPhone] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authConfirmPassword, setAuthConfirmPassword] = useState("");
  const [authRole, setAuthRole] = useState<string>("renter");
  const [authLoading, setAuthLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // System Core Collections Ledger state
  const [properties, setProperties] = useState<Property[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [connections, setConnections] = useState<ConnectionRequest[]>([]);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    listingFee: 100,
    connectionFeePercent: 10,
    mpesaShortcode: "174379",
    mpesaPasskey: "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919",
    staffWhatsAppNumber: "+254712345678"
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Floating M-PESA STK simulation trigger state
  const [stkPrompt, setStkPrompt] = useState<{
    isOpen: boolean;
    checkoutRequestId: string;
    amount: number;
    purpose: string;
    targetName: string;
  } | null>(null);

  // Custom visual Toast list notification
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: "success" | "error" | "info" = "info") => {
    const id = "toast_" + Math.random().toString(36).substring(2, 6) + Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  // Check user session
  const syncSession = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const user = await res.json();
      setCurrentUser(user);
    } catch (e) {
      setCurrentUser(null);
    } finally {
      setCheckingSession(false);
    }
  };

  // Fetch full system collections
  const syncSystemCollections = async () => {
    setLoadingData(true);
    try {
      // Parallel fetches for pristine speed performance load
      const [propsRes, usersRes, paysRes, connsRes, msgsRes, settingsRes, notificationsRes] = await Promise.all([
        fetch("/api/properties"),
        fetch("/api/admin/users").catch(() => null), // Guards routes based on role
        fetch("/api/payments").catch(() => null),
        fetch("/api/connections").catch(() => null),
        fetch("/api/messages").catch(() => null),
        fetch("/api/admin/settings").catch(() => null),
        fetch("/api/notifications").catch(() => null)
      ]);

      const dataProps = propsRes ? await propsRes.json() : [];
      setProperties(dataProps);

      if (usersRes?.status === 200) setUsers(await usersRes.json());
      if (paysRes?.status === 200) setPayments(await paysRes.json());
      if (connsRes?.status === 200) setConnections(await connsRes.json());
      if (msgsRes?.status === 200) setMessages(await msgsRes.json());
      if (notificationsRes?.status === 200) setNotifications(await notificationsRes.json());
      
      if (settingsRes?.status === 200) {
        setSiteSettings(await settingsRes.json());
      }
    } catch (err) {
      console.warn("Permission constraints loaded correctly.");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    syncSession();
  }, []);

  useEffect(() => {
    syncSystemCollections();
  }, [currentUser]);

  // Auth Modals loops
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authPhone || !authPassword) {
      addToast("Phone and password details are required.", "error");
      return;
    }

    setAuthLoading(true);
    const endpoint = authModal.mode === "login" ? "/api/auth/login" : "/api/auth/signup";
    const bodyPayload = authModal.mode === "login"
      ? { phone: authPhone, password: authPassword }
      : {
          name: authName,
          phone: authPhone,
          email: authEmail,
          password: authPassword,
          confirmPassword: authConfirmPassword,
          role: authRole
        };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyPayload)
      });
      const data = await res.json();
      setAuthLoading(false);

      if (data.success) {
        addToast(authModal.mode === "login" ? `Welcome back, ${data.user.name}!` : `Welcome! Account registered successfully.`, "success");
        setCurrentUser(data.user);
        setAuthModal({ isOpen: false, mode: "login" });
        // Clean fields
        setAuthName("");
        setAuthPhone("");
        setAuthEmail("");
        setAuthPassword("");
        setAuthConfirmPassword("");
      } else {
        addToast(data.error || "Authentication failed. Validate credentials input.", "error");
      }
    } catch (err) {
      setAuthLoading(false);
      addToast("Offline simulation authentications resolved.", "error");
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        addToast("Logged out safely. Karibu tena!", "info");
        setCurrentUser(null);
      }
    } catch (e) {
      addToast("Network failure securely clearing session cookies", "error");
    }
  };

  // Launch pre-selected Auth from landing page actions
  const openAuthWithPreConfig = (mode: "login" | "signup", preferredRole?: string) => {
    setAuthModal({ isOpen: true, mode, preferredRole });
    if (preferredRole) {
      setAuthRole(preferredRole);
    } else {
      setAuthRole("renter");
    }
  };

  const handleMpesaPromptSuccess = (mpesaReceipt: string) => {
    addToast("Lipa Na M-PESA payment confirmed! Reference: " + mpesaReceipt, "success");
    setStkPrompt(null);
    syncSystemCollections();
  };

  const handleMpesaPromptFail = () => {
    addToast("M-PESA checkout session cancelled or rejected on screen.", "error");
    setStkPrompt(null);
  };

  // Preloading View Screen Skeletons while cookie validation checks boot
  if (checkingSession) {
    return (
      <div className="h-screen w-screen bg-[#F7F9F7] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#1B6B3A]" />
        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest font-mono select-none">Syncing Makao Ledger State...</span>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen bg-[#F7F9F7] text-gray-950 flex flex-col overflow-hidden">
      
      {/* 1. RENDER PORTAL VIEW DEPENDING ON CURRENT SECURE USER SESSION */}
      {currentUser ? (
        // Check if role is staff administrator
        currentUser.role === "admin" || currentUser.role === "staff" ? (
          <AdminStaffDashboard
            currentUser={currentUser}
            users={users}
            properties={properties}
            payments={payments}
            connections={connections}
            messages={messages}
            settings={siteSettings}
            notifications={notifications}
            onLogout={handleLogout}
            onRefreshData={syncSystemCollections}
            onAddToast={addToast}
          />
        ) : (
          <UserPortals
            currentUser={currentUser}
            properties={properties}
            connections={connections}
            payments={payments}
            messages={messages}
            notifications={notifications}
            settings={siteSettings}
            onLogout={handleLogout}
            onRefreshData={syncSystemCollections}
            onAddToast={addToast}
            onInitiateStkPush={(requestId, amount, purpose, targetName) => {
              setStkPrompt({
                isOpen: true,
                checkoutRequestId: requestId,
                amount,
                purpose,
                targetName
              });
            }}
          />
        )
      ) : (
        <LandingPage
          properties={properties}
          onOpenAuth={openAuthWithPreConfig}
          onExploreProperties={(filters) => {
            addToast(`Searching listings in ${filters.county}... please register or sign in to complete connectivity!`, "info");
            openAuthWithPreConfig("login");
          }}
        />
      )}

      {/* 2. AUTH OVERLAY MODAL FORM */}
      {authModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 border border-gray-200 shadow-2xl relative overflow-hidden">
            <button
              onClick={() => { setAuthModal({ isOpen: false, mode: "login" }); setShowPassword(false); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6 pt-3">
              <div className="w-10 h-10 bg-[#1B6B3A] rounded-lg flex items-center justify-center shrink-0 shadow-sm mx-auto mb-2.5 border border-emerald-800">
                <MakaoLogo size={24} strokeColor="#F5A623" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[#1B6B3A]" style={{ fontFamily: "Georgia, serif" }}>
                {authModal.mode === "login" ? "Welcome back to Makao" : "Register Brokerage Account"}
              </h3>
              <p className="text-xs text-slate-500 mt-1">Direct verification mechanism for homeowners and shoppers</p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs font-sans">
              
              {authModal.mode === "signup" && (
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Full Representative Name</label>
                  <input
                    type="text"
                    required
                    className="w-full text-xs p-2.5 border rounded-lg focus:outline-none"
                    placeholder="e.g. Kipchoge Keino"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Safaricom Line Phone</label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 font-mono text-[11px] select-none font-bold">+254 or 0</span>
                  <input
                    type="text"
                    required
                    placeholder="712345678"
                    className="w-full text-xs pl-14 pr-3 py-2.5 border rounded-lg focus:outline-none font-mono tracking-wider font-semibold"
                    value={authPhone}
                    onChange={(e) => setAuthPhone(e.target.value)}
                  />
                </div>
              </div>

              {authModal.mode === "signup" && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1 font-mono">Email details (Optional)</label>
                    <input
                      type="email"
                      className="w-full text-xs p-2.5 border rounded-lg focus:outline-none"
                      placeholder="name@gmail.co.ke"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1 font-mono">Identify account role category</label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      {[
                        { key: "renter", label: "Renter (Broker-Free)" },
                        { key: "landlord", label: "Landlord Seller" },
                        { key: "buyer", label: "Property Buyer" },
                        { key: "seller", label: "Selling Owner" }
                      ].map((item) => (
                        <label
                          key={item.key}
                          className={`border rounded-lg p-2.5 flex items-center justify-between gap-1 cursor-pointer hover:bg-[#F7F9F7] transition-all relative ${
                            authRole === item.key ? "border-2 border-[#1B6B3A] bg-green-50/20 font-bold" : "border-gray-200 text-gray-600"
                          }`}
                        >
                          <span className="text-[10px] uppercase font-bold tracking-wider">{item.label}</span>
                          <input
                            type="radio"
                            name="role"
                            value={item.key}
                            checked={authRole === item.key}
                            onChange={() => setAuthRole(item.key)}
                            className="text-[#1B6B3A] shrink-0 pointer-events-none absolute right-1.5 top-2 opacity-0"
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}

               <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1 font-mono">Access password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Min 8 characters"
                    className="w-full text-xs p-2.5 pr-10 border rounded-lg focus:outline-none"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer flex items-center justify-center p-1 rounded-sm hover:bg-slate-50"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {authModal.mode === "signup" && (
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Confirm password check</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Retype password"
                      className="w-full text-xs p-2.5 pr-10 border rounded-lg focus:outline-none"
                      value={authConfirmPassword}
                      onChange={(e) => setAuthConfirmPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer flex items-center justify-center p-1 rounded-sm hover:bg-slate-50"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3.5 bg-[#1B6B3A] hover:bg-[#0D4F2B] text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center"
              >
                {authLoading ? <Loader2 className="w-5 h-5 animate-spin text-white" /> : authModal.mode === "login" ? "Confirm Security PIN & Sign In" : "Register and Activate Accounts"}
              </button>
            </form>

            <div className="mt-5 text-center text-xs text-gray-500 border-t border-gray-100 pt-4">
              {authModal.mode === "login" ? (
                <p>
                  New to Makao Realtors?{" "}
                  <button
                    onClick={() => setAuthModal((prev) => ({ ...prev, mode: "signup" }))}
                    className="text-[#1B6B3A] font-bold underline cursor-pointer"
                  >
                    Create Account
                  </button>
                </p>
              ) : (
                <p>
                  Already have registered details?{" "}
                  <button
                    onClick={() => setAuthModal((prev) => ({ ...prev, mode: "login" }))}
                    className="text-[#1B6B3A] font-bold underline cursor-pointer"
                  >
                    Sign In
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. ABSOLUTE SAFARICOM M-PESA STK MOBILE POPUP SIMULATOR */}
      {stkPrompt?.isOpen && (
        <MpesaPrompt
          checkoutRequestId={stkPrompt.checkoutRequestId}
          amount={stkPrompt.amount}
          purpose={stkPrompt.purpose}
          targetName={stkPrompt.targetName}
          onClose={() => setStkPrompt(null)}
          onSuccess={handleMpesaPromptSuccess}
          onFail={handleMpesaPromptFail}
        />
      )}

      {/* 4. CHAT EXPERT ASSISTANT BOT DRAWER */}
      <AiAdvisor />

      {/* 5. VISUAL TOAST ALERTS OVERLAY */}
      <div className="fixed top-6 right-6 z-55 flex flex-col gap-2 pointer-events-none max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded-xl shadow-lg border text-xs font-bold font-sans pointer-events-auto flex items-start gap-2 animate-bounce uppercase tracking-wide ${
              toast.type === "success" ? "bg-green-600 text-white border-green-700" :
              toast.type === "error" ? "bg-red-600 text-white border-red-700" : "bg-[#1C201E] text-[#F5A623] border-[#1C201E]"
            }`}
          >
            <span>{toast.type === "success" ? "✓" : toast.type === "error" ? "⚠" : "ℹ"}</span>
            <p className="flex-1 text-[11px] leading-snug normal-case font-medium">{toast.message}</p>
          </div>
        ))}
      </div>

    </div>
  );
}
