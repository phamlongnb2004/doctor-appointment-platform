@echo off
echo ========================================
echo Running SQL script on Render PostgreSQL
echo ========================================
echo.

set PGPASSWORD=i6L3iTqvQbmyGY8wHL2inobdtbCm8vCS

psql -h dpg-d7ajsnoule4c739j0pp0-a.singapore-postgres.render.com -p 5432 -U doctor_appointment_user -d doctor_appointment_db_xl6x -f database\create_tables_postgresql.sql

echo.
echo ========================================
echo Done! Check output above for errors.
echo ========================================
pause
