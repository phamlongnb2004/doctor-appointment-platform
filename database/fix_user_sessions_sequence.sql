-- Fix user_sessions sequence to prevent duplicate key errors
-- This script resets the sequence to the correct value based on existing data

-- Check current status
SELECT 'Current max ID in user_sessions:' as info, MAX(id) as value FROM user_sessions;
SELECT 'Current sequence value:' as info, last_value as value FROM user_sessions_id_seq;

-- Reset sequence to max ID + 1
SELECT setval('user_sessions_id_seq', COALESCE((SELECT MAX(id) FROM user_sessions), 0) + 1, false);

-- Verify the fix
SELECT 'New sequence value:' as info, last_value as value FROM user_sessions_id_seq;

-- Test if we can insert now (optional, comment out if you don't want to test)
-- INSERT INTO user_sessions (user_id, session_token, expires_at) 
-- VALUES (1, 'test-token-' || NOW()::text, NOW() + INTERVAL '1 hour');
-- SELECT 'Test insert successful' as result;
