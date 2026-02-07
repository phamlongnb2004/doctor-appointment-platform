@echo off
echo Running medical services tables creation...
mysql -u root doctor_appointment_db < database/create_medical_services_tables.sql
echo Done!
pause
