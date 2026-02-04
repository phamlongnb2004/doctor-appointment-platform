@echo off
echo Updating existing banners to home page...
mysql -u root doctor_appointment_db < database\update_existing_banners_to_home.sql
echo Done! All existing banners now have page = 'home'
pause
