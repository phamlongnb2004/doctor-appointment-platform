@echo off
echo Creating news_categories table...
mysql -u root doctor_appointment_db < database/create_news_categories_table.sql
echo Done!
pause
