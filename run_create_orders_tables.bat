@echo off
echo Creating orders tables...
mysql -u root doctor_appointment_db < database/create_orders_tables.sql
echo Done!
pause
