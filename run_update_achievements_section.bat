@echo off
echo Running achievements section update...
mysql -u root doctor_appointment_db < database\update_achievements_section.sql
echo Done!
pause
