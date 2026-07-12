from typing import List, Dict, Tuple
from models import Match, Odds

def analyze_arbitrage(matches: List[Match]) -> List[Dict]:
    # Group odds by match and market
    # matches here should represent the same real-world event across different bookmakers
    
    opportunities = []
    
    # 1. Group matches by normalized team names / start time
    # This requires a robust matching algorithm. For this PoC, we assume they are already matched
    # and grouped into a 'canonical' match structure with odds from multiple bookies.
    
    for match in matches:
        markets = {}
        # Group odds by market (e.g. 1X2)
        for odd in match.odds:
            if odd.market not in markets:
                markets[odd.market] = []
            markets[odd.market].append(odd)
            
        # Check 1X2 Arbitrage
        if '1X2' in markets:
            odds_1x2 = markets['1X2']
            best_1 = max([o for o in odds_1x2 if o.selection == '1'], key=lambda x: x.price, default=None)
            best_X = max([o for o in odds_1x2 if o.selection == 'X'], key=lambda x: x.price, default=None)
            best_2 = max([o for o in odds_1x2 if o.selection == '2'], key=lambda x: x.price, default=None)
            
            if best_1 and best_X and best_2:
                implied_prob = (1 / best_1.price) + (1 / best_X.price) + (1 / best_2.price)
                if implied_prob < 1.0:
                    profit_margin = 1.0 - implied_prob
                    opportunities.append({
                        "match": f"{match.team_home} vs {match.team_away}",
                        "sport": match.sport,
                        "league": match.league,
                        "start_time": match.start_time.isoformat() if match.start_time else None,
                        "market": "1X2",
                        "margin": profit_margin,
                        "details": [
                            {"selection": "1", "price": best_1.price, "bookie": best_1.sportsbook},
                            {"selection": "X", "price": best_X.price, "bookie": best_X.sportsbook},
                            {"selection": "2", "price": best_2.price, "bookie": best_2.sportsbook},
                        ]
                    })
            elif best_1 and best_2 and not best_X:
                # 2-way Moneyline (e.g. Tennis, Baseball, Basketball, Boxing)
                implied_prob = (1 / best_1.price) + (1 / best_2.price)
                if implied_prob < 1.0:
                    profit_margin = 1.0 - implied_prob
                    opportunities.append({
                        "match": f"{match.team_home} vs {match.team_away}",
                        "sport": match.sport,
                        "league": match.league,
                        "start_time": match.start_time.isoformat() if match.start_time else None,
                        "market": "Moneyline",
                        "margin": profit_margin,
                        "details": [
                            {"selection": "1", "price": best_1.price, "bookie": best_1.sportsbook},
                            {"selection": "2", "price": best_2.price, "bookie": best_2.sportsbook},
                        ]
                    })
                    
        # Check dynamic OU_Totals Arbitrage
        if 'OU_Totals' in markets:
            odds_ou = markets['OU_Totals']
            points = set([str(o.selection).split(' ')[-1] for o in odds_ou if ' ' in str(o.selection)])
            
            for pt in points:
                best_over = max([o for o in odds_ou if f'Over {pt}' in str(o.selection)], key=lambda x: x.price, default=None)
                best_under = max([o for o in odds_ou if f'Under {pt}' in str(o.selection)], key=lambda x: x.price, default=None)
                
                if best_over and best_under:
                    implied_prob = (1 / best_over.price) + (1 / best_under.price)
                    if implied_prob < 1.0:
                        profit_margin = 1.0 - implied_prob
                        opportunities.append({
                            "match": f"{match.team_home} vs {match.team_away}",
                            "sport": match.sport,
                            "league": match.league,
                            "start_time": match.start_time.isoformat() if match.start_time else None,
                            "market": f"Over/Under {pt}",
                            "margin": profit_margin,
                            "details": [
                                {"selection": f"Over {pt}", "price": best_over.price, "bookie": best_over.sportsbook},
                                {"selection": f"Under {pt}", "price": best_under.price, "bookie": best_under.sportsbook},
                            ]
                        })

    return opportunities
