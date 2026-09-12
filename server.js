const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const BnsCrossConverter = require('./engine/bns_cross_converter');
const FirAnalyzer = require('./engine/fir_analyzer');
const ContractAuditor = require('./engine/contract_auditor');
const PrecedentEngine = require('./engine/precedent_engine');
const EvidenceVault = require('./engine/evidence_vault');

const app = express();
const PORT = process.env.PORT || 5030;

// Security & Middleware
app.use(helmet({
  contentSecurityPolicy: false // Allow modern inline scripts & CDN fonts/icons in dashboard
}));
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Static Frontend
app.use(express.static(path.join(__dirname, 'public')));

// === API ROUTES ===

// Health & System Info
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'NyayaNode AI Jurisprudence & Legal Intelligence Network',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Network Statistics
app.get('/api/stats', (req, res) => {
  const statutes = BnsCrossConverter.getAllStatutes();
  const procedural = BnsCrossConverter.getProceduralMap();
  const precedents = PrecedentEngine.getAllPrecedents();
  const ledger = EvidenceVault.getLedger();

  res.json({
    total_statutes: statutes.length,
    procedural_mappings: procedural.length,
    landmark_precedents: precedents.length,
    secured_evidence_blocks: ledger.length,
    statutory_regime: "Bharatiya Nyaya Sanhita (BNS 2023) / BNSS / BSA & IPC / CrPC / IEA Dual Matrix",
    uptime_seconds: process.uptime()
  });
});

// BNS / IPC Cross Converter
app.get('/api/statutes', (req, res) => {
  res.json({
    statutes: BnsCrossConverter.getAllStatutes(),
    procedural_mappings: BnsCrossConverter.getProceduralMap()
  });
});

app.get('/api/statutes/convert', (req, res) => {
  const query = req.query.q || '';
  if (!query) {
    return res.json({
      query: '',
      match_count: 0,
      statutory_matches: [],
      procedural_matches: []
    });
  }
  const results = BnsCrossConverter.convert(query);
  res.json(results);
});

// FIR & Offense Assessment Engine
app.post('/api/fir/analyze', (req, res) => {
  try {
    const { incidentText } = req.body;
    if (!incidentText) {
      return res.status(400).json({ error: 'incidentText is required' });
    }
    const result = FirAnalyzer.analyze(incidentText);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Smart Contract Risk Auditor
app.post('/api/contract/audit', (req, res) => {
  try {
    const { contractText } = req.body;
    if (!contractText) {
      return res.status(400).json({ error: 'contractText is required' });
    }
    const result = ContractAuditor.audit(contractText);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Landmark Supreme Court Precedents
app.get('/api/precedents', (req, res) => {
  const query = req.query.q;
  const results = PrecedentEngine.search(query);
  res.json(results);
});

// Section 63 BSA Evidence Ledger & Vault
app.post('/api/evidence/register', (req, res) => {
  try {
    const { name, sourceDevice, custodianName, content, mediaType } = req.body;
    if (!content) {
      return res.status(400).json({ error: 'content is required for cryptographic registration' });
    }
    const record = EvidenceVault.registerEvidence({
      name,
      sourceDevice,
      custodianName,
      content,
      mediaType
    });
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/evidence/ledger', (req, res) => {
  res.json({
    ledger_length: EvidenceVault.getLedger().length,
    records: EvidenceVault.getLedger()
  });
});

app.post('/api/evidence/verify', (req, res) => {
  try {
    const { evidenceId, content } = req.body;
    if (!evidenceId || !content) {
      return res.status(400).json({ error: 'evidenceId and content are required' });
    }
    const result = EvidenceVault.verifyTampering(evidenceId, content);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Catch-all: serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`⚖️ NyayaNode Legal Intelligence Server running on port ${PORT}`);
  console.log(`🌐 Dashboard: http://localhost:${PORT}`);
});
