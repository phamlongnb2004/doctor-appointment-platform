@echo off
echo Adding category column to news_articles table...
mysql -u root doctor_appointment_db < database/add_news_category.sql
echo Done!
pause
