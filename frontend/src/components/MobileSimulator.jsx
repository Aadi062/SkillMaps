import React, { useState } from 'react';
import { 
  Smartphone, 
  ChevronLeft, 
  ChevronRight, 
  Battery, 
  Wifi, 
  Signal, 
  Dna, 
  LayoutDashboard, 
  Layers, 
  FolderKanban, 
  Mic2, 
  Compass,
  ArrowRight,
  Sparkles,
  Award
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from 'recharts';

export default function MobileSimulator({ profile, skillGaps, opportunities }) {
  const [activeScreen, setActiveScreen] = useState('dashboard');

  const screens = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'dna', label: 'Career DNA', icon: Dna },
    { id: 'skillgap', label: 'Skill Gap', icon: Layers },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'interview', label: 'Interview', icon: Mic2 },
    { id: 'opportunities', label: 'Opportunities', icon: Compass },
  ];

  const radarData = [
    { subject: 'Problem Solving', score: 88 },
    { subject: 'Programming', score: 92 },
    { subject: 'Data Analysis', score: 76 },
    { subject: 'Creativity', score: 70 },
    { subject: 'Communication', score: 65 },
    { subject: 'Leadership', score: 60 },
  ];

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800/80">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold tracking-wider text-slate-100 uppercase">
              Mobile App Preview (PWA)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Experience the 6 core mobile Figma screens built as a responsive Progressive Web App
          </p>
        </div>

        {/* Screen Switcher Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {screens.map((s) => {
            const Icon = s.icon;
            const isCurrent = activeScreen === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActiveScreen(s.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isCurrent
                    ? 'bg-indigo-600 text-white shadow-glow-indigo'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Realistic Mobile Phone Frame Mockup */}
      <div className="flex justify-center items-center py-2">
        <div className="relative w-[340px] h-[680px] bg-[#090d18] rounded-[42px] border-[6px] border-slate-700 shadow-2xl overflow-hidden flex flex-col">
          {/* Top Speaker & Camera Notch */}
          <div className="w-full bg-[#090d18] pt-3 px-6 pb-2 flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800/50">
            <span className="font-bold text-white">9:41</span>
            <div className="w-24 h-4 bg-slate-900 rounded-full flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700" />
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Phone Screen Content (scrollable) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-slate-100 bg-[#070b14]">
            {/* SCREEN 1: DASHBOARD */}
            {activeScreen === 'dashboard' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">Dashboard</h4>
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>

                {/* Readiness Circle */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
                  <div className="relative w-24 h-24 mx-auto flex items-center justify-center my-2">
                    <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-800"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-emerald-400"
                        strokeDasharray="82, 100"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-2xl font-black text-white">82</span>
                      <span className="text-[9px] text-slate-400 block -mt-1">/100</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-400">Career Readiness</span>
                </div>

                {/* 3 mini cards */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                    <span className="text-slate-400 text-[10px] block">Skill Match</span>
                    <span className="text-base font-bold text-purple-400">84%</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                    <span className="text-slate-400 text-[10px] block">Projects</span>
                    <span className="text-base font-bold text-cyan-400">5 Done</span>
                  </div>
                </div>

                <button 
                  onClick={() => setActiveScreen('dna')}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-semibold text-white transition-colors"
                >
                  View Analytics →
                </button>
              </div>
            )}

            {/* SCREEN 2: CAREER DNA */}
            {activeScreen === 'dna' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">Career DNA</h4>
                  <span className="text-[10px] text-purple-400 bg-purple-950 px-2 py-0.5 rounded">6-Axis</span>
                </div>

                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="68%" data={radarData}>
                      <PolarGrid stroke="#1e293b" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 8 }} />
                      <Radar dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.5} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-2 text-xs">
                  <span className="text-[11px] font-bold text-slate-300 block">Top Matches</span>
                  <div className="p-2 rounded-lg bg-indigo-950/40 border border-indigo-500/40 flex justify-between">
                    <span>1. Software Engineer</span>
                    <span className="text-emerald-400 font-bold">88%</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex justify-between">
                    <span>2. Data Engineer</span>
                    <span className="text-cyan-400 font-bold">81%</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex justify-between">
                    <span>3. AI/ML Engineer</span>
                    <span className="text-purple-400 font-bold">74%</span>
                  </div>
                </div>
              </div>
            )}

            {/* SCREEN 3: SKILL GAP */}
            {activeScreen === 'skillgap' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">Skill Gap Analysis</h4>
                  <span className="text-[10px] text-amber-400 bg-amber-950 px-2 py-0.5 rounded">SWE</span>
                </div>

                <div className="space-y-2 text-xs">
                  {[
                    { name: "System Design", level: 40, req: 80, gap: "40%" },
                    { name: "Docker", level: 30, req: 70, gap: "40%" },
                    { name: "AWS", level: 35, req: 75, gap: "40%" },
                    { name: "CI/CD", level: 45, req: 70, gap: "25%" },
                    { name: "Kubernetes", level: 20, req: 60, gap: "40%" }
                  ].map((g, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="font-semibold text-slate-200">{g.name}</span>
                        <span className="text-rose-400 font-bold">Gap: {g.gap}</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-amber-400 h-full rounded-full" style={{ width: `${g.level}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => setActiveScreen('dashboard')}
                  className="w-full py-2 bg-indigo-600 rounded-xl text-xs font-semibold text-white"
                >
                  View Roadmap →
                </button>
              </div>
            )}

            {/* SCREEN 4: PROJECTS */}
            {activeScreen === 'projects' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">Projects</h4>
                  <span className="text-[10px] text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded">5 Total</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="flex justify-between mb-1">
                      <span className="font-bold text-white">AI Chatbot</span>
                      <span className="text-[10px] text-emerald-400 font-bold">100%</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mb-2">FastAPI & LangChain Assistant</p>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-400 h-full rounded-full w-full" />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="flex justify-between mb-1">
                      <span className="font-bold text-white">E-Commerce API</span>
                      <span className="text-[10px] text-amber-400 font-bold">60%</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mb-2">Microservices & Redis Cache</p>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-amber-400 h-full rounded-full w-[60%]" />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="flex justify-between mb-1">
                      <span className="font-bold text-white">Portfolio Website</span>
                      <span className="text-[10px] text-cyan-400 font-bold">40%</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mb-2">React PWA & Dark Mode</p>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-cyan-400 h-full rounded-full w-[40%]" />
                    </div>
                  </div>
                </div>

                <button className="w-full py-2 bg-purple-600 hover:bg-purple-500 rounded-xl text-xs font-semibold text-white">
                  + New Project
                </button>
              </div>
            )}

            {/* SCREEN 5: INTERVIEW SIMULATOR */}
            {activeScreen === 'interview' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">Interview Simulator</h4>
                  <span className="text-[10px] text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded">Python Dev</span>
                </div>

                {/* Center score ring */}
                <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-center">
                  <div className="text-3xl font-black text-white">76</div>
                  <div className="text-[10px] text-slate-400">Mock Score / 100</div>
                </div>

                {/* 4 Metrics */}
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[9px]">Technical</span>
                    <span className="font-bold text-emerald-400">82%</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[9px]">Communication</span>
                    <span className="font-bold text-cyan-400">71%</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[9px]">Confidence</span>
                    <span className="font-bold text-amber-400">68%</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[9px]">Completeness</span>
                    <span className="font-bold text-purple-400">78%</span>
                  </div>
                </div>

                <button className="w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-xs font-semibold text-white">
                  Start New Interview
                </button>
              </div>
            )}

            {/* SCREEN 6: OPPORTUNITIES */}
            {activeScreen === 'opportunities' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">Opportunities</h4>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">Matched</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="flex justify-between">
                      <span className="font-bold text-white">Junior Python Developer</span>
                      <span className="text-emerald-400 font-bold">86%</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block">ScaleTech • Remote</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="flex justify-between">
                      <span className="font-bold text-white">Data Analyst Intern</span>
                      <span className="text-cyan-400 font-bold">82%</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block">Deloitte • Bangalore</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="flex justify-between">
                      <span className="font-bold text-white">ML Intern</span>
                      <span className="text-purple-400 font-bold">79%</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block">Microsoft • Hyderabad</span>
                  </div>
                </div>

                <button 
                  onClick={() => setActiveScreen('dashboard')}
                  className="w-full py-2 bg-teal-600 hover:bg-teal-500 rounded-xl text-xs font-semibold text-white"
                >
                  View All Opportunities
                </button>
              </div>
            )}
          </div>

          {/* Bottom Home Indicator Bar */}
          <div className="w-full bg-[#090d18] py-2 flex justify-center border-t border-slate-800/50">
            <div className="w-28 h-1 bg-slate-600 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
