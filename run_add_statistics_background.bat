@echo off
echo Adding background_image column to statistics table...
mysql -u root doctor_appointment_db < database/add_statistics_background.sql
echo Done!
pause
