#!/usr/bin/env python3
"""
Script để đảm bảo các bảng CMS tồn tại trên database production
Chạy script này sau mỗi lần deploy
"""

import psycopg2
import os
from urllib.parse import urlparse

def get_db_connection():
    """Lấy connection từ DATABASE_URL environment variable"""
    database_url = os.getenv('DATABASE_URL')
    
    if not database_url:
        # Fallback to individual env vars
        return psycopg2.connect(
            host=os.getenv('DB_HOST', 'localhost'),
            port=os.getenv('DB_PORT', '5432'),
            database=os.getenv('DB_NAME', 'doctor_appointment_db'),
            user=os.getenv('DB_USER', 'postgres'),
            password=os.getenv('DB_PASSWORD', '')
        )
    
    # Parse DATABASE_URL
    result = urlparse(database_url)
    return psycopg2.connect(
        host=result.hostname,
        port=result.port,
        database=result.path[1:],
        user=result.username,
        password=result.password
    )

def check_table_exists(cursor, table_name):
    """Kiểm tra xem bảng có tồn tại không"""
    cursor.execute("""
        SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = %s
        );
    """, (table_name,))
    return cursor.fetchone()[0]

def ensure_cms_tables():
    """Đảm bảo tất cả bảng CMS tồn tại"""
    
    print("🔄 Connecting to database...")
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Đọc SQL file
        print("📖 Reading SQL file...")
        with open('database/ensure_cms_tables.sql', 'r', encoding='utf-8') as f:
            sql = f.read()
        
        # Thực thi SQL
        print("⚙️  Executing SQL...")
        cursor.execute(sql)
        conn.commit()
        
        # Kiểm tra các bảng
        cms_tables = [
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
        
        print("\n✅ Checking CMS tables:")
        for table in cms_tables:
            exists = check_table_exists(cursor, table)
            status = "✅" if exists else "❌"
            print(f"  {status} {table}: {'EXISTS' if exists else 'NOT FOUND'}")
        
        print("\n✅ CMS tables ensured successfully!")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        conn.rollback()
        raise
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    print("=" * 60)
    print("🔧 ENSURE CMS TABLES SCRIPT")
    print("=" * 60)
    
    try:
        ensure_cms_tables()
        print("\n" + "=" * 60)
        print("✅ Script completed successfully!")
        print("=" * 60)
    except Exception as e:
        print("\n" + "=" * 60)
        print(f"❌ Script failed: {e}")
        print("=" * 60)
        exit(1)
