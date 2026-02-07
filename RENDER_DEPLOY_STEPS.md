# 🚀 CÁC BƯỚC DEPLOY LÊN RENDER - DÙNG MYSQL RAILWAY

## ✅ ĐÃ HOÀN THÀNH

- ✅ MySQL trên Railway: `gondola.proxy.rlwy.net:43703`
- ✅ Tạo file `application-prod.yml` cho production
- ✅ Code đã sẵn sàng

---

## 📋 BƯỚC 1: PUSH CODE LÊN GITHUB

Mở terminal và chạy:

```bash
git add backend/src/main/resources/application-prod.yml
git commit -m "Add production config for Render with Railway MySQL"
git push
```

---

## 🖥️ BƯỚC 2: DEPLOY BACKEND LÊN RENDER

### 2.1: Đăng Nhập Render

1. Mở: **https://render.com**
2. Click **"Get Started for Free"**
3. Chọn **"Sign up with GitHub"**
4. Authorize Render

### 2.2: Tạo Web Service

1. Click **"New +"** (góc trên bên phải)
2. Chọn **"Web Service"**
3. Chọn **"Build and deploy from a Git repository"**
4. Click **"Next"**

### 2.3: Connect Repository

1. Tìm repository: **"doctor-appointment-platform"**
2. Click **"Connect"**

### 2.4: Điền Thông Tin Service

Điền chính xác như sau:

| Field | Value |
|-------|-------|
| **Name** | `doctor-appointment-backend` |
| **Region** | **Singapore** |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | **Java** |
| **Build Command** | `mvn clean package -DskipTests` |
| **Start Command** | `java -Dspring.profiles.active=prod -jar target/*.jar` |

### 2.5: Chọn Plan

- Chọn **"Free"** plan
- Scroll xuống, click **"Advanced"**

### 2.6: Thêm Environment Variables

Click **"Add Environment Variable"** và thêm **5 biến** sau:

#### Biến 1: SPRING_DATASOURCE_URL
```
SPRING_DATASOURCE_URL
```
**Value:**
```
jdbc:mysql://gondola.proxy.rlwy.net:43703/railway?useSSL=true&serverTimezone=UTC&allowPublicKeyRetrieval=true&characterEncoding=UTF-8&useUnicode=true
```

#### Biến 2: SPRING_DATASOURCE_USERNAME
```
SPRING_DATASOURCE_USERNAME
```
**Value:**
```
root
```

#### Biến 3: SPRING_DATASOURCE_PASSWORD
```
SPRING_DATASOURCE_PASSWORD
```
**Value:**
```
ibRVktBWedqUAdOKpQBInXvYZjCWHnVN
```

#### Biến 4: CORS_ORIGINS
```
CORS_ORIGINS
```
**Value:**
```
http://localhost:3000
```
*(Sẽ update sau khi có frontend URL)*

#### Biến 5: PORT
```
PORT
```
**Value:**
```
8080
```

#### Biến 6: APP_BASE_URL
```
APP_BASE_URL
```
**Value:**
```
https://doctor-appointment-backend.onrender.com
```
*(Hoặc URL thực tế sau khi tạo)*

### 2.7: Deploy

1. Kiểm tra lại tất cả thông tin
2. Click **"Create Web Service"**

⏳ **Đợi 5-10 phút** để Render build và deploy.

### 2.8: Kiểm Tra Logs

1. Sau khi deploy, vào tab **"Logs"**
2. Tìm dòng: `Started DoctorAppointmentPlatformApplication`
3. Nếu thấy → Backend đã chạy! ✅

### 2.9: Lấy Backend URL

1. Copy URL từ Render (dạng: `https://doctor-appointment-backend.onrender.com`)
2. Lưu lại để dùng cho frontend

---

## 🌐 BƯỚC 3: DEPLOY FRONTEND LÊN RENDER

### 3.1: Tạo Static Site

1. Click **"New +"** → **"Static Site"**
2. Chọn repository: **"doctor-appointment-platform"**
3. Click **"Connect"**

### 3.2: Điền Thông Tin

| Field | Value |
|-------|-------|
| **Name** | `doctor-appointment-frontend` |
| **Branch** | `main` |
| **Root Directory** | `frontend` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `build` |

### 3.3: Thêm Environment Variable

Click **"Advanced"** → **"Add Environment Variable"**

```
REACT_APP_API_URL
```
**Value:**
```
https://doctor-appointment-backend.onrender.com
```
*(Thay bằng URL backend thực tế từ bước 2.9)*

### 3.4: Deploy

Click **"Create Static Site"**

⏳ **Đợi 3-5 phút** để build.

### 3.5: Lấy Frontend URL

Copy URL (dạng: `https://doctor-appointment-frontend.onrender.com`)

---

## 🔄 BƯỚC 4: UPDATE CORS

### 4.1: Update Backend CORS

1. Quay lại **Backend service**
2. Vào tab **"Environment"**
3. Tìm biến `CORS_ORIGINS`
4. Click **Edit** (icon bút chì)
5. Sửa value thành:
   ```
   https://doctor-appointment-frontend.onrender.com
   ```
   *(Thay bằng frontend URL thực tế)*
6. Click **"Save Changes"**

Backend sẽ tự động redeploy (1-2 phút).

---

## ✅ BƯỚC 5: KIỂM TRA

### 5.1: Test Backend

Mở trình duyệt:
```
https://doctor-appointment-backend.onrender.com/specialties
```

Nếu thấy JSON data → Backend OK! ✅

### 5.2: Test Frontend

Mở:
```
https://doctor-appointment-frontend.onrender.com
```

Kiểm tra:
- Trang chủ hiển thị
- Dữ liệu từ database
- Đăng nhập/đăng ký hoạt động

---

## 🎉 HOÀN THÀNH!

Bạn đã có:
- ✅ MySQL: Railway (`gondola.proxy.rlwy.net:43703`)
- ✅ Backend: Render
- ✅ Frontend: Render

---

## ⚠️ LƯU Ý

### Backend Sleep

Render Free tier: Backend sleep sau 15 phút không dùng.
- Lần đầu truy cập sau khi sleep: 30-60 giây để wake up
- Đây là bình thường

### Railway Credits

- Theo dõi credits trong Railway Dashboard
- Khi hết credits, MySQL sẽ tắt
- Cần nâng cấp hoặc chuyển sang PostgreSQL

---

## 🆘 Troubleshooting

### Lỗi: Cannot Connect to Database

**Kiểm tra:**
1. Railway MySQL có đang chạy không?
2. Public Networking có enable không?
3. `SPRING_DATASOURCE_URL` có đúng không?

### Lỗi: CORS

**Giải pháp:**
1. Kiểm tra `CORS_ORIGINS` có đúng frontend URL không
2. Nhớ có `https://` ở đầu
3. Không có `/` ở cuối

### Lỗi: 502 Bad Gateway

**Nguyên nhân:** Backend đang build hoặc starting

**Giải pháp:** Đợi thêm 1-2 phút

---

## 📞 Cần Giúp?

Cho tôi biết bạn đang ở bước nào! 🚀
