DROP DATABASE IF EXISTS psz_db;
CREATE DATABASE psz_db;

\c psz_db;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(100) NOT NULL UNIQUE,
  psn VARCHAR(100) UNIQUE,
  role INTEGER DEFAULT 2001,
  verified BOOLEAN DEFAULT FALSE,
  verifyCode VARCHAR(6),
  psnAccountId VARCHAR(255),
  psnAvatar VARCHAR(255),
  psnPlus BOOLEAN DEFAULT FALSE
);

-- Games Table
CREATE TABLE IF NOT EXISTS games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  colorDom VARCHAR(255),
  colorSat VARCHAR(255),
  esrb VARCHAR(100),
  gameId INTEGER NOT NULL,
  image VARCHAR(255) NOT NULL,
  metacritic VARCHAR(255),
  name VARCHAR(100) NOT NULL,
  rating FLOAT,
  ratingTop FLOAT,
  released VARCHAR(10) NOT NULL,
  slug VARCHAR(255),
);