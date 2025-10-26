-- Import Yahoo NBA Mapping Data
-- Run this SQL in Supabase SQL Editor after deploying the tables

-- Sample data (expand this with full mapping)
INSERT INTO yahoo_nba_mapping (nba_id, name, yahoo_id, team, position)
VALUES 
  (1630173, 'Precious Achiuwa', 6412, 'MIA', 'PF,C'),
  (203076, 'Anthony Davis', 4558, 'LAL', 'PF,C'),
  (203507, 'Giannis Antetokounmpo', 5185, 'MIL', 'PF,C'),
  (1628978, 'Bam Adebayo', 6029, 'MIA', 'C'),
  (1630583, 'Scottie Barnes', 6676, 'TOR', 'SF,PF'),
  (2544, 'LeBron James', 3704, 'LAL', 'SF,PF'),
  (203999, 'Nikola Jokic', 5464, 'DEN', 'C'),
  (201142, 'Kevin Durant', 3930, 'PHX', 'SF,PF'),
  (201939, 'Stephen Curry', 4612, 'GSW', 'PG,SG'),
  (203954, 'Joel Embiid', 5294, 'PHI', 'C,PF'),
  (1629029, 'Luka Doncic', 6025, 'DAL', 'PG,SG'),
  (1628369, 'Jayson Tatum', 5976, 'BOS', 'SF,PF'),
  (1628983, 'Shai Gilgeous-Alexander', 6112, 'OKC', 'PG,SG'),
  (1626157, 'Damian Lillard', 4840, 'MIL', 'PG'),
  (201935, 'James Harden', 4725, 'LAC', 'PG,SG'),
  (203081, 'Jimmy Butler', 4799, 'MIA', 'SG,SF'),
  (202681, 'Kyrie Irving', 4840, 'DAL', 'PG,SG'),
  (202695, 'Kawhi Leonard', 4828, 'LAC', 'SF,PF'),
  (203473, 'Rudy Gobert', 5143, 'MIN', 'C'),
  (201566, 'Russell Westbrook', 4473, 'LAC', 'PG'),
  (203200, 'Domantas Sabonis', 5155, 'SAC', 'PF,C'),
  (203082, 'Paul George', 4799, 'LAC', 'SF,PF'),
  (1626164, 'Devin Booker', 5486, 'PHX', 'PG,SG'),
  (1627759, 'Jaylen Brown', 5672, 'BOS', 'SG,SF'),
  (202331, 'Brandon Ingram', 5490, 'NOP', 'SF,PF'),
  (1626156, 'Dejounte Murray', 5433, 'NOP', 'PG,SG'),
  (1628369, 'Trae Young', 6027, 'ATL', 'PG'),
  (203114, 'Khris Middleton', 4854, 'MIL', 'SF,SG'),
  (1628398, 'De''Aaron Fox', 5780, 'SAC', 'PG'),
  (201950, 'Jrue Holiday', 4725, 'BOS', 'PG,SG'),
  (1628464, 'Jaren Jackson Jr', 6014, 'MEM', 'PF,C'),
  (203991, 'Clint Capela', 5153, 'ATL', 'C'),
  (201566, 'DeMar DeRozan', 4563, 'CHI', 'SG,SF'),
  (1627750, 'Ben Simmons', 5607, 'BKN', 'PG,PF'),
  (203468, 'CJ McCollum', 5154, 'NOP', 'PG,SG'),
  (1628407, 'Jarrett Allen', 5948, 'CLE', 'C'),
  (203521, 'Julius Randle', 5155, 'NYK', 'PF,C')
ON CONFLICT (nba_id) 
DO UPDATE SET
  name = EXCLUDED.name,
  yahoo_id = EXCLUDED.yahoo_id,
  team = EXCLUDED.team,
  position = EXCLUDED.position,
  updated_at = NOW();

-- Verify import
SELECT COUNT(*) as total_players FROM yahoo_nba_mapping;

-- Show sample data
SELECT * FROM yahoo_nba_mapping ORDER BY name LIMIT 10;

