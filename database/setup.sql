-- ============================================
-- Doctor Appointment Platform - MySQL Setup
-- ============================================

-- 1. Tạo database
CREATE DATABASE IF NOT EXISTS doctor_appointment_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE doctor_appointment_db;

-- 2. Tạo bảng users
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role ENUM('ADMIN','DOCTOR','PATIENT','CONSULTANT') NOT NULL,
    profile_image LONGTEXT,
    cover_image LONGTEXT,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

-- 3. Tạo bảng doctors
CREATE TABLE IF NOT EXISTS doctors (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    specialization VARCHAR(200),
    consultation_fee DECIMAL(10,2) DEFAULT 0,
    experience_years INT DEFAULT 0,
    rating_score DOUBLE DEFAULT 0,
    review_count INT DEFAULT 0,
    bio TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Tạo bảng appointments
CREATE TABLE IF NOT EXISTS appointments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    appointment_date DATE NOT NULL,
    time_slot VARCHAR(50) NOT NULL,
    notes TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);

-- ============================================
-- TÀI KHOẢN MẶC ĐỊNH
-- ============================================
-- Mật khẩu mặc định cho tất cả tài khoản: password123

-- Admin mặc định
INSERT INTO users (email, password, first_name, last_name, phone, role, created_at, updated_at, active)
VALUES ('admin@doctor.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Admin', 'System', '0123456789', 'ADMIN', NOW(), NOW(), TRUE)
ON DUPLICATE KEY UPDATE first_name = first_name;

-- Bác sĩ mẫu
INSERT INTO users (email, password, first_name, last_name, phone, role, created_at, updated_at, active)
VALUES ('doctor@doctor.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Nguyen Van', 'Doctor', '0987654321', 'DOCTOR', NOW(), NOW(), TRUE)
ON DUPLICATE KEY UPDATE first_name = first_name;

-- Tạo Doctor record cho bác sĩ mẫu
INSERT INTO doctors (user_id, specialization, consultation_fee, experience_years, rating_score, review_count, active)
SELECT u.id, 'Nội tổng quát', 200000, 10, 4.5, 25, TRUE
FROM users u WHERE u.email = 'doctor@doctor.com'
ON DUPLICATE KEY UPDATE specialization = 'Nội tổng quát';

-- Bệnh nhân mẫu
INSERT INTO users (email, password, first_name, last_name, phone, role, created_at, updated_at, active)
VALUES ('patient@doctor.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Le Thi', 'Patient', '0900123456', 'PATIENT', NOW(), NOW(), TRUE)
ON DUPLICATE KEY UPDATE first_name = first_name;

-- Tư vấn viên mẫu
INSERT INTO users (email, password, first_name, last_name, phone, role, created_at, updated_at, active)
VALUES ('consultant@doctor.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Nguyen Van', 'Consultant', '0911222333', 'CONSULTANT', NOW(), NOW(), TRUE)
ON DUPLICATE KEY UPDATE first_name = first_name;

SELECT '=== Setup completed successfully! ===' as status;
SELECT '=== Default Password: password123 ===' as info;
SELECT 'Admin: admin@doctor.com / password123' as admin;
SELECT 'Doctor: doctor@doctor.com / password123' as doctor;
SELECT 'Patient: patient@doctor.com / password123' as patient;
SELECT 'Consultant: consultant@doctor.com / password123' as consultant;
