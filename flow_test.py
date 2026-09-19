import os
from playwright.sync_api import sync_playwright

def run_test():
    artifacts_dir = r"C:\Users\Preetham.j\.gemini\antigravity\brain\c95f737b-481b-4921-aabf-dc774f62b939"
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1920, "height": 1080})
        
        print("Navigating to local dev server...")
        page.goto("http://localhost:5030")
        page.wait_for_load_state("networkidle")
        
        # Take screenshot of home
        page.screenshot(path=os.path.join(artifacts_dir, "nyayanode_home_verified.png"))
        print("Home verified.")
        
        # Click the Neuromorphic Engine tab
        print("Clicking Neuromorphic Engine...")
        page.click("text=Neuromorphic Engine")
        page.wait_for_timeout(2000) # Wait for animation/tab switch
        
        page.screenshot(path=os.path.join(artifacts_dir, "nyayanode_neuromorphic_verified.png"))
        print("Neuromorphic verified.")
        
        browser.close()

if __name__ == "__main__":
    run_test()
