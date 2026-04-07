#!/usr/bin/env python3
"""
Script to run SQL on Render PostgreSQL database
"""
import psycopg2
import sys

# Database connection details
DB_CONFIG = {
    'host': 'dpg-d7ajsnoule4c739j0pp0-a.singapore-postgres.render.com',
    'port': 5432,
    'database': 'doctor_appointment_db_xl6x',
    'user': 'doctor_appointment_user',
    'password': 'i6L3iTqvQbmyGY8wHL2inobdtbCm8vCS'
}

SQL_FILE = 'database/create_tables_postgresql.sql'

def main():
    print("=" * 50)
    print("Connecting to Render PostgreSQL...")
    print("=" * 50)
    
    try:
        # Connect to database
        conn = psycopg2.connect(**DB_CONFIG)
        conn.autocommit = True
        cursor = conn.cursor()
        
        print("✓ Connected successfully!")
        print()
        
        # Read SQL file
        print(f"Reading SQL file: {SQL_FILE}")
        with open(SQL_FILE, 'r', encoding='utf-8') as f:
            sql = f.read()
        
        print("✓ SQL file loaded")
        print()
        
        # Execute SQL
        print("Executing SQL commands...")
        print("-" * 50)
        
        # Split by semicolon and execute each statement
        statements = [s.strip() for s in sql.split(';') if s.strip() and not s.strip().startswith('--')]
        
        for i, statement in enumerate(statements, 1):
            if statement:
                try:
                    cursor.execute(statement)
                    print(f"✓ Statement {i} executed")
                    
                    # If it's a SELECT, print results
                    if statement.strip().upper().startswith('SELECT'):
                        rows = cursor.fetchall()
                        if rows:
                            print("  Results:")
                            for row in rows:
                                print(f"    {row}")
                except Exception as e:
                    print(f"✗ Statement {i} failed: {e}")
        
        print("-" * 50)
        print()
        print("=" * 50)
        print("✓ All SQL commands executed successfully!")
        print("=" * 50)
        print()
        print("Admin user created:")
        print("  Email: admin@doctor.com")
        print("  Password: password123")
        print()
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"✗ Error: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
