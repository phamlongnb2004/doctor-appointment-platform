@echo off
echo ========================================
echo Quick Fix About Page Localhost URLs
echo ========================================
echo.
echo This will remove localhost URLs from about_page_content
echo.

mysql -u root -p medlatec_db < database\quick_fix_about_localhost.sql

echo.
echo ========================================
echo Done! Now:
echo 1. Go to Admin CMS - About Page
echo 2. Re-upload images for sections that need it
echo ========================================
pause
