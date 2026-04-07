#!/usr/bin/env python3
"""
Script to verify tables exist in Render PostgreSQL
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
    print("Verifying tables in PostgreSQL...")
    print("=" * 50)
    
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        # Check all tables
        cursor.execute("""
            SELECT table_schema, table_name 
            FROM information_schema.tables 
            WHERE table_type = 'BASE TABLE'
            AND table_schema NOT IN ('pg_catalog', 'information_schema')
            ORDER BY table_schema, table_name;
        """)
        
        tables = cursor.fetchall()
        
        if tables:
            print("\n✓ Found tables:")
            for schema, table in tables:
                print(f"  - {schema}.{table}")
        else:
            print("\n✗ No tables found!")
        
        # Check users table specifically
        print("\n" + "=" * 50)
        print("Checking 'users' table...")
        print("=" * 50)
        
        cursor.execute("""
            SELECT COUNT(*) FROM users;
        """)
        count = cursor.fetchone()[0]
        print(f"✓ Users table exists with {count} rows")
        
        # Show users
        cursor.execute("""
            SELECT id, email, role FROM users;
        """)
        users = cursor.fetchall()
        print("\nUsers:")
        for user in users:
            print(f"  - ID: {user[0]}, Email: {user[1]}, Role: {user[2]}")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"\n✗ Error: {e}")

if __name__ == '__main__':
    main()
