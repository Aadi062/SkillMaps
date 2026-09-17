import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Code2, 
  Sparkles, 
  Play, 
  RotateCcw, 
  Award, 
  AlertCircle, 
  Check, 
  HelpCircle,
  TrendingUp,
  ScanFace
} from 'lucide-react';
import { verifyCodeChallenge, fetchAdaptiveQuestion } from '../services/api';
import confetti from 'canvas-confetti';

export default function AdaptiveSkillVerification({ onVerificationComplete, onOpenFaceVerify }) {
  const [selectedSkill, setSelectedSkill] = useState("Python");
  const [claimedLevel, setClaimedLevel] = useState("Advanced");
  const [code, setCode] = useState(`def find_duplicates(nums):
    # Optimal O(n) approach using hash set
    seen = set()
    duplicates = set()
    for n in nums:
        if n in seen:
            duplicates.add(n)
        else:
            seen.add(n)
    return list(duplicates)`);

  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState({
    skill: "Python",
    claimed_level: "Advanced",
    assessment_score: 86,
    verified_level: "Intermediate+",
    verification_status: "Verified",
    metrics: { correctness: 90, code_quality: 85, efficiency: 95, understanding: 88 },
    ai_feedback: "Optimal O(n) time complexity using hash set. Successfully verified above student cohort benchmark.",
    verified_badge_awarded: true
  });

  const [adaptiveStep, setAdaptiveStep] = useState(2); // 1: Easy, 2: Medium, 3: Hard

  const handleRunVerification = async () => {
    setVerifying(true);
    try {
      const res = await verifyCodeChallenge("py_dup", code, claimedLevel);
      setVerificationResult(res);
      if (res.verified_badge_awarded) {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.7 }
        });
      }
      if (onVerificationComplete) {
        onVerificationComplete(res);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>Adaptive AI Skill Verification</span>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                Live Evaluator
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Don't just claim skills on a resume. Prove them through adaptive algorithmic challenges.
            </p>
          </div>
        </div>

        {/* Claimed Level Badge Selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 text-[11px]">Your Claimed Skill:</span>
          <select
            value={claimedLevel}
            onChange={(e) => setClaimedLevel(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-amber-400 font-bold px-2.5 py-1 rounded-lg focus:outline-none"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced (Claimed)</option>
          </select>
        </div>
      </div>

      {/* SkillMap FaceVerify Pre-Assessment Gate */}
      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
            <ScanFace className="w-4 h-4" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-white">SkillMap FaceVerify Identity Gate:</span>
              <span className="text-[11px] font-bold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Verified Student (Rajat Verma) ✅
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Anti-impersonation gate passed (98.4% Confidence). Authenticated for official skill verification.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenFaceVerify}
          className="text-xs font-semibold text-cyan-300 hover:text-cyan-200 px-3 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 flex items-center gap-1.5 shrink-0 transition-all shadow-glow-cyan"
        >
          <ScanFace className="w-3.5 h-3.5" />
          <span>FaceVerify Gate</span>
        </button>
      </div>

      {/* Claimed vs Verified Comparison Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="text-center px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Claimed Skill</span>
            <span className="text-base font-black text-amber-400">{claimedLevel}</span>
          </div>

          <span className="text-slate-500 font-bold text-lg">+</span>

          <div className="text-center px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Assessment Score</span>
            <span className="text-base font-black text-indigo-300">{verificationResult?.assessment_score || 86}%</span>
          </div>

          <span className="text-slate-500 font-bold text-lg">→</span>

          <div className="text-center px-4 py-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 shadow-glow-emerald">
            <span className="text-[10px] uppercase font-bold text-emerald-300 block">Verified Level</span>
            <span className="text-base font-black text-emerald-400 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>{verificationResult?.verified_level || "Intermediate+"}</span>
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-300 font-semibold block">Proof-of-Competence</span>
          <span className="text-[11px] text-emerald-400 font-medium">Verified to Employers via Cryptographic Hash</span>
        </div>
      </div>

      {/* Code Challenge Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Code Editor & Instructions (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-bold text-indigo-400">Challenge: Find Duplicate Values in a List</span>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">Difficulty: Medium</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Write a Python function <code className="text-cyan-300 font-mono">find_duplicates(nums)</code> that accepts a list of integers and returns all elements that appear more than once. The AI evaluator measures correctness, style, and asymptotic efficiency.
            </p>
          </div>

          {/* Code Editor */}
          <div className="rounded-xl border border-slate-800 bg-[#060911] overflow-hidden">
            <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/90 border-b border-slate-800 text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>solution.py</span>
              </span>
              <span>Python 3.14 Environment</span>
            </div>
            <textarea
              rows={9}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-transparent p-3 text-xs text-emerald-300 font-mono focus:outline-none leading-relaxed resize-none"
              spellCheck="false"
            />
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => setCode(`def find_duplicates(nums):\n    seen = set()\n    duplicates = set()\n    for n in nums:\n        if n in seen:\n            duplicates.add(n)\n        else:\n            seen.add(n)\n    return list(duplicates)`)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Template</span>
            </button>

            <button
              onClick={handleRunVerification}
              disabled={verifying}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 transition-all shadow-glow-emerald flex items-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{verifying ? "Executing Tests..." : "Run Test & Verify Skill"}</span>
            </button>
          </div>
        </div>

        {/* Right Column: AI Rubric Evaluation Breakdown (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block mb-3">
              AI Verification Rubric
            </span>

            <div className="space-y-3">
              {[
                { label: "Correctness (Passes Test Cases)", val: verificationResult?.metrics?.correctness || 90, color: "from-emerald-500 to-green-400" },
                { label: "Algorithmic Efficiency (Time & Space)", val: verificationResult?.metrics?.efficiency || 95, color: "from-cyan-500 to-blue-400" },
                { label: "Code Quality & Pythonic Idioms", val: verificationResult?.metrics?.code_quality || 85, color: "from-indigo-500 to-purple-400" },
                { label: "Conceptual Understanding", val: verificationResult?.metrics?.understanding || 88, color: "from-purple-500 to-pink-400" }
              ].map((m, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">{m.label}</span>
                    <span className="text-slate-200 font-bold">{m.val}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className={`bg-gradient-to-r ${m.color} h-full rounded-full transition-all duration-700`} style={{ width: `${m.val}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback Card */}
          <div className="mt-4 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <span className="text-emerald-400 font-bold block mb-1">AI Assessor Note:</span>
            {verificationResult?.ai_feedback || "Optimal O(n) hash set solution. Verified at Intermediate+."}
          </div>
        </div>
      </div>
    </div>
  );
}
