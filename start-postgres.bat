@echo off
echo Starting PostgreSQL with Docker...
docker-compose up -d
echo.
echo PostgreSQL is running!
echo Connection: localhost:5432
echo Database: doctor_appointment_db
echo Username: postgres
echo Password: postgres
echo.
pause
