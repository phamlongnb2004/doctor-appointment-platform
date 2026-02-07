-- Add gallery images field to medical_services table
-- This allows storing multiple images as JSON array

ALTER TABLE medical_services 
ADD COLUMN gallery_images TEXT COMMENT 'JSON array of image URLs for gallery';

-- Example data format: ["url1", "url2", "url3"]
