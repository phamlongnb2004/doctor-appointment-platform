@echo off
echo Creating About Page Content table (Simple JSON version)...
mysql -u root doctor_appointment_db < database/create_about_content_simple.sql
if %errorlevel% equ 0 (
    echo About Page Content table created successfully!
) else (
    echo Error creating About Page Content table!
)
pause
