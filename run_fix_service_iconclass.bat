@echo off
echo Fixing Service iconClass column...
mysql -u root doctor_appointment_db < database/fix_service_iconclass_nullable.sql
echo Done!
pause
