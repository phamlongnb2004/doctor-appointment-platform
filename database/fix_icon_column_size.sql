-- Fix icon column size for all tables
-- The icon column is too short to store image URLs
-- Change from VARCHAR(255) to TEXT to support long URLs

USE doctor_appointment_db;

-- Features table
ALTER TABLE features MODIFY COLUMN icon TEXT;

-- Specialties table  
ALTER TABLE specialties MODIFY COLUMN icon TEXT;

-- Statistics table
ALTER TABLE statistics MODIFY COLUMN icon TEXT;

-- Certifications table
ALTER TABLE certifications MODIFY COLUMN icon TEXT;

-- Verify changes
DESCRIBE features;
DESCRIBE specialties;
DESCRIBE statistics;
DESCRIBE certifications;
