import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Clipboard,
  Trash2,
  Sliders,
  ChevronDown,
  ChevronUp,
  Video,
  ShieldAlert,
  BarChart3,
  FileCheck2,
  Presentation,
  CheckCircle,
  Circle,
  Zap
} from 'lucide-react';
import { LinkedInIcon, TwitterXIcon } from './icons/SocialIcons';
import { SAMPLE_PRESETS } from '../data/samplePresets';

export const ALL_FORMATS = [
  { id: 'video', name: 'Video Package', desc: 'Script & Storyboard', icon: Video },
  { id: 'linkedin', name: 'LinkedIn Post', desc: 'Leadership Editorial', icon: LinkedInIcon },
  { id: 'twitter', name: 'Twitter / X', desc: 'Numbered Thread', icon: TwitterXIcon },
  { id: 'advisory', name: 'Advisory', desc: 'Formal Security Brief', icon: ShieldAlert },
  { id: 'infographic', name: 'Infographic', desc: 'Visual Architecture', icon: BarChart3 },
  { id: 'executiveSummary', name: 'Exec Summary', desc: 'BLUF & Strategic KPIs', icon: FileCheck2 },
  { id: 'presentation', name: 'Presentation', desc: 'Interactive Deck', icon: Presentation },
];

export default function InputPanel({
  sourceText,
  setSourceText,
  activePresetId,
  onSelectPreset,
  parameters,
  setParameters,
  selectedFormats,
  setSelectedFormats,
  onTransform,
  isGenerating
}) {
  const [showConfig, setShowConfig] = useState(false);

  const wordCount = sourceText.trim() ? sourceText.trim().split(/\s+/).length : 0;

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setSourceText(text);
    } catch {
      // fallback
    }
  };

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target.result === 'string') {
          setSourceText(event.target.result);
        }
      };
      reader.readAsText(file);
    }
  };

  const toggleFormat = (id) => {
    if (selectedFormats.includes(id)) {
      if (selectedFormats.length > 1) {
        setSelectedFormats(selectedFormats.filter((f) => f !== id));
      }
    } else {
      setSelectedFormats([...selectedFormats, id]);
    }
  };

  const selectAllFormats = () => {
    setSelectedFormats(ALL_FORMATS.map((f) => f.id));
  };

  return (
    <div className="space-y-4">
      {/* 1. Source Ingestion Studio */}
      <div className="bg-[#0b0c11]/85 backdrop-blur-2xl rounded-2xl p-5 border border-white/[0.08] shadow-[0_10px_40px_rgba(0,0,0,0.6)] space-y-3.5">
        <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-300 font-semibold">
              Source Ingestion
            </h2>
          </div>

          <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 hover:text-white flex items-center gap-1.5 cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5 text-neutral-400" />
            <span>Upload File</span>
            <input
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              accept=".txt,.md,.json,.csv,.log"
            />
          </label>
        </div>

        {/* Text Area */}
        <div className="relative group">
          <textarea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="Type or paste source article, report, threat advisory, announcement, or prompt here..."
            rows={8}
            className="w-full bg-[#050608]/90 border border-white/[0.06] rounded-xl p-4 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-red-500/50 font-mono leading-relaxed resize-y transition-all"
          />

          <div className="absolute top-3 right-3 flex items-center gap-1 bg-[#0c0d12]/90 rounded-lg p-1 border border-white/[0.08]">
            <button
              type="button"
              onClick={handlePaste}
              title="Paste from clipboard"
              className="p-1.5 text-neutral-400 hover:text-white rounded transition-colors"
            >
              <Clipboard className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setSourceText('')}
              title="Clear input"
              className="p-1.5 text-neutral-400 hover:text-red-400 rounded transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500">
          <span>{wordCount} Words • {sourceText.length} Characters</span>
          <span>~{Math.max(1, Math.ceil(wordCount / 200))} min read</span>
        </div>
      </div>

      {/* 2. Target Deliverables Selector */}
      <div className="bg-[#0b0c11]/85 backdrop-blur-2xl rounded-2xl p-5 border border-white/[0.08] shadow-[0_10px_40px_rgba(0,0,0,0.6)] space-y-3.5">
        <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-300 font-semibold">
              Target Deliverables
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-900 text-neutral-400 border border-white/[0.06]">
              {selectedFormats.length} / {ALL_FORMATS.length}
            </span>
          </div>

          <button
            onClick={selectAllFormats}
            className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 hover:text-red-400 transition-colors"
          >
            Select All
          </button>
        </div>

        {/* Clean Luxury Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {ALL_FORMATS.map((item) => {
            const isSelected = selectedFormats.includes(item.id);
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleFormat(item.id)}
                className={`p-3 rounded-xl border text-left transition-all duration-200 flex items-center justify-between group ${
                  isSelected
                    ? 'bg-neutral-900/90 border-red-500/50 text-white shadow-[0_0_20px_rgba(239,68,68,0.15)]'
                    : 'bg-[#050608]/70 border-white/[0.06] text-neutral-400 hover:text-white hover:border-white/[0.15]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg transition-colors ${
                    isSelected ? 'bg-red-500/20 text-red-400' : 'bg-neutral-900 text-neutral-500 group-hover:text-neutral-300'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-medium block leading-tight text-white">{item.name}</span>
                    <span className="text-[10px] font-mono text-neutral-500">{item.desc}</span>
                  </div>
                </div>

                {isSelected ? (
                  <CheckCircle className="w-4 h-4 text-red-500 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-neutral-700 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Collapsible Tuning Parameters */}
      <div className="bg-[#0b0c11]/85 backdrop-blur-2xl rounded-2xl border border-white/[0.08] shadow-[0_10px_40px_rgba(0,0,0,0.6)] overflow-hidden">
        <button
          type="button"
          onClick={() => setShowConfig(!showConfig)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-neutral-900/40 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-red-500" />
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-300 font-semibold">
              Tuning Parameters
            </span>
            <span className="text-[10px] font-mono text-neutral-500">
              ({parameters.targetAudience.split(' ')[0]} • {parameters.tone.split(' ')[0]})
            </span>
          </div>
          {showConfig ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
        </button>

        {showConfig && (
          <div className="p-5 pt-1 border-t border-white/[0.06] grid grid-cols-1 sm:grid-cols-2 gap-3.5 animate-fade-in">
            {/* Target Audience */}
            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                Target Audience
              </label>
              <select
                value={parameters.targetAudience}
                onChange={(e) => setParameters({ ...parameters, targetAudience: e.target.value })}
                className="w-full bg-[#050608] border border-white/[0.08] rounded-xl p-2.5 text-xs text-neutral-200 focus:outline-none focus:border-red-500/50"
              >
                <option value="Technical Specialists">Technical Specialists</option>
                <option value="C-Suite & Board">C-Suite & Board</option>
                <option value="Enterprise Customers & B2B">Enterprise B2B</option>
                <option value="General Public & Media">General Public & Media</option>
                <option value="Investors & Financial Analysts">Investors</option>
                <option value="Regulatory & Compliance Bodies">Regulatory Bodies</option>
              </select>
            </div>

            {/* Tone */}
            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                Tone & Voice
              </label>
              <select
                value={parameters.tone}
                onChange={(e) => setParameters({ ...parameters, tone: e.target.value })}
                className="w-full bg-[#050608] border border-white/[0.08] rounded-xl p-2.5 text-xs text-neutral-200 focus:outline-none focus:border-red-500/50"
              >
                <option value="Urgent & Action-Oriented">Urgent & Action-Oriented</option>
                <option value="Authoritative & Formal">Authoritative & Formal</option>
                <option value="Inspiring & Thought-Leadership">Inspiring Leadership</option>
                <option value="Conversational & Accessible">Conversational</option>
                <option value="Analytical & Objective">Analytical & Objective</option>
                <option value="Crisis Response / Calming">Crisis Response</option>
              </select>
            </div>

            {/* Language */}
            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                Output Language
              </label>
              <select
                value={parameters.language}
                onChange={(e) => setParameters({ ...parameters, language: e.target.value })}
                className="w-full bg-[#050608] border border-white/[0.08] rounded-xl p-2.5 text-xs text-neutral-200 focus:outline-none focus:border-red-500/50"
              >
                <option value="English (US)">English (US Standard)</option>
                <option value="English (UK)">English (UK Global)</option>
                <option value="Spanish (Español)">Spanish (Español)</option>
                <option value="French (Français)">French (Français)</option>
                <option value="German (Deutsch)">German (Deutsch)</option>
                <option value="Japanese (日本語)">Japanese (日本語)</option>
              </select>
            </div>

            {/* Level of Detail */}
            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                Level of Detail
              </label>
              <select
                value={parameters.levelOfDetail}
                onChange={(e) => setParameters({ ...parameters, levelOfDetail: e.target.value })}
                className="w-full bg-[#050608] border border-white/[0.08] rounded-xl p-2.5 text-xs text-neutral-200 focus:outline-none focus:border-red-500/50"
              >
                <option value="Concise / Executive Brief">Concise (30s Read)</option>
                <option value="Standard / Balanced">Standard Overview</option>
                <option value="Deep-Dive Comprehensive">Deep-Dive Comprehensive</option>
              </select>
            </div>

            {selectedFormats.includes('infographic') && (
              <div className="sm:col-span-2 border-t border-white/[0.06] pt-3 space-y-2.5">
                <label className="flex items-center gap-2 text-xs text-neutral-300">
                  <input
                    type="checkbox"
                    checked={parameters.generateConceptGraph ?? true}
                    onChange={(e) => setParameters({ ...parameters, generateConceptGraph: e.target.checked })}
                    className="accent-emerald-500"
                  />
                  Generate a concept relationship graph
                </label>
                {(parameters.generateConceptGraph ?? true) && (
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                      Graph Detail
                    </label>
                    <select
                      value={parameters.conceptGraphNodeLimit || 20}
                      onChange={(e) => setParameters({ ...parameters, conceptGraphNodeLimit: Number(e.target.value) })}
                      className="w-full bg-[#050608] border border-white/[0.08] rounded-xl p-2.5 text-xs text-neutral-200 focus:outline-none focus:border-red-500/50"
                    >
                      <option value="14">Compact · 14 concepts</option>
                      <option value="20">Standard · 20 concepts</option>
                      <option value="26">Detailed · 26 concepts</option>
                    </select>
                  </div>
                )}
              </div>
            )}

            {selectedFormats.includes('video') && (
              <div className="sm:col-span-2 border-t border-white/[0.06] pt-3 space-y-2.5">
                <label className="flex items-center gap-2 text-xs text-neutral-300">
                  <input
                    type="checkbox"
                    checked={parameters.includeYoutubeClips ?? true}
                    onChange={(e) => setParameters({ ...parameters, includeYoutubeClips: e.target.checked })}
                    className="accent-red-500"
                  />
                  Create YouTube Shorts clips from storyboard
                </label>
                {(parameters.includeYoutubeClips ?? true) && (
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                      Number of Clips
                    </label>
                    <select
                      value={parameters.youtubeClipCount || 3}
                      onChange={(e) => setParameters({ ...parameters, youtubeClipCount: Number(e.target.value) })}
                      className="w-full bg-[#050608] border border-white/[0.08] rounded-xl p-2.5 text-xs text-neutral-200 focus:outline-none focus:border-red-500/50"
                    >
                      {[1, 2, 3, 4, 5].map((count) => (
                        <option key={count} value={count}>{count} {count === 1 ? 'clip' : 'clips'}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. Primary Transform Button */}
      <button
        onClick={onTransform}
        disabled={isGenerating}
        className={`w-full py-4 px-6 rounded-2xl font-mono uppercase tracking-[0.2em] text-xs font-semibold flex items-center justify-center gap-3 transition-all duration-300 shadow-2xl ${
          isGenerating
            ? 'bg-neutral-900 border border-white/[0.06] text-neutral-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white shadow-[0_0_35px_rgba(239,68,68,0.4)] active:scale-[0.99]'
        }`}
      >
        {isGenerating ? (
          <>
            <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            <span>Synthesizing Studio Artefacts...</span>
          </>
        ) : (
          <>
            <Zap className="w-4 h-4 fill-current" />
            <span>TRANSFORM INTO {selectedFormats.length} ARTEFACTS</span>
          </>
        )}
      </button>
    </div>
  );
}
