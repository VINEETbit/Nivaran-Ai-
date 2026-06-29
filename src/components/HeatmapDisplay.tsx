import React, { useState } from "react";
import { Map, Layers, Radio, Sparkles, Filter, ChevronRight, Activity, MapPin } from "lucide-react";
import { CivicIssue } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface HeatmapDisplayProps {
  issues: CivicIssue[];
  selectedCity: string;
  onFilterWard: (ward: string | null) => void;
  activeWardFilter: string | null;
}

export default function HeatmapDisplay({
  issues,
  selectedCity,
  onFilterWard,
  activeWardFilter
}: HeatmapDisplayProps) {
  // Pre-configured geographical ward center nodes with canvas offsets
  const wardPositions: Record<string, Array<{ id: string; name: string; x: number; y: number }>> = {
    Bengaluru: [
      { id: "b1", name: "HSR Layout", x: 220, y: 320 },
      { id: "b2", name: "Indiranagar", x: 380, y: 160 },
      { id: "b3", name: "Koramangala", x: 280, y: 240 },
      { id: "b4", name: "Whitefield", x: 580, y: 220 },
      { id: "b5", name: "Hebbal", x: 300, y: 80 }
    ],
    Mumbai: [
      { id: "m1", name: "Andheri West", x: 200, y: 180 },
      { id: "m2", name: "Bandra West", x: 220, y: 280 },
      { id: "m3", name: "Colaba", x: 240, y: 420 },
      { id: "m4", name: "Worli", x: 210, y: 340 },
      { id: "m5", name: "Borivali", x: 180, y: 80 }
    ],
    Delhi: [
      { id: "d1", name: "Connaught Place", x: 320, y: 220 },
      { id: "d2", name: "Greater Kailash", x: 380, y: 360 },
      { id: "d3", name: "Karol Bagh", x: 220, y: 180 },
      { id: "d4", name: "Dwarka", x: 100, y: 300 },
      { id: "d5", name: "Vasant Kunj", x: 200, y: 380 }
    ]
  };

  const getWards = () => wardPositions[selectedCity] || wardPositions["Bengaluru"];

  // Compute issue density per ward dynamically
  const getWardIssueCount = (wardName: string) => {
    return issues.filter(
      (issue) => 
        issue.location.city.toLowerCase() === selectedCity.toLowerCase() &&
        issue.location.ward.toLowerCase() === wardName.toLowerCase()
    ).length;
  };

  const activeCityIssues = issues.filter(
    (i) => i.location.city.toLowerCase() === selectedCity.toLowerCase()
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className="bg-white dark:bg-[#1C1C1E] border border-black/[0.08] dark:border-white/[0.1] rounded-[24px] overflow-hidden shadow-[0_2px_20px_rgba(0,0,0,0.06),_0_0_0_0.5px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] mb-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Side: Interactive Map Blueprint Simulator */}
        <div className="lg:col-span-8 p-6 relative bg-[#F5F5F7] dark:bg-black/40 border-b lg:border-b-0 lg:border-r border-black/[0.08] dark:border-white/[0.1] flex flex-col min-h-[380px] sm:min-h-[440px] overflow-hidden">
          
          {/* Ambient city grid overlay */}
          <div className="absolute inset-0 animated-city-simulation opacity-40 mix-blend-overlay dark:opacity-20 pointer-events-none"></div>

          {/* Interactive Floating Header */}
          <div className="flex justify-between items-center relative z-10 mb-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-[#0071E3]/10 dark:bg-[#0A84FF]/20 flex items-center justify-center text-[#ff3b30]">
                <Activity className="h-3.5 w-3.5 animate-pulse" />
              </div>
              <span className="text-[11px] font-mono uppercase tracking-[0.08em] font-bold text-[#6E6E73] dark:text-[#98989D]">
                Live Thermal Radar Map
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-white/70 dark:bg-[#1C1C1E]/80 backdrop-blur border border-black/[0.06] dark:border-white/10 px-2.5 py-1 rounded-full text-[10px] font-mono text-[#6E6E73] dark:text-[#98989D]">
              <Layers className="h-3 w-3" />
              <span>SATELLITE SECTORS ON</span>
            </div>
          </div>

          {/* Map Vector Stage */}
          <div className="flex-1 relative w-full h-full min-h-[280px] border border-black/[0.04] dark:border-white/[0.02] bg-white/30 dark:bg-[#2C2C2E]/20 backdrop-blur-[2px] rounded-2xl relative overflow-hidden flex items-center justify-center">
            
            {/* SVG Roads Blueprint Silhouette */}
            <svg className="absolute inset-0 w-full h-full text-black/[0.03] dark:text-white/[0.03] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <line x1="10%" y1="0%" x2="10%" y2="100%" stroke="currentColor" strokeWidth="1" />
              <line x1="30%" y1="0%" x2="30%" y2="100%" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
              <line x1="50%" y1="0%" x2="50%" y2="100%" stroke="currentColor" strokeWidth="1" />
              <line x1="75%" y1="0%" x2="75%" y2="100%" stroke="currentColor" strokeWidth="2" />
              <line x1="0%" y1="20%" x2="100%" y2="20%" stroke="currentColor" strokeWidth="1.5" />
              <line x1="0%" y1="45%" x2="100%" y2="45%" stroke="currentColor" strokeWidth="1" />
              <line x1="0%" y1="70%" x2="100%" y2="70%" stroke="currentColor" strokeWidth="2" strokeDasharray="8 4" />
              
              {/* Converging river line or park contours */}
              <path d="M -50 400 Q 150 250 350 450 T 800 350" fill="none" stroke="currentColor" strokeWidth="5" className="opacity-40" />
            </svg>

            {/* Render Ward Nodes as Pulsing Apple Heat Blobs */}
            {getWards().map((ward) => {
              const count = getWardIssueCount(ward.name);
              const isActive = activeWardFilter?.toLowerCase() === ward.name.toLowerCase();
              
              // Map counts to dynamic sizes and warm colors
              let sizeClass = 24;
              let bubbleColor = "bg-[#34C759] text-white"; // safe -green
              if (count > 0) { sizeClass = 32; bubbleColor = "bg-[#FF9500]/15 border-[#FF9500] text-[#FF9500]"; }
              if (count >= 3) { sizeClass = 44; bubbleColor = "bg-[#FF3B30]/15 border-[#FF3B30] text-[#FF3B30]"; }

              return (
                <div
                  key={ward.id}
                  style={{ 
                    left: `${(ward.x / 700) * 100}%`, 
                    top: `${(ward.y / 500) * 100}%` 
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
                  onClick={() => onFilterWard(isActive ? null : ward.name)}
                >
                  {/* Outer pulse warning expanders */}
                  {count > 0 && (
                    <div 
                      className={`absolute -inset-2.5 rounded-full animate-ping opacity-35 ${
                        count >= 3 ? "bg-[#FF3B30]" : "bg-[#FF9500]"
                      }`}
                      style={{ animationDuration: count >= 3 ? "2s" : "3.5s" }}
                    />
                  )}

                  {/* Core bubble pin */}
                  <motion.div 
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    style={{ width: sizeClass, height: sizeClass }}
                    className={`rounded-full flex flex-col items-center justify-center border font-mono text-[10px] font-bold shadow-md transition-colors duration-200 ${
                      isActive 
                        ? "bg-[#0071E3] border-white text-white dark:bg-[#0A84FF] scale-110 shadow-lg ring-4 ring-[#0071E3]/20" 
                        : count > 0 
                          ? bubbleColor 
                          : "bg-white/80 dark:bg-[#1C1C1E]/80 border-black/10 dark:border-white/10 text-[#6E6E73] dark:text-[#98989D] hover:bg-white dark:hover:bg-[#1C1C1E]"
                    }`}
                  >
                    <span className="leading-none">{count}</span>
                  </motion.div>

                  {/* Tooltip on hover */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 whitespace-nowrap bg-black/90 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-150 scale-95 group-hover:scale-100 z-30">
                    {ward.name}: {count} Filed
                  </div>
                </div>
              );
            })}

            {/* Compass calibration HUD anchor */}
            <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-[9.5px] font-mono text-[#6E6E73] dark:text-[#98989D] font-bold">
              <MapPin className="h-3.5 w-3.5 text-[#0071E3] dark:text-[#0A84FF]" />
              <span>G-CORE POSITION UNLOCKED</span>
            </div>
          </div>

        </div>

        {/* Right Side: Analysis side panel summary (Apple info slate style) */}
        <div className="lg:col-span-4 p-6 flex flex-col justify-between">
          <div>
            <span className="text-[9px] font-mono text-[#6E6E73] dark:text-[#98989D] uppercase tracking-[0.08em] font-bold block mb-1">
              {selectedCity} INCIDENT INTELLIGENCE
            </span>
            <h3 className="font-sans font-bold text-[#1D1D1F] dark:text-[#F5F5F7] text-lg leading-tight mb-2">
              Sectoral Severity Summary
            </h3>
            <p className="text-[13px] text-[#6E6E73] dark:text-[#98989D] leading-relaxed mb-4">
              Our 311 Sentry mesh automatically tallies desilting issues to alert BBMP / MCGM local engineers about civic bottlenecks.
            </p>

            {/* Active filters display */}
            <div className="space-y-2 mb-4">
              <div className="text-[10px] font-mono text-[#6E6E73] dark:text-[#98989D] uppercase font-bold">
                MUNICIPAL SECTORS
              </div>
              <div className="flex flex-col gap-1.5">
                {getWards().map((w) => {
                  const count = getWardIssueCount(w.name);
                  const isSelected = activeWardFilter?.toLowerCase() === w.name.toLowerCase();
                  return (
                    <button
                      key={w.id}
                      onClick={() => onFilterWard(isSelected ? null : w.name)}
                      className={`flex items-center justify-between p-2 rounded-xl text-left font-sans text-xs border cursor-pointer transition ${
                        isSelected 
                          ? "bg-[#0071E3]/5 border-[#0071E3] dark:border-[#0A84FF] text-[#0071E3] dark:text-[#0A84FF] font-bold" 
                          : "bg-black/[0.01] dark:bg-white/[0.02] border-black/5 dark:border-white/[0.04] text-[#1D1D1F] dark:text-[#F5F5F7] hover:bg-black/[0.04] dark:hover:bg-white/5"
                      }`}
                    >
                      <span className="truncate pr-2">{w.name} Ward</span>
                      <span className={`font-mono text-[10px] font-black px-1.5 rounded ${
                        count >= 3 
                          ? "bg-[#FF3B30]/10 text-[#FF3B30]" 
                          : count > 0 
                            ? "bg-[#FF9500]/10 text-[#FF9500]" 
                            : "bg-black/5 dark:bg-white/10 text-slate-400"
                      }`}>
                        {count} alert{count !== 1 ? "s" : ""}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-black/[0.05] dark:border-white/[0.08]">
            {activeWardFilter ? (
              <div className="flex items-center justify-between bg-[#0071E3]/5 border border-[#0071E3]/20 rounded-xl p-3 text-xs">
                <div>
                  <span className="font-bold text-[#0071E3] block">Active Filter Enforced</span>
                  <span className="text-[#6E6E73] dark:text-[#98989D] text-[11px] block mt-0.5">Showing {activeWardFilter} layout data only</span>
                </div>
                <button
                  onClick={() => onFilterWard(null)}
                  className="font-mono text-[10px] text-[#0071E3] dark:text-[#0A84FF] underline cursor-pointer pr-1"
                >
                  CLEAR
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-[11.5px] text-[#6E6E73] dark:text-[#98989D] bg-black/[0.02] dark:bg-white/[0.04] p-3 rounded-xl">
                <Filter className="h-4 w-4 shrink-0 text-[#FF9500]" />
                <span>Tap any sector or bubble to isolate its micro-reports on your feed.</span>
              </div>
            )}
          </div>

        </div>

      </div>
    </motion.div>
  );
}
