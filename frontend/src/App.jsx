import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import StudentJourney from './components/StudentJourney';
import CareerDNARadar from './components/CareerDNARadar';
import SmartDashboard from './components/SmartDashboard';
import GamificationWidget from './components/GamificationWidget';
import AICareerCoach from './components/AICareerCoach';
import MobileSimulator from './components/MobileSimulator';
import ResumeParserModal from './components/ResumeParserModal';
import ArchitectureModal from './components/ArchitectureModal';
import ReportModal from './components/ReportModal';
import InterviewSimulator from './components/InterviewSimulator';
import OpportunityEngine from './components/OpportunityEngine';
import AdaptiveSkillVerification from './components/AdaptiveSkillVerification';
import ProjectQuests from './components/ProjectQuests';
import LivingPortfolio from './components/LivingPortfolio';
import CollegeIntelligence from './components/CollegeIntelligence';
import CareerKnowledgeGraph from './components/CareerKnowledgeGraph';
import Robot3D from './components/Robot3D';
import TextbookReader from './components/TextbookReader';
import ApiKeyManagerModal from './components/ApiKeyManagerModal';
import ColabModal from './components/ColabModal';
import SecurityShieldModal from './components/SecurityShieldModal';

import { 
  fetchProfile, 
  fetchCareerDNA, 
  fetchSkillGaps, 
  fetchRoadmap 
} from './services/api';

import { 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Map, 
  FolderKanban, 
  Briefcase, 
  ArrowRight,
  BarChart3,
  ExternalLink,
  Key,
  Cloud
} from 'lucide-react';

export default function App() {
  const [profile, setProfile] = useState(null);
  const [careerDNA, setCareerDNA] = useState(null);
  const [skillGaps, setSkillGaps] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [viewMode, setViewMode] = useState('desktop'); // 'desktop' or 'mobile'
  
  // Modals
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isFloatingRobotOpen, setIsFloatingRobotOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isColabModalOpen, setIsColabModalOpen] = useState(false);
  const [isShieldModalOpen, setIsShieldModalOpen] = useState(false);

  useEffect(() => {
    async function initData() {
      const [profData, dnaData, gapData, roadData] = await Promise.all([
        fetchProfile(),
        fetchCareerDNA(),
        fetchSkillGaps(),
        fetchRoadmap()
      ]);
      setProfile(profData);
      setCareerDNA(dnaData);
      setSkillGaps(gapData);
      setRoadmap(roadData);
    }
    initData();
  }, []);

  const handleProfileUpdated = (newResult) => {
    if (newResult.new_career_readiness) {
      setProfile((prev) => ({
        ...prev,
        career_readiness_score: newResult.new_career_readiness,
        competencies: newResult.updated_competencies || prev.competencies
      }));
    }
    fetchCareerDNA().then(setCareerDNA);
  };

  const handleQuestClaimed = (claimResult) => {
    setProfile((prev) => ({
      ...prev,
      xp: claimResult.new_total_xp,
      career_readiness_score: claimResult.new_career_readiness,
      projects_completed_count: prev.projects_completed_count + 1
    }));
  };

  const handleVerificationComplete = (verifyResult) => {
    setProfile((prev) => ({
      ...prev,
      career_readiness_score: verifyResult.new_readiness_score,
      xp: prev.xp + 150
    }));
  };

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Platform Header */}
      <Header
        profile={profile}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenReport={() => setIsReportModalOpen(true)}
        onOpenArchitecture={() => setIsArchitectureModalOpen(true)}
        onOpenResumeModal={() => setIsResumeModalOpen(true)}
        onOpenRobot3D={() => setActiveTab('robot3d')}
        onOpenApiKeys={() => setIsApiKeyModalOpen(true)}
        onOpenColab={() => setIsColabModalOpen(true)}
        onOpenShield={() => setIsShieldModalOpen(true)}
      />

      <div className="flex-1 flex w-full">
        {/* Sidebar Navigation */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Workspace Area */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto max-w-[1600px] mx-auto w-full">
          {/* Mobile Simulator Mode */}
          {viewMode === 'mobile' ? (
            <MobileSimulator
              profile={profile}
              skillGaps={skillGaps}
              opportunities={[]}
            />
          ) : (
            <>
              {/* The Complete Student Journey 6-Step Visual Pipeline */}
              <StudentJourney
                activeStepIndex={4}
                onStepClick={(num) => {
                  if (num === 1) setIsResumeModalOpen(true);
                  if (num === 2) setActiveTab('verification');
                  if (num === 3) setActiveTab('careerdna');
                  if (num === 4) setActiveTab('roadmap');
                  if (num === 5) setActiveTab('quests');
                  if (num === 6) setActiveTab('opportunities');
                }}
              />

              {/* 1. DASHBOARD TAB */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
                    {/* Left Column: AI Career DNA & Top Matches + Gamification */}
                    <div className="xl:col-span-4 flex flex-col gap-5">
                      <CareerDNARadar
                        competencies={profile?.competencies}
                        topMatches={careerDNA?.top_matches}
                        onSelectCareer={() => setActiveTab('careerdna')}
                      />
                      <GamificationWidget profile={profile} />
                    </div>

                    {/* Center Column: Smart Dashboard with Multidimensional Index */}
                    <div className="xl:col-span-5 flex flex-col gap-5">
                      <SmartDashboard
                        profile={profile}
                        skillGaps={skillGaps}
                        roadmap={roadmap}
                        onViewSkillGaps={() => setActiveTab('careerdna')}
                        onViewRoadmap={() => setActiveTab('roadmap')}
                        onNavigateTab={(tab) => setActiveTab(tab)}
                      />
                    </div>

                    {/* Right Column: AI Career Coach Chatbot */}
                    <div className="xl:col-span-3">
                      <AICareerCoach profile={profile} onNavigateTab={(tab) => setActiveTab(tab)} />
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW: 3D ROBOT MODERATOR STUDIO */}
              {activeTab === 'robot3d' && (
                <div className="space-y-6">
                  <Robot3D onNavigateTab={(tab) => setActiveTab(tab)} currentTab={activeTab} />
                </div>
              )}

              {/* MASTER TEXTBOOK TAB (10,000+ PAGES) */}
              {activeTab === 'textbook' && (
                <TextbookReader />
              )}

              {/* AUTOMATIC API KEYS TAB */}
              {activeTab === 'apikeys' && (
                <div className="space-y-6">
                  <div className="glass-panel p-8 rounded-3xl border border-amber-500/30 text-center max-w-xl mx-auto space-y-4 shadow-2xl">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
                      <Key className="w-7 h-7" />
                    </div>
                    <h3 className="text-lg font-black text-white">Automated API Key & Cloud Secrets Center</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      All 17 API keys for Firebase, Neon PostgreSQL, OpenAI, Gemini, Remotive, and VAPID have been generated and configured automatically. Zero manual signup or configuration required.
                    </p>
                    <button
                      onClick={() => setIsApiKeyModalOpen(true)}
                      className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 rounded-xl font-bold text-xs shadow-glow-amber transition-all cursor-pointer"
                    >
                      Open Full API Keys Center
                    </button>
                  </div>
                </div>
              )}

              {/* GOOGLE COLAB TAB */}
              {activeTab === 'colab' && (
                <div className="space-y-6">
                  <div className="glass-panel p-8 rounded-3xl border border-orange-500/30 text-center max-w-xl mx-auto space-y-4 shadow-2xl">
                    <div className="w-14 h-14 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 mx-auto">
                      <Cloud className="w-7 h-7" />
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-950/60 border border-orange-500/30 text-orange-300 text-xs font-semibold">
                      <span>Account: aadifernandes919@gmail.com</span>
                    </div>
                    <h3 className="text-lg font-black text-white">Google Colab Cloud Integration</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Run SkillMap AI on free Google Colab T4 GPU hardware with persistent Google Drive storage and 1-click cloud execution.
                    </p>
                    <button
                      onClick={() => setIsColabModalOpen(true)}
                      className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 rounded-xl font-bold text-xs shadow-glow-amber transition-all cursor-pointer"
                    >
                      Open Google Colab Center
                    </button>
                  </div>
                </div>
              )}

              {/* 2. CAREER DNA TAB */}
              {activeTab === 'careerdna' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-5">
                      <CareerDNARadar
                        competencies={profile?.competencies}
                        topMatches={careerDNA?.top_matches}
                      />
                    </div>
                    <div className="lg:col-span-7 glass-panel rounded-2xl p-6 border border-slate-800/80">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                          Full Skill Gap Analysis
                        </h3>
                        <span className="text-xs text-indigo-400 bg-indigo-950 px-2.5 py-1 rounded-lg border border-indigo-500/30">
                          Target: Software Engineer
                        </span>
                      </div>
                      <div className="space-y-4">
                        {(skillGaps?.gaps || []).map((g, i) => (
                          <div key={i} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                            <div className="flex justify-between items-center mb-1.5">
                              <div>
                                <span className="font-bold text-white text-sm">{g.skill}</span>
                                <span className="text-[11px] text-slate-400 ml-2 font-medium">({g.priority} Priority)</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-amber-400 font-bold">{g.current_level}%</span>
                                <span className="text-slate-500">/</span>
                                <span className="text-xs text-slate-300">{g.required_level}%</span>
                                <span className="text-[11px] font-bold text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-500/30">
                                  Gap: {g.gap}%
                                </span>
                              </div>
                            </div>
                            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden mb-2">
                              <div className="bg-gradient-to-r from-amber-500 to-orange-400 h-full rounded-full" style={{ width: `${g.current_level}%` }} />
                            </div>
                            <p className="text-[11px] text-slate-400">
                              <span className="text-indigo-400 font-semibold">Recommended Action:</span> {g.action || "Complete guided hands-on lab and containerize a project."}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. SKILL VERIFICATION TAB */}
              {activeTab === 'verification' && (
                <AdaptiveSkillVerification onVerificationComplete={handleVerificationComplete} />
              )}

              {/* 4. PROJECT QUESTS TAB */}
              {activeTab === 'quests' && (
                <ProjectQuests onQuestClaimed={handleQuestClaimed} />
              )}

              {/* 5. ROADMAP TAB */}
              {activeTab === 'roadmap' && (
                <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <Map className="w-4 h-4 text-indigo-400" />
                        <span>Recommended 10-Week Learning Roadmap</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Closing identified skill gaps in System Design, Docker, AWS, CI/CD, and Kubernetes
                      </p>
                    </div>
                    <span className="text-xs text-emerald-400 bg-emerald-950 px-3 py-1 rounded-lg border border-emerald-500/30 font-semibold">
                      Target: 91% Readiness
                    </span>
                  </div>

                  <div className="space-y-4">
                    {(roadmap?.roadmap || []).map((item, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-xl border transition-all ${
                          item.status === 'In Progress'
                            ? 'bg-indigo-950/30 border-indigo-500/40 shadow-glow-indigo'
                            : 'bg-slate-900/40 border-slate-800'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-black text-indigo-400 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                              {item.week_range}
                            </span>
                            <h4 className="text-sm font-bold text-white">{item.title}</h4>
                          </div>
                          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                            item.status === 'In Progress'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                              : 'bg-slate-800 text-slate-400'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed mb-3">
                          {item.description || "Master core architectural paradigms and implement capstone deliverables."}
                        </p>
                        {item.milestone_project && (
                          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80 text-xs flex items-center justify-between">
                            <span className="text-slate-400 font-medium">
                              🎯 Milestone Project: <strong className="text-indigo-300">{item.milestone_project}</strong>
                            </span>
                            <button 
                              onClick={() => setActiveTab('quests')}
                              className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                            >
                              <span>Start Project Quest</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. PROJECTS TAB */}
              {activeTab === 'projects' && (
                <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <FolderKanban className="w-4 h-4 text-cyan-400" />
                        <span>Project-Based Learning & Proof-of-Work</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Build and deploy projects to earn verified skill badges and power your Career DNA
                      </p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('quests')}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-glow-indigo"
                    >
                      + Browse Project Quests
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      {
                        title: "AI Chatbot",
                        category: "AI / NLP",
                        progress: 100,
                        status: "Completed",
                        description: "Conversational assistant built with FastAPI, LangChain, and React Tailwind PWA.",
                        tech: ["Python", "FastAPI", "React", "Tailwind CSS"]
                      },
                      {
                        title: "E-Commerce API",
                        category: "Backend Systems",
                        progress: 60,
                        status: "In Progress",
                        description: "Scalable RESTful microservices for product catalog, checkout, and Redis caching.",
                        tech: ["FastAPI", "PostgreSQL", "Redis", "Docker"]
                      },
                      {
                        title: "Portfolio Website",
                        category: "Frontend / PWA",
                        progress: 40,
                        status: "In Progress",
                        description: "Interactive developer portfolio with 3D canvas, dark mode, and PWA offline capabilities.",
                        tech: ["React", "Vite", "Tailwind CSS", "PWA"]
                      }
                    ].map((proj, idx) => (
                      <div key={idx} className="glass-card rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] uppercase font-bold text-slate-400">{proj.category}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              proj.progress === 100
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                                : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                            }`}>
                              {proj.progress}%
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-white mb-1">{proj.title}</h4>
                          <p className="text-xs text-slate-400 mb-3">{proj.description}</p>
                          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-3">
                            <div className={`h-full rounded-full ${proj.progress === 100 ? 'bg-emerald-400' : 'bg-amber-400'}`} style={{ width: `${proj.progress}%` }} />
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {proj.tech.map((t, ti) => (
                              <span key={ti} className="text-[10px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-300">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-800/80 flex justify-end">
                          <button className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                            <span>Open Repository</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 7. LIVING PORTFOLIO TAB */}
              {activeTab === 'portfolio' && <LivingPortfolio />}

              {/* 8. OPPORTUNITIES TAB (8 FEEDS) */}
              {activeTab === 'opportunities' && <OpportunityEngine />}

              {/* 9. INTERVIEW PREP TAB */}
              {activeTab === 'interview' && <InterviewSimulator />}

              {/* 10. KNOWLEDGE GRAPH TAB */}
              {activeTab === 'knowledgegraph' && <CareerKnowledgeGraph />}

              {/* 11. COLLEGE / TPO TAB */}
              {activeTab === 'college' && <CollegeIntelligence />}

              {/* 12. ARCHITECTURE TAB */}
              {activeTab === 'architecture' && (
                <div className="space-y-6">
                  <div className="glass-panel rounded-2xl p-6 border border-slate-800/80">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
                      System Architecture & Cloud Integrations
                    </h3>
                    <p className="text-xs text-slate-400 mb-5">
                      Live configuration parameters for Neon.tech PostgreSQL, Firebase Auth & Storage, Render, and Vercel.
                    </p>
                    <button
                      onClick={() => setIsArchitectureModalOpen(true)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-glow-indigo"
                    >
                      Open Full Architectural Blueprint
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Persistent Floating 3D Robot Companion Trigger (Bottom Right) */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
        {/* Expanded 3D Floating Companion Window */}
        {isFloatingRobotOpen && (
          <div className="w-[320px] h-[380px] rounded-3xl bg-[#0b0f19]/95 border border-cyan-500/50 shadow-2xl p-4 flex flex-col justify-between animate-in fade-in slide-in-from-bottom-5 duration-300">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">SkillBot 3D Guide</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setIsFloatingRobotOpen(false);
                    setActiveTab('robot3d');
                  }}
                  className="text-[10px] text-cyan-400 hover:text-cyan-300 px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 font-semibold"
                >
                  Full Screen
                </button>
                <button
                  onClick={() => setIsFloatingRobotOpen(false)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* 3D Robot Canvas in Floating Window */}
            <div className="flex-1 w-full relative">
              <Robot3D
                isFloating={true}
                currentTab={activeTab}
                onNavigateTab={(tab) => {
                  setActiveTab(tab);
                  setIsFloatingRobotOpen(false);
                }}
              />
            </div>
          </div>
        )}

        {/* Floating Avatar Trigger Button */}
        <button
          onClick={() => setIsFloatingRobotOpen(!isFloatingRobotOpen)}
          className="relative group flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-cyan-950 via-indigo-950 to-slate-900 border-2 border-cyan-400/60 shadow-glow-cyan hover:scale-105 active:scale-95 transition-all cursor-pointer"
          title="Talk to SkillBot 3D Guide"
        >
          <div className="relative w-8 h-8 rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center p-0.5">
            <img
              src="/bot-avatar.png"
              alt="3D Robot"
              className="w-full h-full object-contain drop-shadow"
            />
            <div className="absolute top-0 right-0 w-2 h-2 bg-emerald-400 rounded-full" />
          </div>
          <span className="text-xs font-black text-cyan-300 tracking-wide">
            {isFloatingRobotOpen ? "Close 3D" : "SkillBot 3D"}
          </span>
        </button>
      </div>

      {/* MODALS */}
      <ResumeParserModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        onProfileUpdated={handleProfileUpdated}
      />

      <ArchitectureModal
        isOpen={isArchitectureModalOpen}
        onClose={() => setIsArchitectureModalOpen(false)}
      />

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        profile={profile}
        careerDNA={careerDNA}
        skillGaps={skillGaps}
      />

      <ApiKeyManagerModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />

      <ColabModal
        isOpen={isColabModalOpen}
        onClose={() => setIsColabModalOpen(false)}
      />

      <SecurityShieldModal
        isOpen={isShieldModalOpen}
        onClose={() => setIsShieldModalOpen(false)}
      />
    </div>
  );
}
