@echo off
echo Fixing icon column size in database...
mysql -u root -p < database\fix_icon_column_size.sql
echo Done!
pause
