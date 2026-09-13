import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Sparkles, 
  Zap, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  Layers,
  Code2,
  FolderPlus
} from 'lucide-react';
import { fetchProjectQuests, claimProjectQuest } from '../services/api';
import confetti from 'canvas-confetti';

export default function ProjectQuests({ onQuestClaimed }) {
  const [quests, setQuests] = useState([]);
  const [claimedIds, setClaimedIds] = useState(new Set());
  const [claimingId, setClaimingId] = useState(null);

  useEffect(() => {
    fetchProjectQuests().then((data) => setQuests(data.quests || []));
  }, []);

  const handleClaim = async (quest) => {
    setClaimingId(quest.id);
    try {
      const res = await claimProjectQuest(quest.id);
      setClaimedIds((prev) => new Set(prev).add(quest.id));

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      if (onQuestClaimed) {
        onQuestClaimed(res);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setClaimingId(null);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-950/80 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>Project Quests — Proof-of-Work</span>
              <span className="text-[10px] bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30 font-semibold">
                RPG Skill Leveling
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Don't just read documentation. Build real-world capstones to unlock permanent skill boosts and portfolio strength.
            </p>
          </div>
        </div>

        <span className="text-xs text-amber-400 font-bold bg-amber-950/60 px-3 py-1 rounded-lg border border-amber-500/30">
          🔥 Earn up to +500 XP per Quest
        </span>
      </div>

      {/* Quests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {quests.map((quest) => {
          const isClaimed = claimedIds.has(quest.id);
          const isClaiming = claimingId === quest.id;

          return (
            <div
              key={quest.id}
              className={`glass-card rounded-2xl p-5 border transition-all flex flex-col justify-between group ${
                isClaimed
                  ? 'border-emerald-500/50 bg-emerald-950/20'
                  : 'border-slate-800/80 hover:border-indigo-500/50'
              }`}
            >
              <div>
                {/* Header Tag */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-[10px] uppercase font-bold text-indigo-300 px-2 py-0.5 rounded bg-indigo-950/80 border border-indigo-500/30">
                    {quest.category}
                  </span>
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 fill-amber-400" />
                    +{quest.rewards?.xp || 350} XP
                  </span>
                </div>

                {/* Title */}
                <h4 className="text-sm font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                  🎯 {quest.title}
                </h4>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {quest.description}
                </p>

                {/* Required Skills Badges */}
                <div className="mb-4">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">Required Skills:</span>
                  <div className="flex flex-wrap gap-1">
                    {(quest.required_skills || []).map((s, si) => (
                      <span
                        key={si}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Quest Reward Box */}
                <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs mb-4">
                  <span className="text-[11px] font-bold text-indigo-300 block mb-1.5 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    Quest Completion Rewards:
                  </span>
                  <div className="space-y-1 text-[11px]">
                    {(quest.rewards?.skills || []).map((r, ri) => (
                      <div key={ri} className="flex justify-between text-slate-200">
                        <span>{r.skill} Skill Level</span>
                        <span className="font-bold text-emerald-400">+{r.boost} Points</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-slate-200 pt-1 border-t border-indigo-900/50">
                      <span>Portfolio Strength</span>
                      <span className="font-bold text-cyan-400">+{quest.rewards?.portfolio_strength || 12}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div>
                <button
                  onClick={() => handleClaim(quest)}
                  disabled={isClaimed || isClaiming}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    isClaimed
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40 cursor-default'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-glow-indigo'
                  }`}
                >
                  {isClaimed ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Quest Completed & Boost Applied!</span>
                    </>
                  ) : isClaiming ? (
                    <span>Verifying Deliverables...</span>
                  ) : (
                    <>
                      <span>Complete & Claim Rewards</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
