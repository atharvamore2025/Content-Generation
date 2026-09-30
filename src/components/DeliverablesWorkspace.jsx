import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  Video,
  ShieldAlert,
  BarChart3,
  FileCheck2,
  Presentation
} from 'lucide-react';
import { LinkedInIcon, TwitterXIcon } from './icons/SocialIcons';
import VideoViewer from './viewers/VideoViewer';
import LinkedInViewer from './viewers/LinkedInViewer';
import TwitterViewer from './viewers/TwitterViewer';
import AdvisoryViewer from './viewers/AdvisoryViewer';
import InfographicViewer from './viewers/InfographicViewer';
import ExecutiveSummaryViewer from './viewers/ExecutiveSummaryViewer';
import PresentationViewer from './viewers/PresentationViewer';

const FORMAT_CONFIG = {
  video: { name: 'Video Package', icon: Video },
  linkedin: { name: 'LinkedIn Post', icon: LinkedInIcon },
  twitter: { name: 'Twitter / X', icon: TwitterXIcon },
  advisory: { name: 'Advisory', icon: ShieldAlert },
  infographic: { name: 'Infographic', icon: BarChart3 },
  executiveSummary: { name: 'Exec Summary', icon: FileCheck2 },
  presentation: { name: 'Presentation', icon: Presentation },
};

export default function DeliverablesWorkspace({
  generatedData,
  metadata,
  parameters
}) {
  const { results, analysis } = generatedData;
  const availableFormatKeys = Object.keys(results);

  const [activeTab, setActiveTab] = useState(availableFormatKeys[0] || 'video');
  const [copiedAll, setCopiedAll] = useState(false);

  const currentTab = availableFormatKeys.includes(activeTab)
    ? activeTab
    : availableFormatKeys[0];

  const handleCopyAll = () => {
    navigator.clipboard.writeText(JSON.stringify(generatedData, null, 2));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(generatedData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `studio-artefacts-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderActiveViewer = () => {
    const data = results[currentTab];
    if (!data) return null;

    switch (currentTab) {
      case 'video':
        return <VideoViewer data={data} />;
      case 'linkedin':
        return <LinkedInViewer data={data} metadata={metadata} />;
      case 'twitter':
        return <TwitterViewer data={data} metadata={metadata} />;
      case 'advisory':
        return <AdvisoryViewer data={data} metadata={metadata} />;
      case 'infographic':
        return <InfographicViewer data={data} />;
      case 'executiveSummary':
        return <ExecutiveSummaryViewer data={data} metadata={metadata} />;
      case 'presentation':
        return <PresentationViewer data={data} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#0b0c11]/85 backdrop-blur-2xl rounded-2xl border border-white/[0.08] shadow-[0_10px_40px_rgba(0,0,0,0.6)] p-6 space-y-6">
      {/* Top Deliverables Nav Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        {/* Format Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {availableFormatKeys.map((key) => {
            const conf = FORMAT_CONFIG[key] || { name: key, icon: Video };
            const Icon = conf.icon;
            const isSelected = currentTab === key;

            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-all duration-200 ${
                  isSelected
                    ? 'bg-neutral-800 text-white border border-red-500/60 shadow-[0_0_20px_rgba(239,68,68,0.25)]'
                    : 'bg-[#050608]/80 border border-white/[0.06] text-neutral-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{conf.name}</span>
              </button>
            );
          })}
        </div>

        {/* Global Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopyAll}
            className="px-3 py-1.5 rounded-xl bg-neutral-900/90 border border-white/[0.08] text-neutral-400 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-all"
            title="Copy full JSON bundle"
          >
            {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-neutral-400" />}
            <span>Copy Bundle</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="px-3.5 py-1.5 rounded-xl bg-red-600/20 border border-red-500/40 text-red-300 hover:bg-red-600/30 text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Rendered Viewer Panel */}
      <div className="min-h-[500px]">
        {renderActiveViewer()}
      </div>
    </div>
  );
}
