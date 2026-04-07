package com.doctorappointment.config;

import com.doctorappointment.model.Doctor;
import com.doctorappointment.model.User;
import com.doctorappointment.model.User.UserRole;
import com.doctorappointment.repository.DoctorRepository;
import com.doctorappointment.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;


@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        System.out.println("=== DataSeeder starting ===");
        try {
            // Wait a bit for Hibernate to finish creating tables
            Thread.sleep(2000);
            
            // Always create admin user if not exists
            createAdminIfNotExists();

            // Create sample doctors if no doctors exist
            System.out.println("Doctor count: " + doctorRepository.count());
            if (doctorRepository.count() == 0) {
                System.out.println("Creating sample doctors...");
                User doctorUser1 = createUserIfNotExists("doctor1@hospital.com", "Dr. Nguyen Van A", "0123456789", UserRole.DOCTOR);
                User doctorUser2 = createUserIfNotExists("doctor2@hospital.com", "Dr. Tran Thi B", "0987654321", UserRole.DOCTOR);
                User doctorUser3 = createUserIfNotExists("doctor3@hospital.com", "Dr. Le Van C", "0111222333", UserRole.DOCTOR);

                createDoctorIfNotExists(doctorUser1, "Cardiology", "LIC-001", "Experienced cardiologist with 15 years of experience.", 4.8, 500000, 15);
                createDoctorIfNotExists(doctorUser2, "Dermatology", "LIC-002", "Specialist in skin diseases and cosmetic dermatology.", 4.6, 350000, 10);
                createDoctorIfNotExists(doctorUser3, "General Medicine", "LIC-003", "General practitioner for routine health checkups.", 4.5, 300000, 8);

                System.out.println("Sample doctors created!");
            } else {
                System.out.println("Doctors already exist, skipping creation");
            }

            System.out.println("Data seeding completed!");
        } catch (Exception e) {
            System.out.println("=== DataSeeder ERROR ===");
            System.out.println("Error: " + e.getMessage());
            System.out.println("This is normal on first deployment - tables are being created");
            // Don't print full stack trace, just log the error
        }
    }

    @Transactional
    private void createAdminIfNotExists() {
        System.out.println("Checking for admin user...");
        if (userRepository.findByEmail("admin@doctor.com").isEmpty()) {
            System.out.println("Admin not found, creating admin user...");
            try {
                User admin = new User();
                admin.setEmail("admin@doctor.com");
                admin.setPassword(passwordEncoder.encode("password123"));
                admin.setFirstName("Admin");
                admin.setLastName("System");
                admin.setPhone("0123456789");
                admin.setRole(UserRole.ADMIN);
                admin.setCreatedAt(LocalDateTime.now());
                admin.setUpdatedAt(LocalDateTime.now());
                admin.setActive(true);
                User savedAdmin = userRepository.save(admin);
                System.out.println(">>> Admin user created: admin@doctor.com / password123 - ID: " + savedAdmin.getId());
            } catch (Exception e) {
                System.out.println("ERROR creating admin: " + e.getMessage());
                e.printStackTrace();
            }
        } else {
            System.out.println("Admin user already exists, ensuring password is correct...");
            try {
                // Always update admin password to ensure it matches Spring's BCrypt encoding
                userRepository.findByEmail("admin@doctor.com").ifPresent(admin -> {
                    String newPasswordHash = passwordEncoder.encode("password123");
                    System.out.println("Old password hash: " + admin.getPassword());
                    System.out.println("New password hash: " + newPasswordHash);
                    admin.setPassword(newPasswordHash);
                    admin.setUpdatedAt(LocalDateTime.now());
                    userRepository.save(admin);
                    System.out.println(">>> Admin password updated successfully!");
                });
            } catch (Exception e) {
                System.out.println("ERROR updating admin password: " + e.getMessage());
                e.printStackTrace();
            }
        }
    }

    private User createUserIfNotExists(String email, String fullName, String phone, UserRole role) {
        return userRepository.findByEmail(email).orElseGet(() -> {
            String[] names = fullName.split(" ", 2);
            String firstName = names.length > 1 ? names[0] : fullName;
            String lastName = names.length > 1 ? names[1] : "";

            User user = new User();
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode("password123"));
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setPhone(phone);
            user.setRole(role);
            user.setCreatedAt(LocalDateTime.now());
            user.setUpdatedAt(LocalDateTime.now());
            user.setActive(true);
            User savedUser = userRepository.save(user);
            System.out.println(">>> Created user: " + email + " / password123 - ID: " + savedUser.getId());
            return savedUser;
        });
    }

    private void createDoctorIfNotExists(User user, String specialization, String license, String bio, double rating, int fee, int experience) {
        boolean exists = doctorRepository.findAll().stream()
                .anyMatch(d -> d.getUser().getId().equals(user.getId()));
        if (exists) return;

        Doctor doctor = new Doctor();
        doctor.setUser(user);
        doctor.setSpecialization(specialization);
        doctor.setLicenseNumber(license);
        doctor.setBiography(bio);
        doctor.setRatingScore(rating);
        doctor.setConsultationFee(fee);
        doctor.setExperienceYears(experience);
        doctor.setReviewCount(0);
        doctor.setActive(true);
        doctor.setCreatedAt(LocalDateTime.now());
        doctor.setUpdatedAt(LocalDateTime.now());
        doctorRepository.save(doctor);
    }
}
