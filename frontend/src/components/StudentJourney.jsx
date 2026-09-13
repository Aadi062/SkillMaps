import React, { useState } from 'react';
import { 
  UserCheck, 
  BrainCircuit, 
  Target, 
  Layers, 
  Code2, 
  Briefcase,
  ChevronRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default function StudentJourney({ activeStepIndex = 3, onStepClick }) {
  const steps = [
    {
      num: 1,
      title: "Discover Yourself",
      icon: UserCheck,
      color: "from-blue-500 to-cyan-400",
      dotColor: "bg-cyan-400",
      description: "AI analyzes your resume, academics, projects, skills, and interests.",
      status: "completed"
    },
    {
      num: 2,
      title: "Assess & Verify Skills",
      icon: BrainCircuit,
      color: "from-cyan-500 to-teal-400",
      dotColor: "bg-teal-400",
      description: "Adaptive AI tests that evaluate your real skill level and benchmarks.",
      status: "completed"
    },
    {
      num: 3,
      title: "Find Your Best Careers",
      icon: Target,
      color: "from-purple-500 to-indigo-500",
      dotColor: "bg-indigo-400",
      description: "AI predicts the best career paths for you with personalized match scores.",
      status: "completed"
    },
    {
      num: 4,
      title: "Close Skill Gaps",
      icon: Layers,
      color: "from-indigo-500 to-pink-500",
      dotColor: "bg-pink-400",
      description: "Personalized roadmap with hands-on projects, courses, and curated resources.",
      status: "active"
    },
    {
      num: 5,
      title: "Build & Prove Yourself",
      icon: Code2,
      color: "from-pink-500 to-amber-500",
      dotColor: "bg-amber-400",
      description: "Build capstone projects, earn verified badges, and publish your portfolio.",
      status: "upcoming"
    },
    {
      num: 6,
      title: "Get Opportunities",
      icon: Briefcase,
      color: "from-amber-500 to-emerald-400",
      dotColor: "bg-emerald-400",
      description: "Jobs, internships, hackathons, and high-match career opportunities.",
      status: "upcoming"
    }
  ];

  return (
    <div className="w-full glass-panel rounded-2xl p-5 border border-slate-800/80 mb-6 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
          <h2 className="text-xs font-bold tracking-wider text-slate-300 uppercase">
            The Complete Student Journey
          </h2>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <span className="text-indigo-400 font-semibold">Step 4 of 6:</span>
          <span>Closing Critical Skill Gaps</span>
        </div>
      </div>

      {/* 6-Step Visual Pipeline */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted = step.status === "completed";
          const isActive = step.status === "active";

          return (
            <div
              key={step.num}
              onClick={() => onStepClick && onStepClick(step.num)}
              className={`group relative p-3.5 rounded-xl border transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-b from-indigo-950/60 to-[#0e1629] border-indigo-500/60 shadow-glow-indigo'
                  : isCompleted
                  ? 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
                  : 'bg-slate-900/20 border-slate-800/40 opacity-75 hover:opacity-100 hover:border-slate-700'
              }`}
            >
              {/* Step Number & Icon */}
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-1.5">
                  <span className={`text-[11px] font-black px-1.5 py-0.5 rounded ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : isCompleted
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {step.num}
                  </span>
                  {isCompleted && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                </div>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center bg-gradient-to-br ${step.color} shadow-sm`}>
                  <Icon className="w-3.5 h-3.5 text-white" />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xs font-bold text-slate-100 mb-1 group-hover:text-indigo-300 transition-colors">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed">
                {step.description}
              </p>

              {/* Connector Progress Dot (matching the bottom line in the infographic) */}
              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span className={`text-[10px] font-medium capitalize ${
                  isActive ? 'text-indigo-400 font-bold' : isCompleted ? 'text-emerald-400' : 'text-slate-500'
                }`}>
                  {isActive ? 'In Progress' : isCompleted ? 'Verified' : 'Upcoming'}
                </span>
                <div className={`w-2.5 h-2.5 rounded-full ${step.dotColor} ${isActive ? 'animate-pulse ring-2 ring-indigo-400/50' : ''}`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
