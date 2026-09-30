import React, { useState } from 'react';
import {
  ShieldAlert,
  Download,
  Copy,
  Check,
  CheckSquare,
  Square,
  AlertTriangle,
  Server
} from 'lucide-react';

export default function AdvisoryViewer({ data, metadata }) {
  const [checklist, setChecklist] = useState(data.mitigationChecklist || []);
  const [copied, setCopied] = useState(false);

  const toggleCheck = (id) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const completedCount = checklist.filter((item) => item.done).length;

  const handleCopyMarkdown = () => {
    const md = `# ${data.title}
ADVISORY ID: ${data.advisoryId} | SEVERITY: ${data.severity} (${data.severityScore})

TL;DR:
${data.tldr}

MITIGATION ACTIONS:
${checklist.map((c) => `- [${c.done ? 'x' : ' '}] ${c.label}`).join('\n')}
`;
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const md = `# ${data.title}\nID: ${data.advisoryId}\nSeverity: ${data.severity}\n\n${data.tldr}`;
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.advisoryId}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Top Advisory Header */}
      <div className="p-4 rounded-xl bg-[#07080c] border border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 font-bold">
              {data.severity}
            </span>
            <span className="text-xs font-mono text-neutral-300">
              CVSS {data.severityScore}
            </span>
            <span className="text-xs font-mono text-neutral-500">
              {data.advisoryId}
            </span>
          </div>
          <h3 className="text-base font-semibold text-white">{data.title}</h3>
          <p className="text-xs text-neutral-400 font-mono mt-0.5">
            {metadata.organization || 'Global Cyber Defense Center'} • {data.timestamp}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyMarkdown}
            className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-white/[0.08] text-neutral-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-neutral-400" />}
            <span>Copy .MD</span>
          </button>
          <button
            onClick={handleDownload}
            className="px-3.5 py-1.5 rounded-xl bg-red-600/20 border border-red-500/40 text-red-300 hover:bg-red-600/30 text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Guidance & Mitigations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2 Cols: TLDR & Threats */}
        <div className="lg:col-span-2 space-y-3">
          <div className="p-4 rounded-xl bg-[#07080c] border border-white/[0.06]">
            <h4 className="text-xs font-mono uppercase tracking-wider text-red-400 font-bold mb-1.5">
              TL;DR Guidance
            </h4>
            <p className="text-xs text-neutral-300 leading-relaxed font-sans">{data.tldr}</p>
          </div>

          <div className="p-4 rounded-xl bg-[#07080c] border border-white/[0.06]">
            <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold mb-2 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-red-400" />
              Affected Surface
            </h4>
            <ul className="space-y-1">
              {data.affectedSystems.map((s, idx) => (
                <li key={idx} className="text-xs text-neutral-300 flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-red-500 mt-2 shrink-0" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-[#07080c] border border-white/[0.06]">
            <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              Identified Threat Vectors
            </h4>
            <ul className="space-y-1">
              {data.riskVectors.map((r, idx) => (
                <li key={idx} className="text-xs text-neutral-300 flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-red-500 mt-2 shrink-0" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Col: Mitigation Checklist */}
        <div className="p-4 rounded-xl bg-[#07080c] border border-white/[0.06] space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
              Mitigation Checklist
            </h4>
            <span className="text-[11px] font-mono text-red-400">
              {completedCount}/{checklist.length}
            </span>
          </div>

          <div className="space-y-2">
            {checklist.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`p-2.5 rounded-lg border text-xs cursor-pointer select-none transition-all flex items-start gap-2 ${
                  item.done
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300 line-through opacity-60'
                    : 'bg-[#040406] border-white/[0.06] text-neutral-300 hover:border-white/[0.15]'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {item.done ? (
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Square className="w-3.5 h-3.5 text-neutral-600" />
                  )}
                </div>
                <span className="leading-snug">{item.label}</span>
              </div>
            ))}
          </div>

          <p className="text-[10px] font-mono text-neutral-500 pt-2 border-t border-white/[0.04]">
            {data.complianceNotice}
          </p>
        </div>
      </div>
    </div>
  );
}
