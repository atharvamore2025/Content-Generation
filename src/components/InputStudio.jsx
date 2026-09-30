import React, { useState } from 'react';
import {
  FileText,
  UploadCloud,
  BookmarkCheck,
  Clipboard,
  Trash2,
  Sliders,
  Shield,
  Building,
  User,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import TiltCard from './TiltCard';
import { SAMPLE_PRESETS } from '../data/samplePresets';

export default function InputStudio({
  sourceText,
  setSourceText,
  activePresetId,
  onSelectPreset,
  metadata,
  setMetadata,
}) {
  const [activeTab, setActiveTab] = useState('text'); // 'text' | 'file' | 'presets'
  const [dragActive, setDragActive] = useState(false);
  const [showMeta, setShowMeta] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');

  // Computations
  const wordCount = sourceText.trim() ? sourceText.trim().split(/\s+/).length : 0;
  const charCount = sourceText.length;
  const readTimeMins = Math.max(1, Math.ceil(wordCount / 200));

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setSourceText(text);
    } catch {
      // Fallback
    }
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      if (typeof content === 'string') {
        setSourceText(content);
        setActiveTab('text');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 shadow-2xl relative">
      {/* Studio Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              Source Content Ingestion
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                Multi-Modal Ingest
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Submit raw articles, threat intelligence, reports, research or contextual prompts
            </p>
          </div>
        </div>

        {/* Ingest Mode Tabs */}
        <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('text')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'text'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Direct Text
          </button>
          <button
            onClick={() => setActiveTab('file')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'file'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            File Upload
          </button>
          <button
            onClick={() => setActiveTab('presets')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'presets'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <BookmarkCheck className="w-3.5 h-3.5" />
            Preset Library
          </button>
        </div>
      </div>

      {/* Tab: Direct Text Ingestion */}
      {activeTab === 'text' && (
        <div className="space-y-3">
          <div className="relative group">
            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Paste raw article, advisory, incident report, policy document, or research findings here..."
              rows={9}
              className="w-full bg-slate-950/70 border border-slate-800/90 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono leading-relaxed resize-y"
            />
            {/* Quick action floating buttons */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-slate-900/90 border border-slate-800/90 rounded-lg p-1 shadow-md opacity-90 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={handlePaste}
                title="Paste from Clipboard"
                className="p-1.5 text-slate-400 hover:text-indigo-300 hover:bg-slate-800 rounded transition-all"
              >
                <Clipboard className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setSourceText('')}
                title="Clear content"
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Real-time stats footer */}
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 font-mono gap-2">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {wordCount} Words
              </span>
              <span>•</span>
              <span>{charCount} Characters</span>
              <span>•</span>
              <span>~{readTimeMins} min read</span>
            </div>

            <button
              onClick={() => setShowMeta(!showMeta)}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-sans transition-colors"
            >
              <Sliders className="w-3 h-3" />
              {showMeta ? 'Hide Context Metadata' : '+ Add Contextual Metadata (Org, Author, Classification)'}
            </button>
          </div>
        </div>
      )}

      {/* Tab: File Upload Dropzone */}
      {activeTab === 'file' && (
        <div
          onDragEnter={() => setDragActive(true)}
          onDragLeave={() => setDragActive(false)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            dragActive
              ? 'border-indigo-500 bg-indigo-500/10'
              : 'border-slate-800 hover:border-slate-700 bg-slate-950/40'
          }`}
        >
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <UploadCloud className="w-7 h-7" />
          </div>
          <h3 className="text-sm font-semibold text-white mb-1">
            Drop document, report, or text file here
          </h3>
          <p className="text-xs text-slate-400 mb-4 max-w-sm mx-auto">
            Supports .txt, .md, .json, .csv, and structured telemetry extracts. Raw text will be automatically parsed.
          </p>

          <label className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-xl cursor-pointer shadow-lg shadow-indigo-600/30 transition-all">
            <FileText className="w-4 h-4" />
            Browse Local File
            <input
              type="file"
              onChange={handleFileInput}
              className="hidden"
              accept=".txt,.md,.json,.csv,.log,.html"
            />
          </label>

          {uploadedFileName && (
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-emerald-400 font-mono">
              <FileCheck className="w-4 h-4" />
              Loaded: {uploadedFileName} ({wordCount} words)
            </div>
          )}
        </div>
      )}

      {/* Tab: Preset Library */}
      {activeTab === 'presets' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {SAMPLE_PRESETS.map((preset) => {
            const isSelected = activePresetId === preset.id;
            return (
              <TiltCard
                key={preset.id}
                onClick={() => {
                  onSelectPreset(preset);
                  setActiveTab('text');
                }}
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-950/30 ring-1 ring-indigo-500/50'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/90'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border ${
                      preset.badgeColor === 'red'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : preset.badgeColor === 'purple'
                        ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                        : preset.badgeColor === 'emerald'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {preset.badge}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">{preset.category}</span>
                </div>
                <h4 className="text-sm font-semibold text-white mb-1 line-clamp-1">
                  {preset.title}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {preset.content.slice(0, 140)}...
                </p>
                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>By: {preset.author.split(' ')[0]}</span>
                  <span className="text-indigo-400 hover:underline">Click to Load →</span>
                </div>
              </TiltCard>
            );
          })}
        </div>
      )}

      {/* Collapsible Context Metadata Drawer */}
      {showMeta && (
        <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950/50 p-3 rounded-xl">
          <div>
            <label className="text-[11px] font-mono text-slate-400 flex items-center gap-1 mb-1">
              <Building className="w-3 h-3 text-cyan-400" />
              Organization / Department
            </label>
            <input
              type="text"
              value={metadata.organization}
              onChange={(e) => setMetadata({ ...metadata, organization: e.target.value })}
              placeholder="e.g. Cyber Resilience Unit"
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono text-slate-400 flex items-center gap-1 mb-1">
              <User className="w-3 h-3 text-indigo-400" />
              Spokesperson / Author
            </label>
            <input
              type="text"
              value={metadata.author}
              onChange={(e) => setMetadata({ ...metadata, author: e.target.value })}
              placeholder="e.g. Chief Information Security Officer"
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono text-slate-400 flex items-center gap-1 mb-1">
              <Shield className="w-3 h-3 text-rose-400" />
              Classification
            </label>
            <select
              value={metadata.classification}
              onChange={(e) => setMetadata({ ...metadata, classification: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="Public Release">Public Release (Unrestricted)</option>
              <option value="Internal Enterprise Only">Internal Enterprise Only</option>
              <option value="Confidential // Restricted">Confidential // Restricted</option>
              <option value="TLP:AMBER+STRICT">TLP:AMBER+STRICT</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
