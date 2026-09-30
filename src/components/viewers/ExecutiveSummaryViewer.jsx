import React, { useState } from 'react';
import {
  FileCheck2,
  Copy,
  Check,
  Printer
} from 'lucide-react';

export default function ExecutiveSummaryViewer({ data, metadata }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = `${data.title}\n\nBLUF:\n${data.bluf}\n\nSTRATEGIC PILLARS:\n${data.strategicPillars.map((p) => `- ${p.title}: ${p.desc}`).join('\n')}\n\nDECISIONS:\n${data.decisionPoints.map((d, i) => `${i + 1}. ${d}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="p-4 rounded-xl bg-[#07080c] border border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/30">
              {data.classification}
            </span>
            <span className="text-xs font-mono text-neutral-400">{data.readTime}</span>
          </div>
          <h3 className="text-base font-semibold text-white">{data.title}</h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3.5 py-1.5 rounded-xl bg-neutral-900 border border-white/[0.08] text-neutral-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy Brief</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded-xl bg-red-600/20 border border-red-500/40 text-red-300 hover:bg-red-600/30 text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* BLUF Highlight */}
      <div className="p-4 rounded-xl bg-[#07080c] border border-red-500/30 space-y-1.5 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
        <span className="text-[10px] font-mono uppercase tracking-wider text-red-400 font-bold block">
          BLUF // Bottom Line Up Front
        </span>
        <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-sans font-medium">
          {data.bluf}
        </p>
      </div>

      {/* Strategic Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {data.strategicPillars.map((p, idx) => (
          <div key={idx} className="p-3.5 rounded-xl bg-[#07080c] border border-white/[0.06] space-y-1.5">
            <span className="text-[10px] font-mono text-red-400 font-bold block">
              Pillar 0{idx + 1}
            </span>
            <h5 className="text-xs font-bold text-white">{p.title}</h5>
            <p className="text-[11px] text-neutral-400 leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>

      {/* Decision Points */}
      <div className="p-4 rounded-xl bg-[#07080c] border border-white/[0.06] space-y-2.5">
        <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold">
          Required Leadership Approvals
        </h4>
        <div className="space-y-1.5">
          {data.decisionPoints.map((dec, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-neutral-300">
              <span className="w-4 h-4 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5 border border-red-500/20">
                {idx + 1}
              </span>
              <span>{dec}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
