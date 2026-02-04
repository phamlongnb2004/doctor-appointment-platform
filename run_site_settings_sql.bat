@echo off
echo Running site_settings SQL script...
mysql -u root doctor_appointment_db < database/create_site_settings.sql
if %errorlevel% equ 0 (
    echo Site settings table created successfully!
) else (
    echo Error creating site settings table!
)
pause
