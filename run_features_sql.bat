@echo off
echo Creating features table in database...
echo.
echo Please enter your MySQL root password when prompted.
echo.
mysql -u root -p doctor_appointment_db < database\create_features_table.sql
echo.
echo Done! Press any key to exit.
pause
