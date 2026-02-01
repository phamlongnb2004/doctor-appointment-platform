package com.doctorappointment.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.nio.file.Files;
import java.util.Map;

@RestController
@RequestMapping("/test")
public class TestController {

    @GetMapping("/public")
    public ResponseEntity<Map<String, String>> publicEndpoint() {
        System.out.println("=== TEST ENDPOINT CALLED ===");
        return ResponseEntity.ok(Map.of("message", "This is a public endpoint - SUCCESS!"));
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        System.out.println("=== HEALTH ENDPOINT CALLED ===");
        return ResponseEntity.ok(Map.of("status", "OK", "message", "Server is running"));
    }

    // Simple test without any dependencies
    @GetMapping("/simple")
    public ResponseEntity<String> simple() {
        return ResponseEntity.ok("Simple test works!");
    }

    // Simple test with single path variable
    @GetMapping("/simple-image/{userId}")
    public ResponseEntity<?> simpleImage(java.lang.String userId) {
        System.out.println("=== simpleImage called ===");
        System.out.println("userId: " + userId);
        return ResponseEntity.ok(Map.of("userId", userId, "message", "Endpoint works"));
    }

    // Debug endpoint to check if image endpoint works
    @GetMapping("/check-images")
    public ResponseEntity<?> checkImages() {
        System.out.println("=== checkImages called ===");
        // Check if file exists
        String filePath = "D:/DoAn/doctor-appointment-platform/uploads/profiles/13/217cc3c7-c263-4f9d-8175-a25aaaa5f2d6.png";
        java.io.File file = new java.io.File(filePath);
        boolean exists = file.exists();
        System.out.println("File exists: " + exists);
        return ResponseEntity.ok(Map.of(
            "message", "Check completed",
            "fileExists", exists,
            "filePath", filePath
        ));
    }

    // Test profile image reading directly
    @GetMapping("/get-profile-image/{userId}/{fileName}")
    public ResponseEntity<?> getProfileImage(java.lang.String userId, java.lang.String fileName) {
        System.out.println("=== getProfileImage called ===");
        System.out.println("userId: " + userId + ", fileName: " + fileName);
        
        String filePath = "D:/DoAn/doctor-appointment-platform/uploads/profiles/" + userId + "/" + fileName;
        System.out.println("Looking for file at: " + filePath);
        
        File file = new File(filePath);
        System.out.println("File exists: " + file.exists());
        
        if (file.exists()) {
            try {
                byte[] imageBytes = Files.readAllBytes(file.toPath());
                System.out.println("File size: " + imageBytes.length + " bytes");
                return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(imageBytes);
            } catch (Exception e) {
                System.out.println("Error reading file: " + e.getMessage());
                e.printStackTrace();
                return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
            }
        }
        return ResponseEntity.notFound().build();
    }

    // Test cover image reading directly
    @GetMapping("/get-cover-image/{userId}/{fileName}")
    public ResponseEntity<?> getCoverImage(java.lang.String userId, java.lang.String fileName) {
        System.out.println("=== getCoverImage called ===");
        System.out.println("userId: " + userId + ", fileName: " + fileName);
        
        String filePath = "D:/DoAn/doctor-appointment-platform/uploads/covers/" + userId + "/" + fileName;
        System.out.println("Looking for file at: " + filePath);
        
        File file = new File(filePath);
        System.out.println("File exists: " + file.exists());
        
        if (file.exists()) {
            try {
                byte[] imageBytes = Files.readAllBytes(file.toPath());
                System.out.println("File size: " + imageBytes.length + " bytes");
                return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(imageBytes);
            } catch (Exception e) {
                System.out.println("Error reading file: " + e.getMessage());
                e.printStackTrace();
                return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
            }
        }
        return ResponseEntity.notFound().build();
    }
}
