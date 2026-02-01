package com.doctorappointment.service;

import com.doctorappointment.dto.UpdateProfileRequest;
import com.doctorappointment.model.Doctor;
import com.doctorappointment.model.User;
import com.doctorappointment.repository.DoctorRepository;
import com.doctorappointment.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public User registerUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        // Save user - role is already set before calling this method
        User savedUser = userRepository.save(user);
        
        return savedUser;
    }

    @Transactional
    public void createDoctorRecord(User user) {
        if (doctorRepository.findByUserId(user.getId()).isPresent()) {
            // Doctor record already exists
            return;
        }
        
        Doctor doctor = Doctor.builder()
                .user(user)
                .specialization("Chưa cập nhật")
                .consultationFee(0)
                .experienceYears(0)
                .ratingScore(0.0)
                .reviewCount(0)
                .active(true)
                .build();
        doctorRepository.save(doctor);
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateUser(Long id, User userDetails) {
        return userRepository.findById(id).map(user -> {
            user.setFirstName(userDetails.getFirstName());
            user.setLastName(userDetails.getLastName());
            user.setPhone(userDetails.getPhone());
            user.setProfileImage(userDetails.getProfileImage());
            user.setCoverImage(userDetails.getCoverImage());
            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateUser(Long id, UpdateProfileRequest userDetails) {
        return userRepository.findById(id).map(user -> {
            if (userDetails.getFirstName() != null) {
                user.setFirstName(userDetails.getFirstName());
            }
            if (userDetails.getLastName() != null) {
                user.setLastName(userDetails.getLastName());
            }
            if (userDetails.getPhone() != null) {
                user.setPhone(userDetails.getPhone());
            }
            if (userDetails.getProfileImage() != null) {
                user.setProfileImage(userDetails.getProfileImage());
            }
            if (userDetails.getCoverImage() != null) {
                user.setCoverImage(userDetails.getCoverImage());
            }
            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public boolean validatePassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }
}
