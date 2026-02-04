-- Check and Fix Vietnamese Data Encoding Issues
-- This script helps identify and fix encoding problems

-- 1. Check current data in news_articles
SELECT 
    id,
    title,
    excerpt,
    author,
    HEX(title) as title_hex,
    CHAR_LENGTH(title) as title_length,
    LENGTH(title) as title_bytes
FROM news_articles
LIMIT 5;

-- 2. Check users table
SELECT 
    id,
    first_name,
    last_name,
    email,
    HEX(first_name) as first_name_hex
FROM users
LIMIT 5;

-- 3. Check services table
SELECT 
    id,
    title,
    description,
    HEX(title) as title_hex
FROM services
LIMIT 5;

-- 4. Check home_page_content table
SELECT 
    id,
    section_key,
    title,
    content,
    HEX(title) as title_hex
FROM home_page_content
LIMIT 5;

-- 5. Show table character sets
SELECT 
    TABLE_NAME,
    CCSA.CHARACTER_SET_NAME,
    CCSA.COLLATION_NAME
FROM 
    information_schema.TABLES T,
    information_schema.COLLATION_CHARACTER_SET_APPLICABILITY CCSA
WHERE 
    CCSA.COLLATION_NAME = T.TABLE_COLLATION
    AND T.TABLE_SCHEMA = 'doctor_appointment_db'
ORDER BY TABLE_NAME;

-- 6. Show column character sets for news_articles
SELECT 
    COLUMN_NAME,
    CHARACTER_SET_NAME,
    COLLATION_NAME,
    COLUMN_TYPE
FROM 
    information_schema.COLUMNS
WHERE 
    TABLE_SCHEMA = 'doctor_appointment_db'
    AND TABLE_NAME = 'news_articles'
    AND DATA_TYPE IN ('varchar', 'text', 'longtext', 'mediumtext', 'tinytext');
