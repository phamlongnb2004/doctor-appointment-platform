-- Add text_color column to statistics table
ALTER TABLE statistics ADD COLUMN text_color VARCHAR(20) DEFAULT '#FFFFFF' AFTER color;

-- Update existing records to have white text color
UPDATE statistics SET text_color = '#FFFFFF' WHERE text_color IS NULL;
