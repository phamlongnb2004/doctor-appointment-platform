@echo off
echo Adding text_color column to statistics table...
mysql -u root doctor_appointment_db < database\add_statistics_text_color.sql
if %errorlevel% equ 0 (
    echo Success! text_color column added to statistics table.
) else (
    echo Error adding text_color column.
)
pause
