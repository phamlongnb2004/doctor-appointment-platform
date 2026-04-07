# 🐘 Setup PostgreSQL trên Render (FREE)

## Bước 1: Tạo PostgreSQL Database

1. Truy cập: https://dashboard.render.com
2. Click "New +" → "PostgreSQL"
3. Điền thông tin:
   - **Name**: `doctor-appointment-db`
   - **Database**: `doctor_appointment_db`
   - **User**: `doctor_appointment_user` (tự động tạo)
   - **Region**: Singapore
   - **PostgreSQL Version**: 16 (latest)
   - **Plan**: Free
4. Click "Create Database"
5. Đợi 1-2 phút để database được tạo

## Bước 2: Lấy Connection Info

Sau khi database được tạo, vào database và copy các thông tin sau:

### Internal Database URL (Quan trọng!)
```
postgres://user:password@hostname:5432/dbname
```

Hoặc lấy từng phần:
- **Hostname**: `dpg-xxxxx-singapore-postgres.render.com`
- **Port**: `5432`
- **Database**: `doctor_appointment_db`
- **Username**: `doctor_appointment_user`
- **Password**: `xxxxxxxxxxxxx`

## Bước 3: Cấu hình Backend Service

1. Vào Backend Service: https://dashboard.render.com/web/doctor-appointment-backend
2. Click tab "Environment"
3. Thêm/Cập nhật các biến sau:

### Database Configuration
```
SPRING_DATASOURCE_URL=<Internal Database URL từ bước 2>
SPRING_DATASOURCE_USERNAME=doctor_appointment_user
SPRING_DATASOURCE_PASSWORD=<password từ bước 2>
SPRING_DATASOURCE_DRIVER=org.postgresql.Driver
HIBERNATE_DIALECT=org.hibernate.dialect.PostgreSQLDialect
```

### App Configuration
```
APP_BASE_URL=https://doctor-appointment-backend-mq2p.onrender.com
FRONTEND_URL=https://doctor-appointment-frontend-ujug.onrender.com
PORT=8080
```

### SePay Configuration
```
SEPAY_MERCHANT_ID=YOUR_MERCHANT_ID
SEPAY_SECRET_KEY=YOUR_SECRET_KEY
SEPAY_ENV=sandbox
SEPAY_CHECKOUT_URL=https://sandbox.sepay.vn/v1/checkout/init
SEPAY_IPN_URL=https://doctor-appointment-backend-mq2p.onrender.com/api/orders/sepay/ipn
```

### Cloudinary (Optional)
```
CLOUDINARY_ENABLED=true
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. Click "Save Changes"
5. Service sẽ tự động redeploy

## Bước 4: Push Code Changes

Code đã được cập nhật để hỗ trợ PostgreSQL. Push lên Git:

```bash
git add .
git commit -m "Add PostgreSQL support for Render"
git push origin main
```

Render sẽ tự động deploy sau khi push.

## Bước 5: Kiểm tra Deployment

1. Vào Backend Service → Logs
2. Đợi deploy hoàn tất (3-5 phút)
3. Tìm dòng log:
   ```
   Started DoctorAppointmentApplication in X seconds
   ```
4. Nếu thấy dòng này → Deploy thành công!

## Bước 6: Test Database Connection

Truy cập: https://doctor-appointment-backend-mq2p.onrender.com/api/test

Nếu thấy response → Backend đã kết nối database thành công!

## Bước 7: Import Data (Nếu cần)

Nếu bạn có data từ MySQL cũ, cần migrate:

### Option 1: Sử dụng pgAdmin
1. Download pgAdmin: https://www.pgadmin.org/download/
2. Connect đến PostgreSQL database trên Render
3. Import SQL dump

### Option 2: Sử dụng psql command line
```bash
# Connect to database
psql <Internal Database URL>

# Import SQL file
\i /path/to/your/dump.sql
```

### Option 3: Để Hibernate tự tạo tables
- Set `ddl-auto: update` trong application-prod.yml (đã set)
- Hibernate sẽ tự động tạo tables khi start
- Sau đó chạy các SQL scripts trong folder `database/`

## 🎯 Lợi ích của PostgreSQL trên Render

✅ **Hoàn toàn miễn phí** (Free tier)
✅ **Tích hợp sẵn** với Render services
✅ **Tự động backup** (trên paid plans)
✅ **SSL connection** mặc định
✅ **Không giới hạn** connections (trong free tier limits)
✅ **Performance tốt** cho production

## 📊 Free Tier Limits

- **Storage**: 1 GB
- **Bandwidth**: Unlimited
- **Connections**: 97 concurrent
- **Expires**: 90 days (sau đó cần upgrade hoặc tạo mới)

## 🔍 Troubleshooting

### Lỗi: "password authentication failed"
- Kiểm tra username/password
- Copy lại từ database dashboard
- Đảm bảo không có khoảng trắng thừa

### Lỗi: "database does not exist"
- Database name phải khớp với tên trong connection string
- Kiểm tra lại SPRING_DATASOURCE_URL

### Lỗi: "SSL connection required"
- PostgreSQL trên Render yêu cầu SSL
- Connection string đã bao gồm SSL config

### Lỗi: "too many connections"
- Free tier giới hạn 97 connections
- Kiểm tra connection pool settings
- Restart service nếu cần

## 📝 Notes

- PostgreSQL case-sensitive với table/column names
- Một số SQL syntax khác với MySQL (ví dụ: `LIMIT` vs `TOP`)
- Hibernate sẽ tự động handle hầu hết differences
- Test kỹ các queries sau khi migrate

## 🚀 Next Steps

Sau khi database chạy ổn:
1. Test các API endpoints
2. Test SePay integration
3. Import production data (nếu có)
4. Setup monitoring và alerts

---

**Tạo bởi**: Kiro AI Assistant
**Ngày**: 2024-04-08
