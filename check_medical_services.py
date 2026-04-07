#!/usr/bin/env python3
"""
Check if medical_services table exists
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
    print("Kiểm tra bảng medical_services...")
    print("=" * 50)
    
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        # Check if table exists
        cursor.execute("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'medical_services'
            );
        """)
        exists = cursor.fetchone()[0]
        
        if exists:
            print("\n✓ Bảng medical_services TỒN TẠI")
            
            # Get column info
            cursor.execute("""
                SELECT column_name, data_type, is_nullable
                FROM information_schema.columns
                WHERE table_name = 'medical_services'
                ORDER BY ordinal_position;
            """)
            columns = cursor.fetchall()
            print("\nCác cột:")
            for col in columns:
                print(f"  - {col[0]} ({col[1]}) - Nullable: {col[2]}")
                
            # Count rows
            cursor.execute("SELECT COUNT(*) FROM medical_services;")
            count = cursor.fetchone()[0]
            print(f"\nSố dòng: {count}")
        else:
            print("\n✗ Bảng medical_services KHÔNG TỒN TẠI")
            print("\nCần tạo bảng này!")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"\n✗ Lỗi: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    main()
