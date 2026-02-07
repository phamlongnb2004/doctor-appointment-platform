-- Thêm cột quantity vào bảng medical_services
ALTER TABLE medical_services 
ADD COLUMN quantity INT DEFAULT 0 AFTER discount_percentage;

-- Update một số dịch vụ có số lượng
UPDATE medical_services SET quantity = 262 WHERE id = 1;
UPDATE medical_services SET quantity = 150 WHERE id = 2;
UPDATE medical_services SET quantity = 89 WHERE id = 3;
UPDATE medical_services SET quantity = 120 WHERE id = 4;
UPDATE medical_services SET quantity = 95 WHERE id = 5;
