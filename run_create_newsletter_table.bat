@echo off
echo ========================================
echo Creating newsletter_subscriptions table
echo ========================================
echo.

mysql -h gondola.proxy.rlwy.net -P 43703 -u root -p railway < database/create_newsletter_subscriptions.sql

echo.
echo ========================================
echo Done! Press any key to exit...
echo ========================================
pause
