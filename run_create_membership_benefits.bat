@echo off
echo Creating membership_benefits table...
Get-Content database\create_membership_benefits_table.sql | mysql -u root doctor_appointment_db
echo Done!
pause
