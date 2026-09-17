// NyayaNode Interactive Frontend Logic

let allStatutes = [];
let proceduralMap = [];
let allPrecedents = [];
let currentEvidenceLedger = [];

document.addEventListener('DOMContentLoaded', async () => {
  initTabs();
  await loadInitialData();
  setupSearch();
  setupFIRAnalyzer();
  setupContractAuditor();
  setupEvidenceVault();
  setupMootCourt();
  setupJurisprudenceMesh();
  setupBatchIngestion();
});

// Tab Switcher
function initTabs() {
  const tabs = document.querySelectorAll('.nav-tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetId = tab.getAttribute('data-tab');
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add('active');
    });
  });
}

// Load Initial Data
async function loadInitialData() {
  try {
    const [statsRes, statutesRes, precedentsRes, ledgerRes] = await Promise.all([
      fetch('/api/stats').then(r => r.json()),
      fetch('/api/statutes').then(r => r.json()),
      fetch('/api/precedents').then(r => r.json()),
      fetch('/api/evidence/ledger').then(r => r.json())
    ]);

    // Update banner metrics
    document.getElementById('metric-statutes').textContent = statsRes.total_statutes || '18';
    document.getElementById('metric-procedural').textContent = statsRes.procedural_mappings || '10';
    document.getElementById('metric-precedents').textContent = statsRes.landmark_precedents || '6';
    document.getElementById('metric-evidence').textContent = statsRes.secured_evidence_blocks || '2';

    allStatutes = statutesRes.statutes || [];
    proceduralMap = statutesRes.procedural_mappings || [];
    allPrecedents = precedentsRes || [];
    currentEvidenceLedger = ledgerRes.records || [];

    renderStatutes(allStatutes);
    renderProceduralTable(proceduralMap);
    renderPrecedents(allPrecedents);
    renderLedger(currentEvidenceLedger);
  } catch (err) {
    console.error('Failed to load initial data:', err);
  }
}

// Render Statutes
function renderStatutes(list) {
  const container = document.getElementById('statutes-container');
  if (!container) return;

  if (list.length === 0) {
    container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #64748b;">No penal sections matching query found.</div>';
    return;
  }

  container.innerHTML = list.map(s => `
    <div class="statute-card">
      <div>
        <div class="statute-header">
          <div>
            <span class="section-pill-bns">BNS Sec ${s.bns_section}</span>
            <span class="section-pill-ipc" style="margin-left: 0.4rem;">IPC ${s.ipc_section}</span>
          </div>
          <span style="font-size: 0.72rem; color: #94a3b8; font-weight: 600;">${s.category}</span>
        </div>
        <div class="statute-title">${s.title}</div>
        <div class="badge-strip">
          <span class="badge ${s.cognizable ? 'badge-cognizable' : 'badge-noncognizable'}">${s.cognizable ? 'Cognizable (FIR Mandatory)' : 'Non-Cognizable (NCR)'}</span>
          <span class="badge ${s.bailable ? 'badge-bailable' : 'badge-nonbailable'}">${s.bailable ? 'Bailable (Matter of Right)' : 'Non-Bailable (Court Discretion)'}</span>
        </div>
        <div class="punishment-text"><strong>Punishment:</strong> ${s.punishment} <br><small style="color: #94a3b8;">Trial: ${s.triable_by}</small></div>
      </div>
      <div>
        <div style="font-size: 0.75rem; font-weight: 600; color: #94a3b8; margin-bottom: 0.3rem;">ESSENTIAL LEGAL ELEMENTS:</div>
        <ul class="elements-list">
          ${s.elements.map(e => `<li>${e}</li>`).join('')}
        </ul>
      </div>
    </div>
  `).join('');
}

// Render Procedural Switchboard Table
function renderProceduralTable(list) {
  const tbody = document.getElementById('procedural-tbody');
  if (!tbody) return;

  tbody.innerHTML = list.map(p => `
    <tr>
      <td><span class="section-pill-bns" style="font-size: 0.75rem;">BNSS ${p.bnss}</span></td>
      <td><span class="section-pill-ipc" style="font-size: 0.75rem;">CrPC ${p.crpc}</span></td>
      <td><strong>${p.title}</strong></td>
      <td><span style="font-size: 0.75rem; color: #60a5fa; background: rgba(59,130,246,0.1); padding: 0.2rem 0.5rem; border-radius: 4px;">${p.subject}</span></td>
      <td style="color: #cbd5e1; font-size: 0.8rem;">${p.significance}</td>
    </tr>
  `).join('');
}

// Search Functionality
function setupSearch() {
  const searchInput = document.getElementById('statute-search-input');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (!query) {
      renderStatutes(allStatutes);
      return;
    }

    const filtered = allStatutes.filter(s => 
      s.bns_section.toLowerCase().includes(query) ||
      s.ipc_section.toLowerCase().includes(query) ||
      s.title.toLowerCase().includes(query) ||
      s.category.toLowerCase().includes(query) ||
      s.keywords.some(k => k.toLowerCase().includes(query))
    );
    renderStatutes(filtered);
  });
}

// FIR Analyzer Logic
function setupFIRAnalyzer() {
  const btn = document.getElementById('btn-analyze-fir');
  const textarea = document.getElementById('fir-input-text');
  const resultContainer = document.getElementById('fir-results-container');

  if (!btn || !textarea) return;

  btn.addEventListener('click', async () => {
    const text = textarea.value.trim();
    if (!text) {
      showToast('Please provide an incident description or select a test scenario.');
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Analyzing Incident Jurisprudence...';

    try {
      const res = await fetch('/api/fir/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incidentText: text })
      });
      const data = await res.json();
      renderFIRResults(data);
    } catch (err) {
      console.error(err);
      showToast('Error analyzing FIR incident.');
    } finally {
      btn.disabled = false;
      btn.textContent = '⚖️ Analyze Incident & Procedural Safeguards';
    }
  });

  // Pre-set Scenarios
  window.loadFIRScenario = function(type) {
    if (type === 'robbery') {
      textarea.value = "On Friday night at 11:30 PM on the Outer Ring Road, two unidentified men on a motorcycle stopped the complainant's vehicle. One brandished a country pistol while the other wielded a sharp dagger. They demanded cash, punched the driver repeatedly causing deep lacerations and fractured nasal bone, and fled with ₹45,000 cash and an Apple MacBook.";
    } else if (type === 'hit_run') {
      textarea.value = "A speeding luxury SUV ran over a pedestrian at the zebra crossing on MG Road at high speed. The driver failed to stop, did not render medical assistance, and fled the scene immediately without reporting to the nearest police station or judicial officer.";
    } else if (type === 'cyber_fraud') {
      textarea.value = "The suspect promised guaranteed 40% monthly returns on cryptocurrency investment, forged official government registration certificates, induced the victim to transfer ₹12,50,000 across multiple mule bank accounts, and abruptly vanished after blocking all communication.";
    }
  };
}

function renderFIRResults(data) {
  const container = document.getElementById('fir-results-container');
  if (!container) return;

  const { procedural_verdict, primary_offenses, procedural_checklist, relevant_precedents } = data;

  container.innerHTML = `
    <div class="panel" style="margin-bottom: 1rem; border-color: rgba(59, 130, 246, 0.4);">
      <div class="panel-header">
        <div>
          <div class="panel-title">⚖️ Judicial Evaluation & Offense Assessment</div>
          <div class="panel-subtitle">Evaluated against BNS 2023, BNSS 2023, and Supreme Court Guidelines</div>
        </div>
        <span class="badge ${procedural_verdict.cognizable ? 'badge-cognizable' : 'badge-noncognizable'}" style="font-size: 0.85rem; padding: 0.35rem 0.85rem;">
          ${procedural_verdict.cognizable ? 'COGNIZABLE OFFENSE' : 'NON-COGNIZABLE OFFENSE'}
        </span>
      </div>

      <div class="score-box">
        <div>
          <div style="font-size: 0.85rem; color: #94a3b8; text-transform: uppercase;">Statutory Bail Probability Index</div>
          <div style="font-size: 0.8rem; color: #cbd5e1; margin-top: 0.2rem;">${procedural_verdict.bail_category}</div>
          <div class="progress-bar-container" style="width: 280px;">
            <div class="progress-bar-fill" style="width: ${procedural_verdict.bail_probability_score}%; background: ${procedural_verdict.bail_probability_score > 60 ? '#10b981' : (procedural_verdict.bail_probability_score > 35 ? '#f59e0b' : '#ef4444')};"></div>
          </div>
        </div>
        <div class="score-number" style="color: ${procedural_verdict.bail_probability_score > 60 ? '#10b981' : (procedural_verdict.bail_probability_score > 35 ? '#f59e0b' : '#ef4444')};">
          ${procedural_verdict.bail_probability_score}%
        </div>
      </div>

      <div style="margin-bottom: 1.25rem;">
        <div style="font-size: 0.85rem; font-weight: 700; color: #f59e0b; margin-bottom: 0.3rem;">📋 Mandatory FIR Directive (Lalita Kumari Rule):</div>
        <div style="font-size: 0.85rem; color: #e2e8f0; background: rgba(0,0,0,0.3); padding: 0.6rem; border-radius: 6px;">${procedural_verdict.mandatory_fir_rule}</div>
      </div>

      <div style="margin-bottom: 1.25rem;">
        <div style="font-size: 0.85rem; font-weight: 700; color: #60a5fa; margin-bottom: 0.3rem;">🚨 Arrest Compliance (Arnesh Kumar / Section 35 BNSS):</div>
        <div style="font-size: 0.85rem; color: #e2e8f0; background: rgba(0,0,0,0.3); padding: 0.6rem; border-radius: 6px;">${procedural_verdict.arrest_guideline}</div>
      </div>

      <div style="margin-bottom: 1.25rem;">
        <div style="font-size: 0.85rem; font-weight: 700; color: #94a3b8; margin-bottom: 0.5rem;">APPLICABLE PENAL PROVISIONS DETECTED:</div>
        <div style="display: grid; gap: 0.75rem;">
          ${primary_offenses.map(o => `
            <div style="background: rgba(15, 23, 42, 0.75); border: 1px solid rgba(255,255,255,0.08); padding: 0.85rem; border-radius: 8px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <span class="section-pill-bns">BNS Sec ${o.bns_section}</span>
                  <span class="section-pill-ipc" style="margin-left: 0.3rem;">IPC ${o.ipc_equivalent}</span>
                  <strong style="margin-left: 0.5rem; color: #fff;">${o.title}</strong>
                </div>
                <span style="font-size: 0.75rem; color: #10b981; font-weight: 700;">Match: ${o.confidence_score}%</span>
              </div>
              <div style="font-size: 0.8rem; color: #94a3b8; margin-top: 0.4rem;"><strong>Punishment:</strong> ${o.punishment}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <div>
        <div style="font-size: 0.85rem; font-weight: 700; color: #94a3b8; margin-bottom: 0.4rem;">MANDATORY CUSTODIAL SAFEGUARDS (D.K. BASU & BNSS):</div>
        <div style="display: grid; gap: 0.4rem;">
          ${procedural_checklist.map(c => `
            <div style="font-size: 0.8rem; color: #cbd5e1; display: flex; align-items: center; gap: 0.5rem;">
              <span style="color: #10b981;">✔</span> ${c.item} <small style="color: #64748b;">(${c.mandated_by})</small>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

// Contract Auditor Logic
function setupContractAuditor() {
  const btn = document.getElementById('btn-audit-contract');
  const textarea = document.getElementById('contract-input-text');
  const resultContainer = document.getElementById('contract-results-container');

  if (!btn || !textarea) return;

  btn.addEventListener('click', async () => {
    const text = textarea.value.trim();
    if (!text) {
      showToast('Please provide contract text or select a test contract.');
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Auditing Contract Clauses...';

    try {
      const res = await fetch('/api/contract/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractText: text })
      });
      const data = await res.json();
      renderContractResults(data);
    } catch (err) {
      console.error(err);
      showToast('Error auditing contract.');
    } finally {
      btn.disabled = false;
      btn.textContent = '🔍 Audit Contract Clauses';
    }
  });

  // Pre-set Contracts
  window.loadContractScenario = function(type) {
    if (type === 'predatory_employment') {
      textarea.value = `EMPLOYMENT & PROPRIETARY RIGHTS AGREEMENT
1. NON-COMPETE: The Employee agrees that upon termination of employment for any reason, the Employee shall not engage in, work for, consult with, or compete with any competitor or competing business within the territory for a period of 24 months post-exit.
2. INDEMNITY: The Employee shall indemnify, defend, and hold harmless the Company and its directors against any and all claims, liabilities, losses, damages, expenses, and attorneys' fees arising out of any breach or perceived breach.
3. DISPUTE RESOLUTION: Any dispute or claim shall be referred to a sole arbitrator appointed exclusively by the Company, and the decision of such arbitrator shall be final and binding.
4. TERMINATION: The Company may terminate this Agreement immediately without cause at its sole convenience, while the Employee requires a mandatory written notice of 90 days.`;
    } else if (type === 'freelance_uncapped') {
      textarea.value = `INDEPENDENT CONTRACTOR SERVICES AGREEMENT
1. SCOPE OF SERVICES: Contractor shall develop web applications as directed.
2. INDEMNIFICATION: Contractor agrees to indemnify, defend, and hold harmless Client from and against all claims, damages, liabilities, costs and expenses without limitation.
3. LIQUIDATED DAMAGES: If Contractor fails to hit milestone dates, Contractor agrees to forfeit a sum of 50% of total fees as liquidated damages regardless of actual proof of loss.`;
    }
  };
}

function renderContractResults(data) {
  const container = document.getElementById('contract-results-container');
  if (!container) return;

  const { contract_vulnerability_index, risk_level, risk_color, vulnerabilities, recommendations } = data;

  container.innerHTML = `
    <div class="panel" style="margin-bottom: 1rem; border-color: ${risk_color}55;">
      <div class="panel-header">
        <div>
          <div class="panel-title">🛡️ Contract Vulnerability Audit Report</div>
          <div class="panel-subtitle">Governed by Indian Contract Act 1872 & Arbitration Act 1996</div>
        </div>
        <span class="badge" style="background: ${risk_color}22; color: ${risk_color}; border: 1px solid ${risk_color}66; font-size: 0.85rem; padding: 0.35rem 0.85rem;">
          ${risk_level}
        </span>
      </div>

      <div class="score-box">
        <div>
          <div style="font-size: 0.85rem; color: #94a3b8; text-transform: uppercase;">Contract Vulnerability Index (CVI)</div>
          <div style="font-size: 0.8rem; color: #cbd5e1; margin-top: 0.2rem;">Higher score indicates severe unconscionability & legal risk</div>
          <div class="progress-bar-container" style="width: 280px;">
            <div class="progress-bar-fill" style="width: ${contract_vulnerability_index}%; background: ${risk_color};"></div>
          </div>
        </div>
        <div class="score-number" style="color: ${risk_color};">
          ${contract_vulnerability_index}/100
        </div>
      </div>

      <div style="margin-bottom: 1.5rem;">
        <div style="font-size: 0.9rem; font-weight: 700; color: #fff; margin-bottom: 0.75rem;">DETECTED VULNERABLE CLAUSES (${vulnerabilities.length}):</div>
        ${vulnerabilities.map(v => `
          <div class="risk-card ${v.severity}">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.3rem;">
              <strong style="color: #fff; font-size: 0.95rem;">${v.name}</strong>
              <span class="badge" style="background: rgba(239, 68, 68, 0.2); color: #fca5a5; border: 1px solid rgba(239, 68, 68, 0.4);">${v.legal_status}</span>
            </div>
            <div style="font-size: 0.8rem; color: #94a3b8; margin-bottom: 0.4rem;">
              <strong>Statute:</strong> ${v.statute} <br>
              <strong>Precedent:</strong> <span style="color: #60a5fa;">${v.precedent}</span>
            </div>
            <div style="font-size: 0.82rem; color: #cbd5e1; margin-bottom: 0.5rem;">${v.description}</div>
            <div class="redline-box">
              <span style="color: #10b981; font-weight: 700;">RECOMMENDED BALANCED REDLINE:</span><br>
              ${v.remedy}
            </div>
          </div>
        `).join('')}
      </div>

      <div>
        <div style="font-size: 0.9rem; font-weight: 700; color: #fff; margin-bottom: 0.5rem;">ACTIONABLE REVISION CHECKLIST:</div>
        <div style="display: grid; gap: 0.5rem;">
          ${recommendations.map(r => `
            <div style="font-size: 0.82rem; color: #cbd5e1; background: rgba(15,23,42,0.6); padding: 0.65rem 0.85rem; border-radius: 6px; border: 1px solid rgba(255,255,255,0.06);">
              <span style="color: #f59e0b; font-weight: 700;">#${r.step} [${r.clause}]:</span> ${r.action}
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

// Render Precedents
function renderPrecedents(list) {
  const container = document.getElementById('precedents-container');
  if (!container) return;

  container.innerHTML = list.map(p => `
    <div class="statute-card" style="margin-bottom: 1rem;">
      <div class="statute-header">
        <div>
          <div style="font-size: 1.15rem; font-weight: 700; color: #fff;">${p.case_title}</div>
          <div style="font-size: 0.8rem; font-family: var(--font-mono); color: #fbbf24; margin-top: 0.15rem;">Citation: ${p.citation}</div>
        </div>
        <span style="font-size: 0.75rem; color: #94a3b8; background: rgba(255,255,255,0.05); padding: 0.25rem 0.6rem; border-radius: 4px;">${p.category}</span>
      </div>
      <div style="font-size: 0.78rem; color: #64748b; margin-bottom: 0.75rem;"><strong>Bench:</strong> ${p.bench}</div>
      <div style="font-size: 0.85rem; color: #cbd5e1; line-height: 1.5; margin-bottom: 0.85rem; background: rgba(0,0,0,0.25); padding: 0.75rem; border-radius: 6px; border-left: 3px solid #3b82f6;">
        <strong style="color: #60a5fa;">Ratio Decidendi:</strong><br>${p.ratio_decidendi}
      </div>
      <div style="font-size: 0.8rem; color: #10b981; background: rgba(16, 185, 129, 0.08); padding: 0.5rem 0.75rem; border-radius: 6px; border: 1px solid rgba(16, 185, 129, 0.2);">
        <strong>Trial Safeguard:</strong> ${p.key_safeguard}
      </div>
    </div>
  `).join('');
}

// Section 63 BSA Evidence Vault Logic
function setupEvidenceVault() {
  const regBtn = document.getElementById('btn-register-evidence');
  const verifyBtn = document.getElementById('btn-verify-evidence');

  if (regBtn) {
    regBtn.addEventListener('click', async () => {
      const name = document.getElementById('evd-name').value.trim();
      const sourceDevice = document.getElementById('evd-device').value.trim();
      const custodianName = document.getElementById('evd-custodian').value.trim();
      const content = document.getElementById('evd-content').value.trim();

      if (!content) {
        showToast('Please provide digital evidence string or file stream.');
        return;
      }

      regBtn.disabled = true;
      regBtn.textContent = 'Hashing & Anchoring to Ledger...';

      try {
        const res = await fetch('/api/evidence/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, sourceDevice, custodianName, content })
        });
        const record = await res.json();
        showToast('Evidence registered on Nyaya Ledger successfully!');
        displayCertificate(record.certificateText);
        await loadInitialData(); // Refresh ledger table
      } catch (err) {
        console.error(err);
        showToast('Failed to register evidence');
      } finally {
        regBtn.disabled = false;
        regBtn.textContent = '🔒 Cryptographically Anchor & Issue Section 63 BSA Certificate';
      }
    });
  }

  if (verifyBtn) {
    verifyBtn.addEventListener('click', async () => {
      const evdId = document.getElementById('verify-evd-id').value.trim();
      const testContent = document.getElementById('verify-evd-content').value.trim();

      if (!evdId || !testContent) {
        showToast('Please provide Evidence ID and content to verify.');
        return;
      }

      try {
        const res = await fetch('/api/evidence/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ evidenceId: evdId, content: testContent })
        });
        const data = await res.json();
        renderVerifyResult(data);
      } catch (err) {
        console.error(err);
        showToast('Verification failed');
      }
    });
  }
}

function displayCertificate(certText) {
  const certContainer = document.getElementById('certificate-display-area');
  const certPre = document.getElementById('certificate-text');
  if (certContainer && certPre) {
    certContainer.style.display = 'block';
    certPre.textContent = certText;
    certContainer.scrollIntoView({ behavior: 'smooth' });
  }
}

window.copyCertificate = function() {
  const certPre = document.getElementById('certificate-text');
  if (certPre) {
    navigator.clipboard.writeText(certPre.textContent).then(() => {
      showToast('Section 63 BSA Certificate copied to clipboard!');
    });
  }
};

function renderLedger(records) {
  const tbody = document.getElementById('evidence-ledger-tbody');
  if (!tbody) return;

  tbody.innerHTML = records.map(r => `
    <tr>
      <td><span style="font-family: var(--font-mono); color: #fbbf24; font-size: 0.75rem;">${r.evidenceId}</span></td>
      <td><strong>${r.name}</strong><br><small style="color: #64748b;">${r.sourceDevice}</small></td>
      <td><span style="font-size: 0.75rem; color: #cbd5e1;">${r.custodianName}</span></td>
      <td><span style="font-family: var(--font-mono); font-size: 0.7rem; color: #60a5fa;" title="${r.sha256}">${r.sha256.slice(0, 16)}...</span></td>
      <td><span class="badge badge-bailable" style="font-size: 0.7rem;">CHAIN VERIFIED</span></td>
      <td>
        <button class="btn" style="padding: 0.2rem 0.6rem; font-size: 0.72rem;" onclick="viewLedgerCert('${r.evidenceId}')">View Cert</button>
      </td>
    </tr>
  `).join('');
}

window.viewLedgerCert = function(evdId) {
  const record = currentEvidenceLedger.find(r => r.evidenceId === evdId);
  if (record) {
    displayCertificate(record.certificateText);
  }
};

function renderVerifyResult(data) {
  const resArea = document.getElementById('verify-result-area');
  if (!resArea) return;

  if (!data.found) {
    resArea.innerHTML = `<div style="color: #ef4444; padding: 0.75rem; background: rgba(239,68,68,0.1); border-radius: 6px;">❌ ${data.error}</div>`;
    return;
  }

  const isOk = data.isIntegrityIntact;
  resArea.innerHTML = `
    <div style="padding: 1rem; border-radius: 8px; border: 1px solid ${isOk ? '#10b981' : '#ef4444'}; background: ${isOk ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)'};">
      <div style="font-weight: 700; font-size: 1rem; color: ${isOk ? '#10b981' : '#ef4444'}; display: flex; align-items: center; gap: 0.5rem;">
        ${isOk ? '✔ ADMISSIBLE & TAMPER-FREE' : '⚠️ TAMPERING DETECTED / REJECTED'}
      </div>
      <div style="font-size: 0.8rem; color: #cbd5e1; margin-top: 0.5rem;">
        <strong>Status:</strong> ${data.admissibility_status}<br>
        <strong>Ledger Registered Hash:</strong> <span style="font-family: var(--font-mono); color: #94a3b8;">${data.originalHash}</span><br>
        <strong>Tested Stream Hash:</strong> <span style="font-family: var(--font-mono); color: ${isOk ? '#10b981' : '#ef4444'};">${data.currentHash}</span>
      </div>
    </div>
  `;
}

// Moot Courtroom Logic
function setupMootCourt() {
  const mootCases = [
    {
      id: 'case_1',
      title: 'State vs. Tech Founder: Legality of Arrest without Notice under Section 35(3) BNSS',
      facts: 'Investigating officer arrested a software founder accused of criminal breach of trust under BNS Section 316 (max 5 years) at 2 AM without issuing Notice of Appearance.',
      prosecution: 'The offense involves misappropriation of investor funds exceeding ₹25 lakhs. Flight risk existed as the accused booked an international flight. Custodial interrogation is essential under Section 187 BNSS.',
      defense: 'Under Arnesh Kumar (2014) and Section 35(3) BNSS, for any offense <= 7 years, issuance of notice is mandatory. No written recording of reasons was submitted to the Magistrate. Arrest is illegal and arbitrary, violating Article 21.',
      verdict: 'HELD: Arrest violates mandatory procedure under Section 35 BNSS. Accused entitled to immediate release on personal bond under Satender Kumar Antil guidelines. Investigating Officer directed to submit explanation.'
    },
    {
      id: 'case_2',
      title: 'Global Corp vs. Ex-Senior Architect: Post-Employment Non-Compete Enforceability',
      facts: 'Senior architect joined an AI rival 2 weeks after resigning. Employment contract contained a 2-year pan-India non-compete clause.',
      prosecution: 'The defendant possessed proprietary neural architecture secrets. The clause is reasonable in scope and necessary to protect trade secrets under equitable principles.',
      defense: 'Section 27 of Indian Contract Act 1872 is categorical: every agreement in restraint of trade is void ab initio. Percept D\'Mark v. Zaheer Khan establishes that no doctrine of reasonableness applies post-exit. Livelihood cannot be restrained.',
      verdict: 'HELD: Non-compete clause declared void and unenforceable under Section 27. Permanent injunction refused. Employer permitted only to seek damages if concrete theft of trade secrets is proven with independent electronic evidence.'
    }
  ];

  const select = document.getElementById('moot-case-select');
  const details = document.getElementById('moot-case-details');
  if (!select || !details) return;

  function updateMoot(idx) {
    const c = mootCases[idx];
    details.innerHTML = `
      <div style="background: rgba(15, 23, 42, 0.6); padding: 1.25rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); margin-bottom: 1.25rem;">
        <div style="font-size: 1.1rem; font-weight: 700; color: #fff; margin-bottom: 0.35rem;">${c.title}</div>
        <div style="font-size: 0.85rem; color: #94a3b8;"><strong>Factual Matrix:</strong> ${c.facts}</div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; margin-bottom: 1.25rem;">
        <div style="background: rgba(239, 68, 68, 0.08); border-left: 3px solid #ef4444; border-radius: 6px; padding: 1rem;">
          <strong style="color: #fca5a5; font-size: 0.9rem;">🔴 PROSECUTION ARGUMENT:</strong>
          <div style="font-size: 0.85rem; color: #e2e8f0; margin-top: 0.5rem; line-height: 1.5;">${c.prosecution}</div>
        </div>
        <div style="background: rgba(59, 130, 246, 0.08); border-left: 3px solid #3b82f6; border-radius: 6px; padding: 1rem;">
          <strong style="color: #93c5fd; font-size: 0.9rem;">🔵 DEFENSE ARGUMENT:</strong>
          <div style="font-size: 0.85rem; color: #e2e8f0; margin-top: 0.5rem; line-height: 1.5;">${c.defense}</div>
        </div>
      </div>

      <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 8px; padding: 1.25rem;">
        <strong style="color: #fbbf24; font-size: 0.95rem;">⚖️ JUDICIAL BENCH RATIO & RULING:</strong>
        <div style="font-size: 0.88rem; color: #fff; margin-top: 0.5rem; line-height: 1.5;">${c.verdict}</div>
      </div>
    `;
  }

  select.addEventListener('change', (e) => {
    updateMoot(parseInt(e.target.value));
  });

  updateMoot(0);
}

// Toast notification helper
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.style.display = 'block';
  setTimeout(() => {
    toast.style.display = 'none';
  }, 3500);
}

// === ENTERPRISE JURISPRUDENCE TOPOLOGY MESH ===
async function setupJurisprudenceMesh() {
  const corridorsList = document.getElementById('corridors-list');
  const statutesRoster = document.getElementById('statutes-roster-list');
  const provisionBtn = document.getElementById('btn-open-provision-corridor');

  async function refreshMesh() {
    try {
      const [corridorRes, statutesRes] = await Promise.all([
        fetch('/api/topology/corridors').then(r => r.json()),
        fetch('/api/topology/statutes').then(r => r.json())
      ]);

      const corridors = corridorRes.data?.corridors || [];
      const metrics = corridorRes.data?.metrics || {};
      const statutes = statutesRes.data || [];

      // Update telemetry
      const activeEl = document.getElementById('mesh-active-corridors');
      const adhEl = document.getElementById('mesh-avg-adherence');
      const totalEl = document.getElementById('mesh-total-statutes');

      if (activeEl) activeEl.textContent = metrics.activeCorridors ?? corridors.length;
      if (adhEl) adhEl.textContent = `${metrics.avgStatutoryAdherencePct ?? 99.5}%`;
      if (totalEl) totalEl.textContent = statutes.length;

      // Render Corridors
      if (corridorsList) {
        corridorsList.innerHTML = corridors.map(c => `
          <div style="background: #11141e; border: 1px solid #1e2433; border-radius: 8px; padding: 1rem; display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; flex-direction: column; gap: 0.35rem; flex: 1;">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3); padding: 0.2rem 0.6rem; border-radius: 4px; font-weight: 700; font-size: 0.8rem;">
                  ${c.sourceStatute}
                </span>
                <span style="color: #64748b;">➔</span>
                <span style="background: rgba(139, 92, 246, 0.15); color: #c084fc; border: 1px solid rgba(139, 92, 246, 0.3); padding: 0.2rem 0.6rem; border-radius: 4px; font-weight: 700; font-size: 0.8rem;">
                  ${c.targetStatute}
                </span>
                <span style="background: rgba(16, 185, 129, 0.15); color: #34d399; font-size: 0.75rem; font-weight: 700; padding: 0.15rem 0.5rem; border-radius: 4px;">
                  ${c.statutoryAdherencePct}% Adherence
                </span>
              </div>
              <div style="font-size: 0.82rem; color: #94a3b8;">
                <strong style="color: #cbd5e1;">Precedent:</strong> ${c.bindingPrecedent} (${c.jurisdictionLevel})
              </div>
              <div style="font-size: 0.78rem; color: #64748b; font-family: monospace;">
                Protocol: ${c.proceduralProtocol} | Force: ${c.precedentForce}
              </div>
            </div>
            <button class="btn btn-sever-corridor" data-id="${c.id}" style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #f87171; padding: 0.35rem 0.85rem; font-size: 0.75rem; font-weight: 700;">
              Sever Corridor
            </button>
          </div>
        `).join('');

        // Wire sever buttons
        document.querySelectorAll('.btn-sever-corridor').forEach(btn => {
          btn.addEventListener('click', async (e) => {
            const id = e.target.getAttribute('data-id');
            if (confirm(`Sever jurisprudence corridor ${id}? This halts automated precedent binding.`)) {
              await fetch(`/api/topology/corridors/${id}`, { method: 'DELETE' });
              showToast(`Corridor ${id} severed.`);
              refreshMesh();
            }
          });
        });
      }

      // Render Statutes Roster
      if (statutesRoster) {
        statutesRoster.innerHTML = statutes.map(s => `
          <div style="background: #11141e; border: 1px solid #1e2433; border-radius: 8px; padding: 0.85rem; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <strong style="color: #f8fafc; font-size: 0.85rem;">${s.offenseTitle}</strong>
                <button class="btn-delete-statute" data-bns="${encodeURIComponent(s.bnsSection)}" style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 0.8rem;">
                  🗑️
                </button>
              </div>
              <div style="font-size: 0.75rem; color: #60a5fa; margin-top: 0.25rem;">${s.bnsSection} ↔ ${s.ipcSection}</div>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: #64748b; margin-top: 0.6rem;">
              <span style="color: ${s.bailability === 'Bailable' ? '#34d399' : '#f87171'}; font-weight: 600;">${s.bailability}</span>
              <span>${s.court}</span>
            </div>
          </div>
        `).join('');

        // Wire delete buttons
        document.querySelectorAll('.btn-delete-statute').forEach(btn => {
          btn.addEventListener('click', async (e) => {
            const bns = e.target.getAttribute('data-bns');
            if (confirm(`Cascade delete statute ${decodeURIComponent(bns)} and sever all connected corridors?`)) {
              await fetch(`/api/topology/statutes/${bns}`, { method: 'DELETE' });
              showToast(`Statute deleted with cascading corridor integrity.`);
              refreshMesh();
            }
          });
        });
      }
    } catch (err) {
      console.error('Failed to refresh jurisprudence mesh:', err);
    }
  }

  if (provisionBtn) {
    provisionBtn.addEventListener('click', async () => {
      const src = prompt('Enter Source Statute (e.g. BNS 111 Organized Crime):', 'BNS 111 Organized Crime');
      if (!src) return;
      const tgt = prompt('Enter Target Procedural Court (e.g. Designated Special Court):', 'Designated Special Court');
      if (!tgt) return;
      const prec = prompt('Enter Binding Precedent (e.g. State v. Bharat Shanti Lal (2008)):', 'State v. Bharat Shanti Lal (2008)');

      await fetch('/api/topology/corridors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceStatute: src,
          targetStatute: tgt,
          bindingPrecedent: prec || 'Supreme Court Ratio',
          statutoryAdherencePct: 99.6
        })
      });
      showToast('Jurisprudence corridor provisioned successfully.');
      refreshMesh();
    });
  }

  refreshMesh();
}

// === ENTERPRISE BATCH INGESTION & PURGE STUDIO ===
function setupBatchIngestion() {
  let currentEntity = 'statutes';
  let currentFormat = 'csv';

  const TEMPLATES_NYAYA = {
    statutes: {
      endpoint: '/api/topology/statutes/upload',
      csv: `bns,ipc,title,bail,cognizable,punish,court
BNS 64,IPC 376,Rape,Non-Bailable,true,Rigorous Imprisonment not less than 10 years,Court of Session
BNS 303(2),IPC 379,Theft,Bailable,true,Imprisonment up to 3 years,Any Magistrate
BNS 111(1),New (MCOCA),Organized Crime Syndicate Operation,Non-Bailable,true,Death or Life Imprisonment,Special Court / Session`,
      json: JSON.stringify([
        {
          bnsSection: "BNS 64",
          ipcSection: "IPC 376",
          offenseTitle: "Rape",
          bailability: "Non-Bailable",
          cognizable: true,
          punishment: "Rigorous Imprisonment not less than 10 years",
          court: "Court of Session"
        },
        {
          bnsSection: "BNS 303(2)",
          ipcSection: "IPC 379",
          offenseTitle: "Theft",
          bailability: "Bailable",
          cognizable: true,
          punishment: "Imprisonment up to 3 years",
          court: "Any Magistrate"
        }
      ], null, 2)
    },
    corridors: {
      endpoint: '/api/topology/corridors/upload',
      csv: `source,target,jurisdiction,precedent,adherence,protocol
BNS 64,Court of Session,Sessions Court,Nirbhaya Ratio (2017) 6 SCC 1,100.0,Sec 183 BNSS
BNS 303,Lok Adalat,Magistrate,Compounding under BNSS 359,98.0,Pre-Litigation Settlement
BNS 111,Special MCOCA Bench,Designated Special Court,Bharat Shanti Lal (2008),99.7,BNSS Sec 250`,
      json: JSON.stringify([
        {
          sourceStatute: "BNS 64 Rape",
          targetStatute: "Court of Session Trial",
          jurisdictionLevel: "Sessions Court",
          bindingPrecedent: "Nirbhaya Ratio (2017) 6 SCC 1",
          statutoryAdherencePct: 100.0,
          proceduralProtocol: "Sec 183 BNSS"
        }
      ], null, 2)
    }
  };

  const buffer = document.getElementById('ingest-payload-buffer');
  const bufferStats = document.getElementById('buffer-stats');
  const targetEndpoint = document.getElementById('target-endpoint');
  const btnStatutes = document.getElementById('ingest-entity-statutes');
  const btnCorridors = document.getElementById('ingest-entity-corridors');
  const btnCsv = document.getElementById('ingest-fmt-csv');
  const btnJson = document.getElementById('ingest-fmt-json');
  const btnReset = document.getElementById('btn-reset-template');
  const btnExecute = document.getElementById('btn-execute-ingestion');
  const btnPurge = document.getElementById('btn-universal-purge-nyaya');

  function updateBuffer() {
    const tpl = TEMPLATES_NYAYA[currentEntity];
    if (buffer) buffer.value = currentFormat === 'csv' ? tpl.csv : tpl.json;
    if (targetEndpoint) targetEndpoint.textContent = `Target: ${tpl.endpoint}`;
    updateStats();
  }

  function updateStats() {
    if (!buffer || !bufferStats) return;
    const lines = buffer.value.split('\n').length;
    const chars = buffer.value.length;
    bufferStats.textContent = `${lines} lines | ${chars} characters`;
  }

  if (buffer) buffer.addEventListener('input', updateStats);

  if (btnStatutes) {
    btnStatutes.addEventListener('click', () => {
      currentEntity = 'statutes';
      btnStatutes.style.background = 'rgba(59, 130, 246, 0.2)';
      btnStatutes.style.borderColor = '#3b82f6';
      btnStatutes.style.color = '#93c5fd';
      if (btnCorridors) {
        btnCorridors.style.background = '#1e2433';
        btnCorridors.style.borderColor = '#2a3147';
        btnCorridors.style.color = '#94a3b8';
      }
      updateBuffer();
    });
  }

  if (btnCorridors) {
    btnCorridors.addEventListener('click', () => {
      currentEntity = 'corridors';
      btnCorridors.style.background = 'rgba(59, 130, 246, 0.2)';
      btnCorridors.style.borderColor = '#3b82f6';
      btnCorridors.style.color = '#93c5fd';
      if (btnStatutes) {
        btnStatutes.style.background = '#1e2433';
        btnStatutes.style.borderColor = '#2a3147';
        btnStatutes.style.color = '#94a3b8';
      }
      updateBuffer();
    });
  }

  if (btnCsv) {
    btnCsv.addEventListener('click', () => {
      currentFormat = 'csv';
      btnCsv.style.background = 'rgba(16, 185, 129, 0.2)';
      btnCsv.style.borderColor = '#10b981';
      btnCsv.style.color = '#6ee7b7';
      if (btnJson) {
        btnJson.style.background = '#1e2433';
        btnJson.style.borderColor = '#2a3147';
        btnJson.style.color = '#94a3b8';
      }
      updateBuffer();
    });
  }

  if (btnJson) {
    btnJson.addEventListener('click', () => {
      currentFormat = 'json';
      btnJson.style.background = 'rgba(16, 185, 129, 0.2)';
      btnJson.style.borderColor = '#10b981';
      btnJson.style.color = '#6ee7b7';
      if (btnCsv) {
        btnCsv.style.background = '#1e2433';
        btnCsv.style.borderColor = '#2a3147';
        btnCsv.style.color = '#94a3b8';
      }
      updateBuffer();
    });
  }

  if (btnReset) {
    btnReset.addEventListener('click', updateBuffer);
  }

  if (btnExecute) {
    btnExecute.addEventListener('click', async () => {
      if (!buffer || !buffer.value.trim()) return;
      const endpoint = TEMPLATES_NYAYA[currentEntity].endpoint;
      const isCsv = currentFormat === 'csv';

      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': isCsv ? 'text/csv' : 'application/json' },
          body: isCsv ? buffer.value : JSON.stringify(JSON.parse(buffer.value))
        });
        const data = await res.json();
        if (res.ok) {
          showToast(data.message || 'Batch ingested successfully into jurisprudence mesh!');
          setupJurisprudenceMesh();
        } else {
          showToast(`Error: ${data.error}`);
        }
      } catch (err) {
        showToast(`Ingestion error: ${err.message}`);
      }
    });
  }

  if (btnPurge) {
    btnPurge.addEventListener('click', async () => {
      if (!confirm(`⚠️ UNIVERSAL PURGE WARNING\nPurge all ${currentEntity} and sever associated precedent corridors?`)) return;
      const endpoint = currentEntity === 'statutes' ? '/api/topology/statutes' : '/api/topology/corridors';
      const res = await fetch(endpoint, { method: 'DELETE' });
      const data = await res.json();
      showToast(data.message || 'Universal deletion completed.');
      setupJurisprudenceMesh();
    });
  }

  updateBuffer();
}
