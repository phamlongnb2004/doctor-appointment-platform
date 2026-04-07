#!/usr/bin/env python3
"""
Script tổng hợp để restore tất cả bảng: Users + CMS
Chạy trực tiếp trên terminal local
"""
import psycopg2
import os

# Database config - Render PostgreSQL
DB_CONFIG = {
    'host': 'dpg-d7ajsnoule4c739j0pp0-a.singapore-postgres.render.com',
    'port': 5432,
    'database': 'doctor_appointment_db_xl6x',
    'user': 'doctor_appointment_user',
    'password': 'i6L3iTqvQbmyGY8wHL2inobdtbCm8vCS'
}

def print_header(text):
    print("\n" + "=" * 60)
    print(f"  {text}")
    print("=" * 60)

def create_users_table(cursor):
    """Tạo bảng users và admin user"""
    print_header("1. CREATING USERS TABLE")
    
    # Create users table
    print("📝 Creating users table...")
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id BIGSERIAL PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            first_name VARCHAR(100),
            last_name VARCHAR(100),
            phone VARCHAR(20),
            role VARCHAR(50) NOT NULL,
            profile_image TEXT,
            cover_image TEXT,
            active BOOLEAN DEFAULT true,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)
    print("✅ Users table created")
    
    # Create indexes
    print("📝 Creating indexes...")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);")
    print("✅ Indexes created")
    
    # Insert admin if not exists
    print("📝 Creating admin user...")
    cursor.execute("""
        INSERT INTO users (email, password, first_name, last_name, phone, role, active)
        VALUES (
            'admin@doctor.com',
            '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
            'Admin',
            'System',
            '0123456789',
            'ADMIN',
            true
        )
        ON CONFLICT (email) DO NOTHING;
    """)
    print("✅ Admin user ensured")
    
    # Verify
    cursor.execute("SELECT COUNT(*) FROM users;")
    count = cursor.fetchone()[0]
    print(f"✅ Total users: {count}")

def create_cms_tables(cursor):
    """Tạo tất cả bảng CMS"""
    print_header("2. CREATING CMS TABLES")
    
    cms_tables = {
        'home_page_content': """
            CREATE TABLE IF NOT EXISTS home_page_content (
                id BIGSERIAL PRIMARY KEY,
                hero_title VARCHAR(500),
                hero_subtitle TEXT,
                hero_description TEXT,
                hero_button_text VARCHAR(100),
                hero_button_link VARCHAR(500),
                hero_image_url VARCHAR(1000),
                hero_background_url VARCHAR(1000),
                about_title VARCHAR(500),
                about_description TEXT,
                about_image_url VARCHAR(1000),
                services_title VARCHAR(500),
                services_description TEXT,
                doctors_title VARCHAR(500),
                doctors_description TEXT,
                testimonials_title VARCHAR(500),
                testimonials_description TEXT,
                cta_title VARCHAR(500),
                cta_description TEXT,
                cta_button_text VARCHAR(100),
                cta_button_link VARCHAR(500),
                cta_background_url VARCHAR(1000),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """,
        'banners': """
            CREATE TABLE IF NOT EXISTS banners (
                id BIGSERIAL PRIMARY KEY,
                title VARCHAR(500),
                subtitle TEXT,
                description TEXT,
                button_text VARCHAR(100),
                button_link VARCHAR(500),
                image_url VARCHAR(1000),
                background_url VARCHAR(1000),
                display_order INTEGER DEFAULT 0,
                is_active BOOLEAN DEFAULT true,
                page VARCHAR(50) DEFAULT 'home',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """,
        'site_settings': """
            CREATE TABLE IF NOT EXISTS site_settings (
                id BIGSERIAL PRIMARY KEY,
                site_name VARCHAR(255) NOT NULL,
                site_tagline VARCHAR(255),
                logo_url VARCHAR(500),
                hotline VARCHAR(50) NOT NULL,
                email VARCHAR(255),
                address TEXT,
                statistics_background_image VARCHAR(500),
                facebook_url VARCHAR(255),
                youtube_url VARCHAR(255),
                zalo_url VARCHAR(255),
                footer_about_text TEXT,
                footer_working_hours TEXT,
                footer_facebook_url VARCHAR(255),
                footer_youtube_url VARCHAR(255),
                footer_zalo_url VARCHAR(255),
                footer_copyright_text VARCHAR(255),
                bank_id VARCHAR(50),
                bank_name VARCHAR(255),
                bank_account_no VARCHAR(50),
                bank_account_name VARCHAR(255),
                doctors_hero_title VARCHAR(255),
                doctors_hero_subtitle VARCHAR(500),
                doctors_hero_background VARCHAR(500)
            );
        """,
        'about_page_content': """
            CREATE TABLE IF NOT EXISTS about_page_content (
                id BIGSERIAL PRIMARY KEY,
                hero_title VARCHAR(500),
                hero_subtitle TEXT,
                hero_image_url VARCHAR(1000),
                mission_title VARCHAR(500),
                mission_description TEXT,
                vision_title VARCHAR(500),
                vision_description TEXT,
                values_title VARCHAR(500),
                values_description TEXT,
                history_title VARCHAR(500),
                history_description TEXT,
                team_title VARCHAR(500),
                team_description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """,
        'certifications': """
            CREATE TABLE IF NOT EXISTS certifications (
                id BIGSERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                image_url VARCHAR(1000),
                issuer VARCHAR(255),
                issue_date DATE,
                expiry_date DATE,
                display_order INTEGER DEFAULT 0,
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """,
        'features': """
            CREATE TABLE IF NOT EXISTS features (
                id BIGSERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                icon VARCHAR(100),
                display_order INTEGER DEFAULT 0,
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """,
        'statistics': """
            CREATE TABLE IF NOT EXISTS statistics (
                id BIGSERIAL PRIMARY KEY,
                label VARCHAR(255) NOT NULL,
                value VARCHAR(100) NOT NULL,
                icon VARCHAR(100),
                display_order INTEGER DEFAULT 0,
                is_active BOOLEAN DEFAULT true,
                background_color VARCHAR(50),
                text_color VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """,
        'membership_benefits': """
            CREATE TABLE IF NOT EXISTS membership_benefits (
                id BIGSERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                icon VARCHAR(100),
                display_order INTEGER DEFAULT 0,
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """,
        'news_sections': """
            CREATE TABLE IF NOT EXISTS news_sections (
                id BIGSERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                layout_type VARCHAR(50) DEFAULT 'grid',
                display_order INTEGER DEFAULT 0,
                is_active BOOLEAN DEFAULT true,
                page VARCHAR(50) DEFAULT 'home',
                category_filter BIGINT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """,
        'news_sidebar_widgets': """
            CREATE TABLE IF NOT EXISTS news_sidebar_widgets (
                id BIGSERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                widget_type VARCHAR(50) NOT NULL,
                content TEXT,
                display_order INTEGER DEFAULT 0,
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """,
        'article_cta_section': """
            CREATE TABLE IF NOT EXISTS article_cta_section (
                id BIGSERIAL PRIMARY KEY,
                title VARCHAR(500),
                description TEXT,
                button_text VARCHAR(100),
                button_link VARCHAR(500),
                background_color VARCHAR(50),
                text_color VARCHAR(50),
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """
    }
    
    for table_name, create_sql in cms_tables.items():
        print(f"📝 Creating {table_name}...")
        cursor.execute(create_sql)
        print(f"✅ {table_name} created")

def insert_default_data(cursor):
    """Insert default data cho CMS"""
    print_header("3. INSERTING DEFAULT DATA")
    
    # Home page content
    print("📝 Inserting home page content...")
    cursor.execute("""
        INSERT INTO home_page_content (id, hero_title, hero_subtitle, hero_description)
        VALUES (1, 'Chào mừng đến với MEDLATEC', 'Hệ thống y tế hàng đầu', 'Chăm sóc sức khỏe toàn diện')
        ON CONFLICT (id) DO NOTHING;
    """)
    print("✅ Home page content inserted")
    
    # Site settings
    print("📝 Inserting site settings...")
    cursor.execute("""
        INSERT INTO site_settings (id, site_name, hotline, email)
        VALUES (1, 'MEDLATEC', '1900-xxxx', 'contact@medlatec.com')
        ON CONFLICT (id) DO NOTHING;
    """)
    print("✅ Site settings inserted")

def verify_tables(cursor):
    """Verify tất cả bảng đã tồn tại"""
    print_header("4. VERIFICATION")
    
    tables_to_check = [
        'users',
        'home_page_content',
        'banners',
        'site_settings',
        'about_page_content',
        'certifications',
        'features',
        'statistics',
        'membership_benefits',
        'news_sections',
        'news_sidebar_widgets',
        'article_cta_section'
    ]
    
    print("📋 Checking tables...")
    cursor.execute("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = ANY(%s)
        ORDER BY table_name;
    """, (tables_to_check,))
    
    existing_tables = [row[0] for row in cursor.fetchall()]
    
    print(f"\n✅ Found {len(existing_tables)}/{len(tables_to_check)} tables:")
    for table in tables_to_check:
        status = "✅" if table in existing_tables else "❌"
        print(f"  {status} {table}")
    
    # Check user count
    if 'users' in existing_tables:
        cursor.execute("SELECT COUNT(*) FROM users;")
        user_count = cursor.fetchone()[0]
        print(f"\n👥 Total users: {user_count}")
        
        cursor.execute("SELECT email, role FROM users LIMIT 5;")
        users = cursor.fetchall()
        print("📋 Sample users:")
        for email, role in users:
            print(f"  - {email} ({role})")

def main():
    print("=" * 60)
    print("  🔧 RESTORE ALL TABLES - USERS + CMS")
    print("=" * 60)
    print(f"\n📡 Connecting to: {DB_CONFIG['host']}")
    print(f"📊 Database: {DB_CONFIG['database']}")
    
    try:
        # Connect
        conn = psycopg2.connect(**DB_CONFIG)
        conn.autocommit = True
        cursor = conn.cursor()
        print("✅ Connected successfully!")
        
        # Execute steps
        create_users_table(cursor)
        create_cms_tables(cursor)
        insert_default_data(cursor)
        verify_tables(cursor)
        
        # Success
        print_header("✅ ALL DONE!")
        print("\n🎉 All tables restored successfully!")
        print("\n📝 Login credentials:")
        print("   Email: admin@doctor.com")
        print("   Password: password123")
        print("\n🌐 Test at: https://doctor-appointment-frontend-ujug.onrender.com")
        print("=" * 60)
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
        exit(1)

if __name__ == '__main__':
    main()
