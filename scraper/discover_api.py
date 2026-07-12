import asyncio
from playwright.async_api import async_playwright

async def discover_svenskaspel():
    print("Launching Playwright to discover Svenska Spel API...")
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        # Intercept and log all JSON requests
        page.on("response", lambda response: asyncio.create_task(log_response(response, "Svenska Spel")))
        
        try:
            await page.goto("https://spela.svenskaspel.se/oddset/fotboll", timeout=30000)
            await page.wait_for_timeout(5000) # Wait for page to load dynamic content
        except Exception as e:
            print(f"Error loading Svenska Spel: {e}")
            
        await browser.close()

async def discover_betsson():
    print("Launching Playwright to discover Betsson API...")
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        # Intercept and log all JSON requests
        page.on("response", lambda response: asyncio.create_task(log_response(response, "Betsson")))
        
        try:
            await page.goto("https://www.betsson.com/sv/odds/fotboll", timeout=30000)
            await page.wait_for_timeout(5000) # Wait for page to load dynamic content
        except Exception as e:
            print(f"Error loading Betsson: {e}")
            
        await browser.close()

async def log_response(response, source):
    if response.request.resource_type in ["fetch", "xhr"]:
        url = response.url
        if "events" in url.lower() or "odds" in url.lower() or "matches" in url.lower() or "graphql" in url.lower() or "competitions" in url.lower():
            print(f"[{source} API FOUND]: {url}")
            try:
                # Attempt to parse json to verify
                json_data = await response.json()
                print(f"   -> Valid JSON structure returned. Keys: {list(json_data.keys())[:5]}")
            except Exception:
                pass

async def main():
    await discover_svenskaspel()
    print("-" * 50)
    await discover_betsson()

if __name__ == "__main__":
    asyncio.run(main())
