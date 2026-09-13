import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  BarChart3, 
  Download,
  GraduationCap,
  Sparkles
} from 'lucide-react';
import { fetchTPOAnalytics } from '../services/api';

export default function CollegeIntelligence() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchTPOAnalytics().then(setAnalytics);
  }, []);

  const cohort = analytics?.cohort_readiness_distribution || {
    career_ready_pct: 42,
    nearly_ready_pct: 31,
    skill_gap_pct: 20,
    high_risk_pct: 7
  };

  const missingSkills = analytics?.top_missing_skills || [
    { skill: "Cloud & AWS", missing_pct: 72, affected_students: 1800 },
    { skill: "Data Structures & Algorithms", missing_pct: 61, affected_students: 1525 },
    { skill: "AI / Machine Learning", missing_pct: 58, affected_students: 1450 },
    { skill: "Professional Communication", missing_pct: 51, affected_students: 1275 },
    { skill: "Cybersecurity Fundamentals", missing_pct: 39, affected_students: 975 }
  ];

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>College & TPO Career Intelligence</span>
              <span className="text-[10px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30 font-semibold">
                B2B Institution View
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {analytics?.institution_name || "National Institute of Technology & Engineering"} • 2,500 Students Tracked
            </p>
          </div>
        </div>

        <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-colors">
          <Download className="w-3.5 h-3.5" />
          <span>Export TPO Placement Report</span>
        </button>
      </div>

      {/* 4 Cohort Placement Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
          <span className="text-[11px] font-bold text-slate-400 block mb-1">Career Ready</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-400">{cohort.career_ready_pct}%</span>
            <span className="text-xs text-slate-400">({Math.round(2500 * (cohort.career_ready_pct / 100))} students)</span>
          </div>
          <span className="text-[10px] text-emerald-300 mt-1 block">Tier-1 & Product Ready</span>
        </div>

        <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30">
          <span className="text-[11px] font-bold text-slate-400 block mb-1">Nearly Ready</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-indigo-400">{cohort.nearly_ready_pct}%</span>
            <span className="text-xs text-slate-400">({Math.round(2500 * (cohort.nearly_ready_pct / 100))} students)</span>
          </div>
          <span className="text-[10px] text-indigo-300 mt-1 block">1-2 Quests away</span>
        </div>

        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30">
          <span className="text-[11px] font-bold text-slate-400 block mb-1">Skill Gap Notice</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-400">{cohort.skill_gap_pct}%</span>
            <span className="text-xs text-slate-400">({Math.round(2500 * (cohort.skill_gap_pct / 100))} students)</span>
          </div>
          <span className="text-[10px] text-amber-300 mt-1 block">Needs Roadmap Training</span>
        </div>

        <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/30">
          <span className="text-[11px] font-bold text-slate-400 block mb-1">High Risk</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-rose-400">{cohort.high_risk_pct}%</span>
            <span className="text-xs text-slate-400">({Math.round(2500 * (cohort.high_risk_pct / 100))} students)</span>
          </div>
          <span className="text-[10px] text-rose-300 mt-1 block">Intervention Required</span>
        </div>
      </div>

      {/* Top Missing Institutional Skills */}
      <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Top Institutional Missing Skills (Curriculum Gaps)
            </h4>
            <p className="text-[11px] text-slate-400">
              Aggregated across 2,500 active student verified skill evaluations
            </p>
          </div>
          <span className="text-[10px] text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-500/30">
            Market Benchmark Calibrated
          </span>
        </div>

        <div className="space-y-3">
          {missingSkills.map((item, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-200">{item.skill}</span>
                <span className="text-rose-400 font-bold">
                  {item.missing_pct}% of students missing ({item.affected_students} students)
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-rose-500 to-amber-500 h-full rounded-full" 
                  style={{ width: `${item.missing_pct}%` }} 
                />
              </div>
              {item.recommendation && (
                <p className="text-[11px] text-slate-400 pt-0.5">
                  <strong className="text-indigo-400">TPO Action:</strong> {item.recommendation}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Institutional AI Insight Banner */}
      <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/40 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <span className="font-bold text-white block mb-0.5">Strategic Placement Officer Insight:</span>
          {analytics?.key_institutional_insight || "Placement readiness has improved by +14% since integrating SkillMap Adaptive Skill Verification. The primary bottleneck holding back tier-1 tech offers is Cloud Infrastructure (72% missing) and System Design Basics."}
        </div>
      </div>
    </div>
  );
}
