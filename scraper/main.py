import asyncio
from typing import List
from models import Match
from odds_api import OddsAPIScraper
from analyzer import analyze_arbitrage
from matcher import TeamMatcher
from database import save_discrepancies
import json

async def fetch_all_odds():
    print("Fetching odds from The Odds API...")
    odds_api = OddsAPIScraper(use_sample=False)
    
    results = await asyncio.gather(
        odds_api.fetch_matches(),
        return_exceptions=True
    )
    
    all_matches = []
    for res in results:
        if isinstance(res, Exception):
            print(f"Scraper error: {res}")
        else:
            all_matches.extend(res)
            
    print(f"Total matches fetched across all bookies: {len(all_matches)}")
    return all_matches

async def main():
    matches = await fetch_all_odds()
    
    matcher = TeamMatcher()
    grouped_matches = matcher.group_matches(matches)
    print(f"Grouped into {len(grouped_matches)} unique canonical matches")
    
    opportunities = analyze_arbitrage(grouped_matches)
    
    print(f"\n--- Found {len(opportunities)} Discrepancy Opportunities ---")
    if opportunities:
        print(json.dumps(opportunities, indent=2))
        save_discrepancies(opportunities)
        print("Discrepancies saved to database.")
        
if __name__ == "__main__":
    asyncio.run(main())
