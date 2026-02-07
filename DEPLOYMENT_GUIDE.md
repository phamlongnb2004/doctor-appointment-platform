# 🚀 Hướng Dẫn Deploy Web Medlatec

## 📋 Mục Lục
1. [Chuẩn bị trước khi deploy](#chuẩn-bị)
2. [Deploy Frontend (React)](#deploy-frontend)
3. [Deploy Backend (Spring Boot)](#deploy-backend)
4. [Deploy Database (MySQL)](#deploy-database)
5. [Cấu hình Domain & SSL](#domain-ssl)

---

## 🔧 Chuẩn Bị

### 1. Build Frontend
```bash
cd frontend
npm run build
```
Tạo folder `build/` chứa static files

### 2. Build Backend
```bash
cd backend
mvn clean package -DskipTests
```
Tạo file `target/doctor-appointment-platform-0.0.1-SNAPSHOT.jar`

### 3. Export Database
```bash
mysqldump -u root doctor_appointment_db > database_backup.sql
```

---

## 🌐 PHƯƠNG ÁN 1: Deploy Miễn Phí (Vercel + Railway)

### A. Deploy Frontend lên Vercel (Miễn Phí)

**Bước 1:** Tạo file `vercel.json` trong thư mục gốc:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "dest": "/static/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

**Bước 2:** Deploy
1. Đăng ký tài khoản tại https://vercel.com
2. Kết nối GitHub repository
3. Chọn project → Import
4. Build settings:
   - Framework: Create React App
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`
5. Environment Variables:
   - `REACT_APP_API_URL`: URL backend của bạn

**Bước 3:** Deploy
- Click "Deploy"
- Vercel sẽ tự động build và deploy
- Nhận được URL: `https://your-app.vercel.app`

### B. Deploy Backend lên Railway (Miễn Phí)

**Bước 1:** Tạo file `railway.json`:
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "java -jar target/doctor-appointment-platform-0.0.1-SNAPSHOT.jar",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**Bước 2:** Deploy
1. Đăng ký tại https://railway.app
2. New Project → Deploy from GitHub
3. Chọn repository
4. Add MySQL database (Railway cung cấp free)
5. Environment Variables:
```
SPRING_DATASOURCE_URL=jdbc:mysql://railway-mysql-host:3306/railway
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=your-password
```

**Bước 3:** Import Database
- Vào MySQL service → Data → Import
- Upload file `database_backup.sql`

---

## 🖥️ PHƯƠNG ÁN 2: Deploy VPS (DigitalOcean, AWS, Google Cloud)

### A. Chuẩn Bị VPS

**Yêu cầu tối thiểu:**
- RAM: 2GB
- CPU: 1 core
- Storage: 20GB
- OS: Ubuntu 20.04/22.04

**Cài đặt môi trường:**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Java 17
sudo apt install openjdk-17-jdk -y

# Install MySQL
sudo apt install mysql-server -y

# Install Nginx
sudo apt install nginx -y

# Install Node.js (cho build frontend)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs -y
```

### B. Deploy Backend

**1. Upload file JAR:**
```bash
# Tạo thư mục
sudo mkdir -p /opt/medlatec/backend
cd /opt/medlatec/backend

# Upload file (dùng SCP hoặc SFTP)
scp target/doctor-appointment-platform-0.0.1-SNAPSHOT.jar user@your-server:/opt/medlatec/backend/
```

**2. Tạo file cấu hình `application-prod.yml`:**
```yaml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/doctor_appointment_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
    username: medlatec_user
    password: your_secure_password
  
  jpa:
    hibernate:
      ddl-auto: none
    show-sql: false

  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 10MB

file:
  upload-dir: /opt/medlatec/uploads
```

**3. Tạo systemd service `/etc/systemd/system/medlatec-backend.service`:**
```ini
[Unit]
Description=Medlatec Backend Service
After=syslog.target network.target

[Service]
User=root
ExecStart=/usr/bin/java -jar /opt/medlatec/backend/doctor-appointment-platform-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
SuccessExitStatus=143
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

**4. Start service:**
```bash
sudo systemctl daemon-reload
sudo systemctl enable medlatec-backend
sudo systemctl start medlatec-backend
sudo systemctl status medlatec-backend
```

### C. Deploy Frontend

**1. Build và upload:**
```bash
# Local machine
cd frontend
npm run build

# Upload to server
scp -r build/* user@your-server:/var/www/medlatec/
```

**2. Cấu hình Nginx `/etc/nginx/sites-available/medlatec`:**
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    root /var/www/medlatec;
    index index.html;

    # Frontend
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket
    location /ws {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Static files
    location /uploads {
        alias /opt/medlatec/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

**3. Enable site:**
```bash
sudo ln -s /etc/nginx/sites-available/medlatec /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### D. Setup Database

**1. Tạo database và user:**
```bash
sudo mysql -u root -p
```

```sql
CREATE DATABASE doctor_appointment_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'medlatec_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON doctor_appointment_db.* TO 'medlatec_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

**2. Import database:**
```bash
mysql -u medlatec_user -p doctor_appointment_db < database_backup.sql
```

---

## 🔒 Cấu Hình SSL (HTTPS)

### Sử dụng Let's Encrypt (Miễn Phí)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Tạo SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renew
sudo certbot renew --dry-run
```

Nginx sẽ tự động cập nhật config để dùng HTTPS.

---

## 🌍 PHƯƠNG ÁN 3: Deploy Docker (Khuyên Dùng)

### 1. Tạo `Dockerfile` cho Backend

**backend/Dockerfile:**
```dockerfile
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/doctor-appointment-platform-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### 2. Tạo `Dockerfile` cho Frontend

**frontend/Dockerfile:**
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**frontend/nginx.conf:**
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 3. Tạo `docker-compose.yml`

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: medlatec-mysql
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: doctor_appointment_db
      MYSQL_USER: medlatec_user
      MYSQL_PASSWORD: medlatec_pass
    volumes:
      - mysql-data:/var/lib/mysql
      - ./database:/docker-entrypoint-initdb.d
    ports:
      - "3306:3306"
    networks:
      - medlatec-network

  backend:
    build: ./backend
    container_name: medlatec-backend
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/doctor_appointment_db
      SPRING_DATASOURCE_USERNAME: medlatec_user
      SPRING_DATASOURCE_PASSWORD: medlatec_pass
    volumes:
      - uploads:/opt/medlatec/uploads
    ports:
      - "8080:8080"
    depends_on:
      - mysql
    networks:
      - medlatec-network

  frontend:
    build: ./frontend
    container_name: medlatec-frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - medlatec-network

volumes:
  mysql-data:
  uploads:

networks:
  medlatec-network:
    driver: bridge
```

### 4. Deploy với Docker

```bash
# Build và start
docker-compose up -d

# Xem logs
docker-compose logs -f

# Stop
docker-compose down

# Rebuild
docker-compose up -d --build
```

---

## 📝 Checklist Trước Khi Deploy

- [ ] Đổi tất cả `localhost` thành domain/IP thực
- [ ] Cập nhật CORS settings trong backend
- [ ] Đổi database password mạnh
- [ ] Tắt debug mode (`spring.jpa.show-sql=false`)
- [ ] Cấu hình file upload path
- [ ] Setup backup database tự động
- [ ] Cấu hình firewall (chỉ mở port 80, 443, 22)
- [ ] Setup monitoring (Uptime Robot, New Relic)
- [ ] Test tất cả chức năng trên production

---

## 🔥 Các Lỗi Thường Gặp

### 1. CORS Error
**Giải pháp:** Cập nhật `WebConfig.java`:
```java
@Override
public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**")
            .allowedOrigins("https://your-domain.com")
            .allowedMethods("*")
            .allowCredentials(true);
}
```

### 2. File Upload Không Hoạt Động
**Giải pháp:** Kiểm tra quyền folder:
```bash
sudo chown -R www-data:www-data /opt/medlatec/uploads
sudo chmod -R 755 /opt/medlatec/uploads
```

### 3. Database Connection Failed
**Giải pháp:** Kiểm tra MySQL bind-address:
```bash
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
# Đổi bind-address = 0.0.0.0
sudo systemctl restart mysql
```

---

## 💰 Chi Phí Ước Tính

### Miễn Phí:
- Vercel (Frontend): Free
- Railway (Backend + DB): Free tier (500h/month)
- **Tổng: $0/tháng**

### VPS:
- DigitalOcean Droplet: $6-12/tháng
- Domain: $10-15/năm
- SSL: Free (Let's Encrypt)
- **Tổng: ~$7-13/tháng**

### Cloud (AWS/GCP):
- EC2/Compute Engine: $10-30/tháng
- RDS/Cloud SQL: $15-50/tháng
- **Tổng: ~$25-80/tháng**

---

## 📞 Hỗ Trợ

Nếu gặp vấn đề khi deploy, hãy kiểm tra:
1. Logs backend: `sudo journalctl -u medlatec-backend -f`
2. Logs nginx: `sudo tail -f /var/log/nginx/error.log`
3. Logs MySQL: `sudo tail -f /var/log/mysql/error.log`

**Khuyến nghị:** Bắt đầu với phương án Docker (dễ nhất) hoặc Vercel + Railway (miễn phí).
