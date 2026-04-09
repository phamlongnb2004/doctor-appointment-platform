-- Script to remove qualifications column from doctors table
-- Run this on Render PostgreSQL database

-- Drop the qualifications column
ALTER TABLE doctors DROP COLUMN IF EXISTS qualifications;

-- Verify the column has been removed
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'doctors' 
ORDER BY ordinal_position;
