-- Insert seed data into the users table
INSERT INTO users (id, email, psn, role, verified, "verifyCode", "firstTime", "createdAt") VALUES
(uuid_generate_v4(), 'cjsand03z@gmail.com', 'The_Real_Zanatos', 2001, TRUE, '15314C', FALSE, '2023-01-01 10:00:00'),
(uuid_generate_v4(), 'cjsand03x@gmail.com', 'Esoteric-Z', 2001, TRUE, '153XXC', FALSE, '2023-01-01 10:00:00'),
(uuid_generate_v4(), 'b@gmail.com', NULL, 2001, FALSE, NULL, FALSE, '2023-02-15 14:30:00'),
(uuid_generate_v4(), 'a@gmail.com', NULL, 2001, FALSE, '5AS42X', FALSE, '2023-03-10 08:45:00'),
(uuid_generate_v4(), 'z@gmail.com', 'Player1', 2001, TRUE, '5AS42S', FALSE, '2023-04-05 18:20:00'),
(uuid_generate_v4(), 'd@gmail.com', 'Player2', 2001, TRUE, '5AS42Y', FALSE, '2023-05-12 16:00:00'),
(uuid_generate_v4(), 'cjsand03@gmail.com', NULL, 1089, FALSE, NULL, TRUE, '2023-06-25 09:15:00');

-- Insert seed data into the IGDB table
INSERT INTO igdb (id, "igdbId", name, cover, esrb, rating, released, slug, genres, storyline, summary) VALUES
(
  uuid_generate_v4(), 
  134597, 
  'Astro''s Playroom', 
  'co6sd6', 
  'E10+ (Everyone 10+)', 
  80.83333333333333, 
  '2020-11-12', 
  'astros-playroom', 
  '[{"id": 8, "name": "Platform"}, {"id": 31, "name": "Adventure"}]'::jsonb, 
  '', 
  'Astro and his crew lead you on a magical introduction through PS5 in this fun platformer that comes pre-loaded on PS5. Explore four worlds, each based on PS5''s console components. Each area showcases innovative gameplay that taps into the new features of the PS5''s DualSense wireless controller.'
);

-- Insert seed data into the Featured table
INSERT INTO featured (id, description, "order", "igdbId") VALUES
(uuid_generate_v4(), 'Game of the Month', 1, (SELECT id FROM igdb WHERE "igdbId"=134597));

-- Insert seed data into the Games table
INSERT INTO games (id, "psnId", "igdbId", name, year) VALUES
(uuid_generate_v4(), 'NPWR20188_00', 134597, 'ASTRO''s PLAYROOM', 2020);