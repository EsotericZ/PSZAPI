DROP DATABASE IF EXISTS psz_db;
CREATE DATABASE psz_db;

\c psz_db;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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