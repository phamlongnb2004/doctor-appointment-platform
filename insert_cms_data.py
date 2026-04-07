#!/usr/bin/env python3
"""
Insert basic CMS data for homepage
"""
import psycopg2

DB_CONFIG = {
    'host': 'dpg-d7ajsnoule4c739j0pp0-a.singapore-postgres.render.com',
    'port': 5432,
    'database': 'doctor_appointment_db_xl6x',
    'user': 'doctor_appointment_user',
    'password': 'i6L3iTqvQbmyGY8wHL2inobdtbCm8vCS'
}

def main():
    print("=" * 50)
    print("Đang chèn dữ liệu CMS...")
    print("=" * 50)
    
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        conn.autocommit = True
        cursor = conn.cursor()
        
        # 1. Insert site settings (khớp với SiteSettings.java)
        print("\n1. Đang chèn site settings...")
        cursor.execute("""
            INSERT INTO site_settings (
                site_name, site_tagline, logo_url, hotline, email, address,
                statistics_background_image, facebook_url, youtube_url, zalo_url,
                footer_about_text, footer_working_hours, footer_facebook_url, 
                footer_youtube_url, footer_zalo_url, footer_copyright_text,
                bank_id, bank_name, bank_account_no, bank_account_name,
                doctors_hero_title, doctors_hero_subtitle, doctors_hero_background
            )
            VALUES (
                'KHAMNOW', 
                'Hệ thống đặt lịch khám bệnh trực tuyến', 
                '', 
                '1900-xxxx', 
                'contact@khamnow.com', 
                'Hà Nội, Việt Nam',
                '', '', '', '',
                'KHAMNOW - Nền tảng đặt lịch khám bệnh trực tuyến hàng đầu',
                'Thứ 2 - Thứ 6: 8:00 - 17:00\nThứ 7: 8:00 - 12:00',
                '', '', '',
                '© 2024 KHAMNOW. All rights reserved.',
                '', '', '', '',
                'Đội ngũ bác sĩ chuyên nghiệp',
                'Tìm và đặt lịch với các bác sĩ giỏi nhất',
                ''
            )
            ON CONFLICT (id) DO UPDATE SET
                site_name = EXCLUDED.site_name,
                hotline = EXCLUDED.hotline;
        """)
        print("✓ Site settings đã chèn")
        
        # 2. Insert homepage content
        print("\n2. Đang chèn homepage content...")
        cursor.execute("""
            INSERT INTO homepage_content (section_key, title, content, image_url, display_order, is_active, created_at, updated_at)
            VALUES 
            ('hero', 'Chào mừng đến với KHAMNOW', 'Đặt lịch khám bệnh nhanh chóng và tiện lợi', '', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
            ('about', 'Về chúng tôi', 'KHAMNOW là nền tảng đặt lịch khám bệnh trực tuyến hàng đầu', '', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            ON CONFLICT (section_key) DO NOTHING;
        """)
        print("✓ Homepage content đã chèn")
        
        # 3. Insert sample banner
        print("\n3. Đang chèn banner mẫu...")
        cursor.execute("""
            INSERT INTO banners (title, subtitle, image_url, button_url, button_text, display_order, is_active, page, created_at, updated_at)
            VALUES ('Đặt lịch khám ngay', 'Nhanh chóng - Tiện lợi - An toàn', '', '/doctors', 'Đặt lịch ngay', 1, true, 'home', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            ON CONFLICT DO NOTHING;
        """)
        print("✓ Banner đã chèn")
        
        # 4. Insert sample specialties
        print("\n4. Đang chèn chuyên khoa mẫu...")
        cursor.execute("""
            INSERT INTO specialties (name, description, icon, display_order, is_active, is_featured, created_at, updated_at)
            VALUES 
            ('Nội khoa', 'Khám và điều trị các bệnh nội khoa', 'fa-heartbeat', 1, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
            ('Ngoại khoa', 'Phẫu thuật và điều trị ngoại khoa', 'fa-user-md', 2, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
            ('Nhi khoa', 'Khám và điều trị cho trẻ em', 'fa-child', 3, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            ON CONFLICT DO NOTHING;
        """)
        print("✓ Chuyên khoa đã chèn")
        
        # 5. Insert sample service categories
        print("\n5. Đang chèn danh mục dịch vụ...")
        cursor.execute("""
            INSERT INTO service_categories (name, slug, description, icon, display_order, is_active, created_at, updated_at)
            VALUES 
            ('Khám tổng quát', 'kham-tong-quat', 'Dịch vụ khám sức khỏe tổng quát', 'fa-stethoscope', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
            ('Xét nghiệm', 'xet-nghiem', 'Các dịch vụ xét nghiệm y tế', 'fa-flask', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            ON CONFLICT (slug) DO NOTHING;
        """)
        print("✓ Danh mục dịch vụ đã chèn")
        
        # 6. Insert sample features
        print("\n6. Đang chèn tính năng mẫu...")
        cursor.execute("""
            INSERT INTO features (title, description, icon, display_order, is_active, created_at, updated_at)
            VALUES 
            ('Đặt lịch nhanh', 'Đặt lịch khám chỉ trong vài phút', 'fa-clock', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
            ('Bác sĩ chuyên nghiệp', 'Đội ngũ bác sĩ giỏi và tận tâm', 'fa-user-doctor', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
            ('Hỗ trợ 24/7', 'Luôn sẵn sàng hỗ trợ bạn', 'fa-headset', 3, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            ON CONFLICT DO NOTHING;
        """)
        print("✓ Tính năng đã chèn")
        
        # 7. Insert sample statistics
        print("\n7. Đang chèn thống kê mẫu...")
        cursor.execute("""
            INSERT INTO statistics (label, value, icon, display_order, is_active, created_at, updated_at)
            VALUES 
            ('Bệnh nhân', '10,000+', 'fa-users', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
            ('Bác sĩ', '100+', 'fa-user-doctor', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
            ('Chuyên khoa', '20+', 'fa-hospital', 3, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
            ('Đánh giá 5 sao', '95%', 'fa-star', 4, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            ON CONFLICT DO NOTHING;
        """)
        print("✓ Thống kê đã chèn")
        
        # 8. Insert article CTA section
        print("\n8. Đang chèn article CTA section...")
        cursor.execute("""
            INSERT INTO article_cta_section (
                title, subtitle, 
                cta1_title, cta1_description, cta1_button_text, cta1_button_url,
                cta2_title, cta2_description, cta2_button_text, cta2_button_url,
                background_color, is_active, created_at, updated_at
            )
            VALUES (
                'Tham gia cùng chúng tôi', 
                'Chia sẻ kiến thức y khoa của bạn',
                'Bạn là bác sĩ?', 
                'Đăng ký để chia sẻ kiến thức và kết nối với bệnh nhân', 
                'Đăng ký ngay', 
                '/register',
                'Bạn là bệnh nhân?',
                'Tìm bác sĩ và đặt lịch khám nhanh chóng',
                'Đặt lịch ngay',
                '/doctors',
                '#f0f9ff', 
                true,
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            )
            ON CONFLICT (id) DO UPDATE SET
                title = EXCLUDED.title,
                is_active = EXCLUDED.is_active;
        """)
        print("✓ Article CTA section đã chèn")
        
        print("\n" + "=" * 50)
        print("✓ Dữ liệu CMS đã chèn thành công!")
        print("=" * 50)
        print("\nBạn có thể truy cập:")
        print("  - Trang chủ: https://doctor-appointment-frontend-ujug.onrender.com")
        print("  - Admin CMS: https://doctor-appointment-frontend-ujug.onrender.com/admin/cms")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"\n✗ Lỗi: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    main()
