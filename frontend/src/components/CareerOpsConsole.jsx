import React, { useEffect, useMemo, useState } from 'react';
import { Activity, ArrowUpRight, Cpu, Gauge, Radio, ShieldCheck, Wifi } from 'lucide-react';

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function CareerOpsConsole({ profile, roadmap, onNavigateTab }) {
  const [now, setNow] = useState(() => new Date());
  const readiness = profile?.career_readiness_score || 82;
  const xp = profile?.xp || 4820;
  const roadmapItems = roadmap?.roadmap || [];
  const activeRoadmapItem = roadmapItems.find((item) => item.status === 'In Progress') || roadmapItems[0];

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const signals = useMemo(() => [
    { label: 'Identity', value: 'VERIFIED', score: 98, tone: 'emerald', icon: ShieldCheck },
    { label: 'Skill graph', value: 'SYNCED', score: Math.min(96, readiness + 10), tone: 'cyan', icon: Cpu },
    { label: 'Market fit', value: 'RISING', score: Math.min(94, (profile?.avg_skill_match || 84) + 6), tone: 'amber', icon: Radio },
  ], [profile?.avg_skill_match, readiness]);

  return (
    <section className="glass-panel rounded-2xl border-cyan-300/20 p-4 shadow-[0_0_45px_rgba(89,235,255,0.07)] sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-emerald-200/10 pb-4">
        <div>
          <div className="mb-1 flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-cyan-200/65">
            <Activity className="h-3.5 w-3.5 text-cyan-300" /> Career operations console
          </div>
          <h2 className="text-base font-black text-white sm:text-lg">Your career system is online</h2>
          <p className="mt-1 text-xs text-slate-300/65">Live telemetry from identity, skills, market fit, and your current roadmap.</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-emerald-300/20 bg-emerald-300/5 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-emerald-200">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(126,247,197,0.9)]" />
          <span>Live {formatTime(now)}</span>
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[1.1fr_1fr_1fr]">
        <div className="rounded-xl border border-indigo-300/20 bg-indigo-300/5 p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-indigo-200/60">Readiness index</div>
              <div className="mt-1 text-3xl font-black text-white">{readiness}<span className="text-sm text-slate-400">/100</span></div>
            </div>
            <Gauge className="h-5 w-5 text-indigo-300" />
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-900">
            <div className="h-full rounded-full bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-300" style={{ width: `${readiness}%` }} />
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-slate-400"><span>+6 this cycle</span><span>{xp.toLocaleString()} XP</span></div>
        </div>

        <div className="rounded-xl border border-slate-700/70 bg-slate-950/35 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-[10px] uppercase tracking-widest text-slate-400">Signal health</div>
            <Wifi className="h-4 w-4 text-emerald-300" />
          </div>
          <div className="space-y-2.5">
            {signals.map((signal) => {
              const Icon = signal.icon;
              return (
                <div key={signal.label} className="flex items-center gap-2">
                  <Icon className="h-3.5 w-3.5 text-emerald-200/70" />
                  <span className="w-20 text-[10px] text-slate-300">{signal.label}</span>
                  <div className="flex flex-1 gap-1">
                    {Array.from({ length: 8 }, (_, index) => <span key={index} className={`h-1.5 flex-1 rounded-full ${index < Math.ceil(signal.score / 12.5) ? 'bg-emerald-300' : 'bg-slate-800'}`} />)}
                  </div>
                  <span className="w-14 text-right text-[9px] font-bold text-emerald-300">{signal.value}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-amber-300/20 bg-amber-300/5 p-4">
          <div className="text-[10px] uppercase tracking-widest text-amber-200/60">Current objective</div>
          <div className="mt-2 text-sm font-bold text-white">{activeRoadmapItem?.title || 'Complete your first skill sprint'}</div>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-300/65">The fastest route to a stronger profile is finishing your active roadmap milestone.</p>
          <button type="button" onClick={() => onNavigateTab('roadmap')} className="mt-3 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-200 hover:text-white">
            Open objective <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
