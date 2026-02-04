@echo off
echo Creating About Page tables...
mysql -u root doctor_appointment_db < database/create_about_page_tables.sql
if %errorlevel% equ 0 (
    echo About Page tables created successfully!
) else (
    echo Error creating About Page tables!
)
pause
