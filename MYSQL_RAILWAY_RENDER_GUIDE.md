# 🚀 Deploy với MySQL Railway + Backend Render

## 📋 TỔNG QUAN

Giải pháp này sử dụng:
- **MySQL Database**: Trên Railway (đã tạo sẵn)
- **Backend**: Trên Render.com
- **Frontend**: Trên Render.com

---

## ⚠️ LƯU Ý QUAN TRỌNG

Railway Trial có giới hạn credits. Khi hết credits, MySQL sẽ bị tắt. Bạn cần:
1. Theo dõi credits còn lại
2. Hoặc nâng cấp lên Hobby plan (cần credit card)
3. Hoặc chuyển sang PostgreSQL sau này

---

## 🗄️ BƯỚC 1: Cấu Hình MySQL Trên Railway

### 1.1: Kiểm Tra MySQL Đã Tạo

1. Đăng nhập Railway: https://railway.app
2. Vào project **"natural-flow"** hoặc **"production"**
3. Kiểm tra có service **MySQL** chưa

### 1.2: Lấy Thông Tin Kết Nối

Bạn đã có thông tin này:
```
MYSQLHOST = mysql.railway.internal
MYSQLPORT = 3306
MYSQLDATABASE = railway
MYSQLUSER = root
MYSQLPASSWORD = ibRVktBWedqUAdOKpQBInXvYZjCWHnVN
```

### 1.3: Lấy Public URL (Quan Trọng!)

**MySQL trên Railway có 2 loại URL:**

1. **Internal URL** (`mysql.railway.internal`): Chỉ dùng được trong Railway
2. **Public URL**: Dùng để connect từ bên ngoài (Render)

**Cách lấy Public URL:**

1. Vào Railway Dashboard
2. Click vào **MySQL service**
3. Vào tab **"Connect"**
4. Tìm phần **"Public Networking"**
5. Click **"Enable Public Networking"** (nếu chưa bật)
6. Copy các thông tin:
   - **Public Host**: Dạng `containers-us-west-xxx.railway.app`
   - **Public Port**: Thường là `6379` hoặc số khác (KHÔNG phải 3306)

**Ví dụ Public URL:**
```
Host: containers-us-west-123.railway.app
Port: 6379
Database: railway
User: root
Password: ibRVktBWedqUAdOKpQBInXvYZjCWHnVN
```

---

## 📊 BƯỚC 2: Import Database Vào Railway MySQL

### 2.1: Cài Đặt MySQL Client (Nếu Chưa Có)

**Windows:**
```bash
# Download MySQL Workbench từ:
https://dev.mysql.com/downloads/workbench/
```

Hoặc dùng command line:
```bash
# Nếu đã cài MySQL local
mysql --version
```

### 2.2: Connect Tới Railway MySQL

**Dùng MySQL Workbench:**

1. Mở MySQL Workbench
2. Click **"+"** để tạo connection mới
3. Điền thông tin:
   - **Connection Name**: Railway MySQL
   - **Hostname**: `containers-us-west-xxx.railway.app` (Public Host)
   - **Port**: `6379` (Public Port)
   - **Username**: `root`
   - **Password**: Click "Store in Keychain" và nhập password
4. Click **"Test Connection"**
5. Nếu thành công, click **"OK"**

**Dùng Command Line:**

```bash
mysql -h containers-us-west-xxx.railway.app -P 6379 -u root -p
# Nhập password khi được hỏi
```

### 2.3: Import Database

**Cách 1: Dùng MySQL Workbench**

1. Connect vào Railway MySQL
2. Click **"Server"** → **"Data Import"**
3. Chọn **"Import from Self-Contained File"**
4. Browse tới file `database/setup.sql`
5. Chọn **"Default Target Schema"**: `railway`
6. Click **"Start Import"**

**Cách 2: Dùng Command Line**

```bash
# Từ thư mục gốc project
mysql -h containers-us-west-xxx.railway.app -P 6379 -u root -p railway < database/setup.sql
```

**Cách 3: Import Từng File (Nếu Cách 1-2 Lỗi)**

```bash
# Import từng file theo thứ tự
mysql -h [PUBLIC_HOST] -P [PUBLIC_PORT] -u root -p railway < database/create_banners_table.sql
mysql -h [PUBLIC_HOST] -P [PUBLIC_PORT] -u root -p railway < database/create_features_table.sql
mysql -h [PUBLIC_HOST] -P [PUBLIC_PORT] -u root -p railway < database/create_medical_services_tables.sql
# ... tiếp tục với các file khác
```

---

## 🔧 BƯỚC 3: Chuẩn Bị Code

### 3.1: Kiểm Tra application.yml

File `backend/src/main/resources/application.yml` đã sẵn sàng, không cần sửa!

### 3.2: Tạo File application-prod.yml (Production Config)

Tạo file mới: `backend/src/main/resources/application-prod.yml`

```yaml
spring:
  datasource:
    url: ${SPRING_DATASOURCE_URL}
    username: ${SPRING_DATASOURCE_USERNAME}
    password: ${SPRING_DATASOURCE_PASSWORD}
    driver-class-name: com.mysql.cj.jdbc.Driver

  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQL8Dialect

server:
  port: ${PORT:8080}

app:
  upload:
    path: /tmp/uploads
  base-url: ${APP_BASE_URL}
```

### 3.3: Push Code Lên GitHub

```bash
git add backend/src/main/resources/application-prod.yml
git commit -m "Add production config for Render with Railway MySQL"
git push
```

---

## 🖥️ BƯỚC 4: Deploy Backend Lên Render

### 4.1: Đăng Nhập Render

1. Mở: https://render.com
2. Click **"Get Started for Free"**
3. Chọn **"Sign up with GitHub"**
4. Authorize Render

### 4.2: Tạo Web Service

1. Click **"New +"** → **"Web Service"**
2. Chọn **"Build and deploy from a Git repository"** → **"Next"**
3. Chọn repository: **"doctor-appointment-platform"**
4. Click **"Connect"**

### 4.3: Điền Thông Tin Service

- **Name**: `doctor-appointment-backend`
- **Region**: **Singapore** (gần VN nhất)
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: **Java**
- **Build Command**: `mvn clean package -DskipTests`
- **Start Command**: `java -Dspring.profiles.active=prod -jar target/*.jar`

### 4.4: Chọn Plan

- Chọn **"Free"** plan
- Click **"Advanced"** để thêm Environment Variables

### 4.5: Thêm Environment Variables

Click **"Add Environment Variable"** và thêm:

```
SPRING_DATASOURCE_URL = jdbc:mysql://[PUBLIC_HOST]:[PUBLIC_PORT]/railway?useSSL=true&serverTimezone=UTC&allowPublicKeyRetrieval=true
SPRING_DATASOURCE_USERNAME = root
SPRING_DATASOURCE_PASSWORD = ibRVktBWedqUAdOKpQBInXvYZjCWHnVN
CORS_ORIGINS = http://localhost:3000
PORT = 8080
APP_BASE_URL = https://doctor-appointment-backend.onrender.com
```

**⚠️ QUAN TRỌNG: Thay [PUBLIC_HOST] và [PUBLIC_PORT] bằng giá trị thực từ Railway!**

**Ví dụ:**
```
SPRING_DATASOURCE_URL = jdbc:mysql://containers-us-west-123.railway.app:6379/railway?useSSL=true&serverTimezone=UTC&allowPublicKeyRetrieval=true
```

### 4.6: Deploy

Click **"Create Web Service"**

⏳ **Đợi 5-10 phút** để Render build và deploy backend.

### 4.7: Kiểm Tra Logs

1. Sau khi deploy xong, vào tab **"Logs"**
2. Kiểm tra có lỗi gì không
3. Tìm dòng: `Started DoctorAppointmentPlatformApplication`
4. Nếu thấy dòng này → Backend đã chạy thành công! ✅

---

## 🌐 BƯỚC 5: Deploy Frontend Lên Render

### 5.1: Tạo Static Site

1. Click **"New +"** → **"Static Site"**
2. Chọn repository: **"doctor-appointment-platform"**
3. Click **"Connect"**

### 5.2: Điền Thông Tin

- **Name**: `doctor-appointment-frontend`
- **Branch**: `main`
- **Root Directory**: `frontend`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `build`

### 5.3: Thêm Environment Variable

Click **"Advanced"** → **"Add Environment Variable"**

```
REACT_APP_API_URL = https://doctor-appointment-backend.onrender.com
```

**⚠️ Thay URL bằng URL backend thực tế từ bước 4!**

### 5.4: Deploy

Click **"Create Static Site"**

⏳ **Đợi 3-5 phút** để build và deploy.

---

## 🔄 BƯỚC 6: Update CORS

### 6.1: Lấy Frontend URL

Sau khi frontend deploy xong, copy URL (dạng: `https://doctor-appointment-frontend.onrender.com`)

### 6.2: Update Backend CORS

1. Quay lại **Backend service** trên Render
2. Vào tab **"Environment"**
3. Tìm biến `CORS_ORIGINS`
4. Sửa thành:
   ```
   CORS_ORIGINS = https://doctor-appointment-frontend.onrender.com
   ```
5. Click **"Save Changes"**

Backend sẽ tự động redeploy (1-2 phút).

---

## ✅ BƯỚC 7: Kiểm Tra Hoạt Động

### 7.1: Test Backend

Mở trình duyệt, truy cập:
```
https://doctor-appointment-backend.onrender.com/health
```

Hoặc:
```
https://doctor-appointment-backend.onrender.com/specialties
```

Nếu thấy dữ liệu JSON → Backend OK! ✅

### 7.2: Test Frontend

Mở:
```
https://doctor-appointment-frontend.onrender.com
```

Kiểm tra:
- Trang chủ hiển thị đúng
- Dữ liệu từ database hiển thị
- Có thể đăng nhập/đăng ký

---

## 🎉 HOÀN THÀNH!

Bây giờ bạn có:
- ✅ MySQL Database: Railway
- ✅ Backend: Render (kết nối tới Railway MySQL)
- ✅ Frontend: Render

---

## ⚠️ LƯU Ý VỀ RAILWAY CREDITS

### Theo Dõi Credits

1. Vào Railway Dashboard
2. Click vào **Settings** (góc dưới trái)
3. Xem **"Usage"** → Kiểm tra credits còn lại

### Khi Hết Credits

Railway sẽ:
- Tắt MySQL service
- Backend trên Render sẽ không connect được database
- Website sẽ báo lỗi

**Giải pháp:**
1. Nâng cấp Railway lên Hobby plan ($5/tháng)
2. Hoặc chuyển sang PostgreSQL trên Render (FREE)

---

## 🆘 Troubleshooting

### Lỗi: Cannot Connect to Database

**Nguyên nhân:** Sai Public Host/Port hoặc chưa enable Public Networking

**Giải pháp:**
1. Vào Railway → MySQL service
2. Tab "Connect" → Enable "Public Networking"
3. Copy đúng Public Host và Public Port
4. Update lại `SPRING_DATASOURCE_URL` trên Render

### Lỗi: Access Denied for User 'root'

**Nguyên nhân:** Sai password

**Giải pháp:**
1. Kiểm tra lại password từ Railway
2. Update biến `SPRING_DATASOURCE_PASSWORD` trên Render

### Lỗi: SSL Connection Error

**Giải pháp:** Thêm `&useSSL=false` vào URL:
```
jdbc:mysql://[HOST]:[PORT]/railway?useSSL=false&serverTimezone=UTC
```

### Backend Sleep Sau 15 Phút

**Đây là hành vi bình thường của Render Free tier.**

Lần đầu truy cập sau khi sleep sẽ mất 30-60 giây để wake up.

---

## 📞 Cần Giúp?

Cho tôi biết bạn đang ở bước nào và gặp lỗi gì! 🚀
