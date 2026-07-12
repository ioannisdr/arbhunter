import httpx
import asyncio
from datetime import datetime, timezone
from models import Match, Odds

class UnibetScraper:
    def __init__(self):
        self.sportsbook = "Unibet"
        self.sports_endpoints = {
            'Football': 'football.json',
            'Ice Hockey': 'ice_hockey.json',
            'Tennis': 'tennis.json',
            'Basketball': 'basketball.json'
        }

    async def fetch_matches(self):
        matches = []
        async with httpx.AsyncClient() as client:
            for sport_name, endpoint in self.sports_endpoints.items():
                url = f"https://eu-offering-api.kambicdn.com/offering/v2018/ub/listView/{endpoint}?lang=sv_SE&market=SE"
                try:
                    response = await client.get(url)
                    response.raise_for_status()
                    data = response.json()
                    
                    events = data.get('events', [])
                    print(f"[{self.sportsbook}] Fetched {len(events)} {sport_name} events.")
                    
                    for event in events:
                        e = event.get('event')
                        if e and e.get('state') == 'NOT_STARTED':
                            match_id = str(e.get('id'))
                            team_home = e.get('homeName')
                            team_away = e.get('awayName')
                            league = e.get('group')
                            
                            start_str = e.get('start')
                            if not start_str:
                                continue
                            start_time = datetime.fromisoformat(start_str.replace('Z', '+00:00'))
                            
                            match_odds = []
                            bet_offers = event.get('betOffers', [])
                            for offer in bet_offers:
                                offer_type = offer.get('betOfferType', {}).get('englishName', '')
                                criterion = offer.get('criterion', {}).get('englishLabel', '')
                                outcomes = offer.get('outcomes', [])
                                
                                if offer_type == 'Match' or criterion == 'Full Time':
                                    for outcome in outcomes:
                                        label = outcome.get('englishLabel') or outcome.get('label')
                                        sel = '1' if label == '1' else '2' if label == '2' else 'X'
                                        if 'odds' in outcome:
                                            price = outcome.get('odds') / 1000.0
                                            match_odds.append(Odds(
                                                sportsbook=self.sportsbook,
                                                market='1X2',
                                                selection=sel,
                                                price=price,
                                                updated_at=datetime.now(timezone.utc)
                                            ))
                                elif 'Total Goals' in criterion or 'Total Points' in criterion:
                                    for outcome in outcomes:
                                        line = outcome.get('line', offer.get('criterion', {}).get('line'))
                                        if line == 2500: # 2.5 goals/points
                                            label = outcome.get('englishLabel') or outcome.get('label')
                                            if 'odds' in outcome:
                                                price = outcome.get('odds') / 1000.0
                                                match_odds.append(Odds(
                                                    sportsbook=self.sportsbook,
                                                    market='OU_2.5',
                                                    selection=label,
                                                    price=price,
                                                    updated_at=datetime.now(timezone.utc)
                                                ))
                            
                            if match_odds:
                                matches.append(Match(
                                    id=match_id,
                                    sport=sport_name,
                                    league=league,
                                    start_time=start_time,
                                    team_home=team_home,
                                    team_away=team_away,
                                    odds=match_odds
                                ))
                except Exception as ex:
                    print(f"[{self.sportsbook}] Error fetching {sport_name}: {ex}")
                    
        return matches

async def main():
    scraper = UnibetScraper()
    matches = await scraper.fetch_matches()
    print(f"Total fetched {len(matches)} matches from Unibet")
    if matches:
        print(matches[0])

if __name__ == "__main__":
    asyncio.run(main())
