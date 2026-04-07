#!/usr/bin/env python3
"""
Create medical_services table based on MedicalService.java model
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
    print("Đang tạo bảng medical_services...")
    print("=" * 50)
    
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        conn.autocommit = True
        cursor = conn.cursor()
        
        # Create medical_services table
        print("\nĐang tạo bảng medical_services...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS medical_services (
                id BIGSERIAL PRIMARY KEY,
                category_id BIGINT,
                title VARCHAR(500) NOT NULL,
                slug VARCHAR(500) NOT NULL UNIQUE,
                description TEXT,
                content TEXT,
                image_url VARCHAR(1000),
                images TEXT,
                original_price DECIMAL(15, 2),
                discounted_price DECIMAL(15, 2),
                discount_percentage INTEGER DEFAULT 0,
                quantity INTEGER DEFAULT 0,
                display_order INTEGER DEFAULT 0,
                is_featured BOOLEAN DEFAULT false,
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (category_id) REFERENCES service_categories(id) ON DELETE SET NULL
            );
        """)
        print("✓ Bảng medical_services đã được tạo")
        
        # Create index on slug for faster lookups
        print("\nĐang tạo index...")
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_medical_services_slug ON medical_services(slug);
            CREATE INDEX IF NOT EXISTS idx_medical_services_category ON medical_services(category_id);
            CREATE INDEX IF NOT EXISTS idx_medical_services_active ON medical_services(is_active);
        """)
        print("✓ Index đã được tạo")
        
        # Insert sample data
        print("\nĐang chèn dữ liệu mẫu...")
        cursor.execute("""
            INSERT INTO medical_services (
                category_id, title, slug, description, content,
                original_price, discounted_price, discount_percentage,
                quantity, display_order, is_featured, is_active,
                created_at, updated_at
            )
            VALUES 
            (
                2, 
                'Gói khám sức khỏe tổng quát cơ bản', 
                'goi-kham-suc-khoe-tong-quat-co-ban',
                'Gói khám sức khỏe tổng quát cơ bản bao gồm các xét nghiệm cơ bản',
                '<p>Gói khám sức khỏe tổng quát cơ bản bao gồm:</p><ul><li>Khám lâm sàng</li><li>Xét nghiệm máu</li><li>Xét nghiệm nước tiểu</li><li>Đo huyết áp</li></ul>',
                1500000,
                1200000,
                20,
                100,
                1,
                true,
                true,
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            ),
            (
                3,
                'Xét nghiệm máu tổng quát',
                'xet-nghiem-mau-tong-quat',
                'Xét nghiệm máu tổng quát để kiểm tra sức khỏe',
                '<p>Xét nghiệm máu tổng quát bao gồm:</p><ul><li>Công thức máu</li><li>Đường huyết</li><li>Mỡ máu</li></ul>',
                500000,
                400000,
                20,
                200,
                2,
                true,
                true,
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            )
            ON CONFLICT (slug) DO NOTHING;
        """)
        print("✓ Dữ liệu mẫu đã được chèn")
        
        print("\n" + "=" * 50)
        print("✓ Hoàn tất!")
        print("=" * 50)
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"\n✗ Lỗi: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    main()
