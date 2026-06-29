import React from "react";
import { AlertTriangle, Droplets, Sparkles, AlertCircle, Info, ArrowUpRight, Gauge } from "lucide-react";
import { motion } from "motion/react";

export default function PredictiveSentry() {
  // Semi-dynamic high fidelity predictive sensors in Indian metropolitan streets
  const predictiveHotspots = [
    {
      id: "p1",
      street: "HSR Sector 6 Underpass, Bengaluru",
      siltingRate: "89%",
      riskScore: "Critical (94% prob)",
      cause: "Silt blockage + Stormwater catchment convergence.",
      actionRequired: "Urgent desilting by BBMP ward task force."
    },
    {
      id: "p2",
      street: "SV Road Metro Junction, Andheri, Mumbai",
      siltingRate: "72%",
      riskScore: "High (83% prob)",
      cause: "Low sewer contour elevation relative to high tide charts.",
      actionRequired: "Deploy high-capacity diesel pump sets before Friday."
    },
    {
      id: "p3",
      street: "Yamuna Pushta Low Elevation Belt, New Delhi",
      siltingRate: "45%",
      riskScore: "Medium (58% prob)",
      cause: "Upstream discharge from Hathnikund Barrage overflows.",
      actionRequired: "Evacuation alerts & sandbag barrier installation."
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-[#1C1C1E] border border-black/[0.08] dark:border-white/[0.1] rounded-[20px] p-6 shadow-[0_2px_20px_rgba(0,0,0,0.06),_0_0_0_0.5px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#0A84FF]/5 to-[#FF9F0A]/5 dark:from-[#0A84FF]/10 dark:to-[#FF9F0A]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

      <div className="flex items-center justify-between border-b border-black/[0.05] dark:border-white/[0.08] pb-4 mb-4">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#0071E3] dark:text-[#0A84FF] uppercase tracking-[0.08em] font-bold">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            AI Predictive Sentry
          </div>
          <h3 className="font-sans font-bold text-[#1D1D1F] dark:text-[#F5F5F7] text-base mt-1">
            "Before-It-Happens" Monsoon Flood Radar
          </h3>
        </div>
        <div className="text-right">
          <span className="text-[9px] text-[#6E6E73] dark:text-[#98989D] font-mono uppercase block leading-none">Sensor Mesh</span>
          <span className="text-[11px] font-mono text-[#34C759] dark:text-[#30D158] font-bold flex items-center justify-end gap-1 mt-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#34C759] dark:bg-[#30D158] animate-pulse"></span>
            ACTIVE
          </span>
        </div>
      </div>

      <p className="text-[13px] text-[#6E6E73] dark:text-[#98989D] font-sans leading-relaxed mb-5">
        Analyzes historical rainfall anomalies, catchment elevation contours, and real-time sewer silt estimates to pinpoint municipal streets bound to flood BEFORE any heavy rain starts.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {predictiveHotspots.map((hot, idx) => {
          const isCritical = hot.riskScore.includes("Critical");
          const cardBorder = isCritical 
            ? "border-rose-500/20 dark:border-rose-500/30 bg-rose-500/5" 
            : "border-black/[0.05] dark:border-white/[0.04] bg-black/[0.01] dark:bg-white/[0.01]";
          const textBadge = isCritical 
            ? "text-[#FF3B30] bg-[#FF3B30]/10" 
            : "text-[#FF9500] bg-[#FF9500]/10";

          return (
            <motion.div 
              key={hot.id} 
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, type: "spring", stiffness: 200 }}
              className={`border rounded-2xl p-4 flex flex-col justify-between gap-3 ${cardBorder}`}
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-2">
                  <span className="text-[13px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] leading-tight flex items-center gap-1">
                    {hot.street}
                  </span>
                  <span className={`text-[9px] font-mono font-bold py-0.5 px-2 rounded-full shrink-0 ${textBadge}`}>
                    {hot.riskScore}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#6E6E73] dark:text-[#98989D] mb-2">
                  <Droplets className="h-3.5 w-3.5 text-[#0071E3] dark:text-[#0A84FF]" />
                  <span>Silt Blockage:</span>
                  <span className="font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">{hot.siltingRate}</span>
                </div>

                <p className="text-[12px] text-[#6E6E73] dark:text-[#98989D] leading-snug">
                  {hot.cause}
                </p>
              </div>

              <div className="bg-[#F5F5F7] dark:bg-[#1C1C1E] p-2.5 rounded-xl border border-black/[0.05] dark:border-white/[0.06] mt-1">
                <span className="text-[9px] text-[#6E6E73] dark:text-[#98989D] font-mono uppercase font-bold block mb-0.5">MUNICIPAL DESPATCH DIRECTIVE</span>
                <span className="text-[11.5px] font-sans text-[#FF9500] dark:text-[#FF9F0A] leading-tight block">
                  {hot.actionRequired}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

    </motion.div>
  );
}
