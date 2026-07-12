import psycopg2
from psycopg2.extras import RealDictCursor
import json
import os
from datetime import datetime
from typing import List, Dict
from dotenv import load_dotenv

# Load env variables (assuming .env is in the parent dir or same dir)
load_dotenv(os.path.join(os.path.dirname(__file__), '../web/.env.local'))

def get_db_connection():
    db_url = os.getenv('DATABASE_URL')
    if not db_url:
        raise ValueError("DATABASE_URL is not set in environment variables")
    conn = psycopg2.connect(db_url)
    return conn

def init_db():
    conn = get_db_connection()
    c = conn.cursor()
    
    # Notice we change TEXT to VARCHAR and REAL to NUMERIC or FLOAT
    c.execute('''
        CREATE TABLE IF NOT EXISTS matches (
            id VARCHAR PRIMARY KEY,
            sport VARCHAR,
            league VARCHAR,
            start_time TIMESTAMP,
            team_home VARCHAR,
            team_away VARCHAR
        )
    ''')
    c.execute('''
        CREATE TABLE IF NOT EXISTS odds (
            id SERIAL PRIMARY KEY,
            match_id VARCHAR,
            sportsbook VARCHAR,
            market VARCHAR,
            selection VARCHAR,
            price FLOAT,
            updated_at TIMESTAMP,
            FOREIGN KEY(match_id) REFERENCES matches(id) ON DELETE CASCADE
        )
    ''')
    c.execute('''
        CREATE TABLE IF NOT EXISTS discrepancies (
            id SERIAL PRIMARY KEY,
            match_name VARCHAR,
            sport VARCHAR,
            league VARCHAR,
            start_time TIMESTAMP,
            market VARCHAR,
            margin FLOAT,
            details JSONB,
            updated_at TIMESTAMP
        )
    ''')
    
    # Retroactive patch for existing databases without the sport column
    try:
        c.execute('ALTER TABLE discrepancies ADD COLUMN sport VARCHAR;')
    except psycopg2.errors.DuplicateColumn:
        conn.rollback() # Column already exists
    else:
        conn.commit()
        
    try:
        c.execute('ALTER TABLE discrepancies ADD COLUMN league VARCHAR;')
        c.execute('ALTER TABLE discrepancies ADD COLUMN start_time TIMESTAMP;')
    except psycopg2.errors.DuplicateColumn:
        conn.rollback()
    else:
        conn.commit()

    conn.commit()
    conn.close()

def save_discrepancies(discrepancies: List[Dict]):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute('DELETE FROM discrepancies') # Clear old ones
    
    for d in discrepancies:
        c.execute('''
            INSERT INTO discrepancies (match_name, sport, league, start_time, market, margin, details, updated_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        ''', (d['match'], d.get('sport', 'Unknown'), d.get('league'), d.get('start_time'), d['market'], d['margin'], json.dumps(d['details']), datetime.now()))
        
    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    print("Postgres Database initialized.")
