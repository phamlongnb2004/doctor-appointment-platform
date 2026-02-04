-- Add statistics section background image to site_settings table
ALTER TABLE site_settings ADD COLUMN statistics_background_image VARCHAR(500) AFTER address;

-- Optional: Set a default value
-- UPDATE site_settings SET statistics_background_image = '' WHERE id = 1;
