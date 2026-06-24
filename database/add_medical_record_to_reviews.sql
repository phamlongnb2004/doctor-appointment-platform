-- Add medical_record_id column to reviews table
ALTER TABLE reviews 
ADD COLUMN IF NOT EXISTS medical_record_id BIGINT;

-- Add foreign key constraint
ALTER TABLE reviews
ADD CONSTRAINT fk_reviews_medical_record
FOREIGN KEY (medical_record_id) 
REFERENCES medical_records(id)
ON DELETE SET NULL;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_reviews_medical_record_id 
ON reviews(medical_record_id);

-- Check the result
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'reviews';
