import React, { useState } from "react";
import { 
  Bell, Moon, Sun, Menu, X, Landmark, Compass, Map, FileText, BarChart2, ShieldCheck, RefreshCw, LogIn, Lock, User, Mail, ShieldAlert, CheckCircle2
} from "lucide-react";
import { UserProfile } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { safeConfetti } from "../utils/confetti";

interface HeaderProps {
  profile: UserProfile;
  selectedCity: string;
  onCityChange: (city: string) => void;
  onReset: () => void;
  resetting: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  onProfileUpdate?: (profile: UserProfile) => void;
}

// Crisp modern responsive vector app icon badge for Nivaran AI
const LogoIcon = () => (
  <div className="relative flex items-center justify-center h-8 w-8 bg-blue-50 dark:bg-emerald-950/40 rounded-xl border border-blue-100 dark:border-emerald-900/30 shadow-sm">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#34C759]">
      <path d="M12 2L3 6.5V12C3 17.5 7.5 21.5 12 22C16.5 21.5 21 17.5 21 12V6.5L12 2Z" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="rgba(52, 199, 89, 0.08)" />
      <path d="M9 11.5L11 13.5L15.5 9" stroke="#0071E3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
    </span>
  </div>
);

export default function Header({
  profile,
  selectedCity,
  onCityChange,
  onReset,
  resetting,
  activeTab,
  setActiveTab,
  darkMode,
  setDarkMode,
  onProfileUpdate
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Fully functioning working Login & Signup system states
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authType, setAuthType] = useState<"login" | "signup">("login");
  const [nameInput, setNameInput] = useState("");
  const [roleInput, setRoleInput] = useState<"Citizen" | "Contractor" | "Corporator">("Citizen");
  const [emailInput, setEmailInput] = useState("");
  const [wardInput, setWardInput] = useState("Ward 174 - HSR Layout");
  const [errorMsg, setErrorMsg] = useState("");
  const [authPending, setAuthPending] = useState(false);

  const notifications = [
    { id: 1, text: "AI verified resolution of pothole in HSR Layout Sector 4", time: "10m ago", read: false },
    { id: 2, text: "Contractor Bid placed for your Water Logging report", time: "1h ago", read: false },
    { id: 3, text: "MLA Corporator score updated to 94%", time: "3h ago", read: true }
  ];

  const menuItems = [
    { id: "feed", label: "Incident Feed", icon: Compass },
    { id: "wardInfo", label: "Ward Info", icon: Landmark },
    { id: "map", label: "Live Sentry Map", icon: Map },
    { id: "report", label: "Report Issue", icon: FileText },
    { id: "dashboard", label: "Diagnostics", icon: BarChart2 }
  ];

  // Submit Login logic with realistic database synchronization
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      setErrorMsg("Please provide your login brand or name.");
      return;
    }
    setErrorMsg("");
    setAuthPending(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nameInput, role: roleInput })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failover");
      
      if (onProfileUpdate && data.profile) {
        onProfileUpdate(data.profile);
      }
      
      setAuthModalOpen(false);
      
      // Celebrate with beautiful confetti!
      safeConfetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#0071E3", "#34C759", "#FF9500", "#5856D6"]
      });
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setAuthPending(false);
    }
  };

  // Submit Signup logic with state updates
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      setErrorMsg("Name is required to register.");
      return;
    }
    setErrorMsg("");
    setAuthPending(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nameInput,
          role: roleInput,
          email: emailInput,
          ward: wardInput
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");

      if (onProfileUpdate && data.profile) {
        onProfileUpdate(data.profile);
      }

      setAuthModalOpen(false);
      safeConfetti({
        particleCount: 155,
        spread: 90,
        origin: { y: 0.6 }
      });
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setAuthPending(false);
    }
  };

  const openAuth = (type: "login" | "signup") => {
    setAuthType(type);
    setNameInput(profile?.name || "");
    setRoleInput(profile?.role || "Citizen");
    setErrorMsg("");
    setAuthModalOpen(true);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FFFFFF]/90 dark:bg-black/85 border-b border-[#E2E8F0]/80 dark:border-white/[0.1] backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 h-[60px] flex items-center justify-between">
        
        {/* Left: Beautiful Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 select-none group cursor-pointer" onClick={() => setActiveTab("feed")}>
            <LogoIcon />
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-sans font-extrabold text-[17px] tracking-tight text-[#1E293B] dark:text-[#F8FAFC]">
                  Nivaran AI
                </span>
                <span className="text-[9px] font-mono font-bold tracking-wider uppercase px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40 rounded-md">
                  V2.0
                </span>
              </div>
              <span className="text-[10px] font-sans font-medium text-[#64748B] dark:text-[#94A3B8] block tracking-normal mt-0.5">
                Smart solution for smart communities
              </span>
            </div>
          </div>

          {/* District Selector (Canva style select pill) */}
          <div className="hidden md:flex items-center gap-1 ml-4 bg-[#F8FAFC] dark:bg-white/5 border border-[#E2E8F0] dark:border-white/10 rounded-full pl-3 pr-2 py-0.5 shadow-sm">
            <span className="text-[10px] font-mono text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider font-extrabold">DISTRICT:</span>
            <select
              value={selectedCity}
              onChange={(e) => onCityChange(e.target.value)}
              className="bg-transparent text-xs font-bold text-[#334155] dark:text-[#F1F5F9] outline-none cursor-pointer pr-1"
            >
              <option value="Bengaluru">Bengaluru (BBMP)</option>
              <option value="Mumbai">Mumbai (MCGM)</option>
              <option value="Delhi">New Delhi (NDMC)</option>
            </select>
          </div>
        </div>

        {/* Center: Canva-styled minimalist segmented controls */}
        <nav className="hidden md:flex bg-[#F1F5F9] dark:bg-white/[0.06] p-1 rounded-full border border-[#E2E8F0]/60 dark:border-white/[0.04] relative">
          <div className="flex gap-1 relative">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-1.5 px-3.5 py-1.5 text-[12.5px] font-bold rounded-full cursor-pointer transition-all duration-200 select-none ${
                    isActive 
                      ? "text-blue-600 dark:text-white" 
                      : "text-[#64748B] dark:text-[#94A3B8] hover:text-[#1E293B] dark:hover:text-[#F8FAFC]"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabPill"
                      transition={{ type: "spring", stiffness: 380, damping: 28 }}
                      className="absolute inset-0 bg-white dark:bg-[#1E293B] rounded-full shadow-[0_1.5px_4px_rgba(0,0,0,0.05),_0_0_0_1px_rgba(0,0,0,0.02)] z-0"
                    />
                  )}
                  <Icon className="h-3.5 w-3.5 relative z-10" />
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Right Actions: Sandbox sync, theme, notifications, Login/Register buttons */}
        <div className="flex items-center gap-2">
          
          <button
            onClick={onReset}
            disabled={resetting}
            title="Reset Sandbox Data"
            className="p-1.5 rounded-full cursor-pointer hover:bg-[#F1F5F9] dark:hover:bg-white/10 text-[#64748B] dark:text-[#94A3B8] transition-colors disabled:opacity-40"
          >
            <RefreshCw className={`h-4 w-4 ${resetting ? "animate-spin" : ""}`} />
          </button>

          {/* High-fidelity Day/Night Dual-Pill Switcher */}
          <div className="flex items-center gap-0.5 bg-[#F1F5F9] dark:bg-white/10 p-0.5 rounded-full border border-black/5 dark:border-white/5 shadow-inner">
            <button
              onClick={() => setDarkMode(false)}
              className={`p-1.5 rounded-full cursor-pointer transition-all duration-200 flex items-center justify-center ${
                !darkMode 
                  ? "bg-white text-[#FF9500] shadow-sm" 
                  : "text-[#64748B] hover:text-[#1E293B] dark:text-[#94A3B8]"
              }`}
              title="Switch to Day Mode"
            >
              <Sun className="h-4 w-4" />
            </button>
            <button
              onClick={() => setDarkMode(true)}
              className={`p-1.5 rounded-full cursor-pointer transition-all duration-200 flex items-center justify-center ${
                darkMode 
                  ? "bg-[#1E293B] text-indigo-400 shadow-sm border border-white/10" 
                  : "text-[#64748B] hover:text-[#1E293B] dark:text-[#94A3B8]"
              }`}
              title="Switch to Night Mode"
            >
              <Moon className="h-4 w-4" />
            </button>
          </div>

          {/* Quick Notifications trigger */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-1.5 rounded-full cursor-pointer hover:bg-[#F1F5F9] dark:hover:bg-white/10 text-[#64748B] dark:text-[#94A3B8] transition-colors relative"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-black"></span>
            </button>

            <AnimatePresence>
              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowNotifications(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2.5 w-80 bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-white/15 rounded-2xl shadow-xl p-3.5 z-40"
                  >
                    <div className="flex justify-between items-center pb-2 mb-2 border-b border-[#F1F5F9] dark:border-white/[0.08]">
                      <span className="text-xs font-bold text-[#1E293B] dark:text-[#F8FAFC]">Hyperlocal AI Radar alerts</span>
                      <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 cursor-pointer hover:underline" onClick={() => setShowNotifications(false)}>Clear</span>
                    </div>

                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {notifications.map((n) => (
                        <div key={n.id} className="p-2 rounded-xl bg-[#F8FAFC] dark:bg-white/[0.03] border border-[#F1F5F9] dark:border-white/[0.05] hover:bg-[#F1F5F9] dark:hover:bg-white/5 transition duration-150">
                          <p className="text-[11.5px] text-[#334155] dark:text-[#E2E8F0] leading-snug">{n.text}</p>
                          <span className="text-[9px] font-mono text-[#64748B] dark:text-[#94A3B8] block mt-1">{n.time}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <div className="h-4 w-[1px] bg-[#E2E8F0] dark:bg-white/15 mx-1" />

          {/* User profile capsule OR Authenticate options trigger */}
          {profile && profile.name ? (
            <div 
              onClick={() => openAuth("login")}
              className="flex items-center gap-1.5 bg-[#F8FAFC] dark:bg-white/[0.08] hover:bg-[#F1F5F9] dark:hover:bg-white/[0.12] border border-[#E2E8F0] dark:border-white/10 rounded-full pl-1.5 pr-3 py-1 cursor-pointer transition-colors"
              title="Click to change account / role"
            >
              <div className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-extrabold text-[10.5px] uppercase relative">
                {profile.name.charAt(0)}
                <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border border-white dark:border-black" />
              </div>
              <div className="hidden lg:block text-left">
                <span className="text-[11px] font-extrabold text-[#1E293B] dark:text-[#F8FAFC] block leading-none">{profile.name}</span>
                <span className="text-[8.5px] text-[#64748B] dark:text-[#94A3B8] font-mono font-bold uppercase tracking-wider">
                  {profile.role === "Corporator" ? "MLA / CORPORATOR" : profile.role}
                </span>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => openAuth("login")}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-full cursor-pointer shadow-sm transition"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Login</span>
            </button>
          )}

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-full cursor-pointer hover:bg-[#F1F5F9] dark:hover:bg-white/[0.12] text-[#64748B] dark:text-[#94A3B8]"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

        </div>
      </div>

      {/* Slide-down mobile navigation panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white dark:bg-[#1E293B] border-b border-[#E2E8F0] dark:border-white/10 px-4 py-4 space-y-4 overflow-hidden"
          >
            <div className="flex items-center justify-between bg-[#F8FAFC] dark:bg-white/5 border border-[#E2E8F0] dark:border-white/10 rounded-xl p-2">
              <span className="text-[10px] font-mono text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider font-bold">SELECT DISTRICT:</span>
              <select
                value={selectedCity}
                onChange={(e) => {
                  onCityChange(e.target.value);
                  setMobileMenuOpen(false);
                }}
                className="bg-transparent text-xs font-bold text-[#1E293B] dark:text-white outline-none cursor-pointer"
              >
                <option value="Bengaluru">Bengaluru</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">New Delhi</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 p-2.5 rounded-xl cursor-pointer font-bold text-xs border transition-all ${
                      isActive
                        ? "bg-blue-600 text-white border-transparent shadow-sm"
                        : "bg-[#F8FAFC] dark:bg-white/5 text-[#64748B] dark:text-[#94A3B8] border-[#E2E8F0]/60 dark:border-transparent hover:bg-[#F1F5F9]"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Account Center Modal (Login & Signup popup everything working) */}
      <AnimatePresence>
        {authModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAuthModalOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
            />

            {/* Modal Box styled like premium white Canva layout */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white dark:bg-[#1E293B] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-[#E2E8F0] dark:border-white/10 relative z-50 p-6 font-sans"
            >
              {/* Header section */}
              <div className="pb-4 border-b border-[#F1F5F9] dark:border-white/[0.08] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                    <ShieldAlert className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-[16px] text-[#1E293B] dark:text-[#F8FAFC]">Nivaran Authenticator</h3>
                    <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">Secure your community civic authority session</p>
                  </div>
                </div>
                <button 
                  onClick={() => setAuthModalOpen(false)}
                  className="p-1 rounded-full text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-white/[0.08]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Toggle Login or Signup segmented switches */}
              <div className="mt-4 flex bg-[#F1F5F9] dark:bg-white/[0.05] p-1 rounded-full border border-[#E2E8F0]/30">
                <button
                  type="button"
                  onClick={() => { setAuthType("login"); setErrorMsg(""); }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-full transition-all ${
                    authType === "login"
                      ? "bg-white dark:bg-[#334155] text-blue-600 dark:text-white shadow-sm"
                      : "text-[#64748B] dark:text-[#94A3B8] hover:text-[#334155]"
                  }`}
                >
                  Log In Account
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthType("signup"); setErrorMsg(""); }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-full transition-all ${
                    authType === "signup"
                      ? "bg-white dark:bg-[#334155] text-blue-600 dark:text-white shadow-sm"
                      : "text-[#64748B] dark:text-[#94A3B8] hover:text-[#334155]"
                  }`}
                >
                  Sign Up / Register
                </button>
              </div>

              {/* Working Forms */}
              {authType === "login" ? (
                <form onSubmit={handleLoginSubmit} className="mt-5 space-y-4">
                  {errorMsg && (
                    <div className="p-2.5 text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-100 dark:border-red-900/40">
                      {errorMsg}
                    </div>
                  )}

                  <div>
                    <label className="text-[11px] font-bold text-[#475569] dark:text-[#CBD5E1] uppercase tracking-wider block mb-1">
                      CITIZEN NAME OR IDENTITY KEY
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-[#94A3B8]" />
                      <input
                        type="text"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        placeholder="e.g. Arvind Mishra"
                        className="w-full bg-[#FAFAFA] dark:bg-white/5 border border-[#E2E8F0] dark:border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs font-semibold text-[#1E293B] dark:text-white outline-none focus:border-blue-500 transition-all font-sans"
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#475569] dark:text-[#CBD5E1] uppercase tracking-wider block mb-1">
                      SELECT AUTHORIZATION ROLE
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "Citizen" as const, label: "Citizen", col: "text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/20" },
                        { id: "Contractor" as const, label: "Bidder", col: "text-purple-600 bg-purple-50 border-purple-200 dark:bg-purple-900/20" },
                        { id: "Corporator" as const, label: "Corporator", col: "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20" }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setRoleInput(item.id)}
                          className={`p-2 border.5 rounded-xl font-bold text-center text-xs cursor-pointer transition ${
                            roleInput === item.id
                              ? `${item.col} ring-2 ring-blue-400 dark:ring-blue-600`
                              : "bg-[#FAFAFA] dark:bg-white/5 border-[#E2E8F0] dark:border-white/10 text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9]"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={authPending}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      <span>{authPending ? "Verifying Keys..." : "Access Community Portal"}</span>
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleSignupSubmit} className="mt-5 space-y-4">
                  {errorMsg && (
                    <div className="p-2.5 text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-100">
                      {errorMsg}
                    </div>
                  )}

                  <div>
                    <label className="text-[11px] font-bold text-[#475569] dark:text-[#CBD5E1] uppercase tracking-wider block mb-1">
                      FULL NAME
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-[#94A3B8]" />
                      <input
                        type="text"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        placeholder="e.g. Meera Nair"
                        className="w-full bg-[#FAFAFA] dark:bg-white/5 border border-[#E2E8F0] dark:border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs font-semibold text-[#1E293B] dark:text-white outline-none focus:border-blue-500 transition-all font-sans"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#475569] dark:text-[#CBD5E1] uppercase tracking-wider block mb-1">
                      EMAIL ADDRESS
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-[#94A3B8]" />
                      <input
                        type="email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="meera@nivaran.org"
                        className="w-full bg-[#FAFAFA] dark:bg-white/5 border border-[#E2E8F0] dark:border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs font-semibold text-[#1E293B] dark:text-white outline-none focus:border-blue-500 transition-all font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#475569] dark:text-[#CBD5E1] uppercase tracking-wider block mb-1">
                      SELECT DESIGNATION ROLE
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "Citizen" as const, label: "Citizen", col: "text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/20" },
                        { id: "Contractor" as const, label: "Bidder", col: "text-purple-600 bg-purple-50 border-purple-200 dark:bg-purple-900/20" },
                        { id: "Corporator" as const, label: "Corporator", col: "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20" }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setRoleInput(item.id)}
                          className={`p-2 border.5 rounded-xl font-bold text-center text-xs cursor-pointer transition-all ${
                            roleInput === item.id
                              ? `${item.col} ring-2 ring-blue-400 dark:ring-blue-600`
                              : "bg-[#FAFAFA] dark:bg-white/5 border-[#E2E8F0] dark:border-white/10 text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9]"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#475569] dark:text-[#CBD5E1] uppercase tracking-wider block mb-1">
                      PRIMARY WARD REGION
                    </label>
                    <input
                      type="text"
                      value={wardInput}
                      onChange={(e) => setWardInput(e.target.value)}
                      placeholder="e.g. Ward 174 - HSR Layout"
                      className="w-full bg-[#FAFAFA] dark:bg-white/5 border border-[#E2E8F0] dark:border-white/10 rounded-xl py-2.5 px-4 text-xs font-semibold text-[#1E293B] dark:text-white outline-none focus:border-blue-500 transition-all font-sans"
                      required
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={authPending}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer shadow-md hover:shadow-lg transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      <span>{authPending ? "Registering Sentry..." : "Generate Smart Citizen Profile"}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Informative footer statement */}
              <div className="mt-5 pt-3.5 border-t border-[#F1F5F9] dark:border-white/[0.08] text-center">
                <span className="text-[10px] text-[#94A3B8] font-mono uppercase tracking-[0.05em] block">
                  🛡️ Smart Contracts Secured on Nivaran Sentry protocol
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
