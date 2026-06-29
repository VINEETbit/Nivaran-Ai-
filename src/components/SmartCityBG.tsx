import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Shield, Eye, Radio, Cpu, Activity, Compass } from "lucide-react";

interface SmartCityBGProps {
  darkMode: boolean;
}

export default function SmartCityBG({ darkMode }: SmartCityBGProps) {
  const [ticks, setTicks] = useState(0);
  const [liveCoords, setLiveCoords] = useState({ lat: 12.9716, lng: 77.5946 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTicks((prev) => (prev + 1) % 1000);
      // Subtle floating coordinates variation to simulate panning sentry camera
      setLiveCoords({
        lat: 12.9716 + Math.sin(Date.now() / 8000) * 0.0008,
        lng: 77.5946 + Math.cos(Date.now() / 10000) * 0.0008,
      });
    }, 150);
    return () => clearInterval(interval);
  }, []);

  // Set up mock nodes representing smart city IoT sensors shifted to the right to prevent overlapping with text on the left
  const sentinelNodes = [
    { id: 1, x: 62, y: 25, type: "water", label: "FLOD_SENS_HSR", status: "STABLE", pulseColor: "border-cyan-400" },
    { id: 2, x: 82, y: 22, type: "road", label: "PTHL_SENTRY_03", status: "SCANNING", pulseColor: "border-emerald-500" },
    { id: 3, x: 58, y: 60, type: "light", label: "LAMP_GRID_11", status: "ONLINE", pulseColor: "border-amber-400" },
    { id: 4, x: 85, y: 55, type: "system", label: "CIVIC_MESH_B", status: "ACTIVE", pulseColor: "border-indigo-400" },
    { id: 5, x: 75, y: 78, type: "grid", label: "WASTE_DET_4", status: "SECURE", pulseColor: "border-rose-500" }
  ];

  // Moving light packets representing citizen safety signals along lanes
  const trafficFlows = [
    { id: 1, laneY: "32%", duration: 4.5, delay: 0, color: darkMode ? "#38BDF8" : "#0071E3" },
    { id: 2, laneY: "32%", duration: 6, delay: 2, color: darkMode ? "#34D399" : "#10B981" },
    { id: 3, laneY: "68%", duration: 3.8, delay: 0.5, color: darkMode ? "#FBBF24" : "#F59E0B" },
    { id: 4, laneY: "68%", duration: 5.2, delay: 2.8, color: darkMode ? "#F472B6" : "#E11D48" },
    { id: 5, laneY: "50%", duration: 4.2, delay: 1.2, color: darkMode ? "#A78BFA" : "#6D28D9" }
  ];

  // Background style sheets depending on current mode
  const bgStyle = darkMode
    ? "from-[#030712] via-[#0B1528] to-[#01040A]"
    : "from-[#F1F5F9] via-[#E2E8F0] to-[#D1D5DB]";

  const textMuted = darkMode ? "text-white/40" : "text-[#1E293B]/50";
  const textBright = darkMode ? "text-cyan-400" : "text-[#0071E3]";
  const gridColor = darkMode ? "rgba(6, 182, 212, 0.08)" : "rgba(0, 113, 227, 0.06)";
  const scannerGlow = darkMode ? "from-cyan-500/20 to-transparent" : "from-[#0071E3]/15 to-transparent";

  return (
    <div className={`absolute inset-0 overflow-hidden bg-gradient-to-br ${bgStyle} pointer-events-none rounded-[24px] transition-all duration-700`}>
      
      {/* 1. ARCHITECTURAL BLUEPRINT GRID ENGINE */}
      <div 
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          backgroundImage: `
            linear-gradient(to right, ${gridColor} 1px, transparent 1px),
            linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px"
        }}
      />

      {/* 2. LIVE CAMERA VIEWFINDER OVERLAYS (PRO VIDEO HUD STYLE) */}
      <div className="absolute inset-0 p-4 flex flex-col justify-between border border-white/5 rounded-[24px] z-10">
        
        {/* Top bar HUD items shifted right to prevent text overlap */}
        <div className="flex items-start justify-end gap-3 w-full">
          <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-red-500/30 text-white shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[8px] font-mono font-bold tracking-widest uppercase">LIVE FEED 04</span>
          </div>
          
          <div className="hidden sm:flex flex-col text-[8.5px] font-mono leading-tight bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded border border-white/5 text-white/70">
            <span>ISO 400</span>
            <span>SENS_GRID_SECURE</span>
          </div>

          <div className="flex flex-col items-end text-right">
            <span className={`text-[10px] font-mono font-bold leading-none ${darkMode ? "text-white" : "text-slate-900"}`}>
              {new Date().toISOString().substring(11, 19)} UTC
            </span>
            <span className="text-[7.5px] font-mono text-slate-500 tracking-tighter block mt-0.5">
              CAM_ANGLE_89.2°
            </span>
          </div>
        </div>

        {/* Outer Corner Viewfinder Bracket Lines */}
        <div className="absolute inset-4 pointer-events-none border-x border-y border-transparent">
          {/* Top Left Corner */}
          <div className={`absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 ${darkMode ? "border-cyan-400" : "border-[#0071E3]"} opacity-70`} />
          {/* Top Right Corner */}
          <div className={`absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 ${darkMode ? "border-cyan-400" : "border-[#0071E3]"} opacity-70`} />
          {/* Bottom Left Corner */}
          <div className={`absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 ${darkMode ? "border-cyan-400" : "border-[#0071E3]"} opacity-70`} />
          {/* Bottom Right Corner */}
          <div className={`absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 ${darkMode ? "border-cyan-400" : "border-[#0071E3]"} opacity-70`} />
        </div>

        {/* Bottom bar HUD metrics shifted right to prevent text overlap */}
        <div className="flex items-end justify-end gap-4 w-full">
          <div className="hidden md:flex flex-col space-y-1 items-end text-right">
            <span className="text-[8px] font-mono bg-black/40 text-white px-2 py-0.5 rounded border border-white/5">
              COORD_LOC: {liveCoords.lat.toFixed(5)}° N, {liveCoords.lng.toFixed(5)}° E
            </span>
            <span className="text-[7.5px] font-mono text-slate-500 block uppercase tracking-wider">
              Nivaran Sentry Mesh Network Layer 3.1
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex flex-col items-end text-right">
              <span className={`text-[8.5px] font-mono font-extrabold ${darkMode ? "text-emerald-400" : "text-emerald-600 font-bold"}`}>
                LATENCY_STABLE
              </span>
              <span className="text-[7px] font-mono text-slate-500">
                MESH_RTT_{ticks % 15 + 12}_MS
              </span>
            </div>
            <Activity className={`h-6 w-6 ${darkMode ? "text-cyan-400/30" : "text-[#0071E3]/30"} animate-pulse`} />
          </div>
        </div>
      </div>

      {/* 3. RADAR SYSTEM (SWEEPING RADAR HUD EFFECT ON THE RIGHT HALF) */}
      <div className="absolute top-1/2 left-[75%] -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] pointer-events-none opacity-45 z-0">
        {/* Concentric Radar Rings */}
        <div className="absolute inset-0 rounded-full border border-cyan-500/10" />
        <div className="absolute inset-[60px] rounded-full border border-cyan-500/10" />
        <div className="absolute inset-[120px] rounded-full border border-cyan-500/10" />
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-cyan-500/10" />
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[1px] bg-cyan-500/10" />

        {/* Rotating sweep light ray (creates realistic Radar video look) */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 origin-center rounded-full"
          style={{
            background: `conic-gradient(from 0deg, ${darkMode ? "rgba(6, 182, 212, 0.15)" : "rgba(0, 113, 227, 0.1)"} 0deg, transparent 90deg, transparent 360deg)`
          }}
        />
      </div>

      {/* 4. DRONE FLIGHT SCANNING BEAM (SWEEPS BACK AND FORTH OVER RIGHT SIDE) */}
      <motion.div
        animate={{ x: ["45%", "110%", "45%"] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 bottom-0 w-36 pointer-events-none z-1"
        style={{
          background: `linear-gradient(to right, transparent, ${darkMode ? "rgba(34, 211, 238, 0.08)" : "rgba(0, 113, 227, 0.06)"}, transparent)`
        }}
      >
        <div className={`w-[2px] h-full mx-auto bg-gradient-to-b ${scannerGlow} shadow-[0_0_12px_rgba(34,211,238,0.5)]`} />
      </motion.div>

      {/* 5. FLOWING HIGHWAY PARTICLES (SIMULATING TRAFFIC & DATA restricted to right half) */}
      {trafficFlows.map((flow) => (
        <motion.div
          key={flow.id}
          initial={{ left: "50%" }}
          animate={{ left: "105%" }}
          transition={{
            duration: flow.duration,
            repeat: Infinity,
            delay: flow.delay,
            ease: "linear",
          }}
          className="absolute rounded-full h-[3px]"
          style={{
            top: flow.laneY,
            width: "36px",
            background: `linear-gradient(to right, transparent, ${flow.color}, ${flow.color})`,
            boxShadow: `0 0 8px ${flow.color}`,
          }}
        />
      ))}

      {/* 6. SENTINEL NODE BEACONS WITH GLOWING RADAR PULSES */}
      {sentinelNodes.map((node) => (
        <div
          key={node.id}
          className="absolute"
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
        >
          {/* Continuous pulsing circle waves */}
          <div className={`absolute -left-3.5 -top-3.5 w-9 h-9 rounded-full border-2 ${node.pulseColor} opacity-20 animate-ping`} style={{ animationDuration: "3s" }} />
          
          {/* Solid central beacon core */}
          <div className={`absolute -left-1.5 -top-1.5 w-3 h-3 rounded-full ${
            darkMode ? "bg-slate-900 border-white/25" : "bg-white border-black/15"
          } border flex items-center justify-center shadow-sm z-20`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              node.id === 5 ? "bg-rose-500" : node.id === 3 ? "bg-amber-400" : node.id === 1 ? "bg-cyan-400" : "bg-emerald-500"
            } animate-pulse`} />
          </div>

          {/* Sentry Lock reticle (military pro look around the node) */}
          <div className="absolute -left-3 -top-3 w-6 h-6 border border-dashed border-white/10 rounded-full animate-spin" style={{ animationDuration: "12s" }} />

          {/* Micro HUD Label with high-contrast text */}
          <div className={`absolute left-4.5 -top-1.5 ${
            darkMode ? "bg-slate-950/85 border-white/10 text-white" : "bg-white/95 border-[#0071E3]/15 text-slate-800"
          } backdrop-blur border rounded-md px-1.5 py-0.5 whitespace-nowrap shadow-sm z-20`}>
            <span className="text-[7.5px] font-mono tracking-tighter leading-none block font-semibold flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-cyan-400 inline-block animate-pulse" />
              {node.label} <strong className={darkMode ? "text-cyan-400" : "text-[#0071E3] font-bold"}>{node.status}</strong>
            </span>
          </div>
        </div>
      ))}

      {/* 7. HIGH-TECH CYBER DECORATIVE ICONS FLOATING FAINTLY ON RIGHT */}
      <Cpu className={`absolute ${darkMode ? "text-cyan-400/5" : "text-[#0071E3]/4"} h-16 w-16 right-32 bottom-8`} />
      <Compass className={`absolute ${darkMode ? "text-indigo-400/5" : "text-indigo-500/4"} h-20 w-20 right-10 top-6 animate-spin`} style={{ animationDuration: "35s" }} />
      <Radio className={`absolute ${darkMode ? "text-emerald-400/5" : "text-emerald-500/4"} h-12 w-12 right-48 top-8`} />
      <Shield className={`absolute ${darkMode ? "text-rose-400/5" : "text-rose-500/4"} h-14 w-14 right-[35%] bottom-4`} />
    </div>
  );
}
