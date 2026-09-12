# ⚖️ NyayaNode: AI Jurisprudence & Legal Intelligence Network

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Statutory Matrix](https://img.shields.io/badge/Statutory%20Regime-BNS%202023%20%7C%20BNSS%20%7C%20BSA-gold)](#dual-statutory-legal-matrix)
[![Evidence Admissibility](https://img.shields.io/badge/Sec%2063%20BSA-Arjun%20Panditrao%20Compliant-emerald)](#section-63-bsa-cryptographic-evidence-vault)
[![Playwright Verified](https://img.shields.io/badge/Playwright-E2E%20Verified-brightgreen)](tests)

> **Google Project of the Year Caliber**: A senior-staff engineered LegalTech intelligence operating system delivering real-time criminal statute cross-conversion (BNS 2023 ↔ IPC 1860), autonomous incident FIR offense reasoning, Section 27 contract vulnerability auditing, Supreme Court precedent synthesis, and Section 63 BSA cryptographic evidence certification.

---

## 🏛️ System Overview

The Indian legal landscape underwent its most significant transformation since 1860 with the enactment of:
- **Bharatiya Nyaya Sanhita, 2023 (BNS)** replacing the *Indian Penal Code, 1860 (IPC)*
- **Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)** replacing the *Code of Criminal Procedure, 1973 (CrPC)*
- **Bharatiya Sakshya Adhiniyam, 2023 (BSA)** replacing the *Indian Evidence Act, 1872 (IEA)*

**NyayaNode** provides an AI-augmented jurisprudence bridge for advocates, judges, enterprises, and citizens:
1. **Dual Legal Matrix & Cross-Converter**: Direct bi-directional conversion between BNS and IPC, displaying essential elements, cognizable/non-cognizable status, bailability, mandatory punishments, and trial jurisdictions.
2. **Autonomous Incident Evaluator & FIR Assistant**: Natural-language fact pattern analyzer that identifies applicable offenses, evaluates mandatory FIR registration under *Lalita Kumari (2014)*, checks arrest compliance under *Arnesh Kumar (2014)* and BNSS Section 35(3), and calculates statistical bail probability under *Satender Kumar Antil (2022)*.
3. **Smart Legal Contract Risk & Clause Auditor**: Automatic detection of void ab initio non-compete clauses under Section 27 of the Indian Contract Act (*Percept D'Mark v. Zaheer Khan*), unilateral arbitrator appointment traps (*Perkins Eastman*), uncapped indemnities, and penalty forfeiture clauses with instant balanced redlines.
4. **Section 63 BSA Cryptographic Evidence Vault**: Computes SHA-256 and SHA-512 digital fingerprints for electronic exhibits (CCTV, audio recordings, WhatsApp exports) and generates court-admissible Section 63(4) BSA certificates conforming to the Supreme Court ratio in *Arjun Panditrao Khotkar (2020)*.
5. **Interactive Moot Courtroom Simulator**: Real-time legal dispute simulation pitting prosecution arguments against constitutional defense arguments with authoritative judicial bench rulings.

---

## 🔬 Core Architectural Modules

### 1. Statutory Cross-Conversion Engine (`engine/bns_cross_converter.js`)
- Maps modern criminal sections to colonial-era counterparts.
- Evaluates procedural shifts: Section 41A CrPC $\to$ Section 35 BNSS, Section 154 CrPC $\to$ Section 173 BNSS, Section 438 CrPC $\to$ Section 482 BNSS, Section 482 CrPC $\to$ Section 528 BNSS.
- Surfaces new statutory categories: Mob Lynching (BNS Sec 103(2)), Hit and Run escape liability (BNS Sec 106(2)), Organized Crime Syndicates (BNS Sec 111).

### 2. FIR Reasoning & Bail Probability Calculator (`engine/fir_analyzer.js`)
- Semantic keyword and fact pattern matching against statutory elements.
- Procedural classification according to *Satender Kumar Antil*:
  - **Category A**: Offenses punishable with $\le 7$ years imprisonment (Arnesh Kumar notice checklist mandatory).
  - **Category B**: Heinous offenses punishable with life imprisonment or death.
  - **Bailable offenses**: Immediate release on personal bond as an absolute matter of statutory right under BNSS Section 478.

### 3. Contract Risk Scanner (`engine/contract_auditor.js`)
- Scans agreements against Indian jurisprudence:
  - **Section 27 ICA**: Restraint of trade doctrine voiding all post-exit employment non-competes without exception.
  - **Section 124 & 125 ICA**: One-sided indemnity balancing and liability caps.
  - **Section 74 ICA**: Reasonable compensation limit on liquidated damages.
  - **Section 12(5) A&C Act**: Prohibition of unilateral sole arbitrator nomination.
- Calculates a Contract Vulnerability Index (CVI, 0–100) and supplies drop-in redlined clauses.

### 4. Section 63 BSA Evidence Vault (`engine/evidence_vault.js`)
- Cryptographic SHA-256 / SHA-512 custody hashing.
- Generates legally binding Section 63(4) BSA 2023 certificates complete with custodian declarations, device serial indicators, operating integrity attestations, and tamper verification.

---

## 🚀 Quickstart & Installation

### Prerequisites
- Node.js 18+ (tested on Node v25.8.1)
- Python 3.10+ (with `playwright` for testing)

### Installation
```bash
git clone https://github.com/Shashankcodelover/NyayaNode.git
cd NyayaNode
npm install
```

### Launch NyayaNode Web Console
```bash
npm start
# Console available at http://localhost:5030
```

### Run Playwright E2E Verification
```bash
python tests/playwright_nyaya_test.py
```

---

## 🧪 Verified Artifacts

End-to-end verified via Playwright Chromium:
- `nyayanode_matrix_verified.png`: Dual legal matrix with live BNS/IPC search.
- `nyayanode_fir_analysis_verified.png`: Highway robbery fact pattern analysis, 96% bail probability score, and D.K. Basu safeguards checklist.
- `nyayanode_contract_audit_verified.png`: Predatory employment contract audit (CVI 75/100) with Section 27 non-compete voidance alert.
- `nyayanode_evidence_vault_verified.png`: Real-time SHA-256 evidence hashing and Section 63 BSA certificate generator.
- `nyayanode_moot_court_verified.png`: Interactive prosecution vs defense courtroom deliberation.

---

## 📜 License
MIT License. Open-source jurisprudence and legal intelligence platform.
