import React from 'react';
import { 
  Zap, 
  Flame, 
  Shield, 
  Smartphone, 
  Monitor, 
  Download, 
  Bell, 
  Search, 
  Server,
  Sparkles,
  Key,
  Cloud,
  ShieldCheck
} from 'lucide-react';

export default function Header({ 
  profile, 
  viewMode, 
  setViewMode, 
  onOpenReport, 
  onOpenArchitecture,
  onOpenResumeModal,
  onOpenRobot3D,
  onOpenApiKeys,
  onOpenColab,
  onOpenShield
}) {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#090d18]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 shadow-glow-indigo">
            <Zap className="w-5 h-5 text-white fill-white" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                SkillMap <span className="text-indigo-400 font-extrabold">AI</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-500/30 font-semibold">
                PROTOTYPE
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-slate-400">
              Personal Career Intelligence & Readiness Platform
            </p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="hidden lg:flex items-center flex-1 max-w-xs relative mx-4">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search skills, roles, roadmaps..."
            className="w-full bg-slate-900/80 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Center / Right Action Badges */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Streak Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs font-medium">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
            <span className="hidden sm:inline font-semibold">{profile?.streak_days || 12} Day</span>
            <span className="sm:hidden font-semibold">{profile?.streak_days || 12}d</span>
          </div>

          {/* Gamification Level & XP */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-indigo-200 text-xs">
            <Shield className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-white">Lvl {profile?.level || 4} {profile?.level_title || 'Builder'}</span>
            <span className="text-slate-400 text-[11px]">({profile?.xp?.toLocaleString() || '4,820'} XP)</span>
          </div>

          {/* 3D Robot Moderator Button */}
          <button
            onClick={onOpenRobot3D}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/50 rounded-xl transition-all shadow-glow-cyan"
            title="Open Interactive 3D AI Robot Moderator"
          >
            <img src="/bot-avatar.png" alt="Bot" className="w-4 h-4 object-contain" />
            <span className="hidden sm:inline">3D Moderator</span>
          </button>

          {/* Upload / Re-parse Resume Button */}
          <button
            onClick={onOpenResumeModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-300 bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-500/40 rounded-lg transition-all shadow-glow-indigo"
            title="Upload or paste resume to re-evaluate Career DNA"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden md:inline">Upload Resume</span>
          </button>

          {/* Architecture / Cloud Services modal trigger */}
          <button
            onClick={onOpenArchitecture}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-lg transition-colors"
            title="System Architecture & Cloud Tech Stack (Neon, Firebase, FastAPI)"
          >
            <Server className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Architecture</span>
          </button>

          {/* Automatic API Keys Center */}
          <button
            onClick={onOpenApiKeys}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-amber-300 bg-amber-950/50 hover:bg-amber-900/60 border border-amber-500/40 rounded-lg transition-all shadow-glow-amber"
            title="Automated API Keys & Cloud Secrets Center"
          >
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden lg:inline">API Keys (Auto)</span>
          </button>

          {/* Google Colab Integration */}
          <button
            onClick={onOpenColab}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-orange-300 bg-orange-950/50 hover:bg-orange-900/60 border border-orange-500/40 rounded-lg transition-all shadow-glow-amber"
            title="Connect Google Colab (aadifernandes919@gmail.com)"
          >
            <Cloud className="w-3.5 h-3.5 text-orange-400" />
            <span className="hidden lg:inline">Colab</span>
          </button>

          {/* SkillMap Shield Cybersecurity Center */}
          <button
            onClick={onOpenShield}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/70 border border-emerald-500/50 rounded-lg transition-all shadow-glow-emerald"
            title="SkillMap Shield Cybersecurity Center (L7 WAF & Threat Defense Active)"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Shield: Armed</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          </button>

          {/* Mobile Simulator Toggle Button */}
          <button
            onClick={() => setViewMode(viewMode === 'desktop' ? 'mobile' : 'desktop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
              viewMode === 'mobile'
                ? 'bg-purple-600 text-white border-purple-500 shadow-glow-indigo'
                : 'bg-slate-800/80 text-slate-300 hover:text-white border-slate-700'
            }`}
            title="Toggle between Desktop Dashboard and Figma Mobile Preview"
          >
            {viewMode === 'desktop' ? (
              <>
                <Smartphone className="w-3.5 h-3.5 text-purple-400" />
                <span className="hidden sm:inline">Mobile Preview</span>
              </>
            ) : (
              <>
                <Monitor className="w-3.5 h-3.5 text-white" />
                <span className="hidden sm:inline">Desktop View</span>
              </>
            )}
          </button>

          {/* Download Report */}
          <button
            onClick={onOpenReport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg shadow-md transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download Report</span>
          </button>

          {/* Profile Avatar */}
          <div className="relative pl-1">
            <img
              src={profile?.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"}
              alt={profile?.name || "Rajat"}
              className="w-8 h-8 rounded-full border border-indigo-500/50 object-cover ring-2 ring-indigo-600/20"
            />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#090d18] rounded-full" />
          </div>
        </div>
      </div>
    </header>
  );
}
