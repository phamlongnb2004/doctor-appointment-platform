-- Remove unused fields from medical_services table
ALTER TABLE medical_services 
DROP COLUMN button_text,
DROP COLUMN button_url,
DROP COLUMN color;
