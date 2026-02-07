@echo off
echo Removing unused fields from medical_services table...
mysql -u root doctor_appointment_db < database/remove_medical_service_unused_fields.sql
echo Done!
pause
