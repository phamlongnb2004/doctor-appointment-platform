-- Tạo user CONSULTANT để test hệ thống chat
-- Chạy script này trong MySQL để tạo user tư vấn

-- Tạo user tư vấn
INSERT INTO users (email, password, first_name, last_name, phone, role, created_at, updated_at, active)
VALUES (
    'consultant@doctor.com',
    '$2a$10$BtFvPdKclKnmZGZJLwITT.1h/tKU1bvaQydBRGWgqkjXi8Mxv.hIC', -- password123
    'Nguyễn',
    'Tư Vấn',
    '0987654321',
    'CONSULTANT',
    NOW(),
    NOW(),
    1
);

-- Kiểm tra user đã tạo
SELECT id, email, first_name, last_name, role FROM users WHERE role = 'CONSULTANT';