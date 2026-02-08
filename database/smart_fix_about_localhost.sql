-- Smart fix: Convert localhost URLs to Cloudinary URLs
-- This assumes images were already uploaded to Cloudinary with same filename

-- Check what needs to be fixed
SELECT 
    section_key,
    content_json
FROM about_page_content 
WHERE content_json LIKE '%localhost:8080%';

-- MANUAL FIX APPROACH:
-- Since we can't automatically know the Cloudinary URLs, 
-- the best approach is to:
-- 1. Clear the localhost URLs
-- 2. Re-upload via CMS (which will use Cloudinary)

-- Clear localhost URLs from achievements backgroundImage
UPDATE about_page_content 
SET content_json = REPLACE(
    content_json,
    'http://localhost:8080/api/images/articles/3af35edf-996a-4916-a378-4cdcd7c14f90.webp',
    ''
)
WHERE section_key = 'achievements';

-- Clear any other localhost URLs
UPDATE about_page_content 
SET content_json = REPLACE(content_json, 'http://localhost:8080/api/images/', '')
WHERE content_json LIKE '%localhost:8080%';

-- Verify
SELECT 
    section_key,
    CASE 
        WHEN content_json LIKE '%localhost%' THEN 'HAS LOCALHOST'
        ELSE 'CLEAN'
    END as status
FROM about_page_content;
