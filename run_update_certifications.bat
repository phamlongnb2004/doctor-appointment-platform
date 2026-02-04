@echo off
echo Updating certifications table...
mysql -u root doctor_appointment_db < database\update_certifications_add_fields.sql
if %errorlevel% equ 0 (
    echo Success! Certifications table updated.
) else (
    echo Error updating certifications table.
)
pause
