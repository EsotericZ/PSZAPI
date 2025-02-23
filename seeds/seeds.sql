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
),
(
  uuid_generate_v4(), 
  164867, 
  'Dredge', 
  'co97eq', 
  'E10+ (Everyone 10+)', 
  45.6, 
  '2023-03-30', 
  'dredge', 
  '[{"id": 12, "name": "Role-playing (RPG)"}, {"id": 31, "name": "Adventure"}, {"id": 13, "name": "Simulator"}]'::jsonb, 
  '', 
  'Dredge is a fishing adventure with a sinister undercurrent. Sell your catch, upgrade your vessel and dredge the depths for long-buried relics. Explore the stories of the strange locals and discover why some things are best left forgotten.'
),
(
  uuid_generate_v4(), 
  214397, 
  'Moving Out 2', 
  'co8zgy', 
  'E (Everyone)', 
  74.9, 
  '2023-08-15', 
  'moving-out-2', 
  '[{"id": 32, "name": "Indie"}, {"id": 15, "name": "Strategy"}, {"id": 13, "name": "Simulator"}]'::jsonb, 
  '', 
  'Moving Out 2 is a video game in which payers attempt to move objects across various levels without hitting objections. It combines elements of strategy, puzzles, and party video games. It is a sequel to Moving Out.'
),
(
  uuid_generate_v4(), 
  119171, 
  'Baldur''s Gate 3', 
  'co670h', 
  'M (Mature 17+)', 
  94.5, 
  '2023-08-03', 
  'baldurs-gate-3', 
  '[{"id": 12, "name": "Role-playing (RPG)"}, {"id": 15, "name": "Strategy"}, {"id": 16, "name": "Turn-based strategy (TBS)"}, {"id": 24, "name": "Tactical"}, {"id": 31, "name": "Adventure"}]'::jsonb, 
  'The land of Faerûn is in turmoil. Refugees cross the wilds, fleeing the helltorn stronghold of Elturel. A vicious cult marches across the Sword Coast, uniting every race of monsters and men under the banner of a cryptic god they call the Absolute. Chaos strikes at Faerûn''s foundations, and none may escape its talons. Not even you.  The grotesque nautiloid ship appears out of nowhere, blotting out the sun. Its writhing tentacles snatch you from where you stand. The mind flayers have come, imprisoning you on their ship, infecting you with their horrid parasite. You will become one of them. By fate or fortune, you survive when the nautiloid crashes in the Sword Coast outlands. You set out for civilisation, desperate for a cure for the parasite festering in your brain, only to take centre stage in a conspiracy that runs as deep as the Nine Hells. New enemies await. As for old foes... the shadows stir. And all roads lead to the legendary city of Baldur''s Gate.', 
  'An ancient evil has returned to Baldur''s Gate, intent on devouring it from the inside out. The fate of Faerun lies in your hands. Alone, you may resist. But together, you can overcome.'
);

-- Insert seed data into the Featured table
INSERT INTO featured (id, description, "order", "igdbId") VALUES
(uuid_generate_v4(), 'Game of the Month', 1, (SELECT id FROM igdb WHERE "igdbId"=134597)),
(uuid_generate_v4(), 'Featured 1', 2, (SELECT id FROM igdb WHERE "igdbId"=164867)),
(uuid_generate_v4(), 'Featured 2', 3, (SELECT id FROM igdb WHERE "igdbId"=214397)),
(uuid_generate_v4(), 'Featured 3', 4, (SELECT id FROM igdb WHERE "igdbId"=119171));