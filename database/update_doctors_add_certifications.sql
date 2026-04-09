-- Add new columns to doctors table
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS qualifications TEXT;
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS clinic_address TEXT;

-- Create doctor_certifications table
CREATE TABLE IF NOT EXISTS doctor_certifications (
    id BIGSERIAL PRIMARY KEY,
    doctor_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    title VARCHAR(255),
    description TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_doctor_certifications_doctor_id ON doctor_certifications(doctor_id);
CREATE INDEX IF NOT EXISTS idx_doctor_certifications_display_order ON doctor_certifications(doctor_id, display_order);
