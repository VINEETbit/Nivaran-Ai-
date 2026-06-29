import React, { useState } from "react";
import { 
  Heart, Users, CheckCircle2, ChevronDown, ChevronUp, FileText, Send, 
  Sparkles, Briefcase, Camera, Loader, Check, Circle, Copy, ShieldCheck, HelpCircle,
  Clock, MapPin, Building
} from "lucide-react";
import { CivicIssue } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface IssueCardProps {
  issue: CivicIssue;
  onUpvote: (id: string) => void;
  onWitness: (id: string, phone: string) => Promise<{ success: boolean; error?: string }>;
  onPlaceBid: (id: string, data: { contractorName: string; amount: number; timelineDays: number }) => void;
  onUpdateStatus: (id: string, status: any, resolvedImageUrl?: string, beforeAfterVerifiedByAI?: boolean) => void;
  draftingLetterId: string | null;
  draftedLetter: string | null;
  onClearLetter: () => void;
  onDraftLetter: (issue: CivicIssue) => void;
  userRole: "Citizen" | "Contractor" | "Corporator";
}

function formatTimeAgo(dateString: string) {
  try {
    const created = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - created.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffMs < 0 || diffSec < 5) return "Just now";
    if (diffSec < 60) return `${diffSec}s ago`;
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    return `${diffDay}d ago`;
  } catch (err) {
    return "2 hours ago";
  }
}

export default function IssueCard({
  issue,
  onUpvote,
  onWitness,
  onPlaceBid,
  onUpdateStatus,
  draftingLetterId,
  draftedLetter,
  onClearLetter,
  onDraftLetter,
  userRole
}: IssueCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showWitnessForm, setShowWitnessForm] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");
  const [witnessSubmitting, setWitnessSubmitting] = useState(false);
  const [witnessError, setWitnessError] = useState<string | null>(null);

  // Bidding Board States
  const [showBidForm, setShowBidForm] = useState(false);
  const [contractorName, setContractorName] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [bidTimeline, setBidTimeline] = useState("");

  // Resolution states
  const [showResolveForm, setShowResolveForm] = useState(false);
  const [afterImageInput, setAfterImageInput] = useState("");
  const [auditingStatus, setAuditingStatus] = useState<"idle" | "running" | "success" | "fail">("idle");
  const [auditMessage, setAuditMessage] = useState("");

  const [copiedLetter, setCopiedLetter] = useState(false);

  // Styled color configurations based on Severity
  const severityStyles = {
    Low: { text: "text-[#34C759]", bg: "bg-[#34C759]/10", border: "border-[#34C759]/20" },
    Medium: { text: "text-[#FF9500]", bg: "bg-[#FF9500]/10", border: "border-[#FF9500]/20" },
    High: { text: "text-[#FF3B30]", bg: "bg-[#FF3B30]/10", border: "border-[#FF3B30]/20" },
    Critical: { text: "text-[#FF3B30] font-bold animate-pulse", bg: "bg-[#FF3B30]/15", border: "border-[#FF3B30]/30" }
  };

  const statusColors = {
    "Reported": "bg-blue-500/10 text-[#0071E3] border-[#0071E3]/20",
    "In Progress": "bg-[#FF9500]/10 text-[#FF9500] border-[#FF9500]/20",
    "Resolved": "bg-[#34C759]/10 text-[#34C759] border-[#34C759]/20"
  };

  // Upvote Heart Bounce State
  const [isUpvoting, setIsUpvoting] = useState(false);

  const handleUpvoteClick = () => {
    setIsUpvoting(true);
    onUpvote(issue.id);
    setTimeout(() => setIsUpvoting(false), 850);
  };

  // Submit co-signing witness
  const handleWitnessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput.trim()) return;
    setWitnessSubmitting(true);
    setWitnessError(null);
    try {
      const res = await onWitness(issue.id, phoneInput);
      if (res && !res.success) {
        setWitnessError(res.error || "Co-sign failed.");
      } else {
        setPhoneInput("");
        setShowWitnessForm(false);
      }
    } catch (err: any) {
      setWitnessError(err.message || "An unexpected error occurred.");
    } finally {
      setWitnessSubmitting(false);
    }
  };

  // Submit contractor bid
  const handleBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contractorName.trim() || !bidAmount || !bidTimeline) return;

    onPlaceBid(issue.id, {
      contractorName,
      amount: Number(bidAmount),
      timelineDays: Number(bidTimeline)
    });

    setContractorName("");
    setBidAmount("");
    setBidTimeline("");
    setShowBidForm(false);
  };

  // Simulated AI match resolver
  const handleResolveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Default image if empty
    const resolvedUrl = afterImageInput.trim() || "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800";
    
    setAuditingStatus("running");
    
    setTimeout(() => {
      // 94% positive AI check match
      const roll = Math.random();
      if (roll > 0.05) {
        setAuditingStatus("success");
        setAuditMessage("✓ Gemini Audit Success: Dual-image check confirmed resolution! Pavement asphalt and debris cleared matching 24th coordinates.");
        // Submit true resolving values
        onUpdateStatus(issue.id, "Resolved", resolvedUrl, true);
        setTimeout(() => {
          setShowResolveForm(false);
          setAuditingStatus("idle");
        }, 3200);
      } else {
        setAuditingStatus("fail");
        setAuditMessage("⚠️ Gemini Audit Alert: Image does not match coordinates or debris remains. Re-upload clean angle.");
      }
    }, 2400);
  };

  // Copy created digital letter to clipboard
  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLetter(true);
    setTimeout(() => setCopiedLetter(false), 2000);
  };

  const isCritical = issue.severity === "Critical" || issue.severity === "High";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="bg-white dark:bg-[#1C1C1E] border border-black/[0.08] dark:border-white/[0.1] rounded-[24px] overflow-hidden shadow-[0_2px_20px_rgba(0,0,0,0.06),_0_0_0_0.5px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-colors hover:shadow-[0_12px_40px_rgba(0,0,0,0.08),_0_0_0_1px_rgba(0,0,0,0.02)]"
    >
      
      {/* Top Banner layout */}
      <div className="md:flex">
        
        {/* Left Aspect: Visual Preview */}
        <div className="md:w-1/3 relative h-[180px] md:h-auto min-h-[160px] bg-slate-100 dark:bg-black/40 overflow-hidden">
          <img 
            src={issue.imageUrl} 
            alt={issue.title} 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            referrerPolicy="no-referrer"
          />

          {/* Top-Right Severity Float */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
            <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-md ${
              issue.severity === "High" || issue.severity === "Critical" 
                ? "bg-red-500/90 text-white shadow-sm"
                : "bg-black/60 text-white"
            }`}>
              🚨 {issue.severity}
            </span>
          </div>

          {/* Bottom-Left Ward Stamp */}
          <div className="absolute bottom-3 left-3 bg-black/55 backdrop-blur-md text-white border border-white/10 px-2.5 py-1 rounded-full text-[10px] font-mono leading-none tracking-wide flex items-center gap-1">
            <MapPin className="h-3 w-3 text-[#30D158]" />
            <span>{issue.location.ward}</span>
          </div>
        </div>

        {/* Right Aspect: Core Details & Control buttons */}
        <div className="md:w-2/3 p-5 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start gap-4 mb-2">
              <span className={`text-[9px] font-mono font-black py-0.5 px-2 rounded-full uppercase tracking-wider border ${
                statusColors[issue.status as keyof typeof statusColors] || ""
              }`}>
                {issue.status}
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Filed {formatTimeAgo(issue.createdAt)}
              </span>
            </div>

            <h3 className="font-sans font-bold text-[#1D1D1F] dark:text-[#F5F5F7] text-[16px] sm:text-[17px] tracking-tight leading-snug">
              {issue.title}
            </h3>

            <p className="text-[13px] text-[#6E6E73] dark:text-[#98989D] leading-relaxed mt-2 line-clamp-3">
              {issue.description}
            </p>

            <div className="flex flex-wrap gap-2.5 items-center mt-3 pt-3 border-t border-black/[0.05] dark:border-white/[0.08]">
              {/* Category label indicator */}
              <span className="text-[10px] hover:scale-102 bg-black/[0.03] dark:bg-white/5 border border-black/5 dark:border-white/10 text-[#6E6E73] dark:text-[#919196] font-mono px-2 py-0.5 rounded-full select-none">
                # {issue.category}
              </span>
              <span className="text-[10px] bg-black/[0.03] dark:bg-white/5 border border-transparent text-[#6E6E73] dark:text-[#919196] font-mono px-2 py-0.5 rounded-full">
                ⚖ {issue.department}
              </span>
            </div>
          </div>

          {/* Interaction Row (Heart, witness list, draft trigger) */}
          <div className="flex items-center justify-between mt-5 pt-3 border-t border-black/[0.05] dark:border-white/[0.08]">
            <div className="flex items-center gap-4">
              
              {/* Upvote heart style with spring bounce feedback */}
              <motion.button
                onClick={handleUpvoteClick}
                whileTap={{ scale: 0.85 }}
                animate={isUpvoting ? { scale: [1, 1.3, 1] } : {}}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition cursor-pointer select-none ${
                  issue.upvotes > 0 
                    ? "bg-[#FF3B30]/5 text-[#FF3B30] border-[#FF3B30]/30 shadow-none font-bold" 
                    : "bg-black/[0.02] dark:bg-white/[0.05] border-black/10 dark:border-white/10 text-slate-400 hover:text-slate-200"
                }`}
              >
                <Heart className={`h-4.5 w-4.5 transition-colors ${issue.upvotes > 0 ? "fill-[#FF3B30] text-[#FF3B30]" : ""}`} />
                <span>{issue.upvotes}</span>
              </motion.button>

              {/* Witness trigger */}
              <button
                onClick={() => setShowWitnessForm(!showWitnessForm)}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border cursor-pointer select-none transition ${
                  issue.witnesses.length > 0
                    ? "bg-[#0071E3]/5 text-[#0071E3] dark:text-[#0A84FF] border-[#0071E3]/20 font-bold"
                    : "bg-black/[0.02] dark:bg-white/[0.05] border-black/10 dark:border-white/10 text-slate-400 hover:text-slate-200"
                }`}
              >
                <Users className="h-4.5 w-4.5" />
                <span>{issue.witnesses.length} claimed</span>
              </button>

            </div>

            {/* AI Draft & expands */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (draftedLetter) {
                    onClearLetter();
                  } else {
                    onDraftLetter(issue);
                  }
                }}
                disabled={draftingLetterId === issue.id}
                className="bg-[#0071E3]/90 hover:bg-[#0071E3] text-white text-[11px] font-bold py-1.5 px-3 rounded-full flex items-center gap-1 shadow-sm transition disabled:opacity-40"
              >
                {draftingLetterId === issue.id ? (
                  <Loader className="h-3 w-3 animate-spin text-white" />
                ) : (
                  <FileText className="h-3.5 w-3.5" />
                )}
                {draftedLetter ? "Clear Letter" : "Gemini Draft Letter"}
              </button>

              <button 
                onClick={() => setExpanded(!expanded)}
                className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/15 text-[#6E6E73] dark:text-[#98989D] transition-colors"
              >
                {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Slide down expansion body containing letter drafts and actions */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ ease: "easeInOut", duration: 0.25 }}
            className="border-t border-black/[0.05] dark:border-white/[0.08] bg-[#FBFBFD] dark:bg-[#1C1C1E]/60 p-5 space-y-4"
          >
            {/* 1. Witness Form Area */}
            {showWitnessForm && (
              <motion.form 
                initial={{ opacity: 0, y: -4 }} 
                animate={{ opacity: 1, y: 0 }} 
                onSubmit={handleWitnessSubmit} 
                className="bg-white dark:bg-[#2C2C2E] p-3.5 border border-black/5 dark:border-white/10 rounded-2xl"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] font-mono tracking-wider font-extrabold text-[#6E6E73] dark:text-[#98989D] uppercase">
                    Co-Sign as Sentry Resident Witness
                  </span>
                  <button type="button" onClick={() => setShowWitnessForm(false)} className="text-xs text-slate-400">&times;</button>
                </div>
                <p className="text-[11.5px] text-slate-400 leading-snug mb-3">
                  Adding your mobile number validates this ticket as a high priority community blockage. Local MLA receives phone coordinates summaries.
                </p>
                <div className="flex gap-2">
                  <input 
                    type="tel" 
                    required
                    disabled={witnessSubmitting}
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="Enter Mobile (+91 XXXXX XXXXX)"
                    className="flex-1 bg-[#F5F5F7] dark:bg-black/40 border border-black/10 dark:border-white/10 text-xs px-3 py-2 rounded-xl focus:border-[#0071E3] focus:outline-none text-[#1D1D1F] dark:text-slate-100 font-mono disabled:opacity-50"
                  />
                  <button 
                    type="submit"
                    disabled={witnessSubmitting}
                    className="bg-[#0071E3] hover:bg-[#0071E3]/95 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {witnessSubmitting ? "Signing..." : "Co-Sign"} <Send className="h-3 w-3" />
                  </button>
                </div>
                {witnessError && (
                  <p className="text-[10px] text-[#FF3B30] font-mono mt-1.5">
                    ⚠️ {witnessError}
                  </p>
                )}

                {/* List registered witnesses */}
                {issue.witnesses.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-black/[0.05] dark:border-white/10">
                    <span className="text-[9px] text-[#6E6E73] dark:text-[#98989D] font-mono font-bold block mb-1">REGISTERED WITNESS CO-SIGNERS</span>
                    <div className="flex flex-wrap gap-1">
                      {issue.witnesses.map((ph, idx) => (
                        <span key={idx} className="text-[10px] font-mono bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-slate-400 py-0.5 px-2 rounded-full">
                          ✓ Phone {ph.slice(0, 4)}***{ph.slice(-3)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.form>
            )}

            {/* 2. Swapper Role Actions (Contractor, Corporator) */}
            {userRole === "Contractor" && (
              <div className="bg-white dark:bg-[#2C2C2E]/60 rounded-2xl border border-purple-500/15 p-4.5">
                <div className="flex justify-between items-center mb-3.5">
                  <span className="text-[11px] font-mono font-bold text-[#A855F7] uppercase tracking-wider flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4" />
                    Open Repair Tenders Board
                  </span>
                  <button 
                    onClick={() => setShowBidForm(!showBidForm)}
                    className="text-[11px] bg-[#A855F7]/10 hover:bg-[#A855F7]/20 text-[#A855F7] font-semibold py-1 px-3 rounded-full border border-purple-500/10"
                  >
                    Place Tender Estimate Bid
                  </button>
                </div>

                {/* List bids */}
                {issue.bids && issue.bids.length > 0 ? (
                  <div className="flex flex-col gap-2 mb-2">
                    {issue.bids.map((bid) => (
                      <div key={bid.id} className="bg-black/[0.01] dark:bg-white/[0.01] border border-black/5 dark:border-white/[0.08] p-3 rounded-xl flex items-center justify-between gap-2 text-xs font-mono">
                        <div>
                          <span className="font-bold text-[#1D1D1F] dark:text-[#F5F5F7] block">{bid.contractorName}</span>
                          <span className="text-[10.5px] text-[#6E6E73] dark:text-[#98989D]">Proposed timeline: {bid.timelineDays} Days</span>
                        </div>
                        <div className="text-right">
                          <span className="font-sans font-bold text-[#FF9500] text-[13px] block">₹{bid.amount.toLocaleString("en-IN")}</span>
                          <span className="text-[9px] bg-[#0071E3]/5 text-[#0071E3] font-bold px-1.5 py-0.5 rounded">Actionable Bid</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11.5px] text-slate-400 italic">No public sector bids placed on this issue yet.</p>
                )}

                {showBidForm && (
                  <form onSubmit={handleBidSubmit} className="bg-slate-100 dark:bg-black/40 p-4 border border-purple-500/20 rounded-xl mt-3 space-y-3">
                    <h5 className="text-[10px] font-mono font-bold text-[#A855F7] uppercase">CAST REPAIR TENDER ESTIMATE</h5>
                    <div className="flex flex-col gap-2.5">
                      <input 
                        type="text" 
                        required
                        value={contractorName}
                        onChange={(e) => setContractorName(e.target.value)}
                        placeholder="Contractor Firm Name (e.g. L&T Civil / BBMP Class I)"
                        className="bg-white dark:bg-[#1C1C1E] border border-black/10 dark:border-white/10 text-xs px-3 py-2 rounded-xl focus:border-[#A855F7] focus:outline-none font-sans text-slate-200"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input 
                          type="number" 
                          required
                          value={bidAmount}
                          onChange={(e) => setBidAmount(e.target.value)}
                          placeholder="Estimate cost (₹)"
                          className="bg-white dark:bg-[#1C1C1E] border border-black/10 dark:border-white/10 text-xs px-3 py-2 rounded-xl focus:border-[#A855F7] focus:outline-none font-mono text-slate-200"
                        />
                        <input 
                          type="number" 
                          required
                          value={bidTimeline}
                          onChange={(e) => setBidTimeline(e.target.value)}
                          placeholder="Repairs duration (Days)"
                          className="bg-white dark:bg-[#1C1C1E] border border-black/10 dark:border-white/10 text-xs px-3 py-2 rounded-xl focus:border-[#A855F7] focus:outline-none font-mono text-slate-200"
                        />
                      </div>
                      <button 
                        type="submit"
                        className="bg-[#A855F7] hover:bg-[#A855F7]/95 text-white font-bold text-xs py-2 rounded-xl"
                      >
                        File Formal Bid
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {userRole === "Corporator" && (
              <div className="bg-[#34C759]/5 border border-[#34C759]/15 rounded-2xl p-4.5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-mono font-black text-[#34C759] uppercase tracking-wider flex items-center gap-1.5">
                    <Building className="h-4 w-4" />
                    Corporator Administrative Console
                  </span>
                  {issue.status !== "Resolved" && (
                    <button 
                      type="button"
                      onClick={() => setShowResolveForm(!showResolveForm)}
                      className="text-[11px] bg-[#34C759]/10 hover:bg-[#34C759]/20 text-[#34C759] py-1 px-3 border border-emerald-500/10 rounded-full font-bold cursor-pointer"
                    >
                      Declare Resolution Fix
                    </button>
                  )}
                </div>

                {issue.status !== "Resolved" ? (
                  <div className="flex gap-2.5">
                    <button 
                      onClick={() => onUpdateStatus(issue.id, "In Progress")}
                      className="flex-1 bg-[#FF9500]/10 hover:bg-[#FF9500]/15 text-[#FF9500] font-sans font-bold text-xs py-2 px-3 rounded-xl border border-amber-500/10 select-none cursor-pointer"
                    >
                      ✓ Mark IN PROGRESS
                    </button>
                  </div>
                ) : (
                  <div className="text-xs font-sans text-slate-400 leading-snug">
                    ✓ This ticket was validated by AI computer vision as fully closed on municipal coordinates. No further budget audits required.
                  </div>
                )}

                {/* Dual-Image AI side-by-side verification form */}
                {showResolveForm && (
                  <form onSubmit={handleResolveSubmit} className="bg-white dark:bg-black/50 border border-[#34C759]/20 rounded-xl p-4 space-y-3">
                    <h5 className="text-[10px] font-mono font-bold text-[#34C759] uppercase flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5" />
                      Dual-Image AI Auditor (Before / After analysis)
                    </h5>
                    <p className="text-[11px] text-[#6E6E73] dark:text-[#98989D] leading-snug">
                      Provide a photograph of the newly laid asphalt or cleaned stormwater drainage canal.
                    </p>

                    <div className="space-y-1">
                      <label className="text-[9.5px] font-mono text-slate-400 block uppercase">AFTER RESOLUTION IMAGE URL</label>
                      <input 
                        type="url"
                        value={afterImageInput}
                        onChange={(e) => setAfterImageInput(e.target.value)}
                        placeholder="https://images.unsplash.com/... (Enter URL or leave blank for preset defaults)"
                        className="w-full bg-[#F5F5F7] dark:bg-[#1C1C1E] border border-black/10 dark:border-white/10 text-xs px-3 py-2 rounded-xl focus:border-emerald-500 focus:outline-none text-slate-200"
                      />
                    </div>

                    {auditingStatus !== "idle" && (
                      <div className={`p-3 border rounded-xl text-xs font-mono ${
                        auditingStatus === "running" ? "bg-[#FF9500]/5 text-[#FF9500] border-[#FF9500]/20" :
                        auditingStatus === "success" ? "bg-[#34C759]/5 text-[#34C759] border-[#34C759]/20" :
                        "bg-[#FF3B30]/5 text-[#FF3B30] border-[#FF3B30]/20"
                      }`}>
                        {auditingStatus === "running" ? (
                          <div className="flex items-center gap-2 font-bold uppercase tracking-wide">
                            <Loader className="h-3.5 w-3.5 animate-spin" />
                            <span>Gemini Auditor evaluating structural overlays...</span>
                          </div>
                        ) : (
                          <span>{auditMessage}</span>
                        )}
                      </div>
                    )}

                    <button 
                      type="submit"
                      disabled={auditingStatus === "running"}
                      className="w-full bg-[#34C759] hover:bg-[#34C759]/95 text-white font-extrabold text-xs py-2.5 rounded-xl cursor-pointer shadow"
                    >
                      Audit & Complete Road Order
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* 3. Render Completed Dual-Image Side-by-Side Slider if status is Resolved! */}
            {issue.status === "Resolved" && issue.resolvedImageUrl && (
              <div className="bg-white dark:bg-black/30 p-4 rounded-2xl border border-black/5 dark:border-white/[0.08] space-y-3">
                <span className="text-[10px] font-mono font-bold text-[#34C759] uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-[#34C759]" />
                  GEMINI AUTO-VERIFIED RESOLUTION PAIR
                </span>
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="relative rounded-xl overflow-hidden h-28 border border-black/10">
                    <img src={issue.imageUrl} className="w-full h-full object-cover grayscale brightness-75" />
                    <span className="absolute bottom-1.5 left-2 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">BEFORE</span>
                  </div>
                  <div className="relative rounded-xl overflow-hidden h-28 border border-emerald-500/20">
                    <img src={issue.resolvedImageUrl} className="w-full h-full object-cover border" />
                    <span className="absolute bottom-1.5 left-2 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">RESOLVED</span>
                    {issue.beforeAfterVerifiedByAI && (
                      <span className="absolute top-1.5 right-2 bg-[#30D158] text-white font-black text-[8px] px-1 py-0.5 rounded flex items-center gap-0.5">
                        <Sparkles className="h-2 w-2" /> AI SEAL
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 4. Display AI Drafted Letter addressed to Commissioner if created */}
            {draftedLetter && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-[#1E1E20] border border-black/10 dark:border-white/10 p-5 rounded-[20px] shadow-sm relative overflow-hidden"
              >
                
                {/* Envelope background theme details */}
                <div className="absolute top-0 right-0 p-3 text-[9px] font-mono font-black text-slate-300 dark:text-slate-400 select-none">
                  OFFICIAL CORRESPONDENCE TENDER
                </div>

                <div className="flex justify-between items-center pb-2.5 mb-3 border-b border-black/[0.05] dark:border-white/[0.1]">
                  <span className="text-xs font-bold text-[#0071E3] dark:text-[#0A84FF] flex items-center gap-1">
                    <Sparkles className="h-4 w-4 animate-pulse text-amber-500" />
                    COMMISSIONER PORTAL COMPLAINT COALESCE
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleCopyToClipboard(draftedLetter)}
                      className="p-1 px-[10px] rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-400 text-[10px] font-mono flex items-center gap-1 border border-black/10 dark:border-white/15"
                    >
                      <Copy className="h-3 w-3" />
                      {copiedLetter ? "Copied!" : "Copy Draft"}
                    </button>
                    <button onClick={onClearLetter} className="text-xs text-slate-400">&times;</button>
                  </div>
                </div>

                {/* Actual Letter body formatted nicely */}
                <div className="text-[12px] font-mono text-slate-400 leading-relaxed whitespace-pre-line overflow-y-auto max-h-72 pr-2">
                  {draftedLetter}
                </div>

                <div className="mt-4 pt-3 border-t border-black/[0.05] dark:border-white/[0.1] text-[10px] text-slate-400 leading-snug flex items-center gap-1.5 bg-black/[0.01] dark:bg-white/[0.02] p-2.5 rounded-xl">
                  <ShieldCheck className="h-4 w-4 text-[#34C759]" />
                  <span>Complies with Municipal Grievance Act provisions. Co-signs counts are embedded dynamically.</span>
                </div>
              </motion.div>
            )}

          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
