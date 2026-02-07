package com.doctorappointment.controller;

import com.doctorappointment.service.ImageService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/images")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
public class ImageController {

    private final ImageService imageService;

    @Value("${app.upload.path:uploads}")
    private String uploadPath;

    /**
     * Test endpoint to verify ImageController is working
     */
    @GetMapping("/test")
    public ResponseEntity<?> test() {
        System.out.println("=== ImageController test endpoint called ===");
        return ResponseEntity.ok().body("ImageController is working");
    }

    /**
     * Upload profile image
     */
    @PostMapping("/profiles/{userId}")
    public ResponseEntity<?> uploadProfileImage(
            @PathVariable Long userId,
            @RequestParam("image") MultipartFile file) {
        try {
            String imageUrl = imageService.uploadProfileImage(userId, file);
            return ResponseEntity.ok(Map.of(
                "message", "Profile image uploaded successfully",
                "profileImage", imageUrl
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Upload cover image
     */
    @PostMapping("/covers/{userId}")
    public ResponseEntity<?> uploadCoverImage(
            @PathVariable Long userId,
            @RequestParam("image") MultipartFile file) {
        try {
            String imageUrl = imageService.uploadCoverImage(userId, file);
            return ResponseEntity.ok(Map.of(
                "message", "Cover image uploaded successfully",
                "coverImage", imageUrl
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Upload article image - for article content and featured images
     */
    @PostMapping("/articles")
    public ResponseEntity<?> uploadArticleImage(
            @RequestParam("image") MultipartFile file) {
        try {
            // Use a generic "articles" folder instead of user-specific
            String imageUrl = imageService.uploadArticleImage(file);
            return ResponseEntity.ok(Map.of(
                "message", "Article image uploaded successfully",
                "imageUrl", imageUrl,
                "url", imageUrl  // For Quill editor compatibility
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Get profile image - simplified version
     */
    @GetMapping("/profiles/{userId}/**")
    public ResponseEntity<?> getProfileImage(
            @PathVariable Long userId,
            HttpServletRequest request) {
        String fullPath = request.getRequestURI();
        String fileName = fullPath.substring(fullPath.lastIndexOf("/profiles/" + userId + "/") + ("/profiles/" + userId + "/").length());
        
        try {
            System.out.println("=== getProfileImage called ===");
            System.out.println("userId: " + userId + ", fileName: " + fileName);
            
            // Use configurable path
            java.nio.file.Path filePath = java.nio.file.Paths.get(uploadPath, "profiles", userId.toString(), fileName);
            System.out.println("Looking for file at: " + filePath);
            
            java.io.File file = filePath.toFile();
            System.out.println("File exists: " + file.exists());
            System.out.println("File absolute path: " + file.getAbsolutePath());
            
            if (file.exists()) {
                byte[] imageBytes = java.nio.file.Files.readAllBytes(file.toPath());
                System.out.println("File size: " + imageBytes.length + " bytes");
                
                return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(imageBytes);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get cover image
     */
    @GetMapping("/covers/{userId}/**")
    public ResponseEntity<?> getCoverImage(
            @PathVariable Long userId,
            HttpServletRequest request) {
        String fullPath = request.getRequestURI();
        String fileName = fullPath.substring(fullPath.lastIndexOf("/covers/" + userId + "/") + ("/covers/" + userId + "/").length());
        
        try {
            System.out.println("=== getCoverImage called ===");
            System.out.println("userId: " + userId + ", fileName: " + fileName);
            
            // Use configurable path
            java.nio.file.Path filePath = java.nio.file.Paths.get(uploadPath, "covers", userId.toString(), fileName);
            System.out.println("Looking for file at: " + filePath);
            
            java.io.File file = filePath.toFile();
            System.out.println("File exists: " + file.exists());
            System.out.println("File absolute path: " + file.getAbsolutePath());
            
            if (file.exists()) {
                byte[] imageBytes = java.nio.file.Files.readAllBytes(file.toPath());
                System.out.println("File size: " + imageBytes.length + " bytes");
                
                return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(imageBytes);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get article image
     */
    @GetMapping("/articles/**")
    public ResponseEntity<?> getArticleImage(HttpServletRequest request) {
        String fullPath = request.getRequestURI();
        String fileName = fullPath.substring(fullPath.lastIndexOf("/articles/") + "/articles/".length());
        
        try {
            System.out.println("=== getArticleImage called ===");
            System.out.println("fileName: " + fileName);
            
            // Use configurable path
            java.nio.file.Path filePath = java.nio.file.Paths.get(uploadPath, "articles", fileName);
            System.out.println("Looking for file at: " + filePath);
            
            java.io.File file = filePath.toFile();
            System.out.println("File exists: " + file.exists());
            
            if (file.exists()) {
                byte[] imageBytes = java.nio.file.Files.readAllBytes(file.toPath());
                System.out.println("File size: " + imageBytes.length + " bytes");
                
                // Determine content type from file extension
                String contentType = MediaType.IMAGE_JPEG_VALUE;
                if (fileName.toLowerCase().endsWith(".png")) {
                    contentType = MediaType.IMAGE_PNG_VALUE;
                } else if (fileName.toLowerCase().endsWith(".gif")) {
                    contentType = MediaType.IMAGE_GIF_VALUE;
                }
                
                return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(imageBytes);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Delete profile image
     */
    @DeleteMapping("/profiles/{userId}")
    public ResponseEntity<?> deleteProfileImage(@PathVariable Long userId) {
        // Implementation for deleting profile image would require storing the current image URL
        return ResponseEntity.ok(Map.of("message", "Profile image deleted"));
    }

    /**
     * Delete cover image
     */
    @DeleteMapping("/covers/{userId}")
    public ResponseEntity<?> deleteCoverImage(@PathVariable Long userId) {
        return ResponseEntity.ok(Map.of("message", "Cover image deleted"));
    }
}
