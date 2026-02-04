-- Fix Service icon_class column to be nullable
-- This allows using image_url instead of icon_class

USE doctor_appointment_db;

-- Make icon_class nullable
ALTER TABLE services 
MODIFY COLUMN icon_class VARCHAR(255) NULL;

-- Update existing records with null icon_class to empty string (optional)
UPDATE services 
SET icon_class = '' 
WHERE icon_class IS NULL;

SELECT 'Service icon_class column is now nullable!' as status;
