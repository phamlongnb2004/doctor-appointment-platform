@echo off
echo Adding bank account settings to database...
mysql -u root doctor_appointment_db < database/add_bank_account_settings.sql
echo Done!
pause
