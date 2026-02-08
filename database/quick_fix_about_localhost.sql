-- Quick fix: Remove all localhost URLs from about_page_content
-- After running this, re-upload images via CMS

-- Show what will be fixed
SELECT 
    section_key,
    CASE 
        WHEN content_json LIKE '%localhost:8080%' THEN 'NEEDS FIX'
        ELSE 'OK'
    END as status
FROM about_page_content;

-- Remove all localhost URLs
UPDATE about_page_content 
SET content_json = REPLACE(content_json, 'http://localhost:8080/api/images/', '')
WHERE content_json LIKE '%localhost:8080%';

-- Verify - should show all OK
SELECT 
    section_key,
    CASE 
        WHEN content_json LIKE '%localhost%' THEN 'STILL HAS LOCALHOST'
        ELSE 'FIXED'
    END as status
FROM about_page_content;

-- Now go to Admin CMS → About Page and re-upload images
