export const SAMPLE_PRESETS = [
  {
    id: 'cyber-threat',
    title: 'Zero-Day Cloud Gateway Advisory (CVE-2026-8821)',
    category: 'Threat Intelligence',
    badge: 'Critical Vulnerability',
    badgeColor: 'red',
    author: 'Global Cyber Defense Center (GCDC)',
    targetAudience: 'Technical Specialists',
    tone: 'Urgent & Action-Oriented',
    language: 'English (US)',
    levelOfDetail: 'Deep-Dive Comprehensive',
    communicationObjective: 'Mitigate Risk & Alert',
    contentStyle: 'Cyber Tactical',
    content: `CRITICAL SECURITY ADVISORY: CVE-2026-8821
TITLE: Remote Unauthenticated Memory Injection in Enterprise Cloud Connect Gateways v4.2-v4.8
SEVERITY: 9.8 / 10.0 (CVSS v4.0 Critical)
DATE: September 26, 2026

SUMMARY:
The Global Cyber Defense Center has identified active in-the-wild exploitation of a critical remote memory corruptive injection flaw in Enterprise Cloud Connect Gateways running firmware builds 4.2.0 through 4.8.4. The vulnerability allows remote, unauthenticated adversaries to transmit specially crafted UDP telemetry handshake packets to port 9443, bypassing packet inspection filters and achieving arbitrary kernel-level code execution on the edge routing fabric.

IMPACT & EXPLOITATION:
Over 14,000 public-facing enterprise perimeter nodes across financial services, healthcare grids, and aerospace contractors are currently vulnerable. Advanced Persistent Threat actor APT-449 ("SpecterKnot") has been observed deploying a memory-resident micro-rootkit ("VortexWeaver") capable of exfiltrating mTLS private key tokens, inter-cluster RPC communications, and establishing stealth reverse SSH tunnels.

AFFECTED SYSTEMS:
- Cloud Connect Edge Gateway Appliance v4.2.0 - v4.8.4
- Virtual Cloud Fabric Proxy running on AWS, Azure, and Google Cloud VPC peering modules
- Hybrid Kubernetes Ingress controllers running ECC-Ingress daemon v1.8.x

MITIGATION & IMMEDIATE WORKAROUND:
1. Immediate Isolation: Restrict inbound UDP traffic to edge port 9443 to explicitly whitelisted source IP CIDR ranges or disable WAN telemetry reporting via administrative CLI: 'sysctl -w net.ecc.telemetry_wan=0'.
2. Emergency Patching: Vendor Hotfix Build 4.8.5-patch3 has been pushed to the enterprise distribution channel. Deploy immediately via rolling blue-green orchestration.
3. IOC Hunting: Inspect system journals for anomalous core dumps in '/var/log/ecc-router.panic' and egress beacons to rogue subnets 185.220.101.0/24.
4. Rotate Credentials: Revoke all edge TLS ingress certificates generated prior to 06:00 UTC today.`,
  },
  {
    id: 'quantum-ai',
    title: 'Breakthrough in Quantum-Accelerated Neural Agents',
    category: 'Research Paper',
    badge: 'DeepTech Innovation',
    badgeColor: 'purple',
    author: 'Frontier AI Research Laboratories',
    targetAudience: 'Technical Specialists & C-Suite',
    tone: 'Inspiring & Thought-Leadership',
    language: 'English (US)',
    levelOfDetail: 'Standard / Balanced',
    communicationObjective: 'Inform & Educate',
    contentStyle: 'Modern Minimalist',
    content: `RESEARCH ANNOUNCEMENT: Q-Synapse: 100x Efficiency in Autonomous Agent Multi-Step Reasoning via Photonic Quantum Tensor Acceleration
AUTHORS: Dr. Elena Vance, Marcus Thorne, Deep Quantum AI Collaboration
PUBLISHED: IEEE Quantum & Neural Computing Journal, Fall 2026

ABSTRACT:
Current autonomous LLM agents face severe latency and energy bottlenecks when performing recursive tree-of-thought exploration and Monte Carlo planning across complex decision domains. We present 'Q-Synapse', a hybrid photonic-qubit co-processor architecture coupled with an adaptive sparse attention tokenizer.

KEY FINDINGS & METRICS:
1. 118x Inference Latency Reduction: Complex multi-agent code orchestration and theorem proving tasks reduced from 42 seconds to 356 milliseconds.
2. 94% Energy Reduction: Power draw per million generated planning tokens plummeted from 320 Watts to 18.5 Watts using room-temperature topological optical qubits.
3. Zero-Degradation Context Window: Flawlessly retains and cross-references 10,000,000 continuous context tokens with 99.97% recall accuracy on the Long-Horizon Needle benchmark.
4. Autonomous Self-Correction: Achieved an unprecedented 96.4% success rate on SWE-bench Verified without requiring human-in-the-loop intervention.

STRATEGIC IMPLICATIONS:
This breakthrough enables continuous, real-time autonomous enterprise workflows—from algorithmic drug discovery to automated cybersecurity counter-measures—operating within edge data centers at a fraction of hyperscaler capital expenditures. Commercial general availability for enterprise partners is slated for Q1 2027.`,
  },
  {
    id: 'financial-esg',
    title: 'Q3 Global Sustainable Energy Transition & Margin Growth',
    category: 'Corporate Earnings & ESG',
    badge: 'Executive Briefing',
    badgeColor: 'emerald',
    author: 'Helios Global Infrastructure Board of Directors',
    targetAudience: 'Investors & Board of Directors',
    tone: 'Authoritative & Formal',
    language: 'English (US)',
    levelOfDetail: 'Standard / Balanced',
    communicationObjective: 'Persuade & Influence',
    contentStyle: 'Enterprise Corporate',
    content: `HELIOS INFRASTRUCTURE GROUP - Q3 2026 FINANCIAL & SUSTAINABILITY DISCLOSURE
RELEASE DATE: September 24, 2026
REPORTING SPOKESPERSON: Sarah Lin, Chief Executive Officer & Chief Financial Officer

EXECUTIVE SUMMARY & OPERATIONAL HIGHLIGHTS:
Helios Infrastructure delivered exceptional third-quarter performance, generating record GAAP revenue of $4.82 Billion (+26.4% YoY) and GAAP Operating Margin expansion to 31.8% (+410 bps). This growth was propelled by the nationwide commercial deployment of our Generation-IV Grid-Scale Sodium-Ion Energy Storage arrays.

KEY FINANCIAL METRICS:
- Net Income: $1.15 Billion, an increase of 38% compared to $833 Million in Q3 2025.
- Free Cash Flow: $980 Million, sustaining a 20.3% FCF margin.
- Clean Power Output: 18.4 Terawatt-hours delivered, offsetting 9.2 million metric tons of CO2 equivalent emissions.
- Industrial Backlog: Contracted long-term Power Purchase Agreements (PPAs) totaling $28.5 Billion across hyperscale data center operators.

STRATEGIC CAPITAL ALLOCATION:
1. Expanding Gigafactory-Beta production capacity to 45 GWh/year ahead of schedule.
2. Initiating a $500M Share Repurchase Program and increasing the quarterly dividend by 15% to $0.46 per share.
3. Achieving 100% water-neutral manufacturing across North American and European facilities 18 months ahead of the 2028 net-zero milestone roadmap.

OUTLOOK:
Raising FY2026 full-year revenue guidance to $18.5B - $18.9B (prior guidance $17.8B - $18.2B), with projected EBITDA growth of 28%.`,
  },
  {
    id: 'incident-response',
    title: 'Subsea Fiber Cable Incident & Redundant Failover Notice',
    category: 'Incident Response',
    badge: 'Operations Advisory',
    badgeColor: 'amber',
    author: 'Global Telecommunications Resilience Operations',
    targetAudience: 'Enterprise Customers & B2B',
    tone: 'Crisis Response / Calming',
    language: 'English (US)',
    levelOfDetail: 'Concise / Executive Brief',
    communicationObjective: 'Inform & Reassure',
    contentStyle: 'Enterprise Corporate',
    content: `INCIDENT ADVISORY: SEA-ME-WE-7 Cable Cut & Traffic Re-routing Status
INCIDENT TICKET: INC-2026-99120
STATUS: CONTAINED / TRAFFIC DIVERSIFIED
TIMESTAMP: 14:22 UTC, September 26, 2026

INCIDENT OVERVIEW:
At 11:05 UTC, our Global Network Operations Center (NOC) detected a physical severance on the SEA-ME-WE-7 trans-oceanic fiber optic submarine cable system segment located 84 km off the coast of Alexandria, Egypt, caused by maritime anchor drag during a storm surge.

AUTOMATED ACTION & FAILOVER:
Within 420 milliseconds of loss-of-signal, autonomous BGP egress route engineering diverted 100% of tier-1 IP transit through the Trans-Sahara Terrestrial Ring and the Southern Cape High-Throughput Subsea Array.

CUSTOMER IMPACT:
- Core Packet Loss: 0.00% across all enterprise MPLS and SD-WAN endpoints.
- Latency Variance: APAC to Western Europe average round-trip ping increased slightly by +14ms (112ms to 126ms), well within our 99.999% Service Level Agreement (SLA) threshold.
- Cloud Direct-Connect circuits remain fully operational with zero degraded data transfer.

NEXT STEPS & REPAIR TIMELINE:
Two specialized submarine cable repair vessels have been dispatched from Marseille and Port Said with estimated on-site arrival within 36 hours. Full physical splice restoration is anticipated within 7 to 9 business days. Continuous telemetry updates will be provided via the enterprise status portal every 6 hours.`,
  }
];
