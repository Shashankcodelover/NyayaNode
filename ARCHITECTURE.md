# 🏛️ NyayaNode Architecture & Technical Specification

## 1. System Architecture Diagram

```
+---------------------------------------------------------------------------------+
|                                 NyayaNode Client                                |
|   (Interactive Glassmorphic Single-Page Application, Lucide Icons, Responsive)  |
+----------------------------------------+----------------------------------------+
                                         | HTTP / JSON REST
                                         v
+---------------------------------------------------------------------------------+
|                              Express API Gateway                                |
|            Port 5030 | Helmet Security Headers | CORS | Morgan Logging          |
+-------+--------------------+-------------------+-------------------+------------+
        |                    |                   |                   |
        v                    v                   v                   v
+---------------+    +---------------+   +---------------+   +--------------------+
|  BNS Converter|    |  FIR Analyzer |   |Contract Auditor|  |   Evidence Vault   |
|   (BNS / IPC  |    |  (Incident    |   | (Sec 27 ICA,  |   |  (SHA-256 Custody  |
|  Dual Matrix) |    |  Assessment)  |   |  CVI Scoring) |   |  Sec 63 BSA Cert)  |
+-------+-------+    +-------+-------+   +-------+-------+   +---------+----------+
        |                    |                   |                     |
        v                    v                   v                     v
+---------------+    +---------------+   +---------------+   +--------------------+
| Statutes DB   |    | Precedents DB |   | Rules DB      |   | Cryptographic      |
| (statutes_bns)|    | (landmark_sc) |   | (contract)    |   | Ledger Chain       |
+---------------+    +---------------+   +---------------+   +--------------------+
```

## 2. Statutory Legal Data Model

Every penal statute is codified with strict legal precision:
- `bns_section`: Section number under Bharatiya Nyaya Sanhita, 2023.
- `ipc_section`: Corresponding section under Indian Penal Code, 1860.
- `cognizable`: Boolean flag determining police duty under BNSS Section 173.
- `bailable`: Boolean flag governing bail entitlement under BNSS Section 478 / 480.
- `punishment`: Statutory minimum and maximum incarceration terms and fines.
- `elements`: Array of requisite mens rea and actus reus components required for trial conviction.

## 3. Cryptographic Chain-of-Custody

Digital records are anchored into the decentralized memory ledger using recursive block hashing:
$$\text{Block Hash} = \text{SHA256}(\text{EvidenceId} \parallel \text{Timestamp} \parallel \text{SHA256(Content)} \parallel \text{PrevHash} \parallel \text{Custodian})$$

Conforms to Section 63(4) Bharatiya Sakshya Adhiniyam, 2023 and the three-judge Supreme Court ruling in *Arjun Panditrao Khotkar (2020) 7 SCC 1*.
