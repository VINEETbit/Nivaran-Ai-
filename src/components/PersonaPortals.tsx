import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Shield, CheckCircle2, UserCheck, HardHat, FileSignature, Truck, Sparkles, 
  IndianRupee, Calendar, TrendingUp, Layers, AlertTriangle, Play, HelpCircle, FileText
} from "lucide-react";
import { CivicIssue, ContractorBid } from "../types";
import { safeConfetti } from "../utils/confetti";

interface PersonaPortalsProps {
  userRole: "Citizen" | "Contractor" | "Corporator";
  issues: CivicIssue[];
  selectedCity: string;
  onPlaceBid: (issueId: string, bidData: { contractorName: string; amount: number; timelineDays: number }) => void;
  onUpdateStatus: (issueId: string, status: any) => void;
  onAddIssue?: (issueData: any) => void;
}

export default function PersonaPortals({
  userRole,
  issues,
  selectedCity,
  onPlaceBid,
  onUpdateStatus,
}: PersonaPortalsProps) {
  // Dispatch Van Simulation States
  const [activeDispatchId, setActiveDispatchId] = useState<string | null>(null);
  const [dispatchProgress, setDispatchProgress] = useState(0);
  const [dispatchStatus, setDispatchStatus] = useState("");
  
  // Local Bid inputs
  const [selectedIssueForBid, setSelectedIssueForBid] = useState<string>("");
  const [bidAmount, setBidAmount] = useState<string>("120000");
  const [bidDays, setBidDays] = useState<number>(3);
  const [contractorName, setContractorName] = useState<string>("Bharat Construction Ltd");

  // Corporator / MLA stats
  const [wardBudget, setWardBudget] = useState<number>(4500000);
  const [citizenSatisfaction, setCitizenSatisfaction] = useState<number>(92);

  // Filter issues of active city that are open/unresolved
  const cityIssues = issues.filter(
    (issue) => issue.location.city.toLowerCase() === selectedCity.toLowerCase()
  );
  const unresolvedIssues = cityIssues.filter((issue) => issue.status !== "Resolved");

  // Start simulated road repair van dispatch
  const startDispatchSimulation = (issueId: string) => {
    if (activeDispatchId) return;
    setActiveDispatchId(issueId);
    setDispatchProgress(0);
    setDispatchStatus("Repair vehicle dispatched from Metropolitan Yard...");

    const interval = setInterval(() => {
      setDispatchProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setDispatchStatus("Asphalt mixture completed! Dual-AI verification passed.");
          setTimeout(() => {
            // Update the issue to Resolved
            onUpdateStatus(issueId, "Resolved");
            setActiveDispatchId(null);
            setDispatchProgress(0);
            safeConfetti({
              particleCount: 80,
              spread: 60,
              origin: { y: 0.7 }
            });
          }, 1200);
          return 100;
        }

        const next = prev + 5;
        if (next === 30) {
          setDispatchStatus("Arrived at coordinates. Safety cones and laser mesh deployed...");
        } else if (next === 65) {
          setDispatchStatus("Hot-mix aggregate poured & leveled by mechanized roller...");
        } else if (next === 85) {
          setDispatchStatus("Applying premium dual-image scanner verification...");
        }
        return next;
      });
    }, 180);
  };

  // Switch to submit tender
  const handleLocalBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIssueForBid) return;
    onPlaceBid(selectedIssueForBid, {
      contractorName,
      amount: Number(bidAmount),
      timelineDays: bidDays
    });
    
    safeConfetti({
      particleCount: 50,
      spread: 50,
      colors: ["#A855F7", "#ffffff"]
    });
    
    alert(`Tender bid of ₹${Number(bidAmount).toLocaleString()} placed successfully! Switch to "MLA Sentry" mode to approve the contract.`);
  };

  // Corporator: Accept contractor bid
  const acceptContractorBid = (issueId: string, bid: any) => {
    // Subtract from ward budget simulated
    setWardBudget((prev) => Math.max(0, prev - bid.amount));
    // Improve satisfaction score
    setCitizenSatisfaction((prev) => Math.min(100, prev + 2));
    
    // Accept the bid and put issue into Work In Progress
    onUpdateStatus(issueId, "Work In Progress");
    
    safeConfetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#34C759", "#0071E3", "#ffffff"]
    });
  };

  return (
    <div className="bg-gradient-to-r from-[#0071E3]/5 to-[#34C759]/5 border border-black/[0.08] dark:border-white/[0.08] rounded-[24px] p-6 shadow-sm relative overflow-hidden">
      
      {/* Background soft color flares */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#A855F7]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#34C759]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner info detailing active portal mode */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-black/[0.06] dark:border-white/[0.06] pb-4">
        <div>
          <div className="flex items-center gap-2">
            {userRole === "Citizen" && (
              <div className="p-2 bg-blue-100 dark:bg-blue-950/40 rounded-xl text-blue-600 dark:text-blue-400">
                <UserCheck className="h-5 w-5" />
              </div>
            )}
            {userRole === "Contractor" && (
              <div className="p-2 bg-purple-100 dark:bg-purple-950/40 rounded-xl text-purple-600 dark:text-purple-400">
                <HardHat className="h-5 w-5" />
              </div>
            )}
            {userRole === "Corporator" && (
              <div className="p-2 bg-emerald-100 dark:bg-emerald-950/40 rounded-xl text-emerald-600 dark:text-emerald-400">
                <FileSignature className="h-5 w-5" />
              </div>
            )}
            
            <div>
              <span className="text-[10px] font-mono font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block leading-none">
                ACTIVE SENTRY PERSPECTIVE
              </span>
              <h3 className="font-sans font-extrabold text-xl text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight mt-0.5">
                {userRole === "Citizen" && "Citizen Sentry Portal"}
                {userRole === "Contractor" && "Infrastructure Contractor Dashboard"}
                {userRole === "Corporator" && "MLA Corporator Decision Hub"}
              </h3>
            </div>
          </div>
          <p className="text-xs text-[#6E6E73] dark:text-[#98989D] mt-1.5 max-w-2xl leading-relaxed">
            {userRole === "Citizen" && "Report disruptions, verify resolution proofs, and trigger automated AI community petitions directly to Ward commissioners."}
            {userRole === "Contractor" && "Bid on municipal tenders, view authorized works, and dispatch robotic asphalt repair vans to complete road patches with real-time tracking."}
            {userRole === "Corporator" && "Manage HSR ward development funds, review predictive storm warnings, and sign smart contracts with contractors on accepted community tenders."}
          </p>
        </div>

        {/* Dynamic State Badge */}
        <div className="shrink-0 flex items-center gap-1.5 bg-black/[0.03] dark:bg-white/[0.05] border border-black/5 dark:border-white/5 py-1 px-3 rounded-full text-[11px] font-mono text-slate-500 dark:text-slate-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>ONLINE MODE: ACTIVE</span>
        </div>
      </div>

      {/* PERSPECTIVE WORKFLOW 1: CITIZEN PORTAL */}
      {userRole === "Citizen" && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          
          {/* Quick Stats card */}
          <div className="md:col-span-4 bg-white dark:bg-[#1C1C1E] border border-black/[0.08] dark:border-white/[0.08] p-5 rounded-2xl flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block font-bold">CITIZEN TRUST VALUE</span>
              <span className="text-3xl font-extrabold text-[#0071E3] mt-1 block">Level 4</span>
              <span className="text-[11px] font-sans text-slate-500 dark:text-slate-400 mt-1 block font-medium">Citizen Karma: <strong>1,240 XP</strong></span>
            </div>
            
            <div className="mt-4 pt-4 border-t border-black/[0.05] dark:border-white/[0.05] space-y-2">
              <div className="flex justify-between text-xs font-sans">
                <span className="text-slate-400">Total reports filed:</span>
                <span className="font-bold">4 active</span>
              </div>
              <div className="flex justify-between text-xs font-sans">
                <span className="text-slate-400">Verification streak:</span>
                <span className="font-bold text-emerald-500">6 successful</span>
              </div>
            </div>
          </div>

          {/* Citizen Actions */}
          <div className="md:col-span-8 bg-white dark:bg-[#1C1C1E] border border-black/[0.08] dark:border-white/[0.08] p-5 rounded-2xl space-y-4">
            <h4 className="font-sans font-bold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
              Grievance Helper & Dual-Verification Checklist
            </h4>
            
            <div className="space-y-3 font-sans text-xs">
              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-white/[0.02]">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#1D1D1F] dark:text-[#F5F5F7] block">Double check resolved works</span>
                  <span className="text-slate-400 text-[11px] block mt-0.5">When contractors mark tasks as "Resolved", verify with before/after photo sliders to earn double points!</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-white/[0.02]">
                <Sparkles className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#1D1D1F] dark:text-[#F5F5F7] block">Draft official RTI grievance letter</span>
                  <span className="text-slate-400 text-[11px] block mt-0.5">Click "Draft Grievance Letter" on any issue in the feed to instantly download or copy pre-structured RTI complaints for municipality submission.</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-[10px] font-mono text-blue-500 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/30 py-1.5 px-3 rounded-lg font-bold block">
                💡 Tip: Click on "Report Issue" in the header menu to file a new smart-extract report!
              </span>
            </div>
          </div>

        </div>
      )}

      {/* PERSPECTIVE WORKFLOW 2: CONTRACTOR PORTAL */}
      {userRole === "Contractor" && (
        <div className="space-y-6">
          
          {/* Dispatch Van Simulation Banner Overlay */}
          <AnimatePresence>
            {activeDispatchId && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-slate-950 border border-purple-500/30 rounded-2xl p-4 text-white overflow-hidden space-y-3 font-sans"
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs font-bold text-purple-400">
                    <Truck className="h-4 w-4 text-purple-400 animate-bounce" />
                    LIVE SENTRY DISPATCH SIMULATOR
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">PROGRESS: {dispatchProgress}%</span>
                </div>

                <p className="text-xs font-mono text-slate-300 bg-white/5 py-1.5 px-3 rounded-lg border border-white/5 leading-tight">
                  {dispatchStatus}
                </p>

                {/* Animated truck road */}
                <div className="relative w-full h-8 bg-slate-900 rounded-lg overflow-hidden flex items-center px-4">
                  {/* Road centerline dashes */}
                  <div className="absolute left-0 right-0 h-[1px] border-t border-dashed border-white/25 top-1/2" />
                  
                  {/* Simulated Moving Truck */}
                  <motion.div
                    className="absolute"
                    style={{ left: `${dispatchProgress}%` }}
                  >
                    <Truck className="h-5 w-5 text-purple-400 drop-shadow-[0_0_8px_#a855f7]" />
                  </motion.div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 transition-all duration-200" style={{ width: `${dispatchProgress}%` }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            
            {/* Left Col: Open Tenders & Placement Form */}
            <div className="md:col-span-6 bg-white dark:bg-[#1C1C1E] border border-black/[0.08] dark:border-white/[0.08] p-5 rounded-2xl">
              <h4 className="font-sans font-bold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4">
                Place Tender Bid
              </h4>

              <form onSubmit={handleLocalBidSubmit} className="space-y-4 font-sans text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Select Active Incident Ward</label>
                  <select
                    value={selectedIssueForBid}
                    onChange={(e) => setSelectedIssueForBid(e.target.value)}
                    required
                    className="w-full bg-[#F5F5F7] dark:bg-white/5 border border-black/[0.08] dark:border-white/10 rounded-xl p-2.5 font-bold"
                  >
                    <option value="">-- Choose open issue --</option>
                    {unresolvedIssues.map((iss) => (
                      <option key={iss.id} value={iss.id}>
                        {iss.title} ({iss.location.ward})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1 font-bold">Contractor Name</label>
                    <input
                      type="text"
                      value={contractorName}
                      onChange={(e) => setContractorName(e.target.value)}
                      required
                      className="w-full bg-[#F5F5F7] dark:bg-white/5 border border-black/[0.08] dark:border-white/10 rounded-xl p-2.5"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-bold">Bid Amount (₹)</label>
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      required
                      className="w-full bg-[#F5F5F7] dark:bg-white/5 border border-black/[0.08] dark:border-white/10 rounded-xl p-2.5"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1 font-bold">Timeline (Days)</label>
                    <input
                      type="number"
                      value={bidDays}
                      onChange={(e) => setBidDays(e.target.value ? Number(e.target.value) : 1)}
                      required
                      className="w-full bg-[#F5F5F7] dark:bg-white/5 border border-black/[0.08] dark:border-white/10 rounded-xl p-2.5"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      disabled={!selectedIssueForBid}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-4 rounded-xl transition cursor-pointer disabled:opacity-40"
                    >
                      Submit Bid Tender
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Right Col: Active Road Repairs Dispatch List */}
            <div className="md:col-span-6 bg-white dark:bg-[#1C1C1E] border border-black/[0.08] dark:border-white/[0.08] p-5 rounded-2xl flex flex-col justify-between">
              <div>
                <h4 className="font-sans font-bold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
                  Quick Sentry Work Order Dispatcher
                </h4>
                <p className="text-[11px] text-slate-400 mb-4">
                  For issues with approved bids or active status, trigger live simulated robotic repair van patching.
                </p>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {cityIssues.filter(iss => iss.status !== "Resolved").map((iss) => {
                    const hasBids = iss.bids && iss.bids.length > 0;
                    return (
                      <div 
                        key={iss.id} 
                        className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.05]"
                      >
                        <div>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">{iss.title}</span>
                          <span className="text-[10px] font-mono text-slate-400">Status: {iss.status}</span>
                        </div>

                        <button
                          onClick={() => startDispatchSimulation(iss.id)}
                          disabled={activeDispatchId !== null}
                          className="bg-purple-600/10 hover:bg-purple-600 text-purple-600 hover:text-white border border-purple-500/20 py-1 px-3 rounded-lg text-[11px] font-bold cursor-pointer transition flex items-center gap-1 shrink-0 disabled:opacity-45"
                        >
                          <Play className="h-3 w-3 shrink-0" /> Dispatch Van
                        </button>
                      </div>
                    );
                  })}

                  {cityIssues.filter(iss => iss.status !== "Resolved").length === 0 && (
                    <p className="text-xs text-slate-400 italic text-center py-4">All municipal road defects are successfully resolved!</p>
                  )}
                </div>
              </div>

              <div className="text-[10px] text-amber-500 bg-amber-500/5 p-2 rounded-lg border border-amber-500/15 mt-3 leading-tight">
                ⚠️ Note: Switch to "MLA Sentry" mode if you want to immediately sign contracts and fund the contractor bids.
              </div>
            </div>

          </div>
        </div>
      )}

      {/* PERSPECTIVE WORKFLOW 3: CORPORATOR PORTAL */}
      {userRole === "Corporator" && (
        <div className="space-y-6">
          
          {/* Dashboard Stats Panel */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-[#1C1C1E] border border-black/[0.08] dark:border-white/[0.08] p-4 rounded-xl">
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block font-bold">WARD DEV FUND</span>
              <span className="text-lg font-extrabold text-[#34C759] mt-1 block">₹{wardBudget.toLocaleString()}</span>
              <span className="text-[9.5px] text-slate-400 font-mono mt-0.5 block">Allocated MCGM Smart Mesh</span>
            </div>

            <div className="bg-white dark:bg-[#1C1C1E] border border-black/[0.08] dark:border-white/[0.08] p-4 rounded-xl">
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block font-bold">CITIZEN SATISFACTION</span>
              <span className="text-lg font-extrabold text-blue-500 mt-1 block">{citizenSatisfaction}%</span>
              <span className="text-[9.5px] text-slate-400 font-mono mt-0.5 block">+1.2% this week</span>
            </div>

            <div className="bg-white dark:bg-[#1C1C1E] border border-black/[0.08] dark:border-white/[0.08] p-4 rounded-xl">
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block font-bold">PENDING TENDERS</span>
              <span className="text-lg font-extrabold text-amber-500 mt-1 block">
                {cityIssues.filter(iss => iss.bids && iss.bids.length > 0 && iss.status !== "Resolved").length} open
              </span>
              <span className="text-[9.5px] text-slate-400 font-mono mt-0.5 block">Contractor bids submitted</span>
            </div>

            <div className="bg-white dark:bg-[#1C1C1E] border border-black/[0.08] dark:border-white/[0.08] p-4 rounded-xl">
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block font-bold">DECISION TIME (SLA)</span>
              <span className="text-lg font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] mt-1 block">1.8 Hours</span>
              <span className="text-[9.5px] text-[#34C759] font-mono font-bold mt-0.5 block">Rank #3 Citywide</span>
            </div>
          </div>

          {/* Pending Bids Action Board */}
          <div className="bg-white dark:bg-[#1C1C1E] border border-black/[0.08] dark:border-white/[0.08] p-5 rounded-2xl">
            <h4 className="font-sans font-bold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4">
              Decentralized Bids Approval board (RTI Compliant)
            </h4>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {cityIssues.filter(iss => iss.status !== "Resolved").map((iss) => {
                const bidsList = iss.bids || [];
                return (
                  <div 
                    key={iss.id} 
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.05]"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/[0.04] dark:border-white/[0.04] pb-2.5 mb-2.5">
                      <div>
                        <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block">{iss.title}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">📍 Location: {iss.location.address} &bull; Ward: {iss.location.ward}</span>
                      </div>
                      
                      <span className={`text-[9.5px] font-mono font-bold py-0.5 px-2 rounded-full uppercase shrink-0 ${
                        iss.severity === "Critical" 
                          ? "bg-red-500/15 text-red-500" 
                          : "bg-amber-500/15 text-amber-500"
                      }`}>
                        {iss.severity} Priority
                      </span>
                    </div>

                    {/* Bids list inside this issue */}
                    <div className="space-y-2">
                      {bidsList.map((bid) => (
                        <div 
                          key={bid.id} 
                          className="flex justify-between items-center p-2 rounded-lg bg-white dark:bg-black/20 border border-black/5 dark:border-white/5 font-sans text-xs"
                        >
                          <div>
                            <span className="font-bold text-[#1D1D1F] dark:text-[#F5F5F7] block">{bid.contractorName}</span>
                            <div className="flex items-center gap-2 text-[10.5px] text-slate-400 mt-0.5">
                              <span className="flex items-center gap-0.5 text-emerald-500 font-semibold">
                                <IndianRupee className="h-3 w-3" /> {bid.amount.toLocaleString()}
                              </span>
                              <span>&bull;</span>
                              <span className="flex items-center gap-0.5">
                                <Calendar className="h-3 w-3" /> {bid.timelineDays} Days
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => acceptContractorBid(iss.id, bid)}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-1.5 px-3.5 rounded-lg text-[10.5px] cursor-pointer transition shadow-sm shrink-0"
                          >
                            Approve Contract
                          </button>
                        </div>
                      ))}

                      {bidsList.length === 0 && (
                        <p className="text-[11px] text-slate-400 italic py-1">No contractor tenders filed on this alert yet. Switch to "Contractor" mode to file a tender.</p>
                      )}
                    </div>
                  </div>
                );
              })}

              {cityIssues.filter(iss => iss.status !== "Resolved").length === 0 && (
                <p className="text-xs text-slate-400 italic text-center py-4">No pending civic issues currently require contract signing in this ward.</p>
              )}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
