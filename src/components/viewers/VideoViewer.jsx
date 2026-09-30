import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Copy,
  Check,
  Subtitles,
  Music,
  Sparkles,
  Volume2
} from 'lucide-react';
import YoutubeClipStudio from './YoutubeClipStudio';

export default function VideoViewer({ data }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedSRT, setCopiedSRT] = useState(false);
  const [copiedPromptIdx, setCopiedPromptIdx] = useState(null);

  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleTogglePlay = () => {
    if (!window.speechSynthesis) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(data.fullNarration);
      utterance.rate = 1.05;
      utterance.pitch = 0.95;
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(data.fullNarration);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopySRT = () => {
    navigator.clipboard.writeText(data.srtContent);
    setCopiedSRT(true);
    setTimeout(() => setCopiedSRT(false), 2000);
  };

  const handleCopyPrompt = (idx, prompt) => {
    navigator.clipboard.writeText(prompt);
    setCopiedPromptIdx(idx);
    setTimeout(() => setCopiedPromptIdx(null), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="p-4 rounded-xl bg-[#07080c] border border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/30">
              Video Package
            </span>
            <span className="text-xs text-neutral-400 font-mono">{data.duration}</span>
          </div>
          <h3 className="text-base font-semibold text-white">{data.title}</h3>
          <p className="text-xs text-neutral-400 mt-0.5 flex items-center gap-3">
            <span className="flex items-center gap-1 font-mono text-[11px]">
              <Music className="w-3 h-3 text-red-400" />
              {data.musicMood}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-mono text-[11px]">
              <Volume2 className="w-3 h-3 text-neutral-400" />
              {data.voiceRecommendation}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTogglePlay}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono uppercase tracking-wider font-semibold flex items-center gap-2 transition-all ${
              isPlaying
                ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)]'
                : 'bg-neutral-900 hover:bg-neutral-800 text-red-400 border border-red-500/40'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlaying ? 'Pause' : 'Listen Voice'}</span>
          </button>

          <button
            onClick={handleCopyScript}
            className="px-3 py-2 rounded-xl bg-neutral-900 border border-white/[0.08] text-neutral-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-all"
            title="Copy script"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Script</span>
          </button>

          <button
            onClick={handleCopySRT}
            className="px-3 py-2 rounded-xl bg-neutral-900 border border-white/[0.08] text-neutral-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-all"
            title="Copy subtitles"
          >
            {copiedSRT ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Subtitles className="w-3.5 h-3.5" />}
            <span>SRT</span>
          </button>
        </div>
      </div>

      {/* Storyboard Scenes */}
      <div className="space-y-3">
        {data.scenes.map((scene, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-[#07080c] border border-white/[0.06] hover:border-white/[0.15] transition-all space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/30">
                  Scene 0{scene.sceneNumber}
                </span>
                <span className="text-xs font-mono text-neutral-400">{scene.timestamp}</span>
                <span className="text-xs text-neutral-300 font-medium">({scene.phase})</span>
              </div>

              <button
                onClick={() => handleCopyPrompt(idx, scene.aiPrompt)}
                className="text-[11px] font-mono text-neutral-400 hover:text-red-400 flex items-center gap-1 transition-colors"
              >
                {copiedPromptIdx === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Sparkles className="w-3 h-3 text-red-400" />}
                <span>Copy AI Prompt</span>
              </button>
            </div>

            <div className="bg-[#040406] p-3 rounded-lg border border-white/[0.04]">
              <p className="text-xs text-neutral-200 font-sans leading-relaxed italic">
                "{scene.narration}"
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="bg-neutral-900/60 p-2.5 rounded-lg border border-white/[0.06] text-neutral-300">
                <span className="text-[10px] font-mono uppercase tracking-wider text-red-400 block mb-0.5">Camera:</span>
                {scene.cameraAngle}
              </div>
              <div className="bg-neutral-900/60 p-2.5 rounded-lg border border-white/[0.06] text-neutral-300">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-0.5">Visual FX:</span>
                {scene.visualCue}
              </div>
            </div>
          </div>
        ))}
      </div>

      <YoutubeClipStudio />
    </div>
  );
}
