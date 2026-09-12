const fs = require('fs');
const path = require('path');

const rulesPath = path.join(__dirname, '../data/contract_rules.json');
let contractRules = [];
try {
  contractRules = JSON.parse(fs.readFileSync(rulesPath, 'utf8'));
} catch (e) {
  console.error('Failed to load contract_rules.json:', e);
}

class ContractAuditor {
  static audit(contractText) {
    if (!contractText || typeof contractText !== 'string' || contractText.trim().length === 0) {
      throw new Error('Contract text cannot be empty');
    }

    const vulnerabilities = [];
    let riskPoints = 0;

    for (const rule of contractRules) {
      const regex = new RegExp(rule.pattern, 'gis');
      const matches = contractText.match(regex);

      if (matches && matches.length > 0) {
        let weight = 15;
        if (rule.severity === 'CRITICAL') weight = 35;
        else if (rule.severity === 'HIGH') weight = 25;
        else if (rule.severity === 'MEDIUM') weight = 15;

        riskPoints += weight * matches.length;

        vulnerabilities.push({
          rule_id: rule.id,
          name: rule.name,
          severity: rule.severity,
          statute: rule.statute,
          precedent: rule.precedent,
          description: rule.description,
          remedy: rule.remedy,
          matched_snippets: matches.slice(0, 3).map(m => m.trim()),
          legal_status: rule.severity === 'CRITICAL' ? 'VOID AB INITIO / UNENFORCEABLE' : 'UNFAIR / AMBIGUOUS'
        });
      }
    }

    // Normalized Contract Vulnerability Index (0 - 100)
    const cvi = Math.min(100, Math.max(5, riskPoints));

    let riskLevel = 'LOW RISK';
    let riskColor = '#10b981'; // green
    if (cvi >= 65) {
      riskLevel = 'CRITICAL RISK';
      riskColor = '#ef4444'; // red
    } else if (cvi >= 35) {
      riskLevel = 'MODERATE RISK';
      riskColor = '#f59e0b'; // amber
    }

    // Recommended redline actions
    const recommendations = vulnerabilities.map((v, idx) => ({
      step: idx + 1,
      clause: v.name,
      statute_basis: v.statute,
      action: `Amend or strike clause: ${v.remedy}`
    }));

    return {
      contract_word_count: contractText.trim().split(/\s+/).length,
      contract_character_count: contractText.length,
      contract_vulnerability_index: cvi,
      risk_level: riskLevel,
      risk_color: riskColor,
      vulnerabilities_detected_count: vulnerabilities.length,
      vulnerabilities,
      recommendations,
      governing_jurisprudence: "Indian Contract Act, 1872 & Arbitration and Conciliation Act, 1996"
    };
  }
}

module.exports = ContractAuditor;
