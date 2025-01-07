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
  "firstTime" BOOLEAN DEFAULT TRUE,
  announcement BOOLEAN DEFAULT FALSE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Games Table
CREATE TABLE IF NOT EXISTS games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "colorDom" VARCHAR(255),
  "colorSat" VARCHAR(255),
  esrb VARCHAR(100),
  "gameId" INTEGER NOT NULL,
  image VARCHAR(255) NOT NULL,
  metacritic VARCHAR(255),
  name VARCHAR(100) NOT NULL,
  rating FLOAT,
  "ratingTop" FLOAT,
  released VARCHAR(10) NOT NULL,
  slug VARCHAR(255)
);

-- Featured Table
CREATE TABLE IF NOT EXISTS featured (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  description VARCHAR(100) UNIQUE NOT NULL,
  "order" INTEGER NOT NULL,
  "gameId" UUID NOT NULL,
  CONSTRAINT fk_game FOREIGN KEY ("gameId") REFERENCES games (id) ON DELETE CASCADE
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
  "psnName" VARCHAR(100) NOT NULL,
  "psnIcon" VARCHAR(255) NOT NULL,
  progress INTEGER NOT NULL,
  platinum BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) NOT NULL,
  "gameId" UUID NOT NULL,
  "userId" UUID NOT NULL,
  CONSTRAINT fk_game FOREIGN KEY ("gameId") REFERENCES games (id) ON DELETE CASCADE,
  CONSTRAINT fk_user FOREIGN KEY ("userId") REFERENCES users (id) ON DELETE CASCADE
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