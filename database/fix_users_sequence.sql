-- Fix users table sequence to prevent duplicate key errors
-- This ensures the sequence is set to the next available ID

-- Get the current max ID and set sequence accordingly
SELECT setval('users_id_seq', (SELECT COALESCE(MAX(id), 0) + 1 FROM users), false);

-- Verify the fix
SELECT 'Current max ID in users:' as info, MAX(id) as value FROM users
UNION ALL
SELECT 'Sequence next value:' as info, last_value as value FROM users_id_seq;
