import React from "react";
import { Award, CheckCircle2, TrendingUp, ShieldAlert, ArrowUpRight } from "lucide-react";
import { MLAPerformance } from "../types";
import { motion } from "motion/react";

interface LeaderboardSectionProps {
  leaderboard: MLAPerformance[];
  selectedCity: string;
}

export default function LeaderboardSection({ leaderboard, selectedCity }: LeaderboardSectionProps) {
  // Filter performance relative to the city selected in global headers
  const cityLeaderboard = leaderboard.filter(item => item.city === selectedCity);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 25 }}
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-[#1C1C1E] border border-black/[0.08] dark:border-white/[0.1] rounded-[20px] p-6 shadow-[0_2px_20px_rgba(0,0,0,0.06),_0_0_0_0.5px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative"
    >
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#FF9500]/5 to-[#30D158]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#FF9500] uppercase tracking-[0.08em] font-bold">
            <Award className="h-4 w-4" />
            Ward Accountability Index
          </div>
          <h3 className="font-sans font-bold text-[#1D1D1F] dark:text-[#F5F5F7] text-base mt-0.5">
            MLA / Corporator Budget Scoreboard
          </h3>
        </div>
        <span className="text-[9px] bg-black/5 dark:bg-white/10 dark:text-[#98989D] text-[#6E6E73] py-1 px-2.5 rounded-full font-mono font-bold">
          DISTRICT: {selectedCity.toUpperCase()}
        </span>
      </div>

      <p className="text-[13px] text-[#6E6E73] dark:text-[#98989D] font-sans leading-relaxed mb-5">
        Accountability is computed by crossing <strong>reported local issues</strong> with <strong>AI verified desilting & structural fixes</strong>. Scores influence upcoming municipal road and stormwater budget allocations.
      </p>

      {/* Grid of leader lists */}
      <div className="flex flex-col gap-3">
        {cityLeaderboard.map((mla, idx) => {
          const medal = idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : "🏅";
          
          let scoreBg = "text-[#34C759] border-[#34C759]/20 bg-[#34C759]/5";
          if (mla.score < 80 && mla.score >= 70) scoreBg = "text-[#FF9500] border-[#FF9500]/20 bg-[#FF9500]/5";
          if (mla.score < 70) scoreBg = "text-[#FF3B30] border-[#FF3B30]/20 bg-[#FF3B30]/5";

          return (
            <motion.div 
              key={mla.id}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, type: "spring" }}
              className="bg-black/[0.01] dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.06] rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-4 hover:border-[#0071E3]/20 dark:hover:border-[#0A84FF]/25 transition duration-200"
            >
              
              {/* Profile details */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-xl shrink-0 select-none">{medal}</span>
                <div className="h-9 w-9 bg-[#F5F5F7] dark:bg-[#2C2C2E] border border-black/10 dark:border-white/15 rounded-full flex items-center justify-center text-sm shadow-inner uppercase font-black text-[#1D1D1F] dark:text-[#F5F5F7]">
                  {mla.avatar || "👤"}
                </div>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-sans font-bold text-[#1D1D1F] dark:text-[#F5F5F7] text-[13.5px]">
                      {mla.name}
                    </span>
                    <span className="text-[8px] font-mono font-bold bg-black/5 dark:bg-white/10 text-[#6E6E73] dark:text-[#98989D] px-1 py-0.5 rounded">
                      {mla.party}
                    </span>
                  </div>
                  <span className="text-[11.5px] text-[#6E6E73] dark:text-[#98989D] font-sans block mt-0.5">
                    {mla.wardName} &bull; <span className="text-slate-400 dark:text-slate-500">MLAs Seat:</span> <span className="text-[#1D1D1F] dark:text-[#F5F5F7] font-medium">{mla.constituency}</span>
                  </span>
                </div>
              </div>

              {/* Progress metrics and index rating */}
              <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto border-t sm:border-t-0 border-black/[0.05] dark:border-white/[0.08] pt-3 sm:pt-0 shrink-0">
                
                {/* Solved quantities */}
                <div className="text-left sm:text-right font-mono">
                  <span className="text-[9px] text-[#6E6E73] dark:text-[#98989D] uppercase block font-bold leading-none">AI RESOLVED VS FILED</span>
                  <span className="text-xs font-bold text-[#1D1D1F] dark:text-[#F5F5F7] block mt-1.5 flex items-center sm:justify-end gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#34C759]" />
                    {mla.resolvedIssues} / {mla.totalIssues}
                  </span>
                </div>

                {/* Score badge card */}
                <div className={`border p-1.5 px-3 rounded-xl text-center min-w-[76px] shrink-0 ${scoreBg}`}>
                  <span className="text-[8px] font-mono uppercase font-black block leading-none">INDEX</span>
                  <span className="font-sans font-extrabold text-[15px] block mt-0.5">{mla.score}%</span>
                </div>

              </div>

            </motion.div>
          );
        })}

        {cityLeaderboard.length === 0 && (
          <p className="text-xs text-[#6E6E73] dark:text-[#98989D] italic py-2 text-center">
            No leader board data registered for {selectedCity} yet.
          </p>
        )}
      </div>

    </motion.div>
  );
}
