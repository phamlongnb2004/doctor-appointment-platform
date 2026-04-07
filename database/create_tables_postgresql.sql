-- Create tables for PostgreSQL on Render
-- Run this script manually on Render PostgreSQL database

-- Drop tables if exist (careful!)
DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
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

-- Create user_sessions table
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

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_session_id ON user_sessions(session_id);
CREATE INDEX idx_user_sessions_online ON user_sessions(online);

-- Insert admin user
INSERT INTO users (email, password, first_name, last_name, phone, role, active, created_at, updated_at)
VALUES (
    'admin@doctor.com',
    '$2a$10$YourBcryptHashHere',  -- This will be replaced by DataSeeder
    'Admin',
    'System',
    '0123456789',
    'ADMIN',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;

-- Verify
SELECT * FROM users;
