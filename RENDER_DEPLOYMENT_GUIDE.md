# 🚀 Hướng Dẫn Deploy Lên Render.com - 100% FREE

## ✅ Ưu Điểm Render.com
- ✅ Hoàn toàn FREE, không cần credit card
- ✅ Deploy tự động từ GitHub
- ✅ PostgreSQL free (thay vì MySQL)
- ✅ Dễ dàng hơn Railway

---

## 📋 BƯỚC 1: Đăng Ký Render.com

1. Mở: https://render.com
2. Click **"Get Started for Free"**
3. Chọn **"Sign up with GitHub"**
4. Đăng nhập bằng tài khoản GitHub của bạn
5. Authorize Render để truy cập GitHub

✅ **Xong!** Bạn đã có tài khoản Render.

---

## 🗄️ BƯỚC 2: Tạo PostgreSQL Database

1. Sau khi đăng nhập, click **"New +"** (góc trên bên phải)
2. Chọn **"PostgreSQL"**
3. Điền thông tin:
   - **Name**: `doctor-appointment-db`
   - **Database**: `doctor_appointment_db`
   - **User**: `doctor_user`
   - **Region**: **Singapore** (gần VN nhất)
4. Chọn **"Free"** plan
5. Click **"Create Database"**

⏳ **Đợi 2-3 phút** để database được tạo.

### Lấy Thông Tin Database:

Sau khi database được tạo:
1. Click vào database vừa tạo
2. Scroll xuống tìm **"Connections"**
3. Copy các giá trị sau vào notepad:
   - **Internal Database URL** (dạng: `postgresql://...`)
   - **Hostname**
   - **Port**
   - **Database**
   - **Username**
   - **Password**

---

## 🔧 BƯỚC 3: Chuẩn Bị Code Cho PostgreSQL

Backend hiện đang dùng MySQL, cần đổi sang PostgreSQL.

### 3.1: Update pom.xml

Thay MySQL driver bằng PostgreSQL driver trong `backend/pom.xml`:

Tìm dòng:
```xml
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <scope>runtime</scope>
</dependency>
```

Thay bằng:
```xml
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

### 3.2: Update application.yml

File `backend/src/main/resources/application.yml` đã dùng environment variables nên không cần sửa!

### 3.3: Push Code Lên GitHub

```bash
git add backend/pom.xml
git commit -m "Switch to PostgreSQL for Render deployment"
git push
```

---

## 🖥️ BƯỚC 4: Deploy Backend

1. Click **"New +"** → **"Web Service"**
2. Chọn **"Build and deploy from a Git repository"** → **"Next"**
3. Chọn repository: **"doctor-appointment-platform"**
4. Click **"Connect"**

### Điền Thông Tin:

- **Name**: `doctor-appointment-backend`
- **Region**: **Singapore**
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: **Java**
- **Build Command**: `mvn clean package -DskipTests`
- **Start Command**: `java -jar target/*.jar`

### Chọn Plan:

- Chọn **"Free"** plan
- Click **"Advanced"** để thêm Environment Variables

### Thêm Environment Variables:

Click **"Add Environment Variable"** và thêm:

```
SPRING_DATASOURCE_URL = [Internal Database URL từ bước 2]
SPRING_DATASOURCE_USERNAME = [Username từ bước 2]
SPRING_DATASOURCE_PASSWORD = [Password từ bước 2]
CORS_ORIGINS = http://localhost:3000
PORT = 8080
```

**Ví dụ:**
```
SPRING_DATASOURCE_URL = postgresql://doctor_user:abc123@dpg-xxx.singapore-postgres.render.com/doctor_appointment_db
SPRING_DATASOURCE_USERNAME = doctor_user
SPRING_DATASOURCE_PASSWORD = abc123xyz
CORS_ORIGINS = http://localhost:3000
PORT = 8080
```

### Deploy:

Click **"Create Web Service"**

⏳ **Đợi 5-10 phút** để Render build và deploy backend.

---

## 📊 BƯỚC 5: Import Database

Sau khi backend deploy xong:

1. Vào database service
2. Click tab **"Connect"**
3. Copy **External Database URL**
4. Dùng tool như **DBeaver** hoặc **pgAdmin** để connect
5. Import file `database/setup.sql`

Hoặc dùng command line:
```bash
psql [External Database URL] < database/setup.sql
```

---

## 🌐 BƯỚC 6: Deploy Frontend

1. Click **"New +"** → **"Static Site"**
2. Chọn repository: **"doctor-appointment-platform"**
3. Điền thông tin:
   - **Name**: `doctor-appointment-frontend`
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`

### Thêm Environment Variable:

```
REACT_APP_API_URL = [Backend URL từ bước 4]
```

**Ví dụ:**
```
REACT_APP_API_URL = https://doctor-appointment-backend.onrender.com
```

Click **"Create Static Site"**

---

## 🔄 BƯỚC 7: Update CORS

Sau khi frontend deploy xong:

1. Copy **Frontend URL** (dạng: `https://doctor-appointment-frontend.onrender.com`)
2. Quay lại **Backend service**
3. Vào **"Environment"**
4. Update biến `CORS_ORIGINS`:
   ```
   CORS_ORIGINS = https://doctor-appointment-frontend.onrender.com
   ```
5. Click **"Save Changes"**
6. Backend sẽ tự động redeploy

---

## 🎉 HOÀN THÀNH!

Bây giờ bạn có:
- ✅ Backend: `https://doctor-appointment-backend.onrender.com`
- ✅ Frontend: `https://doctor-appointment-frontend.onrender.com`
- ✅ Database: PostgreSQL trên Render

---

## ⚠️ Lưu Ý Render Free Tier

- Backend sẽ **sleep sau 15 phút không dùng**
- Lần đầu truy cập sau khi sleep sẽ mất **30-60 giây** để wake up
- Database **không sleep**, luôn online
- Đủ cho demo và học tập

---

## 🆘 Troubleshooting

### Lỗi: Build Failed
- Kiểm tra logs trong tab "Logs"
- Đảm bảo `pom.xml` đã đổi sang PostgreSQL driver

### Lỗi: Cannot Connect to Database
- Kiểm tra lại Database URL
- Đảm bảo dùng **Internal Database URL** (không phải External)

### Lỗi: CORS
- Kiểm tra biến `CORS_ORIGINS` có đúng frontend URL không
- Nhớ có `https://` ở đầu

---

## 📞 Cần Giúp?

Nếu gặp vấn đề, cho tôi biết ở bước nào và lỗi gì! 🚀
