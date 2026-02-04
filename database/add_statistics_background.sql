-- Add backgroundImage column to statistics table
ALTER TABLE statistics ADD COLUMN background_image VARCHAR(500) AFTER icon_class;

-- Update existing statistics with a default background (optional)
-- You can leave it NULL and upload via CMS
