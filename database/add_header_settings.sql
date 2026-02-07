-- Add header settings columns to site_settings table
ALTER TABLE site_settings 
ADD COLUMN header_background_color VARCHAR(20) DEFAULT '#ffffff',
ADD COLUMN header_text_color VARCHAR(20) DEFAULT '#1e293b',
ADD COLUMN header_height INT DEFAULT 80,
ADD COLUMN header_font_family VARCHAR(100) DEFAULT 'Inter, sans-serif',
ADD COLUMN header_font_size INT DEFAULT 14,
ADD COLUMN header_logo_height INT DEFAULT 50;

-- Update existing record with default values
UPDATE site_settings 
SET 
    header_background_color = '#ffffff',
    header_text_color = '#1e293b',
    header_height = 80,
    header_font_family = 'Inter, sans-serif',
    header_font_size = 14,
    header_logo_height = 50
WHERE id = 1;
