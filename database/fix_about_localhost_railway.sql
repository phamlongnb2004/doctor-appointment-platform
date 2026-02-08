-- Fix About Page Localhost URLs on Railway
-- Run this in Railway MySQL Query tab

-- Step 1: Check current status
SELECT 
    section_key,
    CASE 
        WHEN content_json LIKE '%localhost:8080%' THEN '❌ HAS LOCALHOST'
        ELSE '✅ CLEAN'
    END as status,
    LEFT(content_json, 100) as preview
FROM about_page_content
ORDER BY section_key;

-- Step 2: Remove all localhost URLs
UPDATE about_page_content 
SET content_json = REPLACE(content_json, 'http://localhost:8080/api/images/', '')
WHERE content_json LIKE '%localhost:8080%';

-- Step 3: Verify fix
SELECT 
    section_key,
    CASE 
        WHEN content_json LIKE '%localhost%' THEN '❌ STILL HAS LOCALHOST'
        ELSE '✅ FIXED'
    END as status
FROM about_page_content
ORDER BY section_key;

-- Step 4: Show all sections data
SELECT section_key, content_json 
FROM about_page_content 
ORDER BY section_key;
