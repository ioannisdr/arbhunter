from thefuzz import fuzz, process
from typing import List, Dict, Optional
from models import Match

class TeamMatcher:
    def __init__(self):
        # We can add explicit aliases for known hard-to-match teams
        self.aliases = {
            "manchester utd": "manchester united",
            "man utd": "manchester united",
            "aik solna": "aik",
            "aik fotboll": "aik",
            "ifk goteborg": "ifk göteborg"
        }

    def normalize_name(self, name: str) -> str:
        name = name.lower().strip()
        # Remove common suffixes that confuse fuzzy matching
        suffixes = [" fc", " fk", " if", " ff", " (d)", " (w)", " bk", " boIS"]
        for suffix in suffixes:
            if name.endswith(suffix):
                name = name[:-len(suffix)].strip()
                
        # Apply aliases
        for alias, actual in self.aliases.items():
            if alias in name:
                name = actual
                break
                
        return name

    def is_same_team(self, name1: str, name2: str, threshold: int = 80) -> bool:
        norm1 = self.normalize_name(name1)
        norm2 = self.normalize_name(name2)
        
        # Simple exact match after normalization
        if norm1 == norm2:
            return True
            
        # Token sort ratio handles words in different order (e.g. "FC Inter" vs "Inter FC")
        score = fuzz.token_sort_ratio(norm1, norm2)
        return score >= threshold

    def group_matches(self, all_matches: List[Match]) -> List[Match]:
        """
        Takes a flat list of matches from different bookmakers and groups them 
        into canonical matches based on fuzzy matched team names and start times.
        """
        grouped = []
        
        for match in all_matches:
            matched = False
            for g_match in grouped:
                # To be the same event, it needs to be the same time (within 1 hour variance in case of slight shifts)
                time_diff = abs((match.start_time - g_match.start_time).total_seconds())
                if time_diff > 3600:
                    continue
                    
                if self.is_same_team(match.team_home, g_match.team_home) and \
                   self.is_same_team(match.team_away, g_match.team_away):
                    # It's the same match, append the odds
                    g_match.odds.extend(match.odds)
                    matched = True
                    break
            
            if not matched:
                # Add as a new canonical match
                grouped.append(match)
                
        return grouped
