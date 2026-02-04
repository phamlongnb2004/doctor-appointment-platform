@echo off
echo Creating news_sections table...
mysql -u root doctor_appointment_db < database/create_news_sections_table.sql
if %errorlevel% == 0 (
    echo News sections table created successfully!
) else (
    echo Error creating news sections table!
)
pause
