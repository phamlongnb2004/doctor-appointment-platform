@echo off
echo Adding gallery images field to medical_services table...
mysql -u root doctor_appointment_db < database/add_service_images_gallery.sql
echo Done!
pause
