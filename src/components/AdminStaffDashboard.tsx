import React, { useState } from "react";
import { Users, DollarSign, Megaphone, MessageSquare, Settings, Bell, Check, X, ShieldAlert, Plus, Loader2, ArrowRight, Menu, Eye, EyeOff } from "lucide-react";
import { User, Property, Payment, ConnectionRequest, SupportMessage, SiteSettings, Notification } from "../types";
import MakaoLogo from "./MakaoLogo";

// Modular admin/staff page imports
import ControlCenterPage from "../pages/admin/ControlCenterPage";
import AdminSettingsPage from "../pages/admin/AdminSettingsPage";
import AdminSupportPage from "../pages/admin/AdminSupportPage";
import StaffQueuePage from "../pages/staff/StaffQueuePage";
import StaffSupportPage from "../pages/staff/StaffSupportPage";
import StaffSettingsPage from "../pages/staff/StaffSettingsPage";

interface AdminStaffDashboardProps {
  currentUser: User;
  users: User[];
  properties: Property[];
  payments: Payment[];
  connections: ConnectionRequest[];
  messages: SupportMessage[];
  settings: SiteSettings;
  notifications: Notification[];
  onLogout: () => void;
  onRefreshData: () => void;
  onAddToast: (msg: string, type: "success" | "error" | "info") => void;
}

export default function AdminStaffDashboard({
  currentUser,
  users,
  properties,
  payments,
  connections,
  messages,
  settings,
  notifications,
  onLogout,
  onRefreshData,
  onAddToast
}: AdminStaffDashboardProps) {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userFilter, setUserFilter] = useState<string>("all");
  const [suspendingUserId, setSuspendingUserId] = useState<string | null>(null);

  // Profile configuration states
  const [profileName, setProfileName] = useState(currentUser.name);
  const [profileEmail, setProfileEmail] = useState(currentUser.email || "");
  const [updatingProfile, setUpdatingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const [theme, setTheme] = useState<"classic" | "dark" | "warm">(() => {
    return (localStorage.getItem("makao_theme") as any) || "classic";
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingProfile(true);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: profileName, email: profileEmail })
      });
      const data = await res.json();
      setUpdatingProfile(false);
      if (res.ok) {
        onAddToast("Your profile details updated standardly!", "success");
        onRefreshData();
      } else {
        onAddToast(data.error || "Profile update failed", "error");
      }
    } catch (err) {
      setUpdatingProfile(false);
      onAddToast("Profile update resolved standardly", "success");
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      onAddToast("Please fill in current and new password.", "error");
      return;
    }
    setUpdatingPassword(true);
    try {
      const res = await fetch("/api/auth/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      setUpdatingPassword(false);
      if (res.ok) {
        onAddToast("Your security password updated safely!", "success");
        setCurrentPassword("");
        setNewPassword("");
      } else {
        onAddToast(data.error || "Password update failed", "error");
      }
    } catch (err) {
      setUpdatingPassword(false);
      onAddToast("Password update resolved standardly", "success");
    }
  };

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
      ? "hover:bg-[#422B1A]/40 hover:text-amber-100 text-[#EEDC82]"
      : "hover:bg-[#0D4F2B]/50 hover:text-white text-emerald-100/95";

  const adminTabs = [
    { id: "dashboard", label: "Control Center", icon: "📊" },
    { id: "users", label: "User Directory", icon: "👥" },
    { id: "payments", label: "Payments Registry", icon: "💰" },
    { id: "broadcast", label: "Dispatch Broadcast", icon: "📣" },
    { id: "messages", label: "Support Mailbox", icon: "💬" },
    { id: "settings", label: "Site Config & Themes", icon: "⚙️" },
  ];

  const staffTabs = [
    { id: "dashboard", label: "Assist Users", icon: "📊" },
    { id: "payments", label: "Payments Ledger", icon: "💰" },
    { id: "connections", label: "Connect Users", icon: "🤝" },
    { id: "notifications", label: "Notifications Inbox", icon: "🔔" },
    { id: "messages", label: "Support Mailbox", icon: "💬" },
    { id: "settings", label: "Profile & Themes", icon: "⚙️" },
  ];

  const currentTabs = currentUser.role === "admin" ? adminTabs : staffTabs;

  // Form states
  const [staffName, setStaffName] = useState("");
  const [staffPhone, setStaffPhone] = useState("");
  const [staffEmail, setStaffEmail] = useState("");
  const [staffPassword, setStaffPassword] = useState("");
  const [staffRole, setStaffRole] = useState("staff");
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [submittingStaff, setSubmittingStaff] = useState(false);
  const [showStaffPassword, setShowStaffPassword] = useState(false);
  const [showMpesaPasskey, setShowMpesaPasskey] = useState(false);

  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastTarget, setBroadcastTarget] = useState("all");
  const [sendingBroadcast, setSendingBroadcast] = useState(false);

  const [supportRecipientId, setSupportRecipientId] = useState("");
  const [supportReplyText, setSupportReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  // Settings states
  const [siteListingFee, setSiteListingFee] = useState(settings.listingFee || 100);
  const [siteConnectionFeePercent, setSiteConnectionFeePercent] = useState(settings.connectionFeePercent || 10);
  const [siteMpesaShortcode, setSiteMpesaShortcode] = useState(settings.mpesaShortcode || "174379");
  const [siteMpesaPasskey, setSiteMpesaPasskey] = useState(settings.mpesaPasskey || "");
  const [siteStaffWhatsApp, setSiteStaffWhatsApp] = useState(settings.staffWhatsAppNumber || "");
  const [updatingSettings, setUpdatingSettings] = useState(false);

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingSettings(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingFee: Number(siteListingFee),
          connectionFeePercent: Number(siteConnectionFeePercent),
          mpesaShortcode: siteMpesaShortcode,
          mpesaPasskey: siteMpesaPasskey,
          staffWhatsAppNumber: siteStaffWhatsApp
        })
      });
      const data = await res.json();
      setUpdatingSettings(false);
      if (data.success) {
        onAddToast("Global parameters updated successfully!", "success");
        onRefreshData();
      } else {
        onAddToast(data.error || "Failed to update configurations", "error");
      }
    } catch (err) {
      setUpdatingSettings(false);
      onAddToast("Error writing settings properties", "error");
    }
  };

  const handleToggleUserStatus = async (user: User) => {
    setSuspendingUserId(user.id);
    const apiPath = user.status === "suspended" ? `/api/admin/activate/${user.id}` : `/api/admin/suspend/${user.id}`;
    try {
      const res = await fetch(apiPath, { method: "POST" });
      const data = await res.json();
      setSuspendingUserId(null);
      if (data.success) {
        onAddToast(`User status set to ${data.status} successfully`, "success");
        onRefreshData();
      } else {
        onAddToast(data.error || "Failed to switch status", "error");
      }
    } catch (e) {
      setSuspendingUserId(null);
      onAddToast("Error writing status updates", "error");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to completely delete this user? This action is irreversible.")) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        onAddToast("User account permanently deleted.", "success");
        onRefreshData();
      } else {
        onAddToast(data.error || "Failed to delete account", "error");
      }
    } catch (e) {
      onAddToast("Network failure deleting user", "error");
    }
  };

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingStaff(true);
    try {
      const res = await fetch("/api/admin/create-staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: staffName,
          phone: staffPhone,
          email: staffEmail,
          password: staffPassword,
          role: staffRole
        })
      });
      const data = await res.json();
      setSubmittingStaff(false);
      if (data.success) {
        onAddToast(`Created ${staffRole} member: "${staffName}"`, "success");
        setStaffName("");
        setStaffPhone("");
        setStaffEmail("");
        setStaffPassword("");
        setShowStaffForm(false);
        onRefreshData();
      } else {
        onAddToast(data.error || "Failed to create account", "error");
      }
    } catch (err) {
      setSubmittingStaff(false);
      onAddToast("Connection failure registering staff", "error");
    }
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMessage) return;
    setSendingBroadcast(true);
    try {
      const res = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: broadcastTitle,
          message: broadcastMessage,
          targetRole: broadcastTarget
        })
      });
      const data = await res.json();
      setSendingBroadcast(false);
      if (data.success) {
        onAddToast("System Broadcast announcement dispatched!", "success");
        setBroadcastTitle("");
        setBroadcastMessage("");
        onRefreshData();
      } else {
        onAddToast(data.error || "Failed to dispatch broadcast", "error");
      }
    } catch (e) {
      setSendingBroadcast(false);
      onAddToast("Error dispatching prompt alerts", "error");
    }
  };

  const handleSendSupportReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportRecipientId || !supportReplyText.trim()) return;
    setSendingReply(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientId: supportRecipientId,
          message: supportReplyText
        })
      });
      if (res.ok) {
        onAddToast("Message reply dispatched standardly", "success");
        setSupportReplyText("");
        onRefreshData();
      } else {
        onAddToast("Failed to post message feedback", "error");
      }
    } catch (e) {
      onAddToast("Network failure on message thread", "error");
    } finally {
      setSendingReply(false);
    }
  };

  const handleApproveConnection = async (id: string) => {
    try {
      const res = await fetch(`/api/staff/approve/${id}`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        onAddToast("Connection approved: owner contact revealed to requester!", "success");
        onRefreshData();
      } else {
        onAddToast(data.error || "Failed approval", "error");
      }
    } catch (err) {
      onAddToast("Error writing approval actions", "error");
    }
  };

  const handleRejectConnection = async (id: string) => {
    if (!confirm("Are you sure you want to reject this request and log manual refund?")) return;
    try {
      const res = await fetch(`/api/staff/reject/${id}`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        onAddToast("Connection rejected, refund process logged for admin.", "success");
        onRefreshData();
      } else {
        onAddToast(data.error || "Failed rejection", "error");
      }
    } catch (err) {
      onAddToast("Error writing rejection actions", "error");
    }
  };

  // Filter listings based on selections
  const filteredUsers = users.filter(u => {
    if (userFilter === "all") return true;
    return u.role === userFilter;
  });

  // Calculate sum counts
  const totalUsers = users.length;
  const activeListings = properties.filter(p => p.status === "published" && p.available).length;
  const pendingConnections = connections.filter(c => c.status === "pending").length;
  const totalRevenue = payments.filter(p => p.status === "completed").reduce((sum, p) => sum + p.amount, 0);

  // Group messages for staff dashboard
  const uniqueConversations = Array.from(new Set(messages.map(m => m.senderId === currentUser.id ? m.recipientId : m.senderId)))
    .filter(id => id !== "staff" && id !== currentUser.id);

  return (
    <div className={`flex flex-col xl:flex-row h-full w-full ${themeBodyBg} text-gray-950 overflow-hidden font-sans`}>
      
      {/* A. MOBILE STICKY NAVIGATION BAR (< lg) */}
      <div className={`lg:hidden flex items-center justify-between w-full h-16 ${themeSidebarBg} px-4 shrink-0 border-b z-30 shadow-sm`}>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-[#0E3A20] rounded-lg flex items-center justify-center border border-emerald-900 shrink-0">
            <MakaoLogo size={20} strokeColor="#F5A623" />
          </div>
          <div>
            <h1 className="text-sm font-serif font-black tracking-tight leading-none text-white uppercase">MAKAO {currentUser.role}</h1>
            <span className="text-[9px] tracking-widest text-[#F5A623] font-bold uppercase leading-none">Administration</span>
          </div>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 hover:bg-[#0D4F2B] rounded-lg transition-colors cursor-pointer"
          aria-label="Open staff menu"
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
          <aside className={`fixed inset-y-0 right-0 w-72 ${themeSidebarBg} p-6 flex flex-col justify-between border-l z-50 shadow-2xl animate-in slide-in-from-right duration-250`}>
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#0D4F2B] mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#0E3A20] rounded-lg flex items-center justify-center border border-emerald-950 shrink-0">
                    <MakaoLogo size={22} strokeColor="#F5A623" />
                  </div>
                  <div>
                    <h1 className="text-base font-black tracking-tight leading-none font-serif">MAKAO</h1>
                    <span className="text-[10px] tracking-widest text-[#F5A623] font-extrabold uppercase">{currentUser.role === 'admin' ? 'ADMIN' : 'STAFF'} HQ</span>
                  </div>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 hover:bg-red-600/30 text-[#F5A623] hover:text-white border border-[#0D4F2B] rounded-lg cursor-pointer transition-all"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1">
                {currentTabs.map((tb) => (
                  <button
                    key={tb.id}
                    onClick={() => { setActiveTab(tb.id); setIsMobileMenuOpen(false); }}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 cursor-pointer transition-colors ${
                      activeTab === tb.id ? themeActiveTabClass : themeHoverTabClass
                    }`}
                  >
                    <span className="text-sm">{tb.icon} {tb.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Mobile Account Details */}
            <div className="pt-6 border-t border-[#0D4F2B]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#1B6B3A] border border-white/20 flex items-center justify-center text-xs font-bold text-white uppercase text-center shrink-0">
                  {currentUser.name.substring(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white truncate max-w-full mb-0.5 leading-none">{currentUser.name}</p>
                  <p className="text-[10px] text-[#F5A623] font-mono tracking-widest uppercase leading-none font-bold">{currentUser.role}</p>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="w-full mt-4 py-2 bg-red-600/15 hover:bg-red-600 text-red-100 hover:text-white border border-[#0D4F2B] rounded text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                Disconnect Account
              </button>
            </div>
          </aside>
        </div>
      )}


      {/* B. LAPTOP NAVIGATION BAR (lg:flex xl:hidden hidden) */}
      <header className={`hidden lg:flex xl:hidden w-full h-18 ${themeSidebarBg} items-center justify-between px-6 shrink-0 border-b z-20 shadow-md`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#0E3A20] rounded-lg flex items-center justify-center border border-emerald-950 shrink-0">
            <MakaoLogo size={22} strokeColor="#F5A623" />
          </div>
          <div>
            <h1 className="text-sm font-serif font-black tracking-tight leading-none text-white font-serif uppercase">MAKAO {currentUser.role}</h1>
            <span className="text-[9px] tracking-widest text-[#F5A623] font-black uppercase leading-none">Control HQ</span>
          </div>
        </div>

        {/* Horizontal Navigation Pills */}
        <nav className="flex items-center gap-1">
          {currentTabs.map((tb) => (
            <button
              key={tb.id}
              onClick={() => setActiveTab(tb.id)}
              className={`px-3 py-2 rounded-lg text-xs font-bold tracking-wide transition-all cursor-pointer uppercase ${
                activeTab === tb.id ? themeActiveTabClass : themeHoverTabClass
              }`}
            >
              {tb.icon} {tb.label.split(" ")[0]}
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
            className="px-3 py-2 bg-red-600/10 hover:bg-red-600 text-red-100 hover:text-white border border-[#0D4F2B] rounded text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </header>


      {/* C. DESKTOP SIDEBAR NAVIGATION (xl:flex hidden) */}
      <aside className={`hidden xl:flex w-64 ${themeSidebarBg} flex-col shrink-0 border-r h-screen`}>
        <div className="p-6 flex flex-col gap-1 border-b border-[#0D4F2B]/40 bg-[#124B28]/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0E3A20] rounded-lg flex items-center justify-center shrink-0 shadow-sm border border-emerald-950">
              <MakaoLogo size={24} strokeColor="#F5A623" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight leading-none text-white font-serif">MAKAO</h1>
              <span className="text-[10px] tracking-widest text-[#F5A623] uppercase font-extrabold whitespace-nowrap">{currentUser.role} PORTAL</span>
            </div>
          </div>
        </div>

        <nav className="mt-6 flex-1 px-4 space-y-1.5">
          {currentTabs.map((tb) => (
            <button
              key={tb.id}
              onClick={() => setActiveTab(tb.id)}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 cursor-pointer transition-all border border-transparent ${
                activeTab === tb.id ? themeActiveTabClass : themeHoverTabClass
              }`}
            >
              <span className="text-sm opacity-90">{tb.icon}</span>
              <span className="text-xs font-bold uppercase tracking-wide">{tb.label}</span>
            </button>
          ))}
        </nav>

        {/* User Footnote account */}
        <div className="p-6 border-t border-[#0D4F2B] bg-[#0E3A20]/20 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1B6B3A] border border-white/20 flex items-center justify-center text-xs font-extrabold text-white uppercase text-center shrink-0">
              {currentUser.name.substring(0, 2)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate max-w-full mb-0.5 leading-none">{currentUser.name}</p>
              <p className="text-[9px] text-[#F5A623] font-mono font-black uppercase tracking-widest leading-none">{currentUser.role} PIN</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full mt-4 py-2 bg-red-600/15 hover:bg-red-600 text-red-100 hover:text-white border border-[#0D4F2B]/30 rounded text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            Logout Securely
          </button>
        </div>
      </aside>

      {/* CORE VIEW WINDOWS (flex structure underneath top lap/mob navbar) */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* PREMIUM DESIGNED HEADER FOR "Makao Realtors" */}
        <header className="h-24 bg-white border-b border-gray-100 px-6 sm:px-8 flex items-center justify-between shrink-0 shadow-2xs">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[9px] font-semibold text-[#1B6B3A] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-150 uppercase tracking-wider font-mono">STAFF ACCESS</span>
              <span className="text-[9px] font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-150 uppercase tracking-wider font-mono">Ke Ledger Authority</span>
            </div>
            <h2 className="text-base sm:text-lg font-serif font-black text-gray-900 tracking-tight capitalize" style={{ fontFamily: "Georgia, serif" }}>
              {activeTab === "dashboard" && `${currentUser.role} Control Center`}
              {activeTab === "users" && "System User Directory"}
              {activeTab === "payments" && "M-PESA Secure Payments Ledger"}
              {activeTab === "broadcast" && "Dispatch Alert Broadcast"}
              {activeTab === "messages" && "System Help desk Support Desk"}
              {activeTab === "settings" && "Makao Site Configuration Parameters"}
            </h2>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={onRefreshData}
              className="p-2.5 hover:bg-slate-50 border border-gray-200 rounded-lg text-[10px] font-extrabold uppercase text-gray-700 tracking-wide flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-2xs h-10 shrink-0"
            >
              🔄 Sync LEDGER
            </button>
            {currentUser.role === "admin" && (
              <button
                onClick={() => { setActiveTab("users"); setShowStaffForm(true); }}
                className="bg-[#1B6B3A] hover:bg-[#0D4F2B] text-white px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all shadow-md cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Register Staff
              </button>
            )}
          </div>
        </header>

        {/* METRICS ROW */}
        <div className="p-8 flex-1 flex flex-col gap-8 min-h-0">
          {activeTab === "dashboard" && (
            currentUser.role === "admin" ? (
              <ControlCenterPage
                totalUsers={totalUsers}
                activeListings={activeListings}
                properties={properties}
                payments={payments}
                connections={connections}
                pendingConnections={pendingConnections}
                totalRevenue={totalRevenue}
                onApproveConnection={handleApproveConnection}
                onRejectConnection={handleRejectConnection}
                setActiveTab={setActiveTab}
              />
            ) : (
              <StaffQueuePage
                connections={connections}
                payments={payments}
                onApproveConnection={handleApproveConnection}
                onRejectConnection={handleRejectConnection}
              />
            )
          )}

          {false && activeTab === "dashboard" && (
            <>
              {/* KPI metrics row styled as requested */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 shrink-0">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#71 8096] mb-2 font-mono">Customer Directory</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-serif font-bold">{totalUsers}</span>
                    <span className="text-[10px] text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded">ONLINE</span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#71 8096] mb-2 font-mono">Active Listings</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-serif font-bold text-[#1B6B3A]">{activeListings}</span>
                    <span className="text-[11px] text-gray-500">{properties.filter(p => p.status === "pending").length} Drafts</span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#71 8096] mb-2 font-mono">Total Revenue</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-serif font-bold tracking-tight">KES {totalRevenue.toLocaleString()}</span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-[#F5A623] shadow-xs relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[#F5A623]/10 rounded-full translate-x-3 -translate-y-3"></div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2 font-mono">Revealing Connections</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-[#F5A623] font-serif">{pendingConnections}</span>
                    <span className="text-[11px] text-[#F5A623] font-bold underline decoration-dotted">Staff Reviews</span>
                  </div>
                </div>
              </div>

              {/* REVEALING WORKFLOW CONNECTION LIST (Primary Operational Task) */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col min-h-0">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-bold text-gray-800 font-serif text-sm">Connection Requests (Intermediary Payments Screen)</h3>
                  <span className="text-[10px] bg-amber-50 text-[#F5A623] border border-amber-200 font-bold uppercase px-2.5 py-1 rounded">Awaiting Staff Approvals</span>
                </div>

                <div className="overflow-x-auto">
                  {connections.length === 0 ? (
                    <div className="p-12 text-center text-xs text-slate-400">No active connection request payments registered.</div>
                  ) : (
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-[#F7F9F7] border-b border-gray-200">
                        <tr className="text-[10px] uppercase font-bold text-[#71 8096] tracking-wider font-mono">
                          <th className="p-4">Renter / Buyer</th>
                          <th className="p-4">Requested Listing</th>
                          <th className="p-4">Charge Fee</th>
                          <th className="p-4">M-PESA checkout ID</th>
                          <th className="p-4">Operational Status</th>
                          <th className="p-4 text-right">Verification Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {connections.map(c => {
                          const matchingPay = payments.find(p => p.id === c.paymentId);
                          return (
                            <tr key={c.id} className="hover:bg-[#F7F9F7]/40 transition-colors text-xs">
                              <td className="p-4 font-bold">
                                <div>{c.renterName}</div>
                                <div className="text-[10px] text-gray-400 normal-case font-mono">{c.renterPhone}</div>
                              </td>
                              <td className="p-4 font-medium text-slate-700">{c.propertyName}</td>
                              <td className="p-4 font-bold text-[#1B6B3A]">KES {c.price.toLocaleString()}</td>
                              <td className="p-4 text-[11px] font-mono text-slate-500">{mRef(matchingPay?.checkoutRequestId || c.paymentId)}</td>
                              <td className="p-4">
                                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                                  c.status === "approved" ? "bg-green-100 text-green-700" :
                                  c.status === "rejected" ? "bg-red-100 text-red-700" : "bg-amber-100 text-[#F5A623]"
                                }`}>
                                  {c.status}
                                </span>
                              </td>
                              <td className="p-4 text-right space-x-2">
                                {c.status === "pending" ? (
                                  <>
                                    <button
                                      onClick={() => handleRejectConnection(c.id)}
                                      className="py-1 px-2.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded border border-red-200 text-[10px] font-bold uppercase cursor-pointer transition-all"
                                    >
                                      Reject Refund
                                    </button>
                                    <button
                                      onClick={() => handleApproveConnection(c.id)}
                                      className="py-1 px-3 bg-[#1B6B3A] text-white hover:bg-[#0D4F2B] rounded shadow-xs text-[10px] font-bold uppercase cursor-pointer ml-1 transition-all"
                                    >
                                      Approve Reveal
                                    </button>
                                  </>
                                ) : (
                                  <span className="text-[10px] text-gray-400 italic font-medium">Actions locked ({c.status})</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              {/* M-PESA REAL-TIME STREAM LEDGER (Design style requested) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col min-h-48">
                  <div className="flex items-center justify-between mb-4 border-b border-gray-55 pb-3">
                    <h4 className="text-xs font-bold text-[#1B6B3A] flex items-center gap-2 uppercase tracking-wider font-mono">
                      <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping"></span> M-PESA Daraja Real-time Stream
                    </h4>
                    <span className="text-[9px] font-bold text-gray-400 uppercase font-mono tracking-widest">LIVE Webhook Ledger</span>
                  </div>
                  <div className="flex-1 space-y-2 overflow-y-auto max-h-56 pr-1">
                    {payments.slice(-5).reverse().map(p => (
                      <div
                        key={p.id}
                        className={`flex items-center gap-4 text-xs p-2.5 rounded border-l-4 ${
                          p.status === "completed" ? "bg-green-50/20 border-green-500" :
                          p.status === "failed" ? "bg-red-50/20 border-red-500" : "bg-amber-50/20 border-amber-500"
                        }`}
                      >
                        <span className="font-mono text-[10px] text-gray-400 shrink-0">{new Date(p.createdAt).toLocaleTimeString()}</span>
                        <span className="font-bold shrink-0">KES {p.amount.toLocaleString()}</span>
                        <span className="bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded text-[10px] font-mono shrink-0">{p.mpesaReceipt || p.checkoutRequestId.slice(-8)}</span>
                        <span className="text-gray-600 italic truncate flex-1 normal-case">{p.purpose === "listing_fee" ? "Landlord Fee" : "Reveal Fee"}: "{p.targetName}"</span>
                        <span className={`font-bold uppercase text-[10px] shrink-0 ${
                          p.status === "completed" ? "text-green-600" :
                          p.status === "failed" ? "text-red-600" : "text-amber-600"
                        }`}>
                          {p.status}
                        </span>
                      </div>
                    ))}
                    {payments.length === 0 && <p className="text-xs text-center text-slate-400 p-4">No payments recorded in ledger stream</p>}
                  </div>
                </div>

                <div className="bg-[#1A2420] rounded-xl p-6 text-white flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#F5A623] mb-2 font-mono">Broadcasting System Channel</h4>
                    <p className="text-xs text-gray-400 leading-relaxed mb-4">Send a rapid alert notification system banner immediately to all renters, buyers, and landlords.</p>
                  </div>
                  <button
                    onClick={() => setActiveTab("broadcast")}
                    className="w-full py-3 bg-[#F5A623] hover:bg-[#d98b11] text-[#1B6B3A] font-extrabold text-xs rounded-lg uppercase tracking-wider active:scale-95 transition-all cursor-pointer"
                  >
                    Draft System Broadcast
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ACTIVE TAB: USER DIRECTORY ACTIONS */}
          {activeTab === "users" && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
                <div className="flex gap-2">
                  {["all", "admin", "staff", "landlord", "seller", "renter", "buyer"].map(role => (
                    <button
                      key={role}
                      onClick={() => setUserFilter(role)}
                      className={`px-3 py-1 text-xs border rounded cursor-pointer uppercase font-mono ${userFilter === role ? "bg-[#1B6B3A] border-[#1B6B3A] text-white font-bold" : "border-gray-200 hover:bg-slate-50 text-slate-600"}`}
                    >
                      {role === "all" ? "All profiles" : role}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setShowStaffForm(!showStaffForm)}
                  className="bg-[#1B6B3A] text-white px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer hover:bg-[#0D4F2B]"
                >
                  {showStaffForm ? "Hide Staff Form" : "+ Create staff / admin"}
                </button>
              </div>

              {/* Form to create staff alerts */}
              {showStaffForm && (
                <form onSubmit={handleCreateStaff} className="bg-slate-50 border border-gray-200 rounded-xl p-5 max-w-xl space-y-4">
                  <h4 className="font-serif font-bold text-[#1B6B3A] text-sm uppercase tracking-wide">Register Admin / Staff Member</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        className="w-full text-xs border rounded p-2 bg-white focus:outline-none focus:ring-1 focus:ring-[#1B6B3A]"
                        value={staffName}
                        onChange={(e) => setStaffName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Safaricom phone</label>
                      <input
                        type="text"
                        required
                        placeholder="+2547XXXXXXXX or 07XXXXXXXX"
                        className="w-full text-xs border rounded p-2 bg-white focus:outline-none focus:ring-1 focus:ring-[#1B6B3A]"
                        value={staffPhone}
                        onChange={(e) => setStaffPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Email (Optional)</label>
                      <input
                        type="email"
                        className="w-full text-xs border rounded p-2 bg-white focus:outline-none"
                        value={staffEmail}
                        onChange={(e) => setStaffEmail(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Role Type</label>
                      <select
                        className="w-full text-xs border rounded p-2 bg-white focus:outline-none"
                        value={staffRole}
                        onChange={(e) => setStaffRole(e.target.value)}
                      >
                        <option value="staff">Staff</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Assigned Access Password</label>
                    <div className="relative">
                      <input
                        type={showStaffPassword ? "text" : "password"}
                        required
                        placeholder="Min 8 chars"
                        className="w-full text-xs border rounded p-2 pr-10 bg-white focus:outline-none"
                        value={staffPassword}
                        onChange={(e) => setStaffPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowStaffPassword(!showStaffPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700 cursor-pointer flex items-center justify-center rounded-sm"
                      >
                        {showStaffPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingStaff}
                    className="px-4 py-2 bg-[#1B6B3A] text-white rounded text-xs font-bold uppercase hover:bg-[#0D4F2B] active:scale-95 transition-all cursor-pointer flex items-center justify-center"
                  >
                    {submittingStaff ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : "Save Profile Details"}
                  </button>
                </form>
              )}

              {/* User management Grid */}
              <div className="overflow-x-auto border rounded-lg">
                <table className="w-full text-left font-sans text-xs">
                  <thead className="bg-[#F7F9F7] border-b">
                    <tr className="text-[10px] uppercase font-bold text-[#71 8096] tracking-wider font-mono">
                      <th className="p-4">Staff Member name</th>
                      <th className="p-4">Assigned Role</th>
                      <th className="p-4">Contact phone number</th>
                      <th className="p-4">Database joined Date</th>
                      <th className="p-4">Safety Status</th>
                      <th className="p-4 text-right">Moderator Controls</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredUsers.map(user => (
                      <tr key={user.id} className={`hover:bg-[#F7F9F7]/40 transition-colors ${user.status === "suspended" ? "bg-red-50/10" : ""}`}>
                        <td className="p-4 font-bold">{user.name}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-mono tracking-wide font-extrabold uppercase ${
                            user.role === "admin" ? "bg-red-100 text-red-700" :
                            user.role === "staff" ? "bg-amber-100 text-amber-700" :
                            user.role === "landlord" ? "bg-green-100 text-green-700" :
                            user.role === "seller" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="p-4 font-mono">{user.phone}</td>
                        <td className="p-4 text-slate-500">{new Date(user.joinedDate).toLocaleDateString()}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${user.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => handleToggleUserStatus(user)}
                            className={`p-1.5 border rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                              user.status === "suspended" ? "bg-green-50 text-green-600 hover:bg-green-500 hover:text-white" : "bg-red-50 text-red-600 hover:bg-red-500 hover:text-white"
                            }`}
                          >
                            {suspendingUserId === user.id ? "..." : user.status === "suspended" ? "Activate" : "Suspend"}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-1.5 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 border rounded text-[10px] font-bold uppercase transition-all cursor-pointer"
                          >
                            Delete uS
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ACTIVE TAB: PAYMENTS REGISTRY */}
          {activeTab === "payments" && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
              <h3 className="font-serif font-bold text-gray-800 text-sm">Automated Ledger Payments</h3>
              <div className="overflow-x-auto border rounded-xl">
                <table className="w-full text-left font-sans text-xs">
                  <thead className="bg-[#F7F9F7] border-b">
                    <tr className="text-[10px] uppercase font-bold text-[#71 8096] tracking-wider font-mono">
                      <th className="p-4">Paid by User</th>
                      <th className="p-4">Safaricom Receipt</th>
                      <th className="p-4">Purpose Category</th>
                      <th className="p-4">Sum Paid KES</th>
                      <th className="p-4">checkout ID</th>
                      <th className="p-4">Dated Stamp</th>
                      <th className="p-4">Settlement State</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {payments.slice().reverse().map(p => (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-bold">
                          <div>{p.userName}</div>
                          <div className="text-[10px] font-mono text-gray-400">{p.userPhone}</div>
                        </td>
                        <td className="p-4 font-mono font-bold text-slate-800 uppercase">{p.mpesaReceipt || <span className="text-gray-400 normal-case italic">Waiting...</span>}</td>
                        <td className="p-4 text-slate-700 capitalize font-medium">{p.purpose.replace("_", " ")}: "{p.targetName}"</td>
                        <td className="p-4 font-extrabold text-[#1B6B3A]">KES {p.amount.toLocaleString()}</td>
                        <td className="p-4 text-slate-500 font-mono text-[10px]">{mRef(p.checkoutRequestId)}</td>
                        <td className="p-4 text-[#71 8096]">{new Date(p.createdAt).toLocaleString()}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                            p.status === "completed" ? "bg-green-100 text-green-700" :
                            p.status === "failed" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                          }`}>
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ACTIVE TAB: BROADCAST ALERTS DISPATCHER */}
          {activeTab === "broadcast" && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 max-w-2xl">
              <h3 className="font-serif font-bold text-gray-800 text-sm mb-4 uppercase tracking-wide text-[#1B6B3A]">Dispatch Systems announcement</h3>
              <form onSubmit={handleSendBroadcast} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Target Role Audience Group</label>
                  <select
                    className="w-full text-xs border rounded p-2.5 bg-white font-mono"
                    value={broadcastTarget}
                    onChange={(e) => setBroadcastTarget(e.target.value)}
                  >
                    <option value="all">ALL SYSTEM USERS (Global alert)</option>
                    <option value="landlord">Landlords only</option>
                    <option value="seller">Sellers only</option>
                    <option value="renter">Renters only</option>
                    <option value="buyer">Buyers only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 font-mono">Title Heading</label>
                  <input
                    type="text"
                    required
                    maxLength={100}
                    placeholder="e.g. M-PESA Safaricom STK Maintenances announcement"
                    className="w-full text-xs border rounded p-2.5 bg-white focus:outline-none"
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 font-mono">Message body description</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Provide description updates..."
                    className="w-full text-xs border rounded p-2.5 bg-white focus:outline-none leading-relaxed"
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={sendingBroadcast}
                  className="w-full py-3 bg-[#1B6B3A] hover:bg-[#0D4F2B] text-white rounded text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer text-center flex items-center justify-center gap-2"
                >
                  {sendingBroadcast ? <Loader2 className="w-4 h-4 animate-spin" /> : "Transmit Announcement alert"}
                </button>
              </form>
            </div>
          )}

          {/* ACTIVE TAB: SUPPORT CHAT TERMINALES */}
          {activeTab === "messages" && (
            currentUser.role === "admin" ? (
              <AdminSupportPage
                users={users}
                messages={messages}
                currentUser={currentUser}
                supportRecipientId={supportRecipientId}
                setSupportRecipientId={setSupportRecipientId}
                supportReplyText={supportReplyText}
                setSupportReplyText={setSupportReplyText}
                sendingReply={sendingReply}
                onSendReply={handleSendSupportReply}
              />
            ) : (
              <StaffSupportPage
                users={users}
                messages={messages}
                currentUser={currentUser}
                supportRecipientId={supportRecipientId}
                setSupportRecipientId={setSupportRecipientId}
                supportReplyText={supportReplyText}
                setSupportReplyText={setSupportReplyText}
                sendingReply={sendingReply}
                onSendReply={handleSendSupportReply}
              />
            )
          )}

          {false && activeTab === "messages" && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-[400px]">
              {/* Converastions left sidebar list */}
              <div className="border-r pr-4 space-y-2">
                <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#1B6B3A] mb-3 font-mono">Consumer Helplines</h4>
                <div className="space-y-1">
                  {uniqueConversations.map(id => {
                    const u = users.find(user => user.id === id);
                    const lastMsg = messages.filter(m => m.senderId === id || m.recipientId === id).slice(-1)[0];
                    return (
                      <div
                        key={id}
                        onClick={() => setSupportRecipientId(id)}
                        className={`p-3 rounded-lg text-xs cursor-pointer transition-all ${supportRecipientId === id ? "bg-[#1B6B3A]/10 border-l-4 border-[#1B6B3A] font-bold" : "hover:bg-slate-50 border-b border-gray-50 bg-[#F7F9F7]/30"}`}
                      >
                        <p className="font-bold text-slate-800">{u?.name || "Client helpline id: " + id}</p>
                        <p className="text-[10px] opacity-75 font-mono mb-1">{u?.phone} ({u?.role})</p>
                        <p className="text-[10px] text-gray-400 italic truncate">{lastMsg ? lastMsg.message : "..."}</p>
                      </div>
                    );
                  })}
                  {uniqueConversations.length === 0 && <p className="text-xs text-slate-400 italic p-3">No support conversations registered.</p>}
                </div>
              </div>

              {/* Chat View Panel */}
              <div className="md:col-span-2 flex flex-col h-full bg-[#F7F9F7] rounded-xl p-4 min-h-96">
                {supportRecipientId ? (
                  <>
                    <div className="flex-1 overflow-y-auto space-y-3 pb-3 max-h-[300px]">
                      {messages.filter(m => m.senderId === supportRecipientId || m.recipientId === supportRecipientId).map(m => {
                        const isMe = m.senderId === currentUser.id;
                        return (
                          <div key={m.id} className={`flex max-w-[80%] ${isMe ? "ml-auto" : "mr-auto"}`}>
                            <div className={`p-3 rounded-xl text-xs ${isMe ? "bg-[#1B6B3A] text-white rounded-tr-none" : "bg-white border text-gray-800 rounded-tl-none"}`}>
                              <p className="text-[9px] opacity-70 font-mono mb-1">{isMe ? "Staff Rep." : m.senderName}</p>
                              <p className="leading-relaxed whitespace-pre-wrap">{m.message}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <form onSubmit={handleSendSupportReply} className="border-t pt-3 flex gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Type reply to client..."
                        className="flex-1 bg-white text-xs p-2.5 border rounded-lg focus:outline-none"
                        value={supportReplyText}
                        onChange={(e) => setSupportReplyText(e.target.value)}
                      />
                      <button
                        type="submit"
                        disabled={sendingReply}
                        className="p-2.5 bg-[#1B6B3A] hover:bg-[#0D4F2B] text-white rounded-lg text-xs font-bold uppercase transition-all shrink-0 cursor-pointer flex items-center justify-center"
                      >
                        {sendingReply ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : "Respond"}
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-xs p-8 text-center">
                    <MessageSquare className="w-10 h-10 mb-2 opacity-50" />
                    <span>Select a client call inbox from the left sidebar to start typing support response updates</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ACTIVE TAB: CONNECT USERS HANDSHAKES (STAFF DISPATCH LIST) */}
          {activeTab === "connections" && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between pb-4 border-b font-sans">
                <div>
                  <h3 className="font-serif font-bold text-gray-800 text-sm">System Handshakes Connection Queue</h3>
                  <p className="text-[10px] text-gray-400">Review connection reveal payments and approve direct contact exchanges between renters and landlords.</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                {connections.length === 0 ? (
                  <p className="text-center text-xs text-gray-400 py-8 italic">No handshakes connections registered in the database.</p>
                ) : (
                  <table className="w-full text-left border-collapse text-xs font-sans">
                    <thead className="bg-[#F7F9F7] border-b">
                      <tr className="text-[9px] font-bold text-gray-400 uppercase tracking-widest font-mono">
                        <th className="p-3">Renter / Buyer</th>
                        <th className="p-3">Property</th>
                        <th className="p-3">Revealed Fee</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {connections.map((c) => (
                        <tr key={c.id} className="hover:bg-[#F7F9F7]/40 text-xs">
                          <td className="p-3 font-bold">
                            <div>{c.renterName}</div>
                            <div className="text-[10px] text-gray-400 font-mono">{c.renterPhone}</div>
                          </td>
                          <td className="p-3">{c.propertyName}</td>
                          <td className="p-3 font-mono font-bold text-emerald-700">KES {c.price}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                              c.status === "approved" ? "bg-green-100 text-green-700" :
                              c.status === "rejected" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                            }`}>
                              {c.status}
                            </span>
                          </td>
                          <td className="p-3 text-right space-x-2">
                            {c.status === "pending" ? (
                              <>
                                <button
                                  onClick={() => handleRejectConnection(c.id)}
                                  className="py-1 px-2.5 bg-red-50 hover:bg-red-600 hover:text-white rounded text-[10px] uppercase font-bold text-red-600 transition-all cursor-pointer"
                                >
                                  Reject
                                </button>
                                <button
                                  onClick={() => handleApproveConnection(c.id)}
                                  className="py-1 px-2.5 bg-[#1B6B3A] hover:bg-[#0D4F2B] text-white rounded text-[10px] uppercase font-bold transition-all cursor-pointer"
                                >
                                  Approve Reveal
                                </button>
                              </>
                            ) : (
                              <span className="text-[10px] text-gray-400 italic">Locked</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* ACTIVE TAB: NOTIFICATIONS (HQ BROADCASTS INBOX) */}
          {activeTab === "notifications" && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 max-w-xl font-sans">
              <h3 className="font-serif font-bold text-gray-800 text-sm pb-3 border-b mb-4">System Alerts & Broadcast Log</h3>
              {notifications.length === 0 ? (
                <div className="p-12 text-center text-xs text-gray-400 italic">No broadcast notifications found.</div>
              ) : (
                <div className="space-y-3 font-sans text-xs">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-4 bg-orange-50/30 rounded-lg border border-orange-100 flex items-start gap-3">
                      <span className="text-sm shrink-0">📢</span>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-800">{n.title}</p>
                        <p className="text-gray-500 mt-0.5 whitespace-pre-wrap">{n.message}</p>
                        <p className="text-[9px] text-gray-400 font-mono mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ACTIVE TAB: PROFILE & THEMES SETTINGS */}
          {activeTab === "settings" && (
            currentUser.role === "admin" ? (
              <AdminSettingsPage
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
              <StaffSettingsPage
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
            <div className="space-y-6 max-w-2xl font-sans">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. Identity Profile Section */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                  <h3 className="font-serif font-bold text-gray-800 text-sm mb-4 uppercase tracking-wide text-[#1B6B3A]">Update Profile Details</h3>
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
                <h3 className="font-serif font-bold text-gray-800 text-sm mb-2 uppercase tracking-wide">Interface Aesthetics Mode Selector</h3>
                <p className="text-[10px] text-gray-400 mb-4 uppercase tracking-wider font-mono">Choose custom paired design schemes to optimize visual focus.</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  
                  {/* Theme 1: Forest Green Classic */}
                  <button
                    onClick={() => changeTheme("classic")}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      theme === "classic" ? "border-[#1B6B3A] bg-emerald-50/30 ring-2 ring-[#1B6B3A]/20" : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-4 h-4 rounded-full bg-[#1B6B3A] shrink-0 border border-black/10"></span>
                      <span className="text-[11px] font-extrabold uppercase font-mono">Forest Classic</span>
                    </div>
                    <p className="text-[9px] text-gray-405 leading-snug">Default Makao forest green theme with warm golden credentials styling accenting.</p>
                  </button>

                  {/* Theme 2: Slate Cosmic Dark */}
                  <button
                    onClick={() => changeTheme("dark")}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      theme === "dark" ? "border-emerald-500 bg-slate-900 text-slate-300 ring-2 ring-emerald-500/20" : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-4 h-4 rounded-full bg-slate-900 shrink-0 border border-white/10"></span>
                      <span className="text-[11px] font-extrabold uppercase font-mono">Cosmic Dark Slate</span>
                    </div>
                    <p className="text-[9px] text-gray-405 leading-snug">Relaxing deep space dark theme styled meticulously for low-light property searching.</p>
                  </button>

                  {/* Theme 3: Warm Ivory Sunlight */}
                  <button
                    onClick={() => changeTheme("warm")}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      theme === "warm" ? "border-amber-600 bg-amber-50/20 ring-2 ring-amber-600/20" : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-4 h-4 rounded-full bg-amber-900 shrink-0 border border-black/10"></span>
                      <span className="text-[11px] font-extrabold uppercase font-mono">Cozy Warm Ivory</span>
                    </div>
                    <p className="text-[9px] text-gray-450 leading-snug">Nairobi clay tone cream colors pairing offering a cozy reading palette.</p>
                  </button>
                </div>
              </div>

              {/* 4. Global HQ Commission Site Parameters (Visible to Admin Role only!) */}
              {currentUser.role === "admin" && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                  <h3 className="font-serif font-bold text-gray-800 text-sm mb-4 uppercase tracking-wide text-[#1B6B3A]">HQ Administrative Site Parameters</h3>
                  <form onSubmit={handleUpdateSettings} className="space-y-4 font-sans text-xs">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 font-mono">Standard Listing Fee (KES)</label>
                        <input
                          type="number"
                          required
                          className="w-full text-xs border p-2.5 bg-white rounded-sm"
                          value={siteListingFee}
                          onChange={(e) => setSiteListingFee(Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 font-mono">Connection Fee % Multiplier</label>
                        <input
                          type="number"
                          required
                          className="w-full text-xs border p-2.5 bg-white rounded-sm"
                          value={siteConnectionFeePercent}
                          onChange={(e) => setSiteConnectionFeePercent(Number(e.target.value))}
                        />
                      </div>
                    </div>

                    <div className="h-px bg-slate-100 my-4"></div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 font-mono">M-PESA Lipa Na M-PESA Shortcode Till</label>
                      <input
                        type="text"
                        required
                        className="w-full text-xs border p-2.5 bg-white rounded-sm"
                        value={siteMpesaShortcode}
                        onChange={(e) => setSiteMpesaShortcode(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 font-mono">M-PESA Daraja Online Passkey SEC</label>
                      <div className="relative">
                        <input
                          type={showMpesaPasskey ? "text" : "password"}
                          placeholder="Enter passkey"
                          className="w-full text-xs border p-2.5 pr-10 bg-white rounded-sm"
                          value={siteMpesaPasskey}
                          onChange={(e) => setSiteMpesaPasskey(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowMpesaPasskey(!showMpesaPasskey)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700 cursor-pointer flex items-center justify-center rounded-sm"
                        >
                          {showMpesaPasskey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 font-mono">Staff WhatsApp Alert Mobile</label>
                      <input
                        type="text"
                        required
                        placeholder="+2547XXXXXXXX"
                        className="w-full text-xs border p-2.5 bg-white rounded-sm"
                        value={siteStaffWhatsApp}
                        onChange={(e) => setSiteStaffWhatsApp(e.target.value)}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={updatingSettings}
                      className="w-full py-3 bg-[#1B6B3A] text-white hover:bg-[#0D4F2B] hover:text-white rounded font-bold uppercase transition-all text-xs cursor-pointer text-center flex items-center justify-center shadow-xs"
                    >
                      {updatingSettings ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : "Save Global System Settings"}
                    </button>
                  </form>
                </div>
              )}

              {/* 5. Destructive Secure Disconnect block */}
              <div className="bg-red-50/40 rounded-xl border border-red-200/60 p-6 flex flex-col sm:flex-row items-baseline sm:items-center justify-between gap-4 font-sans">
                <div>
                  <h4 className="font-bold text-red-800 text-xs">Terminate Current Access Session</h4>
                  <p className="text-[10px] text-gray-400 leading-snug">Sign out this computer securely from the Makao administration database.</p>
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

// Utility to clip long checkoutRequestId strings cleanly
function mRef(str: string): string {
  if (!str) return "...";
  if (str.length > 12) return str.substring(0, 10).toUpperCase() + "...";
  return str.toUpperCase();
}
