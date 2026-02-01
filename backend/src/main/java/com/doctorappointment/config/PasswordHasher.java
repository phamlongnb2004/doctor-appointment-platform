package com.doctorappointment.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class PasswordHasher implements CommandLineRunner {
    
    private final PasswordEncoder passwordEncoder;
    
    public PasswordHasher(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }
    
    @Override
    public void run(String... args) {
        String rawPassword = "password123";
        String encodedPassword = passwordEncoder.encode(rawPassword);
        System.out.println("=== PASSWORD HASH FOR 'password123' ===");
        System.out.println(encodedPassword);
        System.out.println("=======================================");
    }
}
