# ⚖️ NyayaNode: Legal Matrix & Jurisprudence Platform

NyayaNode is a Node.js and Express legal technology platform that provides statutory cross-conversion between the Bharatiya Nyaya Sanhita (BNS 2023) and the Indian Penal Code (IPC 1860), rule-based FIR offense assessment, contract clause vulnerability auditing under the Indian Contract Act, cryptographic evidence hashing under Section 63 of the Bharatiya Sakshya Adhiniyam (BSA 2023), and an in-memory jurisprudence dependency mesh with batch CSV/JSON ingestion.

---

## 📸 Platform Showcase

![NyayaNode Platform Hero Showcase](platform_hero_showcase.png)

### Dashboard Viewports

| Viewport | Description | Screenshot |
| :--- | :--- | :--- |
| **Dual Statutory Matrix** | Cross-converts BNS 2023, BNSS 2023, and IPC 1860 with live bailability and cognizable search | ![Dual Statutory Matrix](screenshots/desktop/01_desktop_dual_statutory_matrix.png) |
| **Jurisprudence Mesh** | Relational topology linking statutes, landmark Supreme Court precedents, telemetry, and corridor severance controls | ![Jurisprudence Topology Mesh](screenshots/desktop/02_desktop_jurisprudence_topology_mesh.png) |
| **Batch Ingestion Studio** | Batch ingestion interface supporting CSV and JSON formats with template switching and universal purge controls | ![Batch Ingestion Studio](screenshots/desktop/03_desktop_enterprise_ingestion_studio.png) |
| **Incident & FIR Assessment** | Keyword-based offense evaluator, *Satender Kumar Antil* bail probability scoring, and *D.K. Basu* arrest safeguards | ![FIR Reasoning](screenshots/desktop/04_desktop_autonomous_incident_fir_reasoning.png) |
| **Smart Contract Auditor** | Section 27 ICA non-compete voidance detector, unilateral arbitrator alerts, and balanced redline clause suggestions | ![Contract Auditor](screenshots/desktop/05_desktop_smart_contract_risk_auditor.png) |
| **Sec 63 BSA Evidence Vault** | SHA-256 and SHA-512 cryptographic evidence certification conforming to *Arjun Panditrao Khotkar (2020)* | ![Sec 63 BSA Evidence Vault](screenshots/desktop/06_desktop_sec63_bsa_evidence_vault.png) |

---

## 🏛️ Features Built in Code

### 1. Dual Statutory Cross-Conversion Matrix
- Maps 18 criminal offenses between **Bharatiya Nyaya Sanhita (BNS 2023)** and the **Indian Penal Code (IPC 1860)** with title, category, cognizable status, bailability, trial court, punishment, and essential legal elements (`data/statutes_bns.json`, `engine/bns_cross_converter.js`).
- Maps 10 procedural transitions comparing **Bharatiya Nagarik Suraksha Sanhita (BNSS 2023)** and **Bharatiya Sakshya Adhiniyam (BSA 2023)** against the Code of Criminal Procedure (CrPC 1973) and the Indian Evidence Act 1872 (`engine/bns_cross_converter.js`).
- Provides real-time keyword, section number, and title search filtering via `GET /api/statutes` and `GET /api/statutes/convert`.

### 2. Rule-Based FIR & Offense Assessment Engine
- Analyzes incident narratives against stored statutory provisions using keyword and title string matching (`engine/fir_analyzer.js`).
- Identifies primary offenses, severity, cognizable status, and bailability.
- Computes a statutory bail probability score categorized using *Satender Kumar Antil v. CBI (2022)* offense categorization heuristics.
- Evaluates mandatory FIR registration directives under *Lalita Kumari v. Govt. of UP (2014)* (Section 173 BNSS).
- Evaluates mandatory arrest notice directives under *Arnesh Kumar v. State of Bihar (2014)* (Section 35(3) BNSS).
- Generates a procedural checklist of custodial safeguards mandated by *D.K. Basu v. State of West Bengal (1997)*.
- Exposes assessment via `POST /api/fir/analyze`.

### 3. Contract Vulnerability Auditor
- Scans contract text using regular expression pattern matching against 6 legal rules (`data/contract_rules.json`, `engine/contract_auditor.js`):
  - Section 27 Indian Contract Act post-employment non-compete voidance (*Percept D'Mark v. Zaheer Khan*).
  - Unilateral uncapped indemnification clauses (Sections 124-125 Indian Contract Act).
  - Punitive liquidated damages penalties (Section 74 Indian Contract Act; *ONGC v. Saw Pipes*).
  - Unilateral sole arbitrator appointments (Section 12(5) Arbitration and Conciliation Act; *Perkins Eastman*).
  - Overbroad personal IP assignments (Section 19 Copyright Act).
  - Asymmetrical termination for convenience (Section 14 Specific Relief Act).
- Computes a weighted Contract Vulnerability Index (CVI, scale 5-100) and risk level (LOW, MODERATE, CRITICAL).
- Returns matched clause excerpts and balanced redline recommendations.
- Exposes auditing via `POST /api/contract/audit`.

### 4. Cryptographic Evidence Vault
- Computes SHA-256 and SHA-512 cryptographic hashes for digital evidence records using the Node.js `crypto` module (`engine/evidence_vault.js`).
- Maintains an in-memory custody ledger linking new entries to the previous record's block hash.
- Generates court-admissible Section 63(4) Bharatiya Sakshya Adhiniyam (BSA 2023) legal certificates citing *Arjun Panditrao Khotkar v. Kailash Kushanrao Gorantyal (2020)*.
- Verifies digital evidence tampering by comparing recomputed SHA-256 hashes against stored ledger records.
- Exposes endpoints at `POST /api/evidence/register`, `GET /api/evidence/ledger`, and `POST /api/evidence/verify`.

### 5. Landmark Supreme Court Precedents Library
- Indexes 6 landmark Supreme Court judgments (*Arnesh Kumar*, *Satender Kumar Antil*, *Lalita Kumari*, *D.K. Basu*, *Arjun Panditrao Khotkar*, *Percept D'Mark v. Zaheer Khan*) with citations, bench compositions, applicable sections, ratios decidendi, and procedural safeguards (`data/landmark_precedents.json`, `engine/precedent_engine.js`).
- Exposes precedent search via `GET /api/precedents?q=`.

### 6. Interactive Moot Courtroom Simulator
- Presents 2 structured legal dispute scenarios: Notice of Appearance under BNSS Section 35 and Non-compete enforceability under ICA Section 27 (`public/js/app.js`, `public/index.html`).
- Displays factual matrix, prosecution arguments, defense counter-arguments, and judicial bench rulings.

### 7. Jurisprudence Dependency Mesh & Batch Ingestion
- Manages an in-memory relational store (`engine/legalTopologyService.js`) linking criminal statutes to procedural corridors (court levels, binding precedents, and protocol compliance).
- Supports corridor creation (`POST /api/topology/corridors`), single corridor severance (`DELETE /api/topology/corridors/:id`), and universal purge (`DELETE /api/topology/corridors`).
- Enforces cascading deletion: deleting a statute automatically severs all corridors linked to it (`DELETE /api/topology/statutes/:bnsSection`).
- Ingests batch datasets in RFC 4180 CSV or JSON format for statutes (`POST /api/topology/statutes/upload`) and corridors (`POST /api/topology/corridors/upload`).
- Computes live adherence telemetry metrics (`GET /api/topology/corridors`).

### 8. Web User Interface
- Dark-mode responsive dashboard built with vanilla HTML5, CSS3, and JavaScript served by Express (`public/index.html`, `public/css/style.css`, `public/js/app.js`).
- Includes real-time tab switching, pre-filled scenario buttons, copy-to-clipboard certificate helpers, and status notifications.

---

## 🛠️ Tech Stack

- **Runtime & Server**: Node.js, Express 4, Helmet, Morgan, CORS
- **Cryptography**: Node.js native `crypto` module (SHA-256, SHA-512)
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+, zero frontend framework dependencies)
- **Data Layer**: Local JSON datasets (`data/`) with in-memory state management
- **Testing**: Node.js Native Test Runner (`node:test`, `node:assert`), Python 3 with Playwright

---

## 🧪 Automated Testing

The project includes 10 native Node.js unit tests validating statutory CRUD, cascading integrity, corridor severance, telemetry metrics, and batch CSV/JSON parsing:

```bash
# Execute unit test suite
node --test tests/enterpriseMesh.test.js
```

### Verified Test Coverage (10/10 Passing):
- [x] Retrieves pre-loaded BNS 2023 statutory mappings
- [x] Creates new statutory mapping
- [x] Cascades deletion: deleting a statute severs all connected dependency corridors
- [x] Executes universal statute purge and cascading link severance
- [x] Calculates legal adherence telemetry metrics
- [x] Provisions new precedent corridor
- [x] Severs legal escalation corridor
- [x] Executes universal corridor purge
- [x] Parses statute CSV and bulk creates mappings
- [x] Parses corridor CSV and bulk provisions corridors

---

## 🚀 Quickstart

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### Installation & Execution

```bash
# Install dependencies
npm install

# Run automated tests
node --test tests/enterpriseMesh.test.js

# Start the server
node server.js
```

Once started, navigate to:
```
http://localhost:5030
```

---

## 📜 License
MIT License.
