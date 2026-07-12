import json
import os
from datetime import datetime, timezone
from models import Match, Odds

class OddsAPIScraper:
    def __init__(self, use_sample=True):
        self.sportsbook = "OddsAPI"
        self.use_sample = use_sample

    async def fetch_matches(self):
        import httpx
        from dotenv import load_dotenv
        
        load_dotenv()
        api_key = os.getenv("ODDS_API_KEY")
        
        matches = []
        if self.use_sample or not api_key:
            file_path = os.path.join(os.path.dirname(__file__), 'sample_odds.json')
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
            except Exception as e:
                print(f"[{self.sportsbook}] Error reading sample file: {e}")
                return matches
        else:
            print(f"[{self.sportsbook}] Fetching live data from api.the-odds-api.com...")
            try:
                url = f"https://api.the-odds-api.com/v4/sports/upcoming/odds/?regions=eu,us,uk,au&markets=h2h,totals&oddsFormat=decimal&apiKey={api_key}"
                async with httpx.AsyncClient() as client:
                    response = await client.get(url, timeout=30.0)
                    response.raise_for_status()
                    data = response.json()
            except Exception as e:
                print(f"[{self.sportsbook}] Live API Error: {e}")
                return matches
            
        print(f"[{self.sportsbook}] Parsed {len(data)} events from The Odds API feed.")
        
        for event in data:
            match_id = str(event.get('id'))
            sport_title = event.get('sport_title')
            sport_key = event.get('sport_key', '').lower()
            
            # Map sport title to our sport categories if possible
            sport = sport_title
            if 'soccer' in sport_key:
                sport = 'Football'
            elif 'tennis' in sport_key:
                sport = 'Tennis'
            elif 'basketball' in sport_key:
                sport = 'Basketball'
            elif 'ice_hockey' in sport_key or 'icehockey' in sport_key:
                sport = 'Ice Hockey'
            elif 'baseball' in sport_key:
                sport = 'Baseball'
            
            league = sport_title
            start_str = event.get('commence_time')
            if start_str:
                start_time = datetime.fromisoformat(start_str.replace('Z', '+00:00'))
            else:
                start_time = datetime.now(timezone.utc)
                
            # STRICT PRE-GAME FILTER:
            # If the match has already started, ignore it. We only want pre-game bets.
            if start_time <= datetime.now(timezone.utc):
                continue
                
            team_home = event.get('home_team')
            team_away = event.get('away_team')
            
            match_odds = []
            
            for bookmaker in event.get('bookmakers', []):
                bookie_name = bookmaker.get('title')
                for market in bookmaker.get('markets', []):
                    market_key = market.get('key')
                    if market_key in ['h2h', 'h2h_lay']:
                        # h2h_lay is for betting exchanges, we will treat it separately or skip it.
                        # For simple surebets, we stick to 'h2h' (back odds).
                        if market_key == 'h2h_lay':
                            continue
                            
                        # Parse 1X2 or Moneyline
                        for outcome in market.get('outcomes', []):
                            name = outcome.get('name')
                            price = outcome.get('price')
                            
                            selection = name
                            if name == team_home:
                                selection = '1'
                            elif name == team_away:
                                selection = '2'
                            elif name.lower() == 'draw':
                                selection = 'X'
                                
                            match_odds.append(Odds(
                                sportsbook=bookie_name,
                                market='1X2',
                                selection=selection,
                                price=price,
                                updated_at=datetime.now(timezone.utc)
                            ))
                            
                    elif market_key == 'totals':
                        for outcome in market.get('outcomes', []):
                            name = outcome.get('name')
                            price = outcome.get('price')
                            point = outcome.get('point')
                            
                            if point is not None:
                                selection = f"{name} {point}"
                                match_odds.append(Odds(
                                    sportsbook=bookie_name,
                                    market='OU_Totals',
                                    selection=selection,
                                    price=price,
                                    updated_at=datetime.now(timezone.utc)
                                ))
                            
            if match_odds:
                matches.append(Match(
                    id=match_id,
                    sport=sport,
                    league=league,
                    start_time=start_time,
                    team_home=team_home,
                    team_away=team_away,
                    odds=match_odds
                ))
                
        return matches
