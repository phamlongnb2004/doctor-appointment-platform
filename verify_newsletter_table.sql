-- Quick verification script for newsletter_subscriptions table
-- Run this on Railway MySQL to check if table exists

-- 1. Check if table exists
SELECT 
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ Table EXISTS'
        ELSE '❌ Table DOES NOT EXIST'
    END as table_status
FROM information_schema.tables 
WHERE table_schema = DATABASE() 
AND table_name = 'newsletter_subscriptions';

-- 2. If table exists, show structure
SELECT 
    COLUMN_NAME,
    COLUMN_TYPE,
    IS_NULLABLE,
    COLUMN_KEY,
    COLUMN_DEFAULT
FROM information_schema.columns
WHERE table_schema = DATABASE()
AND table_name = 'newsletter_subscriptions'
ORDER BY ORDINAL_POSITION;

-- 3. Count records
SELECT 
    COUNT(*) as total_records,
    SUM(CASE WHEN is_verified = 1 THEN 1 ELSE 0 END) as verified_count,
    SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_count
FROM newsletter_subscriptions;
