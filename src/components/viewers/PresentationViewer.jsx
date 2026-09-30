import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Mic,
  Copy,
  Check
} from 'lucide-react';

export default function PresentationViewer({ data }) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showNotes, setShowNotes] = useState(true);
  const [copiedNotes, setCopiedNotes] = useState(false);

  const slides = data.slides || [];
  const currentSlide = slides[currentSlideIndex] || slides[0];

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev < slides.length - 1 ? prev + 1 : prev));
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length]);

  const handleCopyNotes = () => {
    navigator.clipboard.writeText(currentSlide.speakerNotes);
    setCopiedNotes(true);
    setTimeout(() => setCopiedNotes(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Deck Controls */}
      <div className="p-3.5 rounded-xl bg-[#07080c] border border-white/[0.08] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/30">
            Slide Deck
          </span>
          <span className="text-xs text-neutral-200 font-semibold">{data.deckTitle}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={prevSlide}
            disabled={currentSlideIndex === 0}
            className="p-1.5 rounded-lg bg-neutral-900 border border-white/[0.08] text-neutral-300 disabled:opacity-30 hover:bg-neutral-800"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-mono text-neutral-400">
            {currentSlideIndex + 1} / {slides.length}
          </span>

          <button
            onClick={nextSlide}
            disabled={currentSlideIndex === slides.length - 1}
            className="p-1.5 rounded-lg bg-neutral-900 border border-white/[0.08] text-neutral-300 disabled:opacity-30 hover:bg-neutral-800"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 border transition-all ${
              showNotes
                ? 'bg-red-500/20 border-red-500/40 text-red-300'
                : 'bg-neutral-900 border-white/[0.08] text-neutral-400'
            }`}
          >
            <Mic className="w-3 h-3" />
            <span>Notes</span>
          </button>
        </div>
      </div>

      {/* Main Slide Canvas (16:9) */}
      <div className="w-full aspect-[16/9] max-h-[460px] bg-[#040406] border border-white/[0.08] rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative shadow-2xl">
        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-red-400">
            {currentSlide.badge}
          </span>
          <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight">
            {currentSlide.title}
          </h2>
          <p className="text-xs text-neutral-400">{currentSlide.subtitle}</p>
        </div>

        <div className="my-3 space-y-2">
          {currentSlide.bullets.map((b, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-200">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
              <span>{b}</span>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-[10px] font-mono text-neutral-500">
          <span>STUDIO EXECUTIVE BRIEFING</span>
          <span>Slide 0{currentSlideIndex + 1} of 0{slides.length}</span>
        </div>
      </div>

      {/* Slide Thumbnails */}
      <div className="grid grid-cols-5 gap-2">
        {slides.map((slide, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlideIndex(idx)}
            className={`p-2 rounded-lg border text-left text-xs transition-all ${
              currentSlideIndex === idx
                ? 'bg-neutral-900 border-red-500/60 text-red-400'
                : 'bg-[#07080c] border-white/[0.06] text-neutral-500 hover:text-white'
            }`}
          >
            <span className="font-mono text-[10px] block">0{idx + 1}</span>
            <span className="line-clamp-1">{slide.title}</span>
          </button>
        ))}
      </div>

      {/* Presenter Speaker Notes */}
      {showNotes && (
        <div className="p-3.5 rounded-xl bg-[#07080c] border border-white/[0.06] space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-red-400 font-bold flex items-center gap-1">
              <Mic className="w-3 h-3" />
              Speaker Notes (Slide {currentSlideIndex + 1})
            </span>
            <button
              onClick={handleCopyNotes}
              className="text-[10px] font-mono text-neutral-400 hover:text-white flex items-center gap-1"
            >
              {copiedNotes ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>Copy Notes</span>
            </button>
          </div>
          <p className="text-xs text-neutral-300 font-sans italic leading-relaxed">
            "{currentSlide.speakerNotes}"
          </p>
        </div>
      )}
    </div>
  );
}
