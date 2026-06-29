import React, { useState, useEffect } from "react";
import { 
  PlusCircle, RefreshCw, Layers, Sparkles, Filter, Shield, Info, Building2, 
  MapPin, Heart, Compass, FileText, BarChart2, Award, Zap, Bell, CheckCircle2, 
  AlertTriangle, Eye, ArrowUpRight, Check, Play, Map, Loader, Camera
} from "lucide-react";
import { CivicIssue, UserProfile, MLAPerformance } from "./types";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, AreaChart, Area, CartesianGrid } from "recharts";
import Header from "./components/Header";
import HeatmapDisplay from "./components/HeatmapDisplay";
import ReportForm from "./components/ReportForm";
import IssueCard from "./components/IssueCard";
import PredictiveSentry from "./components/PredictiveSentry";
import LeaderboardSection from "./components/LeaderboardSection";
import BadgesProfile from "./components/BadgesProfile";
import CityLiveVideo from "./components/CityLiveVideo";
import WardInfo from "./components/WardInfo";
import SmartCityBG from "./components/SmartCityBG";
import PersonaPortals from "./components/PersonaPortals";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [issues, setIssues] = useState<CivicIssue[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [leaderboard, setLeaderboard] = useState<MLAPerformance[]>([]);
  
  // Tabs: "feed" | "map" | "report" | "dashboard"
  const [activeTab, setActiveTab] = useState<string>("feed");
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Filtering & configuration states
  const [selectedCity, setSelectedCity] = useState("Bengaluru");
  const [activeWardFilter, setActiveWardFilter] = useState<string | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string | null>(null);
  const [activeStatusFilter, setActiveStatusFilter] = useState<string | null>(null);
  
  // Sandboxed Testing Persona Swapper
  const [userRole, setUserRole] = useState<"Citizen" | "Contractor" | "Corporator">("Citizen");

  // Synchronized persona switcher to ensure consistency with header profile role
  const handleSwapPersona = (role: "Citizen" | "Contractor" | "Corporator") => {
    setUserRole(role);
    if (profile) {
      setProfile(prev => prev ? { ...prev, role } : null);
    }
  };

  // Gemini Letter generator indexes
  const [draftedLetters, setDraftedLetters] = useState<Record<string, string>>({});
  const [draftingLetterId, setDraftingLetterId] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);

  // Sync index theme classes on root element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Fetch initial sandbox dataset
  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [issuesRes, profileRes, mlaRes] = await Promise.all([
        fetch("/api/issues"),
        fetch("/api/profile"),
        fetch("/api/mla-leaderboard")
      ]);

      const issuesData = await issuesRes.json();
      const profileData = await profileRes.json();
      const mlaData = await mlaRes.json();

      setIssues(issuesData);
      setProfile(profileData);
      setLeaderboard(mlaData);
    } catch (err) {
      console.error("Failed fetching database values: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (profile) {
      setUserRole(profile.role);
    }
  }, [profile]);

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setActiveWardFilter(null); // Clear ward filter query on district change
  };

  const handleUpvote = async (id: string) => {
    try {
      const res = await fetch(`/api/issues/${id}/upvote`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setIssues(prev => prev.map(item => item.id === id ? data.issue : item));
      setProfile(data.profile);
    } catch (err) {
      console.error(err);
    }
  };

  const handleWitness = async (id: string, phone: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch(`/api/issues/${id}/witness`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phone })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Co-sign failed.");

      setIssues(prev => prev.map(item => item.id === id ? data.issue : item));
      setProfile(data.profile);
      return { success: true };
    } catch (err: any) {
      console.error(err);
      return { success: false, error: err.message };
    }
  };

  const handlePlaceBid = async (id: string, bidData: { contractorName: string; amount: number; timelineDays: number }) => {
    try {
      const res = await fetch(`/api/issues/${id}/bid`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bidData)
      });
      const updatedIssue = await res.json();
      if (!res.ok) throw new Error(updatedIssue.error);

      setIssues(prev => prev.map(item => item.id === id ? updatedIssue : item));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (id: string, status: string, resolvedImageUrl?: string, beforeAfterVerifiedByAI?: boolean) => {
    try {
      const res = await fetch(`/api/issues/${id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, resolvedImageUrl, beforeAfterVerifiedByAI })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setIssues(prev => prev.map(item => item.id === id ? data.issue : item));
      setLeaderboard(data.leaderboard);
      setProfile(data.profile);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDraftLetter = async (issue: CivicIssue) => {
    setDraftingLetterId(issue.id);
    try {
      const res = await fetch("/api/generate-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: issue.title,
          description: issue.description,
          address: issue.location.address,
          ward: issue.location.ward,
          city: issue.location.city,
          category: issue.category,
          severity: issue.severity
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setDraftedLetters(prev => ({
        ...prev,
        [issue.id]: data.letter
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setDraftingLetterId(null);
    }
  };

  const handleAddIssue = (newIssueData: any) => {
    fetch("/api/issues", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newIssueData)
    })
    .then(res => res.json())
    .then(data => {
      setIssues(prev => [data.issue, ...prev]);
      setProfile(data.profile);
      setActiveTab("feed"); // Redirect to Feed on submit!
    })
    .catch(err => console.error(err));
  };

  const handleClearLetter = (id: string) => {
    setDraftedLetters(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const handleReset = async () => {
    try {
      setResetting(true);
      const res = await fetch("/api/reset", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setIssues(data.issues);
        setProfile(data.profile);
        
        const mlaRes = await fetch("/api/mla-leaderboard");
        const mlaData = await mlaRes.json();
        setLeaderboard(mlaData);

        setActiveWardFilter(null);
        setActiveCategoryFilter(null);
        setActiveStatusFilter(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setResetting(false);
    }
  };

  // List of active categories
  const categories = ["Potholes & Roads", "Water Logging", "Waste & Garbage", "Electricity & Lights"];

  // Category Colors
  const catColors: Record<string, string> = {
    "Potholes & Roads": "#FF3B30",
    "Water Logging": "#0071E3",
    "Waste & Garbage": "#FF9500",
    "Electricity & Lights": "#34C759"
  };

  // Issues matching selections
  const filteredIssues = issues.filter(issue => {
    const cityMatch = issue.location.city.toLowerCase() === selectedCity.toLowerCase();
    const wardMatch = activeWardFilter ? issue.location.ward.toLowerCase() === activeWardFilter.toLowerCase() : true;
    const categoryMatch = activeCategoryFilter ? issue.category.toLowerCase() === activeCategoryFilter.toLowerCase() : true;
    
    let statusMatch = true;
    if (activeStatusFilter === "open") statusMatch = issue.status !== "Resolved";
    if (activeStatusFilter === "resolved") statusMatch = issue.status === "Resolved";

    return cityMatch && wardMatch && categoryMatch && statusMatch;
  });

  const activeCityIssues = issues.filter(
    (i) => i.location.city.toLowerCase() === selectedCity.toLowerCase()
  );

  // Chart aggregation for Recharts Bar Chart
  const categoryChartData = categories.map(cat => ({
    name: cat.split(" & ")[0],
    count: activeCityIssues.filter(i => i.category === cat).length,
    fill: catColors[cat] || "#0071E3"
  }));

  // Chart data for daily reports accumulation trend
  const trendChartData = [
    { day: "Jun 16", count: 2 },
    { day: "Jun 17", count: 4 },
    { day: "Jun 18", count: 3 },
    { day: "Jun 19", count: 6 },
    { day: "Jun 20", count: 8 },
    { day: "Jun 21", count: 5 },
    { day: "Jun 22", count: 11 },
    { day: "Jun 23", count: activeCityIssues.length }
  ];

  // Stats counter values
  const closedCount = activeCityIssues.filter(i => i.status === "Resolved").length;
  const inProgressCount = activeCityIssues.filter(i => i.status === "Work In Progress").length;
  const criticalCount = activeCityIssues.filter(i => i.severity === "Critical" || i.severity === "High").length;

  return (
    <div className={`min-h-screen bg-[#FFFFFF] dark:bg-[#000000] text-[#1D1D1F] dark:text-[#F5F5F7] transition-all duration-300 pb-20 selection:bg-[#0071E3]/20`}>
      
      {/* Prime Header element */}
      {profile && (
        <Header 
          profile={profile} 
          selectedCity={selectedCity} 
          onCityChange={handleCityChange}
          onReset={handleReset}
          resetting={resetting}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onProfileUpdate={(updatedProfile) => {
            setProfile(updatedProfile);
            setUserRole(updatedProfile.role);
          }}
        />
      )}

      {/* Interactive Testing Sandbox Control Panel */}
      <div className="bg-[#F5F5F7] dark:bg-[#1C1C1E] border-b border-black/[0.08] dark:border-white/[0.08] py-2 px-4 shadow-sm relative z-30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 font-sans">
          
          <div className="flex items-center gap-1.5 shrink-0">
            <Shield className="h-4 w-4 text-[#FF9500]" />
            <span className="text-[11px] font-mono font-bold text-[#6E6E73] dark:text-[#98989D] uppercase tracking-wider">
              Verification Simulation:
            </span>
          </div>

          <div className="flex items-center gap-2 bg-black/[0.04] dark:bg-white/[0.06] p-1 rounded-full border border-black/5 dark:border-white/5">
            <span className="text-[9px] text-[#6E6E73] dark:text-[#98989D] font-mono font-bold px-2 block uppercase select-none">SWAP PERSONA:</span>
            
             <button
              onClick={() => handleSwapPersona("Citizen")}
              className={`text-[10px] sm:text-[11px] font-sans font-bold py-1 px-3 rounded-full transition cursor-pointer ${
                userRole === "Citizen" 
                  ? "bg-[#0071E3] text-white shadow" 
                  : "text-[#6E6E73] dark:text-[#98989D] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7]"
              }`}
            >
              Citizen Sentry
            </button>
            <button
              onClick={() => handleSwapPersona("Contractor")}
              className={`text-[10px] sm:text-[11px] font-sans font-bold py-1 px-3 rounded-full transition cursor-pointer ${
                userRole === "Contractor" 
                  ? "bg-[#A855F7] text-white shadow" 
                  : "text-[#6E6E73] dark:text-[#98989D] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7]"
              }`}
            >
              Contractor Sentry
            </button>
            <button
              onClick={() => handleSwapPersona("Corporator")}
              className={`text-[10px] sm:text-[11px] font-sans font-bold py-1 px-3 rounded-full transition cursor-pointer ${
                userRole === "Corporator" 
                  ? "bg-[#34C759] text-white shadow" 
                  : "text-[#6E6E73] dark:text-[#98989D] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7]"
              }`}
            >
              MLA Sentry
            </button>
          </div>

          <div className="text-[10.5px] text-[#6E6E73] dark:text-[#98989D] leading-none flex items-center gap-1 mt-0.5 sm:mt-0 font-medium">
            <Info className="h-3.5 w-3.5 text-[#0071E3] shrink-0" />
            <span>Test tender bidding or dual-image resolving with alternative roles.</span>
          </div>

        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
          <Loader className="h-7 w-7 text-[#0071E3] animate-spin" />
          <span className="text-xs font-mono font-bold text-slate-400">LOADING METROPOLITICAL RECORDS...</span>
        </div>
      ) : (
        <main className="max-w-7xl mx-auto px-4 pt-6">
          <AnimatePresence mode="wait">
            
            {/* VIEW 1: FEED VIEW */}
            {activeTab === "feed" && (
              <motion.div
                key="feedView"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                className="space-y-6"
              >
                {/* Hero Section Banner & Pro City Animation Video Simulator Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  
                  {/* Left Column: Your City, Your Voice (Col span 7) */}
                  <div className={`lg:col-span-7 relative rounded-[24px] overflow-hidden ${darkMode ? "bg-slate-950" : "bg-slate-50"} flex flex-col justify-center p-6 sm:p-9 shadow-lg min-h-[260px] border ${darkMode ? "border-white/5" : "border-slate-200"}`}>
                    {/* Dynamic Smart City Live Video & Animation Loop */}
                    <SmartCityBG darkMode={darkMode} />

                    <div className="relative z-10 max-w-xl space-y-3">
                      <span className={`text-[10px] font-mono uppercase tracking-[0.12em] font-black px-2.5 py-1 rounded-full w-max flex items-center gap-1.5 ${
                        darkMode 
                          ? "text-cyan-200 bg-white/10" 
                          : "text-[#0071E3] bg-[#0071E3]/10 border border-[#0071E3]/15"
                      }`}>
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                        {selectedCity} INCIDENTS MAP FEED
                      </span>
                      <h1 className={`text-[28px] sm:text-[38px] font-bold tracking-tight leading-tight font-sans ${
                        darkMode ? "text-white" : "text-slate-900"
                      }`}>
                        Your city, your voice.
                      </h1>
                      <p className={`text-sm leading-relaxed font-medium ${
                        darkMode ? "text-blue-50/90" : "text-slate-600"
                      }`}>
                        {activeCityIssues.length} issues reported near you &bull; {closedCount} resolved safely. Dynamic AI meshes predict low elevation drainage sweeps as safe.
                      </p>
                      
                      <div className="pt-2 flex flex-wrap gap-2 pointer-events-auto">
                        <button
                          onClick={() => setActiveTab("report")}
                          className={`transition font-bold text-xs py-2 px-4 rounded-full shadow-sm cursor-pointer ${
                            darkMode 
                              ? "bg-white text-[#0071E3] hover:bg-slate-50" 
                              : "bg-[#0071E3] text-white hover:bg-[#005FC6]"
                          }`}
                        >
                          Report New Incident
                        </button>
                        <button
                          onClick={() => {
                            const heatmapEl = document.getElementById("community-heatmap");
                            if (heatmapEl) {
                              heatmapEl.scrollIntoView({ behavior: "smooth" });
                            }
                          }}
                          className={`transition font-semibold text-xs py-2 px-4 rounded-full cursor-pointer ${
                            darkMode 
                              ? "bg-white/10 border border-white/25 text-white hover:bg-white/15" 
                              : "bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200/80"
                          }`}
                        >
                          Explore Issue Heatmap
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Pro City Scanning Animation / Video Simulator (Col span 5) */}
                  <div className="lg:col-span-5 flex flex-col justify-between">
                    <CityLiveVideo />
                  </div>
                </div>


                {/* Live Heatmap display selector */}
                <HeatmapDisplay 
                  issues={issues} 
                  selectedCity={selectedCity} 
                  onFilterWard={setActiveWardFilter}
                  activeWardFilter={activeWardFilter}
                />

                {/* Persona Interactive Workflow Hub */}
                <PersonaPortals 
                  userRole={userRole}
                  issues={issues}
                  selectedCity={selectedCity}
                  onPlaceBid={handlePlaceBid}
                  onUpdateStatus={handleUpdateStatus}
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: List Feed & Filters */}
                  <div className="lg:col-span-8 space-y-5">
                    
                    {/* Horizontal scrollable Filter row styled beautifully */}
                    <div className="apple-glass bg-[#F5F5F7] dark:bg-[#1C1C1E] border border-black/[0.06] dark:border-white/[0.08] p-3 rounded-[20px] flex flex-wrap items-center justify-between gap-3 shadow-sm">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          onClick={() => setActiveCategoryFilter(null)}
                          className={`text-xs font-semibold py-1.5 px-3.5 rounded-full border cursor-pointer select-none transition ${
                            !activeCategoryFilter 
                              ? "bg-[#0071E3] text-white border-transparent shadow-sm font-bold" 
                              : "bg-white dark:bg-black/30 text-[#6E6E73] border-transparent hover:bg-white/80"
                          }`}
                        >
                          All Categories
                        </button>
                        {categories.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setActiveCategoryFilter(cat)}
                            className={`text-xs font-semibold py-1.5 px-3.5 rounded-full border cursor-pointer select-none transition ${
                              activeCategoryFilter?.toLowerCase() === cat.toLowerCase()
                                ? "bg-[#0071E3] text-white border-transparent shadow-sm font-bold" 
                                : "bg-white dark:bg-black/30 text-[#6E6E73] border-transparent hover:bg-white/80"
                            }`}
                          >
                            {cat.split(" & ")[0]}
                          </button>
                        ))}
                      </div>

                      {/* Manual Plus Report Button inside bar */}
                      <button
                        onClick={() => setActiveTab("report")}
                        className="bg-[#0071E3] hover:bg-[#0071E3]/95 text-white font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 shadow"
                      >
                        <PlusCircle className="h-4 w-4" /> Report Issue
                      </button>
                    </div>

                    {/* Active Feed List Header */}
                    <div className="space-y-4">
                      
                      <div className="flex justify-between items-center px-1">
                        <span className="text-[11px] font-mono text-[#6E6E73] dark:text-[#98989D] uppercase tracking-wider font-extrabold">
                          INCIDENT RECORDS LOGGED ({filteredIssues.length})
                        </span>

                        {/* Status toggles */}
                        <div className="flex gap-1 bg-black/[0.03] dark:bg-white/[0.05] p-0.5 rounded-full">
                          <button 
                            onClick={() => setActiveStatusFilter(null)}
                            className={`text-[10px] font-bold py-1 px-2.5 rounded-full select-none cursor-pointer transition ${
                              !activeStatusFilter 
                                ? "bg-white dark:bg-[#2C2C2E] text-[#1D1D1F] dark:text-white shadow-sm" 
                                : "text-slate-400"
                            }`}
                          >
                            All
                          </button>
                          <button 
                            onClick={() => setActiveStatusFilter("open")}
                            className={`text-[10px] font-bold py-1 px-2.5 rounded-full select-none cursor-pointer transition ${
                              activeStatusFilter === "open" 
                                ? "bg-white dark:bg-[#2C2C2E] text-[#1D1D1F] dark:text-white shadow-sm" 
                                : "text-slate-400"
                            }`}
                          >
                            Open
                          </button>
                          <button 
                            onClick={() => setActiveStatusFilter("resolved")}
                            className={`text-[10px] font-bold py-1 px-2.5 rounded-full select-none cursor-pointer transition ${
                              activeStatusFilter === "resolved" 
                                ? "bg-white dark:bg-[#2C2C2E] text-[#1D1D1F] dark:text-white shadow-sm" 
                                : "text-slate-400"
                            }`}
                          >
                            Closed
                          </button>
                        </div>
                      </div>

                      {/* Displaying Issue Cards on Feed */}
                      <div className="space-y-5">
                        {filteredIssues.map((issue) => (
                          <IssueCard 
                            key={issue.id} 
                            issue={issue}
                            onUpvote={handleUpvote}
                            onWitness={handleWitness}
                            onPlaceBid={handlePlaceBid}
                            onUpdateStatus={handleUpdateStatus}
                            onDraftLetter={handleDraftLetter}
                            draftingLetterId={draftingLetterId}
                            draftedLetter={draftedLetters[issue.id] || null}
                            onClearLetter={() => handleClearLetter(issue.id)}
                            userRole={userRole}
                          />
                        ))}

                        {filteredIssues.length === 0 && (
                          <div className="bg-white dark:bg-[#1C1C1E] border border-black/[0.08] dark:border-white/[0.1] text-center rounded-[24px] p-12 text-slate-400">
                            <Layers className="h-10 w-10 text-slate-300 dark:text-slate-650 mx-auto mb-3" />
                            <p className="font-semibold text-sm text-[#1D1D1F] dark:text-[#F5F5F7]">No alerts match active indices.</p>
                            <p className="text-xs text-slate-400 mt-1">Try refining the ward selection in the thermal radar map above.</p>
                          </div>
                        )}
                      </div>

                    </div>

                    {/* Sentry Flood Radar Warnings */}
                    <PredictiveSentry />

                  </div>

                  {/* Right Column Side Panel */}
                  <div className="lg:col-span-4 space-y-6">
                    
                    {/* Live Gamification Profile Hub */}
                    {profile && <BadgesProfile profile={profile} />}

                    {/* Ward Leaderboards Performance Scoreboard */}
                    <LeaderboardSection leaderboard={leaderboard} selectedCity={selectedCity} />

                    {/* Nivaran AI Enterprise Suite */}
                    <div className="bg-white dark:bg-[#161617] border border-[#E2E8F0] dark:border-white/[0.08] rounded-[24px] p-5 shadow-sm">
                      <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-[#F1F5F9] dark:border-white/[0.08]">
                        <Building2 className="h-4 w-4 text-emerald-500" />
                        <h4 className="font-sans font-bold text-xs text-[#1D1D1F] dark:text-[#F5F5F7] uppercase tracking-wider">
                          Nivaran AI Enterprise Suite
                        </h4>
                      </div>

                      <div className="flex flex-col gap-3 font-sans text-xs">
                        <div>
                          <span className="font-bold text-[#1D1D1F] dark:text-[#F5F5F7] block">Sentry SLA Licensing model:</span>
                          <p className="text-[11.5px] text-[#6E6E73] dark:text-[#98989D] mt-0.5 leading-relaxed">
                            Licensed directly to municipal commissioners (BBMP/MCGM/NDMC). Subscription base charges **₹15,000 per ward/month** for full corporator analytical integration.
                          </p>
                        </div>
                        <div>
                          <span className="font-bold text-[#1D1D1F] dark:text-[#F5F5F7] block">Smart Contract Commission:</span>
                          <p className="text-[11.5px] text-[#6E6E73] dark:text-[#98989D] mt-0.5 leading-relaxed">
                            Transactional <strong>2% smart resolution facilitation fee</strong> allocated directly from the ward development fund for completed works verified via dual-image AI.
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>

                {/* Floating Action Button (FAB) Bottom-Right with pulse indicator */}
                <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 group">
                  
                  {/* Tooltip floating above */}
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 text-white text-xs py-1 px-3.5 rounded-full shadow font-semibold mb-1 mr-2 pointer-events-none">
                    Report an issue
                  </span>

                  <motion.button
                    onClick={() => setActiveTab("report")}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.94 }}
                    className="h-14 w-14 bg-[#0071E3] hover:bg-[#0071E3]/95 text-white rounded-full flex items-center justify-center shadow-2xl cursor-pointer relative group"
                    style={{
                      boxShadow: "0 10px 30px rgba(0,113,227,0.35), inset 0 2px 4px rgba(255,255,255,0.2)"
                    }}
                  >
                    {/* Pulsing notification warning badge */}
                    {criticalCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 bg-[#FF3B30] text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-black">
                        {criticalCount}
                      </span>
                    )}
                    <Camera className="h-6 w-6 stroke-[2]" />
                  </motion.button>
                </div>

              </motion.div>
            )}

            {/* VIEW 2: REPORT ISSUE TAB */}
            {activeTab === "wardInfo" && (
              <motion.div
                key="wardInfoView"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="py-2"
              >
                <WardInfo selectedCity={selectedCity} />
              </motion.div>
            )}

            {activeTab === "report" && (
              <motion.div
                key="reportView"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
                className="py-4"
              >
                <div className="max-w-xl mx-auto space-y-2 text-center mb-6">
                  <h2 className="font-sans font-bold text-3xl text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
                    File Incident Report
                  </h2>
                  <p className="text-[13.5px] text-[#6E6E73] dark:text-[#98989D] max-w-[420px] mx-auto leading-relaxed">
                    Capture or drop a photo. Our 311 vision models extract coordinates and auto-despatch tenders.
                  </p>
                </div>

                <ReportForm selectedCity={selectedCity} onAddIssue={handleAddIssue} />
              </motion.div>
            )}

            {/* VIEW 3: LIVE MAP VIEW */}
            {activeTab === "map" && (
              <motion.div
                key="mapView"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                  <div>
                    <h2 className="font-sans font-bold text-2xl text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
                      Sectors Sentry Radar
                    </h2>
                    <p className="text-xs text-[#6E6E73] dark:text-[#98989D]">
                      Dynamic incident overlay mapping coordinates in {selectedCity} BBMP wards
                    </p>
                  </div>

                  <span className="text-[10px] bg-[#34C759]/10 text-[#34C759] border border-[#34C759]/25 py-1 px-3 rounded-full font-mono font-bold tracking-wider uppercase">
                    ● Real-Time Satellites connected
                  </span>
                </div>

                <HeatmapDisplay 
                  issues={issues} 
                  selectedCity={selectedCity} 
                  onFilterWard={setActiveWardFilter}
                  activeWardFilter={activeWardFilter}
                />

                {/* Simulated detailed lists of closest map issues */}
                <div className="bg-white dark:bg-[#1C1C1E] border border-black/[0.08] dark:border-white/[0.1] rounded-[24px] p-5 space-y-4 shadow-sm">
                  <span className="text-[11px] font-mono font-bold text-[#6E6E73] dark:text-[#98989D] uppercase block">
                    NEAREST 5 REPORTED DISRUPTIONS NEAR RADAR CENTER
                  </span>

                  <div className="divide-y divide-black/[0.05] dark:divide-white/[0.08]">
                    {filteredIssues.slice(0, 5).map((iss, index) => (
                      <div 
                        key={iss.id} 
                        className="py-3 flex justify-between items-center cursor-pointer hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition px-2 rounded-xl"
                        onClick={() => {
                          setActiveWardFilter(iss.location.ward);
                          setActiveTab("feed");
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-[#6E6E73] leading-none">0{index + 1}</span>
                          <div>
                            <span className="text-xs font-bold text-[#1D1D1F] dark:text-[#F5F5F7] block leading-snug">
                              {iss.title}
                            </span>
                            <span className="text-[10.5px] text-[#6E6E73] dark:text-[#98989D] font-mono mt-0.5 block leading-none">
                              📍 {iss.location.address}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className={`text-[9px] font-mono font-bold py-0.5 px-2 rounded-full uppercase ${
                            iss.status === "Resolved" 
                              ? "bg-[#34C759]/15 text-[#34C759]" 
                              : "bg-[#FF9500]/15 text-[#FF9500]"
                          }`}>
                            {iss.status}
                          </span>
                        </div>
                      </div>
                    ))}

                    {filteredIssues.length === 0 && (
                      <p className="text-xs text-slate-400 italic py-3 text-center">No active issues listed in selected sector.</p>
                    )}
                  </div>
                </div>

              </motion.div>
            )}

            {/* VIEW 4: ANALYTICS DASHBOARD */}
            {activeTab === "dashboard" && (
              <motion.div
                key="dashboardView"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="space-y-6"
              >
                
                {/* 4 Stat Cards Top Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  
                  {/* Stat 1 */}
                  <div className="bg-white dark:bg-[#1C1C1E] border border-black/[0.08] dark:border-white/[0.1] rounded-2xl p-4.5 shadow-sm text-left">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold leading-none">INCIDENTS FILED</span>
                    <span className="text-3xl font-extrabold text-[#1D1D1F] dark:text-white mt-2 block leading-none">{activeCityIssues.length}</span>
                    <span className="text-[10.5px] text-[#34C759] font-mono font-bold mt-2.5 block leading-none">▲ 14% this month</span>
                  </div>

                  {/* Stat 2 */}
                  <div className="bg-white dark:bg-[#1C1C1E] border border-black/[0.08] dark:border-white/[0.1] rounded-2xl p-4.5 shadow-sm text-left">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold leading-none">RESOLVER FIXES</span>
                    <span className="text-3xl font-extrabold text-[#1D1D1F] dark:text-white mt-2 block leading-none">{closedCount}</span>
                    <span className="text-[10.5px] text-[#34C759] font-mono font-bold mt-2.5 block leading-none">✓ {closedCount > 0 ? Math.floor((closedCount / activeCityIssues.length) * 100) : 0}% success rate</span>
                  </div>

                  {/* Stat 3 */}
                  <div className="bg-white dark:bg-[#1C1C1E] border border-black/[0.08] dark:border-white/[0.1] rounded-2xl p-4.5 shadow-sm text-left">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold leading-none">IN REPAIR REMEDIATION</span>
                    <span className="text-3xl font-extrabold text-[#1D1D1F] dark:text-white mt-2 block leading-none">{inProgressCount}</span>
                    <span className="text-[10.5px] text-[#FF9500] font-mono font-bold mt-2.5 block leading-none">● Active Tenders pending</span>
                  </div>

                  {/* Stat 4 */}
                  <div className="bg-white dark:bg-[#1C1C1E] border border-black/[0.08] dark:border-white/[0.1] rounded-2xl p-4.5 shadow-sm text-left">
                    <span className="text-[10px] font-mono text-[#FF3B30] uppercase tracking-wider block font-bold leading-none">CRITICAL SEVERITY</span>
                    <span className="text-3xl font-extrabold text-[#FF3B30] mt-2 block leading-none">{criticalCount}</span>
                    <span className="text-[10.5px] text-slate-400 font-mono mt-2.5 block leading-none">Requires desilting sweeps</span>
                  </div>

                </div>

                {/* Redirection live video of dynamic metropolis loop */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Left Column: Live simulated telemetries loop */}
                  <div className="lg:col-span-7 flex flex-col justify-between">
                    <div className="space-y-2 mb-3">
                      <h3 className="font-sans font-bold text-lg text-[#1D1D1F] dark:text-[#F5F5F7]">
                        Living Metropolis active video simulator
                      </h3>
                      <p className="text-xs text-[#6E6E73] dark:text-[#98989D] leading-relaxed">
                        Simulating live-tracked contractor dispatch vans, active citizens reports and automatic water sensor meshes across roads.
                      </p>
                    </div>

                    <CityLiveVideo />
                  </div>

                  {/* Right Column: Dynamic prediction triggers */}
                  <div className="lg:col-span-5 bg-white dark:bg-[#1C1C1E] border border-black/[0.08] dark:border-white/[0.1] rounded-[24px] p-5 shadow-sm">
                    <div className="flex items-center gap-1.5 text-xs font-mono text-[#FF9500] uppercase font-bold mb-3.5 pb-2.5 border-b border-black/[0.05] dark:border-white/[0.08]">
                      <Sparkles className="h-4 w-4 animate-pulse" />
                      Gemini Warnings & Catchment Forecasts
                    </div>

                    <div className="space-y-3">
                      <div className="p-3 bg-[#FF9500]/5 border border-[#FF9500]/25 rounded-2xl">
                        <span className="text-xs font-bold text-[#FF9E0A] block leading-none flex items-center gap-1">
                          <AlertTriangle className="h-3.5 w-3.5" /> High Risk Ward Alert
                        </span>
                        <p className="text-[11.5px] text-[#6E6E73] dark:text-[#98989D] mt-1.5 leading-snug">
                          Rainfall projections model <strong>Yamuna low elevation sectors</strong> exceeding drainage capacities by Friday 14:00. Pre-desilt order recommended.
                        </p>
                      </div>

                      <div className="p-3 bg-[#0071E3]/5 border border-[#0071E3]/25 rounded-2xl">
                        <span className="text-xs font-bold text-[#0071E3] block leading-none">
                          ✓ Automated Contractors dispatch
                        </span>
                        <p className="text-[11.5px] text-[#6E6E73] dark:text-[#98989D] mt-1.5 leading-snug">
                          HSR Layout underpass crater pothole alert completed 92% witness target. Auto-notified 3 class-A road workers to bid.
                        </p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Analytical Charts Block via Recharts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  
                  {/* Category Bar Chart */}
                  <div className="bg-white dark:bg-[#1C1C1E] border border-black/[0.08] dark:border-white/[0.1] rounded-[24px] p-5 shadow-sm space-y-4">
                    <span className="text-[11px] font-mono font-bold text-[#6E6E73] dark:text-[#98989D] uppercase tracking-wider block">
                      INCIDENTS FILED BY MUNICIPAL SECTOR CATEGORY
                    </span>
                    <div className="w-full h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={categoryChartData}>
                          <XAxis dataKey="name" stroke="#AEAEB2" fontSize={11} tickLine={false} />
                          <YAxis stroke="#AEAEB2" fontSize={11} tickLine={false} />
                          <RechartsTooltip 
                            contentStyle={{ 
                              backgroundColor: "rgba(255, 255, 255, 0.9)", 
                              borderRadius: "12px", 
                              border: "1px solid rgba(0,0,0,0.1)",
                              fontSize: "11px"
                            }} 
                          />
                          <Bar dataKey="count" radius={[10, 10, 0, 0]} fill="#0071E3" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Lines chart */}
                  <div className="bg-white dark:bg-[#1C1C1E] border border-black/[0.08] dark:border-white/[0.1] rounded-[24px] p-5 shadow-sm space-y-4">
                    <span className="text-[11px] font-mono font-bold text-[#6E6E73] dark:text-[#98989D] uppercase tracking-wider block">
                      INCIDENTS LOGGED HISTORIC ACCUMULATIONS TIMELINE
                    </span>
                    <div className="w-full h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendChartData}>
                          <defs>
                            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#0071E3" stopOpacity={0.25}/>
                              <stop offset="95%" stopColor="#0071E3" stopOpacity={0.0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                          <XAxis dataKey="day" stroke="#AEAEB2" fontSize={11} tickLine={false} />
                          <YAxis stroke="#AEAEB2" fontSize={11} tickLine={false} />
                          <RechartsTooltip />
                          <Area type="monotone" dataKey="count" stroke="#0071E3" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCount)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
                  <div className="lg:col-span-8">
                    <LeaderboardSection leaderboard={leaderboard} selectedCity={selectedCity} />
                  </div>
                  <div className="lg:col-span-4 flex flex-col justify-between">
                    <div className="bg-[#1C1C1E] text-white p-5 rounded-[24px] border border-[#A855F7]/15 shadow relative overflow-hidden flex-1 flex flex-col justify-center min-h-[180px]">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#A855F7]/10 to-transparent rounded-full blur-2xl pointer-events-none"></div>
                      <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#A855F7] uppercase tracking-wider mb-2">
                        <Zap className="h-4 w-4 animate-pulse text-[#A855F7]" />
                        MUNICIPAL BUDGET RATINGS
                      </div>
                      <h4 className="font-sans font-bold text-base leading-snug mb-1">
                        Corporate Tender Index score: 94.2
                      </h4>
                      <p className="text-[11.5px] text-slate-400 leading-relaxed">
                        Automatic municipal contractor payments payouts are enabled immediately after Gemini dual resolution side-by-side verification confirms.
                      </p>
                    </div>
                  </div>
                </div>

              </motion.div>
            )}

          </AnimatePresence>
        </main>
      )}

    </div>
  );
}
