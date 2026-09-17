/**
 * legalTopologyService.js
 * NyayaNode — Enterprise Jurisprudence Dependency Mesh, Statutory Netlist, and Precedent Corridors
 */

class LegalTopologyService {
  constructor() {
    this.statutes = [
      {
        bnsSection: 'BNS 103(1)',
        ipcSection: 'IPC 302',
        offenseTitle: 'Murder',
        bailability: 'Non-Bailable',
        cognizable: true,
        punishment: 'Death or Imprisonment for Life and Fine',
        court: 'Court of Session',
        proceduralShift: 'Trial expedited under BNSS 2023 Sec 346'
      },
      {
        bnsSection: 'BNS 103(2)',
        ipcSection: 'New (Mob Lynching)',
        offenseTitle: 'Mob Lynching by 5 or more persons',
        bailability: 'Non-Bailable',
        cognizable: true,
        punishment: 'Death or Imprisonment for Life and Fine',
        court: 'Court of Session',
        proceduralShift: 'Special category created in BNS 2023'
      },
      {
        bnsSection: 'BNS 106(2)',
        ipcSection: 'IPC 304A (Enhanced)',
        offenseTitle: 'Causing death by rash driving and fleeing scene',
        bailability: 'Non-Bailable',
        cognizable: true,
        punishment: 'Imprisonment up to 10 Years and Fine',
        court: 'Magistrate of First Class',
        proceduralShift: 'Enhanced punishment for fleeing without reporting'
      },
      {
        bnsSection: 'BNS 316(2)',
        ipcSection: 'IPC 406',
        offenseTitle: 'Criminal Breach of Trust',
        bailability: 'Non-Bailable',
        cognizable: true,
        punishment: 'Imprisonment up to 5 Years, or Fine, or Both',
        court: 'Magistrate of First Class',
        proceduralShift: 'Punishment increased from 3 years to 5 years'
      },
      {
        bnsSection: 'BNS 318(2)',
        ipcSection: 'IPC 420',
        offenseTitle: 'Cheating and dishonestly inducing delivery of property',
        bailability: 'Non-Bailable',
        cognizable: true,
        punishment: 'Imprisonment up to 7 Years and Fine',
        court: 'Magistrate of First Class',
        proceduralShift: 'Mandatory Sec 35 BNSS checklist required'
      }
    ];

    this.corridors = [
      {
        id: 'corridor-bns103-court-session',
        sourceStatute: 'BNS 103(1) Murder',
        targetStatute: 'Court of Session Trial',
        jurisdictionLevel: 'Sessions Court',
        bindingPrecedent: 'Bachan Singh v. State of Punjab (1980) 2 SCC 684',
        statutoryAdherencePct: 99.8,
        precedentForce: 'MANDATORY',
        proceduralProtocol: 'BNSS Section 251-260',
        status: 'ACTIVE'
      },
      {
        id: 'corridor-bns106-hitrun-bail',
        sourceStatute: 'BNS 106(2) Hit & Run Fleeing',
        targetStatute: 'Satender Kumar Antil Category B',
        jurisdictionLevel: 'Magistrate / High Court',
        bindingPrecedent: 'Satender Kumar Antil v. CBI (2022) 10 SCC 51',
        statutoryAdherencePct: 98.5,
        precedentForce: 'MANDATORY',
        proceduralProtocol: 'BNSS Section 482 Anticipatory Bail',
        status: 'ACTIVE'
      },
      {
        id: 'corridor-arnesh-notice-bnss35',
        sourceStatute: 'CrPC Section 41A Notice',
        targetStatute: 'BNSS Section 35(3) Mandatory Notice',
        jurisdictionLevel: 'Investigation & Police Station',
        bindingPrecedent: 'Arnesh Kumar v. State of Bihar (2014) 8 SCC 273',
        statutoryAdherencePct: 99.4,
        precedentForce: 'CONSTITUTIONAL_MANDATE',
        proceduralProtocol: 'Contempt of Court for Failure to Serve Notice',
        status: 'ACTIVE'
      },
      {
        id: 'corridor-bsa63-evidence-custody',
        sourceStatute: 'BSA Section 63 Electronic Record',
        targetStatute: 'Cryptographic Hash SHA-256 Certificate',
        jurisdictionLevel: 'Trial Evidence Admissibility',
        bindingPrecedent: 'Arjun Panditrao Khotkar v. Kailash Kushanrao (2020) 7 SCC 1',
        statutoryAdherencePct: 100.0,
        precedentForce: 'THREE_JUDGE_BENCH',
        proceduralProtocol: 'Section 63(4) BSA Mandatory Hash Signature',
        status: 'ACTIVE'
      },
      {
        id: 'corridor-contract-sec27-void',
        sourceStatute: 'Section 27 Indian Contract Act',
        targetStatute: 'Void Ab Initio Non-Compete Injunction',
        jurisdictionLevel: 'Commercial Court / High Court',
        bindingPrecedent: "Percept D'Mark v. Zaheer Khan (2006) 4 SCC 227",
        statutoryAdherencePct: 99.9,
        precedentForce: 'SUPREME_COURT_RATIO',
        proceduralProtocol: 'Summary Rejection of Restraint of Trade Petitions',
        status: 'ACTIVE'
      }
    ];
  }

  // ── STATUTES CRUD ──────────────────────────────────────────
  getAllStatutes() {
    return [...this.statutes];
  }

  getStatuteByBns(bns) {
    return this.statutes.find(s => s.bnsSection.toLowerCase().includes(bns.toLowerCase()));
  }

  createStatute(statuteData) {
    const newStatute = {
      bnsSection: statuteData.bnsSection || `BNS ${Date.now().toString(36)}`,
      ipcSection: statuteData.ipcSection || 'IPC Equivalent',
      offenseTitle: statuteData.offenseTitle || 'Statutory Offense',
      bailability: statuteData.bailability || 'Non-Bailable',
      cognizable: Boolean(statuteData.cognizable ?? true),
      punishment: statuteData.punishment || 'Imprisonment as per statute',
      court: statuteData.court || 'Court of Session',
      proceduralShift: statuteData.proceduralShift || 'Updated under BNSS 2023'
    };
    this.statutes.push(newStatute);
    return newStatute;
  }

  deleteStatute(bnsSection) {
    const idx = this.statutes.findIndex(s => s.bnsSection === bnsSection);
    if (idx === -1) return false;
    this.statutes.splice(idx, 1);
    // Cascading integrity: sever all corridors that originate or target this statute
    this.corridors = this.corridors.filter(c => !c.sourceStatute.includes(bnsSection) && !c.targetStatute.includes(bnsSection));
    return true;
  }

  deleteAllStatutes() {
    const count = this.statutes.length;
    this.statutes = [];
    this.corridors = [];
    return count;
  }

  bulkCreateStatutes(statutesList) {
    const created = [];
    for (const s of statutesList) {
      if (s && (s.bnsSection || s.offenseTitle)) {
        created.push(this.createStatute(s));
      }
    }
    return created;
  }

  parseStatuteCSV(csvContent) {
    const lines = csvContent.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length <= 1) return [];

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const bnsIdx = headers.findIndex(h => h.includes('bns'));
    const ipcIdx = headers.findIndex(h => h.includes('ipc'));
    const titleIdx = headers.findIndex(h => h.includes('title') || h.includes('offense'));
    const bailIdx = headers.findIndex(h => h.includes('bail'));
    const cognIdx = headers.findIndex(h => h.includes('cogniz'));
    const punishIdx = headers.findIndex(h => h.includes('punish'));
    const courtIdx = headers.findIndex(h => h.includes('court'));

    const parsed = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
      if (cols.length < 2) continue;

      parsed.push({
        bnsSection: bnsIdx !== -1 ? cols[bnsIdx] : cols[0],
        ipcSection: ipcIdx !== -1 ? cols[ipcIdx] : cols[1],
        offenseTitle: titleIdx !== -1 ? cols[titleIdx] : cols[2] || 'Statutory Offense',
        bailability: bailIdx !== -1 ? cols[bailIdx] : 'Non-Bailable',
        cognizable: cognIdx !== -1 ? (cols[cognIdx].toLowerCase() === 'true' || cols[cognIdx] === '1') : true,
        punishment: punishIdx !== -1 ? cols[punishIdx] : 'As per law',
        court: courtIdx !== -1 ? cols[courtIdx] : 'Magistrate of First Class'
      });
    }
    return parsed;
  }

  // ── CORRIDORS CRUD ─────────────────────────────────────────
  getAllCorridors() {
    return [...this.corridors];
  }

  getMetrics() {
    const total = this.corridors.length;
    const active = this.corridors.filter(c => c.status === 'ACTIVE').length;
    const totalAdherence = total > 0 ? this.corridors.reduce((s, c) => s + (c.statutoryAdherencePct || 99), 0) / total : 100;

    return {
      totalCorridors: total,
      activeCorridors: active,
      avgStatutoryAdherencePct: Math.round(totalAdherence * 10) / 10,
      totalStatutes: this.statutes.length,
      precedentBindingConfidencePct: 99.6,
      statutoryRegime: 'BNS 2023 / BNSS / BSA'
    };
  }

  provisionCorridor(corridorData) {
    const id = corridorData.id || `corridor-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    const newCorridor = {
      id,
      sourceStatute: corridorData.sourceStatute || 'BNS 103(1) Murder',
      targetStatute: corridorData.targetStatute || 'Court of Session Trial',
      jurisdictionLevel: corridorData.jurisdictionLevel || 'Sessions Court',
      bindingPrecedent: corridorData.bindingPrecedent || 'Supreme Court Landmark Precedent',
      statutoryAdherencePct: Number(corridorData.statutoryAdherencePct) || 99.5,
      precedentForce: corridorData.precedentForce || 'MANDATORY',
      proceduralProtocol: corridorData.proceduralProtocol || 'BNSS Statutory Procedure',
      status: 'ACTIVE'
    };
    this.corridors.push(newCorridor);
    return newCorridor;
  }

  severCorridor(id) {
    const idx = this.corridors.findIndex(c => c.id === id);
    if (idx === -1) return false;
    this.corridors.splice(idx, 1);
    return true;
  }

  deleteAllCorridors() {
    const count = this.corridors.length;
    this.corridors = [];
    return count;
  }

  bulkCreateCorridors(corridorsList) {
    const created = [];
    for (const c of corridorsList) {
      if (c && (c.sourceStatute || c.from)) {
        created.push(this.provisionCorridor({
          sourceStatute: c.sourceStatute || c.from,
          targetStatute: c.targetStatute || c.to,
          jurisdictionLevel: c.jurisdictionLevel || c.jurisdiction,
          bindingPrecedent: c.bindingPrecedent || c.precedent,
          statutoryAdherencePct: c.statutoryAdherencePct || c.adherence,
          precedentForce: c.precedentForce || 'MANDATORY',
          proceduralProtocol: c.proceduralProtocol || c.protocol
        }));
      }
    }
    return created;
  }

  parseCorridorCSV(csvContent) {
    const lines = csvContent.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length <= 1) return [];

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const srcIdx = headers.findIndex(h => h.includes('source') || h === 'from');
    const tgtIdx = headers.findIndex(h => h.includes('target') || h === 'to');
    const jurIdx = headers.findIndex(h => h.includes('jurisdiction') || h.includes('court'));
    const precIdx = headers.findIndex(h => h.includes('precedent'));
    const adhIdx = headers.findIndex(h => h.includes('adherence') || h.includes('pct'));
    const protoIdx = headers.findIndex(h => h.includes('protocol') || h.includes('bnss'));

    const parsed = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
      if (cols.length < 2) continue;

      parsed.push({
        sourceStatute: srcIdx !== -1 ? cols[srcIdx] : cols[0],
        targetStatute: tgtIdx !== -1 ? cols[tgtIdx] : cols[1],
        jurisdictionLevel: jurIdx !== -1 ? cols[jurIdx] : 'High Court / Session',
        bindingPrecedent: precIdx !== -1 ? cols[precIdx] : 'Supreme Court Precedent',
        statutoryAdherencePct: adhIdx !== -1 ? parseFloat(cols[adhIdx]) || 99.5 : 99.5,
        proceduralProtocol: protoIdx !== -1 ? cols[protoIdx] : 'BNSS Compliance'
      });
    }
    return parsed;
  }
}

const legalTopologyService = new LegalTopologyService();
module.exports = { legalTopologyService, LegalTopologyService };
