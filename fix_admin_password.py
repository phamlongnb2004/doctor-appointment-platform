#!/usr/bin/env python3
"""
Fix admin password by generating new BCrypt hash
"""
import psycopg2
import bcrypt

DB_CONFIG = {
    'host': 'dpg-d7ajsnoule4c739j0pp0-a.singapore-postgres.render.com',
    'port': 5432,
    'database': 'doctor_appointment_db_xl6x',
    'user': 'doctor_appointment_user',
    'password': 'i6L3iTqvQbmyGY8wHL2inobdtbCm8vCS'
}

def main():
    print("=" * 50)
    print("Fixing admin password...")
    print("=" * 50)
    
    # Generate BCrypt hash for "password123"
    password = "password123"
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    hashed_str = hashed.decode('utf-8')
    
    print(f"\nGenerated BCrypt hash: {hashed_str}")
    
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        conn.autocommit = True
        cursor = conn.cursor()
        
        # Update admin password
        print("\nUpdating admin password...")
        cursor.execute("""
            UPDATE users 
            SET password = %s, updated_at = CURRENT_TIMESTAMP
            WHERE email = 'admin@doctor.com';
        """, (hashed_str,))
        
        print("✓ Password updated")
        
        # Verify
        cursor.execute("""
            SELECT id, email, role, password 
            FROM users 
            WHERE email = 'admin@doctor.com';
        """)
        user = cursor.fetchone()
        
        if user:
            print("\n✓ Verification:")
            print(f"  ID: {user[0]}")
            print(f"  Email: {user[1]}")
            print(f"  Role: {user[2]}")
            print(f"  Password hash: {user[3][:50]}...")
            
            # Test password
            stored_hash = user[3].encode('utf-8')
            if bcrypt.checkpw(password.encode('utf-8'), stored_hash):
                print("\n✓ Password verification: SUCCESS!")
            else:
                print("\n✗ Password verification: FAILED!")
        
        print("\n" + "=" * 50)
        print("✓ DONE!")
        print("=" * 50)
        print("\nLogin credentials:")
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
