-- Debug Newsletter 404 Error
-- Run this on Railway MySQL database

-- 1. Check if newsletter_subscriptions table exists
SHOW TABLES LIKE 'newsletter_subscriptions';

-- 2. If table exists, check its structure
DESCRIBE newsletter_subscriptions;

-- 3. Check if there's any data
SELECT COUNT(*) as total_subscribers FROM newsletter_subscriptions;

-- 4. Check all tables in database
SHOW TABLES;

-- 5. If table doesn't exist, create it
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255),
    phone VARCHAR(20),
    verification_code VARCHAR(6) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified_at TIMESTAMP NULL,
    expires_at TIMESTAMP NOT NULL,
    INDEX idx_email (email),
    INDEX idx_verification_code (verification_code),
    INDEX idx_is_verified (is_verified)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Verify table was created
SHOW TABLES LIKE 'newsletter_subscriptions';

-- 7. Insert a test record
INSERT INTO newsletter_subscriptions (email, name, phone, verification_code, is_verified, expires_at)
VALUES ('test@example.com', 'Test User', '0123456789', '123456', TRUE, DATE_ADD(NOW(), INTERVAL 1 DAY))
ON DUPLICATE KEY UPDATE name = 'Test User';

-- 8. Verify test record
SELECT * FROM newsletter_subscriptions WHERE email = 'test@example.com';
