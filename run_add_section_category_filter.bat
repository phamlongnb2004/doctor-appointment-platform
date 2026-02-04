@echo off
echo Running SQL script to add category filter to news sections...
mysql -u root doctor_appointment_db < database\add_news_section_category_filter.sql
if %errorlevel% equ 0 (
    echo Success! Category filter column added to news_sections table.
) else (
    echo Error running SQL script!
)
pause
