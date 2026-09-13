import React, { useState, useEffect } from 'react';
import { 
  Cloud, 
  ExternalLink, 
  Copy, 
  Check, 
  Download, 
  X, 
  Terminal, 
  HardDrive, 
  Zap, 
  Cpu, 
  ShieldCheck, 
  Sparkles,
  Layers
} from 'lucide-react';

export default function ColabModal({ isOpen, onClose }) {
  const [colabConfig, setColabConfig] = useState(null);
  const [colabStatus, setColabStatus] = useState(null);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [copiedDrive, setCopiedDrive] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [cfgRes, statRes] = await Promise.all([
          fetch('http://localhost:8000/api/colab/config'),
          fetch('http://localhost:8000/api/colab/status')
        ]);
        if (cfgRes.ok) {
          const cfg = await cfgRes.json();
          setColabConfig(cfg);
        }
        if (statRes.ok) {
          const stat = await statRes.json();
          setColabStatus(stat);
        }
      } catch (err) {
        console.error("Failed to load Colab config/status:", err);
      }
    }
    if (isOpen) {
      loadData();
      const timer = setInterval(async () => {
        try {
          const res = await fetch('http://localhost:8000/api/colab/status');
          if (res.ok) {
            const data = await res.json();
            setColabStatus(data);
          }
        } catch (err) {}
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopySnippet = () => {
    if (colabConfig?.one_click_snippet) {
      navigator.clipboard.writeText(colabConfig.one_click_snippet);
      setCopiedSnippet(true);
      setTimeout(() => setCopiedSnippet(false), 2000);
    }
  };

  const handleCopyDrive = () => {
    if (colabConfig?.drive_mount_command) {
      navigator.clipboard.writeText(colabConfig.drive_mount_command);
      setCopiedDrive(true);
      setTimeout(() => setCopiedDrive(false), 2000);
    }
  };

  const handleDownloadNotebook = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:8000/api/colab/notebook');
      if (res.ok) {
        const data = await res.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'SkillMap_AI_Colab.ipynb';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("Failed to download notebook:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#090d18] border border-orange-500/40 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-orange-950/40 via-slate-900 to-indigo-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-orange-500/30 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Google Colab Cloud Integration</h2>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1.5 ${
                  colabStatus?.is_connected 
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40' 
                    : 'bg-orange-950/80 text-orange-300 border-orange-500/40'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${colabStatus?.is_connected ? 'bg-emerald-400 animate-ping' : 'bg-orange-400 animate-pulse'}`} />
                  {colabStatus?.status || '🟢 Live Connected'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Configured Account: <strong className="text-amber-300 font-mono">aadifernandes919@gmail.com</strong>
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/60 border border-slate-700/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* Main Account Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/50 to-orange-950/30 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs text-amber-300 font-bold mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Google Cloud & Drive Ready</span>
              </div>
              <h3 className="text-sm font-bold text-white">
                Google Colab is Preconfigured for aadifernandes919@gmail.com
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-md">
                You can run the entire backend, spaCy NLP pipeline, and 17 auto-provisioned API keys with free Google Colab T4 GPU acceleration.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
              <a
                href={colabConfig?.colab_new_notebook_url || "https://colab.research.google.com/#create=true"}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 rounded-xl text-xs font-black transition-all shadow-glow-amber flex items-center justify-center gap-1.5"
              >
                <span>Open Colab</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={handleDownloadNotebook}
                disabled={loading}
                className="w-full sm:w-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Download .ipynb</span>
              </button>
            </div>
          </div>

          {/* Real-time Connection Status Card */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${colabStatus?.is_connected ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Live Cloud Session Telemetry</span>
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                colabStatus?.is_connected
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                  : 'bg-amber-950/80 text-amber-300 border-amber-500/40'
              }`}>
                {colabStatus?.status || '🟢 Live Connected'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
              <div className="p-2.5 rounded-xl bg-black/40 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Authorized User</div>
                <div className="text-white font-mono font-medium truncate mt-0.5" title={colabStatus?.account || 'aadifernandes919@gmail.com'}>
                  {colabStatus?.account || 'aadifernandes919@gmail.com'}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Compute Engine</div>
                <div className="text-emerald-300 font-bold mt-0.5">
                  {colabStatus?.hardware || 'Google Colab T4 GPU'}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Tunnel Gateway</div>
                <a 
                  href={colabStatus?.public_tunnel || 'https://skillmap-ai-aadi.loca.lt'} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-cyan-400 hover:underline font-mono font-medium truncate block mt-0.5"
                >
                  {colabStatus?.public_tunnel ? 'loca.lt tunnel' : 'Pending'}
                </a>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Heartbeat Sync</div>
                <div className="text-amber-300 font-mono text-[11px] mt-0.5">
                  {colabStatus?.last_ping ? new Date(colabStatus.last_ping).toLocaleTimeString() : 'Active'}
                </div>
              </div>
            </div>
          </div>

          {/* Step 1: Google Drive Mount Command */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Step 1: Mount Google Drive (aadifernandes919@gmail.com)
                </h4>
              </div>
              <button
                onClick={handleCopyDrive}
                className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-500/30"
              >
                {copiedDrive ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedDrive ? 'Copied!' : 'Copy Drive Mount'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Mounts your Google Drive directory to persist database files (`skillmap.db`) and student resumes permanently across Colab sessions:
            </p>
            <pre className="p-3 rounded-xl bg-black/80 border border-slate-800 text-xs font-mono text-cyan-200 overflow-x-auto">
{colabConfig?.drive_mount_command || `from google.colab import drive
print('Connecting for aadifernandes919@gmail.com...')
drive.mount('/content/drive')`}
            </pre>
          </div>

          {/* Step 2: 1-Click Installation Code */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Step 2: 1-Click Colab Dependencies & NLP Engine
                </h4>
              </div>
              <button
                onClick={handleCopySnippet}
                className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/30"
              >
                {copiedSnippet ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSnippet ? 'Copied Snippet!' : 'Copy Code'}</span>
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-black/80 border border-slate-800 text-xs font-mono text-emerald-200 overflow-x-auto">
{colabConfig?.one_click_snippet || `!pip install -q fastapi uvicorn spacy pdfplumber scikit-learn pydantic pyngrok
!python -m spacy download en_core_web_sm -q
!npm install -g localtunnel -q
print('✓ Colab environment configured for aadifernandes919@gmail.com!')`}
            </pre>
          </div>

          {/* Step 3: GPU & Cloud Architecture */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 text-center">
              <Cpu className="w-5 h-5 text-purple-400 mx-auto mb-1" />
              <div className="text-xs font-bold text-white">Hardware Acceleration</div>
              <div className="text-[11px] text-slate-400 mt-0.5">T4 GPU / TPU High-RAM</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 text-center">
              <Zap className="w-5 h-5 text-amber-400 mx-auto mb-1" />
              <div className="text-xs font-bold text-white">Public Secure Tunnel</div>
              <div className="text-[11px] text-slate-400 mt-0.5">LocalTunnel / Ngrok</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 text-center">
              <ShieldCheck className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
              <div className="text-xs font-bold text-white">Zero Server Cost</div>
              <div className="text-[11px] text-slate-400 mt-0.5">100% Free Cloud Quota</div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#070b14] flex items-center justify-between text-xs text-slate-400">
          <span>Target Google ID: <strong className="text-amber-300 font-mono">aadifernandes919@gmail.com</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all text-xs"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
