-- Create tables for PostgreSQL on Render
-- Run this script manually on Render PostgreSQL database
-- This creates ONLY the essential tables needed for login

-- Drop tables if exist (in correct order - child tables first)
DROP TABLE IF EXISTS doctors CASCADE;
DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table FIRST (no dependencies)
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    role VARCHAR(50) NOT NULL,
    profile_image TEXT,
    cover_image TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_sessions table (depends on users)
CREATE TABLE user_sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    session_id VARCHAR(255) NOT NULL UNIQUE,
    login_time TIMESTAMP NOT NULL,
    last_activity_time TIMESTAMP NOT NULL,
    online BOOLEAN DEFAULT true,
    ip_address VARCHAR(100),
    user_agent TEXT
);

-- Create doctors table (depends on users)
CREATE TABLE doctors (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    specialization VARCHAR(255),
    license_number VARCHAR(100),
    biography TEXT,
    consultation_fee INTEGER DEFAULT 0,
    experience_years INTEGER DEFAULT 0,
    rating_score DOUBLE PRECISION DEFAULT 0.0,
    review_count INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_session_id ON user_sessions(session_id);
CREATE INDEX idx_user_sessions_online ON user_sessions(online);
CREATE INDEX idx_doctors_user_id ON doctors(user_id);

-- Insert admin user with BCrypt hash for "password123"
-- BCrypt hash generated: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
INSERT INTO users (email, password, first_name, last_name, phone, role, active, created_at, updated_at)
VALUES (
    'admin@doctor.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'Admin',
    'System',
    '0123456789',
    'ADMIN',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;

-- Verify
SELECT id, email, role, first_name, last_name FROM users;

COMMIT;
