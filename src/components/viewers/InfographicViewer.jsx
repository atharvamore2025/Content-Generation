import React, { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';
import ConceptGraph3D from './ConceptGraph3D';

export default function InfographicViewer({ data }) {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedHex, setCopiedHex] = useState(null);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(data.figmaPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleCopyHex = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  const conceptGraph = data.conceptGraph;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="p-4 rounded-xl bg-[#07080c] border border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 w-fit block mb-1">
            Infographic Blueprint
          </span>
          <h3 className="text-base font-semibold text-white">{data.headline}</h3>
          <p className="text-xs text-neutral-400 mt-0.5">{data.subtitle}</p>
        </div>

        <button
          onClick={handleCopyPrompt}
          className="px-3.5 py-2 rounded-xl bg-neutral-900 border border-white/[0.08] hover:border-white/[0.2] text-white text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all shrink-0"
        >
          {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Sparkles className="w-3.5 h-3.5 text-red-400" />}
          <span>{copiedPrompt ? 'Copied Prompt' : 'Copy Design Prompt'}</span>
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {data.keyMetrics.map((m, idx) => (
          <div key={idx} className="p-3.5 rounded-xl bg-[#07080c] border border-white/[0.06] space-y-1">
            <div className="flex items-center justify-between text-neutral-500">
              <span className="text-[10px] font-mono">{m.label}</span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-neutral-900 text-neutral-300">
                {m.trend}
              </span>
            </div>
            <div className="text-xl font-bold font-mono text-white">{m.value}</div>
          </div>
        ))}
      </div>

      {data.graphEnabled && conceptGraph?.nodes.length > 0 && (
        <section className="p-3 sm:p-4 rounded-xl bg-[#07080c] border border-white/[0.06] space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-300 font-bold">Concept Relationship Graph</h4>
              <p className="text-[10px] font-mono text-neutral-500 mt-1">
                {conceptGraph.nodes.length} concepts · {conceptGraph.links.length} connections
              </p>
            </div>
          </div>
          <ConceptGraph3D graph={conceptGraph} />
        </section>
      )}
      {data.graphEnabled && !conceptGraph?.nodes.length && (
        <div className="p-3 rounded-xl bg-[#07080c] border border-white/[0.06] text-xs text-neutral-500">
          Not enough distinct concepts in the source to build a relationship graph.
        </div>
      )}

      {/* 4-Step Process Flowchart */}
      <div className="p-4 rounded-xl bg-[#07080c] border border-white/[0.06] space-y-3">
        <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold">
          Visual Process Hierarchy
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5">
          {data.flowSteps.map((step, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-[#040406] border border-white/[0.04] space-y-1 relative">
              <span className="text-[10px] font-mono text-red-400 block font-bold">
                0{step.step}
              </span>
              <h5 className="text-xs font-bold text-white">{step.title}</h5>
              <p className="text-[11px] text-neutral-400 leading-snug">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Palette & Core Takeaway */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-[#07080c] border border-white/[0.06] space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block">Color Swatches</span>
          <div className="flex flex-wrap gap-1.5">
            {data.colorPalette.map((col, idx) => (
              <button
                key={idx}
                onClick={() => handleCopyHex(col.hex)}
                className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-black border border-white/[0.08] text-[10px] font-mono text-neutral-300 hover:text-white"
                title={`Copy ${col.hex}`}
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.hex }} />
                <span>{copiedHex === col.hex ? 'Copied' : col.hex}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="sm:col-span-2 p-3.5 rounded-xl bg-[#07080c] border border-white/[0.06] flex items-center">
          <p className="text-xs text-neutral-300 font-sans italic leading-relaxed">
            "{data.takeawayMessage}"
          </p>
        </div>
      </div>
    </div>
  );
}
