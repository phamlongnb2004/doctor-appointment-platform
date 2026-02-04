@echo off
echo Checking news_sections layout_type...
mysql -u root doctor_appointment_db -e "SELECT id, name, title, layout_type FROM news_sections;"
pause
