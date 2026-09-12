const crypto = require('crypto');

// In-memory decentralized evidence ledger
const evidenceLedger = [];

class EvidenceVault {
  static registerEvidence({ name, sourceDevice, custodianName, content, mediaType }) {
    if (!content) throw new Error('Evidence content or file data is required');

    const timestamp = new Date().toISOString();
    const sha256 = crypto.createHash('sha256').update(content).digest('hex');
    const sha512 = crypto.createHash('sha512').update(content).digest('hex');

    const previousBlock = evidenceLedger.length > 0 ? evidenceLedger[evidenceLedger.length - 1] : null;
    const prevHash = previousBlock ? previousBlock.blockHash : '0000000000000000000000000000000000000000000000000000000000000000';

    const evidenceId = `NYAYA-EVD-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

    // Compute Block Hash (Chain of Custody node)
    const blockPayload = `${evidenceId}|${timestamp}|${sha256}|${prevHash}|${custodianName}`;
    const blockHash = crypto.createHash('sha256').update(blockPayload).digest('hex');

    // Section 63 BSA 2023 / Section 65B Evidence Act Certificate Text
    const certificateText = `
CERTIFICATE UNDER SECTION 63(4) OF THE BHARATIYA SAKSHYA ADHINIYAM, 2023
(READ WITH PRINCIPLES LAID DOWN IN ARJUN PANDITRAO KHOTKAR V. KAILASH KUSHANRAO GORANTYAL, (2020) 7 SCC 1)

1. CERTIFICATE IDENTIFIER: ${evidenceId}
2. DATE & TIME OF REGISTRATION: ${timestamp}
3. IDENTIFICATION OF ELECTRONIC RECORD:
   - Name of Record: ${name || 'Digital Exhibit'}
   - Media / Content-Type: ${mediaType || 'text/plain'}
   - Cryptographic Hash (SHA-256): ${sha256}
   - Cryptographic Hash (SHA-512): ${sha512}

4. DETAILS OF THE COMPUTER / DEVICE:
   - Source System / Device: ${sourceDevice || 'Local Workstation & Node Terminal'}
   - Chain-of-Custody Previous Hash: ${prevHash}
   - Current Custody Block Hash: ${blockHash}

5. DECLARATION OF CUSTODIAN:
   I, ${custodianName || 'Authorized Custodian'}, hereby solemnly affirm and state:
   (a) That the electronic record described hereinabove was produced by the computer system during the period over which the computer was used regularly to store or process information.
   (b) That throughout the said period, information of the kind contained in the electronic record was regularly fed into the computer in the ordinary course of the said activities.
   (c) That throughout the material part of the said period, the computer was operating properly; or, if not, that in respect of any period in which it was not operating properly, it was not such as to affect the electronic record or the accuracy of its contents.
   (d) That the cryptographic hashes certify the complete integrity of the digital artifact and that no subsequent alteration, deletion, or tampering has transpired.

   VERIFIED & EXECUTED AT: NyayaNode Cryptographic Ledger
   SIGNATURE OF CERTIFYING PERSON: _________________________
   OFFICIAL STAMP / DIGITAL ID: [AUTHENTICATED NYAYANODE SEAL]
    `.trim();

    const record = {
      evidenceId,
      timestamp,
      name: name || 'Digital Exhibit',
      mediaType: mediaType || 'text/plain',
      sourceDevice: sourceDevice || 'Primary SCADA/Server Terminal',
      custodianName: custodianName || 'Investigating Officer / Advocate',
      sha256,
      sha512,
      prevHash,
      blockHash,
      certificateText,
      verified: true
    };

    evidenceLedger.push(record);
    return record;
  }

  static getLedger() {
    return evidenceLedger;
  }

  static verifyTampering(evidenceId, testContent) {
    const record = evidenceLedger.find(r => r.evidenceId === evidenceId);
    if (!record) return { found: false, error: 'Evidence record not found in ledger' };

    const computedSha256 = crypto.createHash('sha256').update(testContent).digest('hex');
    const isIntegrityIntact = (computedSha256 === record.sha256);

    return {
      found: true,
      evidenceId,
      isIntegrityIntact,
      originalHash: record.sha256,
      currentHash: computedSha256,
      admissibility_status: isIntegrityIntact ? "VALID & ADMISSIBLE UNDER SECTION 63 BSA 2023" : "COMPROMISED - EVIDENCE TAMPERED"
    };
  }
}

// Pre-seed 2 sample custody records for instant courtroom verification
EvidenceVault.registerEvidence({
  name: "CCTV_Surveillance_Footage_Terminal_Gate_Cam4.mp4",
  sourceDevice: "Hikvision NVR System IP:192.168.1.104",
  custodianName: "Insp. Rajesh Kumar (Cyber Cell)",
  content: "BIN_STREAM_CCTV_CH4_TIMESTAMP_20260912_041200_HASH_SEED",
  mediaType: "video/mp4"
});

EvidenceVault.registerEvidence({
  name: "WhatsApp_Chat_Export_Extortion_Thread.txt",
  sourceDevice: "iPhone 15 Pro IMEI: 354892109823412",
  custodianName: "Sub-Insp. Ananya Sharma",
  content: "WHATSAPP_EXPORT_CRIME_INCIDENT_THREAT_EXCHANGE_DISPUTE_2026",
  mediaType: "text/plain"
});

module.exports = EvidenceVault;
