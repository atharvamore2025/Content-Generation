import React from 'react';
import { Sparkles, Eye, EyeOff, RotateCcw, Zap } from 'lucide-react';
import { SAMPLE_PRESETS } from '../data/samplePresets';

export default function Header({
  onSelectPreset,
  activePresetId,
  show3D,
  setShow3D,
  onReset,
  onTransform,
  isGenerating
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#060608]/90 backdrop-blur-2xl px-6 lg:px-12 py-4 transition-all">
      <div className="max-w-[1700px] mx-auto flex items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-[0_0_12px_#ff2244] animate-pulse" />
          <div className="flex items-center gap-2.5">
            <span className="text-sm font-semibold tracking-[0.25em] uppercase text-white font-mono">
              STUDIO
            </span>
            <span className="text-neutral-600">/</span>
            <span className="text-xs tracking-[0.15em] uppercase text-neutral-400 font-mono">
              AI TRANSFORM ENGINE
            </span>
          </div>
        </div>

        {/* Minimalist Presets Menu */}
        <div className="hidden md:flex items-center gap-1 bg-neutral-950/80 border border-white/[0.06] p-1 rounded-full">
          <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-500 pl-3 pr-2">
            Preset:
          </span>
          {SAMPLE_PRESETS.map((p) => {
            const isSelected = activePresetId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onSelectPreset(p)}
                className={`text-[11px] font-mono uppercase tracking-wider px-3 py-1 rounded-full transition-all ${
                  isSelected
                    ? 'bg-neutral-800 text-white border border-white/20 shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
                }`}
              >
                {p.category.split(' ')[0]}
              </button>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* 3D Visualizer Toggle */}
          <button
            onClick={() => setShow3D(!show3D)}
            title="Toggle Studio 3D Canvas"
            className="p-2 rounded-xl bg-neutral-950/80 border border-white/[0.08] text-neutral-400 hover:text-white hover:border-white/20 transition-all flex items-center gap-1.5"
          >
            {show3D ? <Eye className="w-3.5 h-3.5 text-red-500" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span className="font-mono text-[10px] uppercase tracking-wider hidden sm:inline">
              3D {show3D ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* Reset */}
          <button
            onClick={onReset}
            title="Reset Workspace"
            className="p-2 rounded-xl bg-neutral-950/80 border border-white/[0.08] text-neutral-400 hover:text-red-400 hover:border-white/20 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Transform Action CTA */}
          <button
            onClick={onTransform}
            disabled={isGenerating}
            className={`px-5 py-2 rounded-full text-xs font-mono uppercase tracking-[0.15em] font-medium flex items-center gap-2 transition-all duration-300 ${
              isGenerating
                ? 'bg-neutral-800 text-neutral-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white shadow-[0_0_25px_rgba(239,68,68,0.4)] active:scale-95'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : 'fill-current'}`} />
            <span>{isGenerating ? 'Synthesizing...' : 'Transform'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
