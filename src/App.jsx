import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import ThreeCanvas from './components/ThreeCanvas';
import Header from './components/Header';
import InputPanel from './components/InputPanel';
import DeliverablesWorkspace from './components/DeliverablesWorkspace';
import { SAMPLE_PRESETS } from './data/samplePresets';
import { transformContent } from './utils/generatorEngine';

export default function App() {
  const [activePreset, setActivePreset] = useState(SAMPLE_PRESETS[0]);
  const [sourceText, setSourceText] = useState(SAMPLE_PRESETS[0].content);
  const [show3D, setShow3D] = useState(true);

  const [parameters, setParameters] = useState({
    targetAudience: SAMPLE_PRESETS[0].targetAudience || 'Technical Specialists',
    tone: SAMPLE_PRESETS[0].tone || 'Urgent & Action-Oriented',
    language: SAMPLE_PRESETS[0].language || 'English (US)',
    levelOfDetail: SAMPLE_PRESETS[0].levelOfDetail || 'Deep-Dive Comprehensive',
    communicationObjective: SAMPLE_PRESETS[0].communicationObjective || 'Mitigate Risk & Alert',
    contentStyle: SAMPLE_PRESETS[0].contentStyle || 'Cyber Tactical',
    generateConceptGraph: true,
    conceptGraphNodeLimit: 20,
    includeYoutubeClips: true,
    youtubeClipCount: 3,
  });

  const [metadata, setMetadata] = useState({
    organization: 'Global Cyber Defense Center (GCDC)',
    author: 'Operational Intelligence Directorate',
    classification: 'Confidential // Restricted',
  });

  const [selectedFormats, setSelectedFormats] = useState([
    'video',
    'linkedin',
    'twitter',
    'advisory',
    'infographic',
    'executiveSummary',
    'presentation',
  ]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState(null);

  // Switch preset
  const handleSelectPreset = (preset) => {
    setActivePreset(preset);
    setSourceText(preset.content);
    setParameters({
      targetAudience: preset.targetAudience || 'Technical Specialists',
      tone: preset.tone || 'Urgent & Action-Oriented',
      language: preset.language || 'English (US)',
      levelOfDetail: preset.levelOfDetail || 'Deep-Dive Comprehensive',
      communicationObjective: preset.communicationObjective || 'Mitigate Risk & Alert',
      contentStyle: preset.contentStyle || 'Cyber Tactical',
      generateConceptGraph: true,
      conceptGraphNodeLimit: 20,
      includeYoutubeClips: true,
      youtubeClipCount: 3,
    });
    setMetadata({
      organization: preset.author || 'Intelligence Office',
      author: preset.author || 'Chief Communications Officer',
      classification: preset.badgeColor === 'red' ? 'Confidential // Restricted' : 'Public Release',
    });
  };

  // Transform execution
  const handleTransform = () => {
    if (!sourceText.trim()) return;

    setIsGenerating(true);

    setTimeout(() => {
      const transformed = transformContent({
        sourceText,
        parameters,
        selectedFormats,
      });

      setGeneratedData(transformed);
      setIsGenerating(false);

      try {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.5 },
          colors: ['#ef4444', '#dc2626', '#ffffff', '#71717a', '#f59e0b'],
        });
      } catch {
        // safe fallback
      }
    }, 850);
  };

  const handleReset = () => {
    setSourceText('');
    setGeneratedData(null);
    setActivePreset(null);
  };

  // Initial load auto-generate
  useEffect(() => {
    const initialTransformed = transformContent({
      sourceText: SAMPLE_PRESETS[0].content,
      parameters,
      selectedFormats,
    });
    setGeneratedData(initialTransformed);
  }, []);

  return (
    <div className="min-h-screen bg-[#060608] text-neutral-100 relative selection:bg-red-500 selection:text-white font-sans">
      {/* Luxury 3D Studio Canvas */}
      {show3D && <ThreeCanvas isGenerating={isGenerating} />}

      {/* Header */}
      <Header
        onSelectPreset={handleSelectPreset}
        activePresetId={activePreset?.id}
        show3D={show3D}
        setShow3D={setShow3D}
        onReset={handleReset}
        onTransform={handleTransform}
        isGenerating={isGenerating}
      />

      {/* Main Studio 2-Column Split Layout */}
      <main className="relative z-10 max-w-[1700px] mx-auto px-4 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Source Ingestion, Formats & Config (5 of 12 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <InputPanel
              sourceText={sourceText}
              setSourceText={setSourceText}
              activePresetId={activePreset?.id}
              onSelectPreset={handleSelectPreset}
              parameters={parameters}
              setParameters={setParameters}
              selectedFormats={selectedFormats}
              setSelectedFormats={setSelectedFormats}
              onTransform={handleTransform}
              isGenerating={isGenerating}
            />
          </div>

          {/* Right Column: Synthesized Deliverables Workspace (7 of 12 cols) */}
          <div className="lg:col-span-7">
            {generatedData ? (
              <DeliverablesWorkspace
                generatedData={generatedData}
                metadata={metadata}
                parameters={parameters}
              />
            ) : (
              <div className="bg-[#0b0c11]/85 backdrop-blur-2xl rounded-2xl border border-white/[0.08] p-12 text-center text-neutral-400 space-y-2">
                <p className="text-sm font-mono text-neutral-300">Studio Standby</p>
                <p className="text-xs">Select target deliverables on the left and click "Transform" to generate.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] bg-[#060608]/90 py-4 px-6 text-center text-[11px] text-neutral-500 font-mono">
        STUDIO // AI Content Transformation Engine • Three.js 3D WebGL & React 19
      </footer>
    </div>
  );
}
