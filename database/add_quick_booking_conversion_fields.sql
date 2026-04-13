-- Thêm các trường mới vào bảng quick_bookings để hỗ trợ chuyển đổi sang appointment
-- KHÔNG ảnh hưởng đến bảng khác

-- Thêm trường confirmed_date: Ngày cụ thể admin set
ALTER TABLE quick_bookings ADD COLUMN confirmed_date DATE;

-- Thêm trường confirmed_time: Giờ cụ thể admin set (thay vì chỉ có time slot)
ALTER TABLE quick_bookings ADD COLUMN confirmed_time TIME;

-- Thêm trường appointment_id: ID của appointment được tạo ra sau khi bác sĩ confirm
ALTER TABLE quick_bookings ADD COLUMN appointment_id BIGINT;

-- Thêm trường converted_at: Thời điểm chuyển đổi thành appointment
ALTER TABLE quick_bookings ADD COLUMN converted_at TIMESTAMP;

-- Thêm foreign key constraint (optional, để đảm bảo data integrity)
-- ALTER TABLE quick_bookings ADD CONSTRAINT fk_quick_booking_appointment 
--     FOREIGN KEY (appointment_id) REFERENCES appointments(id);

-- Thêm index để tăng performance khi query
CREATE INDEX idx_quick_bookings_appointment_id ON quick_bookings(appointment_id);
CREATE INDEX idx_quick_bookings_confirmed_date ON quick_bookings(confirmed_date);
