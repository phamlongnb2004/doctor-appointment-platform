# 🔧 Fix Database Connection Error trên Render

## ❌ Lỗi hiện tại:
```
Communications link failure
Can not read response from server
```

## ✅ Nguyên nhân:
Backend không thể kết nối đến MySQL database vì thiếu environment variables.

## 📋 Các bước khắc phục:

### Bước 1: Kiểm tra Database trên Render

1. Truy cập Render Dashboard: https://dashboard.render.com
2. Kiểm tra xem bạn đã tạo MySQL database chưa
3. Nếu chưa có, tạo mới:
   - Click "New +" → "PostgreSQL" hoặc tìm MySQL alternative
   - **Lưu ý**: Render free tier không hỗ trợ MySQL, chỉ có PostgreSQL

### Bước 2: Chuyển sang PostgreSQL (Khuyến nghị)

Vì Render free tier chỉ hỗ trợ PostgreSQL, bạn có 2 lựa chọn:

#### Option 1: Sử dụng PostgreSQL trên Render (Khuyến nghị)

1. **Tạo PostgreSQL database trên Render:**
   - Dashboard → New + → PostgreSQL
   - Name: `doctor-appointment-db`
   - Region: Singapore
   - Plan: Free
   - Click "Create Database"

2. **Lấy connection string:**
   - Sau khi tạo xong, vào database
   - Copy "Internal Database URL"
   - Format: `postgresql://user:password@host:5432/dbname`

3. **Cập nhật pom.xml (thêm PostgreSQL driver):**

```xml
<!-- Thay MySQL driver bằng PostgreSQL -->
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

4. **Cập nhật application-prod.yml:**

```yaml
spring:
  datasource:
    url: ${SPRING_DATASOURCE_URL}
    username: ${SPRING_DATASOURCE_USERNAME}
    password: ${SPRING_DATASOURCE_PASSWORD}
    driver-class-name: org.postgresql.Driver

  jpa:
    hibernate:
      ddl-auto: update
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
```

5. **Set Environment Variables trên Backend Service:**
   - `SPRING_DATASOURCE_URL`: Internal Database URL từ PostgreSQL
   - `SPRING_DATASOURCE_USERNAME`: username từ connection string
   - `SPRING_DATASOURCE_PASSWORD`: password từ connection string

#### Option 2: Sử dụng External MySQL (Railway, PlanetScale, etc.)

1. **Tạo MySQL database trên Railway:**
   - Truy cập: https://railway.app
   - New Project → Add MySQL
   - Lấy connection details

2. **Set Environment Variables trên Render Backend:**
   ```
   SPRING_DATASOURCE_URL=jdbc:mysql://host:port/dbname?useSSL=true&serverTimezone=UTC
   SPRING_DATASOURCE_USERNAME=your_username
   SPRING_DATASOURCE_PASSWORD=your_password
   ```

### Bước 3: Set Environment Variables

Truy cập Backend Service trên Render → Environment:

**Nếu dùng PostgreSQL:**
```
SPRING_DATASOURCE_URL=<internal_database_url>
SPRING_DATASOURCE_USERNAME=<username>
SPRING_DATASOURCE_PASSWORD=<password>
APP_BASE_URL=https://doctor-appointment-backend-mq2p.onrender.com
FRONTEND_URL=https://doctor-appointment-frontend-ujug.onrender.com
```

**Thêm các biến SePay (từ trước):**
```
SEPAY_MERCHANT_ID=YOUR_MERCHANT_ID
SEPAY_SECRET_KEY=YOUR_SECRET_KEY
SEPAY_ENV=sandbox
SEPAY_CHECKOUT_URL=https://sandbox.sepay.vn/v1/checkout/init
SEPAY_IPN_URL=https://doctor-appointment-backend-mq2p.onrender.com/api/orders/sepay/ipn
```

### Bước 4: Redeploy

Sau khi set environment variables:
1. Click "Save Changes"
2. Render sẽ tự động redeploy
3. Đợi deploy hoàn tất (3-5 phút)

### Bước 5: Kiểm tra logs

1. Vào Backend Service → Logs
2. Tìm dòng: "Started DoctorAppointmentApplication"
3. Nếu thấy dòng này → Database đã kết nối thành công

## 🎯 Khuyến nghị: Chuyển sang PostgreSQL

PostgreSQL là lựa chọn tốt nhất cho Render vì:
- ✅ Free tier hỗ trợ đầy đủ
- ✅ Tích hợp sẵn với Render
- ✅ Performance tốt
- ✅ Không cần external service

## 📝 Code changes cần thiết cho PostgreSQL:

### 1. Update pom.xml:

```xml
<!-- Comment out MySQL -->
<!--
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
</dependency>
-->

<!-- Add PostgreSQL -->
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

### 2. Update application-prod.yml:

```yaml
spring:
  jpa:
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
```

### 3. Commit và push:

```bash
git add .
git commit -m "Switch to PostgreSQL for Render deployment"
git push origin main
```

## 🔍 Troubleshooting

### Lỗi: "password authentication failed"
- Kiểm tra username/password có đúng không
- Copy lại từ database connection string

### Lỗi: "database does not exist"
- Database đã được tạo chưa?
- Kiểm tra database name trong connection string

### Lỗi: "SSL connection required"
- Thêm `?sslmode=require` vào connection string

## 📞 Support

- Render Docs: https://render.com/docs/databases
- PostgreSQL Migration: https://render.com/docs/migrate-from-heroku

---

**Tóm tắt**: Render free tier không hỗ trợ MySQL. Khuyến nghị chuyển sang PostgreSQL hoặc dùng external MySQL từ Railway/PlanetScale.
