-- Check user profile images
SELECT 
    id,
    email,
    first_name,
    last_name,
    role,
    profile_image,
    cover_image
FROM users
WHERE role = 'ADMIN'
ORDER BY id;

-- Check if profile_image column exists and its data
SELECT 
    id,
    email,
    profile_image,
    CASE 
        WHEN profile_image IS NULL THEN 'NULL'
        WHEN profile_image = '' THEN 'EMPTY STRING'
        ELSE 'HAS VALUE'
    END as image_status
FROM users
WHERE id = (SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1);
