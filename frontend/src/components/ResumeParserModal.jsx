import React, { useState } from 'react';
import { 
  X, 
  UploadCloud, 
  FileText, 
  CheckCircle, 
  Sparkles, 
  Loader2, 
  Dna,
  ArrowRight
} from 'lucide-react';
import { parseResume } from '../services/api';
import confetti from 'canvas-confetti';

export default function ResumeParserModal({ isOpen, onClose, onProfileUpdated }) {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'paste'
  const [pastedText, setPastedText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [parseResult, setParseResult] = useState(null);

  if (!isOpen) return null;

  const sampleResumes = {
    swe: `Rajat Verma | rajat.verma@example.edu | github.com/rajatverma
Education: B.Tech Computer Science, GPA 8.8/10
Skills: Python, FastAPI, React.js, Tailwind CSS, SQL, PostgreSQL, Docker, Git, REST APIs, Data Structures & Algorithms, Problem Solving.
Experience & Projects:
- AI Chatbot: Built conversational AI backend using FastAPI, LangChain, and React Tailwind PWA.
- E-Commerce Microservice API: Architected RESTful services with PostgreSQL and Redis caching.
- System Design: Implemented rate limiters, token bucket algorithm, and Docker Compose workflows.`,
    data: `Priya Sharma | priya.sharma@example.edu | github.com/priyasharma
Education: B.Tech Information Technology
Skills: Python, SQL, PostgreSQL, Apache Kafka, Pandas, NumPy, Data Analysis, Data Engineering, Scikit-learn, AWS S3.
Experience & Projects:
- Real-Time ETL Pipeline: Ingested streaming telemetry with Kafka and partitioned data into PostgreSQL data warehouse.
- Predictive Analytics Dashboard: Built churn forecasting models using Scikit-learn and Streamlit.`
  };

  const handleLoadSample = (key) => {
    setActiveTab('paste');
    setPastedText(sampleResumes[key]);
  };

  const handleExecuteParse = async () => {
    setParsing(true);
    setParseResult(null);

    try {
      let res;
      if (activeTab === 'upload' && selectedFile) {
        res = await parseResume(selectedFile, true);
      } else {
        const text = pastedText.trim() || sampleResumes.swe;
        res = await parseResume(text, false);
      }

      setParseResult(res);
      if (onProfileUpdated) {
        onProfileUpdated(res);
      }

      confetti({
        particleCount: 60,
        spread: 50,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error(err);
    } finally {
      setParsing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0b0f19] border border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                AI Resume Intelligence & Extraction
              </h3>
              <p className="text-xs text-slate-400">
                Powered by Python spaCy NLP, pdfplumber, and Skill Taxonomy (1,000+ skills)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector & Presets */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'upload'
                  ? 'bg-cyan-600 text-white shadow-glow-cyan'
                  : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              Upload PDF
            </button>
            <button
              onClick={() => setActiveTab('paste')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'paste'
                  ? 'bg-cyan-600 text-white shadow-glow-cyan'
                  : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              Paste Resume Text
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 text-[11px]">Load Sample:</span>
            <button
              onClick={() => handleLoadSample('swe')}
              className="px-2 py-0.5 rounded bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-[11px] hover:bg-indigo-900/60"
            >
              Rajat (SWE)
            </button>
            <button
              onClick={() => handleLoadSample('data')}
              className="px-2 py-0.5 rounded bg-purple-950/80 border border-purple-500/30 text-purple-300 text-[11px] hover:bg-purple-900/60"
            >
              Priya (Data)
            </button>
          </div>
        </div>

        {/* Upload or Paste Area */}
        {activeTab === 'upload' ? (
          <div className="border-2 border-dashed border-slate-800 hover:border-cyan-500/50 rounded-xl p-6 text-center bg-slate-900/30 transition-colors">
            <UploadCloud className="w-10 h-10 text-cyan-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-200">
              Drag and drop your PDF resume here, or browse files
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Supports standard single or multi-page PDF resumes (pdfplumber engine)
            </p>
            <input
              type="file"
              accept=".pdf,.txt"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className="mt-3 text-xs text-slate-400 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-cyan-900/40 file:text-cyan-300 hover:file:bg-cyan-800/50 cursor-pointer"
            />
          </div>
        ) : (
          <div>
            <textarea
              rows={6}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste raw text from your resume, LinkedIn profile, or project descriptions..."
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>
        )}

        {/* Results Banner if parsed */}
        {parseResult && (
          <div className="mt-4 p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/40 animate-in fade-in">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                {parseResult.message || 'Skills Successfully Extracted!'}
              </span>
              <span className="text-[11px] text-slate-400">
                {parseResult.skills_detected_count} skills verified
              </span>
            </div>

            {/* Extracted Skill Badges */}
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
              {Object.entries(parseResult.extracted_skills || {}).flatMap(([cat, list]) =>
                list.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-200 border border-slate-700 capitalize font-medium"
                  >
                    {skill}
                  </span>
                ))
              )}
            </div>

            {parseResult.new_career_readiness && (
              <div className="mt-2.5 pt-2 border-t border-cyan-900/50 flex items-center justify-between text-xs">
                <span className="text-slate-300">Updated Career Readiness:</span>
                <span className="text-emerald-400 font-bold text-sm">
                  {parseResult.new_career_readiness} / 100
                </span>
              </div>
            )}
          </div>
        )}

        {/* Modal Action Buttons */}
        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleExecuteParse}
            disabled={parsing || (activeTab === 'upload' && !selectedFile && !pastedText)}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 disabled:opacity-50 transition-all shadow-glow-cyan"
          >
            {parsing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing with NLP...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run AI Parser & Update DNA</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
