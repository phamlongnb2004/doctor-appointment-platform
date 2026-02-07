@echo off
echo ========================================
echo IMPORT DATA TO RAILWAY MYSQL
echo ========================================
echo.

set MYSQL_HOST=gondola.proxy.rlwy.net
set MYSQL_PORT=43703
set MYSQL_USER=root
set MYSQL_PASS=ibRVktBWedqUAdOKpQBInXvYZjCWHnVN
set MYSQL_DB=railway

echo Step 1: Export essential data from local...
mysqldump -u root doctor_appointment_db ^
  users specialties doctors appointments ^
  medical_services news_articles news_categories ^
  site_settings banners certifications features ^
  --no-create-info --skip-triggers --set-gtid-purged=OFF ^
  --no-tablespaces --default-character-set=utf8mb4 ^
  > essential_data.sql

echo.
echo Step 2: Import to Railway...
echo WARNING: This will add data to existing tables
echo Press Ctrl+C to cancel, or
pause

mysql -h %MYSQL_HOST% -P %MYSQL_PORT% -u %MYSQL_USER% -p%MYSQL_PASS% %MYSQL_DB% < essential_data.sql

echo.
echo ========================================
echo DONE!
echo ========================================
pause
