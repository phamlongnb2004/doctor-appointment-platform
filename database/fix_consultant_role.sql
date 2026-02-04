-- Fix CONSULTANT role issue
-- The role column might have an ENUM constraint that doesn't include CONSULTANT

USE doctor_appointment_db;

-- Check current role column definition
DESCRIBE users;

-- If role is an ENUM, we need to alter it to include CONSULTANT
-- First, let's change it to VARCHAR to be safe
ALTER TABLE users MODIFY COLUMN role VARCHAR(50) NOT NULL;

-- Verify the change
DESCRIBE users;

-- Test inserting a CONSULTANT user
INSERT INTO users (email, password, first_name, last_name, phone, role, created_at, updated_at, active)
VALUES ('test_consultant@doctor.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Test', 'Consultant', '0999888777', 'CONSULTANT', NOW(), NOW(), TRUE)
ON DUPLICATE KEY UPDATE role = 'CONSULTANT';

SELECT 'CONSULTANT role fix completed!' as status;