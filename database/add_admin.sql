INSERT INTO doctor_appointment_db.users (email, password, first_name, last_name, phone, role, created_at, updated_at, active)
SELECT 'admin@doctor.com', password, 'Admin', 'System', '0123456789', 'ADMIN', NOW(), NOW(), TRUE
FROM (SELECT '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG' as password) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM doctor_appointment_db.users WHERE email = 'admin@doctor.com');
