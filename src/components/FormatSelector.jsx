import React from 'react';
import {
  Video,
  ShieldAlert,
  BarChart3,
  FileCheck2,
  Presentation,
  CheckCircle2,
  Circle,
  Sparkles,
  Zap,
  ArrowRight
} from 'lucide-react';
import { LinkedInIcon, TwitterXIcon } from './icons/SocialIcons';
import TiltCard from './TiltCard';

export const FORMAT_OPTIONS = [
  {
    id: 'video',
    name: 'Video Package',
    icon: Video,
    color: 'from-rose-500 to-amber-500',
    borderColor: 'border-rose-500/40',
    badge: 'Multi-Scene Studio',
    description: 'Complete video package: script, storyboard, scene descriptions, audio narration, timed subtitles & visual recommendations.',
    deliverables: ['Timed Script', 'Storyboard Cues', 'AI Art Prompts', 'TTS Audio Voice', 'SRT Subtitles']
  },
  {
    id: 'linkedin',
    name: 'LinkedIn Post',
    icon: LinkedInIcon,
    color: 'from-blue-600 to-cyan-500',
    borderColor: 'border-blue-500/40',
    badge: 'B2B Leadership',
    description: 'High-engagement professional post with viral hook, bulleted insights, call-to-action & curated hashtag cluster.',
    deliverables: ['High-Converting Hook', 'Bullet Takeaways', 'Engaging CTA', 'Target Hashtags']
  },
  {
    id: 'twitter',
    name: 'Twitter / X Thread',
    icon: TwitterXIcon,
    color: 'from-sky-400 to-indigo-500',
    borderColor: 'border-sky-500/40',
    badge: 'Thread Optimized',
    description: 'Platform-optimized numbered tweet thread with character counts, punchy hooks, data highlights & viral sharing prompts.',
    deliverables: ['Numbered 1/N Thread', 'Char Counter', 'Hook & Outro', 'One-Click Copy']
  },
  {
    id: 'advisory',
    name: 'Structured Advisory',
    icon: ShieldAlert,
    color: 'from-amber-500 to-rose-600',
    borderColor: 'border-amber-500/40',
    badge: 'Security / Ops',
    description: 'Formal regulatory/cyber advisory with severity level, CVSS rating, blast radius, risk vectors & checkable mitigations.',
    deliverables: ['Severity Matrix', 'CVSS 9.8 Metric', 'Mitigation Checklist', 'Regulatory Notice']
  },
  {
    id: 'infographic',
    name: 'Infographic Blueprint',
    icon: BarChart3,
    color: 'from-emerald-400 to-teal-600',
    borderColor: 'border-emerald-500/40',
    badge: 'Visual Architecture',
    description: 'Source-derived concept relationship graph, metric callouts, 4-step workflow & Figma design prompt.',
    deliverables: ['Concept Network Graph', 'Metric Callouts', 'Process Flow', 'Figma/Canva Prompt']
  },
  {
    id: 'executiveSummary',
    name: 'Executive Summary',
    icon: FileCheck2,
    color: 'from-violet-500 to-purple-700',
    borderColor: 'border-violet-500/40',
    badge: 'Board Briefing',
    description: 'Concise executive briefing with BLUF (Bottom Line Up Front), strategic pillars, quantifiable KPIs & decision points.',
    deliverables: ['BLUF Card', 'Strategic Pillars', 'Risk vs SLA Gauge', 'Action Decisions']
  },
  {
    id: 'presentation',
    name: 'Presentation Deck',
    icon: Presentation,
    color: 'from-fuchsia-500 to-pink-600',
    borderColor: 'border-fuchsia-500/40',
    badge: 'Interactive Slides',
    description: '5-slide presentation deck with interactive slide viewer, visual cues, talking points & collapsible speaker notes.',
    deliverables: ['5 Slide Carousel', 'Speaker Notes', 'Visual Layouts', 'Fullscreen Mode']
  }
];

export default function FormatSelector({
  selectedFormats,
  setSelectedFormats,
  onTransform,
  isGenerating
}) {
  const toggleFormat = (id) => {
    if (selectedFormats.includes(id)) {
      if (selectedFormats.length > 1) {
        setSelectedFormats(selectedFormats.filter((f) => f !== id));
      }
    } else {
      setSelectedFormats([...selectedFormats, id]);
    }
  };

  const selectAll = () => {
    setSelectedFormats(FORMAT_OPTIONS.map((f) => f.id));
  };

  const selectQuickTriple = () => {
    setSelectedFormats(['video', 'linkedin', 'executiveSummary']);
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 shadow-2xl space-y-4">
      {/* Selector Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              Desired Output Deliverables
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-500/30">
                {selectedFormats.length} Selected
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Select one or multiple communication artefacts to synthesize concurrently from the same source
            </p>
          </div>
        </div>

        {/* Quick select buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={selectAll}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all font-mono"
          >
            Select All (7)
          </button>
          <button
            type="button"
            onClick={selectQuickTriple}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all font-mono"
          >
            Core 3 Trio
          </button>
        </div>
      </div>

      {/* Grid of 7 3D Tilt Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
        {FORMAT_OPTIONS.map((item) => {
          const isSelected = selectedFormats.includes(item.id);
          const Icon = item.icon;

          return (
            <TiltCard
              key={item.id}
              maxTilt={10}
              scale={1.02}
              onClick={() => toggleFormat(item.id)}
              className={`p-4 rounded-xl border cursor-pointer select-none transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-indigo-500/70 bg-gradient-to-b from-indigo-950/40 to-slate-900/90 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/30'
                  : 'border-slate-800 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-900/50 opacity-70 hover:opacity-100'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div className={`p-2 rounded-xl bg-gradient-to-br ${item.color} text-white shadow-md`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800">
                      {item.badge}
                    </span>
                    {isSelected ? (
                      <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-600" />
                    )}
                  </div>
                </div>

                <h3 className="text-sm font-semibold text-white mb-1">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                  {item.description}
                </p>
              </div>

              {/* Deliverable pills */}
              <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-1">
                {item.deliverables.map((deliv, idx) => (
                  <span
                    key={idx}
                    className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800"
                  >
                    {deliv}
                  </span>
                ))}
              </div>
            </TiltCard>
          );
        })}
      </div>

      {/* Primary Transform Action Bar */}
      <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800/80">
        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>Synthesizing <strong className="text-white">{selectedFormats.length}</strong> parallel output artefacts from 1 unified source</span>
        </div>

        <button
          onClick={onTransform}
          disabled={isGenerating}
          className={`w-full sm:w-auto relative group overflow-hidden px-8 py-3.5 rounded-xl font-semibold text-sm text-white shadow-xl transition-all duration-300 flex items-center justify-center gap-3 ${
            isGenerating
              ? 'bg-slate-800 cursor-not-allowed text-slate-400'
              : 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
              <span>Transforming Artefacts in Parallel...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-cyan-200 group-hover:rotate-12 transition-transform" />
              <span>TRANSFORM CONTENT NOW</span>
              <ArrowRight className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
