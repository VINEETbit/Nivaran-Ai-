import React from "react";
import { 
  ShieldCheck, MapPin, Trophy, Star, Award, Zap, HelpCircle, Heart, Sparkles, CheckCircle2 
} from "lucide-react";
import { UserProfile } from "../types";
import { motion } from "motion/react";

interface BadgesProfileProps {
  profile: UserProfile;
}

export default function BadgesProfile({ profile }: BadgesProfileProps) {
  // Map standard icons to string selectors
  const iconMap: Record<string, any> = {
    ShieldCheck: ShieldCheck,
    MapPin: MapPin,
    Trophy: Trophy,
    Star: Star,
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 25 }}
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-[#1C1C1E] border border-black/[0.08] dark:border-white/[0.1] rounded-[20px] p-5 shadow-[0_2px_20px_rgba(0,0,0,0.06),_0_0_0_0.5px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative overflow-hidden"
    >
      {/* Decorative top gradient glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#0071E3]/5 to-[#34C759]/5 dark:from-[#0A84FF]/10 dark:to-[#30D158]/5 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>

      <div className="flex items-center justify-between border-b border-black/[0.05] dark:border-white/[0.08] pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-[#FF9500]/10 flex items-center justify-center text-[#FF9500]">
            <Trophy className="h-4 w-4" />
          </div>
          <span className="text-[12px] font-mono uppercase tracking-[0.08em] font-bold text-[#6E6E73] dark:text-[#98989D]">
            Civic Leader Hub
          </span>
        </div>
        <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 px-2 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider">
          Ranked Sentry
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        
        {/* Dynamic Citizen Ranking Card (Apple card-in-card design) */}
        <div className="md:col-span-4 bg-[#F5F5F7] dark:bg-[#2C2C2E]/60 p-4 rounded-2xl text-center flex flex-col justify-center items-center border border-black/[0.04] dark:border-white/[0.05]">
          <div className="relative mb-2 flex items-center justify-center">
            <div className="absolute inset-0 bg-[#FF9500]/15 dark:bg-[#FF3B30]/10 rounded-full blur-md animate-pulse"></div>
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              className="relative h-11 w-11 bg-white dark:bg-[#1C1C1E] border border-black/[0.08] dark:border-white/[0.1] text-[#FF9500] rounded-full flex items-center justify-center shadow-lg"
            >
              <Trophy className="h-5 w-5" />
            </motion.div>
          </div>
          <h4 className="font-sans font-bold text-[15px] text-[#1D1D1F] dark:text-[#F5F5F7] leading-none">
            {profile.name}
          </h4>
          <span className="text-[11px] font-mono text-[#6E6E73] dark:text-[#98989D] uppercase tracking-wider mt-1.5 mb-2.5">
            Verified Sentry
          </span>

          <div className="grid grid-cols-2 gap-3 border-t border-black/[0.08] dark:border-white/[0.1] pt-3.5 w-full font-mono text-xs">
            <div>
              <span className="text-[9px] text-[#6E6E73] dark:text-[#98989D] block font-bold leading-none">CITY INDEX</span>
              <span className="font-bold text-[#0071E3] dark:text-[#0A84FF] text-sm block mt-1">#{profile.ranks.city}</span>
            </div>
            <div>
              <span className="text-[9px] text-[#6E6E73] dark:text-[#98989D] block font-bold leading-none">WARD INDEX</span>
              <span className="font-bold text-[#FF9500] text-sm block mt-1">#{profile.ranks.ward}</span>
            </div>
          </div>
        </div>

        {/* Dynamic stat lists */}
        <div className="md:col-span-4 flex flex-col justify-between gap-2.5 h-full">
          <div className="bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.05] dark:border-white/[0.06] p-3 rounded-xl flex items-center justify-between text-[13px] font-sans">
            <span className="text-[#6E6E73] dark:text-[#98989D] flex items-center gap-2 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0071E3] animate-pulse"></span>
              Reports Filled:
            </span>
            <span className="font-mono font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
              {profile.stats.reported}
            </span>
          </div>

          <div className="bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.05] dark:border-white/[0.06] p-3 rounded-xl flex items-center justify-between text-[13px] font-sans">
            <span className="text-[#6E6E73] dark:text-[#98989D] flex items-center gap-2 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF9500]"></span>
              Witness Claims:
            </span>
            <span className="font-mono font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
              {profile.stats.witnessed}
            </span>
          </div>

          <div className="bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.05] dark:border-white/[0.06] p-3 rounded-xl flex items-center justify-between text-[13px] font-sans">
            <span className="text-[#6E6E73] dark:text-[#98989D] flex items-center gap-2 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-[#34C759]"></span>
              Resolutions:
            </span>
            <span className="font-mono font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
              {profile.stats.verified}
            </span>
          </div>
        </div>

        {/* Milestone Badges Collection (Apple style circle badges) */}
        <div className="md:col-span-4">
          <span className="text-[10px] text-[#6E6E73] dark:text-[#98989D] font-mono uppercase tracking-wider block font-bold mb-2.5">
            UNLOCKS ({profile.badges.length})
          </span>

          <div className="grid grid-cols-2 gap-2">
            {profile.badges.map((badge) => {
              const IconComponent = iconMap[badge.icon] || Award;
              return (
                <div 
                  key={badge.id}
                  className="bg-black/[0.02] dark:bg-white/[0.03] p-2.5 border border-black/5 dark:border-white/[0.08] rounded-xl hover:border-[#FF9500]/30 dark:hover:border-[#FF9F0A]/30 transition group flex flex-col items-center text-center"
                >
                  <div className="h-7 w-7 bg-[#FF9500]/10 text-[#FF9500] rounded-full flex items-center justify-center mb-1.5 shrink-0 shadow-sm">
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <span className="text-[11px] font-sans font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] block truncate w-full">
                    {badge.title}
                  </span>
                  <span className="text-[9px] font-sans text-[#6E6E73] dark:text-[#98989D] block leading-tight mt-0.5 truncate w-full group-hover:whitespace-normal group-hover:overflow-visible group-hover:block">
                    {badge.description}
                  </span>
                </div>
              );
            })}

            {/* Locked Badge */}
            <div className="bg-black/[0.01] dark:bg-white/[0.01] p-2.5 border border-black/[0.03] dark:border-white/[0.04] rounded-xl flex flex-col items-center text-center opacity-40 select-none">
              <div className="h-7 w-7 bg-black/10 dark:bg-white/10 text-[#6E6E73] dark:text-[#98989D] rounded-full flex items-center justify-center mb-1.5 shrink-0">
                <Star className="h-3.5 w-3.5" />
              </div>
              <span className="text-[11px] font-sans font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] block truncate w-full">
                Sentry Pro
              </span>
              <span className="text-[9px] font-sans text-[#6E6E73] dark:text-[#98989D] block leading-tight mt-0.5 truncate w-full">
                Verify 5 solutions
              </span>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
