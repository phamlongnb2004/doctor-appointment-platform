@echo off
echo Inserting About Page sample data...
mysql -h autorack.proxy.rlwy.net -P 28461 -u root -pqBqJPxqPPqPqPqPqPqPqPqPqPqPq railway < database\insert_about_page_sample_data.sql
echo Done!
pause
