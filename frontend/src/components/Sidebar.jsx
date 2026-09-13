import React from 'react';
import { 
  LayoutDashboard, 
  Dna, 
  Award, 
  Target, 
  Map, 
  FolderKanban, 
  Globe, 
  Compass, 
  Mic2, 
  Network, 
  Building2, 
  Settings,
  Sparkles,
  Bot,
  BookOpen,
  Key,
  Cloud
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'robot3d', label: '3D AI Moderator', icon: Bot, badge: '3D WebGL' },
    { id: 'textbook', label: 'Master Textbook', icon: BookOpen, badge: '20 Vols' },
    { id: 'colab', label: 'Google Colab', icon: Cloud, badge: 'GPU' },
    { id: 'apikeys', label: 'API Keys (Auto)', icon: Key, badge: '17 Keys' },
    { id: 'careerdna', label: 'Career DNA', icon: Dna },
    { id: 'verification', label: 'Skill Verification', icon: Award, badge: 'Adaptive' },
    { id: 'quests', label: 'Project Quests', icon: Target, badge: '+XP' },
    { id: 'roadmap', label: 'Roadmap', icon: Map, badge: '10 Wks' },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'portfolio', label: 'Living Portfolio', icon: Globe },
    { id: 'opportunities', label: 'Opportunities', icon: Compass, badge: '8 Feeds' },
    { id: 'interview', label: 'Interview Prep', icon: Mic2 },
    { id: 'knowledgegraph', label: 'Knowledge Graph', icon: Network },
    { id: 'college', label: 'College / TPO', icon: Building2, badge: 'B2B' },
    { id: 'architecture', label: 'Architecture', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#090d18] border-r border-slate-800/80 flex flex-col justify-between p-4 shrink-0 hidden md:flex min-h-[calc(100vh-61px)]">
      <div>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600/30 to-purple-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`ml-auto text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                    item.badge === '+XP' 
                      ? 'bg-amber-950 text-amber-300 border-amber-500/30' 
                      : item.badge === 'B2B'
                      ? 'bg-cyan-950 text-cyan-300 border-cyan-500/30'
                      : 'bg-indigo-950 text-indigo-300 border-indigo-500/30'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Career Readiness Guidance Card */}
      <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-b from-indigo-950/40 to-[#0e1526] border border-indigo-500/20 text-center">
        <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-indigo-600/20 text-indigo-400 mb-1.5">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <h4 className="text-xs font-semibold text-white">AI Readiness Target</h4>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Complete a Project Quest to boost readiness score to 89%
        </p>
        <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full" style={{ width: '82%' }} />
        </div>
      </div>
    </aside>
  );
}
