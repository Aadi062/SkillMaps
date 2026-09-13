import React from 'react';
import { 
  Trophy, 
  Code2, 
  Calendar, 
  Rocket, 
  Target, 
  Flame, 
  Award,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function GamificationWidget({ profile }) {
  const level = profile?.level || 4;
  const levelTitle = profile?.level_title || "Builder";
  const xp = profile?.xp || 4820;
  const xpMax = profile?.xp_max || 6000;
  const xpPercent = Math.min(100, Math.round((xp / xpMax) * 100));
  const streak = profile?.streak_days || 12;

  const badges = [
    { id: 'b1', name: 'Top Scorer', icon: Trophy, color: 'text-amber-400 bg-amber-950/60 border-amber-500/40' },
    { id: 'b2', name: 'Code Master', icon: Code2, color: 'text-cyan-400 bg-cyan-950/60 border-cyan-500/40' },
    { id: 'b3', name: '12-Day Streak', icon: Calendar, color: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40' },
    { id: 'b4', name: 'Fast Learner', icon: Rocket, color: 'text-purple-400 bg-purple-950/60 border-purple-500/40' },
    { id: 'b5', name: 'Verified Pro', icon: Target, color: 'text-indigo-400 bg-indigo-950/60 border-indigo-500/40' },
  ];

  const handleTriggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 }
    });
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800/80">
      {/* Title */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold tracking-wider text-slate-300 uppercase">
          Gamification
        </h3>
        <span className="text-[10px] text-amber-400 font-semibold flex items-center gap-1">
          <Flame className="w-3.5 h-3.5 fill-amber-400" />
          {streak} Day Streak
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Level Shield Badge */}
        <div 
          onClick={handleTriggerCelebration}
          className="cursor-pointer group relative flex flex-col items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-b from-indigo-900/60 via-purple-950/50 to-slate-900 border-2 border-indigo-500/50 shadow-glow-indigo transition-transform hover:scale-105"
        >
          <span className="text-[10px] uppercase font-bold text-indigo-300 tracking-wider">LEVEL</span>
          <span className="text-3xl font-black text-white">{level}</span>
          <span className="text-[10px] font-semibold text-amber-400 mt-0.5">{levelTitle}</span>
        </div>

        {/* XP Progress & Badges */}
        <div className="flex-1 w-full">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400 font-medium">XP Progress</span>
            <span className="text-white font-bold">
              {xp.toLocaleString()} <span className="text-slate-500 font-normal">/ {xpMax.toLocaleString()} XP</span>
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-800/80 h-2.5 rounded-full overflow-hidden border border-slate-700/50">
            <div 
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 h-full rounded-full transition-all duration-700" 
              style={{ width: `${xpPercent}%` }} 
            />
          </div>

          {/* Badges List */}
          <div className="mt-3.5 flex items-center gap-2">
            {badges.map((b) => {
              const Icon = b.icon;
              return (
                <div
                  key={b.id}
                  title={b.name}
                  onClick={handleTriggerCelebration}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-transform hover:scale-110 cursor-pointer ${b.color}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
