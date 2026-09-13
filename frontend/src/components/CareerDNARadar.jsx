import React from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from 'recharts';
import { Sparkles, Dna, ArrowUpRight } from 'lucide-react';

export default function CareerDNARadar({ competencies, topMatches, onSelectCareer }) {
  // Format 6 competencies for Radar chart
  const radarData = [
    { subject: 'Problem Solving', score: competencies?.problem_solving || 88, fullMark: 100 },
    { subject: 'Programming', score: competencies?.programming || 92, fullMark: 100 },
    { subject: 'Data Analysis', score: competencies?.data_analysis || 76, fullMark: 100 },
    { subject: 'Creativity', score: competencies?.creativity || 70, fullMark: 100 },
    { subject: 'Communication', score: competencies?.communication || 65, fullMark: 100 },
    { subject: 'Leadership', score: competencies?.leadership || 60, fullMark: 100 },
  ];

  const matches = topMatches || [
    { id: 'software_engineer', title: 'Software Engineer', match_score: 88 },
    { id: 'data_engineer', title: 'Data Engineer', match_score: 81 },
    { id: 'ai_ml_engineer', title: 'AI/ML Engineer', match_score: 74 },
    { id: 'cybersecurity_analyst', title: 'Cybersecurity Analyst', match_score: 61 },
  ];

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 flex flex-col justify-between h-full">
      {/* Title */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Dna className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-bold tracking-wider text-slate-200 uppercase">
              AI Career DNA
            </h3>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-500/30">
            6-Axis Model
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mb-2">
          Multidimensional competency graph synthesized from your projects, verified skills, and assessments.
        </p>

        {/* Recharts Radar Chart */}
        <div className="w-full h-56 relative">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="72%" data={radarData}>
              <PolarGrid stroke="#1e293b" strokeDasharray="3 3" />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} 
              />
              <PolarRadiusAxis 
                angle={30} 
                domain={[0, 100]} 
                tick={{ fill: '#475569', fontSize: 9 }} 
              />
              <Radar
                name="Competency"
                dataKey="score"
                stroke="#8b5cf6"
                strokeWidth={2}
                fill="#8b5cf6"
                fillOpacity={0.45}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Career Matches List */}
      <div className="mt-4 pt-4 border-t border-slate-800/80">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-slate-300">Top Career Matches</h4>
          <span className="text-[10px] text-indigo-400 font-medium">Auto-Ranked</span>
        </div>

        <div className="space-y-2">
          {matches.map((career, idx) => {
            const isTop = idx === 0;
            return (
              <div
                key={career.id || idx}
                onClick={() => onSelectCareer && onSelectCareer(career)}
                className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isTop 
                    ? 'bg-indigo-950/40 border-indigo-500/40 hover:bg-indigo-900/40' 
                    : 'bg-slate-900/40 border-slate-800/60 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-5 h-5 rounded-lg flex items-center justify-center text-xs font-bold ${
                    isTop ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="text-xs font-semibold text-slate-200">
                    {career.title}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`text-xs font-bold ${
                    career.match_score >= 80 ? 'text-emerald-400' : career.match_score >= 70 ? 'text-cyan-400' : 'text-amber-400'
                  }`}>
                    {career.match_score}%
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
