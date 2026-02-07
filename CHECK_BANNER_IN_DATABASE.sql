-- Kiểm tra banner mới nhất trong database
SELECT 
    id,
    imageUrl,
    page,
    displayOrder,
    isActive,
    createdAt
FROM banners 
ORDER BY id DESC 
LIMIT 5;

-- Kiểm tra banner có Cloudinary URL
SELECT 
    id,
    imageUrl,
    page,
    displayOrder,
    isActive
FROM banners 
WHERE imageUrl LIKE '%cloudinary%'
ORDER BY id DESC;

-- Đếm tổng số banner
SELECT 
    page,
    COUNT(*) as total,
    SUM(CASE WHEN isActive = 1 THEN 1 ELSE 0 END) as active_count
FROM banners 
GROUP BY page;
