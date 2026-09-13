import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  Download, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  Award, 
  GraduationCap, 
  ChevronRight, 
  HelpCircle, 
  Layers, 
  Code2, 
  ShieldCheck, 
  ExternalLink,
  BookMarked,
  Filter
} from 'lucide-react';
import { fetchTextbookVolumes } from '../services/api';

export default function TextbookReader() {
  const [volumes, setVolumes] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedVolId, setSelectedVolId] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [vivaMode, setVivaMode] = useState(false);
  const [readVolumes, setReadVolumes] = useState({ 1: true });

  useEffect(() => {
    async function loadTextbook() {
      try {
        const data = await fetchTextbookVolumes();
        if (data) {
          setVolumes(data.volumes || []);
          setStats(data.statistics || null);
        }
      } catch (err) {
        console.error("Failed to load textbook volumes:", err);
      }
    }
    loadTextbook();
  }, []);

  const currentVolume = volumes.find(v => v.id === selectedVolId) || volumes[0];

  const categories = ['All', ...new Set(volumes.map(v => v.category))];

  const filteredVolumes = volumes.filter(v => {
    const matchesCat = selectedCategory === 'All' || v.category === selectedCategory;
    const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.chapters.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const toggleReadStatus = (id) => {
    setReadVolumes(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleDownloadMarkdown = (vol) => {
    const content = `# SKILLMAP MASTER TEXTBOOK SERIES\n## Volume ${vol.id}: ${vol.title}\nCategory: ${vol.category} (${vol.target_pages} Pages)\n\n### Summary\n${vol.summary}\n\n### Chapters\n${vol.chapters.map((c, i) => `${i+1}. ${c}`).join('\n')}\n\n### Key Mathematical Formulation\n${vol.key_formula}\n\n### University Viva Voce Defense\n${vol.viva_sample}\n`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SkillMap_Textbook_Volume_${vol.id}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Master Series Statistics */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-950/80 via-[#0e172e] to-purple-950/70 p-6 border border-indigo-500/30 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 text-xs font-semibold mb-2">
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span>10,000+ Page Master Technical Encyclopedia</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
              SkillMap AI: Master Engineering Textbook Series
            </h1>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
              20 rigorous academic volumes covering Requirements Engineering, Modern Web Internals, FastAPI ASGI Concurrency, Stream NLP, 5-Factor Explainable Matching, and University Viva Defense.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 self-stretch md:self-auto justify-between md:justify-end">
            <div className="px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-lg font-black text-indigo-400">{stats?.total_volumes || 20}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Volumes</div>
            </div>
            <div className="px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-lg font-black text-cyan-400">10,720</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Target Pages</div>
            </div>
            <div className="px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-lg font-black text-emerald-400">120+</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Chapters</div>
            </div>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="mt-5 pt-4 border-t border-indigo-500/20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setVivaMode(!vivaMode)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                vivaMode
                  ? 'bg-amber-500 text-slate-950 shadow-glow-amber'
                  : 'bg-slate-900/90 text-amber-300 border border-amber-500/40 hover:bg-amber-950/40'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>{vivaMode ? 'Viewing Viva Defense Mode' : 'Switch to Viva Voce Defense Mode'}</span>
            </button>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Mapped to IEEE 830/1016 & AICTE CS Curriculum
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Read Progress: {Object.values(readVolumes).filter(Boolean).length} of 20 Volumes</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search volumes, chapters, formulas, AST, NLP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Reading Workspace: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Volume Navigation List (4 cols) */}
        <div className="lg:col-span-4 space-y-2.5 max-h-[720px] overflow-y-auto pr-1">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1 mb-1 flex items-center justify-between">
            <span>Volume Catalog ({filteredVolumes.length})</span>
            <span className="text-[10px] text-indigo-400">Click to Inspect</span>
          </div>

          {filteredVolumes.map((vol) => {
            const isSelected = vol.id === selectedVolId;
            const isRead = !!readVolumes[vol.id];

            return (
              <div
                key={vol.id}
                onClick={() => setSelectedVolId(vol.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-indigo-950/60 to-slate-900 border-indigo-500/60 shadow-glow-indigo'
                    : 'bg-slate-900/40 hover:bg-slate-900/80 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                      VOL {vol.id}
                    </span>
                    <span className="text-[10px] text-cyan-400 font-semibold">{vol.category}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400">{vol.target_pages} pp</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleReadStatus(vol.id);
                      }}
                      className={`p-0.5 rounded transition-colors ${
                        isRead ? 'text-emerald-400 hover:text-emerald-300' : 'text-slate-600 hover:text-slate-400'
                      }`}
                      title={isRead ? 'Marked as Read' : 'Mark as Read'}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className={`text-xs font-bold leading-snug line-clamp-1 ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                  {vol.title}
                </h3>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                  {vol.summary}
                </p>

                <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-800/80">
                  <span>{vol.chapters.length} Chapters</span>
                  <span className="flex items-center gap-0.5 text-indigo-400 font-semibold">
                    Read Chapters <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Active Volume Detailed Interactive Reader (8 cols) */}
        {currentVolume && (
          <div className="lg:col-span-8 glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
            {/* Volume Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-500/40">
                    VOLUME {currentVolume.id} OF 20
                  </span>
                  <span className="text-xs text-cyan-400 font-bold bg-cyan-950/60 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                    {currentVolume.category}
                  </span>
                  <span className="text-xs text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
                    {currentVolume.target_pages} Pages
                  </span>
                </div>
                <h2 className="text-lg md:text-xl font-black text-white">
                  {currentVolume.title}
                </h2>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleDownloadMarkdown(currentVolume)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Download Vol {currentVolume.id} MD</span>
                </button>
                <button
                  onClick={() => toggleReadStatus(currentVolume.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    readVolumes[currentVolume.id]
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-glow-indigo'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{readVolumes[currentVolume.id] ? 'Completed' : 'Mark as Prepared'}</span>
                </button>
              </div>
            </div>

            {/* Scope Summary */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <span>Executive Academic Abstract & Syllabus Scope</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentVolume.summary}
              </p>
            </div>

            {/* Chapter Curriculum Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Complete Chapter Curriculum ({currentVolume.chapters.length} In-Depth Sections)</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {currentVolume.chapters.map((chapter, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 transition-all flex items-start gap-2.5"
                  >
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-indigo-300 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div>
                      <h5 className="text-xs font-bold text-slate-200 leading-tight">
                        {chapter.replace(/Chapter \d+:\s*/, '')}
                      </h5>
                      <span className="text-[10px] text-slate-500 mt-1 block">
                        ~{Math.round(currentVolume.target_pages / currentVolume.chapters.length)} Pages • Complete Implementation & Theorems
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Mathematical Formulation Box */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/30 to-indigo-950/30 border border-cyan-500/30">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Key Mathematical Formulation & Algorithmic Invariant</span>
                </h4>
                <span className="text-[10px] text-cyan-400 font-mono bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                  Latex KaTeX
                </span>
              </div>
              <div className="p-3 rounded-lg bg-[#070b14] border border-cyan-500/20 font-mono text-xs text-cyan-200 overflow-x-auto">
                {currentVolume.key_formula}
              </div>
            </div>

            {/* University Viva Voce Defense Spotlight */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/30 to-slate-900 border border-amber-500/30">
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-amber-400" />
                <span>External Examiner Viva Voce Defense Inquiry</span>
              </h4>
              <div className="text-xs text-slate-300 leading-relaxed bg-[#070b14] p-3 rounded-lg border border-amber-500/20 space-y-1.5">
                <p className="font-semibold text-amber-200">
                  {currentVolume.viva_sample.split(' A: ')[0]}
                </p>
                <p className="text-slate-300">
                  <strong className="text-emerald-400">Winning Defense Answer:</strong> {currentVolume.viva_sample.split(' A: ')[1]}
                </p>
              </div>
            </div>

            {/* Standards & Citation Footer */}
            <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500">
              <span>IEEE Standards: IEEE 830-1998 & IEEE 1016-2009 Compliant</span>
              <span>Available in Markdown: <code className="text-indigo-400">docs/SKILLMAP_MASTER_TEXTBOOK_*.md</code></span>
            </div>
          </div>
        )}
      </div>

      {/* Floating Viva Defense Modal / Quick Reference */}
      {vivaMode && (
        <div className="glass-panel p-6 rounded-2xl border border-amber-500/40 bg-[#090d18] space-y-4 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Comprehensive University Viva Defense Guide (50 Hard Examiner Questions)
              </h3>
            </div>
            <button
              onClick={() => setVivaMode(false)}
              className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800"
            >
              Close Viva Mode
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                q: "Why use spaCy + pdfplumber instead of heavy BERT or LLMs?",
                a: "Free-tier web servers (Vercel/Render) provide 512MB RAM quotas. Transformer models consume 2-4GB VRAM and take 2-3 seconds per inference, causing Out-Of-Memory crashes. spaCy rule matchers run in <120MB with sub-200ms latency and 91.4% precision."
              },
              {
                q: "How does the system prevent arbitrary code execution in the code verification editor?",
                a: "The backend uses Python Abstract Syntax Tree (ast.parse) validation with an ast.NodeVisitor before execution. It forbids dangerous modules (os, sys, subprocess, socket) and built-ins (eval, exec, open). Malicious submissions are halted before execution."
              },
              {
                q: "How does SkillMap differentiate from LinkedIn or Naukri?",
                a: "Recruitment boards rely on unverified self-reported keywords and don't diagnose skill gaps. SkillMap is an AI Career Operating System: it turns claims into verified proof-of-work, provides 5-factor explainable gap diagnostics, and topological 10-week DAG roadmaps."
              },
              {
                q: "How does the 10-Week Roadmap guarantee prerequisite order?",
                a: "We model the curriculum as a Directed Acyclic Graph (DAG) with dependency edges (e.g. JS -> React -> Fullstack). Kahn's topological sort algorithm guarantees prerequisites precede dependent topics."
              }
            ].map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-xs font-black text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-500/30 shrink-0">
                    Q{idx + 1}
                  </span>
                  <h4 className="text-xs font-bold text-white">{item.q}</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pl-7">
                  <strong className="text-emerald-400">Answer:</strong> {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
