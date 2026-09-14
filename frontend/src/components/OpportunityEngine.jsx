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
  AlertCircle,
  Search,
  Globe2,
  Filter,
  Layers,
  Briefcase
} from 'lucide-react';
import { fetchOpportunities, fetchExplainableMatch } from '../services/api';

const REGIONS = [
  { id: "All", label: "🌍 All Regions" },
  { id: "North America", label: "🇺🇸 North America" },
  { id: "Europe", label: "🇪🇺 Europe" },
  { id: "Asia-Pacific", label: "🇮🇳 Asia-Pacific" },
  { id: "Middle East & Africa", label: "🇦🇪 Middle East & Africa" },
  { id: "Latin America", label: "🇧🇷 Latin America" },
  { id: "Global Remote", label: "🌐 Global Remote" }
];

const DOMAINS = [
  "All Domains",
  "Software Engineering",
  "AI & Machine Learning",
  "Data Engineering & Analytics",
  "Cloud & DevOps",
  "Cybersecurity & Trust",
  "Mobile Engineering",
  "Product, Design & Architecture",
  "Robotics & Embedded IoT",
  "FinTech & Quantitative Finance",
  "Applied Tech (Health, CleanTech, Space)"
];

const STREAM_CATEGORIES = [
  "All", 
  "Full-time", 
  "Remote", 
  "Internship", 
  "Apprenticeship", 
  "Contract"
];

export default function OpportunityEngine() {
  const [filter, setFilter] = useState('All');
  const [regionFilter, setRegionFilter] = useState('All');
  const [domainFilter, setDomainFilter] = useState('All Domains');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [catalogStats, setCatalogStats] = useState({ total: 860, count: 0 });
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const res = await fetchOpportunities({
        category: filter,
        region: regionFilter,
        domain: domainFilter,
        search: searchQuery,
        limit: 120
      });
      setOpportunities(res.opportunities || []);
      setCatalogStats({
        total: res.total_worldwide_jobs || 860,
        count: res.count || (res.opportunities ? res.opportunities.length : 0)
      });
      setLoading(false);
    }
    const timer = setTimeout(() => {
      loadData();
    }, 150);
    return () => clearTimeout(timer);
  }, [filter, regionFilter, domainFilter, searchQuery]);

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
    <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 space-y-6 shadow-2xl">
      {/* Header & Global Stats Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-teal-950/80 border border-teal-500/40 flex items-center justify-center text-teal-400 shadow-glow-cyan">
            <Globe2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Worldwide Job & Opportunity Catalog
              </h3>
              <span className="text-[10px] bg-teal-950 text-teal-300 px-2.5 py-0.5 rounded-full border border-teal-500/40 font-bold">
                {catalogStats.total}+ Global Openings
              </span>
              <span className="text-[10px] bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">
                35+ Countries • 7 Regions
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live engineering vacancies across US, Europe, India, APAC, UAE, and Remote with Explainable 5-Factor Matching.
            </p>
          </div>
        </div>

        {/* Global Search Input */}
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search title, company, skill, country..."
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Row 1: Global Continents / Regions */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Globe2 className="w-3.5 h-3.5 text-teal-400" />
          <span>Filter by Global Region:</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
          {REGIONS.map((r) => (
            <button
              key={r.id}
              onClick={() => setRegionFilter(r.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                regionFilter === r.id
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-slate-950 font-black shadow-glow-cyan'
                  : 'bg-slate-900/90 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Row 2: Tech Domains & Stream Types */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-1">
        <div className="md:col-span-8 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 shrink-0 mr-1 flex items-center gap-1">
            <Layers className="w-3 h-3 text-indigo-400" />
            <span>Domain:</span>
          </span>
          {DOMAINS.map((d) => (
            <button
              key={d}
              onClick={() => setDomainFilter(d)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all ${
                domainFilter === d
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900/80 text-slate-400 border border-slate-800/80 hover:text-white hover:bg-slate-800'
              }`}
            >
              {d.replace(" & Analytics", "").replace(" & Trust", "")}
            </button>
          ))}
        </div>

        <div className="md:col-span-4 flex items-center justify-end gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 shrink-0 mr-1 flex items-center gap-1">
            <Briefcase className="w-3 h-3 text-amber-400" />
            <span>Type:</span>
          </span>
          {STREAM_CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all ${
                filter === c
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-900/80 text-slate-400 border border-slate-800/80 hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Results Counter */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
        <span>
          Showing <strong className="text-white">{opportunities.length}</strong> matching opportunities 
          {catalogStats.count > opportunities.length && ` (of ${catalogStats.count} total matches)`}
        </span>
        <span className="text-[11px] text-teal-400 font-mono">
          Sorted by AI Match Score
        </span>
      </div>

      {/* Grid of Global Opportunities */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
          <Sparkles className="w-6 h-6 text-teal-400 animate-spin" />
          <span>Searching 860+ worldwide vacancies across all countries...</span>
        </div>
      ) : opportunities.length === 0 ? (
        <div className="py-12 text-center text-slate-400 text-xs glass-panel rounded-xl border border-slate-800">
          <p className="text-white font-bold mb-1">No vacancies matching your current filters.</p>
          <p>Try clearing your search query or selecting "All Regions" / "All Domains".</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setRegionFilter('All');
              setDomainFilter('All Domains');
              setFilter('All');
            }}
            className="mt-3 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {opportunities.map((item) => {
            const match = item.match_score || 85;
            return (
              <div
                key={item.id}
                className="glass-card rounded-2xl p-4 border border-slate-800/80 hover:border-teal-500/40 transition-all flex flex-col justify-between group shadow-sm hover:shadow-glow-cyan"
              >
                <div>
                  {/* Card Header: Type Badge, Region & Match Score */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {item.type || 'Full-time'}
                      </span>
                      {item.region && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-teal-950/80 text-teal-300 border border-teal-500/30 font-medium">
                          {item.country || item.region}
                        </span>
                      )}
                      {item.experience_level && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-500/30">
                          {item.experience_level}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleOpenExplainable(item)}
                      className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-bold hover:scale-105 transition-transform cursor-pointer shrink-0"
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
                  <div className="flex items-center gap-2 text-xs text-slate-300 mt-1">
                    <Building2 className="w-3.5 h-3.5 text-teal-400" />
                    <span className="font-semibold">{item.company}</span>
                    <span className="text-[11px] text-slate-500">• {item.category}</span>
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

                  {item.description && (
                    <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}

                  {/* Skills Pills */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {(item.skills_required || item.tags || []).slice(0, 5).map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-slate-300 border border-slate-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <button
                    onClick={() => handleOpenExplainable(item)}
                    className="text-[11px] text-indigo-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Why Match?</span>
                  </button>
                  <a
                    href={item.apply_url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs font-bold text-teal-400 hover:text-teal-300 transition-colors bg-teal-950/60 px-3 py-1 rounded-lg border border-teal-500/30"
                  >
                    <span>Apply Now</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* EXPLAINABLE MATCH MODAL */}
      {selectedMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-[#0b0f19] border border-slate-800 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400">Explainable AI Match</span>
                <h4 className="text-sm font-bold text-white">{selectedMatch.job_title}</h4>
                <p className="text-xs text-slate-400">{selectedMatch.rawJob?.company} • {selectedMatch.rawJob?.location}</p>
              </div>
              <button
                onClick={() => setSelectedMatch(null)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Overall Score Banner */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between mb-4">
              <div>
                <span className="text-xs text-slate-400 block">Overall Alignment</span>
                <span className="text-2xl font-black text-emerald-400">{selectedMatch.overall_match}% Match</span>
              </div>
              <span className="text-xs text-slate-300 font-semibold bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                High Probability of Interview
              </span>
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
                <div className="flex gap-2 flex-wrap">
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
              className="w-full py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Close Match Breakdown
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
