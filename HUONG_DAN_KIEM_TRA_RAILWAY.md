# 🔍 Hướng Dẫn Kiểm Tra Table Newsletter Trên Railway

## 📋 Thông Tin Kết Nối Railway

- **Host:** gondola.proxy.rlwy.net
- **Port:** 43703
- **Database:** railway
- **Username:** root
- **Password:** (password của bạn)

## 🛠️ Cách 1: Dùng MySQL Workbench (Khuyến Nghị)

### Bước 1: Kết Nối Database
1. Mở MySQL Workbench
2. Click "+" để tạo connection mới
3. Nhập thông tin:
   - Connection Name: `Railway - Doctor Appointment`
   - Hostname: `gondola.proxy.rlwy.net`
   - Port: `43703`
   - Username: `root`
   - Password: (click "Store in Vault" và nhập password)
   - Default Schema: `railway`
4. Click "Test Connection"
5. Click "OK"

### Bước 2: Kiểm Tra Table
1. Double-click vào connection vừa tạo
2. Chọn database `railway` ở sidebar trái
3. Mở file `check_newsletter_table.sql`
4. Click icon "Execute" (⚡) hoặc nhấn `Ctrl + Shift + Enter`

### Kết Quả Mong Đợi

#### Nếu Table TỒN TẠI:
```
SHOW TABLES LIKE 'newsletter_subscriptions';
+------------------------------------------+
| Tables_in_railway (newsletter_subscriptions) |
+------------------------------------------+
| newsletter_subscriptions                  |
+------------------------------------------+
1 row in set

DESCRIBE newsletter_subscriptions;
+-------------------+--------------+------+-----+-------------------+
| Field             | Type         | Null | Key | Default           |
+-------------------+--------------+------+-----+-------------------+
| id                | bigint       | NO   | PRI | NULL              |
| email             | varchar(255) | NO   | UNI | NULL              |
| name              | varchar(255) | YES  |     | NULL              |
| phone             | varchar(20)  | YES  |     | NULL              |
| verification_code | varchar(6)   | NO   | MUL | NULL              |
| is_verified       | tinyint(1)   | YES  | MUL | 0                 |
| is_active         | tinyint(1)   | YES  |     | 1                 |
| created_at        | timestamp    | YES  |     | CURRENT_TIMESTAMP |
| verified_at       | timestamp    | YES  |     | NULL              |
| expires_at        | timestamp    | NO   |     | NULL              |
+-------------------+--------------+------+-----+-------------------+
```

#### Nếu Table KHÔNG TỒN TẠI:
```
SHOW TABLES LIKE 'newsletter_subscriptions';
Empty set (0.00 sec)
```

## 🛠️ Cách 2: Dùng Command Line

### Windows Command Prompt:
```bash
mysql -h gondola.proxy.rlwy.net -P 43703 -u root -p railway < check_newsletter_table.sql
```

Khi được hỏi password, nhập password Railway của bạn.

### PowerShell:
```powershell
Get-Content check_newsletter_table.sql | mysql -h gondola.proxy.rlwy.net -P 43703 -u root -p railway
```

## 🛠️ Cách 3: Dùng Railway Web Console

1. Vào Railway Dashboard: https://railway.app
2. Chọn project của bạn
3. Click vào MySQL service
4. Click tab "Data"
5. Chạy query:
```sql
SHOW TABLES LIKE 'newsletter_subscriptions';
```

## ✅ Nếu Table TỒN TẠI

**Tốt!** Table đã có, vậy lỗi 404 có thể do:

1. **Backend chưa deploy code mới nhất**
   - Vào Render Dashboard
   - Check tab "Events" xem có deploy mới không
   - Nếu chưa → Click "Manual Deploy"

2. **Backend bị lỗi khi start**
   - Vào Render Dashboard → Logs
   - Tìm error khi application start
   - Tìm dòng: `Mapped "{[/api/newsletter/subscribe],methods=[POST]}"`

3. **Browser cache**
   - Hard refresh: `Ctrl + Shift + R`
   - Hoặc clear cache và reload

## ❌ Nếu Table KHÔNG TỒN TẠI

**Đây là nguyên nhân chính!** Cần tạo table:

### Option 1: Dùng MySQL Workbench
1. Mở file `database/create_newsletter_subscriptions.sql`
2. Copy toàn bộ nội dung
3. Paste vào MySQL Workbench
4. Execute (⚡)

### Option 2: Dùng Command Line
```bash
mysql -h gondola.proxy.rlwy.net -P 43703 -u root -p railway < database/create_newsletter_subscriptions.sql
```

### Option 3: Dùng Bat File
```bash
run_create_newsletter_table.bat
```

### Verify Table Đã Được Tạo
Chạy lại:
```sql
SHOW TABLES LIKE 'newsletter_subscriptions';
```

Phải thấy table trong kết quả.

## 🧪 Test Sau Khi Tạo Table

### Test 1: Kiểm Tra Cấu Trúc Table
```sql
DESCRIBE newsletter_subscriptions;
```

### Test 2: Test Insert
```sql
INSERT INTO newsletter_subscriptions 
(email, name, phone, verification_code, is_verified, is_active, expires_at)
VALUES 
('test@example.com', 'Test User', '0123456789', '123456', FALSE, TRUE, DATE_ADD(NOW(), INTERVAL 15 MINUTE));
```

### Test 3: Kiểm Tra Data
```sql
SELECT * FROM newsletter_subscriptions WHERE email = 'test@example.com';
```

### Test 4: Xóa Test Data
```sql
DELETE FROM newsletter_subscriptions WHERE email = 'test@example.com';
```

## 🎯 Sau Khi Kiểm Tra

### Nếu Table Đã Có:
1. Không cần tạo lại
2. Kiểm tra backend logs trên Render
3. Hard refresh browser
4. Test newsletter subscription

### Nếu Table Chưa Có:
1. Tạo table bằng một trong 3 options trên
2. Verify table đã được tạo
3. **KHÔNG CẦN** restart backend (backend sẽ tự nhận table mới)
4. Hard refresh browser
5. Test newsletter subscription

## 📞 Báo Kết Quả

Sau khi kiểm tra, hãy cho tôi biết:

1. **Table có tồn tại không?**
   - ✅ Có → Gửi kết quả `DESCRIBE newsletter_subscriptions`
   - ❌ Không → Tạo table và báo kết quả

2. **Nếu table có, số lượng records:**
   ```sql
   SELECT COUNT(*) FROM newsletter_subscriptions;
   ```

3. **Backend logs có lỗi gì không?**
   - Vào Render Dashboard → Logs
   - Copy error (nếu có)

Với thông tin này, tôi sẽ biết chính xác nguyên nhân và cách fix!
