import React, { useEffect, useState } from "react";
import { Sparkles, Radio, Shield, Loader, Activity, Play, Pause, ChevronRight, ChevronLeft, CheckCircle2, ShieldAlert, Cpu, Award } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PresentationStep {
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  badge: string;
}

export default function CityLiveVideo() {
  const [vehicles, setVehicles] = useState<Array<{ id: number; x: number; speed: number; lane: number; color: string }>>([]);
  const [ticks, setTicks] = useState(0);
  
  // Presentation Video Simulator states
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [activeMode, setActiveMode] = useState<"video" | "simulation">("simulation");
  const [camChannel, setCamChannel] = useState<"crossing" | "underpass" | "streetline">("crossing");


  // Highly-animated walkthrough steps for Nivaran AI explaining the custom community platform
  const presentationSteps: PresentationStep[] = [
    {
      title: "Hyperlocal Sentry Scanning",
      subtitle: "Phase 1: Real-time Citizen Incident Capture",
      description: "Smart citizens take photos of civic anomalies (potholes, garbage, unlit streets). Nivaran AI automatically filters spatial locations and prevents double submissions.",
      icon: <ShieldAlert className="h-5 w-5 text-blue-600" />,
      color: "from-blue-500 to-indigo-600",
      badge: "STEP 1: CAPTURE"
    },
    {
      title: "Computer Vision & Severity Extraction",
      subtitle: "Phase 2: Automated Municipal Categorization via Gemini",
      description: "Nivaran v2 AI extracts severity tags (Critical to Low), classifies departments, and formats standardized official redressal letters automatically inside 3.5 seconds.",
      icon: <Cpu className="h-5 w-5 text-emerald-600" />,
      color: "from-emerald-500 to-teal-600",
      badge: "STEP 2: EXTRACT"
    },
    {
      title: "Bidding & Contractor Matchmaker",
      subtitle: "Phase 3: Automated Micro-Tender Bidding & Selection",
      description: "Qualified contractors lay financial bids on the open municipal work order. Local Corporator approves the optimal asset tender with decentralized smart contract tracking.",
      icon: <Activity className="h-5 w-5 text-purple-600" />,
      color: "from-purple-500 to-pink-600",
      badge: "STEP 3: MATCHMAKE"
    },
    {
      title: "Before/After Dual Verification",
      subtitle: "Phase 4: Multi-Phase AI Auditing with Photo Remittance",
      description: "Contractors submit post-remediation evidence. Nivaran AI's dual-image model cross-verifies asphalt layers and awards gamified points and releases corporate budget.",
      icon: <Award className="h-5 w-5 text-amber-600" />,
      color: "from-amber-500 to-orange-600",
      badge: "STEP 4: VERIFY"
    }
  ];

  // Auto-scrolling slides presentation simulation
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % presentationSteps.length);
    }, 5500); // Step every 5.5s
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Traffic node background movement simulation
  useEffect(() => {
    const list = Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      speed: 0.12 + Math.random() * 0.25,
      lane: Math.floor(Math.random() * 3),
      color: i % 3 === 0 ? "#FF9500" : i % 3 === 1 ? "#0071E3" : "#34C759"
    }));
    setVehicles(list);

    const interval = setInterval(() => {
      setVehicles(prev => prev.map(v => {
        let nextX = v.x + v.speed;
        if (nextX > 100) nextX = 0;
        return { ...v, x: nextX };
      }));
      setTicks(t => t + 1);
    }, 55);

    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    setCurrentStep((prev) => (prev + 1) % presentationSteps.length);
  };

  const handlePrev = () => {
    setCurrentStep((prev) => (prev - 1 + presentationSteps.length) % presentationSteps.length);
  };

  return (
    <div className="w-full bg-white dark:bg-[#1E293B] rounded-3xl border border-[#E2E8F0] dark:border-white/10 shadow-lg p-5 font-sans">
      
      {/* Mode Switches: Live City radar VS AI Interactive Walkthrough */}
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#F1F5F9] dark:border-white/[0.08]">
        <div className="flex gap-1.5 p-1 bg-[#F1F5F9] dark:bg-white/[0.05] rounded-full">
          <button
            onClick={() => setActiveMode("simulation")}
            className={`text-xs font-bold py-1 px-3.5 rounded-full cursor-pointer transition ${
              activeMode === "simulation"
                ? "bg-white dark:bg-[#334155] text-blue-600 dark:text-white shadow-sm"
                : "text-[#64748B] dark:text-[#94A3B8]"
            }`}
          >
            AI Interactive Walkthrough
          </button>
          <button
            onClick={() => setActiveMode("video")}
            className={`text-xs font-bold py-1 px-3.5 rounded-full cursor-pointer transition ${
              activeMode === "video"
                ? "bg-white dark:bg-[#334155] text-blue-600 dark:text-white shadow-sm"
                : "text-[#64748B] dark:text-[#94A3B8]"
            }`}
          >
            Live Metropolis CCTV Radar
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[10px] font-mono text-[#64748B] dark:text-[#94A3B8] uppercase font-bold tracking-wider">
            Nivaran Engine Live
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeMode === "simulation" ? (
          /* PRECISE DYNAMIC WORKFLOW PRESENTATION CONSOLE (Replacing custom mock videos with smooth HTML/CSS interactive graphic widgets!) */
          <motion.div
            key="simulationMode"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-5"
          >
            {/* Visualizer Frame on Left (7 cols) */}
            <div className="md:col-span-7 bg-[#F8FAFC] dark:bg-slate-900/60 rounded-2xl p-5 border border-[#E2E8F0]/80 dark:border-white/[0.05] flex flex-col justify-between min-h-[250px] relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,113,227,0.04),transparent_70%)]"></div>
              
              {/* Active Step Status Widget */}
              <div className="flex justify-between items-center relative z-10">
                <span className="text-[9px] font-mono font-extrabold bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {presentationSteps[currentStep].badge}
                </span>
                
                <div className="flex gap-1">
                  {presentationSteps.map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1 rounded-full transition-all duration-300 ${
                        i === currentStep ? "w-6 bg-blue-600" : "w-1.5 bg-slate-200 dark:bg-slate-700"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Animated visual display corresponding to stage */}
              <div className="my-6 flex flex-col items-center justify-center relative z-10 py-2">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="flex flex-col items-center text-center space-y-3"
                  >
                    <div className="p-4 bg-white dark:bg-[#1E293B] rounded-2xl shadow-md border border-[#E2E8F0] dark:border-white/10 flex items-center justify-center">
                      {presentationSteps[currentStep].icon}
                    </div>
                    
                    <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                      SYSTEM SIMULATOR
                    </span>
                    
                    <div className="h-2 w-32 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        key={`line-${currentStep}`}
                        transition={{ duration: 5.5, ease: "linear" }}
                        className="h-full bg-gradient-to-r from-blue-500 to-emerald-500"
                      />
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Controller buttons for Playback */}
              <div className="flex items-center justify-between border-t border-[#F1F5F9] dark:border-white/[0.05] pt-3 relative z-10 mt-auto">
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-1.5 rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-800 text-[#475569] dark:text-slate-300 transition cursor-pointer"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </button>
                  <span className="text-[10px] font-mono text-slate-400 flex items-center">
                    {isPlaying ? "AUTO-CYCLING PROMPTS..." : "PRESENTATION PAUSED"}
                  </span>
                </div>

                <div className="flex gap-1.5">
                  <button 
                    onClick={handlePrev}
                    className="p-1.5 border border-[#E2E8F0] dark:border-white/10 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer text-slate-600 dark:text-slate-300"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <button 
                    onClick={handleNext}
                    className="p-1.5 border border-[#E2E8F0] dark:border-white/10 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer text-slate-600 dark:text-slate-300"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Information panel on Right (5 cols) */}
            <div className="md:col-span-5 flex flex-col justify-between p-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div>
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest font-mono">
                      CIVIC RESOLUTION FLOW
                    </span>
                    <h4 className="font-extrabold text-[18px] text-[#1E293B] dark:text-[#F8FAFC] tracking-tight leading-snug mt-1">
                      {presentationSteps[currentStep].title}
                    </h4>
                    <span className="text-xs font-semibold text-slate-400 block mt-0.5 leading-tight">
                      {presentationSteps[currentStep].subtitle}
                    </span>
                  </div>

                  <p className="text-xs text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                    {presentationSteps[currentStep].description}
                  </p>

                  <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100/40 dark:border-blue-900/20 rounded-xl flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-[#34C759] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[11px] font-bold text-[#1E293B] dark:text-[#F8FAFC] block">Hyperlocal SLA Target Met</span>
                      <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8] mt-0.5 leading-snug">
                        Nivaran AI guarantees 99.2% matching of local repairs within strict district corporation limits.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Slide index indicators */}
              <div className="grid grid-cols-4 gap-1.5 mt-4 pt-3.5 border-t border-[#F1F5F9] dark:border-white/[0.08]">
                {presentationSteps.map((step, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setCurrentStep(idx); setIsPlaying(false); }}
                    className={`text-left p-1 rounded-lg transition-all ${
                      idx === currentStep 
                        ? "bg-slate-100 dark:bg-slate-800 border-l-2 border-blue-600" 
                        : "opacity-45 hover:opacity-100"
                    }`}
                  >
                    <span className="text-[8px] font-mono text-[#64748B] dark:text-[#94A3B8] block leading-none">PHASE 0{idx+1}</span>
                    <span className="text-[9px] font-extrabold text-slate-800 dark:text-slate-100 block mt-0.5 truncate">{step.badge.split(" ")[1]}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          /* LIVE TELEMETRY RADAR SIMULATOR (Professional Multi-Channel Simulated City Video with sweep lasers & AI locks) */
          <motion.div
            key="videoMode"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="relative w-full h-[330px] bg-slate-950 rounded-2xl overflow-hidden border border-black/15 dark:border-white/10 group shadow-inner flex flex-col justify-between pointer-events-auto"
          >
            {/* Ambient Background Glows */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,113,227,0.18)_0%,transparent_80%)] pointer-events-none"></div>
            
            {/* Unified Laser Sweeper Beam */}
            <motion.div 
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ duration: 4.8, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_10px_#00d2ff] opacity-80 pointer-events-none z-20"
            />

            {/* Dynamic Grid Overlay */}
            <div 
              className="absolute inset-0 bg-size-[50px_50px] opacity-20 pointer-events-none"
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(0, 194, 255, 0.1) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(0, 194, 255, 0.1) 1px, transparent 1px)
                `
              }}
            />

            {/* HIGH-FIDELITY CAMERA FEEDS */}
            {camChannel === "crossing" && (
              <div className="absolute inset-0 z-0">
                {/* Cyber City Silhouettes */}
                <svg className="absolute bottom-12 left-0 w-full h-[55%] text-slate-900/80 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path d="M 0 100 L 0 50 L 8 50 L 8 60 L 15 60 L 15 40 L 25 40 L 25 70 L 32 70 L 32 30 L 45 30 L 45 55 L 55 55 L 55 45 L 68 45 L 68 62 L 76 62 L 76 35 L 88 35 L 88 50 L 100 50 L 100 100 Z" fill="currentColor" />
                  {Array.from({ length: 12 }).map((_, i) => (
                    <circle 
                      key={i} 
                      cx={15 + (i * 7) % 70} 
                      cy={55 + (i * 11) % 35} 
                      r="0.4" 
                      fill="#FFD700" 
                      className="animate-pulse" 
                      style={{ animationDelay: `${i * 0.3}s` }} 
                    />
                  ))}
                </svg>

                {/* Animated Concentric Radar Scan Grid */}
                <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <div className="w-[180px] h-[180px] rounded-full border border-dashed border-cyan-500/15 flex items-center justify-center animate-spin" style={{ animationDuration: "12s" }}>
                    <div className="w-[110px] h-[110px] rounded-full border border-dotted border-emerald-500/20 flex items-center justify-center">
                      <div className="w-5 h-5 border border-red-500/30 rounded-full animate-ping" />
                    </div>
                  </div>
                </div>

                {/* Simulated Traffic lanes */}
                <div className="absolute bottom-12 w-full h-8 bg-slate-900/60 border-t border-b border-white/5 flex flex-col justify-around py-0.5 pointer-events-none">
                  <div className="w-full h-[1px] border-t border-dashed border-white/5" />
                  <div className="w-full h-[1px] border-t border-dashed border-white/5" />
                </div>

                {vehicles.map((v) => (
                  <div 
                    key={v.id}
                    className="absolute rounded-full shadow-[0_0_6px_currentColor] transition-all duration-300"
                    style={{
                      left: `${v.x}%`,
                      bottom: `${48 + v.lane * 8}px`,
                      width: "6px",
                      height: "4px",
                      backgroundColor: v.color,
                      color: v.color
                    }}
                  />
                ))}

                {/* Lock Target 01 - Pothole alert */}
                <div className="absolute left-[45%] top-[55%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
                  <div className="w-10 h-10 border-2 border-red-500 rounded-sm animate-pulse flex items-center justify-center relative">
                    <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-red-500"></span>
                    <span className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-red-500"></span>
                    <span className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-red-500"></span>
                    <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-red-500"></span>
                    <span className="text-[7px] text-red-400 font-mono scale-90 font-bold tracking-tighter">ANOMALY</span>
                  </div>
                  <div className="bg-black/80 border border-red-500/50 text-red-400 font-mono text-[7px] py-0.5 px-1.5 rounded mt-1 shadow-lg leading-none">
                    POTHOLE DETECTED [CAM-A]
                  </div>
                </div>
              </div>
            )}

            {camChannel === "underpass" && (
              <div className="absolute inset-0 z-0 flex flex-col justify-center items-center pointer-events-none">
                {/* Simulated Underpass Basin Graphic */}
                <div className="w-[80%] h-[110px] border border-cyan-500/30 rounded-2xl relative bg-slate-900/30 overflow-hidden flex flex-col justify-end">
                  {/* Dynamic Water wave */}
                  <motion.div 
                    animate={{ 
                      y: [0, 4, 0],
                      height: [`${35 + Math.sin(ticks / 5) * 5}%`, `${38 + Math.cos(ticks / 5) * 4}%`, `${35 + Math.sin(ticks / 5) * 5}%`] 
                    }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="w-full bg-cyan-950/70 border-t-2 border-cyan-400/80 flex items-center justify-center relative shadow-[inset_0_4px_12px_rgba(0,194,255,0.4)]"
                  >
                    <span className="text-[10px] font-mono font-extrabold text-cyan-300 tracking-wider">
                      Live Water Level: {(18.5 + Math.sin(ticks / 10) * 0.4).toFixed(1)} cm
                    </span>
                  </motion.div>
                </div>

                {/* Silt Meter sidebar */}
                <div className="absolute right-8 top-16 bg-black/60 border border-white/10 rounded-xl p-2.5 space-y-1.5 font-mono text-[9px] w-36">
                  <span className="text-slate-400 block">DESILTING STATUS</span>
                  <div className="flex justify-between font-bold text-amber-500">
                    <span>SILT RATIO:</span>
                    <span>74%</span>
                  </div>
                  <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500" style={{ width: "74%" }} />
                  </div>
                  <span className="text-[8px] text-[#34C759] font-bold block flex items-center gap-1 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> PUMP RUNNING (1200 RPM)
                  </span>
                </div>

                {/* Scanning sweep box */}
                <div className="absolute left-[15%] top-[12%] py-1.5 px-3 bg-red-500/5 border border-red-500/30 rounded-lg text-left text-red-400 font-mono">
                  <span className="text-[8px] font-bold uppercase block text-red-500">⚠️ FLOOD ADVISORY ON</span>
                  <p className="text-[9px] leading-tight mt-0.5 max-w-[130px]">Drain desilting is heavily recommended to avert storm blockages.</p>
                </div>
              </div>
            )}

            {camChannel === "streetline" && (
              <div className="absolute inset-0 z-0 pointer-events-none">
                {/* Satellite Scanning scope circle */}
                <div className="absolute inset-0 flex items-center justify-center font-sans">
                  <div className="w-[260px] h-[260px] rounded-full border border-teal-500/20 relative flex items-center justify-center">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border-t-2 border-l border-teal-400/40 rounded-full"
                    />
                    
                    {/* Drone overlay crosshairs */}
                    <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-teal-500/20" />
                    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[1px] bg-teal-500/20" />
                  </div>
                </div>

                {/* Drone searchlight targets */}
                <div className="absolute left-[30%] top-[35%] flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full border-2 border-emerald-500 flex items-center justify-center animate-pulse">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                  </div>
                  <span className="bg-emerald-950/90 border border-emerald-400 text-emerald-400 font-mono text-[7px] py-0.5 px-1.5 rounded mt-1">
                    LAMP NODE ONLINE
                  </span>
                </div>

                <div className="absolute right-[22%] top-[60%] flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full border-2 border-rose-500 flex items-center justify-center animate-ping">
                    <div className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
                  </div>
                  <span className="bg-rose-950/90 border border-rose-500 text-rose-500 font-mono text-[7px] py-0.5 px-1.5 rounded mt-1">
                    GRID UNLIT FAULT [RE-ENGAGE BIDS]
                  </span>
                </div>

                {/* Coordinates top header slider */}
                <div className="absolute top-16 left-6 text-left font-mono">
                  <span className="text-[8px] text-teal-400 block uppercase font-bold">Drone Flight Heading</span>
                  <span className="text-sm font-extrabold text-white">{(ticks * 2.5 % 360).toFixed(0)}° HEADING N</span>
                </div>
              </div>
            )}

            {/* LIVE HUD CONTROLS OVERLAID */}
            <div className="absolute inset-0 p-4 flex flex-col justify-between text-white bg-gradient-to-t from-black/90 via-black/20 to-black/65 font-sans pointer-events-none z-10">
              
              {/* Header HUD - Blinking digital clock & channel swappers */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-2 w-full">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur border border-white/10 px-2.5 py-1 rounded-full">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    <span className="text-[10px] font-mono font-black text-rose-400 tracking-wider">
                      REC SYSTEM LIVE
                    </span>
                  </div>

                  <span className="text-[9px] font-mono text-slate-300 bg-white/5 border border-white/10 px-2 py-1 rounded-full">
                    SCAN COORDS: {(7204 + ticks).toString()}
                  </span>
                </div>

                {/* Channels Swapper controls (Enabled cursor pointer clicks!) */}
                <div className="pointer-events-auto flex items-center gap-1 bg-black/80 backdrop-blur border border-white/10 p-0.5 rounded-lg text-[9px] font-mono">
                  <button
                    onClick={() => setCamChannel("crossing")}
                    className={`py-1 px-2.5 rounded transition font-bold cursor-pointer ${camChannel === "crossing" ? "bg-cyan-500 text-slate-950 font-black" : "text-slate-400 hover:text-white"}`}
                  >
                    CAM-01
                  </button>
                  <button
                    onClick={() => setCamChannel("underpass")}
                    className={`py-1 px-2.5 rounded transition font-bold cursor-pointer ${camChannel === "underpass" ? "bg-cyan-500 text-slate-950 font-black" : "text-slate-400 hover:text-white"}`}
                  >
                    CAM-02
                  </button>
                  <button
                    onClick={() => setCamChannel("streetline")}
                    className={`py-1 px-2.5 rounded transition font-bold cursor-pointer ${camChannel === "streetline" ? "bg-cyan-500 text-slate-950 font-black" : "text-slate-400 hover:text-white"}`}
                  >
                    CAM-03
                  </button>
                </div>
              </div>

              {/* Bottom HUD (Feedback metrics) */}
              <div className="flex justify-between items-end w-full pt-1.5 mt-auto">
                <div className="text-left">
                  <span className="text-[8px] text-slate-400 font-mono uppercase tracking-wider block font-bold leading-none">Nivaran AI Sentry scanning</span>
                  <span className="text-[12px] font-extrabold text-white block mt-0.5 flex items-center gap-1 leading-none">
                    <Sparkles className="h-3.5 w-3.5 text-[#FF9500] shrink-0" />
                    {camChannel === "crossing" && "Street Highway Anomaly radar"}
                    {camChannel === "underpass" && "Silt & Water Hydro Sensor network"}
                    {camChannel === "streetline" && "Hyperlocal Light-Mesh Scanner"}
                  </span>
                </div>

                <div className="text-right font-mono leading-none">
                  <span className="text-[8px] text-slate-400 uppercase block leading-none">AI ACCURACY</span>
                  <span className="text-[11px] text-[#34C759] font-bold block mt-1">99.2% OPTIMAL</span>
                </div>
              </div>

            </div>

          </motion.div>
        )
}
      </AnimatePresence>

    </div>
  );
}
