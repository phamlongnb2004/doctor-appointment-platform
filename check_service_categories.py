#!/usr/bin/env python3
"""
Check service_categories IDs
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
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        cursor.execute("SELECT id, name, slug FROM service_categories ORDER BY id;")
        categories = cursor.fetchall()
        
        print("\nService Categories:")
        for cat in categories:
            print(f"  ID: {cat[0]}, Name: {cat[1]}, Slug: {cat[2]}")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"Lỗi: {e}")

if __name__ == '__main__':
    main()
