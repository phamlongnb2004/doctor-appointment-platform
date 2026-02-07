package com.doctorappointment.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
@Slf4j
public class CloudinaryService {

    private final Cloudinary cloudinary;
    private final boolean enabled;

    public CloudinaryService(
            @Value("${cloudinary.cloud-name:}") String cloudName,
            @Value("${cloudinary.api-key:}") String apiKey,
            @Value("${cloudinary.api-secret:}") String apiSecret,
            @Value("${cloudinary.enabled:false}") boolean enabled
    ) {
        this.enabled = enabled;
        
        if (enabled && cloudName != null && !cloudName.isEmpty()) {
            this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                    "cloud_name", cloudName,
                    "api_key", apiKey,
                    "api_secret", apiSecret,
                    "secure", true
            ));
            log.info("✅ Cloudinary initialized with cloud name: {}", cloudName);
        } else {
            this.cloudinary = null;
            log.info("⚠️ Cloudinary disabled - using local storage");
        }
    }

    public boolean isEnabled() {
        return enabled && cloudinary != null;
    }

    /**
     * Upload image to Cloudinary
     * @param file MultipartFile to upload
     * @param folder Folder name in Cloudinary (e.g., "profiles", "covers", "articles")
     * @return Secure URL of uploaded image
     */
    public String uploadImage(MultipartFile file, String folder) throws IOException {
        if (!isEnabled()) {
            throw new IllegalStateException("Cloudinary is not enabled");
        }

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("File must be an image");
        }

        // Validate file size (max 10MB)
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new IllegalArgumentException("File size must be less than 10MB");
        }

        try {
            // Generate unique public ID
            String publicId = folder + "/" + UUID.randomUUID().toString();

            log.info("📤 Uploading image to Cloudinary: folder={}, size={}KB", folder, file.getSize() / 1024);

            // Upload to Cloudinary
            Map uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "public_id", publicId,
                            "folder", folder,
                            "resource_type", "image",
                            "quality", "auto"
                    )
            );

            String secureUrl = (String) uploadResult.get("secure_url");
            log.info("✅ Image uploaded successfully to Cloudinary: {}", secureUrl);
            return secureUrl;

        } catch (Exception e) {
            log.error("❌ Error uploading image to Cloudinary", e);
            throw new IOException("Failed to upload image: " + e.getMessage());
        }
    }

    /**
     * Delete image from Cloudinary
     * @param imageUrl Full URL of the image
     * @return true if deleted successfully
     */
    public boolean deleteImage(String imageUrl) {
        if (!isEnabled()) {
            return false;
        }

        if (imageUrl == null || imageUrl.isEmpty()) {
            return false;
        }

        try {
            // Extract public ID from URL
            String publicId = extractPublicId(imageUrl);
            if (publicId == null) {
                log.warn("⚠️ Could not extract public ID from URL: {}", imageUrl);
                return false;
            }

            log.info("🗑️ Deleting image from Cloudinary: {}", publicId);

            Map result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            String resultStatus = (String) result.get("result");
            
            boolean success = "ok".equals(resultStatus);
            if (success) {
                log.info("✅ Image deleted successfully from Cloudinary");
            } else {
                log.warn("⚠️ Image deletion result: {}", resultStatus);
            }
            
            return success;

        } catch (Exception e) {
            log.error("❌ Error deleting image from Cloudinary", e);
            return false;
        }
    }

    /**
     * Extract public ID from Cloudinary URL
     * URL format: https://res.cloudinary.com/cloud-name/image/upload/v123456/folder/filename.jpg
     */
    private String extractPublicId(String imageUrl) {
        try {
            String[] parts = imageUrl.split("/upload/");
            if (parts.length < 2) {
                return null;
            }
            
            String afterUpload = parts[1];
            // Remove version (v123456/)
            String withoutVersion = afterUpload.replaceFirst("v\\d+/", "");
            // Remove file extension
            return withoutVersion.replaceFirst("\\.[^.]+$", "");
            
        } catch (Exception e) {
            log.error("Error extracting public ID from URL: {}", imageUrl, e);
            return null;
        }
    }
}
