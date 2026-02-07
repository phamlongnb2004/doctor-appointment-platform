@echo off
echo ========================================
echo Debug Newsletter 404 Error on Railway
echo ========================================
echo.
echo This will check if newsletter_subscriptions table exists
echo and create it if missing.
echo.
echo IMPORTANT: You need Railway MySQL credentials
echo.
pause

set /p MYSQL_HOST="Enter Railway MySQL Host (e.g., containers-us-west-xxx.railway.app): "
set /p MYSQL_PORT="Enter Railway MySQL Port (e.g., 6543): "
set /p MYSQL_USER="Enter Railway MySQL Username: "
set /p MYSQL_PASSWORD="Enter Railway MySQL Password: "
set /p MYSQL_DATABASE="Enter Railway MySQL Database: "

echo.
echo Connecting to Railway MySQL...
echo.

mysql -h %MYSQL_HOST% -P %MYSQL_PORT% -u %MYSQL_USER% -p%MYSQL_PASSWORD% %MYSQL_DATABASE% < debug_newsletter_404.sql

echo.
echo ========================================
echo Done! Check output above for results.
echo ========================================
pause
