import asyncio
from curl_cffi import requests
from bs4 import BeautifulSoup
import json

def test_svenskaspel():
    url = "https://spela.svenskaspel.se/oddset/fotboll"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    }
    
    print("Fetching Svenska Spel HTML...")
    try:
        response = requests.get(url, headers=headers, impersonate="chrome120")
        if response.status_code != 200:
            print(f"Failed with status: {response.status_code}")
            return
            
        html = response.text
        soup = BeautifulSoup(html, 'html.parser')
        
        # Look for scripts that might contain the initial state
        print("Looking for JSON blobs in scripts...")
        scripts = soup.find_all('script')
        found = False
        for s in scripts:
            content = s.string
            if content and ('__INITIAL_STATE__' in content or 'window.__data' in content or 'window.__INITIAL_STATE__' in content or 'window.ReactComponent' in content):
                print(f"Found potential state script of length {len(content)}")
                found = True
                
        if not found:
            print("No initial state script found.")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_svenskaspel()
