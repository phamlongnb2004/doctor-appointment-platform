-- Fix localhost URLs in about_page_content
-- Replace localhost:8080 with production URL or Cloudinary

-- Check current URLs
SELECT section_key, content_json FROM about_page_content WHERE content_json LIKE '%localhost:8080%';

-- Update achievements background image (example from your log)
UPDATE about_page_content 
SET content_json = REPLACE(content_json, 'http://localhost:8080/api/images/', 'https://res.cloudinary.com/dms0oco5w/image/upload/v1/uploads/')
WHERE section_key = 'achievements';

-- Update all sections with localhost URLs
UPDATE about_page_content 
SET content_json = REPLACE(content_json, 'http://localhost:8080/api/images/', 'https://res.cloudinary.com/dms0oco5w/image/upload/v1/uploads/')
WHERE content_json LIKE '%localhost:8080%';

-- Verify fix
SELECT section_key, content_json FROM about_page_content WHERE content_json LIKE '%localhost%';
