-- Thêm cột doctor_id và status vào bảng news_articles

-- Thêm cột doctor_id (foreign key đến bảng doctors)
ALTER TABLE news_articles 
ADD COLUMN doctor_id BIGINT NULL AFTER author,
ADD CONSTRAINT fk_news_articles_doctor 
FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE SET NULL;

-- Thêm cột status (PENDING, APPROVED, REJECTED)
ALTER TABLE news_articles 
ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'PENDING' AFTER is_featured;

-- Cập nhật các bài viết hiện tại thành APPROVED
UPDATE news_articles SET status = 'APPROVED' WHERE status = 'PENDING';

-- Tạo index cho doctor_id và status để tăng tốc query
CREATE INDEX idx_news_articles_doctor_id ON news_articles(doctor_id);
CREATE INDEX idx_news_articles_status ON news_articles(status);
