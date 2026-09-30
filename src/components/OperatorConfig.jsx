import React from 'react';
import {
  Users,
  Volume2,
  Globe,
  SlidersHorizontal,
  Target,
  Palette,
  Sparkles
} from 'lucide-react';

export default function OperatorConfig({ parameters, setParameters }) {
  const updateParam = (key, value) => {
    setParameters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 shadow-2xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              Operator Control Matrix
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                6 Dimensional Tuning
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Configure audience, tone, language, depth, objectives, and styling parameters
            </p>
          </div>
        </div>
      </div>

      {/* Grid of configurable parameters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. Target Audience */}
        <div className="space-y-1.5 bg-slate-950/50 p-3 rounded-xl border border-slate-800/60">
          <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            Target Audience
          </label>
          <select
            value={parameters.targetAudience}
            onChange={(e) => updateParam('targetAudience', e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-medium"
          >
            <option value="Technical Specialists">Technical Specialists & Engineers</option>
            <option value="C-Suite & Board">C-Suite & Board of Directors</option>
            <option value="Enterprise Customers & B2B">Enterprise Customers & B2B Partners</option>
            <option value="General Public & Media">General Public & Media Outlets</option>
            <option value="Investors & Financial Analysts">Investors & Financial Analysts</option>
            <option value="Regulatory & Compliance Bodies">Regulatory & Compliance Bodies</option>
          </select>
          <p className="text-[11px] text-slate-400">Calibrates domain terminology and jargon density.</p>
        </div>

        {/* 2. Tone */}
        <div className="space-y-1.5 bg-slate-950/50 p-3 rounded-xl border border-slate-800/60">
          <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
            Tone & Voice
          </label>
          <select
            value={parameters.tone}
            onChange={(e) => updateParam('tone', e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-medium"
          >
            <option value="Urgent & Action-Oriented">Urgent & Action-Oriented</option>
            <option value="Authoritative & Formal">Authoritative & Formal</option>
            <option value="Inspiring & Thought-Leadership">Inspiring & Thought-Leadership</option>
            <option value="Conversational & Accessible">Conversational & Accessible</option>
            <option value="Analytical & Objective">Analytical & Objective</option>
            <option value="Crisis Response / Calming">Crisis Response / Calming</option>
          </select>
          <p className="text-[11px] text-slate-400">Controls urgency, emotional resonance, and pacing.</p>
        </div>

        {/* 3. Output Language */}
        <div className="space-y-1.5 bg-slate-950/50 p-3 rounded-xl border border-slate-800/60">
          <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            Output Language
          </label>
          <select
            value={parameters.language}
            onChange={(e) => updateParam('language', e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium"
          >
            <option value="English (US)">English (US Standard)</option>
            <option value="English (UK)">English (UK Global)</option>
            <option value="Spanish (Español)">Spanish (Español)</option>
            <option value="French (Français)">French (Français)</option>
            <option value="German (Deutsch)">German (Deutsch)</option>
            <option value="Japanese (日本語)">Japanese (日本語)</option>
            <option value="Mandarin Chinese (中文)">Mandarin Chinese (中文)</option>
            <option value="Arabic (العربية)">Arabic (العربية)</option>
          </select>
          <p className="text-[11px] text-slate-400">Localized syntax, date formats, and cultural idioms.</p>
        </div>

        {/* 4. Level of Detail */}
        <div className="space-y-1.5 bg-slate-950/50 p-3 rounded-xl border border-slate-800/60">
          <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
            Level of Detail
          </label>
          <select
            value={parameters.levelOfDetail}
            onChange={(e) => updateParam('levelOfDetail', e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-medium"
          >
            <option value="Concise / Executive Brief">Concise / Executive Brief (30-Sec Skim)</option>
            <option value="Standard / Balanced">Standard / Balanced Overview</option>
            <option value="Deep-Dive Comprehensive">Deep-Dive Comprehensive (Full Breakdown)</option>
          </select>
          <p className="text-[11px] text-slate-400">Adjusts token density, section counts, and context depth.</p>
        </div>

        {/* 5. Communication Objective */}
        <div className="space-y-1.5 bg-slate-950/50 p-3 rounded-xl border border-slate-800/60">
          <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-rose-400" />
            Communication Objective
          </label>
          <select
            value={parameters.communicationObjective}
            onChange={(e) => updateParam('communicationObjective', e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 font-medium"
          >
            <option value="Mitigate Risk & Alert">Mitigate Risk & Alert (Defensive)</option>
            <option value="Inform & Educate">Inform & Educate (Knowledge Transfer)</option>
            <option value="Drive Action / Conversion">Drive Action / Execution</option>
            <option value="Persuade & Influence">Persuade & Influence (Stakeholder Buy-in)</option>
            <option value="Foster Community Engagement">Foster Community & Social Reach</option>
          </select>
          <p className="text-[11px] text-slate-400">Guides the primary Call-To-Action and framing.</p>
        </div>

        {/* 6. Content Style */}
        <div className="space-y-1.5 bg-slate-950/50 p-3 rounded-xl border border-slate-800/60">
          <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-purple-400" />
            Content Style
          </label>
          <select
            value={parameters.contentStyle}
            onChange={(e) => updateParam('contentStyle', e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-medium"
          >
            <option value="Cyber Tactical">Cyber Tactical (Dark Tech, Precise)</option>
            <option value="Enterprise Corporate">Enterprise Corporate (Polished, C-Suite)</option>
            <option value="Modern Minimalist">Modern Minimalist (High whitespace, punchy)</option>
            <option value="Editorial Journalistic">Editorial Journalistic (Investigative, Story)</option>
            <option value="Creative Storytelling">Creative Storytelling (Metaphors, Impact)</option>
          </select>
          <p className="text-[11px] text-slate-400">Shapes visual prompts, formatting layouts, and structure.</p>
        </div>
      </div>
    </div>
  );
}
