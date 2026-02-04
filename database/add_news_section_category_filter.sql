-- Add category_filter column to news_sections table
-- Store as JSON array to support multiple categories
ALTER TABLE news_sections 
ADD COLUMN category_filter TEXT NULL COMMENT 'Lọc tin tức theo danh mục - JSON array (NULL = tất cả danh mục)';

-- Update existing sections with default values (JSON format)
UPDATE news_sections SET category_filter = NULL WHERE name = 'featured';
UPDATE news_sections SET category_filter = '["Y khoa MEDLATEC"]' WHERE name = 'medlatec';
UPDATE news_sections SET category_filter = '["Sức khỏe"]' WHERE name = 'health';
UPDATE news_sections SET category_filter = '["Chuyên đề y học"]' WHERE name = 'medical-topics';
