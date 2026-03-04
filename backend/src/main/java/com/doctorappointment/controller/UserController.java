package com.doctorappointment.controller;

import com.doctorappointment.config.JwtService;
import com.doctorappointment.dto.UpdateProfileRequest;
import com.doctorappointment.model.Doctor;
import com.doctorappointment.model.User;
import com.doctorappointment.service.ImageService;
import com.doctorappointment.service.UserService;
import com.doctorappointment.service.UserSessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletRequest;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@CrossOrigin(
    origins = {
        "http://localhost:3000",
        "http://localhost:5173",
        "https://doctor-appointment-platform-vaff.onrender.com",
        "https://doctor-appointment-frontend-ujug.onrender.com",
        "https://doctor-appointment-frontend.onrender.com"
    },
    allowedHeaders = "*",
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS},
    allowCredentials = "true"
)
public class UserController {
    private final UserService userService;
    private final ImageService imageService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserSessionService userSessionService;

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
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest, HttpServletRequest request) {
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

                        // Generate session ID and register user session
                        String sessionId = UUID.randomUUID().toString();
                        String ipAddress = getClientIP(request);
                        String userAgent = request.getHeader("User-Agent");

                        // Register the user session for online status tracking
                        userSessionService.registerSession(user.getId(), sessionId, ipAddress, userAgent);

                        Map<String, Object> response = new java.util.HashMap<>();
                        response.put("token", token);
                        response.put("id", user.getId());
                        response.put("email", user.getEmail());
                        response.put("firstName", user.getFirstName());
                        response.put("lastName", user.getLastName());
                        response.put("role", user.getRole().name());
                        response.put("profileImage", user.getProfileImage() != null ? user.getProfileImage() : "");
                        response.put("coverImage", user.getCoverImage() != null ? user.getCoverImage() : "");
                        response.put("sessionId", sessionId);
                        
                        // Nếu là DOCTOR, thêm doctorId bằng cách query từ database
                        if (user.getRole() == User.UserRole.DOCTOR) {
                            // Query doctor từ database bằng userId
                            // Tạm thời skip, sẽ fetch từ frontend
                            System.out.println("User is DOCTOR, doctorId will be fetched separately");
                        }

                        return ResponseEntity.ok(response);
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
     * Helper method to get client IP address
     */
    private String getClientIP(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        String xRealIP = request.getHeader("X-Real-IP");
        if (xRealIP != null && !xRealIP.isEmpty()) {
            return xRealIP;
        }
        return request.getRemoteAddr();
    }

    /**
     * Logout endpoint - marks user as offline
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody Map<String, Object> logoutRequest) {
        Long userId = logoutRequest.get("userId") != null ? Long.valueOf(logoutRequest.get("userId").toString()) : null;

        if (userId != null) {
            userSessionService.logout(userId);
            System.out.println("User " + userId + " logged out, marked as offline");
            return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
        }

        return ResponseEntity.badRequest().body(Map.of("error", "User ID required"));
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
     * Debug endpoint to create consultant user
     */
    @PostMapping("/debug/create-consultant")
    public ResponseEntity<?> createConsultant() {
        try {
            // Check if consultant already exists
            Optional<User> existingConsultant = userService.getUserByEmail("consultant@doctor.com");
            if (existingConsultant.isPresent()) {
                return ResponseEntity.ok(Map.of(
                    "message", "Consultant already exists",
                    "user", existingConsultant.get()
                ));
            }

            // Create new consultant user
            User consultant = new User();
            consultant.setEmail("consultant@doctor.com");
            consultant.setPassword(passwordEncoder.encode("password123"));
            consultant.setFirstName("Nguyen");
            consultant.setLastName("Tu Van");
            consultant.setPhone("0987654321");
            consultant.setRole(User.UserRole.CONSULTANT);
            consultant.setActive(true);

            User savedConsultant = userService.registerUser(consultant);

            return ResponseEntity.ok(Map.of(
                "message", "Consultant created successfully",
                "user", savedConsultant
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Debug endpoint to promote user to consultant
     */
    @PostMapping("/debug/promote-consultant/{userId}")
    public ResponseEntity<?> promoteToConsultant(@PathVariable Long userId) {
        try {
            Optional<User> userOpt = userService.getUserById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "User not found"));
            }

            User user = userOpt.get();
            user.setRole(User.UserRole.CONSULTANT);
            
            User updatedUser = userService.updateUser(userId, user);

            return ResponseEntity.ok(Map.of(
                "message", "User promoted to Consultant successfully",
                "userId", userId,
                "newRole", "CONSULTANT",
                "user", updatedUser
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
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
                
                // Chỉ tạo Doctor record khi promote lên DOCTOR
                if (newRole == User.UserRole.DOCTOR) {
                    userService.createDoctorRecord(user);
                }
                
                String roleDisplay = newRole == User.UserRole.ADMIN ? "Admin" : 
                                    newRole == User.UserRole.DOCTOR ? "Bác sĩ" : 
                                    newRole == User.UserRole.CONSULTANT ? "Tư vấn" : "Bệnh nhân";
                
                return ResponseEntity.ok(Map.of(
                        "message", "User promoted to " + roleDisplay + " successfully",
                        "userId", userId,
                        "newRole", newRole.toString()
                ));
            }).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found")));
                    
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Invalid role. Use DOCTOR, ADMIN, or CONSULTANT"));
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

    /**
     * Get online users count - Admin only
     */
    @GetMapping("/online/count")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getOnlineUsersCount() {
        long count = userSessionService.getOnlineUserCount();
        return ResponseEntity.ok(Map.of(
                "onlineCount", count,
                "timestamp", java.time.LocalDateTime.now().toString()
        ));
    }

    /**
     * Get online users - Admin only
     */
    @GetMapping("/online")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getOnlineUsers() {
        List<com.doctorappointment.model.UserSession> onlineSessions = userSessionService.getOnlineUsers();

        List<Map<String, Object>> result = onlineSessions.stream().map(session -> {
            Optional<User> userOpt = userService.getUserById(session.getUserId());
            Map<String, Object> map = new HashMap<>();
            map.put("userId", session.getUserId());
            map.put("sessionId", session.getSessionId());
            map.put("loginTime", session.getLoginTime().toString());
            map.put("lastActivityTime", session.getLastActivityTime().toString());
            map.put("ipAddress", session.getIpAddress() != null ? session.getIpAddress() : "unknown");
            map.put("userName", userOpt.map(u -> u.getFirstName() + " " + u.getLastName()).orElse("Unknown"));
            map.put("userEmail", userOpt.map(User::getEmail).orElse("unknown"));
            map.put("userRole", userOpt.map(u -> u.getRole().name()).orElse("UNKNOWN"));
            return map;
        }).toList();

        return ResponseEntity.ok(result);
    }

    /**
     * Get online status for specific users - Admin only
     */
    @PostMapping("/online/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getUsersOnlineStatus(@RequestBody Map<String, Object> request) {
        @SuppressWarnings("unchecked")
        java.util.List<Long> userIds = ((java.util.List<?>) request.get("userIds"))
                .stream()
                .map(id -> Long.valueOf(id.toString()))
                .toList();

        Map<Long, Boolean> statusMap = userSessionService.getOnlineStatusForUsers(userIds);

        return ResponseEntity.ok(Map.of(
                "statusMap", statusMap,
                "timestamp", java.time.LocalDateTime.now().toString()
        ));
    }

    /**
     * Check if specific user is online
     */
    @GetMapping("/{userId}/online")
    public ResponseEntity<Map<String, Object>> isUserOnline(@PathVariable Long userId) {
        boolean online = userSessionService.isUserOnline(userId);
        return ResponseEntity.ok(Map.of(
                "userId", userId,
                "online", online,
                "timestamp", java.time.LocalDateTime.now().toString()
        ));
    }

    /**
     * Change password endpoint
     */
    @PostMapping("/{id}/change-password")
    public ResponseEntity<?> changePassword(
            @PathVariable Long id,
            @RequestBody Map<String, String> passwordRequest) {
        try {
            String currentPassword = passwordRequest.get("currentPassword");
            String newPassword = passwordRequest.get("newPassword");

            if (currentPassword == null || newPassword == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Vui lòng nhập đầy đủ thông tin"));
            }

            if (newPassword.length() < 6) {
                return ResponseEntity.badRequest().body(Map.of("error", "Mật khẩu mới phải có ít nhất 6 ký tự"));
            }

            User user = userService.getUserById(id)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

            // Verify current password
            if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Mật khẩu hiện tại không đúng"));
            }

            // Update password
            user.setPassword(passwordEncoder.encode(newPassword));
            userService.updateUser(id, user);

            return ResponseEntity.ok(Map.of("message", "Đổi mật khẩu thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Đổi mật khẩu thất bại: " + e.getMessage()));
        }
    }
}
