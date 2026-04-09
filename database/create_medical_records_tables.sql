-- Create medical_records table
CREATE TABLE IF NOT EXISTS medical_records (
    id BIGSERIAL PRIMARY KEY,
    appointment_id BIGINT NOT NULL UNIQUE,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    chief_complaint TEXT,
    symptoms TEXT,
    diagnosis TEXT,
    treatment TEXT,
    prescription TEXT,
    notes TEXT,
    vital_signs TEXT,
    follow_up_instructions TEXT,
    examination_start_time TIMESTAMP NOT NULL,
    examination_end_time TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);

-- Create medical_record_attachments table
CREATE TABLE IF NOT EXISTS medical_record_attachments (
    id BIGSERIAL PRIMARY KEY,
    medical_record_id BIGINT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_size BIGINT,
    description TEXT,
    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (medical_record_id) REFERENCES medical_records(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_medical_records_appointment ON medical_records(appointment_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_patient ON medical_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_doctor ON medical_records(doctor_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_created_at ON medical_records(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_medical_record_attachments_record ON medical_record_attachments(medical_record_id);

-- Add comments for documentation
COMMENT ON TABLE medical_records IS 'Stores medical examination records for appointments';
COMMENT ON TABLE medical_record_attachments IS 'Stores file attachments (images, PDFs, etc.) for medical records';
COMMENT ON COLUMN medical_records.chief_complaint IS 'Main reason for the visit';
COMMENT ON COLUMN medical_records.symptoms IS 'Patient symptoms description';
COMMENT ON COLUMN medical_records.diagnosis IS 'Doctor diagnosis';
COMMENT ON COLUMN medical_records.treatment IS 'Treatment plan';
COMMENT ON COLUMN medical_records.prescription IS 'Prescribed medications';
COMMENT ON COLUMN medical_records.vital_signs IS 'Vital signs in JSON format (blood pressure, temperature, heart rate, etc.)';
COMMENT ON COLUMN medical_records.follow_up_instructions IS 'Instructions for follow-up care';
