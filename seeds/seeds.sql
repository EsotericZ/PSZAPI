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
  112875, 
  'God of War Ragnarök', 
  'co5s5v', 
  'M (Mature 17+)', 
  94.61538461538461, 
  '2022-11-09', 
  'god-of-war-ragnarok', 
  '[{"id": 12, "name": "Role-playing (RPG)"}, {"id": 25, "name": "Hack and slash/Beat ''em up"}, {"id": 31, "name": "Adventure"}]'::jsonb, 
  'The freezing winds of Fimbulwinter have come to Midgard, making survival for Kratos, Atreus, and Mimir in the Norse wilds even more challenging than before.\n\nWhile the last game built an enormous amount of trust and understanding between father and son, there is still a great deal of complexity in their interactions – especially after the revelation of Atreus’ Giant heritage and the hidden prophecy only Kratos saw.\n\nAtreus is desperately curious. Like most young people, he wants to understand who he is more than anything. In this case, he wants to understand who he could be. The mystery of Loki’s role in the upcoming conflict is something that Atreus cannot let go of. He wants to keep his family safe, but Atreus also doesn’t want to stand by and do nothing while conflict consumes the Nine Realms.\n\nKratos, still bearing the knowledge of his past mistakes, wants to spare Atreus the bloody lessons he learned from his conflict with gods. He wants to keep his son safe, above all, and their confrontation with Baldur has vindicated the belief that only tragedy will come from further entanglements with the Aesir.\n\nTogether, Kratos and Atreus will have to make a choice about which path they will take. Whatever they choose will define the fate of all those living in the Nine Realms as Ragnarök approaches.', 
  'God of War: Ragnarök is the ninth installment in the God of War series and the sequel to 2018s God of War. Continuing with the Norse mythology theme, the game is set in ancient Norway and features series protagonists Kratos, the former Greek God of War, and his young son Atreus. The game kicked off the events of Ragnarök, where Kratos and Atreus must journey to each of the Nine Realms in search of answers as they prepare for the prophesied battle that will end the world.'
),
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
(uuid_generate_v4(), 'Game of the Month', 1, (SELECT id FROM igdb WHERE "igdbId"=112875)),
(uuid_generate_v4(), 'Featured', 2, (SELECT id FROM igdb WHERE "igdbId"=134597));

-- Insert seed data into the Games table
INSERT INTO games (id, "psnId", "igdbId", name, year) VALUES
(uuid_generate_v4(), 'NPWR20188_00', 134597, 'ASTRO''s PLAYROOM', 2020);