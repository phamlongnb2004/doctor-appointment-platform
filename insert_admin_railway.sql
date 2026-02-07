-- Insert Admin account to Railway MySQL
-- Password: password123 (hashed with BCrypt)

-- Check if admin exists first
DELETE FROM users WHERE email = 'admin@doctor.com';

-- Insert admin user
INSERT INTO users (
    email, 
    password, 
    first_name,
    last_name,
    phone, 
    role, 
    active,
    created_at,
    updated_at
) VALUES (
    'admin@doctor.com',
    '$2a$10$IHtBv/EYbgxrqkPX4.ZSk.ttvKLTVVBm4BnwYrls3wmkVyzCK5oXi',
    'Admin',
    'System',
    '0123456789',
    'ADMIN',
    1,
    NOW(),
    NOW()
);

-- Verify
SELECT id, email, first_name, last_name, role, active FROM users WHERE role = 'ADMIN';
