-- Create quick_bookings table for fast appointment booking from homepage

CREATE TABLE IF NOT EXISTS quick_bookings (
    id BIGSERIAL PRIMARY KEY,
    patient_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    specialty VARCHAR(255) NOT NULL,
    symptoms TEXT,
    preferred_date TIMESTAMP NOT NULL,
    preferred_time VARCHAR(20) NOT NULL CHECK (preferred_time IN ('MORNING', 'AFTERNOON', 'EVENING')),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ASSIGNED', 'CONVERTED', 'CANCELLED')),
    admin_notes TEXT,
    assigned_doctor_id BIGINT REFERENCES doctors(id),
    converted_appointment_id BIGINT REFERENCES appointments(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    converted_at TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quick_bookings_status ON quick_bookings(status);
CREATE INDEX IF NOT EXISTS idx_quick_bookings_assigned_doctor ON quick_bookings(assigned_doctor_id);
CREATE INDEX IF NOT EXISTS idx_quick_bookings_created_at ON quick_bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quick_bookings_phone ON quick_bookings(phone_number);
CREATE INDEX IF NOT EXISTS idx_quick_bookings_email ON quick_bookings(email);

-- Add comments
COMMENT ON TABLE quick_bookings IS 'Bảng lưu trữ các yêu cầu đặt lịch nhanh từ trang chủ';
COMMENT ON COLUMN quick_bookings.preferred_time IS 'Thời gian mong muốn: MORNING (Sáng), AFTERNOON (Chiều), EVENING (Tối)';
COMMENT ON COLUMN quick_bookings.status IS 'Trạng thái: PENDING (Chờ xử lý), ASSIGNED (Đã phân công), CONVERTED (Đã chuyển đổi), CANCELLED (Đã hủy)';
