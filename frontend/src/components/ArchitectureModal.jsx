import React, { useState, useEffect } from 'react';
import { 
  X, 
  Server, 
  Database, 
  Cpu, 
  Layers, 
  Cloud, 
  CheckCircle2, 
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react';
import { fetchHealth } from '../services/api';

export default function ArchitectureModal({ isOpen, onClose }) {
  const [healthData, setHealthData] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchHealth().then(setHealthData);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const stackItems = [
    { name: "React PWA", role: "Frontend UI & Offline Mobile Experience", tier: "Free Tier", provider: "Vercel" },
    { name: "Tailwind CSS", role: "Utility styling & Responsive UI", tier: "Open Source", provider: "Client" },
    { name: "FastAPI", role: "Asynchronous REST API Gateway", tier: "Free Tier", provider: "Python 3.14" },
    { name: "spaCy + pdfplumber", role: "NLP Resume & Entity Extraction", tier: "Free Tier", provider: "In-Memory" },
    { name: "scikit-learn", role: "TF-IDF Career Matching Engine", tier: "Free Tier", provider: "Vector Model" },
    { name: "PostgreSQL", role: "Relational Career & Skills Store", tier: "Free Cloud Tier", provider: "Neon.tech" },
    { name: "Firebase", role: "Authentication & PDF Resume Storage", tier: "Spark Free Tier", provider: "Google Cloud" },
    { name: "Remotive & Adzuna", role: "Opportunity & Internship Jobs Feed", tier: "Free API Tier", provider: "External APIs" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#0b0f19] border border-slate-800 rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                System Architecture & Tech Stack (100% Free Tier)
              </h3>
              <p className="text-xs text-slate-400">
                End-to-end verified cloud architecture designed for zero server cost
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

        {/* Visual Architecture Flowchart matching infographic */}
        <div className="mb-6">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-3">
            System Data Pipeline
          </span>
          <div className="grid grid-cols-2 md:grid-cols-7 gap-2 text-center text-xs">
            <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/40 flex flex-col items-center justify-center">
              <Layers className="w-5 h-5 text-blue-400 mb-1" />
              <span className="font-bold text-white text-[11px]">Frontend</span>
              <span className="text-[9px] text-slate-400">React PWA</span>
            </div>

            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex flex-col items-center justify-center">
              <Zap className="w-5 h-5 text-emerald-400 mb-1" />
              <span className="font-bold text-white text-[11px]">API Gateway</span>
              <span className="text-[9px] text-slate-400">FastAPI</span>
            </div>

            <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/40 flex flex-col items-center justify-center">
              <Cpu className="w-5 h-5 text-purple-400 mb-1" />
              <span className="font-bold text-white text-[11px]">AI Services</span>
              <span className="text-[9px] text-slate-400">spaCy / NLP</span>
            </div>

            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 flex flex-col items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-400 mb-1" />
              <span className="font-bold text-white text-[11px]">Career Engine</span>
              <span className="text-[9px] text-slate-400">scikit-learn</span>
            </div>

            <div className="p-3 rounded-xl bg-teal-950/40 border border-teal-500/40 flex flex-col items-center justify-center">
              <Database className="w-5 h-5 text-teal-400 mb-1" />
              <span className="font-bold text-white text-[11px]">PostgreSQL</span>
              <span className="text-[9px] text-slate-400">Neon.tech</span>
            </div>

            <div className="p-3 rounded-xl bg-orange-950/40 border border-orange-500/40 flex flex-col items-center justify-center">
              <Cloud className="w-5 h-5 text-orange-400 mb-1" />
              <span className="font-bold text-white text-[11px]">File Storage</span>
              <span className="text-[9px] text-slate-400">Firebase</span>
            </div>

            <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/40 flex flex-col items-center justify-center">
              <Globe className="w-5 h-5 text-indigo-400 mb-1" />
              <span className="font-bold text-white text-[11px]">External APIs</span>
              <span className="text-[9px] text-slate-400">Remotive / Adzuna</span>
            </div>
          </div>
        </div>

        {/* 100% Free Tier Breakdown Table */}
        <div className="mb-6">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-3">
            Component Free Tier Verification
          </span>
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Technology</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Hosting / Platform</th>
                  <th className="py-2.5 px-3">Tier Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {stackItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-white flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{item.name}</span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">{item.role}</td>
                    <td className="py-2.5 px-3 text-indigo-300">{item.provider}</td>
                    <td className="py-2.5 px-3 font-semibold text-emerald-400">{item.tier}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* For The Future Section */}
        <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30">
          <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider block mb-2">
            For The Future (Roadmap Innovations)
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              <span>Real-time skill trend prediction</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              <span>GenAI generated personalized learning paths</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              <span>Voice-driven AI Career Coach</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              <span>College placement predictive analytics</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              <span>Employer dashboard & direct hiring portal</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              <span>Global opportunities engine</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-5 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
