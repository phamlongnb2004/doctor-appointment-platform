# -*- coding: utf-8 -*-
import mysql.connector
from datetime import datetime

# Kết nối database
conn = mysql.connector.connect(
    host='localhost',
    user='root',
    password='',
    database='doctor_appointment_db',
    charset='utf8mb4',
    collation='utf8mb4_unicode_ci'
)

cursor = conn.cursor()

# Xóa dữ liệu cũ
cursor.execute("TRUNCATE TABLE services")
cursor.execute("TRUNCATE TABLE news_articles")
cursor.execute("TRUNCATE TABLE homepage_content")
cursor.execute("TRUNCATE TABLE testimonials")

# Nhập dữ liệu mới với UTF-8
services = [
    ('Đặt lịch khám, lấy mẫu tại nhà', 'Quy khách hàng sử dụng tiện ích này để đặt lịch lấy mẫu tại nhà hoặc quy lịch khám chữa bệnh tại các cơ sở của MEDLATEC', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400', 'calendar', '#1890ff', 'Đặt lịch', '/doctors', True, 1),
    ('Tra cứu kết quả', 'Quy khách hàng sử dụng tiện ích này để tra cứu kết quả sau khi sử dụng dịch vụ y tế tại Hệ thống Y tế MEDLATEC', 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400', 'file-text', '#52c41a', 'Tra cứu', '/results', True, 2),
    ('Bảng giá dịch vụ', 'Quy khách hàng sử dụng tiện ích này để tra cứu giá dịch vụ y tế tại Hệ thống Y tế MEDLATEC', 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=400', 'dollar', '#fa8c16', 'Xem bảng giá', '/pricing', True, 3),
    ('Hỏi đáp chuyên gia', 'Quy khách hàng sử dụng tiện ích này để đặt câu hỏi và nhận hướng dẫn giải đáp thực mắc từ chuyên gia y tế của MEDLATEC', 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400', 'question-circle', '#722ed1', 'Đặt câu hỏi', '/chat', True, 4)
]

for service in services:
    cursor.execute("""
        INSERT INTO services (title, description, image_url, icon_class, color, button_text, button_url, is_active, display_order, created_at, updated_at)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, NOW(), NOW())
    """, service)

# Nhập tin tức
news = [
    ('Hy hữu: Xương gà du hành trong dạ dày, rồi mắc kẹt ở...', 'Bệnh viện Đa khoa MEDLATEC vừa can thiệp và điều trị thành công một ca lâm sàng hy hữu. Đó là mảnh xương gà dài 3,5cm...', '<p>Nội dung chi tiết về ca bệnh hy hữu này...</p>', 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300', 'xuong-ga-du-hanh', 'BS. Nguyễn Văn A', 'APPROVED', True, True, 1),
    ('Hút thuốc lá nhiều năm, xuất hiện khó thở, đi khám...', 'Có thói quen hút thuốc lá nhiều năm, khoảng 3 tháng nay, người đàn ông xuất hiện các cơn khó thở nhưng lại không thở...', '<p>Nội dung chi tiết về tác hại của thuốc lá...</p>', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=300', 'hut-thuoc-la-kho-tho', 'BS. Trần Thị B', 'APPROVED', True, True, 2),
    ('Cảnh báo hệ lụy từ món ăn làm tí cho đỡ ngày Tết của...', 'Từ những biểu hiện ban đầu không điển hình, nam bệnh nhân 60 tuổi tại Hà Nội được phát hiện mắc nhiễm khuẩn huyết...', '<p>Nội dung chi tiết về an toàn thực phẩm ngày Tết...</p>', 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300', 'canh-bao-he-luy-tet', 'BS. Lê Văn C', 'APPROVED', True, True, 3),
    ('Nhập viện vì sốt, người đàn ông bất ngờ được chẩn đoán...', 'Sốt là triệu chứng rất thường gặp trong lâm sàng và phần lớn liên quan đến nhiễm trùng. Tuy nhiên, trong một số trường hợp...', '<p>Nội dung chi tiết về chẩn đoán bệnh qua triệu chứng sốt...</p>', 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=300', 'nhap-vien-vi-sot', 'BS. Phạm Thị D', 'APPROVED', True, False, 4)
]

for article in news:
    cursor.execute("""
        INSERT INTO news_articles (title, excerpt, content, image_url, slug, author, status, is_active, is_featured, display_order, published_at, created_at, updated_at)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW(), NOW(), NOW())
    """, article)

# Nhập homepage content
cursor.execute("""
    INSERT INTO homepage_content (section_key, title, subtitle, content, image_url, button_text, button_url, extra_data, is_active, display_order, created_at, updated_at)
    VALUES ('hero', 'SỨC KHỎE ĐỊNH KỲ', 'Khám SỨC KHỎE ĐỊNH KỲ', 'Bảo vệ sức khỏe của đội ngũ - Gia tăng doanh nghiệp', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500', 'Đăng ký ngay: 1900 56 56 56', '/contact', '{"discount": "25%"}', true, 1, NOW(), NOW())
""")

# Commit
conn.commit()

print("✓ Đã nhập dữ liệu thành công với UTF-8!")
print(f"✓ Đã nhập {len(services)} dịch vụ")
print(f"✓ Đã nhập {len(news)} tin tức")

# Kiểm tra
cursor.execute("SELECT title FROM services LIMIT 1")
result = cursor.fetchone()
print(f"\nKiểm tra dữ liệu: {result[0]}")

cursor.close()
conn.close()
