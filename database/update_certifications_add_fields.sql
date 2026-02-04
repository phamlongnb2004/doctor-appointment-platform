-- Add imageUrl column to certifications table
ALTER TABLE certifications 
ADD COLUMN image_url VARCHAR(500);

-- Update existing records with sample data
UPDATE certifications SET description = 'Tiêu chuẩn quốc gia về chất lượng phòng xét nghiệm' WHERE id = 1;
UPDATE certifications SET description = 'Chứng nhận từ tổ chức CAP về tiêu chuẩn phòng xét nghiệm' WHERE id = 2;
UPDATE certifications SET description = 'Công nhận từ Bộ Y tế Việt Nam' WHERE id = 3;
UPDATE certifications SET description = 'Xếp hạng trong top 10 bệnh viện tốt nhất Việt Nam' WHERE id = 4;
UPDATE certifications SET description = 'Tiêu chuẩn quốc tế về chất lượng bệnh viện' WHERE id = 5;
UPDATE certifications SET description = 'Chứng nhận từ tổ chức NABL về năng lực thử nghiệm' WHERE id = 6;
