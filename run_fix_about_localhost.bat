@echo off
echo Fixing localhost URLs in about_page_content...
mysql -h autorack.proxy.rlwy.net -P 28461 -u root -pqBqJPxqPPqPqPqPqPqPqPqPqPqPq railway < database\fix_about_localhost_urls.sql
echo Done!
pause
