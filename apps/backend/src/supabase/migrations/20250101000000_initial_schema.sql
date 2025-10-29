-- Create Role enum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'APPLICANT', 'STANDARD');

-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  role "Role" NOT NULL DEFAULT 'STANDARD'
);

-- Create nominations table
CREATE TABLE nominations (
  id SERIAL PRIMARY KEY,
  college TEXT,
  constituency TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email TEXT,
  "fullName" TEXT,
  "graduationYear" INTEGER,
  major TEXT,
  nominee TEXT,
  "receiveSenatorInfo" BOOLEAN,
  status TEXT NOT NULL
);

-- Create applications table
CREATE TABLE applications (
  id SERIAL PRIMARY KEY,
  college TEXT NOT NULL,
  constituency TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email TEXT NOT NULL,
  "fullName" TEXT NOT NULL,
  major TEXT NOT NULL,
  minors TEXT NOT NULL,
  nickname TEXT NOT NULL,
  nuid TEXT NOT NULL,
  "phoneNumber" TEXT NOT NULL,
  "phoneticPronunciation" TEXT NOT NULL,
  "preferredFullName" TEXT NOT NULL,
  pronouns TEXT NOT NULL,
  year INTEGER NOT NULL,
  semester TEXT NOT NULL
);

-- Add indexes for common queries
CREATE INDEX idx_nominations_email ON nominations(email);
CREATE INDEX idx_nominations_nominee ON nominations(nominee);
CREATE INDEX idx_applications_nuid ON applications(nuid);
CREATE INDEX idx_applications_email ON applications(email);