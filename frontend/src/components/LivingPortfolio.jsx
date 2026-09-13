import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Share2, 
  ExternalLink, 
  CheckCircle2, 
  Award, 
  Sparkles, 
  Globe, 
  GitBranch, 
  Download,
  Copy,
  Check
} from 'lucide-react';
import { fetchLivingPortfolio } from '../services/api';

export default function LivingPortfolio() {
  const [portfolioData, setPortfolioData] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchLivingPortfolio().then(setPortfolioData);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://skillmap.ai/portfolio/rajat-verma");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const student = portfolioData?.student;
  const readiness = portfolioData?.multidimensional_readiness;

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 space-y-6">
      {/* Top Banner with Shareable Link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>Living Career Portfolio</span>
              <span className="text-[10px] bg-purple-950 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">
                Auto-Updating
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              A dynamic, cryptographic record of verified skills, completed project quests, and code assessments.
            </p>
          </div>
        </div>

        {/* Share Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-900 text-slate-200 hover:text-white border border-slate-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Link Copied!" : "Share Public Profile"}</span>
          </button>
        </div>
      </div>

      {/* Student Identity Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900 border border-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <img
            src={student?.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"}
            alt="Rajat"
            className="w-16 h-16 rounded-2xl border-2 border-indigo-500/50 object-cover shadow-lg"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white">{student?.name || "Rajat Verma"}</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Verified Candidate
              </span>
            </div>
            <p className="text-xs text-indigo-300 font-medium">{student?.headline || "Full Stack & AI Engineer Aspirant"}</p>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
              <span>Level 4 Builder</span>
              <span>•</span>
              <span>🔥 12-Day Streak</span>
              <span>•</span>
              <span>IIT/NIT Computer Science</span>
            </div>
          </div>
        </div>

        {/* Big Readiness Ring */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-xs font-bold text-slate-300 block">Multidimensional Readiness</span>
            <span className="text-[11px] text-emerald-400 font-semibold">Top 8% Candidate Percentile</span>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 flex flex-col items-center justify-center shadow-glow-emerald">
            <span className="text-2xl font-black text-white">{readiness?.overall || 82}</span>
            <span className="text-[9px] text-slate-400 block -mt-1">/100</span>
          </div>
        </div>
      </div>

      {/* Verified Skills Matrix (Claimed vs Verified) */}
      <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800">
        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
          Verified Competency Ledger
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {(portfolioData?.verified_skills || []).map((sk, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-white block">{sk.name}</span>
                <span className="text-[10px] text-slate-400">
                  Claimed: <strong className="text-amber-400">{sk.claimed_level || "Intermediate"}</strong>
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold block mb-0.5">
                  Verified {sk.verified_level || "Advanced"}
                </span>
                <span className="text-[10px] text-slate-500">{sk.level}% Score</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Completed Capstone Projects */}
      <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800">
        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
          Proof-of-Work Project Showcase
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: "AI Chatbot & Assistant",
              desc: "Full-stack intelligent chatbot built with FastAPI, LangChain, and React PWA. Integrated with spaCy NLP and live vector stores.",
              tech: ["Python", "FastAPI", "React", "LangChain", "Docker"],
              verified_by: "SkillMap Automated Test Runner"
            },
            {
              title: "Distributed E-Commerce API",
              desc: "High-throughput microservices architecture with PostgreSQL read-replicas, Redis distributed caching, and Docker Compose orchestration.",
              tech: ["FastAPI", "PostgreSQL", "Redis", "Docker", "JWT"],
              verified_by: "System Design Quest Evaluator"
            }
          ].map((proj, pi) => (
            <div key={pi} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <h5 className="text-xs font-bold text-white">{proj.title}</h5>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30 font-medium">
                    Verified ✓
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">{proj.desc}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {proj.tech.map((t, ti) => (
                    <span key={ti} className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                <span>Verified by: {proj.verified_by}</span>
                <span className="text-indigo-400 font-semibold flex items-center gap-1 cursor-pointer hover:underline">
                  <GitBranch className="w-3 h-3" />
                  <span>View Repository</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
