from dataclasses import dataclass
from datetime import datetime
from typing import List, Optional

@dataclass
class Odds:
    sportsbook: str
    market: str  # e.g., '1X2', 'OU_2.5'
    selection: str  # e.g., '1', 'X', '2', 'Over', 'Under'
    price: float
    updated_at: datetime

@dataclass
class Match:
    id: str
    sport: str
    league: str
    start_time: datetime
    team_home: str
    team_away: str
    odds: List[Odds]
