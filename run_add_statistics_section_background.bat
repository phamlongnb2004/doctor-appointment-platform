@echo off
echo Adding statistics_background_image column to site_settings table...
mysql -u root doctor_appointment_db < database/add_statistics_section_background.sql
echo Done!
pause
