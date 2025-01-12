-- Insert seed data into the users table
INSERT INTO users (id, email, psn, role, verified, "verifyCode", "firstTime", "createdAt") VALUES
(uuid_generate_v4(), 'cjsand03z@gmail.com', 'Esoteric-Z', 2001, TRUE, '15314C', FALSE, '2023-01-01 10:00:00'),
(uuid_generate_v4(), 'b@gmail.com', NULL, 2001, FALSE, NULL, FALSE, '2023-02-15 14:30:00'),
(uuid_generate_v4(), 'a@gmail.com', NULL, 2001, FALSE, '5AS42X', FALSE, '2023-03-10 08:45:00'),
(uuid_generate_v4(), 'z@gmail.com', 'Player1', 2001, TRUE, '5AS42S', FALSE, '2023-04-05 18:20:00'),
(uuid_generate_v4(), 'd@gmail.com', 'Player2', 2001, TRUE, '5AS42Y', FALSE, '2023-05-12 16:00:00'),
(uuid_generate_v4(), 'cjsand03@gmail.com', NULL, 1089, FALSE, NULL, TRUE, '2023-06-25 09:15:00');

-- Insert seed data into the games table
INSERT INTO games (id, "colorDom", "colorSat", esrb, "gameId", image, metacritic, name, rating, "ratingTop", released, slug) VALUES
(uuid_generate_v4(), '0f0f0f', '0f0f0f', 'No Rating', 973384, 'https://media.rawg.io/media/screenshots/1d3/1d37ed8c21e856d71c06874c17916981.jpg', 0, 'God of War Ragnarok: Valhalla', 4.26, 5, '2023-12-12', 'god-of-war-ragnarok-valhalla'),
(uuid_generate_v4(), '0f0f0f', '0f0f0f', 'No Rating', 842402, 'https://media.rawg.io/media/games/c2c/c2c9f1c026b6c1be5bc2160baf7224ea.jpg', 0, 'Dredge', 4.33, 5, '2023-03-29', 'dredge'),
(uuid_generate_v4(), '0f0f0f', '0f0f0f', 'Mature', 58755, 'https://media.rawg.io/media/games/9fb/9fbf956a16249def7625ab5dc3d09515.jpg', 88, 'Devil May Cry 5', 4.25, 5, '2019-03-08', 'devil-may-cry-5'),
(uuid_generate_v4(), '0f0f0f', '0f0f0f', 'No Rating', 638654, 'https://media.rawg.io/media/games/ea6/ea6a1382b15d749e15fdfbf0aece7689.jpg', 0, 'Dead Space', 4.41, 5, '2023-01-27', 'dead-space-5');

-- Insert seed data into the games table
INSERT INTO featured (id, description, "order", "gameId") VALUES
(uuid_generate_v4(), 'Game of the Month', 1, (SELECT id FROM games WHERE slug='dead-space-5')),
(uuid_generate_v4(), 'Featured 1', 2, (SELECT id FROM games WHERE slug='god-of-war-ragnarok-valhalla')),
(uuid_generate_v4(), 'Featured 2', 3, (SELECT id FROM games WHERE slug='dredge')),
(uuid_generate_v4(), 'Featured 3', 4, (SELECT id FROM games WHERE slug='devil-may-cry-5'));