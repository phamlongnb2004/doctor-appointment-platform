@echo off
echo Running add_header_settings.sql...
mysql -u root doctor_appointment_db < database\add_header_settings.sql
if %errorlevel% equ 0 (
    echo Header settings columns added successfully!
) else (
    echo Error adding header settings columns!
)
pause
