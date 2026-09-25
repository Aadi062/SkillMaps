import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BriefcaseBusiness,
  Command,
  FolderKanban,
  Map,
  Mic2,
  Search,
  Sparkles,
  Target,
  X,
} from 'lucide-react';

const COMMANDS = [
  { id: 'quests', label: 'Launch a project quest', detail: 'Earn XP and strengthen your evidence', icon: Target },
  { id: 'opportunities', label: 'Scan opportunity feeds', detail: 'Find roles matched to your verified skills', icon: BriefcaseBusiness },
  { id: 'roadmap', label: 'Open my career roadmap', detail: 'See the next highest-impact milestone', icon: Map },
  { id: 'projects', label: 'Review project evidence', detail: 'Turn completed work into portfolio proof', icon: FolderKanban },
  { id: 'interview', label: 'Start interview training', detail: 'Practice with the AI interviewer', icon: Mic2 },
];

export default function CommandCenter({ open, onClose, onNavigate }) {
  const [query, setQuery] = useState('');
  const filteredCommands = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return COMMANDS;
    return COMMANDS.filter((command) => `${command.label} ${command.detail}`.toLowerCase().includes(normalizedQuery));
  }, [query]);

  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'Enter' && filteredCommands[0]) {
        onNavigate(filteredCommands[0].id);
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredCommands, onClose, onNavigate, open]);

  useEffect(() => {
    if (open) setQuery('');
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center bg-black/65 px-4 pt-[12vh] backdrop-blur-sm" onMouseDown={onClose}>
      <div className="glass-panel w-full max-w-2xl rounded-2xl border-cyan-400/30 shadow-[0_0_70px_rgba(89,235,255,0.18)]" onMouseDown={(event) => event.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-emerald-300/15 px-5 py-4">
          <Command className="h-4 w-4 text-cyan-300" />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Type a command or search the system..."
            className="flex-1 border-0 bg-transparent text-sm text-white outline-none placeholder:text-emerald-100/40"
          />
          <kbd className="hidden rounded border border-emerald-300/20 px-2 py-1 text-[10px] text-emerald-200/60 sm:block">ESC</kbd>
          <button type="button" onClick={onClose} className="text-emerald-100/60 hover:text-white" aria-label="Close command center">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-3">
          <div className="mb-2 flex items-center gap-2 px-2 text-[10px] uppercase tracking-[0.24em] text-emerald-200/50">
            <Sparkles className="h-3 w-3" /> Recommended actions
          </div>
          {filteredCommands.length ? filteredCommands.map((command, index) => {
            const Icon = command.icon;
            return (
              <button
                key={command.id}
                type="button"
                onClick={() => { onNavigate(command.id); onClose(); }}
                className="group flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-3 text-left hover:border-cyan-300/25 hover:bg-cyan-300/10"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-300/20 bg-emerald-300/10 text-emerald-200">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-bold text-white">{command.label}</span>
                  <span className="block truncate text-[11px] text-emerald-100/55">{command.detail}</span>
                </span>
                {index === 0 && <span className="text-[10px] uppercase tracking-widest text-cyan-300/60">Enter</span>}
                <ArrowRight className="h-4 w-4 text-emerald-100/30 transition-transform group-hover:translate-x-1 group-hover:text-cyan-300" />
              </button>
            );
          }) : (
            <div className="px-3 py-8 text-center text-xs text-emerald-100/50"><Search className="mx-auto mb-2 h-5 w-5" />No matching system action.</div>
          )}
        </div>
      </div>
    </div>
  );
}
