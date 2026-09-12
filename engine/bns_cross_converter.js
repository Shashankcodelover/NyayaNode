const fs = require('fs');
const path = require('path');

const statutesPath = path.join(__dirname, '../data/statutes_bns.json');
let statutes = [];
try {
  statutes = JSON.parse(fs.readFileSync(statutesPath, 'utf8'));
} catch (e) {
  console.error('Failed to load statutes_bns.json:', e);
}

// Procedural procedural mapping (CrPC <-> BNSS & Evidence <-> BSA)
const proceduralMap = [
  {
    crpc: "41 / 41A",
    bnss: "35",
    title: "When police may arrest without warrant / Notice of Appearance",
    subject: "Criminal Procedure",
    significance: "Notice mandatory for offences <= 7 years imprisonment (Arnesh Kumar guideline)"
  },
  {
    crpc: "154",
    bnss: "173",
    title: "Information in cognizable cases (First Information Report - FIR)",
    subject: "Criminal Procedure",
    significance: "Includes provision for Zero FIR and electronic submission of FIR"
  },
  {
    crpc: "161",
    bnss: "180",
    title: "Examination of witnesses by police",
    subject: "Criminal Procedure",
    significance: "Audio-video recording permitted during witness statement recording"
  },
  {
    crpc: "167",
    bnss: "187",
    title: "Procedure when investigation cannot be completed in 24 hours (Remand)",
    subject: "Criminal Procedure",
    significance: "Police custody permitted in installments across first 40 or 60 days"
  },
  {
    crpc: "436",
    bnss: "478",
    title: "In what cases bail to be taken (Bailable offences)",
    subject: "Criminal Procedure",
    significance: "Mandatory right to release on execution of personal bond"
  },
  {
    crpc: "437",
    bnss: "480",
    title: "When bail may be taken in case of non-bailable offence",
    subject: "Criminal Procedure",
    significance: "Special considerations for sick, infirm, women, and under-age persons"
  },
  {
    crpc: "438",
    bnss: "482",
    title: "Direction for grant of bail to person apprehending arrest (Anticipatory Bail)",
    subject: "Criminal Procedure",
    significance: "Sessions Court and High Court concurrent jurisdiction"
  },
  {
    crpc: "482",
    bnss: "528",
    title: "Saving of inherent powers of High Court (Quashing of FIR / Chargesheet)",
    subject: "Criminal Procedure",
    significance: "To prevent abuse of process of court or secure ends of justice"
  },
  {
    crpc: "Evidence Act 65B",
    bnss: "BSA 63",
    title: "Admissibility of electronic records (Mandatory Certificate)",
    subject: "Law of Evidence",
    significance: "Mandatory certificate specifying device hash, hash algorithm, and chain of custody"
  },
  {
    crpc: "Evidence Act 27",
    bnss: "BSA 23",
    title: "How much of information received from accused may be proved (Recovery / Discovery)",
    subject: "Law of Evidence",
    significance: "Fact discovered in consequence of information received in police custody"
  }
];

class BnsCrossConverter {
  static getAllStatutes() {
    return statutes;
  }

  static getProceduralMap() {
    return proceduralMap;
  }

  static convert(query) {
    const q = String(query).trim().toLowerCase();
    
    // Direct matches
    const exactIpc = statutes.filter(s => s.ipc_section.toLowerCase().includes(q));
    const exactBns = statutes.filter(s => s.bns_section.toLowerCase().includes(q));
    const titleMatch = statutes.filter(s => s.title.toLowerCase().includes(q));
    const keywordMatch = statutes.filter(s => s.keywords.some(k => k.toLowerCase().includes(q)));

    const combined = [...new Set([...exactIpc, ...exactBns, ...titleMatch, ...keywordMatch])];
    
    // Check procedural matches
    const procMatch = proceduralMap.filter(p => 
      p.crpc.toLowerCase().includes(q) || 
      p.bnss.toLowerCase().includes(q) || 
      p.title.toLowerCase().includes(q) || 
      p.significance.toLowerCase().includes(q)
    );

    return {
      query,
      match_count: combined.length,
      statutory_matches: combined,
      procedural_matches: procMatch
    };
  }

  static getSectionDetails(bnsSection) {
    return statutes.find(s => s.bns_section === bnsSection) || null;
  }
}

module.exports = BnsCrossConverter;
