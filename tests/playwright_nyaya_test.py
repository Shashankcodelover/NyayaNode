import os
import time
from playwright.sync_api import sync_playwright

ARTIFACTS_DIR = r"C:\Users\Preetham.j\.gemini\antigravity\brain\c95f737b-481b-4921-aabf-dc774f62b939"

def run_nyaya_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 960})
        page = context.new_page()

        print("[TEST] Navigating to http://localhost:5030...")
        page.goto("http://localhost:5030", wait_until="networkidle")
        time.sleep(1.5)

        # 1. Verify Matrix Tab
        page.wait_for_selector("#statutes-container .statute-card")
        matrix_shot = os.path.join(ARTIFACTS_DIR, "nyayanode_matrix_verified.png")
        page.screenshot(path=matrix_shot, full_page=False)
        print(f"[SUCCESS] Saved Matrix screenshot: {matrix_shot}")

        # 2. Test FIR Reasoning Tab
        page.click("button[data-tab='tab-fir']")
        time.sleep(0.5)
        page.click("button:has-text('Highway Armed Robbery & Fracture')")
        time.sleep(0.5)
        page.click("#btn-analyze-fir")
        page.wait_for_selector(".score-number", timeout=6000)
        time.sleep(1)
        fir_shot = os.path.join(ARTIFACTS_DIR, "nyayanode_fir_analysis_verified.png")
        page.screenshot(path=fir_shot, full_page=False)
        print(f"[SUCCESS] Saved FIR Analysis screenshot: {fir_shot}")

        # 3. Test Contract Auditor Tab
        page.click("button[data-tab='tab-contract']")
        time.sleep(0.5)
        page.click("button:has-text('Predatory Employment Agreement')")
        time.sleep(0.5)
        page.click("#btn-audit-contract")
        page.wait_for_selector(".risk-card", timeout=6000)
        time.sleep(1)
        contract_shot = os.path.join(ARTIFACTS_DIR, "nyayanode_contract_audit_verified.png")
        page.screenshot(path=contract_shot, full_page=False)
        print(f"[SUCCESS] Saved Contract Audit screenshot: {contract_shot}")

        # 4. Test Evidence Vault Tab
        page.click("button[data-tab='tab-vault']")
        time.sleep(0.5)
        page.click("#btn-register-evidence")
        page.wait_for_selector("#certificate-text", timeout=6000)
        time.sleep(1)
        vault_shot = os.path.join(ARTIFACTS_DIR, "nyayanode_evidence_vault_verified.png")
        page.screenshot(path=vault_shot, full_page=False)
        print(f"[SUCCESS] Saved Evidence Vault screenshot: {vault_shot}")

        # 5. Test Moot Court Tab
        page.click("button[data-tab='tab-moot']")
        time.sleep(0.5)
        moot_shot = os.path.join(ARTIFACTS_DIR, "nyayanode_moot_court_verified.png")
        page.screenshot(path=moot_shot, full_page=False)
        print(f"[SUCCESS] Saved Moot Court screenshot: {moot_shot}")

        browser.close()
        print("[ALL TESTS COMPLETED SUCCESSFULLY]")

if __name__ == "__main__":
    run_nyaya_verification()
