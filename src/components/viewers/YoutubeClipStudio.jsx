import React, { useState } from 'react';
import { Download, Play, Video } from 'lucide-react';

const EXAMPLE_URL = 'https://youtu.be/Pmd6knanPKw?si=fxRbBWU4eNrpy-ke';
const DEMO_STARTS = [12, 58, 126, 234, 398, 552];

function getVideoId(value) {
  try {
    const url = new URL(value.trim());
    const hostname = url.hostname.replace(/^www\./, '').replace(/^m\./, '');
    let videoId = null;

    if (hostname === 'youtu.be') {
      videoId = url.pathname.split('/').filter(Boolean)[0];
    } else if (hostname === 'youtube.com' || hostname === 'youtube-nocookie.com') {
      videoId = url.searchParams.get('v');
      if (!videoId) {
        const pathParts = url.pathname.split('/').filter(Boolean);
        if (['embed', 'shorts', 'live'].includes(pathParts[0])) videoId = pathParts[1];
      }
    }

    return videoId && /^[A-Za-z0-9_-]{11}$/.test(videoId) ? videoId : null;
  } catch {
    return null;
  }
}

function createClips() {
  return DEMO_STARTS.map((start, index) => ({
    id: index + 1,
    start,
    end: start + 30,
  }));
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function downloadJson(filename, content) {
  const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function YoutubeClipStudio() {
  const [inputUrl, setInputUrl] = useState(EXAMPLE_URL);
  const [sourceUrl, setSourceUrl] = useState(EXAMPLE_URL);
  const [videoId, setVideoId] = useState(getVideoId(EXAMPLE_URL));
  const [clips, setClips] = useState(createClips);
  const [activeClipId, setActiveClipId] = useState(1);
  const [previewKey, setPreviewKey] = useState(0);
  const [error, setError] = useState('');

  const activeClip = clips.find((clip) => clip.id === activeClipId) || clips[0];
  const activeEnd = Math.max(activeClip.start + 1, activeClip.end);
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?start=${activeClip.start}&end=${activeEnd}&controls=1&rel=0&modestbranding=1`;

  const generateClips = (event) => {
    event.preventDefault();
    const parsedVideoId = getVideoId(inputUrl);
    if (!parsedVideoId) {
      setError('Enter a valid YouTube video, Shorts, or youtu.be link.');
      return;
    }

    setError('');
    setVideoId(parsedVideoId);
    setSourceUrl(inputUrl.trim());
    setClips(createClips());
    setActiveClipId(1);
    setPreviewKey((key) => key + 1);
  };

  const updateClip = (clipId, field, value) => {
    setClips((currentClips) => currentClips.map((clip) => {
      if (clip.id !== clipId) return clip;
      const minimum = field === 'end' ? clip.start + 1 : 0;
      const nextValue = Math.max(minimum, Number(value) || 0);
      return {
        ...clip,
        [field]: nextValue,
        ...(field === 'start' && nextValue >= clip.end ? { end: nextValue + 1 } : {}),
      };
    }));
  };

  const makeCutList = (clip) => ({
    title: `YouTube Clip ${String(clip.id).padStart(2, '0')}`,
    sourceUrl,
    videoId,
    startSeconds: clip.start,
    endSeconds: Math.max(clip.start + 1, clip.end),
    durationSeconds: Math.max(1, clip.end - clip.start),
    previewUrl: `https://www.youtube.com/watch?v=${videoId}&t=${clip.start}s`,
    note: 'Timestamp cut instructions only. This file does not contain or download video media.',
  });

  const previewClip = (clip) => {
    setActiveClipId(clip.id);
    setPreviewKey((key) => key + 1);
  };

  return (
    <section className="space-y-4 rounded-xl border border-white/[0.08] bg-[#090b0f] p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <span className="rounded-lg border border-red-500/25 bg-red-500/10 p-2 text-red-400">
            <Video className="h-4 w-4" />
          </span>
          <div>
            <h4 className="text-sm font-semibold text-white">YouTube Clip Studio</h4>
            <p className="mt-1 text-[11px] text-neutral-500">Example demo · six editable 30-second cut ranges</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => downloadJson('youtube-clip-cut-list.json', {
            sourceUrl,
            videoId,
            clips: clips.map(makeCutList),
          })}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.1] bg-neutral-900 px-3 py-2 text-[11px] font-mono text-neutral-300 transition-colors hover:border-white/25 hover:text-white"
        >
          <Download className="h-3.5 w-3.5" />
          Download all cut info
        </button>
      </div>

      <form onSubmit={generateClips} className="flex flex-col gap-2 sm:flex-row">
        <label className="sr-only" htmlFor="youtube-source-url">YouTube video link</label>
        <input
          id="youtube-source-url"
          type="url"
          value={inputUrl}
          onChange={(event) => setInputUrl(event.target.value)}
          placeholder="Paste a YouTube video link"
          className="min-w-0 flex-1 rounded-lg border border-white/[0.1] bg-[#050608] px-3 py-2.5 text-xs text-neutral-200 placeholder:text-neutral-600 focus:border-red-500/50 focus:outline-none"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-red-500"
        >
          <Video className="h-4 w-4" />
          Generate 6 clips
        </button>
      </form>
      {error && <p role="alert" className="text-xs text-rose-400">{error}</p>}

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="min-w-0 space-y-2">
          <div className="relative aspect-video overflow-hidden rounded-lg border border-white/[0.08] bg-black">
            <iframe
              key={`${videoId}-${activeClip.id}-${previewKey}`}
              src={embedUrl}
              title={`YouTube Clip ${String(activeClip.id).padStart(2, '0')} preview`}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
            <span className="text-neutral-300">Previewing clip {String(activeClip.id).padStart(2, '0')}</span>
            <span className="text-neutral-500">{formatTime(activeClip.start)}–{formatTime(activeEnd)} · {activeEnd - activeClip.start}s</span>
          </div>
        </div>

        <div className="max-h-[370px] space-y-2 overflow-y-auto pr-1" aria-label="Generated YouTube clips">
          {clips.map((clip) => (
            <article
              key={clip.id}
              className={`rounded-lg border p-3 transition-colors ${activeClipId === clip.id ? 'border-red-500/40 bg-red-500/[0.06]' : 'border-white/[0.07] bg-[#07080b]'}`}
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono uppercase text-red-400">Clip {String(clip.id).padStart(2, '0')}</span>
                  <p className="mt-0.5 text-[11px] text-neutral-400">{formatTime(clip.start)}–{formatTime(Math.max(clip.start + 1, clip.end))}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => previewClip(clip)}
                    aria-label={`Watch clip ${clip.id}`}
                    title="Preview this timestamp range"
                    className="rounded-md p-2 text-neutral-300 hover:bg-white/[0.08] hover:text-white"
                  >
                    <Play className="h-4 w-4 fill-current" />
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadJson(`youtube-clip-${String(clip.id).padStart(2, '0')}.json`, makeCutList(clip))}
                    aria-label={`Download cut info for clip ${clip.id}`}
                    title="Download timestamp cut info"
                    className="rounded-md p-2 text-neutral-400 hover:bg-white/[0.08] hover:text-white"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <label className="text-[9px] font-mono uppercase text-neutral-500">
                  In · seconds
                  <input
                    type="number"
                    min="0"
                    value={clip.start}
                    onChange={(event) => updateClip(clip.id, 'start', event.target.value)}
                    className="mt-1 w-full rounded-md border border-white/[0.08] bg-black px-2 py-1.5 text-[11px] text-neutral-200 focus:border-red-500/50 focus:outline-none"
                  />
                </label>
                <label className="text-[9px] font-mono uppercase text-neutral-500">
                  Out · seconds
                  <input
                    type="number"
                    min={clip.start + 1}
                    value={clip.end}
                    onChange={(event) => updateClip(clip.id, 'end', event.target.value)}
                    className="mt-1 w-full rounded-md border border-white/[0.08] bg-black px-2 py-1.5 text-[11px] text-neutral-200 focus:border-red-500/50 focus:outline-none"
                  />
                </label>
              </div>
            </article>
          ))}
        </div>
      </div>

      <p className="border-t border-white/[0.06] pt-3 text-[10px] leading-relaxed text-neutral-500">
        Previews use YouTube's player. Downloads are timestamp cut lists, not video files; exporting MP4 clips requires access to the source media.
      </p>
    </section>
  );
}