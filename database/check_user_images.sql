-- Kiểm tra ảnh profile và cover của users
SELECT 
    id,
    email,
    CONCAT(firstName, ' ', lastName) as fullName,
    role,
    profileImage,
    coverImage,
    CASE 
        WHEN profileImage IS NOT NULL THEN 'Có ảnh profile'
        ELSE 'Chưa có ảnh profile'
    END as profile_status,
    CASE 
        WHEN coverImage IS NOT NULL THEN 'Có ảnh cover'
        ELSE 'Chưa có ảnh cover'
    END as cover_status
FROM users
WHERE profileImage IS NOT NULL OR coverImage IS NOT NULL
ORDER BY id DESC;

-- Đếm số users có ảnh
SELECT 
    COUNT(*) as total_users,
    COUNT(profileImage) as users_with_profile_image,
    COUNT(coverImage) as users_with_cover_image
FROM users;
