DROP DATABASE IF EXISTS psz_db;
CREATE DATABASE psz_db;

\c psz_db;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================
-- CREATE TABLES
-- ==========================

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(100) NOT NULL UNIQUE,
  psn VARCHAR(100) UNIQUE,
  role INTEGER DEFAULT 2001,
  verified BOOLEAN DEFAULT FALSE,
  "verifyCode" VARCHAR(6),
  "psnAccountId" VARCHAR(255),
  "psnAvatar" VARCHAR(255),
  "psnPlus" BOOLEAN DEFAULT FALSE,
  trophies JSONB NOT NULL DEFAULT '{}'::JSONB,
  "firstTime" BOOLEAN DEFAULT TRUE,
  announcement BOOLEAN DEFAULT FALSE,
  "accountLevel" VARCHAR(10) CHECK ("accountLevel" IN ('standard', 'premium')) DEFAULT 'standard',
  "lastApiRequestStandard" TIMESTAMP WITH TIME ZONE,
  "lastApiRequestPremium" TIMESTAMP WITH TIME ZONE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Friends Table
CREATE TABLE IF NOT EXISTS friends (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "psnAccountId" VARCHAR(255) NOT NULL,
  "username" VARCHAR(100) NOT NULL, 
  "avatarUrl" VARCHAR(255), 
  "pszUser" BOOLEAN DEFAULT FALSE,
  CONSTRAINT unique_friend UNIQUE ("userId", "psnAccountId")
);

-- IGDB Table
CREATE TABLE IF NOT EXISTS igdb (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "gameId" INTEGER NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  cover VARCHAR(100),
  esrb VARCHAR(50),
  rating FLOAT,
  "ratingTop" FLOAT NULL,
  "releaseDate" VARCHAR(10) NULL,
  slug VARCHAR(255) NULL,
  genres JSONB NULL,
  storyline TEXT NULL,
  summary TEXT NULL
);

-- Games Table
CREATE TABLE IF NOT EXISTS games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "gameId" VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  year INTEGER
);

-- Featured Table
CREATE TABLE IF NOT EXISTS featured (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  description VARCHAR(100) UNIQUE NOT NULL,
  "order" INTEGER NOT NULL,
  "gameId" UUID NOT NULL,
  CONSTRAINT fk_game FOREIGN KEY ("gameId") REFERENCES igdb (id) ON DELETE CASCADE
);

-- Ratings Table
CREATE TABLE IF NOT EXISTS ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userRating" FLOAT,
  "userReview" TEXT,
  goty BOOLEAN DEFAULT FALSE,
  "gameId" UUID NOT NULL,
  "userId" UUID NOT NULL,
  CONSTRAINT fk_game FOREIGN KEY ("gameId") REFERENCES games (id) ON DELETE CASCADE,
  CONSTRAINT fk_user FOREIGN KEY ("userId") REFERENCES users (id) ON DELETE CASCADE
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rating FLOAT,
  review TEXT,
  goty BOOLEAN DEFAULT FALSE,
  "gameId" UUID NOT NULL,
  CONSTRAINT fk_game FOREIGN KEY ("gameId") REFERENCES games (id) ON DELETE CASCADE
);

-- Collection Table
CREATE TABLE IF NOT EXISTS collection (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "gameId" VARCHAR(100) NOT NULL,
  name VARCHAR(100) NOT NULL,
  image VARCHAR(255) NOT NULL,
  progress INTEGER NOT NULL,
  platinum BOOLEAN DEFAULT FALSE,
  "earnedTrophies" JSONB NOT NULL DEFAULT '{}'::JSONB,
  trophies JSONB NOT NULL DEFAULT '[]'::JSONB,
  status VARCHAR(20) NOT NULL,
  "userId" UUID NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 10),
  year INTEGER,
  goty BOOLEAN DEFAULT FALSE,
  CONSTRAINT fk_user FOREIGN KEY ("userId") REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT collection_user_game_unique UNIQUE ("userId", "gameId")
);

-- Backlog Table
CREATE TABLE IF NOT EXISTS backlog (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "psnName" VARCHAR(100) NOT NULL,
  "psnIcon" VARCHAR(255) NOT NULL,
  progress INTEGER NOT NULL,
  platinum BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) NOT NULL,
  "order" INTEGER NOT NULL,
  "gameId" UUID NOT NULL,
  "userId" UUID NOT NULL,
  CONSTRAINT fk_game FOREIGN KEY ("gameId") REFERENCES games (id) ON DELETE CASCADE,
  CONSTRAINT fk_user FOREIGN KEY ("userId") REFERENCES users (id) ON DELETE CASCADE
);

-- Wishlist Table
CREATE TABLE IF NOT EXISTS wishlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "gameId" UUID NOT NULL,
  "userId" UUID NOT NULL,
  CONSTRAINT fk_game FOREIGN KEY ("gameId") REFERENCES games (id) ON DELETE CASCADE,
  CONSTRAINT fk_user FOREIGN KEY ("userId") REFERENCES users (id) ON DELETE CASCADE
);

-- ==========================
-- PERFORMANCE INDEXES
-- ==========================

-- Index For Rating
CREATE INDEX idx_rating_gameId ON ratings ("gameId");
CREATE INDEX idx_rating_userId ON ratings ("userId");

-- Index For Featured
CREATE INDEX idx_featured_gameId ON featured ("gameId");

-- Index For Review
CREATE INDEX idx_review_gameId ON reviews ("gameId");

-- Index For Collection
CREATE INDEX idx_collection_gameId ON collection ("gameId");
CREATE INDEX idx_collection_userId ON collection ("userId");

-- Index For Backlog
CREATE INDEX idx_backlog_gameId ON backlog ("gameId");
CREATE INDEX idx_backlog_userId ON backlog ("userId");

-- Index For Wishlist
CREATE INDEX idx_wishlist_gameId ON wishlist ("gameId");
CREATE INDEX idx_wishlist_userId ON wishlist ("userId");