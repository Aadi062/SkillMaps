import React, { useState } from 'react';
import { ArrowRight, Check, Flame, Target, Zap } from 'lucide-react';

const MISSIONS = [
  { id: 'skill', title: 'Close one priority skill gap', detail: 'Run a focused verification sprint', tab: 'verification', xp: 120 },
  { id: 'quest', title: 'Ship one portfolio proof', detail: 'Complete a project quest milestone', tab: 'quests', xp: 180 },
  { id: 'market', title: 'Scan three matched roles', detail: 'Compare live opportunities to your DNA', tab: 'opportunities', xp: 80 },
];

export default function DailyMissionPanel({ profile, onNavigate }) {
  const [completed, setCompleted] = useState([]);
  const progress = Math.round((completed.length / MISSIONS.length) * 100);

  return (
    <section className="glass-panel rounded-2xl border-amber-300/25 p-4 shadow-[0_0_35px_rgba(255,209,102,0.07)] sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="mb-1 flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-amber-200/65">
            <Flame className="h-3.5 w-3.5 text-amber-300" /> Daily operations
          </div>
          <h2 className="text-base font-black text-white sm:text-lg">Your next career advantage</h2>
          <p className="mt-1 text-xs text-slate-300/70">Three small actions convert into visible proof today.</p>
        </div>
        <div className="min-w-[130px] text-right">
          <div className="text-2xl font-black text-amber-200">{progress}%</div>
          <div className="text-[10px] uppercase tracking-widest text-slate-400">mission sync</div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full rounded-full bg-gradient-to-r from-amber-300 to-emerald-300 transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>
      <div className="mt-4 grid gap-2 lg:grid-cols-3">
        {MISSIONS.map((mission) => {
          const isComplete = completed.includes(mission.id);
          return (
            <div key={mission.id} className={`rounded-xl border p-3 transition-colors ${isComplete ? 'border-emerald-300/35 bg-emerald-300/10' : 'border-slate-700/70 bg-slate-950/35'}`}>
              <div className="flex items-start gap-2.5">
                <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${isComplete ? 'border-emerald-300/40 text-emerald-200' : 'border-amber-300/30 text-amber-200'}`}>
                  {isComplete ? <Check className="h-3.5 w-3.5" /> : <Target className="h-3.5 w-3.5" />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white">{mission.title}</div>
                  <div className="mt-1 text-[11px] leading-relaxed text-slate-400">{mission.detail}</div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="flex items-center gap-1 text-[10px] font-bold text-amber-200/75"><Zap className="h-3 w-3" /> +{mission.xp} XP</span>
                <button type="button" onClick={() => { setCompleted((current) => current.includes(mission.id) ? current : [...current, mission.id]); onNavigate(mission.tab); }} className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-cyan-200 hover:text-white">
                  {isComplete ? 'Review' : 'Launch'} <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500">
        <span>Operator: {profile?.name || 'Career Builder'}</span>
        <span>Streak multiplier active</span>
      </div>
    </section>
  );
}
