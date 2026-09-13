import React, { useState, useEffect } from 'react';
import { 
  Network, 
  Sparkles, 
  Layers, 
  ExternalLink, 
  Info,
  CheckCircle2
} from 'lucide-react';
import { fetchKnowledgeGraph } from '../services/api';

export default function CareerKnowledgeGraph() {
  const [graphData, setGraphData] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    fetchKnowledgeGraph().then((data) => {
      setGraphData(data);
      if (data?.nodes?.length > 0) {
        setSelectedNode(data.nodes[0]);
      }
    });
  }, []);

  const nodes = graphData?.nodes || [];
  const links = graphData?.links || [];

  const groupColors = {
    skill: "border-cyan-500/60 bg-cyan-950/40 text-cyan-300",
    career: "border-purple-500/60 bg-purple-950/40 text-purple-300",
    project: "border-emerald-500/60 bg-emerald-950/40 text-emerald-300",
    quest: "border-amber-500/60 bg-amber-950/40 text-amber-300"
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>Career Knowledge Graph</span>
              <span className="text-[10px] bg-purple-950 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">
                Ontology Engine
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Interactive relationship network linking Skills ↔ Roles ↔ Projects ↔ Quests
            </p>
          </div>
        </div>

        {/* Node Group Legend */}
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1 text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400" /> Skills
          </span>
          <span className="flex items-center gap-1 text-purple-400">
            <span className="w-2 h-2 rounded-full bg-purple-400" /> Careers
          </span>
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> Projects
          </span>
          <span className="flex items-center gap-1 text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-400" /> Quests
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Node Network Visualizer Canvas (8 cols) */}
        <div className="lg:col-span-8 p-5 rounded-2xl bg-[#060911] border border-slate-800 relative min-h-[380px] flex flex-col justify-between">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Click any node to inspect semantic relationships</span>
            <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-slate-400">
              {nodes.length} entities • {links.length} relationships
            </span>
          </div>

          {/* Interactive Cluster Nodes */}
          <div className="my-auto py-4 flex flex-wrap items-center justify-center gap-3">
            {nodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              const colorClass = groupColors[node.group] || "border-slate-700 bg-slate-900 text-slate-300";

              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all hover:scale-105 cursor-pointer shadow-sm ${colorClass} ${
                    isSelected ? 'ring-2 ring-white scale-110 shadow-glow-indigo' : 'opacity-85 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="capitalize">{node.label}</span>
                    {node.match && <span className="text-[10px] text-emerald-400">{node.match}</span>}
                    {node.level && <span className="text-[10px] text-slate-400">({node.level}%)</span>}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Graph Connection Flow Text */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>🔗 Active relationship: <strong>Python → Software Engineer</strong> (Core Foundation)</span>
            <span className="text-indigo-400 font-semibold">Ontology Depth: 4 hops</span>
          </div>
        </div>

        {/* Node Details Inspector (4 cols) */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Entity Inspector
            </span>
            <h4 className="text-base font-black text-white mb-1">
              {selectedNode?.label || "Select an entity"}
            </h4>
            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border inline-block mb-4 ${
              groupColors[selectedNode?.group] || "bg-slate-800 text-slate-300"
            }`}>
              Type: {selectedNode?.group || "Entity"}
            </span>

            {/* Related Connections List */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 block">Connected Edges:</span>
              {links
                .filter((l) => l.source === selectedNode?.id || l.target === selectedNode?.id)
                .map((link, lIdx) => (
                  <div key={lIdx} className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs flex justify-between items-center">
                    <span className="text-slate-300 font-medium">
                      {link.source === selectedNode?.id ? link.target : link.source}
                    </span>
                    <span className="text-[10px] text-indigo-400 capitalize">
                      {link.relationship.replace('_', ' ')}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-300">
            <span className="font-bold block mb-0.5">Semantic Value:</span>
            Closing gaps on {selectedNode?.label || "this node"} directly optimizes 3 downstream career readiness pathways.
          </div>
        </div>
      </div>
    </div>
  );
}
