const fs = require('fs');
const path = require('path');

const precedentsPath = path.join(__dirname, '../data/landmark_precedents.json');
let precedents = [];
try {
  precedents = JSON.parse(fs.readFileSync(precedentsPath, 'utf8'));
} catch (e) {
  console.error('Failed to load landmark_precedents.json:', e);
}

class PrecedentEngine {
  static getAllPrecedents() {
    return precedents;
  }

  static search(query) {
    if (!query) return precedents;
    const q = String(query).toLowerCase().trim();

    return precedents.filter(p => 
      p.case_title.toLowerCase().includes(q) ||
      p.citation.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.ratio_decidendi.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q)) ||
      p.applicable_provisions.some(pr => pr.toLowerCase().includes(q))
    );
  }

  static getByCaseTitle(title) {
    const q = String(title).toLowerCase();
    return precedents.find(p => p.case_title.toLowerCase().includes(q)) || null;
  }
}

module.exports = PrecedentEngine;
