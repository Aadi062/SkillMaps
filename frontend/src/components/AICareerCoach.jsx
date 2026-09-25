import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  User, 
  HelpCircle, 
  Lightbulb, 
  RefreshCw,
  Box,
  MessageSquare,
  Compass,
  BookOpen,
  Briefcase,
  FileText,
  Mic,
  Code2,
  BarChart3,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';
import { sendCoachMessage } from '../services/api';
import Robot3D from './Robot3D';

const COACH_MODES = [
  { id: 'all', label: 'All', icon: Sparkles },
  { id: 'career', label: '🎯 Career', icon: Compass },
  { id: 'learning', label: '📚 Learning', icon: BookOpen },
  { id: 'jobs', label: '💼 Jobs', icon: Briefcase },
  { id: 'resume', label: '📄 Resume', icon: FileText },
  { id: 'interview', label: '🎤 Interview', icon: Mic },
  { id: 'projects', label: '💻 Projects', icon: Code2 }
];

const SUGGESTIONS_BY_MODE = {
  all: [
    "What should I learn this week?",
    "Why am I not matching backend jobs?",
    "Which career is best for me?",
    "Can I apply for this job?",
    "What should I build?",
    "How do I improve my resume?",
    "Give me an interview.",
    "What am I weak at?",
    "Make me a 3-month plan."
  ],
  career: [
    "Which career is best for me?",
    "Am I ready for this career?",
    "What am I weak at?",
    "Why Backend Developer #1?"
  ],
  learning: [
    "What should I learn this week?",
    "Make me a 3-month plan.",
    "Start Day 1 Docker Basics",
    "What skills should I develop?"
  ],
  jobs: [
    "Why am I not matching backend jobs?",
    "Can I apply for this job?",
    "What job should I apply for?",
    "What skills does ScaleTech require?"
  ],
  resume: [
    "How do I improve my resume?",
    "What is missing from my resume?",
    "Which skills should I highlight?",
    "Make my project description better"
  ],
  interview: [
    "Give me an interview.",
    "Ask me Python questions",
    "Test my technical skills",
    "Why did I get this interview score?"
  ],
  projects: [
    "What should I build?",
    "Review my project",
    "Give me a project based on my skill gap",
    "Add this project to my portfolio"
  ]
};

function renderCoachText(text) {
  return text.split('\n').map((line, lineIndex) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <React.Fragment key={`${line}-${lineIndex}`}>
        {parts.map((part, partIndex) => part.startsWith('**') && part.endsWith('**')
          ? <strong key={partIndex} className="font-bold text-cyan-100">{part.slice(2, -2)}</strong>
          : <React.Fragment key={partIndex}>{part}</React.Fragment>)}
        {lineIndex < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    );
  });
}

export default function AICareerCoach({ profile, onNavigateTab }) {
  const [show3D, setShow3D] = useState(false);
  const [activeMode, setActiveMode] = useState('all');
  const [expandedWhy, setExpandedWhy] = useState({});
  const [robotStatus, setRobotStatus] = useState('🤖 Ready');

  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: `👋 Good evening, ${profile?.name || 'Rajat'}!\n\nYour Career Readiness is currently **${profile?.career_readiness_score || 82}/100**.\n\n🎯 **Your Next Priority**: 🔴 **Docker (40% Level)**\n3 backend jobs you previously couldn't match now require only one additional containerization skill. Want to start this week's Docker challenge?`,
      actions: ["What should I learn this week?", "Why am I not matching backend jobs?", "Which career is best for me?"],
      why: "Continuously calculated by synthesizing your verified Python (92%) and SQL (78%) skills against 1,245 active vacancy postings."
    },
    {
      sender: 'user',
      text: 'What should I learn this month to get an internship?'
    },
    {
      sender: 'bot',
      text: 'Based on your profile, focus on these skills to maximize your internship chances:\n\n• **Data Structures & Algorithms**: Master Arrays, Trees, and Dynamic Programming.\n• **SQL & Database**: Learn indexing, joins, and schema normalization.\n• **System Design Basics**: Understand RESTful APIs, caching, and rate limiting.\n• **Build 2 Projects**: Ship one AI-powered application and one backend API.\n\n*(Reasoning based on 1,245 job postings and your current skill level).*',
      actions: ["Start System Design Week 1-2", "Take DSA Assessment", "Review Opportunities"],
      why: "Internship hiring managers prioritize strong problem-solving fundamentals (DSA) and raw project execution."
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const toggleWhy = (index) => {
    setExpandedWhy(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleSend = async (customText = null) => {
    const textToSend = (customText || input).trim();
    if (!textToSend || loading) return;

    // Check if the user clicked an action that maps to tab navigation
    const lower = textToSend.toLowerCase();
    if (lower.includes("assessment") || lower.includes("quiz")) {
      if (onNavigateTab) onNavigateTab('verification');
    } else if (lower.includes("roadmap")) {
      if (onNavigateTab) onNavigateTab('roadmap');
    } else if (lower.includes("dna") || lower.includes("career match")) {
      if (onNavigateTab) onNavigateTab('careerdna');
    } else if (lower.includes("portfolio")) {
      if (onNavigateTab) onNavigateTab('portfolio');
    } else if (lower.includes("interview")) {
      if (onNavigateTab) onNavigateTab('interview');
    } else if (lower.includes("opportunit") || lower.includes("apply to")) {
      if (onNavigateTab) onNavigateTab('opportunities');
    }

    const newMsgList = [...messages, { sender: 'user', text: textToSend }];
    setMessages(newMsgList);
    setInput('');
    setLoading(true);
    setRobotStatus('🤔 Analyzing Profile & 1,245 Job Postings...');

    try {
      const response = await sendCoachMessage(textToSend);
      setMessages([
        ...newMsgList,
        {
          sender: 'bot',
          text: response.reply,
          actions: response.suggested_actions || [],
          why: response.why || null,
          mode: response.mode || 'career',
          confidence: response.confidence,
          evidence: response.evidence || [],
          followUp: response.follow_up,
          expertise: response.expertise || [],
          reasoning: response.reasoning_framework
        }
      ]);
      setRobotStatus('💡 Recommendation Ready');
      setTimeout(() => setRobotStatus('🤖 Ready'), 4000);
    } catch (err) {
      setMessages([
        ...newMsgList,
        {
          sender: 'bot',
          text: "I'm analyzing your profile and market benchmarks. What specific role, skill, or project would you like to review?",
          actions: ["What should I learn this week?", "What should I build?", "Make me a 3-month plan"]
        }
      ]);
      setRobotStatus('🤖 Ready');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 flex flex-col h-full shadow-2xl">
      {/* Coach Header with Robot Avatar, Status & 3D Toggle */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500/30 to-indigo-600/40 p-0.5 border border-cyan-400/40 shadow-glow-cyan">
            <img
              src="/bot-avatar.png"
              alt="AI Career Coach Robot"
              className="w-full h-full object-contain rounded-xl drop-shadow-md"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#090d18] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold tracking-wider text-white uppercase flex items-center gap-1.5">
                <span>AI Career Coach</span>
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                {robotStatus}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Personalized with Career DNA & 1,245 Live Jobs
            </p>
          </div>
        </div>

        {/* 3D Mode Toggle Button */}
        <button
          onClick={() => setShow3D(!show3D)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
            show3D
              ? 'bg-cyan-600 text-white border-cyan-400 shadow-glow-cyan'
              : 'bg-slate-900/90 text-cyan-300 border-cyan-500/40 hover:bg-slate-800'
          }`}
          title="Toggle interactive 3D Robot view"
        >
          <Box className="w-3.5 h-3.5" />
          <span>{show3D ? "Chat View" : "3D Robot"}</span>
        </button>
      </div>

      {/* 3D Mode View */}
      {show3D ? (
        <div className="flex-1 flex flex-col justify-between py-2">
          <div className="h-64 w-full">
            <Robot3D onNavigateTab={onNavigateTab} isFloating={true} />
          </div>
          <div className="pt-3 border-t border-slate-800/80 text-center">
            <button
              onClick={() => setShow3D(false)}
              className="text-xs text-indigo-400 font-semibold hover:underline"
            >
              ← Back to Chat Conversation
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Coach Mode Selector Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-2 scrollbar-none border-b border-slate-800/50">
            {COACH_MODES.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setActiveMode(mode.id)}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-all shrink-0 ${
                  activeMode === mode.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>

          {/* Mode-Specific Suggested Prompt Chips */}
          <div className="mb-3 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {(SUGGESTIONS_BY_MODE[activeMode] || SUGGESTIONS_BY_MODE.all).map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="text-[10px] whitespace-nowrap bg-slate-800/70 hover:bg-slate-700/80 hover:text-white text-slate-300 px-2.5 py-1 rounded-full border border-slate-700/60 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[380px] text-xs">
            {messages.map((m, idx) => {
              const isBot = m.sender === 'bot';
              return (
                <div
                  key={idx}
                  className={`flex items-start gap-2.5 ${isBot ? 'justify-start' : 'justify-end'}`}
                >
                  {isBot && (
                    <div className="w-7 h-7 rounded-xl bg-slate-900 border border-cyan-500/40 flex items-center justify-center shrink-0 mt-0.5 overflow-hidden shadow-sm">
                      <img src="/bot-avatar.png" alt="Bot" className="w-6 h-6 object-contain" />
                    </div>
                  )}

                  <div
                    className={`max-w-[88%] rounded-2xl px-4 py-3 leading-relaxed ${
                      isBot
                        ? 'bg-slate-900/95 text-slate-200 border border-slate-800 shadow-md'
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    }`}
                  >
                    <div className="text-xs font-normal">{renderCoachText(m.text)}</div>

                    {isBot && (m.confidence || m.evidence?.length > 0) && (
                      <div className="mt-3 grid gap-2 border-t border-cyan-300/10 pt-2">
                        <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-slate-500">
                          <span>Answer confidence</span>
                          <span className="font-bold text-emerald-300">{Math.round((m.confidence || 0) * 100)}%</span>
                        </div>
                        {m.evidence?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {m.evidence.map((signal) => (
                              <span key={signal} className="rounded-md border border-cyan-300/15 bg-cyan-300/5 px-2 py-1 text-[10px] text-cyan-100/65">{signal}</span>
                            ))}
                          </div>
                        )}
                        {m.expertise?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {m.expertise.map((expertise) => (
                              <span key={expertise} className="rounded-md border border-indigo-300/20 bg-indigo-300/10 px-2 py-1 text-[10px] text-indigo-100/75">{expertise}</span>
                            ))}
                          </div>
                        )}
                        {m.reasoning && <div className="text-[10px] text-slate-400">Framework: {m.reasoning}</div>}
                        {m.followUp && <div className="text-[10px] italic text-amber-200/70">{m.followUp}</div>}
                      </div>
                    )}

                    {/* Explainable Why Drawer */}
                    {isBot && m.why && (
                      <div className="mt-2 pt-2 border-t border-slate-800/80">
                        <button
                          onClick={() => toggleWhy(idx)}
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 hover:text-amber-300 transition-colors"
                        >
                          <Lightbulb className="w-3 h-3 text-amber-400" />
                          <span>Why this recommendation?</span>
                          {expandedWhy[idx] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                        {expandedWhy[idx] && (
                          <div className="mt-1.5 p-2 rounded-lg bg-amber-950/30 border border-amber-500/30 text-[11px] text-amber-200 font-sans leading-relaxed">
                            {m.why}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    {isBot && m.actions && m.actions.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                        {m.actions.map((act, actIdx) => (
                          <button
                            key={actIdx}
                            onClick={() => handleSend(act)}
                            className="text-[10px] font-medium bg-indigo-950/80 hover:bg-indigo-900/90 text-indigo-300 hover:text-white px-2.5 py-1 rounded-lg border border-indigo-500/30 transition-all cursor-pointer"
                          >
                            → {act}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {!isBot && (
                    <div className="w-7 h-7 rounded-xl bg-purple-900/60 border border-purple-500/40 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5 text-purple-300" />
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs py-1">
                <img src="/bot-avatar.png" alt="Thinking" className="w-5 h-5 animate-pulse" />
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
                <span className="text-[11px] text-slate-500 ml-1">AI Career Engine synthesizing market data...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="mt-3 pt-3 border-t border-slate-800/80">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2 relative"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about your career, roadmap, or gaps..."
                className="flex-1 bg-slate-900/90 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="w-9 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white flex items-center justify-center transition-all shadow-glow-indigo cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
