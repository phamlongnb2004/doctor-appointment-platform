-- Add layout_type column to news_sections table
ALTER TABLE news_sections 
ADD COLUMN layout_type VARCHAR(50) DEFAULT 'default' AFTER title;

-- Update existing sections
-- 'default' = 1 large + 4 small (current layout)
-- 'grid' = 4 columns grid layout (medical news style)

UPDATE news_sections 
SET layout_type = 'default' 
WHERE layout_type IS NULL;

-- Example: Set medical news section to grid layout
-- UPDATE news_sections SET layout_type = 'grid' WHERE name = 'medical';
