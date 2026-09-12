const BnsCrossConverter = require('./bns_cross_converter');
const fs = require('fs');
const path = require('path');

const precedentsPath = path.join(__dirname, '../data/landmark_precedents.json');
let precedents = [];
try {
  precedents = JSON.parse(fs.readFileSync(precedentsPath, 'utf8'));
} catch (e) {
  console.error('Failed to load landmark_precedents.json:', e);
}

class FirAnalyzer {
  static analyze(incidentText) {
    if (!incidentText || typeof incidentText !== 'string' || incidentText.trim().length === 0) {
      throw new Error('Incident description cannot be empty');
    }

    const text = incidentText.toLowerCase();
    const statutes = BnsCrossConverter.getAllStatutes();
    const detectedOffenses = [];

    // Match keywords and semantic patterns
    for (const statute of statutes) {
      let score = 0;
      const matchedKeywords = [];

      for (const keyword of statute.keywords) {
        if (text.includes(keyword.toLowerCase())) {
          score += 10;
          matchedKeywords.push(keyword);
        }
      }

      // Title direct match
      if (text.includes(statute.title.toLowerCase())) {
        score += 25;
        matchedKeywords.push(statute.title);
      }

      if (score > 0) {
        detectedOffenses.push({
          statute,
          relevance_score: score,
          matched_keywords: matchedKeywords
        });
      }
    }

    // Sort by relevance score descending
    detectedOffenses.sort((a, b) => b.relevance_score - a.relevance_score);

    // If none detected, add fallback informational flag
    const primaryOffenses = detectedOffenses.slice(0, 4);

    // Assess overall severity and cognizable status
    const hasCognizable = primaryOffenses.some(o => o.statute.cognizable);
    const hasNonBailable = primaryOffenses.some(o => !o.statute.bailable);
    const isCapital = primaryOffenses.some(o => o.statute.punishment.toLowerCase().includes('death'));
    const isOverSevenYears = primaryOffenses.some(o => 
      o.statute.punishment.includes('10 years') || 
      o.statute.punishment.includes('life') || 
      o.statute.punishment.includes('Death')
    );

    // Bail probability algorithm (Satender Kumar Antil categorization)
    let bailProbability = 80;
    let bailCategory = "Category A (Offenses punishable with <= 7 years imprisonment)";
    let arneshKumarApplies = false;

    if (isCapital) {
      bailProbability = 15;
      bailCategory = "Category B (Heinous offenses punishable with death / life imprisonment)";
    } else if (isOverSevenYears) {
      bailProbability = 42;
      bailCategory = "Category B (Offenses punishable with imprisonment exceeding 7 years)";
    } else if (hasNonBailable) {
      bailProbability = 68;
      bailCategory = "Category A (Non-bailable offenses punishable with <= 7 years imprisonment)";
      arneshKumarApplies = true;
    } else {
      bailProbability = 96;
      bailCategory = "Bailable Offense (Bail as a matter of absolute statutory right under BNSS 478)";
    }

    // Procedural mandate based on Lalita Kumari
    const mandatoryFirRequired = hasCognizable;

    // Precedent recommendations
    const relevantPrecedents = [];
    if (arneshKumarApplies || !isOverSevenYears) {
      const ak = precedents.find(p => p.case_title.includes('Arnesh Kumar'));
      if (ak) relevantPrecedents.push(ak);
    }
    const ska = precedents.find(p => p.case_title.includes('Satender Kumar Antil'));
    if (ska) relevantPrecedents.push(ska);
    if (hasCognizable) {
      const lk = precedents.find(p => p.case_title.includes('Lalita Kumari'));
      if (lk) relevantPrecedents.push(lk);
    }
    const dkb = precedents.find(p => p.case_title.includes('D.K. Basu'));
    if (dkb) relevantPrecedents.push(dkb);

    return {
      incident_summary: incidentText.slice(0, 200) + (incidentText.length > 200 ? '...' : ''),
      detected_offenses_count: primaryOffenses.length,
      primary_offenses: primaryOffenses.map(o => ({
        bns_section: o.statute.bns_section,
        ipc_equivalent: o.statute.ipc_section,
        title: o.statute.title,
        act: o.statute.act,
        category: o.statute.category,
        cognizable: o.statute.cognizable,
        bailable: o.statute.bailable,
        punishment: o.statute.punishment,
        triable_by: o.statute.triable_by,
        elements: o.statute.elements,
        confidence_score: Math.min(100, o.relevance_score * 4)
      })),
      procedural_verdict: {
        cognizable: hasCognizable,
        mandatory_fir_rule: mandatoryFirRequired ? "Mandatory registration under Section 173 BNSS without prior preliminary enquiry (Lalita Kumari 2014)" : "Non-cognizable; recorded under Section 174 BNSS (NCR)",
        arrest_guideline: arneshKumarApplies 
          ? "Immediate arrest barred unless exceptional reasons recorded in writing. Notice of Appearance under Section 35(3) BNSS mandatory (Arnesh Kumar 2014)"
          : (isOverSevenYears ? "Police may arrest without warrant subject to Section 35 BNSS grounds" : "Arrest only on Magistrate warrant"),
        bail_probability_score: bailProbability,
        bail_category: bailCategory,
        d_k_basu_safeguards_mandatory: true
      },
      procedural_checklist: [
        { item: "Preparation of Arrest Memo with witness signature", mandated_by: "BNSS Sec 36 / D.K. Basu" },
        { item: "Intimation of arrest to designated family member/friend within 8-12 hours", mandated_by: "BNSS Sec 36" },
        { item: "Mandatory Medical Examination by Government Medical Officer", mandated_by: "BNSS Sec 53" },
        { item: "Production before nearest Judicial Magistrate within strict 24 hours", mandated_by: "Article 22(2) Constitution & BNSS Sec 58" },
        { item: "Right to consult and be defended by legal practitioner of choice", mandated_by: "Article 22(1) Constitution & BNSS Sec 38" }
      ],
      relevant_precedents: relevantPrecedents
    };
  }
}

module.exports = FirAnalyzer;
