-- Reset admin password to password123
UPDATE doctor_appointment_db.users
SET password = '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG'
WHERE email = 'admin@doctor.com';
