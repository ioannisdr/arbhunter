import asyncio
from datetime import datetime
from main import fetch_all_odds
from analyzer import analyze_arbitrage
from matcher import TeamMatcher
from database import save_discrepancies
import json

async def execute_engine_cycle(sweep_type="General Sweep"):
    print(f"[{datetime.now().strftime('%H:%M:%S')}] Starting {sweep_type}...")
    try:
        matches = await fetch_all_odds()
        matcher = TeamMatcher()
        grouped_matches = matcher.group_matches(matches)
        
        opportunities = analyze_arbitrage(grouped_matches)
        
        print(f"[{datetime.now().strftime('%H:%M:%S')}] {sweep_type} complete. Found {len(opportunities)} surebets.")
        
        # Save to DB (this also clears old/stale opportunities if they disappeared)
        save_discrepancies(opportunities)
        
    except Exception as e:
        print(f"[{datetime.now().strftime('%H:%M:%S')}] Error during {sweep_type}: {e}")

async def general_sweep_loop():
    """Runs every 30 minutes to find brand new games."""
    while True:
        await execute_engine_cycle("General Sweep")
        # Wait 30 minutes (1800 seconds)
        await asyncio.sleep(1800)

async def targeted_sweep_loop():
    """Runs every 1 minute to refresh odds for active matches."""
    # Offset start to not clash directly with the general sweep
    await asyncio.sleep(60) 
    while True:
        # In a production environment with real API keys, this would specifically
        # query only the match IDs of current surebets to save API credits.
        # Since we are using the sample payload right now, we just execute the cycle.
        await execute_engine_cycle("Targeted Fast Sweep")
        
        # Wait 1 minute (60 seconds)
        await asyncio.sleep(60)

async def run_scheduler():
    print("=========================================")
    print(" Starting ArbHunter Background Scheduler ")
    print("=========================================")
    
    # Run both loops concurrently
    await asyncio.gather(
        general_sweep_loop(),
        targeted_sweep_loop()
    )

if __name__ == "__main__":
    try:
        asyncio.run(run_scheduler())
    except KeyboardInterrupt:
        print("\nScheduler stopped.")
