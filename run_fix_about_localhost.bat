@echo off
echo ========================================
echo Fix About Page Localhost URLs
echo ========================================
echo.
echo This will remove localhost image URLs from about_page_content
echo You will need to re-upload images via CMS after running this
echo.
pause

mysql -u root -p medlatec_db < database\fix_about_localhost_to_cloudinary.sql

echo.
echo ========================================
echo Done! 
echo.
echo Next steps:
echo 1. Go to Admin CMS - About Page
echo 2. Upload images again for sections with localhost URLs
echo 3. New uploads will use Cloudinary automatically
echo ========================================
pause
