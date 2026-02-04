-- Add category column to news_articles table
ALTER TABLE news_articles 
ADD COLUMN category VARCHAR(100) DEFAULT 'Tin tức y khoa' AFTER slug;

-- Update existing articles with default category
UPDATE news_articles 
SET category = 'Tin tức y khoa' 
WHERE category IS NULL;

-- Add some sample categories
UPDATE news_articles 
SET category = 'Sức khỏe tổng quát' 
WHERE id % 3 = 0;

UPDATE news_articles 
SET category = 'Dinh dưỡng' 
WHERE id % 3 = 1;

UPDATE news_articles 
SET category = 'Chuyên khoa' 
WHERE id % 3 = 2;

-- Show result
SELECT id, title, category, author, published_at 
FROM news_articles 
ORDER BY published_at DESC 
LIMIT 10;
