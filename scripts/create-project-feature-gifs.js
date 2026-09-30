import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import gifenc from 'gifenc';
import sharp from 'sharp';
import { SAMPLE_PRESETS } from '../src/data/samplePresets.js';
import { transformContent } from '../src/utils/generatorEngine.js';

const { applyPalette, GIFEncoder, quantize } = gifenc;
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDirectory = path.join(projectRoot, 'video');
const width = 1200;
const height = 720;
const videoId = 'Pmd6knanPKw';
const parameters = {
  targetAudience: SAMPLE_PRESETS[0].targetAudience,
  tone: SAMPLE_PRESETS[0].tone,
  communicationObjective: SAMPLE_PRESETS[0].communicationObjective,
  contentStyle: SAMPLE_PRESETS[0].contentStyle,
  generateConceptGraph: true,
  conceptGraphNodeLimit: 20,
  includeYoutubeClips: true,
  youtubeClipCount: 6,
};
const formats = ['video', 'linkedin', 'twitter', 'advisory', 'infographic', 'executiveSummary', 'presentation'];
const sourcePreset = SAMPLE_PRESETS[0];
const generated = transformContent({
  sourceText: sourcePreset.content,
  parameters,
  selectedFormats: formats,
});
const result = generated.results;

const esc = (value) => String(value ?? '').replace(/[<>&"']/g, (character) => ({
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;',
  '"': '&quot;',
  "'": '&apos;',
}[character]));

function wrap(text, limit, maxLines = 5) {
  const words = String(text ?? '').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);
  const lines = [];
  let line = '';
  for (const word of words) {
    if ((line + ' ' + word).trim().length > limit && line) {
      lines.push(line);
      line = word;
      if (lines.length >= maxLines) break;
    } else {
      line = (line + ' ' + word).trim();
    }
  }
  if (line && lines.length < maxLines) lines.push(line);
  if (lines.length === maxLines && words.join(' ').length > lines.join(' ').length) {
    lines[maxLines - 1] = `${lines[maxLines - 1].replace(/[.\s]+$/, '')}...`;
  }
  return lines;
}

function text(x, y, value, options = {}) {
  const {
    size = 15,
    color = '#dce5eb',
    chars = 70,
    lines = 3,
    weight = 400,
    family = 'Arial, sans-serif',
    lineHeight = 22,
    anchor = 'start',
  } = options;
  const wrapped = wrap(value, chars, lines);
  return `<text x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${wrapped.map((line, index) => `<tspan x="${x}" dy="${index === 0 ? 0 : lineHeight}">${esc(line)}</tspan>`).join('')}</text>`;
}

function chip(x, y, label, color = '#ef4444', widthHint = 140) {
  const chipWidth = Math.max(88, label.length * 8 + 24, widthHint);
  return `<rect x="${x}" y="${y}" width="${chipWidth}" height="30" rx="7" fill="${color}" fill-opacity="0.14" stroke="${color}" stroke-opacity="0.35"/><text x="${x + 12}" y="${y + 20}" fill="${color}" font-family="ui-monospace,Consolas,monospace" font-size="11">${esc(label.toUpperCase())}</text>`;
}

function shell({ section, title, subtitle, activeFormat, body }) {
  const navItems = [
    ['Video Package', 'video'],
    ['LinkedIn Post', 'linkedin'],
    ['Twitter / X', 'twitter'],
    ['Advisory', 'advisory'],
    ['Infographic', 'infographic'],
    ['Exec Summary', 'executiveSummary'],
    ['Presentation', 'presentation'],
  ];
  const nav = navItems.map(([label, key], index) => {
    const active = activeFormat === key;
    const y = 142 + index * 55;
    return `<rect x="32" y="${y}" width="205" height="43" rx="8" fill="${active ? '#282426' : '#0b0d11'}" stroke="${active ? '#ef4444' : '#262a30'}" stroke-opacity="${active ? 0.7 : 0.9}"/><circle cx="53" cy="${y + 21}" r="5" fill="${active ? '#fb7185' : '#56616b'}"/><text x="68" y="${y + 25}" fill="${active ? '#f3f4f6' : '#939da5'}" font-family="Arial,sans-serif" font-size="13">${label}</text>`;
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="#12161b"/><stop offset="1" stop-color="#07090c"/></linearGradient><pattern id="grain" width="36" height="36" patternUnits="userSpaceOnUse"><circle cx="3" cy="5" r="0.7" fill="#fff" fill-opacity="0.08"/><circle cx="21" cy="24" r="0.7" fill="#fff" fill-opacity="0.05"/></pattern></defs>
    <rect width="1200" height="720" fill="url(#bg)"/><rect width="1200" height="720" fill="url(#grain)"/>
    <rect x="0" y="0" width="1200" height="66" fill="#0b0d10" stroke="#252a30"/>
    <circle cx="30" cy="33" r="4" fill="#fb7185"/><text x="45" y="38" fill="#e7edf1" font-family="ui-monospace,Consolas,monospace" font-size="13">TRANSFORM-X</text>
    <text x="1168" y="38" text-anchor="end" fill="#6e7c86" font-family="ui-monospace,Consolas,monospace" font-size="11">ENTERPRISE CONTENT STUDIO</text>
    <rect x="22" y="84" width="226" height="610" rx="13" fill="#0b0d11" stroke="#292e34"/>
    <text x="42" y="116" fill="#818d96" font-family="ui-monospace,Consolas,monospace" font-size="10">OUTPUT WORKSPACE</text>
    ${nav}
    <rect x="266" y="84" width="912" height="610" rx="13" fill="#0c0e12" stroke="#2a2e34"/>
    <text x="294" y="119" fill="#fb7185" font-family="ui-monospace,Consolas,monospace" font-size="10">${esc(section.toUpperCase())}</text>
    <text x="294" y="154" fill="#f1f5f7" font-family="Arial,sans-serif" font-size="24" font-weight="600">${esc(title)}</text>
    <text x="294" y="181" fill="#84919a" font-family="Arial,sans-serif" font-size="13">${esc(subtitle)}</text>
    <path d="M294 199H1150" stroke="#292e34"/>
    ${body}
    <text x="1148" y="675" text-anchor="end" fill="#66737c" font-family="ui-monospace,Consolas,monospace" font-size="10">${esc(activeFormat ? `ACTIVE OUTPUT / ${activeFormat}` : 'STUDIO DEMO / GENERATED PROJECT DATA')}</text>
  </svg>`;
}

function card(x, y, widthValue, heightValue, title, content, accent = '#fb7185') {
  return `<rect x="${x}" y="${y}" width="${widthValue}" height="${heightValue}" rx="10" fill="#101318" stroke="#282d33"/><rect x="${x}" y="${y}" width="3" height="${heightValue}" rx="2" fill="${accent}"/><text x="${x + 18}" y="${y + 27}" fill="#8f9aa2" font-family="ui-monospace,Consolas,monospace" font-size="10">${esc(title.toUpperCase())}</text>${content}`;
}

function makeOverviewFrames() {
  const frames = [];
  const sourceLines = sourcePreset.content.split('\n').filter(Boolean);
  frames.push(shell({
    section: '01 / Source ingestion',
    title: 'One source. Seven deliverables.',
    subtitle: 'A threat-intelligence advisory is ingested and transformed into audience-ready outputs.',
    body: `${card(294, 225, 540, 210, 'SOURCE TEXT · THREAT INTELLIGENCE', `${text(315, 282, sourcePreset.title, { size: 20, chars: 46, lines: 2, weight: 600 })}${text(315, 338, sourceLines.slice(1, 5).join(' '), { size: 13, chars: 73, lines: 4, color: '#aab5bd' })}${chip(315, 388, `${generated.analysis.wordCount} WORDS`, '#38bdf8', 118)}${chip(445, 388, 'THREAT INTEL', '#fb7185', 123)}`)}${card(854, 225, 296, 210, 'TRANSFORMATION STATUS', `${text(876, 289, 'SOURCE READY', { size: 19, color: '#a3e635', weight: 600 })}${text(876, 329, 'Audience · Technical Specialists', { size: 13, chars: 31, lines: 2, color: '#aab5bd' })}${text(876, 376, 'Tone · Urgent & Action-Oriented', { size: 13, chars: 31, lines: 2, color: '#aab5bd' })}`)}`,
  }));

  frames.push(shell({
    section: '02 / Deliverables',
    title: 'Choose parallel outputs',
    subtitle: 'Select formats to synthesize concurrently from the same source.',
    body: `${formats.map((key, index) => {
      const labels = ['Video Package', 'LinkedIn Post', 'Twitter / X', 'Advisory', 'Infographic', 'Exec Summary', 'Presentation'];
      const x = 300 + (index % 2) * 420;
      const y = 225 + Math.floor(index / 2) * 92;
      return `<rect x="${x}" y="${y}" width="395" height="72" rx="9" fill="#111419" stroke="#343037"/><circle cx="${x + 24}" cy="${y + 25}" r="6" fill="#ef4444"/><text x="${x + 42}" y="${y + 30}" fill="#e9edf0" font-family="Arial,sans-serif" font-size="14">${labels[index]}</text><text x="${x + 42}" y="${y + 51}" fill="#77848d" font-family="ui-monospace,Consolas,monospace" font-size="10">GENERATED FROM SHARED SOURCE</text>`;
    }).join('')}`,
  }));

  frames.push(shell({
    section: '03 / Tuning parameters',
    title: 'Shape every output',
    subtitle: 'Audience, tone, graph detail, and YouTube clip count are configurable.',
    body: `${[['Audience', parameters.targetAudience], ['Tone', parameters.tone], ['Language', 'English (US)'], ['Detail', 'Deep-Dive Comprehensive']].map(([label, value], index) => { const x = 300 + (index % 2) * 420; const y = 230 + Math.floor(index / 2) * 104; return `${card(x, y, 395, 82, label, text(x + 18, y + 58, value, { size: 14, chars: 41, lines: 1, color: '#dce4e9' }), '#38bdf8')}`; }).join('')}${chip(300, 455, 'CONCEPT GRAPH · 20 NODES', '#a3e635', 218)}${chip(532, 455, 'YOUTUBE CLIPS · 6', '#fb7185', 180)}${text(300, 530, 'Changes are applied when Transform is run.', { size: 13, color: '#84919a' })}`,
  }));

  const videoScenes = result.video.scenes.slice(0, 4).map((scene, index) => `<rect x="${300 + index * 210}" y="250" width="192" height="180" rx="9" fill="#111419" stroke="#2c3037"/><text x="${318 + index * 210}" y="279" fill="#fb7185" font-family="ui-monospace,Consolas,monospace" font-size="10">SCENE 0${scene.sceneNumber} · ${esc(scene.timestamp)}</text>${text(318 + index * 210, 315, scene.phase, { size: 14, chars: 20, lines: 2, weight: 600 })}${text(318 + index * 210, 370, scene.narration, { size: 11, chars: 23, lines: 4, color: '#8f9aa2', lineHeight: 16 })}`).join('');
  frames.push(shell({
    section: '04 / Video package',
    title: result.video.title,
    subtitle: `${result.video.duration} · storyboard, narration, visuals, subtitles, and six clip ranges`,
    activeFormat: 'VIDEO PACKAGE',
    body: `${videoScenes}${card(300, 462, 836, 108, 'YOUTUBE CLIP STUDIO', `${text(320, 531, 'Paste a video URL · preview six timestamp cuts · edit in/out · download cut sheets', { size: 17, chars: 78, lines: 1, color: '#dce4e9' })}`, '#fb7185')}`,
  }));

  frames.push(shell({
    section: '05 / LinkedIn',
    title: 'Leadership-ready editorial',
    subtitle: `${result.linkedin.readTime} · ${result.linkedin.characterCount} characters`,
    activeFormat: 'LINKEDIN POST',
    body: `${card(300, 226, 824, 130, 'OPENING HOOK', text(323, 290, result.linkedin.hook, { size: 18, chars: 74, lines: 3, weight: 600 }))}${card(300, 377, 824, 190, 'KEY TAKEAWAYS', result.linkedin.takeaways.slice(0, 3).map((item, index) => `${text(322, 430 + index * 42, `${index + 1}. ${item}`, { size: 13, chars: 88, lines: 1, color: '#c3ccd2' })}`).join(''))}`,
  }));

  frames.push(shell({
    section: '06 / Twitter thread',
    title: `${result.twitter.tweetCount}-post numbered thread`,
    subtitle: `${result.twitter.totalCharacters} total characters · verified metrics and a clear response path`,
    activeFormat: 'TWITTER / X',
    body: `${result.twitter.tweets.slice(0, 3).map((tweet, index) => { const x = 300 + index * 280; const content = text(x + 18, 296, tweet.text, { size: 12, chars: 31, lines: 10, color: '#c3ccd2', lineHeight: 17 }); return `<rect x="${x}" y="232" width="258" height="345" rx="10" fill="#111419" stroke="#30343a"/><circle cx="${x + 24}" cy="263" r="10" fill="#222a30"/><text x="${x + 43}" y="267" fill="#c7d0d6" font-family="Arial,sans-serif" font-size="12">Transform-X · ${tweet.index}/5</text><path d="M${x + 16} 284H${x + 242}" stroke="#2d3238"/>${content}<text x="${x + 18}" y="550" fill="#7d8a94" font-family="ui-monospace,Consolas,monospace" font-size="10">${tweet.charCount} CHARACTERS</text>`; }).join('')}`,
  }));

  frames.push(shell({
    section: '07 / Advisory',
    title: result.advisory.title,
    subtitle: `${result.advisory.advisoryId} · ${result.advisory.timestamp}`,
    activeFormat: 'ADVISORY',
    body: `${card(300, 226, 240, 130, 'SEVERITY', `${text(321, 300, result.advisory.severity, { size: 24, color: '#fb7185', weight: 700 })}${text(321, 330, `Score ${result.advisory.severityScore}`, { size: 13, color: '#aeb8bf' })}`, '#fb7185')}${card(558, 226, 576, 130, 'EXECUTIVE TL;DR', text(580, 285, result.advisory.tldr, { size: 13, chars: 74, lines: 3, color: '#c3ccd2' }))}${card(300, 378, 834, 200, 'CHECKABLE MITIGATIONS', result.advisory.mitigationChecklist.slice(0, 4).map((item, index) => `${text(322, 427 + index * 34, `□  ${item.label}`, { size: 12, chars: 105, lines: 1, color: '#c3ccd2' })}`).join(''))}`,
  }));

  const graph = result.infographic.conceptGraph;
  const graphNodes = graph.nodes.slice(0, 18);
  const graphEdges = graph.links.slice(0, 45).map((link) => {
    const source = graphNodes.find((node) => node.id === link.source);
    const target = graphNodes.find((node) => node.id === link.target);
    return source && target ? `<line x1="${360 + source.x * 0.59}" y1="${245 + source.y * 0.54}" x2="${360 + target.x * 0.59}" y2="${245 + target.y * 0.54}" stroke="${source.color}" stroke-opacity="0.32"/>` : '';
  }).join('');
  const graphNodeMarkup = graphNodes.map((node) => `<circle cx="${360 + node.x * 0.59}" cy="${245 + node.y * 0.54}" r="${4 + node.radius * 0.45}" fill="${node.color}"/><text x="${370 + node.x * 0.59}" y="${249 + node.y * 0.54}" fill="#c9d2d8" font-family="ui-monospace,Consolas,monospace" font-size="9">${esc(node.label)}</text>`).join('');
  frames.push(shell({
    section: '08 / Infographic',
    title: result.infographic.headline,
    subtitle: `${graph.nodes.length} concepts · ${graph.links.length} source-linked relationships · colored by topic`,
    activeFormat: 'INFOGRAPHIC',
    body: `${card(300, 226, 830, 345, 'SOURCE CONCEPT NETWORK', `<g>${graphEdges}${graphNodeMarkup}</g>`)}${text(302, 609, result.infographic.takeawayMessage, { size: 12, chars: 112, lines: 2, color: '#aab5bd' })}`,
  }));

  frames.push(shell({
    section: '09 / Executive summary',
    title: result.executiveSummary.title,
    subtitle: `${result.executiveSummary.readTime} · ${result.executiveSummary.classification}`,
    activeFormat: 'EXEC SUMMARY',
    body: `${card(300, 226, 830, 155, 'BOTTOM LINE UP FRONT', text(322, 285, result.executiveSummary.bluf, { size: 15, chars: 88, lines: 4, color: '#e0e6ea', lineHeight: 23 }))}${result.executiveSummary.kpis.slice(0, 3).map((metric, index) => `${card(300 + index * 278, 407, 258, 110, metric.label, `${text(320 + index * 278, 470, metric.value, { size: 20, chars: 16, lines: 1, weight: 600, color: '#a3e635' })}${text(320 + index * 278, 496, metric.change, { size: 11, chars: 23, lines: 1, color: '#88949c' })}`, ['#fb7185', '#38bdf8', '#a3e635'][index])}`).join('')}`,
  }));

  frames.push(shell({
    section: '10 / Presentation deck',
    title: result.presentation.deckTitle,
    subtitle: `${result.presentation.slideCount} slides · speaker notes · visual layouts`,
    activeFormat: 'PRESENTATION',
    body: `${result.presentation.slides.slice(0, 3).map((slide, index) => { const x = 300 + index * 280; return `<rect x="${x}" y="236" width="258" height="330" rx="10" fill="#12161b" stroke="#343940"/><text x="${x + 18}" y="265" fill="#fb7185" font-family="ui-monospace,Consolas,monospace" font-size="10">SLIDE 0${slide.slideNumber} · ${esc(slide.layout.toUpperCase())}</text>${text(x + 18, 315, slide.title, { size: 17, chars: 25, lines: 3, weight: 600 })}${text(x + 18, 386, slide.subtitle, { size: 11, chars: 34, lines: 3, color: '#95a1aa', lineHeight: 17 })}${(slide.bullets || []).slice(0, 3).map((bullet, bulletIndex) => text(x + 18, 477 + bulletIndex * 23, `• ${bullet}`, { size: 10, chars: 33, lines: 1, color: '#bac4ca' })).join('')}`; }).join('')}`,
  }));
  return frames;
}

function presetFrames() {
  return SAMPLE_PRESETS.map((preset, index) => {
    const presetParameters = {
      targetAudience: preset.targetAudience,
      tone: preset.tone,
      communicationObjective: preset.communicationObjective,
      contentStyle: preset.contentStyle,
      generateConceptGraph: true,
      includeYoutubeClips: true,
      youtubeClipCount: 6,
    };
    const transformed = transformContent({ sourceText: preset.content, parameters: presetParameters, selectedFormats: formats });
    const excerpt = preset.content.split('\n').filter(Boolean).slice(1, 5).join(' ');
    return shell({
      section: `Preset ${index + 1} / ${SAMPLE_PRESETS.length}`,
      title: preset.title,
      subtitle: `${preset.category} · ${preset.targetAudience}`,
      body: `${card(300, 226, 820, 194, 'SOURCE BRIEF', text(322, 284, excerpt, { size: 14, chars: 87, lines: 5, color: '#cad2d8', lineHeight: 22 }))}${card(300, 440, 390, 105, 'TONE & STYLE', `${text(320, 495, preset.tone, { size: 13, chars: 39, lines: 1, color: '#dce5eb' })}${text(320, 522, preset.contentStyle, { size: 11, chars: 39, lines: 1, color: '#89949c' })}`, '#38bdf8')}${card(710, 440, 410, 105, 'GENERATED OUTPUTS', `${text(730, 495, `${Object.keys(transformed.results).length} formats · ${transformed.analysis.wordCount} source words`, { size: 13, chars: 43, lines: 1, color: '#dce5eb' })}${text(730, 522, `${transformed.results.infographic.conceptGraph.nodes.length} concepts · ${transformed.results.video.youtubeClips.length} clip ranges`, { size: 11, chars: 43, lines: 1, color: '#89949c' })}`, '#a3e635')}`,
    });
  });
}

function youtubeFrames() {
  const starts = [12, 58, 126, 234, 398, 552];
  const frames = starts.map((start, index) => {
    const active = index + 1;
    const clipRows = starts.map((clipStart, clipIndex) => {
      const y = 276 + clipIndex * 56;
      const isActive = clipIndex === index;
      return `<rect x="704" y="${y}" width="426" height="46" rx="7" fill="${isActive ? '#2a171b' : '#111419'}" stroke="${isActive ? '#ef4444' : '#2d3238'}"/><text x="721" y="${y + 18}" fill="${isActive ? '#fb7185' : '#9aa5ad'}" font-family="ui-monospace,Consolas,monospace" font-size="10">CLIP 0${clipIndex + 1} · ${String(Math.floor(clipStart / 60)).padStart(2, '0')}:${String(clipStart % 60).padStart(2, '0')}</text><text x="1110" y="${y + 27}" text-anchor="end" fill="${isActive ? '#f1f5f7' : '#7e8991'}" font-family="ui-monospace,Consolas,monospace" font-size="10">${isActive ? 'PREVIEWING' : '30 SEC'}</text>`;
    }).join('');
    const body = `<rect x="300" y="225" width="375" height="48" rx="8" fill="#080a0d" stroke="#343940"/><text x="317" y="255" fill="#cad3d8" font-family="ui-monospace,Consolas,monospace" font-size="12">youtu.be/${videoId}?si=...</text><rect x="686" y="225" width="444" height="48" rx="8" fill="#b91c1c"/><text x="908" y="255" text-anchor="middle" fill="#ffffff" font-family="Arial,sans-serif" font-size="13" font-weight="600">GENERATE 6 CLIPS</text><rect x="300" y="291" width="375" height="292" rx="9" fill="#080b0e" stroke="#353b42"/><rect x="315" y="306" width="345" height="246" rx="6" fill="#10171d"/><circle cx="487" cy="421" r="30" fill="#ef4444"/><path d="M479 404L479 438L505 421Z" fill="#fff"/><text x="487" y="482" text-anchor="middle" fill="#e6edf1" font-family="Arial,sans-serif" font-size="14">YouTube embed preview</text><text x="487" y="511" text-anchor="middle" fill="#84919a" font-family="ui-monospace,Consolas,monospace" font-size="10">CLIP 0${active} · ${String(Math.floor(start / 60)).padStart(2, '0')}:${String(start % 60).padStart(2, '0')}–${String(Math.floor((start + 30) / 60)).padStart(2, '0')}:${String((start + 30) % 60).padStart(2, '0')}</text>${clipRows}<rect x="300" y="603" width="392" height="42" rx="7" fill="#111419" stroke="#30363d"/><text x="318" y="629" fill="#85919a" font-family="ui-monospace,Consolas,monospace" font-size="10">IN ${index === 1 ? '18' : start} SEC</text><text x="439" y="629" fill="#85919a" font-family="ui-monospace,Consolas,monospace" font-size="10">OUT ${index === 1 ? '48' : start + 30} SEC</text><text x="1110" y="655" text-anchor="end" fill="#fb7185" font-family="ui-monospace,Consolas,monospace" font-size="10">WATCH CLIP 0${active} · DOWNLOAD CUT INFO</text>`;
    return shell({
      section: `YouTube Clip Studio / Clip 0${active}`,
      title: 'Six timestamped clips from one video',
      subtitle: 'Watch each segment · adjust in/out points · export cut instructions',
      activeFormat: 'VIDEO PACKAGE',
      body,
    });
  });

  frames.push(shell({
    section: 'YouTube Clip Studio / Edit range',
    title: 'Set precise in and out points',
    subtitle: 'Clip 02 · 00:18–00:48 · 30 seconds',
    activeFormat: 'VIDEO PACKAGE',
    body: `<rect x="300" y="230" width="518" height="380" rx="10" fill="#0c1014" stroke="#30363d"/><rect x="322" y="252" width="474" height="248" rx="8" fill="#10171d"/><circle cx="559" cy="376" r="32" fill="#ef4444"/><path d="M550 357L550 395L578 376Z" fill="#fff"/><text x="559" y="455" text-anchor="middle" fill="#cfd8de" font-family="Arial,sans-serif" font-size="14">Video segment preview</text>${[['IN · SECONDS', '18'], ['OUT · SECONDS', '48']].map(([label, value], index) => `<rect x="${328 + index * 230}" y="526" width="210" height="58" rx="7" fill="#080a0d" stroke="#3a4148"/><text x="${344 + index * 230}" y="547" fill="#88949d" font-family="ui-monospace,Consolas,monospace" font-size="9">${label}</text><text x="${344 + index * 230}" y="572" fill="#edf2f5" font-family="ui-monospace,Consolas,monospace" font-size="15">${value}</text>`).join('')}${card(844, 230, 286, 174, 'CUT INFO EXPORT', `${text(864, 290, 'Download one cut sheet or the complete six-clip list.', { size: 14, chars: 34, lines: 4, color: '#c4cdd3' })}${chip(864, 345, 'JSON CUT LIST', '#38bdf8', 150)}`)}${text(844, 470, 'Original media stays on YouTube.', { size: 12, color: '#7d8991' })}${text(844, 495, 'Exports contain timestamps,', { size: 12, color: '#7d8991' })}${text(844, 520, 'not downloaded video.', { size: 12, color: '#7d8991' })}`,
  }));
  return frames;
}

async function saveGif(filename, svgs, delay = 950) {
  const rawFrames = [];
  for (const svg of svgs) {
    const { data } = await sharp(Buffer.from(svg)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    rawFrames.push(data);
  }

  const stride = 12;
  const sampleSize = rawFrames.reduce((total, data) => total + Math.ceil(data.length / stride) * 4, 0);
  const samples = new Uint8Array(sampleSize);
  let sampleOffset = 0;
  rawFrames.forEach((data) => {
    for (let offset = 0; offset < data.length; offset += stride) {
      samples.set(data.subarray(offset, offset + 4), sampleOffset);
      sampleOffset += 4;
    }
  });
  const palette = quantize(samples.subarray(0, sampleOffset), 256);
  const encoder = GIFEncoder();
  rawFrames.forEach((frame, index) => {
    encoder.writeFrame(applyPalette(frame, palette), width, height, {
      palette: index === 0 ? palette : undefined,
      delay,
      repeat: 0,
      transparent: false,
    });
  });
  encoder.finish();
  const bytes = encoder.bytes();
  await writeFile(path.join(outputDirectory, filename), bytes);
  console.log(`${filename}: ${svgs.length} frames, ${width}x${height}, ${(bytes.length / 1024).toFixed(0)} KB`);
}

await mkdir(outputDirectory, { recursive: true });
await saveGif('project-deliverables-tour.gif', makeOverviewFrames(), 1150);
await saveGif('project-presets-and-settings.gif', presetFrames(), 1250);
await saveGif('youtube-clips-feature-workflow.gif', youtubeFrames(), 1150);