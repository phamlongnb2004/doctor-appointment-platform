@echo off
echo Adding URL column to specialties table...
mysql -u root doctor_appointment_db < database/add_specialty_url_column.sql
echo Done!
pause
