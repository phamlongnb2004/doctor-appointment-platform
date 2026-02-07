# 🚀 Hướng Dẫn Deploy MIỄN PHÍ - Frontend + Backend + Database

## 🎯 Phương Án 1: Render.com (Khuyên Dùng - Dễ Nhất)

### ✅ Ưu điểm:
- **Hoàn toàn miễn phí** cho cả Frontend, Backend, Database
- Tự động deploy khi push code lên GitHub
- Hỗ trợ Spring Boot, React, MySQL
- SSL miễn phí
- Không cần credit card

### 📋 Bước 1: Chuẩn Bị Code

#### 1.1. Tạo file cấu hình cho Backend

**Tạo `backend/render.yaml`:**
```yaml
services:
  - type: web
    name: medlatec-backend
    env: java
    buildCommand: mvn clean package -DskipTests
    startCommand: java -jar target/doctor-appointment-platform-0.0.1-SNAPSHOT.jar
    envVars:
      - key: SPRING_DATASOURCE_URL
        fromDatabase:
          name: medlatec-db
          property: connectionString
      - key: SPRING_DATASOURCE_USERNAME
        fromDatabase:
          name: medlatec-db
          property: user
      - key: SPRING_DATASOURCE_PASSWORD
        fromDatabase:
          name: medlatec-db
          property: password
      - key: SPRING_JPA_HIBERNATE_DDL_AUTO
        value: update
      - key: FILE_UPLOAD_DIR
        value: /opt/render/project/uploads

databases:
  - name: medlatec-db
    databaseName: doctor_appointment_db
    user: medlatec_user
```

#### 1.2. Cập nhật `backend/src/main/resources/application.yml`:
```yaml
spring:
  datasource:
    url: ${SPRING_DATASOURCE_URL:jdbc:mysql://localhost:3306/doctor_appointment_db}
    username: ${SPRING_DATASOURCE_USERNAME:root}
    password: ${SPRING_DATASOURCE_PASSWORD:}
  
  jpa:
    hibernate:
      ddl-auto: ${SPRING_JPA_HIBERNATE_DDL_AUTO:update}
    show-sql: false

  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 10MB

server:
  port: ${PORT:8080}

file:
  upload-dir: ${FILE_UPLOAD_DIR:./uploads}

# CORS - Cập nhật sau khi có URL frontend
cors:
  allowed-origins: ${CORS_ORIGINS:http://localhost:3000}
```

#### 1.3. Cập nhật CORS trong `backend/src/main/java/com/doctorappointment/config/WebConfig.java`:
```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Value("${cors.allowed-origins}")
    private String allowedOrigins;
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(allowedOrigins.split(","))
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

#### 1.4. Tạo file `.env.example` cho Frontend:
```env
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
```

### 📋 Bước 2: Deploy Backend + Database

1. **Đăng ký tài khoản Render.com:**
   - Truy cập: https://render.com
   - Sign up với GitHub (miễn phí)

2. **Tạo PostgreSQL Database** (Render không hỗ trợ MySQL free, dùng PostgreSQL):
   - Dashboard → New → PostgreSQL
   - Name: `medlatec-db`
   - Database: `doctor_appointment_db`
   - User: `medlatec_user`
   - Region: Singapore (gần VN nhất)
   - Plan: **Free**
   - Click "Create Database"
   - **Lưu lại:** Internal Database URL

3. **Cập nhật Backend dùng PostgreSQL:**

**Sửa `backend/pom.xml` - Thay MySQL bằng PostgreSQL:**
```xml
<!-- Xóa MySQL dependency -->
<!-- <dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
</dependency> -->

<!-- Thêm PostgreSQL dependency -->
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

**Sửa `application.yml`:**
```yaml
spring:
  datasource:
    url: ${DATABASE_URL:jdbc:postgresql://localhost:5432/doctor_appointment_db}
    username: ${DB_USERNAME:postgres}
    password: ${DB_PASSWORD:}
    driver-class-name: org.postgresql.Driver
  
  jpa:
    database-platform: org.hibernate.dialect.PostgreSQLDialect
    hibernate:
      ddl-auto: update
    properties:
      hibernate:
        format_sql: true
```

4. **Deploy Backend:**
   - Dashboard → New → Web Service
   - Connect Repository (chọn GitHub repo của bạn)
   - Name: `medlatec-backend`
   - Root Directory: `backend`
   - Environment: `Java`
   - Build Command: `mvn clean package -DskipTests`
   - Start Command: `java -jar target/doctor-appointment-platform-0.0.1-SNAPSHOT.jar`
   - Plan: **Free**
   - Environment Variables:
     ```
     DATABASE_URL = [paste Internal Database URL từ bước 2]
     CORS_ORIGINS = http://localhost:3000
     PORT = 8080
     ```
   - Click "Create Web Service"

5. **Đợi deploy xong** (5-10 phút)
   - Nhận được URL: `https://medlatec-backend.onrender.com`

### 📋 Bước 3: Deploy Frontend

#### 3.1. Cập nhật API URL trong Frontend

**Tạo file `frontend/.env.production`:**
```env
REACT_APP_API_URL=https://medlatec-backend.onrender.com/api
```

**Cập nhật tất cả API calls trong `frontend/src/services/`:**

Tìm và thay thế tất cả `http://localhost:8080/api` bằng:
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
```

**Ví dụ trong `frontend/src/services/api.js`:**
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

#### 3.2. Deploy Frontend lên Render

1. **Dashboard → New → Static Site**
2. Connect Repository
3. Settings:
   - Name: `medlatec-frontend`
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `build`
   - Plan: **Free**
4. Environment Variables:
   ```
   REACT_APP_API_URL = https://medlatec-backend.onrender.com/api
   ```
5. Click "Create Static Site"
6. Đợi deploy (3-5 phút)
7. Nhận được URL: `https://medlatec-frontend.onrender.com`

#### 3.3. Cập nhật CORS Backend

Quay lại Backend service → Environment → Edit:
```
CORS_ORIGINS = https://medlatec-frontend.onrender.com,http://localhost:3000
```

Save → Backend sẽ tự động redeploy

### 📋 Bước 4: Import Database

1. **Kết nối PostgreSQL:**
   - Vào PostgreSQL service → Info
   - Copy "External Database URL"
   - Dùng tool: pgAdmin hoặc DBeaver

2. **Chuyển đổi SQL từ MySQL sang PostgreSQL:**

**Tạo file `database/postgresql_setup.sql`:**
```sql
-- Tạo tables (tương tự MySQL nhưng syntax PostgreSQL)
-- Ví dụ:
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(100),
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'PATIENT',
    avatar_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Thêm data mẫu...
```

3. **Import qua psql:**
```bash
psql [External Database URL] < database/postgresql_setup.sql
```

---

## 🎯 Phương Án 2: Railway.app (Dễ Hơn, Có MySQL)

### ✅ Ưu điểm:
- Hỗ trợ MySQL (không cần chuyển sang PostgreSQL)
- Deploy cực kỳ đơn giản
- Free tier: 500 giờ/tháng (đủ dùng)
- Tự động SSL

### 📋 Bước 1: Deploy trên Railway

1. **Đăng ký Railway:**
   - Truy cập: https://railway.app
   - Sign up với GitHub

2. **Tạo Project mới:**
   - Dashboard → New Project
   - Deploy from GitHub repo
   - Chọn repository của bạn

3. **Thêm MySQL Database:**
   - Project → New → Database → MySQL
   - Railway tự động tạo database
   - Lưu lại connection info

4. **Deploy Backend:**
   - Project → New → GitHub Repo
   - Root Directory: `backend`
   - Railway tự động detect Java
   - Environment Variables:
     ```
     SPRING_DATASOURCE_URL = ${{MySQL.DATABASE_URL}}
     SPRING_DATASOURCE_USERNAME = ${{MySQL.MYSQL_USER}}
     SPRING_DATASOURCE_PASSWORD = ${{MySQL.MYSQL_PASSWORD}}
     PORT = 8080
     ```
   - Deploy tự động

5. **Deploy Frontend:**
   - Project → New → GitHub Repo
   - Root Directory: `frontend`
   - Environment Variables:
     ```
     REACT_APP_API_URL = https://[backend-url].railway.app/api
     ```
   - Deploy tự động

6. **Generate Domain:**
   - Mỗi service → Settings → Generate Domain
   - Nhận được URL public

---

## 🎯 Phương Án 3: Vercel (Frontend) + Railway (Backend)

### Frontend trên Vercel:

1. **Đăng ký Vercel:** https://vercel.com
2. **Import Project:**
   - New Project → Import Git Repository
   - Root Directory: `frontend`
   - Framework: Create React App
   - Environment Variables:
     ```
     REACT_APP_API_URL = https://[railway-backend-url]/api
     ```
3. Deploy → Nhận URL: `https://medlatec.vercel.app`

### Backend trên Railway:
- Làm theo Phương án 2

---

## 📝 Checklist Sau Khi Deploy

### ✅ Kiểm tra Backend:
```bash
# Test API
curl https://your-backend-url.onrender.com/api/health

# Test CORS
curl -H "Origin: https://your-frontend-url.onrender.com" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS https://your-backend-url.onrender.com/api/doctors
```

### ✅ Kiểm tra Frontend:
- Mở browser: `https://your-frontend-url.onrender.com`
- Kiểm tra Console (F12) xem có lỗi CORS không
- Test login, đăng ký, xem dịch vụ

### ✅ Cập nhật Database:
- Import data mẫu
- Tạo admin user
- Test CRUD operations

---

## 🔥 Xử Lý Lỗi Thường Gặp

### 1. CORS Error
**Triệu chứng:** `Access to XMLHttpRequest has been blocked by CORS policy`

**Giải pháp:**
- Kiểm tra `CORS_ORIGINS` environment variable
- Đảm bảo có `https://` prefix
- Restart backend service

### 2. Database Connection Failed
**Triệu chứng:** `Unable to connect to database`

**Giải pháp:**
- Kiểm tra DATABASE_URL format
- PostgreSQL: `postgresql://user:pass@host:5432/dbname`
- MySQL: `mysql://user:pass@host:3306/dbname`

### 3. Build Failed
**Triệu chứng:** Build error khi deploy

**Giải pháp Backend:**
```bash
# Test local
cd backend
mvn clean package -DskipTests
```

**Giải pháp Frontend:**
```bash
# Test local
cd frontend
npm run build
```

### 4. File Upload Không Hoạt Động
**Triệu chứng:** Upload ảnh bị lỗi

**Giải pháp:** Dùng cloud storage (Cloudinary miễn phí)

**Thêm dependency:**
```xml
<dependency>
    <groupId>com.cloudinary</groupId>
    <artifactId>cloudinary-http44</artifactId>
    <version>1.33.0</version>
</dependency>
```

**Config:**
```java
@Configuration
public class CloudinaryConfig {
    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
            "cloud_name", "your_cloud_name",
            "api_key", "your_api_key",
            "api_secret", "your_api_secret"
        ));
    }
}
```

---

## 💡 Tips Tối Ưu

### 1. Giảm Cold Start (Render Free Tier)
Render free tier sleep sau 15 phút không dùng. Giải pháp:

**Dùng Cron Job ping server:**
- Đăng ký: https://cron-job.org (free)
- Tạo job ping: `https://your-backend-url.onrender.com/api/health`
- Interval: 10 phút

### 2. Tối Ưu Build Time
**Frontend:**
```json
// package.json
{
  "scripts": {
    "build": "GENERATE_SOURCEMAP=false react-scripts build"
  }
}
```

**Backend:**
```xml
<!-- pom.xml -->
<plugin>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-maven-plugin</artifactId>
    <configuration>
        <excludeDevtools>true</excludeDevtools>
    </configuration>
</plugin>
```

### 3. Environment Variables
Tạo file `.env.example` để team biết cần config gì:
```env
# Backend
DATABASE_URL=postgresql://user:pass@host:5432/dbname
CORS_ORIGINS=https://frontend-url.com
PORT=8080

# Frontend
REACT_APP_API_URL=https://backend-url.com/api
```

---

## 📊 So Sánh Các Phương Án

| Tính năng | Render | Railway | Vercel + Railway |
|-----------|--------|---------|------------------|
| **Giá** | Free | Free (500h) | Free |
| **Database** | PostgreSQL | MySQL/PostgreSQL | MySQL/PostgreSQL |
| **SSL** | ✅ Auto | ✅ Auto | ✅ Auto |
| **Custom Domain** | ✅ | ✅ | ✅ |
| **Cold Start** | ~30s | ~10s | Frontend: 0s, Backend: ~10s |
| **Dễ setup** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

**Khuyến nghị:** 
- **Dễ nhất:** Railway (giữ nguyên MySQL)
- **Tốt nhất:** Vercel (Frontend) + Railway (Backend)
- **Ổn định nhất:** Render (nhưng phải đổi PostgreSQL)

---

## 🚀 Bắt Đầu Ngay

### Phương án Railway (Khuyên dùng):

```bash
# 1. Push code lên GitHub
git add .
git commit -m "Prepare for deployment"
git push origin main

# 2. Truy cập Railway
# https://railway.app

# 3. New Project → Deploy from GitHub

# 4. Thêm MySQL database

# 5. Deploy backend và frontend

# 6. Nhận URL và test!
```

**Thời gian:** ~15 phút để deploy xong cả hệ thống! 🎉
