from database import save_discrepancies

mock_data = [
    {
        "match": "AIK vs Djurgården",
        "market": "1X2",
        "margin": 0.045, # 4.5% profit
        "details": [
            {"selection": "1", "price": 2.80, "bookie": "Unibet"},
            {"selection": "X", "price": 3.40, "bookie": "Betsson"},
            {"selection": "2", "price": 2.95, "bookie": "Svenska Spel"}
        ]
    },
    {
        "match": "Malmö FF vs IF Elfsborg",
        "market": "OU_2.5",
        "margin": 0.021, # 2.1% profit
        "details": [
            {"selection": "Over 2.5", "price": 1.95, "bookie": "Unibet"},
            {"selection": "Under 2.5", "price": 2.15, "bookie": "Bet365"}
        ]
    },
    {
        "match": "Hammarby vs IFK Göteborg",
        "market": "1X2",
        "margin": 0.012, # 1.2% profit
        "details": [
            {"selection": "1", "price": 1.90, "bookie": "Expekt"},
            {"selection": "X", "price": 3.80, "bookie": "Betsson"},
            {"selection": "2", "price": 5.10, "bookie": "Svenska Spel"}
        ]
    }
]

if __name__ == "__main__":
    save_discrepancies(mock_data)
    print("Mock data inserted.")
