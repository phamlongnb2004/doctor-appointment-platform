# Fix CONSULTANT Role Promotion Issue

## Vấn đề
- Admin không thể promote user lên role CONSULTANT
- Lỗi 500 khi gọi API promote với role=CONSULTANT
- Backend log hiển thị: "SQL Error: 1265, SQLState: 01000 - Data truncated for column 'role' at row 1"

## Nguyên nhân
Cột `role` trong bảng `users` được định nghĩa là ENUM chỉ có 3 giá trị:
```sql
role enum('ADMIN','DOCTOR','PATIENT')
```

Không có giá trị `CONSULTANT` trong ENUM, nên khi cố gắng insert/update với giá trị này sẽ bị lỗi.

## Giải pháp
1. **Cập nhật ENUM trong database:**
```sql
ALTER TABLE users MODIFY COLUMN role ENUM('ADMIN','DOCTOR','PATIENT','CONSULTANT') NOT NULL;
```

2. **Cập nhật file setup.sql để tránh vấn đề trong tương lai:**
```sql
role ENUM('ADMIN','DOCTOR','PATIENT','CONSULTANT') NOT NULL,
```

3. **Thêm user CONSULTANT mẫu:**
```sql
INSERT INTO users (email, password, first_name, last_name, phone, role, created_at, updated_at, active)
VALUES ('consultant@doctor.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Nguyen Van', 'Consultant', '0911222333', 'CONSULTANT', NOW(), NOW(), TRUE);
```

## Kết quả
- ✅ DOCTOR promotion: Hoạt động bình thường
- ✅ CONSULTANT promotion: Đã sửa và hoạt động bình thường
- ✅ Frontend buttons: Hoạt động với cả hai chức năng
- ✅ Database: Đã có đầy đủ 4 roles: ADMIN, DOCTOR, PATIENT, CONSULTANT

## Test accounts
- Admin: admin@doctor.com / password123
- Doctor: doctor@doctor.com / password123  
- Patient: patient@doctor.com / password123
- Consultant: consultant@doctor.com / password123

## API Endpoints
- Promote to DOCTOR: `POST /api/users/{userId}/promote?secret=mySuperSecretAdminKey2026&role=DOCTOR`
- Promote to CONSULTANT: `POST /api/users/{userId}/promote?secret=mySuperSecretAdminKey2026&role=CONSULTANT`

## Chat System Permissions
- Admin: Có thể chat với tất cả
- Consultant: Có thể chat với Patient và Doctor
- Doctor: Có thể chat với Patient và Consultant  
- Patient: Có thể chat với Doctor và Consultant