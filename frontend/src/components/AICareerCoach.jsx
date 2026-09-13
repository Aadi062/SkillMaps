import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  User, 
  HelpCircle, 
  Lightbulb, 
  RefreshCw,
  Box,
  MessageSquare
} from 'lucide-react';
import { sendCoachMessage } from '../services/api';
import Robot3D from './Robot3D';

export default function AICareerCoach({ profile, onNavigateTab }) {
  const [show3D, setShow3D] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'user',
      text: 'What should I learn this month to get an internship?'
    },
    {
      sender: 'bot',
      text: 'Based on your profile, focus on these skills to maximize your internship chances:\n\n• **Data Structures & Algorithms**: Master Arrays, Trees, and Dynamic Programming.\n• **SQL & Database**: Learn indexing, joins, and schema normalization.\n• **System Design Basics**: Understand RESTful APIs, caching, and rate limiting.\n• **Build 2 Projects**: Ship one AI-powered application and one backend API.\n\n*(Reasoning based on 1,245 job postings and your current skill level).*',
      actions: ["Start System Design Week 1-2", "Take DSA Assessment", "Review Opportunities"]
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestedQuestions = [
    "What should I learn this week?",
    "Why am I not matching backend jobs?",
    "Which career is best for me?",
    "Can I apply for this internship?",
    "Review my project"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (customText = null) => {
    const textToSend = (customText || input).trim();
    if (!textToSend || loading) return;

    const newMsgList = [...messages, { sender: 'user', text: textToSend }];
    setMessages(newMsgList);
    setInput('');
    setLoading(true);

    try {
      const response = await sendCoachMessage(textToSend);
      setMessages([
        ...newMsgList,
        {
          sender: 'bot',
          text: response.reply,
          actions: response.suggested_actions || []
        }
      ]);
    } catch (err) {
      setMessages([
        ...newMsgList,
        {
          sender: 'bot',
          text: "I'm analyzing your profile and market benchmarks. What specific role or skill would you like to review?",
          actions: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 flex flex-col h-full">
      {/* Coach Header with the exact Robot Avatar image & 3D Toggle */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500/30 to-indigo-600/40 p-0.5 border border-cyan-400/40 shadow-glow-cyan">
            <img
              src="/bot-avatar.png"
              alt="AI Career Coach Robot"
              className="w-full h-full object-contain rounded-xl drop-shadow-md"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#090d18]" />
          </div>
          <div>
            <h3 className="text-xs font-bold tracking-wider text-slate-200 uppercase flex items-center gap-1.5">
              <span>AI Career Coach</span>
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            </h3>
            <p className="text-[11px] text-slate-400">
              Trained on 1,245 live job postings
            </p>
          </div>
        </div>

        {/* 3D Mode Toggle Button */}
        <button
          onClick={() => setShow3D(!show3D)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
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

      {/* If 3D Mode is active, render the movable 3D WebGL robot right inside the coach panel! */}
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
          {/* Quick Suggestion Chips */}
          <div className="mb-3 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="text-[10px] whitespace-nowrap bg-slate-800/70 hover:bg-slate-700/80 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700/60 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Messages Conversation Stream */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[360px] text-xs">
            {messages.map((m, idx) => {
              const isBot = m.sender === 'bot';
              return (
                <div
                  key={idx}
                  className={`flex items-start gap-2.5 ${isBot ? 'justify-start' : 'justify-end'}`}
                >
                  {isBot && (
                    <div className="w-7 h-7 rounded-xl bg-slate-900 border border-cyan-500/40 flex items-center justify-center shrink-0 mt-0.5 overflow-hidden">
                      <img src="/bot-avatar.png" alt="Bot" className="w-6 h-6 object-contain" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed ${
                      isBot
                        ? 'bg-slate-900/90 text-slate-200 border border-slate-800 shadow-sm'
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    }`}
                  >
                    <div className="whitespace-pre-line text-xs font-normal">
                      {m.text}
                    </div>

                    {isBot && m.actions && m.actions.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-slate-800 flex flex-wrap gap-1.5">
                        {m.actions.map((act, actIdx) => (
                          <button
                            key={actIdx}
                            onClick={() => handleSend(act)}
                            className="text-[10px] bg-indigo-950/80 hover:bg-indigo-900/80 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30 transition-colors"
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
                <span className="text-[11px] text-slate-500 ml-1">SkillBot is typing...</span>
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
                placeholder="Ask me anything about your career..."
                className="flex-1 bg-slate-900/90 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="w-9 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white flex items-center justify-center transition-all shadow-glow-indigo"
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
