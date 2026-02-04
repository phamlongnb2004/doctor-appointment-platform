-- Add URL column to specialties table
ALTER TABLE specialties 
ADD COLUMN url VARCHAR(500) AFTER icon;

-- Update existing specialties with default URLs
UPDATE specialties SET url = '/doctors' WHERE url IS NULL;
