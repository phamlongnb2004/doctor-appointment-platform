-- Fix localhost URLs in about_page_content to use Cloudinary
-- This script removes localhost URLs so you can re-upload images via CMS

-- 1. Check current data with localhost URLs
SELECT section_key, 
       SUBSTRING(content_json, 1, 200) as preview
FROM about_page_content 
WHERE content_json LIKE '%localhost:8080%';

-- 2. OPTION A: Remove localhost URLs (recommended - then re-upload via CMS)
-- This will set imageUrl/backgroundImage to empty string, forcing you to re-upload

-- For achievements section - remove localhost backgroundImage
UPDATE about_page_content 
SET content_json = JSON_SET(
    content_json,
    '$[0].backgroundImage', ''
)
WHERE section_key = 'achievements' 
  AND JSON_EXTRACT(content_json, '$[0].backgroundImage') LIKE '%localhost:8080%';

-- For mission section - remove localhost imageUrl
UPDATE about_page_content 
SET content_json = JSON_SET(
    content_json,
    '$.imageUrl', ''
)
WHERE section_key = 'mission' 
  AND JSON_EXTRACT(content_json, '$.imageUrl') LIKE '%localhost:8080%';

-- For hero section - remove localhost backgroundImage
UPDATE about_page_content 
SET content_json = JSON_SET(
    content_json,
    '$.backgroundImage', ''
)
WHERE section_key = 'hero' 
  AND JSON_EXTRACT(content_json, '$.backgroundImage') LIKE '%localhost:8080%';

-- For team section - remove localhost avatarUrl from each team member
-- Note: This is more complex, you may need to re-upload team avatars via CMS

-- 3. Verify - should show no localhost URLs
SELECT section_key, 
       CASE 
         WHEN content_json LIKE '%localhost%' THEN 'STILL HAS LOCALHOST'
         ELSE 'CLEAN'
       END as status,
       SUBSTRING(content_json, 1, 200) as preview
FROM about_page_content;

-- 4. After running this script:
--    - Go to Admin CMS → About Page
--    - Re-upload images for sections that had localhost URLs
--    - The new uploads will use Cloudinary URLs automatically
