import React, { useEffect, useState } from 'react';
import { Cpu, CheckCircle2, ArrowRight, ShieldCheck, Activity, Terminal } from 'lucide-react';

export default function PipelineHUD({ isGenerating, progress, activeFormats }) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (!isGenerating) return;
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 350);
    return () => clearInterval(interval);
  }, [isGenerating]);

  const stages = [
    { name: 'Semantic Token Ingestion', desc: 'Parsing structure & entities', threshold: 25 },
    { name: 'Intent Vectorization', desc: 'Aligning audience & tone matrix', threshold: 55 },
    { name: 'Multi-Format Synthesis', desc: `Generating ${activeFormats.length} artefacts`, threshold: 85 },
    { name: 'Deliverable Verification', desc: 'Validating schemas & constraints', threshold: 100 },
  ];

  return (
    <div className="glass-panel rounded-2xl p-4 border border-indigo-500/30 bg-slate-950/80 shadow-2xl relative overflow-hidden transition-all">
      {/* Background cyber scan line */}
      {isGenerating && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Activity className={`w-4 h-4 ${isGenerating ? 'text-indigo-400 animate-spin' : 'text-emerald-400'}`} />
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-200">
            {isGenerating ? `Synthesizing Neural Pipeline${dots}` : 'Pipeline Ready // Multi-Channel Bus Active'}
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
          <span>Latency: <strong className="text-indigo-400">18ms</strong></span>
          <span>•</span>
          <span>Formats: <strong className="text-cyan-400">{activeFormats.length} Active</strong></span>
          <span>•</span>
          <span>Security: <strong className="text-emerald-400">Encrypted</strong></span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800 mb-3">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 transition-all duration-300 ease-out shadow-sm shadow-cyan-400/50"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 4 Stages Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {stages.map((stg, idx) => {
          const isDone = progress >= stg.threshold;
          const isCurrent = progress < stg.threshold && (idx === 0 || progress >= stages[idx - 1].threshold);

          return (
            <div
              key={idx}
              className={`p-2.5 rounded-xl border text-xs transition-all ${
                isDone
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                  : isCurrent
                  ? 'bg-indigo-950/40 border-indigo-500/60 text-indigo-300 ring-1 ring-indigo-500/30'
                  : 'bg-slate-900/40 border-slate-800 text-slate-500'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-[10px] text-slate-400">0{idx + 1}</span>
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : isCurrent ? (
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-ping" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-slate-700" />
                )}
              </div>
              <p className="font-semibold text-white line-clamp-1">{stg.name}</p>
              <p className="text-[10px] text-slate-400 line-clamp-1">{stg.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
