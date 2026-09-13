import React, { useState } from 'react';
import { 
  Mic2, 
  MicOff, 
  Play, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  RefreshCw,
  Loader2
} from 'lucide-react';
import { evaluateInterview } from '../services/api';
import confetti from 'canvas-confetti';

export default function InterviewSimulator() {
  const [selectedRole, setSelectedRole] = useState('Python Developer');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answerText, setAnswerText] = useState(
    "Python handles memory management using an internal reference counting system alongside a generational garbage collector to resolve cyclic references. Objects are allocated on a private heap managed by the Python memory manager."
  );
  const [evaluating, setEvaluating] = useState(false);
  const [evalResult, setEvalResult] = useState({
    role: "Python Developer",
    overall_score: 76,
    metrics: {
      technical: 82,
      communication: 71,
      confidence: 68,
      completeness: 78
    },
    feedback: "Solid technical explanation with good terminology coverage. Work on structuring your response using the STAR method."
  });

  const questions = [
    {
      id: "q1",
      role: "Python Developer",
      text: "How does Python handle memory management and garbage collection internally?"
    },
    {
      id: "q2",
      role: "Python Developer",
      text: "Explain the difference between FastAPI and Flask/Django, and why asynchronous handling matters."
    },
    {
      id: "q3",
      role: "Full Stack Engineer",
      text: "How do you diagnose and resolve rendering bottlenecks in a complex React dashboard?"
    }
  ];

  const handleEvaluate = async () => {
    if (!answerText.trim()) return;
    setEvaluating(true);

    try {
      const q = questions[questionIndex];
      const result = await evaluateInterview(selectedRole, q.id, answerText);
      setEvalResult(result);
      if (result.overall_score >= 75) {
        confetti({
          particleCount: 50,
          spread: 50,
          origin: { y: 0.7 }
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setEvaluating(false);
    }
  };

  const currentQ = questions[questionIndex];

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800/80">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <Mic2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              AI Mock Interview Simulator
            </h3>
            <p className="text-xs text-slate-400">
              Real-time rubric scoring on Technical, Communication, Confidence, and Completeness
            </p>
          </div>
        </div>

        {/* Role Selector */}
        <div className="flex items-center gap-2">
          {["Python Developer", "Full Stack Engineer", "Data Engineer"].map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRole(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedRole === r
                  ? 'bg-purple-600 text-white shadow-glow-indigo'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Question & Answer Area (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Question Box */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold text-purple-400">Question {questionIndex + 1} of {questions.length}</span>
              <span className="text-[11px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">Target: {selectedRole}</span>
            </div>
            <p className="text-sm font-bold text-slate-100">
              "{currentQ.text}"
            </p>
          </div>

          {/* Answer Input Area */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <span>Your Response:</span>
              <span className="text-[11px] text-slate-500">{answerText.split(' ').filter(Boolean).length} words</span>
            </div>
            <textarea
              rows={5}
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder="Type or dictate your technical response here..."
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 leading-relaxed font-sans"
            />
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuestionIndex((questionIndex + 1) % questions.length)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800 transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Next Question</span>
              </button>
            </div>

            <button
              onClick={handleEvaluate}
              disabled={evaluating || !answerText.trim()}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 transition-all shadow-glow-indigo flex items-center gap-2"
            >
              {evaluating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Evaluating Answer...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Evaluate Response</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: 4-Metric Rubric Breakdown (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-gradient-to-b from-indigo-950/30 via-slate-900/60 to-[#0b0f19] border border-indigo-500/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Evaluation Rubric</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30 font-semibold">
                AI Verified
              </span>
            </div>

            {/* Circular / Big Score Indicator */}
            <div className="text-center my-3">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-900/60 to-indigo-950 border border-indigo-500/40 shadow-glow-indigo">
                <span className="text-3xl font-black text-white">{evalResult?.overall_score || 76}</span>
              </div>
              <span className="text-xs font-bold text-slate-300 block mt-2">Overall Mock Score</span>
              <span className="text-[11px] text-slate-500">Benchmark for Junior Hire: 70+</span>
            </div>

            {/* 4 Dimension Bars matching the infographic */}
            <div className="space-y-3 mt-4">
              {[
                { name: "Technical Depth", key: "technical", val: evalResult?.metrics?.technical || 82, color: "from-emerald-500 to-teal-400" },
                { name: "Communication", key: "communication", val: evalResult?.metrics?.communication || 71, color: "from-cyan-500 to-blue-400" },
                { name: "Confidence", key: "confidence", val: evalResult?.metrics?.confidence || 68, color: "from-amber-500 to-orange-400" },
                { name: "Completeness", key: "completeness", val: evalResult?.metrics?.completeness || 78, color: "from-purple-500 to-indigo-400" },
              ].map((m) => (
                <div key={m.key} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">{m.name}</span>
                    <span className="text-slate-200 font-bold">{m.val}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className={`bg-gradient-to-r ${m.color} h-full rounded-full transition-all duration-700`} style={{ width: `${m.val}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Feedback Box */}
          <div className="mt-5 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
            <span className="font-bold text-indigo-400 block mb-1">AI Recommendation:</span>
            {evalResult?.feedback || "Great technical accuracy. Articulate your architecture trade-offs proactively to raise your Communication score."}
          </div>
        </div>
      </div>
    </div>
  );
}
