import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import gifenc from 'gifenc';
import sharp from 'sharp';
import { SAMPLE_PRESETS } from '../src/data/samplePresets.js';
import { transformContent } from '../src/utils/generatorEngine.js';

const { applyPalette, GIFEncoder, quantize } = gifenc;

const width = 960;
const height = 640;
const frameCount = 20;
const frameDelay = 90;
const paletteColors = 256;
const outputDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../video');
const preset = SAMPLE_PRESETS[0];
const graph = transformContent({
  sourceText: preset.content,
  parameters: {
    targetAudience: preset.targetAudience,
    tone: preset.tone,
    communicationObjective: preset.communicationObjective,
    contentStyle: preset.contentStyle,
    generateConceptGraph: true,
    conceptGraphNodeLimit: 20,
  },
  selectedFormats: ['infographic'],
}).results.infographic.conceptGraph;

const escapeXml = (value) => String(value).replace(/[<>&"']/g, (character) => ({
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;',
  '"': '&quot;',
  "'": '&apos;',
}[character]));

function projectGraph(settings) {
  const { yaw = 0, pitch = -0.18, zoom = 1, panX = 0, panY = 0, draggedNode, dragX = 0, dragY = 0 } = settings;
  const cosYaw = Math.cos(yaw);
  const sinYaw = Math.sin(yaw);
  const cosPitch = Math.cos(pitch);
  const sinPitch = Math.sin(pitch);

  return new Map(graph.nodes.map((node) => {
    const baseX = (node.x - 450) / 92;
    const baseY = (250 - node.y) / 92;
    let hash = node.id.split('').reduce((value, character) => ((value * 31 + character.charCodeAt(0)) | 0), 17);
    const depth = ((Math.abs(hash) % 1000) / 1000 - 0.5) * 2.6;
    const rotatedX = baseX * cosYaw - depth * sinYaw;
    const rotatedZ = baseX * sinYaw + depth * cosYaw;
    const rotatedY = baseY * cosPitch - rotatedZ * sinPitch;
    const viewDepth = baseY * sinPitch + rotatedZ * cosPitch;
    const perspective = zoom * (4.6 / (4.6 + viewDepth * 0.14));
    const dragged = node.id === draggedNode;

    return [node.id, {
      x: 480 + panX + rotatedX * 72 * perspective + (dragged ? dragX : 0),
      y: 320 + panY - rotatedY * 72 * perspective + (dragged ? dragY : 0),
      scale: perspective,
      node,
    }];
  }));
}

function renderFrame(settings) {
  const projected = projectGraph(settings);
  const selectedNode = settings.selectedNode;
  const connectedNodes = new Set(selectedNode ? [selectedNode] : []);
  if (selectedNode) {
    graph.links.forEach((link) => {
      if (link.source === selectedNode) connectedNodes.add(link.target);
      if (link.target === selectedNode) connectedNodes.add(link.source);
    });
  }

  const links = graph.links.map((link) => {
    const source = projected.get(link.source);
    const target = projected.get(link.target);
    const highlighted = selectedNode && (link.source === selectedNode || link.target === selectedNode);
    const opacity = selectedNode ? (highlighted ? 0.88 : 0.045) : Math.min(0.56, 0.15 + link.weight * 0.13);
    return `<line x1="${source.x.toFixed(1)}" y1="${source.y.toFixed(1)}" x2="${target.x.toFixed(1)}" y2="${target.y.toFixed(1)}" stroke="${source.node.color}" stroke-opacity="${opacity}" stroke-width="${highlighted ? 1.8 : 0.7 + link.weight * 0.2}" />`;
  }).join('');

  const nodes = [...projected.values()].sort((left, right) => left.scale - right.scale).map(({ x, y, scale, node }) => {
    const selected = node.id === selectedNode;
    const faded = selectedNode && !connectedNodes.has(node.id);
    const radius = (4.2 + Math.sqrt(node.frequency) * 2.05) * scale + (selected ? 2 : 0);
    const label = node.label.length > 17 ? `${node.label.slice(0, 15)}...` : node.label;
    const labelX = x > 725 ? x - radius - 7 : x + radius + 7;
    const anchor = x > 725 ? 'end' : 'start';
    const opacity = faded ? 0.18 : 1;
    return `<g opacity="${opacity}"><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(radius * 2.7).toFixed(1)}" fill="${node.color}" fill-opacity="${selected ? 0.2 : 0.08}"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${radius.toFixed(1)}" fill="${node.color}" stroke="${selected ? '#ffffff' : node.color}" stroke-opacity="${selected ? 0.95 : 0.7}" stroke-width="${selected ? 2 : 1}"/><text x="${labelX.toFixed(1)}" y="${(y + 4).toFixed(1)}" text-anchor="${anchor}" fill="${selected ? '#ffffff' : '#d3dde5'}" font-family="ui-monospace,Consolas,monospace" font-size="${Math.max(9, 11 * scale).toFixed(1)}" font-weight="${selected ? 700 : 400}">${escapeXml(label)}</text></g>`;
  }).join('');

  const title = escapeXml(settings.title || 'SOURCE CONCEPT NETWORK');
  const status = escapeXml(settings.status || 'ORBIT · PAN · ZOOM · REPOSITION');
  const selected = selectedNode ? graph.nodes.find((node) => node.id === selectedNode) : null;
  const selectedLabel = selected ? `<text x="888" y="555" text-anchor="end" fill="${selected.color}" font-family="ui-monospace,Consolas,monospace" font-size="11">SELECTED · ${escapeXml(selected.label.toUpperCase())}</text>` : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <radialGradient id="bg" cx="50%" cy="45%" r="75%"><stop offset="0" stop-color="#101b22"/><stop offset="1" stop-color="#07090c"/></radialGradient>
      <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#b7c8d4" fill-opacity="0.13"/></pattern>
      <filter id="glow"><feGaussianBlur stdDeviation="6" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <rect width="960" height="640" fill="url(#bg)"/><rect y="68" width="960" height="504" fill="url(#dots)"/>
    <path d="M0 67.5H960M0 572.5H960" stroke="#d9e4eb" stroke-opacity="0.12"/>
    <text x="34" y="35" fill="#e8eff4" font-family="ui-monospace,Consolas,monospace" font-size="13" letter-spacing="1">OMNITRANSFORM / GRAPH STUDIO</text>
    <text x="926" y="35" text-anchor="end" fill="#72828c" font-family="ui-monospace,Consolas,monospace" font-size="10">${graph.nodes.length} CONCEPTS · ${graph.links.length} RELATIONSHIPS</text>
    <text x="34" y="98" fill="#a6b5bf" font-family="ui-monospace,Consolas,monospace" font-size="11">${title}</text>
    <g>${links}</g><g filter="url(#glow)">${nodes}</g>
    <g font-family="ui-monospace,Consolas,monospace" font-size="10">
      <circle cx="42" cy="603" r="5" fill="#fb7185"/><text x="54" y="607" fill="#aeb9c1">SECURITY</text>
      <circle cx="160" cy="603" r="5" fill="#38bdf8"/><text x="172" y="607" fill="#aeb9c1">TECHNOLOGY</text>
      <circle cx="303" cy="603" r="5" fill="#a3e635"/><text x="315" y="607" fill="#aeb9c1">BUSINESS</text>
      <circle cx="421" cy="603" r="5" fill="#fbbf24"/><text x="433" y="607" fill="#aeb9c1">OPERATIONS</text>
      <circle cx="562" cy="603" r="5" fill="#a78bfa"/><text x="574" y="607" fill="#aeb9c1">CONTEXT</text>
    </g>
    <rect x="706" y="584" width="220" height="38" rx="6" fill="#11191f" stroke="#dce6ec" stroke-opacity="0.15"/>
    <text x="816" y="607" text-anchor="middle" fill="#7dd3c7" font-family="ui-monospace,Consolas,monospace" font-size="10">${status}</text>
    ${selectedLabel}
  </svg>`;
}

function buildSequences() {
  const orbit = Array.from({ length: frameCount }, (_, index) => ({
    yaw: (index / frameCount) * Math.PI * 2,
    title: 'FREE ORBIT · AUTO-ROTATE',
    status: 'CAMERA ORBIT · 360°',
  }));
  const selectionAndDrag = Array.from({ length: frameCount }, (_, index) => {
    const phase = index < 5 ? 0 : index < 9 ? (index - 5) / 4 : index < 16 ? 1 : (20 - index) / 4;
    const selected = index >= 5 && index < 18;
    return {
      yaw: -0.12,
      selectedNode: selected ? 'cloud' : null,
      draggedNode: selected ? 'cloud' : null,
      dragX: Math.max(0, phase) * 116,
      dragY: Math.max(0, phase) * -48,
      title: selected ? 'SELECT · DRAG · REPOSITION' : 'NODES ARE INTERACTIVE',
      status: selected ? 'CLOUD · CONNECTED LINKS' : 'CLICK A NODE TO INSPECT',
    };
  });
  const zoomAndPan = Array.from({ length: frameCount }, (_, index) => {
    const phase = index < 7 ? index / 6 : index < 13 ? 1 : (19 - index) / 6;
    const zoom = index < 13 ? 1 + phase * 0.7 : 1.7 - phase * 0.7;
    const panPhase = index < 7 ? 0 : index < 13 ? (index - 7) / 5 : index < 18 ? 1 : (19 - index) / 2;
    return {
      yaw: 0.42,
      zoom,
      panX: panPhase * -74,
      panY: panPhase * 30,
      title: 'CAMERA CONTROLS · SPATIAL NAVIGATION',
      status: index < 7 ? 'SCROLL · ZOOM IN' : index < 13 ? 'RIGHT-DRAG · PAN' : 'SCROLL · ZOOM OUT',
    };
  });

  return [
    { filename: 'concept-graph-orbit.gif', frames: orbit },
    { filename: 'concept-graph-select-and-drag.gif', frames: selectionAndDrag },
    { filename: 'concept-graph-zoom-and-pan.gif', frames: zoomAndPan },
  ];
}

async function encodeGif(sequence) {
  const rgbaFrames = [];
  for (const frame of sequence.frames) {
    const { data } = await sharp(Buffer.from(renderFrame(frame)))
      .resize(width, height)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    rgbaFrames.push(data);
  }

  const samples = new Uint8Array(rgbaFrames.length * Math.ceil(width * height / 8) * 4);
  let sampleOffset = 0;
  rgbaFrames.forEach((frame) => {
    for (let pixelOffset = 0; pixelOffset < frame.length; pixelOffset += 32) {
      samples.set(frame.subarray(pixelOffset, pixelOffset + 4), sampleOffset);
      sampleOffset += 4;
    }
  });
  const palette = quantize(samples.subarray(0, sampleOffset), paletteColors);
  const encoder = GIFEncoder();
  rgbaFrames.forEach((frame, index) => {
    encoder.writeFrame(applyPalette(frame, palette), width, height, {
      palette: index === 0 ? palette : undefined,
      delay: frameDelay,
      repeat: 0,
      transparent: false,
    });
  });
  encoder.finish();
  await writeFile(path.join(outputDirectory, sequence.filename), encoder.bytes());
  console.log(`${sequence.filename} (${(encoder.bytes().length / 1024).toFixed(0)} KB)`);
}

await mkdir(outputDirectory, { recursive: true });
await Promise.all(buildSequences().map(encodeGif));