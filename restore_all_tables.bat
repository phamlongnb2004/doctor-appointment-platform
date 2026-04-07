@echo off
echo ============================================================
echo   RESTORE ALL TABLES - USERS + CMS
echo ============================================================
echo.
echo This script will restore all tables on Render PostgreSQL
echo.
echo Database: dpg-d7ajsnoule4c739j0pp0-a.singapore-postgres.render.com
echo.
pause

echo.
echo Installing psycopg2 if needed...
pip install psycopg2-binary

echo.
echo Running restore script...
python restore_all_tables.py

echo.
echo ============================================================
echo   DONE!
echo ============================================================
pause
