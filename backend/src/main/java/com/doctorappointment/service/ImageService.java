package com.doctorappointment.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Base64;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ImageService {

    @Value("${app.upload.path:uploads}")
    private String uploadPath;

    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;

    /**
     * Upload profile image for user
     */
    public String uploadProfileImage(Long userId, MultipartFile file) throws IOException {
        return uploadImage(userId, file, "profile");
    }

    /**
     * Upload cover image for user
     */
    public String uploadCoverImage(Long userId, MultipartFile file) throws IOException {
        return uploadImage(userId, file, "cover");
    }

    /**
     * Upload article image (for article content and featured images)
     */
    public String uploadArticleImage(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            return null;
        }

        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !isValidImageType(contentType)) {
            throw new IllegalArgumentException("Invalid file type. Only images are allowed.");
        }

        // Validate file size (max 5MB)
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new IllegalArgumentException("File size must be less than 5MB");
        }

        // Create upload directory for articles - use configurable path
        Path uploadDir = Paths.get(uploadPath, "articles").toAbsolutePath().normalize();
        Files.createDirectories(uploadDir);

        // Generate unique filename
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        String fileExtension = getFileExtension(originalFileName);
        String newFileName = UUID.randomUUID().toString() + fileExtension;

        // Save file
        Path targetPath = uploadDir.resolve(newFileName);
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        // Return URL
        return baseUrl + "/api/images/articles/" + newFileName;
    }

    /**
     * Generic image upload method
     */
    private String uploadImage(Long userId, MultipartFile file, String type) throws IOException {
        if (file == null || file.isEmpty()) {
            return null;
        }

        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !isValidImageType(contentType)) {
            throw new IllegalArgumentException("Invalid file type. Only images are allowed.");
        }

        // Validate file size (max 5MB)
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new IllegalArgumentException("File size must be less than 5MB");
        }

        // Create upload directory structure - use configurable path
        Path uploadDir = Paths.get(uploadPath, type + "s", userId.toString()).toAbsolutePath().normalize();
        Files.createDirectories(uploadDir);

        // Generate unique filename
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        String fileExtension = getFileExtension(originalFileName);
        String newFileName = UUID.randomUUID().toString() + fileExtension;

        // Save file
        Path targetPath = uploadDir.resolve(newFileName);
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        // Return URL
        return baseUrl + "/api/images/" + type + "s/" + userId + "/" + newFileName;
    }

    /**
     * Save base64 encoded image
     */
    public String saveBase64Image(Long userId, String base64Image, String type) {
        if (base64Image == null || base64Image.isEmpty()) {
            return null;
        }

        try {
            // Extract base64 data
            String[] parts = base64Image.split(",");
            String imageData = parts.length > 1 ? parts[1] : parts[0];
            
            // Decode base64
            byte[] imageBytes = Base64.getDecoder().decode(imageData);
            
            // Validate size
            if (imageBytes.length > 5 * 1024 * 1024) {
                throw new IllegalArgumentException("Image size must be less than 5MB");
            }

            // Determine image type from base64 header or default to png
            String contentType = "image/png";
            if (parts[0].contains("jpeg")) {
                contentType = "image/jpeg";
            } else if (parts[0].contains("gif")) {
                contentType = "image/gif";
            } else if (parts[0].contains("webp")) {
                contentType = "image/webp";
            }

            String extension = getExtensionFromContentType(contentType);

            // Create upload directory - use configurable path
            Path uploadDir = Paths.get(uploadPath, type + "s", userId.toString()).toAbsolutePath().normalize();
            Files.createDirectories(uploadDir);

            // Generate unique filename
            String newFileName = UUID.randomUUID().toString() + extension;

            // Save file
            Path targetPath = uploadDir.resolve(newFileName);
            Files.write(targetPath, imageBytes);

            // Return URL
            return baseUrl + "/api/images/" + type + "s/" + userId + "/" + newFileName;

        } catch (Exception e) {
            throw new RuntimeException("Failed to save image: " + e.getMessage());
        }
    }

    /**
     * Delete image
     */
    public boolean deleteImage(String imageUrl) {
        if (imageUrl == null || imageUrl.isEmpty()) {
            return false;
        }

        try {
            // Extract file path from URL
            String fileName = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
            String[] parts = imageUrl.split("/");
            
            // Expected format: baseUrl/api/images/types/userId/fileName
            if (parts.length < 5) {
                return false;
            }

            String type = parts[parts.length - 3];
            String userId = parts[parts.length - 2];
            // Use configurable path
            Path path = Paths.get(uploadPath, type + "s", userId, fileName).toAbsolutePath().normalize();
            return Files.deleteIfExists(path);
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Get image as byte array
     */
    public byte[] getImage(String imageUrl) throws IOException {
        if (imageUrl == null || imageUrl.isEmpty()) {
            System.out.println("getImage: imageUrl is null or empty");
            return null;
        }

        try {
            System.out.println("getImage: processing URL: " + imageUrl);
            
            // Extract filename from URL (last segment after last "/")
            int lastSlashIndex = imageUrl.lastIndexOf("/");
            if (lastSlashIndex < 0) {
                System.out.println("getImage: no slash found in URL");
                return null;
            }
            String fileName = imageUrl.substring(lastSlashIndex + 1);
            
            // URL format: http://localhost:8080/api/images/profiles/13/file.png
            // We need to find the "images" part and extract the type and userId from the path
            // The pattern is: base/api/images/TYPE/userId/fileName
            
            // Find "images" in the URL
            int imagesIndex = imageUrl.indexOf("/images/");
            if (imagesIndex < 0) {
                System.out.println("getImage: /images not found in URL");
                return null;
            }
            
            // Extract path after /images/
            String afterImages = imageUrl.substring(imagesIndex + "/images/".length());
            System.out.println("getImage: afterImages = " + afterImages);
            
            // Parse: TYPE/userId/fileName
            String[] pathParts = afterImages.split("/");
            if (pathParts.length < 3) {
                System.out.println("getImage: not enough path parts, expected TYPE/userId/fileName");
                return null;
            }
            
            String type = pathParts[0];  // "profiles" or "covers"
            String userId = pathParts[1];
            String extractedFileName = pathParts[2];
            
            System.out.println("getImage: type=" + type + ", userId=" + userId + ", fileName=" + extractedFileName);
            
            // Construct path using configurable uploadPath
            Path path = Paths.get(uploadPath, type, userId, extractedFileName).toAbsolutePath().normalize();
            
            System.out.println("getImage: Looking for file at: " + path);
            System.out.println("getImage: File exists: " + Files.exists(path));
            
            if (Files.exists(path)) {
                return Files.readAllBytes(path);
            }
            return null;
        } catch (Exception e) {
            System.out.println("Error getting image: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    private boolean isValidImageType(String contentType) {
        return contentType.equals("image/jpeg") || 
               contentType.equals("image/png") || 
               contentType.equals("image/gif") || 
               contentType.equals("image/webp");
    }

    private String getFileExtension(String fileName) {
        if (fileName == null) {
            return ".png";
        }
        int dotIndex = fileName.lastIndexOf('.');
        if (dotIndex > 0) {
            return fileName.substring(dotIndex);
        }
        return ".png";
    }

    private String getExtensionFromContentType(String contentType) {
        switch (contentType) {
            case "image/jpeg":
                return ".jpg";
            case "image/gif":
                return ".gif";
            case "image/webp":
                return ".webp";
            default:
                return ".png";
        }
    }
}
