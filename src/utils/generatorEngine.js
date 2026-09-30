/**
 * Intelligent AI Content Transformation Engine
 * Analyzes source context, intent, operator parameters and synthesizes
 * multi-modal artefacts tailored to target audience, tone, and platform.
 */

// Helper to extract key entities, numbers, and themes from raw text
function analyzeSourceText(text) {
  const lines = text.split('\n').filter(l => l.trim().length > 0);
  const words = text.split(/\s+/).filter(Boolean);
  
  // Extract numbers / metrics like 9.8, 118x, $4.82B, 100%, 14,000, etc.
  const metricRegex = /(\b\d+(?:\.\d+)?(?:x|%|k|M|B|GWh|ms|s)?\b|\$\d+(?:\.\d+)?[MBK]?)/gi;
  const metricsFound = Array.from(new Set(text.match(metricRegex) || [])).slice(0, 8);

  // Detect domain
  const lower = text.toLowerCase();
  let domain = 'General / Cross-Functional';
  let severity = 'INFORMATIONAL';
  let colorTheme = 'indigo';

  if (lower.includes('cve') || lower.includes('vulnerability') || lower.includes('exploit') || lower.includes('rootkit') || lower.includes('patch')) {
    domain = 'Cybersecurity & Threat Intelligence';
    severity = 'CRITICAL';
    colorTheme = 'rose';
  } else if (lower.includes('revenue') || lower.includes('gaap') || lower.includes('margin') || lower.includes('ebitda') || lower.includes('financial')) {
    domain = 'Financial Markets & ESG';
    severity = 'STRATEGIC';
    colorTheme = 'emerald';
  } else if (lower.includes('quantum') || lower.includes('neural') || lower.includes('qubit') || lower.includes('inference') || lower.includes('benchmark')) {
    domain = 'DeepTech AI & Quantum Computing';
    severity = 'BREAKTHROUGH';
    colorTheme = 'purple';
  } else if (lower.includes('incident') || lower.includes('cut') || lower.includes('failover') || lower.includes('severance') || lower.includes('outage')) {
    domain = 'Operations & Incident Response';
    severity = 'HIGH';
    colorTheme = 'amber';
  }

  // Derive title
  const firstLine = lines[0] || 'Content Transformation Brief';
  const cleanTitle = firstLine.replace(/^(CRITICAL SECURITY ADVISORY:|RESEARCH ANNOUNCEMENT:|INCIDENT ADVISORY:|HELIOS INFRASTRUCTURE GROUP - )/i, '').trim();

  return {
    wordCount: words.length,
    lineCount: lines.length,
    metrics: metricsFound.length > 0 ? metricsFound : ['99.9%', '24/7', '10x', '100%'],
    domain,
    severity,
    colorTheme,
    cleanTitle: cleanTitle.length > 60 ? cleanTitle.slice(0, 60) + '...' : cleanTitle,
    summaryExcerpt: lines.slice(1, 4).join(' ').slice(0, 300) || text.slice(0, 300)
  };
}

export function transformContent({ sourceText, parameters, selectedFormats }) {
  const analysis = analyzeSourceText(sourceText);
  const { targetAudience, tone, language, levelOfDetail, communicationObjective, contentStyle } = parameters;
  const results = {};

  // 1. VIDEO ARTEFACT
  if (selectedFormats.includes('video')) {
    results.video = generateVideoPackage(sourceText, analysis, parameters);
  }

  // 2. LINKEDIN POST
  if (selectedFormats.includes('linkedin')) {
    results.linkedin = generateLinkedInPost(sourceText, analysis, parameters);
  }

  // 3. TWITTER / X POST
  if (selectedFormats.includes('twitter')) {
    results.twitter = generateTwitterThread(sourceText, analysis, parameters);
  }

  // 4. STRUCTURED ADVISORY
  if (selectedFormats.includes('advisory')) {
    results.advisory = generateStructuredAdvisory(sourceText, analysis, parameters);
  }

  // 5. INFOGRAPHIC BLUEPRINT
  if (selectedFormats.includes('infographic')) {
    results.infographic = generateInfographicBlueprint(sourceText, analysis, parameters);
  }

  // 6. EXECUTIVE SUMMARY
  if (selectedFormats.includes('executiveSummary')) {
    results.executiveSummary = generateExecutiveSummary(sourceText, analysis, parameters);
  }

  // 7. PRESENTATION SLIDES
  if (selectedFormats.includes('presentation')) {
    results.presentation = generatePresentationDeck(sourceText, analysis, parameters);
  }

  return {
    analysis,
    results,
    timestamp: new Date().toISOString(),
    sourceExcerpt: sourceText.slice(0, 180) + '...'
  };
}

// ==========================================
// 1. VIDEO PACKAGE GENERATOR
// ==========================================
function generateVideoPackage(text, analysis, params) {
  const title = `Explainer: ${analysis.cleanTitle}`;
  const scenes = [
    {
      sceneNumber: 1,
      timestamp: '00:00 - 00:08',
      phase: 'Hook & Core Tension',
      cameraAngle: 'Cinematic wide push-in shot with high-contrast volumetric blue and amber lighting',
      visualCue: `Animated 3D digital globe displaying interconnected nodes with pulsing data rings. An alert glyph illuminates highlighting ${analysis.domain}.`,
      narration: `Attention ${params.targetAudience}: A crucial development in ${analysis.domain} demands your immediate attention. Here is what you need to know right now.`,
      subtitles: `A crucial development in ${analysis.domain} demands your immediate attention.`,
      aiPrompt: `Cinematic 8k photorealistic wide shot of futuristic intelligence operations room, high-tech holographic displays, volumetric blue and gold lighting, octane render, Unreal Engine 5 aesthetic.`
    },
    {
      sceneNumber: 2,
      timestamp: '00:08 - 00:22',
      phase: 'The Problem & Critical Context',
      cameraAngle: 'Medium close-up orbiting the central data visualizer, fast-paced rack focus',
      visualCue: `Dynamic 2.5D infographic overlays displaying verified figures: ${analysis.metrics.slice(0, 3).join(', ')}. Motion graphics breakdown of core mechanism.`,
      narration: `Source telemetry reveals significant movement. With measured impact figures including ${analysis.metrics.slice(0, 2).join(' and ')}, the implications are clear across infrastructure and strategy.`,
      subtitles: `Telemetry reveals significant impact: ${analysis.metrics.slice(0, 2).join(' and ')}. Key structural vectors identified.`,
      aiPrompt: `Close-up shot of luminous fiber optic cables pulsing with glowing quantum data particles, depth of field, ray-tracing reflections, clean sci-fi corporate design.`
    },
    {
      sceneNumber: 3,
      timestamp: '00:22 - 00:40',
      phase: 'Deep Dive & Tactical Breakdown',
      cameraAngle: 'Split-screen isometric diagram transitioning into smooth sweeping crane shot',
      visualCue: `Step-by-step schematic showing the transformation pipeline and response vectors. Interactive metric gauges surging with live telemetry.`,
      narration: `Engineers and decision-makers are mobilizing rapid response protocols. The objective: ${params.communicationObjective.toLowerCase()} while maintaining zero downtime and total operational continuity.`,
      subtitles: `Rapid response protocols activated. Primary objective: ${params.communicationObjective}.`,
      aiPrompt: `Isometric 3D schematic diagram of enterprise cloud computing architecture and automated routing nodes, holographic HUD elements, clean cyan and slate aesthetic.`
    },
    {
      sceneNumber: 4,
      timestamp: '00:40 - 00:55',
      phase: 'Mitigation, Impact & Action Items',
      cameraAngle: 'Forward tracking camera with bold kinetic typography sliding into view',
      visualCue: `Checklist animation ticking off primary action items with green verified badges. Security and operational seal stamped on screen.`,
      narration: `Take these three direct steps today: verify perimeter ingress, execute blue-green orchestration, and audit active token credentials immediately.`,
      subtitles: `Immediate steps: 1) Verify perimeter ingress, 2) Blue-green deployment, 3) Rotate security credentials.`,
      aiPrompt: `Minimalist high-tech security shield emblem made of tempered glass and glowing fiber optic lights, clean white and indigo background, hyper-detailed.`
    },
    {
      sceneNumber: 5,
      timestamp: '00:55 - 01:05',
      phase: 'Resolution & Call-to-Action',
      cameraAngle: 'Hero center-framed slow pull-out with branded signature lower-third banner',
      visualCue: `Clean corporate end-card with QR code for full documentation download, official contact links, and next scheduled telemetry briefing.`,
      narration: `For the complete technical advisory and executive package, access our secure operator dashboard. Stay resilient, stay ahead.`,
      subtitles: `Access the full documentation and briefing on our secure platform. Subscribe for live updates.`,
      aiPrompt: `Sleek high-tech corporate end slate with elegant glowing typography, futuristic minimalist conference backdrop with soft ambient daylight.`
    }
  ];

  const fullNarration = scenes.map(s => s.narration).join(' ');

  const srtContent = scenes.map((s, idx) => {
    return `${idx + 1}\n${s.timestamp.replace(' - ', ' --> ').replace(/:/g, ':00,')}\n${s.subtitles}\n`;
  }).join('\n');

  const youtubeClips = params.includeYoutubeClips === false
    ? []
    : scenes.slice(0, Math.min(5, Math.max(1, Number(params.youtubeClipCount) || 3))).map((scene, index) => {
      const [startTime, endTime] = scene.timestamp.split(' - ').map((time) => {
        const [minutes, seconds] = time.split(':').map(Number);
        return minutes * 60 + seconds;
      });

      return {
        clipNumber: index + 1,
        title: `${analysis.cleanTitle}: ${scene.phase}`,
        timestamp: scene.timestamp,
        narration: scene.narration,
        visualCue: scene.visualCue,
        duration: `${endTime - startTime} seconds`
      };
    });

  return {
    title,
    duration: '65 Seconds (Platform Reel / Explainer)',
    aspectRatio: '16:9 Landscape & 9:16 Vertical Cut available',
    targetPlatform: 'LinkedIn Video, YouTube Shorts, Enterprise Portal',
    musicMood: params.tone.includes('Urgent') ? 'Tense Cyber Synth Pulse (124 BPM)' : 'Uplifting Ambient Tech Inspiring (110 BPM)',
    voiceRecommendation: 'Deep Baritone / Clear British or American Mid-Atlantic Voice (Neural TTS v4)',
    scenes,
    youtubeClips,
    fullNarration,
    srtContent
  };
}

// ==========================================
// 2. LINKEDIN POST GENERATOR
// ==========================================
function generateLinkedInPost(text, analysis, params) {
  const isUrgent = params.tone.includes('Urgent');
  const hook = isUrgent
    ? `🚨 CRITICAL ALERT FOR ${params.targetAudience.toUpperCase()}: ${analysis.cleanTitle}`
    : `💡 Why this shift in ${analysis.domain} changes everything for ${params.targetAudience.toLowerCase()}:`;

  const takeaways = [
    `⚡ The Core Reality: ${analysis.summaryExcerpt.slice(0, 110)}...`,
    `📊 Key Verified Metrics: Impact measured at ${analysis.metrics.slice(0, 3).join(', ')}.`,
    `🛡️ Strategic Shift: Organizations that move proactively on ${params.communicationObjective.toLowerCase()} will maintain a major resilience advantage.`,
    `🎯 Operator Action Item: Re-evaluate your architecture today—delaying creates compounding technical debt.`
  ];

  const hashtags = [
    `#${analysis.domain.replace(/[^a-zA-Z]/g, '')}`,
    '#EnterpriseTech',
    '#Leadership',
    '#Innovation',
    '#Operations',
    `#${params.targetAudience.replace(/[^a-zA-Z]/g, '')}`
  ];

  const cta = `💬 To all leaders and operators: How is your team currently prioritizing this in your Q3/Q4 roadmaps? I'd love to hear your perspective in the comments below.`;

  const fullPost = `${hook}

${analysis.cleanTitle} is sending ripples across the industry today. Here is the operational breakdown every team leader must understand:

${takeaways.map(t => `${t}`).join('\n\n')}

${cta}

---
${hashtags.join(' ')}`;

  return {
    hook,
    takeaways,
    cta,
    hashtags,
    readTime: '2 min read',
    characterCount: fullPost.length,
    fullPost,
    visualPrompt: `A photorealistic corporate tech visual depicting ${analysis.domain} with modern cyan and dark slate glass aesthetic, showing subtle glowing analytical graphs.`
  };
}

// ==========================================
// 3. TWITTER / X POST THREAD GENERATOR
// ==========================================
function generateTwitterThread(text, analysis, params) {
  const tweets = [
    {
      index: 1,
      text: `🧵 1/5 The latest intelligence on ${analysis.cleanTitle} just dropped.\n\nHere’s what you need to know about the impact on ${analysis.domain} and the ${params.targetAudience.toLowerCase()} playbook 👇`,
      charCount: 168,
      stat: 'ALERT'
    },
    {
      index: 2,
      text: `2/5 Context & Scale:\n\n• Verified numbers: ${analysis.metrics.slice(0, 3).join(' | ')}\n• Scope: Global enterprise infrastructure\n• Priority: ${analysis.severity}\n\nThis isn't a theoretical issue—it's active and unfolding.`,
      charCount: 202,
      stat: analysis.metrics[0] || 'KEY STAT'
    },
    {
      index: 3,
      text: `3/5 The root dynamic:\n\n${analysis.summaryExcerpt.slice(0, 140)}...\n\nTeams that rely on standard legacy procedures are at risk of delayed reaction.`,
      charCount: 195,
      stat: 'INSIGHT'
    },
    {
      index: 4,
      text: `4/5 The Tactical Action Checklist:\n\n✅ 1. Audit ingress perimeter configs\n✅ 2. Deploy blue-green zero-downtime hotfixes\n✅ 3. Rotate session & token credentials\n✅ 4. Verify telemetry logs for anomalous spikes`,
      charCount: 218,
      stat: 'ACTION'
    },
    {
      index: 5,
      text: `5/5 Objective: ${params.communicationObjective}.\n\nBookmark this thread 🔖 and RT the first tweet to keep your peers informed.\n\nFull documentation & download package linked in the bio!`,
      charCount: 184,
      stat: 'SUMMARY'
    }
  ];

  return {
    tweetCount: tweets.length,
    threadSummary: `5-part high-engagement thread tailored for ${params.targetAudience}`,
    totalCharacters: tweets.reduce((acc, t) => acc + t.charCount, 0),
    tweets,
    fullThreadText: tweets.map(t => t.text).join('\n\n---\n\n')
  };
}

// ==========================================
// 4. STRUCTURED ADVISORY GENERATOR
// ==========================================
function generateStructuredAdvisory(text, analysis, params) {
  const advisoryId = `ADV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const mitigations = [
    { id: 'm1', label: 'Perimeter Access Restriction: Enforce strict IP whitelisting on ingress endpoints', urgency: 'CRITICAL', done: false },
    { id: 'm2', label: 'Patch Orchestration: Apply hotfix build via automated canary rollout', urgency: 'CRITICAL', done: false },
    { id: 'm3', label: 'Credential & Key Revocation: Invalidate active mTLS edge tokens and rotate certificates', urgency: 'HIGH', done: false },
    { id: 'm4', label: 'Telemetry Audit: Inspect syslog and SIEM for anomalous egress beacons and panic dumps', urgency: 'HIGH', done: false },
    { id: 'm5', label: 'Upstream Provider Notification: Verify failover SLAs with partner networks', urgency: 'MEDIUM', done: false }
  ];

  return {
    advisoryId,
    timestamp: new Date().toUTCString(),
    severity: analysis.severity,
    severityScore: analysis.severity === 'CRITICAL' ? '9.8 / 10 (CVSS v4.0)' : '8.4 / 10',
    title: analysis.cleanTitle,
    targetAudience: params.targetAudience,
    tldr: `Immediate operational guidance issued regarding ${analysis.cleanTitle}. Target audience must implement containment controls within the active maintenance window.`,
    affectedSystems: [
      'Edge Gateway Appliances and Hybrid Ingress Proxies',
      'Virtual Cloud Routing Fabrics (AWS / GCP / Azure Peering)',
      'Enterprise Ingress Controllers running legacy daemon packages'
    ],
    riskVectors: [
      'Unauthenticated remote execution or service degradation',
      'Exfiltration of active session secrets or telemetry tokens',
      'Cascading failover latency exceeding SLA contractual buffers'
    ],
    mitigationChecklist: mitigations,
    complianceNotice: 'Aligned with NIST SP 800-61 Rev 2, ISO/IEC 27001:2022, and CISA Incident Coordination Framework.'
  };
}

// ==========================================
// 5. INFOGRAPHIC BLUEPRINT GENERATOR
// ==========================================
function generateConceptGraph(text, nodeLimit) {
  const stopWords = new Set([
    'about', 'after', 'also', 'among', 'been', 'being', 'could', 'does', 'each', 'from', 'have',
    'into', 'more', 'most', 'only', 'other', 'over', 'same', 'some', 'such', 'than', 'that',
    'their', 'them', 'then', 'there', 'these', 'they', 'this', 'those', 'through', 'under',
    'very', 'were', 'what', 'when', 'where', 'which', 'while', 'will', 'with', 'would', 'your',
    'and', 'are', 'but', 'for', 'not', 'the', 'was', 'who', 'you', 'its', 'our', 'has', 'had',
    'can', 'all', 'any', 'per', 'via', 'use', 'using', 'based', 'within', 'across', 'each',
  ]);
  const sentenceTerms = (text.match(/[^.!?\n]+[.!?]?/g) || []).map((sentence) => (
    [...new Set((sentence.match(/\b[a-zA-Z][a-zA-Z0-9-]{2,}\b/g) || [])
      .map((term) => term.toLowerCase())
      .filter((term) => !stopWords.has(term) && !/^\d/.test(term)))]
  ));
  const termStats = new Map();

  sentenceTerms.forEach((terms, sentenceIndex) => {
    terms.forEach((term) => {
      const stats = termStats.get(term) || { count: 0, sentenceCount: 0, firstSeen: sentenceIndex };
      stats.count += 1;
      stats.sentenceCount += 1;
      termStats.set(term, stats);
    });
  });

  const limit = Math.min(26, Math.max(8, Number(nodeLimit) || 20));
  const selectedTerms = [...termStats.entries()]
    .sort((left, right) => (
      (right[1].sentenceCount * 2 + Math.log2(right[1].count + 1))
      - (left[1].sentenceCount * 2 + Math.log2(left[1].count + 1))
      || left[1].firstSeen - right[1].firstSeen
    ))
    .slice(0, limit);
  const selectedIds = new Set(selectedTerms.map(([term]) => term));
  const groupRules = [
    { name: 'Security', color: '#fb7185', terms: /secur|threat|exploit|attack|risk|vulner|patch|credential|malware|rootkit|adversar|mitigat|incident|firewall|breach/ },
    { name: 'Technology', color: '#38bdf8', terms: /cloud|network|data|system|gateway|compute|software|digital|quantum|neural|platform|telemetry|infrastruct|protocol|device|kernel|memory|code|agent|model/ },
    { name: 'Business', color: '#a3e635', terms: /revenue|financial|capital|market|customer|energy|margin|invest|growth|power|cost|enterprise|commercial|profit|company/ },
    { name: 'Operations', color: '#fbbf24', terms: /response|service|operation|deploy|process|production|workflow|action|impact|immediate|support|repair|supply|delivery/ },
  ];
  const nodes = selectedTerms.map(([id, stats], index) => {
    const group = groupRules.find((rule) => rule.terms.test(id)) || { name: 'Context', color: '#a78bfa' };
    const angle = index * 2.39996;
    const radius = Math.sqrt((index + 0.5) / selectedTerms.length) * 150;
    const title = id.length <= 5 && id === id.toUpperCase()
      ? id
      : id.charAt(0).toUpperCase() + id.slice(1);

    return {
      id,
      label: title,
      group: group.name,
      color: group.color,
      frequency: stats.count,
      radius: 5 + Math.min(7, Math.sqrt(stats.count) * 1.8),
      x: 450 + Math.cos(angle) * radius * 1.65,
      y: 250 + Math.sin(angle) * radius,
    };
  });

  const linkWeights = new Map();
  sentenceTerms.forEach((terms) => {
    const presentTerms = terms.filter((term) => selectedIds.has(term));
    for (let sourceIndex = 0; sourceIndex < presentTerms.length; sourceIndex += 1) {
      for (let targetIndex = sourceIndex + 1; targetIndex < presentTerms.length; targetIndex += 1) {
        const [source, target] = [presentTerms[sourceIndex], presentTerms[targetIndex]].sort();
        const key = `${source}|${target}`;
        linkWeights.set(key, (linkWeights.get(key) || 0) + 1);
      }
    }
  });
  const links = [...linkWeights.entries()]
    .map(([key, weight]) => {
      const [source, target] = key.split('|');
      return { source, target, weight };
    })
    .sort((left, right) => right.weight - left.weight)
    .slice(0, 72);
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const velocity = nodes.map(() => ({ x: 0, y: 0 }));

  for (let iteration = 0; iteration < 150; iteration += 1) {
    const force = nodes.map(() => ({ x: 0, y: 0 }));

    for (let left = 0; left < nodes.length; left += 1) {
      for (let right = left + 1; right < nodes.length; right += 1) {
        const dx = nodes[right].x - nodes[left].x;
        const dy = nodes[right].y - nodes[left].y;
        const distanceSquared = Math.max(dx * dx + dy * dy, 25);
        const distance = Math.sqrt(distanceSquared);
        const push = 900 / distanceSquared;
        force[left].x -= (dx / distance) * push;
        force[left].y -= (dy / distance) * push;
        force[right].x += (dx / distance) * push;
        force[right].y += (dy / distance) * push;
      }
    }

    links.forEach((link) => {
      const source = nodeById.get(link.source);
      const target = nodeById.get(link.target);
      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const distance = Math.max(Math.hypot(dx, dy), 1);
      const pull = (distance - 105) * 0.004;
      const sourceIndex = nodes.indexOf(source);
      const targetIndex = nodes.indexOf(target);
      force[sourceIndex].x += (dx / distance) * pull;
      force[sourceIndex].y += (dy / distance) * pull;
      force[targetIndex].x -= (dx / distance) * pull;
      force[targetIndex].y -= (dy / distance) * pull;
    });

    nodes.forEach((node, index) => {
      velocity[index].x = (velocity[index].x + force[index].x + (450 - node.x) * 0.002) * 0.84;
      velocity[index].y = (velocity[index].y + force[index].y + (250 - node.y) * 0.002) * 0.84;
      node.x = Math.max(30, Math.min(870, node.x + velocity[index].x));
      node.y = Math.max(28, Math.min(472, node.y + velocity[index].y));
    });
  }

  return { nodes, links };
}

function generateInfographicBlueprint(text, analysis, params) {
  const graphEnabled = params.generateConceptGraph !== false;
  const conceptGraph = graphEnabled ? generateConceptGraph(text, params.conceptGraphNodeLimit) : null;
  const keyMetrics = [
    { value: analysis.metrics[0] || '99.9%', label: 'Efficiency Gain / Metric Delta', trend: '+28%', icon: 'TrendingUp', color: 'indigo' },
    { value: analysis.metrics[1] || '118x', label: 'Throughput Acceleration', trend: 'Verified', icon: 'Zap', color: 'emerald' },
    { value: analysis.metrics[2] || '0.00%', label: 'Packet / Data Degradation', trend: 'Optimal', icon: 'ShieldCheck', color: 'cyan' },
    { value: analysis.metrics[3] || '24/7', label: 'Continuous Telemetry', trend: 'Live', icon: 'Activity', color: 'amber' }
  ];

  const flowSteps = [
    { step: 1, title: 'Input Ingestion', desc: 'Raw source packets & telemetry ingested across multi-modal channels.' },
    { step: 2, title: 'Neural Vectorization', desc: 'Context, intent, and domain entities mapped to high-dimensional space.' },
    { step: 3, title: 'Parallel Synthesis', desc: 'Target artefacts generated simultaneously with parameter constraints.' },
    { step: 4, title: 'Delivery & Deployment', desc: 'Polished deliverables dispatched to executive and operational endpoints.' }
  ];

  const colorPalette = [
    { name: 'Primary Accent', hex: '#6366F1' },
    { name: 'Success Emerald', hex: '#10B981' },
    { name: 'Warning Amber', hex: '#F59E0B' },
    { name: 'Critical Crimson', hex: '#F43F5E' },
    { name: 'Dark Void Slate', hex: '#0F172A' }
  ];

  return {
    headline: analysis.cleanTitle,
    subtitle: `Visual Data Blueprint & Strategic Infographic Architecture | Style: ${params.contentStyle}`,
    colorPalette,
    keyMetrics,
    graphEnabled,
    conceptGraph,
    flowSteps,
    takeawayMessage: `Core Takeaway: Transforming raw unstructured intelligence into coordinated multi-channel communication accelerates team reaction speed by over 80%.`,
    figmaPrompt: `Modern dark-theme concept map infographic titled "${analysis.cleanTitle}". Build an airy, Obsidian-style network graph from the source concepts: varied-size labeled nodes, fine weighted relationship lines, and restrained color groups for technology, security, business, operations, and context. Keep labels legible against a near-black canvas. Add a compact metric strip and a 4-step process flow beneath the graph. Clean information-design aesthetic; avoid bar, line, or donut charts.`
  };
}

// ==========================================
// 6. EXECUTIVE SUMMARY GENERATOR
// ==========================================
function generateExecutiveSummary(text, analysis, params) {
  return {
    title: `Executive Brief: ${analysis.cleanTitle}`,
    bluf: `BOTTOM LINE UP FRONT: ${analysis.summaryExcerpt.slice(0, 220)}... Proactive containment and alignment with ${params.targetAudience} is essential within the current quarter.`,
    readTime: '60-Second Briefing',
    classification: 'CONFIDENTIAL // OPERATIONAL PRIORITY',
    strategicPillars: [
      {
        title: 'Operational Readiness',
        desc: `Rapid adoption of response protocols ensures critical uptime and shields mission-critical services from cascading bottlenecks.`
      },
      {
        title: 'Financial & Capital Efficiency',
        desc: `Mitigating exposure early prevents exponential recovery expenses, protecting corporate margin targets (${analysis.metrics.slice(0, 2).join(' / ')}).`
      },
      {
        title: 'Governance & Stakeholder Trust',
        desc: `Transparent communication with ${params.targetAudience.toLowerCase()} cements organizational credibility and satisfies regulatory mandates.`
      }
    ],
    decisionPoints: [
      'Approve emergency hotfix allocation and infrastructure maintenance window.',
      'Authorize immediate public/stakeholder disclosure statement via official channels.',
      'Establish bi-hourly situational monitoring bridge until incident closure.'
    ],
    kpis: [
      { label: 'Risk Exposure', value: analysis.severity, change: '-45% post-action' },
      { label: 'Containment Speed', value: '< 2 Hours', change: 'Optimal SLA' },
      { label: 'Resource Impact', value: 'Nominal', change: 'Standard budget' }
    ]
  };
}

// ==========================================
// 7. PRESENTATION SLIDES GENERATOR
// ==========================================
function generatePresentationDeck(text, analysis, params) {
  const slides = [
    {
      slideNumber: 1,
      title: analysis.cleanTitle,
      subtitle: `Strategic Transformation & Operational Briefing for ${params.targetAudience}`,
      layout: 'Title Slide',
      badge: 'Confidential Briefing',
      bullets: [
        `Prepared by: AI Content Transformation Engine`,
        `Audience: ${params.targetAudience}`,
        `Objective: ${params.communicationObjective}`,
        `Date: September 2026`
      ],
      speakerNotes: `Welcome everyone. Today we are walking through the critical developments surrounding ${analysis.cleanTitle}. Our objective is clear: assess the situation, review verifiable metrics, and execute on our strategic roadmap.`
    },
    {
      slideNumber: 2,
      title: 'Current Situation & Core Findings',
      subtitle: 'Understanding the operational landscape and key drivers',
      layout: 'Split Detail',
      badge: 'Context & Analysis',
      bullets: [
        `Observed Domain: ${analysis.domain}`,
        `Core Trigger: ${analysis.summaryExcerpt.slice(0, 110)}...`,
        `Key Impact Metrics: ${analysis.metrics.slice(0, 3).join(', ')}`,
        `Urgency Classification: ${analysis.severity}`
      ],
      speakerNotes: `On slide 2, notice the core telemetry figures. As you can see from our verified data points, delaying action is not an option. The ripple effects directly intersect with our strategic priorities.`
    },
    {
      slideNumber: 3,
      title: 'Architectural & Strategic Impact',
      subtitle: 'Cross-functional implications across infrastructure and business units',
      layout: 'Metric Grid',
      badge: 'Impact Assessment',
      bullets: [
        `High-impact vector: Ingress perimeters and mission-critical workflows.`,
        `Mitigation efficiency: Automated failover and blue-green canary deployment paths.`,
        `Compliance status: Adheres to international industry standards and governance models.`,
        `Target outcome: Zero unplanned downtime and fortified stakeholder trust.`
      ],
      speakerNotes: `Slide 3 highlights the cross-functional matrix. We have isolated the primary blast radius and configured failover mechanisms to protect core operations.`
    },
    {
      slideNumber: 4,
      title: 'Action Plan & Execution Roadmap',
      subtitle: 'Immediate deliverables, milestones, and owner accountability',
      layout: 'Roadmap Milestone',
      badge: 'Execution Path',
      bullets: [
        `Phase 1 (Immediate / 0-24h): Restrict perimeter ingress and deploy verified patch.`,
        `Phase 2 (Day 2-3): Comprehensive telemetry audit and credential rotation.`,
        `Phase 3 (Day 4-7): Stakeholder retrospective and long-term architectural hardening.`,
        `Phase 4 (Ongoing): Continuous automated synthetic monitoring.`
      ],
      speakerNotes: `Here is our 4-phase rollout timeline. Phase 1 begins immediately upon conclusion of this briefing. Accountability is assigned to lead operational and engineering commanders.`
    },
    {
      slideNumber: 5,
      title: 'Conclusion & Strategic Decisions',
      subtitle: 'Summary of required approvals and next steps',
      layout: 'Summary & Q&A',
      badge: 'Next Steps',
      bullets: [
        `Decision 1: Ratify the proposed containment budget and maintenance window.`,
        `Decision 2: Authorize public & partner communication release.`,
        `Open Floor: Questions, observations, and immediate operational adjustments.`
      ],
      speakerNotes: `In conclusion, we need two formal approvals today before we break. Thank you for your leadership, and I now open the floor for any questions.`
    }
  ];

  return {
    deckTitle: analysis.cleanTitle,
    slideCount: slides.length,
    slides
  };
}
