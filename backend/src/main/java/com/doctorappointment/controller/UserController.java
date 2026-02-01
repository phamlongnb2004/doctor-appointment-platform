package com.doctorappointment.controller;

import com.doctorappointment.config.JwtService;
import com.doctorappointment.dto.UpdateProfileRequest;
import com.doctorappointment.model.User;
import com.doctorappointment.service.ImageService;
import com.doctorappointment.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final ImageService imageService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    // Secret key for admin operations - change this to your own secret
    private static final String SECRET_KEY = "mySuperSecretAdminKey2026";

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            // Force PATIENT role for registration - no one can register as DOCTOR or ADMIN
            user.setRole(User.UserRole.PATIENT);
            
            User registeredUser = userService.registerUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(registeredUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        var user = userService.getUserById(id);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UpdateProfileRequest userDetails) {
        try {
            User updatedUser = userService.updateUser(id, userDetails);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        System.out.println("=== LOGIN ATTEMPT ===");
        System.out.println("Email: " + email);

        return userService.getUserByEmail(email)
                .map(user -> {
                    System.out.println("User found: " + user.getEmail());
                    System.out.println("Stored password hash: " + user.getPassword());
                    System.out.println("User role: " + user.getRole());
                    System.out.println("Password matches: " + userService.validatePassword(password, user.getPassword()));

                    if (userService.validatePassword(password, user.getPassword())) {
                        // Generate JWT token
                        String token = jwtService.generateToken(user.getId(), user.getEmail(), user.getRole().name());
                        System.out.println("Token generated for user: " + email);

                        return ResponseEntity.ok(Map.of(
                                "token", token,
                                "id", user.getId(),
                                "email", user.getEmail(),
                                "firstName", user.getFirstName(),
                                "lastName", user.getLastName(),
                                "role", user.getRole().name(),
                                "profileImage", user.getProfileImage() != null ? user.getProfileImage() : "",
                                "coverImage", user.getCoverImage() != null ? user.getCoverImage() : ""
                        ));
                    } else {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid email or password"));
                    }
                })
                .orElseGet(() -> {
                    System.out.println("User NOT found with email: " + email);
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid email or password"));
                });
    }

    /**
     * Debug endpoint to check users in database
     */
    @GetMapping("/debug/users")
    public ResponseEntity<?> debugUsers() {
        List<User> users = userService.getAllUsers();
        List<Map<String, Object>> userInfo = users.stream().map(user -> {
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", user.getId());
            map.put("email", user.getEmail());
            map.put("role", user.getRole().name());
            map.put("passwordLength", user.getPassword().length());
            map.put("passwordPrefix", user.getPassword().substring(0, Math.min(10, user.getPassword().length())));
            return map;
        }).toList();
        return ResponseEntity.ok(userInfo);
    }

    /**
     * Debug endpoint to test password
     */
    @GetMapping("/debug/test-password")
    public ResponseEntity<?> testPassword() {
        return userService.getUserByEmail("admin@doctor.com")
                .map(user -> {
                    boolean matches = userService.validatePassword("password123", user.getPassword());
                    return ResponseEntity.ok(Map.of(
                        "email", user.getEmail(),
                        "passwordHash", user.getPassword(),
                        "passwordHashLength", user.getPassword().length(),
                        "matches", matches
                    ));
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Admin not found")));
    }

    /**
     * SECRET ENDPOINT - Only admin with correct secret key can promote users
     * Usage: POST /users/{userId}/promote?secret=mySuperSecretAdminKey2026&role=DOCTOR
     */
    @PostMapping("/{userId}/promote")
    public ResponseEntity<?> promoteUser(
            @PathVariable Long userId,
            @RequestParam String secret,
            @RequestParam String role) {
        
        // Verify secret key
        if (!SECRET_KEY.equals(secret)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Invalid secret key"));
        }
        
        try {
            User.UserRole newRole = User.UserRole.valueOf(role.toUpperCase());
            
            return userService.getUserById(userId).map(user -> {
                user.setRole(newRole);
                userService.updateUser(userId, user);
                
                // If promoting to DOCTOR, create Doctor record
                if (newRole == User.UserRole.DOCTOR) {
                    userService.createDoctorRecord(user);
                }
                
                String roleDisplay = newRole == User.UserRole.ADMIN ? "Admin" : 
                                    newRole == User.UserRole.DOCTOR ? "Bác sĩ" : "Bệnh nhân";
                
                return ResponseEntity.ok(Map.of(
                        "message", "User promoted to " + roleDisplay + " successfully",
                        "userId", userId,
                        "newRole", newRole.toString()
                ));
            }).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found")));
                    
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Invalid role. Use DOCTOR or ADMIN"));
        }
    }

    /**
     * Debug endpoint - test if upload URL is accessible
     */
    @GetMapping("/{id}/profile-image/test")
    public ResponseEntity<?> testProfileImageEndpoint(@PathVariable Long id) {
        System.out.println("=== TEST ENDPOINT HIT ===");
        System.out.println("User ID: " + id);
        return ResponseEntity.ok(Map.of(
                "message", "Endpoint accessible",
                "userId", id,
                "timestamp", System.currentTimeMillis()
        ));
    }

    /**
     * Upload profile image - User can upload their own, Admin can upload for anyone
     */
    @PostMapping("/{id}/profile-image")
    public ResponseEntity<?> uploadProfileImage(
            @PathVariable Long id,
            @RequestParam("image") MultipartFile file) {
        System.out.println("=== UPLOAD PROFILE IMAGE ===");
        System.out.println("User ID: " + id);
        System.out.println("File name: " + (file != null ? file.getOriginalFilename() : "null"));
        System.out.println("File size: " + (file != null ? file.getSize() : "null"));
        System.out.println("File content type: " + (file != null ? file.getContentType() : "null"));
        try {
            String imageUrl = imageService.uploadProfileImage(id, file);
            System.out.println("Image URL: " + imageUrl);

            // Update user with new profile image URL
            User user = userService.getUserById(id).orElse(null);
            if (user != null) {
                user.setProfileImage(imageUrl);
                userService.updateUser(id, user);
                System.out.println("User profile image updated");
            }

            return ResponseEntity.ok(Map.of(
                    "message", "Profile image uploaded successfully",
                    "profileImage", imageUrl
            ));
        } catch (Exception e) {
            System.out.println("ERROR uploading profile image: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Upload cover image - User can upload their own, Admin can upload for anyone
     */
    @PostMapping("/{id}/cover-image")
    public ResponseEntity<?> uploadCoverImage(
            @PathVariable Long id,
            @RequestParam("image") MultipartFile file) {
        System.out.println("=== UPLOAD COVER IMAGE ===");
        System.out.println("User ID: " + id);
        System.out.println("File name: " + (file != null ? file.getOriginalFilename() : "null"));
        System.out.println("File size: " + (file != null ? file.getSize() : "null"));
        System.out.println("File content type: " + (file != null ? file.getContentType() : "null"));
        try {
            String imageUrl = imageService.uploadCoverImage(id, file);
            System.out.println("Image URL: " + imageUrl);

            // Update user with new cover image URL
            User user = userService.getUserById(id).orElse(null);
            if (user != null) {
                user.setCoverImage(imageUrl);
                userService.updateUser(id, user);
                System.out.println("User cover image updated");
            }

            return ResponseEntity.ok(Map.of(
                    "message", "Cover image uploaded successfully",
                    "coverImage", imageUrl
            ));
        } catch (Exception e) {
            System.out.println("ERROR uploading cover image: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Get all doctors - Admin only
     */
    @GetMapping("/doctors")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllDoctors() {
        return ResponseEntity.ok(userService.getAllUsers().stream()
                .filter(user -> user.getRole() == User.UserRole.DOCTOR)
                .toList());
    }

    /**
     * Get all patients - Admin only
     */
    @GetMapping("/patients")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllPatients() {
        return ResponseEntity.ok(userService.getAllUsers().stream()
                .filter(user -> user.getRole() == User.UserRole.PATIENT)
                .toList());
    }
}
