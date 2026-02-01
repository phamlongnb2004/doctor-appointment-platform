# Doctor Appointment Platform

Ứng dụng đặt lịch khám bệnh trực tuyến được xây dựng bằng **Spring Boot**, **ReactJS**, và **MySQL**.

## 📋 Cấu trúc dự án

```
doctor-appointment-platform/
├── backend/                      # Spring Boot Backend
│   ├── src/main/java/
│   │   └── com/doctorappointment/
│   │       ├── model/            # JPA Entities
│   │       ├── repository/        # Database Access Layer
│   │       ├── service/          # Business Logic
│   │       ├── controller/       # REST API Endpoints
│   │       └── config/           # Configuration Classes
│   ├── src/main/resources/
│   │   └── application.yml       # Database Configuration
│   └── pom.xml                   # Maven Dependencies
│
└── frontend/                     # ReactJS Frontend
    ├── src/
│   ├── pages/               # Page Components
│   ├── components/          # Reusable Components
│   ├── services/            # API Service
│   ├── styles/              # CSS Styles
│   │   ├── variables.css    # CSS Variables (colors, spacing)
│   │   ├── global.css       # Base/Global styles
│   │   ├── layout.css       # Layout styles
│   │   ├── components.css   # Component styles
│   │   ├── pages.css        # Page-specific styles
│   │   └── index.css        # Main entry (imports all)
│   └── App.js               # Main App Component
    ├── public/
    │   └── index.html           # HTML Template
    └── package.json             # NPM Dependencies
```

## 🛠️ Công nghệ sử dụng

### Backend
- **Spring Boot 3.1.5** - Framework Java
- **Spring Data JPA** - ORM
- **MySQL 8.0** - Database
- **Spring Security** - Authentication & Authorization
- **JWT** - Token-based Authentication (Optional)
- **Lombok** - Code Generation

### Frontend
- **React 18** - UI Library
- **React Router** - Navigation
- **Ant Design** - UI Components
- **Axios** - HTTP Client

## 📦 Cài đặt

### Yêu cầu
- Java 17+
- Node.js 16+
- MySQL 8.0+

### Backend Setup

1. **Cài đặt MySQL Database**
```bash
mysql -u root -p
CREATE DATABASE doctor_appointment_db;
USE doctor_appointment_db;
```

2. **Cấu hình application.yml**

Sửa file `backend/src/main/resources/application.yml` (mặc định: username=root, password=root):
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/doctor_appointment_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
    username: root
    password: <your-password>
```

3. **Chạy Backend**
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend chạy ở: `http://localhost:8080/api`

**Lưu ý:** Lần đầu chạy, hệ thống sẽ tự động seed dữ liệu mẫu (3 bác sĩ):
- doctor1@hospital.com / password123 (Cardiology)
- doctor2@hospital.com / password123 (Dermatology)
- doctor3@hospital.com / password123 (General Medicine)

### Frontend Setup

1. **Cài đặt Dependencies**
```bash
cd frontend
npm install
```

2. **Chạy Frontend**
```bash
npm start
```

Frontend chạy ở: `http://localhost:3000`

### Chạy dự án hoàn chỉnh

1. Đảm bảo MySQL đang chạy và đã tạo database
2. Khởi động backend: `cd backend && mvn spring-boot:run`
3. Khởi động frontend: `cd frontend && npm start`
4. Đăng ký tài khoản mới tại `/register` hoặc dùng tài khoản bác sĩ mẫu để đăng nhập
5. Đặt lịch hẹn tại `/appointments`

## 📚 API Endpoints

### User API
- `POST /api/users/register` - Đăng ký user mới
- `POST /api/users/login` - Đăng nhập
- `GET /api/users/{id}` - Lấy thông tin user
- `PUT /api/users/{id}` - Cập nhật user
- `GET /api/users` - Danh sách user

### Doctor API
- `GET /api/doctors` - Danh sách bác sĩ
- `GET /api/doctors/{id}` - Chi tiết bác sĩ
- `GET /api/doctors/active/all` - Danh sách bác sĩ hoạt động
- `GET /api/doctors/specialization/{spec}` - Tìm bác sĩ theo chuyên khoa
- `POST /api/doctors` - Tạo bác sĩ mới
- `PUT /api/doctors/{id}` - Cập nhật bác sĩ
- `DELETE /api/doctors/{id}` - Xóa bác sĩ

### Appointment API
- `POST /api/appointments` - Đặt lịch hẹn
- `GET /api/appointments` - Danh sách lịch hẹn
- `GET /api/appointments/{id}` - Chi tiết lịch hẹn
- `GET /api/appointments/patient/{patientId}` - Lịch hẹn của bệnh nhân
- `GET /api/appointments/doctor/{doctorId}` - Lịch hẹn của bác sĩ
- `PUT /api/appointments/{id}` - Cập nhật lịch hẹn
- `PUT /api/appointments/{id}/status` - Thay đổi trạng thái
- `PUT /api/appointments/{id}/cancel` - Hủy lịch hẹn
- `DELETE /api/appointments/{id}` - Xóa lịch hẹn

### Review API
- `POST /api/reviews` - Tạo review
- `GET /api/reviews` - Danh sách review
- `GET /api/reviews/doctor/{doctorId}` - Review của bác sĩ
- `PUT /api/reviews/{id}` - Cập nhật review
- `DELETE /api/reviews/{id}` - Xóa review

## 🎯 Tính năng chính

- ✅ Đăng ký và đăng nhập
- ✅ Danh sách bác sĩ với lọc theo chuyên khoa
- ✅ Đặt lịch hẹn khám
- ✅ Quản lý lịch hẹn
- ✅ Hệ thống đánh giá và nhận xét
- ✅ Xem chi tiết profile bác sĩ
- ✅ Quản lý hồ sơ cá nhân

## 📝 Database Schema

### Users Table
- id, email, password, firstName, lastName, phone, role, profileImage, createdAt, updatedAt, active

### Doctors Table
- id, userId, specialization, licenseNumber, biography, ratingScore, consultationFee, experienceYears, createdAt, updatedAt

### Appointments Table
- id, patientId, doctorId, appointmentDateTime, durationMinutes, status, reason, notes, createdAt, updatedAt

### Reviews Table
- id, doctorId, patientId, rating, comment, createdAt, updatedAt

### DoctorAvailability Table
- id, doctorId, dayOfWeek, startTime, endTime, available

## 🚀 Phát triển tiếp theo

- [ ] JWT Authentication
- [ ] Email Notifications
- [ ] Payment Integration
- [ ] Video Consultation
- [ ] Admin Dashboard
- [ ] Doctor Availability Calendar
- [ ] SMS Notifications

## 📄 License

MIT License

## 👨‍💻 Tác giả

Dự án được tạo cho mục đích học tập.
