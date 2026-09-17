import React from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Sparkles, 
  TrendingUp, 
  Award, 
  BookOpen, 
  Briefcase, 
  Target,
  Code,
  ShieldCheck,
  ChevronRight,
  ScanFace
} from 'lucide-react';

export default function SmartDashboard({ 
  profile, 
  skillGaps, 
  roadmap, 
  onViewSkillGaps, 
  onViewRoadmap,
  onNavigateTab,
  onOpenFaceVerify
}) {
  const readiness = profile?.career_readiness_score || 82;
  const avgMatch = profile?.avg_skill_match || 84;
  const projectsCount = profile?.projects_completed_count || 5;
  const assessmentsCount = profile?.assessments_taken_count || 18;
  const avgAssessScore = profile?.avg_assessment_score || 78;

  const gapsList = skillGaps?.gaps || [
    { skill: "System Design", current_level: 40, required_level: 80, gap: 40 },
    { skill: "Docker", current_level: 30, required_level: 70, gap: 40 },
    { skill: "AWS", current_level: 35, required_level: 75, gap: 40 },
    { skill: "CI/CD", current_level: 45, required_level: 70, gap: 25 },
    { skill: "Kubernetes", current_level: 20, required_level: 60, gap: 40 },
  ];

  const roadmapItems = roadmap?.roadmap || [
    { week_range: "Week 1-2", title: "System Design Basics", status: "In Progress" },
    { week_range: "Week 3-4", title: "Docker & Containers", status: "Upcoming" },
    { week_range: "Week 5-6", title: "AWS Cloud Practitioner", status: "Upcoming" },
    { week_range: "Week 7-8", title: "CI/CD with GitHub Actions", status: "Upcoming" },
    { week_range: "Week 9-10", title: "Kubernetes Basics", status: "Upcoming" },
  ];

  const pillCapabilities = [
    { label: "AI Powered Career Guidance", tab: "interview", color: "from-blue-500/20 to-indigo-500/20 text-indigo-300" },
    { label: "Real World Skill Assessments", tab: "assessments", color: "from-cyan-500/20 to-teal-500/20 text-cyan-300" },
    { label: "Project Based Learning", tab: "projects", color: "from-emerald-500/20 to-green-500/20 text-emerald-300" },
    { label: "Verified Skills", tab: "careerdna", color: "from-purple-500/20 to-indigo-500/20 text-purple-300" },
    { label: "Portfolio Builder", tab: "portfolio", color: "from-pink-500/20 to-rose-500/20 text-pink-300" },
    { label: "Interview Preparation", tab: "interview", color: "from-amber-500/20 to-orange-500/20 text-amber-300" },
    { label: "Opportunity Engine", tab: "opportunities", color: "from-teal-500/20 to-cyan-500/20 text-teal-300" },
  ];

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 flex flex-col justify-between">
      {/* Greeting Header & Verified Identity Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 p-4 rounded-2xl bg-gradient-to-r from-slate-900/90 via-indigo-950/20 to-slate-900/90 border border-slate-800">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Welcome back, {profile?.name?.split(" ")[0] || "Rajat"}! <span className="animate-bounce inline-block">👋</span>
            </h2>
            <button
              onClick={onOpenFaceVerify}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-xs font-bold shadow-glow-emerald cursor-pointer hover:bg-emerald-900/80 transition-all"
              title="Click to view FaceVerify identity verification checkpoint"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Identity: Verified ✅</span>
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {profile?.headline || "Full Stack & AI Engineer Aspirant"} • Top 8% Candidate Benchmark
          </p>
        </div>

        <button
          onClick={onOpenFaceVerify}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 transition-all shrink-0 hover:border-cyan-500/40 shadow-glow-cyan"
        >
          <ScanFace className="w-4 h-4 text-cyan-400" />
          <span>Biometric ID Center</span>
        </button>
      </div>

      {/* 4 Overview Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
        {/* Metric 1: Career Readiness */}
        <div className="glass-card rounded-xl p-3.5 border border-slate-800/80 relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
          <span className="text-[11px] font-semibold text-slate-400 block mb-2">Career Readiness</span>
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-400 transition-all duration-1000"
                  strokeDasharray={`${readiness}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-base font-black text-white">{readiness}</span>
                <span className="text-[8px] text-slate-400 block -mt-1">/100</span>
              </div>
            </div>
            <div>
              <span className="text-[11px] font-bold text-emerald-400 block">Great progress!</span>
              <span className="text-[10px] text-slate-400">Keep going.</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Skill Match (Avg) */}
        <div className="glass-card rounded-xl p-3.5 border border-slate-800/80 relative overflow-hidden group hover:border-purple-500/40 transition-colors">
          <span className="text-[11px] font-semibold text-slate-400 block mb-2">Skill Match (Avg)</span>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-purple-950/60 border border-purple-500/40 flex items-center justify-center text-purple-300 font-black text-base shadow-glow-indigo">
              {avgMatch}%
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-200 block">Strong fit</span>
              <span className="text-[10px] text-slate-400">Across 12 job roles</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Projects Completed */}
        <div className="glass-card rounded-xl p-3.5 border border-slate-800/80 relative overflow-hidden group hover:border-cyan-500/40 transition-colors">
          <span className="text-[11px] font-semibold text-slate-400 block mb-2">Projects Completed</span>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-black text-xl shadow-glow-cyan">
              {projectsCount}
            </div>
            <div>
              <span className="text-[11px] font-bold text-cyan-400 block">Keep building!</span>
              <span className="text-[10px] text-slate-400">2 In Progress</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Assessments Taken */}
        <div className="glass-card rounded-xl p-3.5 border border-slate-800/80 relative overflow-hidden group hover:border-indigo-500/40 transition-colors">
          <span className="text-[11px] font-semibold text-slate-400 block mb-2">Assessments Taken</span>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-950/60 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-black text-xl shadow-glow-indigo">
              {assessmentsCount}
            </div>
            <div>
              <span className="text-[11px] font-bold text-indigo-400 block">Avg Score: {avgAssessScore}%</span>
              <span className="text-[10px] text-slate-400">Top 10% percentile</span>
            </div>
          </div>
        </div>
      </div>

      {/* Multidimensional Readiness Breakdown & Actionable Diagnosis */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 mb-6 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Multidimensional Career Readiness Index
          </h3>
          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
            7-Factor Score: 82/100
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs">
          {[
            { name: "Technical", score: 88, color: "text-emerald-400" },
            { name: "Projects", score: 79, color: "text-cyan-400" },
            { name: "Problem Solving", score: 85, color: "text-indigo-400" },
            { name: "Communication", score: 67, color: "text-amber-400" },
            { name: "Portfolio", score: 80, color: "text-purple-400" },
            { name: "Interview", score: 72, color: "text-teal-400" },
            { name: "Job Match", score: 91, color: "text-emerald-400" }
          ].map((dim, di) => (
            <div key={di} className="p-2 rounded-lg bg-slate-900 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block">{dim.name}</span>
              <span className={`text-sm font-bold ${dim.color}`}>{dim.score}</span>
            </div>
          ))}
        </div>

        {/* Actionable AI Diagnosis Banner */}
        <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-500/30 text-xs text-amber-300 flex items-center justify-between">
          <span>
            ⚠️ <strong>Actionable AI Diagnosis:</strong> Your lowest factor is <strong>Communication (67%)</strong>. Practice an AI Mock Interview to raise readiness to 89% before applications.
          </span>
          <button 
            onClick={() => onNavigateTab && onNavigateTab('interview')}
            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-black font-bold text-[11px] rounded-lg shrink-0 ml-3 transition-colors"
          >
            Launch Interview
          </button>
        </div>
      </div>

      {/* Middle Section: Skill Gap Overview & Recommended Roadmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        {/* Left Column: Skill Gap Overview */}
        <div className="glass-card rounded-xl p-4 border border-slate-800/80">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-200">Skill Gap Overview</h3>
              <p className="text-[10px] text-slate-400">Target Role: Software Engineer</p>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded bg-amber-500" /> Your Level
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded bg-slate-600" /> Required
              </span>
            </div>
          </div>

          {/* Dual Bar Comparison Rows */}
          <div className="space-y-3 pt-1">
            {gapsList.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">{item.skill}</span>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="text-amber-400 font-bold">{item.current_level}%</span>
                    <span className="text-slate-500">/</span>
                    <span className="text-slate-400">{item.required_level}%</span>
                    <span className="text-[10px] text-rose-400 font-bold bg-rose-950/60 px-1.5 py-0.2 rounded border border-rose-500/20">
                      -{item.gap}%
                    </span>
                  </div>
                </div>
                {/* Horizontal Progress Bars */}
                <div className="relative w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  {/* Required Level Marker */}
                  <div 
                    className="absolute top-0 bottom-0 bg-slate-600/80 rounded-full" 
                    style={{ width: `${item.required_level}%` }}
                  />
                  {/* User Current Level Bar */}
                  <div 
                    className="absolute top-0 bottom-0 bg-gradient-to-r from-amber-500 to-orange-400 rounded-full shadow-sm" 
                    style={{ width: `${item.current_level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* View Full Skill Gap Analysis link */}
          <div className="mt-4 pt-3 border-t border-slate-800/80">
            <button
              onClick={onViewSkillGaps}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 transition-colors group"
            >
              <span>View Full Skill Gap Analysis</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Right Column: Recommended Roadmap */}
        <div className="glass-card rounded-xl p-4 border border-slate-800/80">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-200">Recommended Roadmap</h3>
              <p className="text-[10px] text-slate-400">10-Week Tailored Action Plan</p>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/30">
              Personalized
            </span>
          </div>

          {/* 5 Timeline items */}
          <div className="space-y-2.5 pt-1">
            {roadmapItems.map((item, idx) => {
              const isInProgress = item.status === "In Progress";
              return (
                <div 
                  key={idx}
                  className={`flex items-center justify-between p-2 rounded-lg border text-xs transition-colors ${
                    isInProgress 
                      ? 'bg-indigo-950/40 border-indigo-500/40 text-indigo-200' 
                      : 'bg-slate-900/30 border-slate-800/60 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-[11px] font-bold text-slate-400 min-w-[65px]">
                      {item.week_range}
                    </span>
                    <span className="font-semibold text-slate-200">
                      {item.title}
                    </span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    isInProgress
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40 flex items-center gap-1'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isInProgress && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                    {item.status}
                  </span>
                </div>
              );
            })}
          </div>

          {/* View Full Roadmap link */}
          <div className="mt-4 pt-3 border-t border-slate-800/80">
            <button
              onClick={onViewRoadmap}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 transition-colors group"
            >
              <span>View Full Roadmap</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Feature Shortcuts / Capability Pills */}
      <div className="pt-4 border-t border-slate-800/80">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {pillCapabilities.map((pill, idx) => (
            <button
              key={idx}
              onClick={() => onNavigateTab && onNavigateTab(pill.tab)}
              className={`px-3 py-1.5 rounded-xl border border-slate-800/80 hover:border-slate-700 bg-gradient-to-r ${pill.color} text-xs font-semibold hover:scale-105 transition-all shadow-sm`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
