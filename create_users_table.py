#!/usr/bin/env python3
"""
Script to create ONLY users table
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
    print("Creating users table...")
    print("=" * 50)
    
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        conn.autocommit = True
        cursor = conn.cursor()
        
        # Drop if exists
        print("Dropping users table if exists...")
        cursor.execute("DROP TABLE IF EXISTS users CASCADE;")
        print("✓ Dropped")
        
        # Create users table
        print("Creating users table...")
        cursor.execute("""
            CREATE TABLE users (
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
        print("✓ Users table created")
        
        # Create indexes
        print("Creating indexes...")
        cursor.execute("CREATE INDEX idx_users_email ON users(email);")
        cursor.execute("CREATE INDEX idx_users_role ON users(role);")
        print("✓ Indexes created")
        
        # Insert admin
        print("Inserting admin user...")
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
            );
        """)
        print("✓ Admin user created")
        
        # Verify
        cursor.execute("SELECT id, email, role FROM users;")
        users = cursor.fetchall()
        print("\n✓ Verification:")
        for user in users:
            print(f"  - ID: {user[0]}, Email: {user[1]}, Role: {user[2]}")
        
        print("\n" + "=" * 50)
        print("✓ SUCCESS!")
        print("=" * 50)
        print("\nAdmin credentials:")
        print("  Email: admin@doctor.com")
        print("  Password: password123")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"\n✗ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    main()
