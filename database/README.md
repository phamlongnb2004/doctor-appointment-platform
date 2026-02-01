# Cài đặt MySQL cho Doctor Appointment Platform

## Yêu cầu
- MySQL 8.0+ đã cài đặt và đang chạy
- Mở Command Prompt / PowerShell để chạy lệnh

---

## Cách 1: Dùng tài khoản root (đơn giản nhất)

### Bước 1: Đăng nhập MySQL
```bash
mysql -u root -p
```
Nhập mật khẩu root khi được hỏi.

### Bước 2: Chạy lệnh tạo database
```sql
CREATE DATABASE IF NOT EXISTS doctor_appointment_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

### Bước 3: Sửa mật khẩu trong application.yml
Mở `backend/src/main/resources/application.yml` và sửa dòng **password** cho đúng với mật khẩu MySQL của bạn:
```yaml
spring:
  datasource:
    username: root
    password: <MẬT_KHẨU_ROOT_CỦA_BẠN>   # Sửa ở đây
```

---

## Cách 2: Chạy script setup.sql

### Bước 1: Chạy script
Trong thư mục dự án `doctor-appointment-platform`:
```bash
mysql -u root -p < database/setup.sql
```

Hoặc mở MySQL shell rồi chạy:
```bash
mysql -u root -p
```
```sql
source d:/DoAn/doctor-appointment-platform/database/setup.sql
```

### Bước 2: Sửa application.yml
Đảm bảo mật khẩu trong `backend/src/main/resources/application.yml` khớp với MySQL của bạn.

---

## Lưu ý

- **MySQL phải đang chạy** trước khi start backend
- Các bảng (users, doctors, appointments...) **tự động tạo** khi chạy Spring Boot lần đầu
- Nếu lỗi "Access denied": kiểm tra username/password trong application.yml
- Trên Windows: mật khẩu root mặc định có thể để trống hoặc là "root"
