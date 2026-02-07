-- Kiểm tra table newsletter_subscriptions có tồn tại không
SHOW TABLES LIKE 'newsletter_subscriptions';

-- Nếu table tồn tại, xem cấu trúc
DESCRIBE newsletter_subscriptions;

-- Xem số lượng records
SELECT COUNT(*) as total_records FROM newsletter_subscriptions;

-- Xem 5 records mới nhất (nếu có)
SELECT * FROM newsletter_subscriptions ORDER BY created_at DESC LIMIT 5;
