-- Add page field to news_sections table
-- This allows sections to be displayed on specific pages (home, news, or both)

ALTER TABLE news_sections 
ADD COLUMN page VARCHAR(50) DEFAULT 'both' COMMENT 'Page where section is displayed: home, news, or both';

-- Update existing sections
-- Set 'medlatec' section to show on home page only
UPDATE news_sections SET page = 'home' WHERE name = 'medlatec';

-- Set other sections to show on news page only
UPDATE news_sections SET page = 'news' WHERE name IN ('featured', 'health', 'medical-topics');
