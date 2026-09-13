import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  MapPin, 
  Building2, 
  DollarSign, 
  ExternalLink, 
  Sparkles, 
  Info, 
  X, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { fetchOpportunities, fetchExplainableMatch } from '../services/api';

export default function OpportunityEngine() {
  const [filter, setFilter] = useState('All');
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const res = await fetchOpportunities(filter);
      setOpportunities(res.opportunities || []);
      setLoading(false);
    }
    loadData();
  }, [filter]);

  const categories = [
    "All", 
    "Jobs", 
    "Internships", 
    "Hackathons", 
    "Research", 
    "Open Source", 
    "Startups", 
    "Certifications"
  ];

  const handleOpenExplainable = async (job) => {
    setModalLoading(true);
    try {
      const matchDetails = await fetchExplainableMatch(job.title);
      setSelectedMatch({ ...matchDetails, rawJob: job });
    } catch (err) {
      console.error(err);
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-950/80 border border-teal-500/40 flex items-center justify-center text-teal-400">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>Opportunity Engine — Multi-Tier Aggregator</span>
              <span className="text-[10px] bg-teal-950 text-teal-300 px-2 py-0.5 rounded border border-teal-500/30 font-semibold">
                8 Opportunity Streams
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Jobs, Internships, Hackathons, Research, Open Source, and Fellowships with Explainable 5-Factor Matching.
            </p>
          </div>
        </div>

        {/* 8 Opportunity Stream Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                filter === c
                  ? 'bg-teal-600 text-white shadow-glow-cyan'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Opportunities */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {opportunities.map((item) => {
          const match = item.match_score || 85;
          return (
            <div
              key={item.id}
              className="glass-card rounded-2xl p-4 border border-slate-800/80 hover:border-teal-500/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {item.type || 'Opportunity'}
                  </span>
                  <button
                    onClick={() => handleOpenExplainable(item)}
                    className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-bold hover:scale-105 transition-transform cursor-pointer"
                    title="Click for Explainable 5-Factor Match Breakdown"
                  >
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span>{match}% Match</span>
                    <Info className="w-3 h-3 text-emerald-400 ml-0.5" />
                  </button>
                </div>

                <h4 className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors">
                  {item.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>{item.company}</span>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400 mt-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    {item.location}
                  </span>
                  <span className="flex items-center gap-1 text-teal-400 font-semibold">
                    <DollarSign className="w-3 h-3" />
                    {item.stipend}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-1">
                  {(item.tags || []).slice(0, 4).map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-slate-300 border border-slate-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => handleOpenExplainable(item)}
                  className="text-[11px] text-indigo-400 font-semibold hover:underline flex items-center gap-1"
                >
                  <span>Why Match?</span>
                </button>
                <a
                  href={item.apply_url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs font-bold text-teal-400 hover:text-teal-300 transition-colors"
                >
                  <span>Apply Now</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* EXPLAINABLE MATCH MODAL */}
      {selectedMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-[#0b0f19] border border-slate-800 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400">Explainable AI Match</span>
                <h4 className="text-sm font-bold text-white">{selectedMatch.job_title}</h4>
              </div>
              <button
                onClick={() => setSelectedMatch(null)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Overall Score Circle */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between mb-4">
              <div>
                <span className="text-xs text-slate-400 block">Overall Alignment</span>
                <span className="text-2xl font-black text-emerald-400">{selectedMatch.overall_match}% Match</span>
              </div>
              <span className="text-xs text-slate-300 font-semibold">High Probability of Interview</span>
            </div>

            {/* 5 Factors Breakdown */}
            <div className="space-y-2 mb-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase">5-Factor Scoring Breakdown:</span>
              {[
                { name: "Skills Match", val: selectedMatch.factors?.skills || 92 },
                { name: "Project Relevance", val: selectedMatch.factors?.projects || 84 },
                { name: "Education Benchmark", val: selectedMatch.factors?.education || 90 },
                { name: "Experience Alignment", val: selectedMatch.factors?.experience || 65 },
                { name: "Career Interest Fit", val: selectedMatch.factors?.career_interest || 95 }
              ].map((f, i) => (
                <div key={i} className="flex justify-between items-center text-xs">
                  <span className="text-slate-300">{f.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-28 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${f.val}%` }} />
                    </div>
                    <span className="font-bold text-white w-8 text-right">{f.val}%</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Missing Skills Warning */}
            {selectedMatch.missing_skills && selectedMatch.missing_skills.length > 0 && (
              <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 text-xs mb-4">
                <span className="font-bold text-rose-400 block mb-1">Missing Prerequisite Skills:</span>
                <div className="flex gap-2">
                  {selectedMatch.missing_skills.map((ms, mi) => (
                    <span key={mi} className="text-[11px] bg-rose-950 text-rose-300 px-2 py-0.5 rounded border border-rose-500/40">
                      🔴 {ms}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Why Recommended */}
            <div className="space-y-1 text-xs text-slate-300 mb-5">
              <span className="font-bold text-indigo-400 block mb-1">Why Recommended?</span>
              {(selectedMatch.why_recommended || []).map((rec, ri) => (
                <div key={ri} className="flex items-center gap-1.5 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedMatch(null)}
              className="w-full py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Close Match Breakdown
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
