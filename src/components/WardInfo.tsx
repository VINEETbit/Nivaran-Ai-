import React, { useState, useEffect } from "react";
import { 
  Search, Landmark, User, Calendar, Droplets, AlertTriangle, Phone, Mail, 
  MapPin, CheckCircle2, Clock, Trash2, ShieldAlert, Sparkles, Send, 
  ArrowRight, ShieldCheck, Waves, Info, Star, Compass
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { safeConfetti } from "../utils/confetti";

interface WardInfoProps {
  selectedCity: string;
}

interface WardDetails {
  wardNo: string;
  wardName: string;
  councillor: {
    name: string;
    party: string;
    phone: string;
    email: string;
    avatar: string;
    rating: number;
    resolvedCount: number;
    bio: string;
  };
  garbageSchedule: {
    status: string;
    collectorName: string;
    contact: string;
    time: string;
    route: string[];
    progress: number;
  };
  waterSupply: {
    status: string;
    supplyTime: string;
    pressure: string;
    purityScore: number;
    contaminationRisk: "Low" | "Medium" | "High";
  };
  floodAlerts: {
    status: string;
    riskScore: number;
    activeAdvisory: string;
    pumpsDeployed: number;
  };
}

export default function WardInfo({ selectedCity }: WardInfoProps) {
  const [searchInput, setSearchInput] = useState("");
  const [searchedWard, setSearchedWard] = useState("174");
  const [activeSubTab, setActiveSubTab] = useState<"councillor" | "garbage" | "water" | "flood">("councillor");
  const [subsActive, setSubsActive] = useState<Record<string, boolean>>({});
  const [notified, setNotified] = useState(false);

  // High fidelity mock database for various wards in Bengaluru, Mumbai and Delhi
  const wardDatabase: Record<string, WardDetails> = {
    "174": {
      wardNo: "174",
      wardName: "HSR Layout Sector 1-7",
      councillor: {
        name: "Smt. Meera Chandra",
        party: "Independent Sentry-Alliance",
        phone: "+91 98450 12344",
        email: "councillor.174@bbmp.gov.in",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
        rating: 4.8,
        resolvedCount: 384,
        bio: "Dedicated civic planner focused on decentralized waste management & high-efficiency storm drain grids across HSR Layout."
      },
      garbageSchedule: {
        status: "In Progress (En route)",
        collectorName: "Shri Ramesh Gowda (Vehicle KA-01-G-4322)",
        contact: "+91 94480 98765",
        time: "07:30 AM - 10:45 AM",
        route: ["Sector 1 Peak", "Sector 3 Parks", "Sector 5 Shopping Belt", "Sector 6 Highstreet", "Sector 7 Corner"],
        progress: 68
      },
      waterSupply: {
        status: "Active (Scheduled Flow)",
        supplyTime: "06:00 AM to 09:30 AM (Every Alt Day)",
        pressure: "2.4 Bar (Optimal)",
        purityScore: 96,
        contaminationRisk: "Low"
      },
      floodAlerts: {
        status: "Pre-Monsoon Safe Sentry",
        riskScore: 12,
        activeAdvisory: "No logs showing blockages. Stormwater drain meshes recently cleaned by Sentry action corps.",
        pumpsDeployed: 2
      }
    },
    "10": {
      wardNo: "10",
      wardName: "Andheri West Ward 10",
      councillor: {
        name: "Shri Aditya Sawant",
        party: "Smart Metropolis Front",
        phone: "+91 91220 88212",
        email: "aditya.sawant@mcgm.gov.in",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
        rating: 4.7,
        resolvedCount: 512,
        bio: "Empowering spatial community groups with self-remediation tender trackers & CCTV live flood overlays."
      },
      garbageSchedule: {
        status: "Slightly Delayed (Heavy Traffic)",
        collectorName: "Shri Santosh K (Vehicle MH-02-ER-9911)",
        contact: "+91 98210 12345",
        time: "08:00 AM - 11:30 AM",
        route: ["Yari Road Belt", "Lokhandwala Backroad", "Versova Village Road", "Model Town Sentry lane"],
        progress: 40
      },
      waterSupply: {
        status: "Normal Flow Expected Tomorrow",
        supplyTime: "05:30 PM to 08:30 PM (Daily)",
        pressure: "1.9 Bar",
        purityScore: 92,
        contaminationRisk: "Low"
      },
      floodAlerts: {
        status: "High Silt Danger Warnings",
        riskScore: 78,
        activeAdvisory: "High risk of street water convergence near SV Road metro junctions. Silt estimates 72%. Avoid low line lane pathways.",
        pumpsDeployed: 4
      }
    },
    "9": {
      wardNo: "9",
      wardName: "Connaught Place Ward 9",
      councillor: {
        name: "Smt. Priya Malhotra",
        party: "NDMC Progressive Coalition",
        phone: "+91 98100 44321",
        email: "priya.malhotra@ndmc.gov.in",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
        rating: 4.9,
        resolvedCount: 620,
        bio: "Direct execution advocate. Implementing high-capacity sensor networks for real-time unlit lighting grids & broken roads."
      },
      garbageSchedule: {
        status: "Completed (Shift Done)",
        collectorName: "Shri Harish Kumar (Vehicle DL-1C-A-7788)",
        contact: "+91 99112 34567",
        time: "06:00 AM - 09:30 AM",
        route: ["Inner Circle Block A-F", "Outer Road Hub", "Radial Roads 1-5", "Sentry Lane CP"],
        progress: 100
      },
      waterSupply: {
        status: "Under Maintenance Flow",
        supplyTime: "07:00 AM to 09:00 AM (Daily)",
        pressure: "1.5 Bar (Reduced)",
        purityScore: 89,
        contaminationRisk: "Medium"
      },
      floodAlerts: {
        status: "General Safe Sentry",
        riskScore: 25,
        activeAdvisory: "Minor puddles logged at outer circular lanes. Remediation desilting is scheduled.",
        pumpsDeployed: 0
      }
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchInput.trim().toUpperCase();
    
    // Auto map to the closest ward
    if (query.includes("174") || query.includes("HSR") || selectedCity === "Bengaluru") {
      setSearchedWard("174");
    } else if (query.includes("10") || query.includes("ANDHERI") || selectedCity === "Mumbai") {
      setSearchedWard("10");
    } else {
      setSearchedWard("9");
    }

    safeConfetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ["#3b82f6", "#10b981", "#34d399"]
    });
  };

  const currentWardDetails = wardDatabase[searchedWard] || wardDatabase["174"];

  const subscribeToChannel = (channel: string) => {
    setSubsActive(prev => ({ ...prev, [channel]: !prev[channel] }));
    if (!subsActive[channel]) {
      safeConfetti({
        particleCount: 20,
        spread: 40,
        scalar: 0.8,
        colors: ["#10b981"]
      });
    }
  };

  return (
    <div className="w-full bg-[#FFFFFF] dark:bg-[#111] py-4" id="ward_info_hub">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Banner Segment - Canva styled pure white layout */}
        <div className="bg-gradient-to-tr from-slate-50 to-white dark:from-[#1E293B]/20 dark:to-[#0F172A]/40 border border-[#E2E8F0] dark:border-white/[0.08] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-8 shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,113,227,0.02),transparent_60%)]"></div>
          
          <div className="space-y-4 max-w-xl text-center md:text-left relative z-10">
            <span className="text-[10px] bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30 font-mono font-bold tracking-[0.15em] uppercase px-3 py-1 rounded-full inline-block">
              <Landmark className="h-3 w-3 inline mr-1 -mt-0.5" /> SMART COMMUNITIES DIRECTORY
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Know Your Ward Info Center
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
              Enter any local Ward No. or Property Registration ID to instantly lookup local officer contact profiles, garbage disposal rosters, water times, and live flood risk indexes.
            </p>
          </div>

          {/* Form Action Left card */}
          <div className="w-full md:w-[380px] bg-white dark:bg-[#1A1A1A] border border-[#E2E8F0] dark:border-white/10 rounded-2xl p-5 shadow-lg relative z-10">
            <form onSubmit={handleSearchSubmit} className="space-y-4">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block font-mono">
                🔍 RETRIEVE DISTRICT WARD DATA
              </span>
              
              <div className="relative">
                <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Enter Ward No. (e.g. 174, 10, 9)"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-white/[0.03] border border-[#E2E8F0] dark:border-white/10 rounded-xl text-xs font-bold text-slate-800 dark:text-white outline-none focus:border-blue-500 transition-all font-sans placeholder-slate-400"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-xl transition shadow flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Synchronize Ward Records</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-white/[0.05] flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>ACTIVE CODES: 174 (HSR), 10 (Andheri), 9 (CP)</span>
            </div>
          </div>
        </div>

        {/* Dynamic Display Segment */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sub tab selectors on the Left (3 cols) */}
          <div className="lg:col-span-3 space-y-2">
            <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block ml-2 mb-2">
              WARD SERVICES INDEX
            </span>

            {[
              { id: "councillor", label: "Ward Councillor", desc: "Officer profile & metrics", icon: User, badge: "Sentry Verified" },
              { id: "garbage", label: "Garbage Schedule", desc: "Wet/dry vehicle tracking", icon: Trash2, badge: "Daily Log" },
              { id: "water", label: "Water Supply Times", desc: "Flow pressures & quality", icon: Droplets, badge: "Scheduled" },
              { id: "flood", label: "Flood Risk Advisories", desc: "Flood models & sensors", icon: AlertTriangle, badge: "AI Live" }
            ].map((sub) => {
              const Icon = sub.icon;
              const isActive = activeSubTab === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => setActiveSubTab(sub.id as any)}
                  className={`w-full text-left p-4.5 rounded-2xl border transition-all flex items-start gap-3.5 cursor-pointer select-none ${
                    isActive
                      ? "bg-white dark:bg-neutral-900 border-blue-500/80 shadow-md text-blue-600 dark:text-white dark:ring-1 dark:ring-blue-500/30"
                      : "bg-[#FAFAFA] dark:bg-[#161617] border-[#E2E8F0] dark:border-white/[0.06] hover:bg-white dark:hover:bg-[#1E1E20] text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <div className={`p-2.5 rounded-xl ${isActive ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "bg-slate-100 dark:bg-white/[0.03] text-slate-500"}`}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div className="space-y-0.5 leading-none">
                    <span className="text-xs font-black block mt-0.5">{sub.label}</span>
                    <span className="text-[10.5px] text-slate-400 dark:text-slate-500 font-sans block pt-0.5">{sub.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Sub tab details panel on Right (9 cols) */}
          <div className="lg:col-span-9 bg-white dark:bg-neutral-900 border border-[#E2E8F0] dark:border-white/[0.08] rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-sm relative min-h-[380px]">
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/[0.005] rounded-full blur-3xl pointer-events-none"></div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${searchedWard}-${activeSubTab}`}
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                
                {/* Header Sub segment */}
                <div className="flex justify-between items-start pb-5 border-b border-slate-100 dark:border-white/[0.05]">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 block">
                      WARD REGION {currentWardDetails.wardNo} &bull; {currentWardDetails.wardName}
                    </span>
                    <h3 className="font-extrabold text-xl text-slate-800 dark:text-white tracking-tight mt-0.5 capitalize">
                      {activeSubTab === "councillor" && "Ward Councillor & Integrity Stats"}
                      {activeSubTab === "garbage" && "Sanitation & Wet/Dry Waste Logistics"}
                      {activeSubTab === "water" && "Clean Water Supply Channels"}
                      {activeSubTab === "flood" && "Sentry Advanced Flooding Predictor"}
                    </h3>
                  </div>

                  <span className="text-[9px] font-mono font-bold bg-slate-50 dark:bg-white/[0.03] text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-white/[0.05] py-1 px-3 rounded-full">
                    SLA UPDATED 3m AGO
                  </span>
                </div>

                {/* Sub Tab Contents 1: Councillor */}
                {activeSubTab === "councillor" && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
                    <div className="md:col-span-4 flex flex-col items-center text-center p-4 bg-slate-50/50 dark:bg-white/[0.02] border border-[#E2E8F0]/60 dark:border-white/[0.04] rounded-2xl">
                      <img 
                        src={currentWardDetails.councillor.avatar} 
                        alt={currentWardDetails.councillor.name} 
                        className="h-24 w-24 rounded-full object-cover border-4 border-white dark:border-neutral-800 shadow-md mb-3"
                      />
                      <span className="text-xs font-bold text-slate-800 dark:text-white block">
                        {currentWardDetails.councillor.name}
                      </span>
                      <span className="text-[9px] font-mono text-blue-600 dark:text-blue-400 font-bold tracking-wider mt-0.5 block">
                        {currentWardDetails.councillor.party}
                      </span>

                      <div className="flex items-center gap-1 mt-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-3 w-3 ${i < Math.floor(currentWardDetails.councillor.rating) ? "text-amber-500 fill-amber-500" : "text-slate-300"}`} 
                          />
                        ))}
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block ml-1">{currentWardDetails.councillor.rating} rating</span>
                      </div>
                    </div>

                    <div className="md:col-span-8 space-y-4">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold leading-none">BIOGRAPHY & FOCUS AREA</span>
                        <p className="text-[12.5px] text-slate-600 dark:text-slate-300 mt-2 leading-relaxed font-sans">
                          {currentWardDetails.councillor.bio}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#FAFAFA] dark:bg-white/[0.02] p-3 rounded-xl border border-slate-100 dark:border-white/[0.04]">
                          <span className="text-[9px] font-mono text-slate-400 uppercase font-black block">COMPLAINTS CLEARED</span>
                          <span className="text-[16px] font-black text-emerald-600 mt-1 block">✓ {currentWardDetails.councillor.resolvedCount} Resolved</span>
                        </div>
                        <div className="bg-[#FAFAFA] dark:bg-white/[0.02] p-3 rounded-xl border border-slate-100 dark:border-white/[0.04]">
                          <span className="text-[9px] font-mono text-slate-400 uppercase font-black block">INTEGRITY INDEX</span>
                          <span className="text-[16px] font-black text-blue-600 mt-1 block">99.1% Verified</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 dark:border-white/[0.05] flex flex-wrap items-center gap-4 text-xs font-mono">
                        <a href={`tel:${currentWardDetails.councillor.phone}`} className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:underline">
                          <Phone className="h-3.5 w-3.5" />
                          <span>{currentWardDetails.councillor.phone}</span>
                        </a>
                        <span className="text-slate-300">|</span>
                        <a href={`mailto:${currentWardDetails.councillor.email}`} className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:underline">
                          <Mail className="h-3.5 w-3.5" />
                          <span>{currentWardDetails.councillor.email}</span>
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub Tab Contents 2: Garbage Schedule */}
                {activeSubTab === "garbage" && (
                  <div className="space-y-5 pt-2">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100/40 dark:border-emerald-900/20 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-emerald-100 dark:bg-emerald-950 rounded-xl text-emerald-600 dark:text-emerald-400">
                          <Trash2 className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="text-[9px] font-mono font-medium text-slate-400 uppercase tracking-wider block">CURRENT TRUCK DISPATCH STATUS</span>
                          <span className="text-sm font-black text-slate-800 dark:text-white mt-0.5 block flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                            {currentWardDetails.garbageSchedule.status}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => subscribeToChannel("garbage")}
                        className={`text-[10px] font-bold py-1.5 px-3.5 rounded-full cursor-pointer transition flex items-center gap-1.5 border ${
                          subsActive["garbage"]
                            ? "bg-emerald-600 border-transparent text-white"
                            : "bg-white dark:bg-transparent border-[#E2E8F0] dark:border-white/10 text-slate-600 dark:text-slate-300"
                        }`}
                      >
                        {subsActive["garbage"] ? <ShieldCheck className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                        <span>{subsActive["garbage"] ? "Subscribed to SMS alerts" : "Subscribe and notify me"}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      <div className="md:col-span-7 space-y-4">
                        <div>
                          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold leading-none">DRIVER DIRECTORIES</span>
                          <span className="text-xs font-bold text-slate-800 dark:text-white block mt-1.5">{currentWardDetails.garbageSchedule.collectorName}</span>
                          <p className="text-[11px] text-slate-400 font-mono mt-1">SLA Assigned shift: {currentWardDetails.garbageSchedule.time}</p>
                        </div>

                        <div>
                          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold leading-none mb-2">SECTOR RESOLUTION TIMELINE ROUTE</span>
                          <div className="flex flex-wrap items-center gap-1 text-[11px]">
                            {currentWardDetails.garbageSchedule.route.map((r, i) => (
                              <React.Fragment key={r}>
                                <span className="bg-slate-50 dark:bg-white/[0.03] text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-white/[0.04] py-1 px-2.5 rounded-lg font-medium">{r}</span>
                                {i < currentWardDetails.garbageSchedule.route.length - 1 && <span className="text-slate-300 font-bold mx-0.5">&rarr;</span>}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-5 bg-slate-50/50 dark:bg-white/[0.02] border border-[#E2E8F0]/80 dark:border-white/[0.04] rounded-2xl p-4 flex flex-col justify-between">
                        <div className="space-y-1">
                          <span className="text-[9px] font-mono text-slate-400 uppercase block leading-none">DAILY TRUCK COMPLETION</span>
                          <span className="text-3xl font-extrabold text-emerald-600 block">{currentWardDetails.garbageSchedule.progress}%</span>
                          <span className="text-[10.5px] text-slate-400 block font-medium mt-1">Truck completion logs matching optimal ward coverage metrics</span>
                        </div>

                        <div className="h-2 w-full bg-slate-100 dark:bg-neutral-800 rounded-full overflow-hidden mt-3">
                          <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${currentWardDetails.garbageSchedule.progress}%` }}></div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-white/[0.05] text-xs font-mono flex items-center gap-2">
                      <span className="text-slate-400">Driver Contact Hotline:</span>
                      <a href={`tel:${currentWardDetails.garbageSchedule.contact}`} className="text-blue-600 dark:text-blue-400 hover:underline font-bold">{currentWardDetails.garbageSchedule.contact}</a>
                    </div>
                  </div>
                )}

                {/* Sub Tab Contents 3: Water Supply */}
                {activeSubTab === "water" && (
                  <div className="space-y-5 pt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      <div className="bg-[#0071E3]/5 border border-[#0071E3]/20 rounded-2xl p-4.5">
                        <span className="text-[9px] font-mono text-blue-600 dark:text-blue-400 uppercase font-black block leading-none">WATER RELEASE HOUR TIMINGS</span>
                        <span className="text-xs font-black text-slate-800 dark:text-white mt-2 block leading-snug">{currentWardDetails.waterSupply.supplyTime}</span>
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-[11px] font-mono text-slate-500 leading-none">Flow Meter Pressure:</span>
                          <span className="text-xs font-bold text-slate-800 dark:text-white font-mono">{currentWardDetails.waterSupply.pressure}</span>
                        </div>
                      </div>

                      <div className="bg-slate-50/50 dark:bg-white/[0.02] border border-[#E2E8F0]/60 dark:border-white/[0.04] rounded-2xl p-4.5 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[9px] font-mono text-slate-400 uppercase font-black block leading-none">WATER SAFE SCORE</span>
                            <span className="text-2xl font-extrabold text-blue-600 mt-1 block">{currentWardDetails.waterSupply.purityScore} / 100</span>
                          </div>
                          <span className="text-[9px] font-mono font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">LAB REPORT</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-normal mt-2">Chemical TDS safety and silt filter logs analyzed by Sentry smart diagnostics.</p>
                      </div>

                    </div>

                    <div className="p-4 bg-slate-50/30 dark:bg-white/[0.01] border border-slate-100 dark:border-white/[0.05] rounded-xl flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-slate-800 dark:text-white block">Regional Contamination Hazard Risk:</span>
                        <span className={`text-[10px] font-mono font-bold py-0.5 px-3 rounded-full inline-block ${
                          currentWardDetails.waterSupply.contaminationRisk === "Low" 
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-900/20" 
                            : "bg-amber-50 text-amber-600 border border-amber-100 dark:bg-amber-900/20"
                        }`}>
                          ● {currentWardDetails.waterSupply.contaminationRisk} risk logged
                        </span>
                      </div>

                      <button
                        onClick={() => subscribeToChannel("water")}
                        className={`text-[10px] font-bold py-1.5 px-4 rounded-full cursor-pointer transition flex items-center gap-1 ${
                          subsActive["water"]
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {subsActive["water"] ? <ShieldCheck className="h-3.5 w-3.5" /> : <Waves className="h-3.5 w-3.5" />}
                        <span>{subsActive["water"] ? "Subscribed flow SMS" : "Subscribe flow notifies"}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Sub Tab Contents 4: Flood Alerts */}
                {activeSubTab === "flood" && (
                  <div className="space-y-5 pt-2">
                    <div className={`p-4 border rounded-2xl flex items-start gap-4 ${
                      currentWardDetails.floodAlerts.riskScore > 50 
                        ? "bg-rose-500/5 border-rose-500/20" 
                        : "bg-blue-50/50 dark:bg-blue-900/5 border-blue-100/40"
                    }`}>
                      <div className={`p-3 rounded-xl ${currentWardDetails.floodAlerts.riskScore > 50 ? "bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-450" : "bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400"}`}>
                        <AlertTriangle className="h-5 w-5 animate-pulse" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono text-slate-400 uppercase font-black block leading-none">FLOOD RISK INDEX RATING</span>
                        <span className="text-sm font-black text-slate-800 dark:text-white block mt-1.5">
                          Risk Index: {currentWardDetails.floodAlerts.riskScore}% &bull; {currentWardDetails.floodAlerts.status}
                        </span>
                        <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed font-sans">{currentWardDetails.floodAlerts.activeAdvisory}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-slate-50/50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.04] p-4.5 rounded-2xl flex items-center justify-between">
                        <div>
                          <span className="text-[9px] font-mono text-slate-400 uppercase block font-bold leading-none">HEAVY SUCTION PUMPS DEPLOYED</span>
                          <span className="text-2xl font-black text-slate-800 dark:text-white mt-1.5 block">{currentWardDetails.floodAlerts.pumpsDeployed} units</span>
                        </div>
                        <Landmark className="h-7 w-7 text-slate-300" />
                      </div>

                      <div className="bg-slate-50/50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.04] p-4.5 rounded-2xl flex flex-col justify-between">
                        <div>
                          <span className="text-[9px] font-mono text-slate-400 uppercase block font-bold leading-none">PREDICTIVE MONSOON PREPAREDNESS</span>
                          <span className="text-xs font-bold text-emerald-600 mt-1.5 block">SLA Target Checklist Met ✓</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 dark:bg-neutral-800 rounded-full mt-2 overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: "94%" }}></div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-blue-50/10 dark:bg-blue-900/10 border border-blue-500/15 rounded-xl flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-medium">Automatic advisory alert protocols broadcasted via local Sentry networks.</span>
                      <button
                        onClick={() => subscribeToChannel("flood")}
                        className={`text-[10px] font-bold py-1.5 px-4 rounded-full cursor-pointer transition ${
                          subsActive["flood"]
                            ? "bg-rose-600 text-white"
                            : "bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {subsActive["flood"] ? "Advisory Warnings ON" : "Turn ON Emergency Warnings"}
                      </button>
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>

            {/* Hub info panel Footer */}
            <div className="mt-8 pt-4.5 border-t border-slate-100 dark:border-white/[0.05] flex flex-col sm:flex-row justify-between items-center gap-3 text-slate-400 text-xs font-sans">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-blue-600" />
                Integrated directly with public grievance boards & Municipal Service Level Agreements (SLA).
              </span>

              <button 
                onClick={() => {
                  safeConfetti({
                    particleCount: 80,
                    spread: 80,
                    origin: { y: 0.6 }
                  });
                }}
                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
              >
                <span>Report Ward Discrepancy</span>
                <Send className="h-3 w-3" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
