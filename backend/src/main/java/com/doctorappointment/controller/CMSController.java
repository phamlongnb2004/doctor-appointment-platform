package com.doctorappointment.controller;

import com.doctorappointment.model.*;
import com.doctorappointment.service.CMSService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/cms")
public class CMSController {
    
    @Autowired
    private CMSService cmsService;
    
    @Autowired
    private com.doctorappointment.service.ImageService imageService;
    
    @Autowired
    private com.doctorappointment.repository.NewsArticleRepository newsArticleRepository;
    
    @Autowired
    private com.doctorappointment.repository.MedicalServiceRepository medicalServiceRepository;
    
    // Site Settings endpoints
    @GetMapping("/site-settings")
    public ResponseEntity<SiteSettings> getSiteSettings() {
        return ResponseEntity.ok(cmsService.getSiteSettings());
    }
    
    @PutMapping("/admin/site-settings")
    public ResponseEntity<SiteSettings> updateSiteSettings(@RequestBody SiteSettings settings) {
        System.out.println("=== Updating Site Settings ===");
        System.out.println("Received settings: " + settings);
        System.out.println("doctors_hero_title: " + settings.getDoctorsHeroTitle());
        System.out.println("doctors_hero_subtitle: " + settings.getDoctorsHeroSubtitle());
        System.out.println("doctors_hero_background: " + settings.getDoctorsHeroBackground());
        SiteSettings updated = cmsService.updateSiteSettings(settings);
        System.out.println("Updated settings: " + updated);
        return ResponseEntity.ok(updated);
    }
    
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("CMS Controller test endpoint works! Service is: " + (cmsService != null ? "injected" : "null"));
    }
    
    // Public endpoints for frontend
    @GetMapping("/homepage-content")
    public ResponseEntity<List<HomePageContent>> getAllHomePageContent() {
        System.out.println("=== CMSController.getAllHomePageContent() CALLED ===");
        try {
            List<HomePageContent> content = cmsService.getAllActiveHomePageContent();
            System.out.println("Found " + content.size() + " homepage content items");
            return ResponseEntity.ok(content);
        } catch (Exception e) {
            System.err.println("Error in getAllHomePageContent: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    @GetMapping("/homepage-content/{sectionKey}")
    public ResponseEntity<HomePageContent> getHomePageContentBySection(@PathVariable String sectionKey) {
        Optional<HomePageContent> content = cmsService.getHomePageContentBySection(sectionKey);
        return content.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/services")
    public ResponseEntity<List<com.doctorappointment.model.Service>> getAllServices() {
        List<com.doctorappointment.model.Service> services = cmsService.getAllActiveServices();
        return ResponseEntity.ok(services);
    }
    
    @GetMapping("/news")
    public ResponseEntity<List<NewsArticle>> getLatestNews(@RequestParam(defaultValue = "4") int limit) {
        List<NewsArticle> articles = cmsService.getLatestNewsArticles(limit);
        return ResponseEntity.ok(articles);
    }
    
    @GetMapping("/news/featured")
    public ResponseEntity<List<NewsArticle>> getFeaturedNews(@RequestParam(defaultValue = "3") int limit) {
        List<NewsArticle> articles = cmsService.getFeaturedNewsArticles(limit);
        return ResponseEntity.ok(articles);
    }
    
    @GetMapping("/news/{slug}")
    public ResponseEntity<NewsArticle> getNewsBySlug(@PathVariable String slug) {
        Optional<NewsArticle> article = cmsService.getNewsArticleBySlug(slug);
        return article.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    
    // Lấy bài viết theo category
    @GetMapping("/news/category/{category}")
    public ResponseEntity<List<NewsArticle>> getNewsByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "20") int limit) {
        List<NewsArticle> articles = cmsService.getNewsArticlesByCategory(category, limit);
        return ResponseEntity.ok(articles);
    }
    
    // Lấy tất cả categories (old - returns category names only)
    @GetMapping("/news/categories")
    public ResponseEntity<List<String>> getAllCategories() {
        List<String> categories = cmsService.getAllNewsCategoryNames();
        return ResponseEntity.ok(categories);
    }
    
    // Lấy bài viết của bác sĩ (đã duyệt)
    @GetMapping("/news/doctor/{doctorId}")
    public ResponseEntity<List<NewsArticle>> getArticlesByDoctor(@PathVariable Long doctorId) {
        List<NewsArticle> articles = cmsService.getApprovedArticlesByDoctorId(doctorId);
        return ResponseEntity.ok(articles);
    }
    
    @GetMapping("/testimonials")
    public ResponseEntity<List<Testimonial>> getAllTestimonials() {
        List<Testimonial> testimonials = cmsService.getAllActiveTestimonials();
        return ResponseEntity.ok(testimonials);
    }
    
    @GetMapping("/testimonials/featured")
    public ResponseEntity<List<Testimonial>> getFeaturedTestimonials(@RequestParam(defaultValue = "3") int limit) {
        List<Testimonial> testimonials = cmsService.getFeaturedTestimonials(limit);
        return ResponseEntity.ok(testimonials);
    }
    
    // Admin endpoints (protected)
    @PostMapping("/admin/homepage-content")
    public ResponseEntity<HomePageContent> createHomePageContent(@RequestBody HomePageContent content) {
        HomePageContent saved = cmsService.saveHomePageContent(content);
        return ResponseEntity.ok(saved);
    }
    
    @PutMapping("/admin/homepage-content/{id}")
    public ResponseEntity<HomePageContent> updateHomePageContent(@PathVariable Long id, @RequestBody HomePageContent content) {
        content.setId(id);
        HomePageContent updated = cmsService.saveHomePageContent(content);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/admin/homepage-content/{id}")
    public ResponseEntity<Void> deleteHomePageContent(@PathVariable Long id) {
        cmsService.deleteHomePageContent(id);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/admin/services")
    public ResponseEntity<com.doctorappointment.model.Service> createService(@RequestBody com.doctorappointment.model.Service service) {
        com.doctorappointment.model.Service saved = cmsService.saveService(service);
        return ResponseEntity.ok(saved);
    }
    
    @PutMapping("/admin/services/{id}")
    public ResponseEntity<com.doctorappointment.model.Service> updateService(@PathVariable Long id, @RequestBody com.doctorappointment.model.Service service) {
        service.setId(id);
        com.doctorappointment.model.Service updated = cmsService.saveService(service);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/admin/services/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable Long id) {
        cmsService.deleteService(id);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/admin/news")
    public ResponseEntity<NewsArticle> createNewsArticle(@RequestBody NewsArticle article) {
        NewsArticle saved = cmsService.saveNewsArticle(article);
        return ResponseEntity.ok(saved);
    }
    
    @PutMapping("/admin/news/{id}")
    public ResponseEntity<NewsArticle> updateNewsArticle(@PathVariable Long id, @RequestBody NewsArticle article) {
        article.setId(id);
        NewsArticle updated = cmsService.saveNewsArticle(article);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/admin/news/{id}")
    public ResponseEntity<Void> deleteNewsArticle(@PathVariable Long id) {
        cmsService.deleteNewsArticle(id);
        return ResponseEntity.ok().build();
    }
    
    // ==================== SLUG UTILITIES ====================
    
    @GetMapping("/slug/generate")
    public ResponseEntity<Map<String, String>> generateSlug(@RequestParam String title) {
        String slug = com.doctorappointment.util.SlugUtils.toSlug(title);
        Map<String, String> response = new HashMap<>();
        response.put("slug", slug);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/slug/check/{slug}")
    public ResponseEntity<Map<String, Object>> checkSlug(
            @PathVariable String slug,
            @RequestParam(required = false) Long articleId,
            @RequestParam(required = false) String type) {
        boolean exists;
        
        // Default to news article if type not specified
        if (type == null || "news".equals(type)) {
            if (articleId != null) {
                // Check if slug exists for other articles (excluding current article)
                exists = newsArticleRepository.existsBySlugAndIdNot(slug, articleId);
            } else {
                // Check if slug exists at all
                exists = newsArticleRepository.existsBySlug(slug);
            }
        } else if ("medical-service".equals(type)) {
            // Check medical services
            if (articleId != null) {
                exists = medicalServiceRepository.findBySlug(slug)
                    .map(s -> !s.getId().equals(articleId))
                    .orElse(false);
            } else {
                exists = medicalServiceRepository.findBySlug(slug).isPresent();
            }
        } else {
            exists = false;
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("exists", exists);
        response.put("slug", slug);
        
        // If exists, suggest alternative
        if (exists) {
            String baseSlug = slug;
            int counter = 2;
            String newSlug;
            do {
                newSlug = com.doctorappointment.util.SlugUtils.makeUniqueSlug(baseSlug, counter);
                counter++;
                
                // Check based on type
                if ("medical-service".equals(type)) {
                    exists = medicalServiceRepository.findBySlug(newSlug).isPresent();
                } else {
                    exists = newsArticleRepository.existsBySlug(newSlug);
                }
            } while (exists && counter < 100);
            
            response.put("suggestion", newSlug);
        }
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/admin/testimonials")
    public ResponseEntity<Testimonial> createTestimonial(@RequestBody Testimonial testimonial) {
        Testimonial saved = cmsService.saveTestimonial(testimonial);
        return ResponseEntity.ok(saved);
    }
    
    @PutMapping("/admin/testimonials/{id}")
    public ResponseEntity<Testimonial> updateTestimonial(@PathVariable Long id, @RequestBody Testimonial testimonial) {
        testimonial.setId(id);
        Testimonial updated = cmsService.saveTestimonial(testimonial);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/admin/testimonials/{id}")
    public ResponseEntity<Void> deleteTestimonial(@PathVariable Long id) {
        cmsService.deleteTestimonial(id);
        return ResponseEntity.ok().build();
    }
    
    // Doctor endpoints - Bác sĩ đăng bài
    @PostMapping("/doctor/news")
    public ResponseEntity<NewsArticle> createDoctorArticle(@RequestBody Map<String, Object> requestData) {
        try {
            System.out.println("=== CREATE DOCTOR ARTICLE ===");
            System.out.println("Request data: " + requestData);
            
            NewsArticle article = new NewsArticle();
            article.setTitle((String) requestData.get("title"));
            article.setExcerpt((String) requestData.get("excerpt"));
            article.setContent((String) requestData.get("content"));
            article.setImageUrl((String) requestData.get("imageUrl"));
            article.setSlug((String) requestData.get("slug"));
            article.setAuthor((String) requestData.get("author"));
            article.setStatus("PENDING"); // Mặc định là pending, chờ admin duyệt
            
            // Lấy doctorId và load Doctor entity
            Object doctorIdObj = requestData.get("doctorId");
            if (doctorIdObj != null) {
                Long doctorId = doctorIdObj instanceof Integer ? 
                    ((Integer) doctorIdObj).longValue() : 
                    (Long) doctorIdObj;
                System.out.println("Doctor ID: " + doctorId);
                article.setDoctor(new Doctor());
                article.getDoctor().setId(doctorId);
            }
            
            NewsArticle saved = cmsService.saveNewsArticle(article);
            System.out.println("Saved successfully: " + saved.getId());
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            System.err.println("Error creating doctor article: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    @GetMapping("/doctor/news/{doctorId}")
    public ResponseEntity<List<NewsArticle>> getDoctorArticles(@PathVariable Long doctorId) {
        List<NewsArticle> articles = cmsService.getArticlesByDoctorId(doctorId);
        return ResponseEntity.ok(articles);
    }
    
    @PutMapping("/doctor/news/{id}")
    public ResponseEntity<NewsArticle> updateDoctorArticle(@PathVariable Long id, @RequestBody Map<String, Object> requestData) {
        try {
            System.out.println("=== UPDATE DOCTOR ARTICLE ===");
            System.out.println("Article ID: " + id);
            System.out.println("Request data: " + requestData);
            
            // Load existing article from database
            Optional<NewsArticle> existingOpt = newsArticleRepository.findById(id);
            if (!existingOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            NewsArticle article = existingOpt.get();
            
            // Update only the fields that are provided
            if (requestData.containsKey("title")) {
                article.setTitle((String) requestData.get("title"));
            }
            if (requestData.containsKey("excerpt")) {
                article.setExcerpt((String) requestData.get("excerpt"));
            }
            if (requestData.containsKey("content")) {
                article.setContent((String) requestData.get("content"));
            }
            if (requestData.containsKey("imageUrl")) {
                article.setImageUrl((String) requestData.get("imageUrl"));
            }
            if (requestData.containsKey("slug")) {
                article.setSlug((String) requestData.get("slug"));
            }
            if (requestData.containsKey("author")) {
                article.setAuthor((String) requestData.get("author"));
            }
            
            // Reset status to PENDING when doctor edits
            article.setStatus("PENDING");
            
            // Keep existing doctor relationship - don't change it
            System.out.println("Keeping doctor ID: " + (article.getDoctor() != null ? article.getDoctor().getId() : "null"));
            
            NewsArticle updated = cmsService.saveNewsArticle(article);
            System.out.println("Updated successfully. Doctor ID after save: " + (updated.getDoctor() != null ? updated.getDoctor().getId() : "null"));
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            System.err.println("Error updating doctor article: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    @DeleteMapping("/doctor/news/{id}")
    public ResponseEntity<Void> deleteDoctorArticle(@PathVariable Long id) {
        cmsService.deleteNewsArticle(id);
        return ResponseEntity.ok().build();
    }
    
    // Admin endpoints - Quản lý bài viết bác sĩ
    @GetMapping("/admin/news/pending")
    public ResponseEntity<List<NewsArticle>> getPendingArticles() {
        List<NewsArticle> articles = cmsService.getPendingArticles();
        return ResponseEntity.ok(articles);
    }
    
    @GetMapping("/admin/news/all")
    public ResponseEntity<List<NewsArticle>> getAllArticles() {
        List<NewsArticle> articles = cmsService.getAllArticlesForAdmin();
        return ResponseEntity.ok(articles);
    }
    
    @PutMapping("/admin/news/{id}/approve")
    public ResponseEntity<NewsArticle> approveArticle(@PathVariable Long id) {
        NewsArticle approved = cmsService.approveArticle(id);
        if (approved != null) {
            return ResponseEntity.ok(approved);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PutMapping("/admin/news/{id}/reject")
    public ResponseEntity<NewsArticle> rejectArticle(@PathVariable Long id) {
        NewsArticle rejected = cmsService.rejectArticle(id);
        if (rejected != null) {
            return ResponseEntity.ok(rejected);
        }
        return ResponseEntity.notFound().build();
    }
    
    // Feature endpoints
    @GetMapping("/features")
    public ResponseEntity<List<Feature>> getAllFeatures() {
        List<Feature> features = cmsService.getAllActiveFeatures();
        return ResponseEntity.ok(features);
    }
    
    @PostMapping("/admin/features")
    public ResponseEntity<Feature> createFeature(@RequestBody Feature feature) {
        try {
            System.out.println("=== CREATE FEATURE ===");
            System.out.println("Feature data: " + feature);
            Feature saved = cmsService.saveFeature(feature);
            System.out.println("Created successfully: " + saved);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            System.err.println("Error creating feature: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    @PutMapping("/admin/features/{id}")
    public ResponseEntity<Feature> updateFeature(@PathVariable Long id, @RequestBody Feature feature) {
        try {
            System.out.println("=== UPDATE FEATURE ===");
            System.out.println("ID: " + id);
            System.out.println("Feature data: " + feature);
            feature.setId(id);
            Feature updated = cmsService.saveFeature(feature);
            System.out.println("Updated successfully: " + updated);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            System.err.println("Error updating feature: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    @DeleteMapping("/admin/features/{id}")
    public ResponseEntity<Void> deleteFeature(@PathVariable Long id) {
        cmsService.deleteFeature(id);
        return ResponseEntity.ok().build();
    }
    
    // Specialty endpoints
    @GetMapping("/specialties")
    public ResponseEntity<List<Specialty>> getAllSpecialties() {
        List<Specialty> specialties = cmsService.getAllActiveSpecialties();
        return ResponseEntity.ok(specialties);
    }
    
    @PostMapping("/admin/specialties")
    public ResponseEntity<Specialty> createSpecialty(@RequestBody Specialty specialty) {
        Specialty saved = cmsService.saveSpecialty(specialty);
        return ResponseEntity.ok(saved);
    }
    
    @PutMapping("/admin/specialties/{id}")
    public ResponseEntity<Specialty> updateSpecialty(@PathVariable Long id, @RequestBody Specialty specialty) {
        specialty.setId(id);
        Specialty updated = cmsService.saveSpecialty(specialty);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/admin/specialties/{id}")
    public ResponseEntity<Void> deleteSpecialty(@PathVariable Long id) {
        cmsService.deleteSpecialty(id);
        return ResponseEntity.ok().build();
    }
    
    // Statistic endpoints
    @GetMapping("/statistics")
    public ResponseEntity<List<Statistic>> getAllStatistics() {
        List<Statistic> statistics = cmsService.getAllActiveStatistics();
        return ResponseEntity.ok(statistics);
    }
    
    @PostMapping("/admin/statistics")
    public ResponseEntity<Statistic> createStatistic(@RequestBody Statistic statistic) {
        Statistic saved = cmsService.saveStatistic(statistic);
        return ResponseEntity.ok(saved);
    }
    
    @PutMapping("/admin/statistics/{id}")
    public ResponseEntity<Statistic> updateStatistic(@PathVariable Long id, @RequestBody Statistic statistic) {
        statistic.setId(id);
        Statistic updated = cmsService.saveStatistic(statistic);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/admin/statistics/{id}")
    public ResponseEntity<Void> deleteStatistic(@PathVariable Long id) {
        cmsService.deleteStatistic(id);
        return ResponseEntity.ok().build();
    }
    
    // Certification endpoints
    @GetMapping("/certifications")
    public ResponseEntity<List<Certification>> getAllCertifications() {
        List<Certification> certifications = cmsService.getAllActiveCertifications();
        return ResponseEntity.ok(certifications);
    }
    
    @PostMapping("/admin/certifications")
    public ResponseEntity<Certification> createCertification(@RequestBody Certification certification) {
        Certification saved = cmsService.saveCertification(certification);
        return ResponseEntity.ok(saved);
    }
    
    @PutMapping("/admin/certifications/{id}")
    public ResponseEntity<Certification> updateCertification(@PathVariable Long id, @RequestBody Certification certification) {
        System.out.println("=== UPDATE CERTIFICATION ===");
        System.out.println("ID: " + id);
        System.out.println("Name: " + certification.getName());
        System.out.println("ImageUrl: " + certification.getImageUrl());
        System.out.println("Icon: " + certification.getIcon());
        System.out.println("Description: " + certification.getDescription());
        System.out.println("===========================");
        
        certification.setId(id);
        Certification updated = cmsService.saveCertification(certification);
        
        System.out.println("=== AFTER SAVE ===");
        System.out.println("Updated ImageUrl: " + updated.getImageUrl());
        System.out.println("==================");
        
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/admin/certifications/{id}")
    public ResponseEntity<Void> deleteCertification(@PathVariable Long id) {
        cmsService.deleteCertification(id);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/admin/certifications/upload-image")
    public ResponseEntity<Map<String, String>> uploadCertificationImage(@RequestParam("file") MultipartFile file) {
        try {
            String imageUrl = imageService.uploadArticleImage(file);
            Map<String, String> response = new HashMap<>();
            response.put("imageUrl", imageUrl);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    // Banner endpoints
    @GetMapping("/banners")
    public ResponseEntity<List<Banner>> getAllBanners() {
        List<Banner> banners = cmsService.getAllActiveBanners();
        return ResponseEntity.ok(banners);
    }
    
    @GetMapping("/banners/{page}")
    public ResponseEntity<List<Banner>> getBannersByPage(@PathVariable String page) {
        List<Banner> banners = cmsService.getActiveBannersByPage(page);
        return ResponseEntity.ok(banners);
    }
    
    @PostMapping("/admin/banners")
    public ResponseEntity<Banner> createBanner(@RequestBody Banner banner) {
        Banner saved = cmsService.saveBanner(banner);
        return ResponseEntity.ok(saved);
    }
    
    @PutMapping("/admin/banners/{id}")
    public ResponseEntity<Banner> updateBanner(@PathVariable Long id, @RequestBody Banner banner) {
        banner.setId(id);
        Banner updated = cmsService.saveBanner(banner);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/admin/banners/{id}")
    public ResponseEntity<Void> deleteBanner(@PathVariable Long id) {
        cmsService.deleteBanner(id);
        return ResponseEntity.ok().build();
    }
    
    // Admin endpoints - Get ALL items (including inactive)
    @GetMapping("/admin/homepage-content/all")
    public ResponseEntity<List<HomePageContent>> getAllHomePageContentForAdmin() {
        return ResponseEntity.ok(cmsService.getAllHomePageContent());
    }
    
    @GetMapping("/admin/services/all")
    public ResponseEntity<List<com.doctorappointment.model.Service>> getAllServicesForAdmin() {
        return ResponseEntity.ok(cmsService.getAllServices());
    }
    
    @GetMapping("/admin/testimonials/all")
    public ResponseEntity<List<Testimonial>> getAllTestimonialsForAdmin() {
        return ResponseEntity.ok(cmsService.getAllTestimonials());
    }
    
    @GetMapping("/admin/features/all")
    public ResponseEntity<List<Feature>> getAllFeaturesForAdmin() {
        return ResponseEntity.ok(cmsService.getAllFeatures());
    }
    
    @GetMapping("/admin/specialties/all")
    public ResponseEntity<List<Specialty>> getAllSpecialtiesForAdmin() {
        return ResponseEntity.ok(cmsService.getAllSpecialties());
    }
    
    @GetMapping("/admin/statistics/all")
    public ResponseEntity<List<Statistic>> getAllStatisticsForAdmin() {
        return ResponseEntity.ok(cmsService.getAllStatistics());
    }
    
    @GetMapping("/admin/certifications/all")
    public ResponseEntity<List<Certification>> getAllCertificationsForAdmin() {
        return ResponseEntity.ok(cmsService.getAllCertifications());
    }
    
    @GetMapping("/admin/banners/all")
    public ResponseEntity<List<Banner>> getAllBannersForAdmin() {
        return ResponseEntity.ok(cmsService.getAllBanners());
    }
    
    // ========================================
    // NEWS CATEGORY ENDPOINTS
    // ========================================
    
    // Public endpoints
    @GetMapping("/news-categories")
    public ResponseEntity<List<NewsCategory>> getAllActiveNewsCategories() {
        List<NewsCategory> categories = cmsService.getAllActiveNewsCategories();
        return ResponseEntity.ok(categories);
    }
    
    @GetMapping("/news-categories/{slug}")
    public ResponseEntity<NewsCategory> getNewsCategoryBySlug(@PathVariable String slug) {
        Optional<NewsCategory> category = cmsService.getNewsCategoryBySlug(slug);
        return category.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    
    // Admin endpoints
    @GetMapping("/admin/news-categories")
    public ResponseEntity<List<NewsCategory>> getAllNewsCategories() {
        return ResponseEntity.ok(cmsService.getAllNewsCategories());
    }
    
    @PostMapping("/admin/news-categories")
    public ResponseEntity<NewsCategory> createNewsCategory(@RequestBody NewsCategory category) {
        NewsCategory saved = cmsService.saveNewsCategory(category);
        return ResponseEntity.ok(saved);
    }
    
    @PutMapping("/admin/news-categories/{id}")
    public ResponseEntity<NewsCategory> updateNewsCategory(@PathVariable Long id, @RequestBody NewsCategory category) {
        category.setId(id);
        NewsCategory updated = cmsService.saveNewsCategory(category);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/admin/news-categories/{id}")
    public ResponseEntity<Void> deleteNewsCategory(@PathVariable Long id) {
        cmsService.deleteNewsCategory(id);
        return ResponseEntity.ok().build();
    }
    
    // ==================== Membership Benefits Endpoints ====================
    
    // Public endpoint - Get active membership benefits
    @GetMapping("/membership-benefits")
    public ResponseEntity<List<MembershipBenefit>> getActiveMembershipBenefits() {
        return ResponseEntity.ok(cmsService.getAllActiveMembershipBenefits());
    }
    
    // Admin endpoints
    @GetMapping("/admin/membership-benefits/all")
    public ResponseEntity<List<MembershipBenefit>> getAllMembershipBenefits() {
        return ResponseEntity.ok(cmsService.getAllMembershipBenefits());
    }
    
    @GetMapping("/admin/membership-benefits/{id}")
    public ResponseEntity<MembershipBenefit> getMembershipBenefitById(@PathVariable Long id) {
        return cmsService.getMembershipBenefitById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/admin/membership-benefits")
    public ResponseEntity<MembershipBenefit> createMembershipBenefit(@RequestBody MembershipBenefit benefit) {
        MembershipBenefit created = cmsService.saveMembershipBenefit(benefit);
        return ResponseEntity.ok(created);
    }
    
    @PutMapping("/admin/membership-benefits/{id}")
    public ResponseEntity<MembershipBenefit> updateMembershipBenefit(@PathVariable Long id, @RequestBody MembershipBenefit benefit) {
        benefit.setId(id);
        MembershipBenefit updated = cmsService.saveMembershipBenefit(benefit);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/admin/membership-benefits/{id}")
    public ResponseEntity<Void> deleteMembershipBenefit(@PathVariable Long id) {
        cmsService.deleteMembershipBenefit(id);
        return ResponseEntity.ok().build();
    }
    
    // ==================== NEWS SECTIONS ENDPOINTS ====================
    
    @GetMapping("/news-sections")
    public ResponseEntity<List<NewsSection>> getAllActiveNewsSections() {
        return ResponseEntity.ok(cmsService.getAllActiveNewsSections());
    }
    
    @GetMapping("/news-sections/page/{page}")
    public ResponseEntity<List<NewsSection>> getActiveNewsSectionsByPage(@PathVariable String page) {
        return ResponseEntity.ok(cmsService.getActiveNewsSectionsByPage(page));
    }
    
    @GetMapping("/admin/news-sections")
    public ResponseEntity<List<NewsSection>> getAllNewsSections() {
        return ResponseEntity.ok(cmsService.getAllNewsSections());
    }
    
    @GetMapping("/admin/news-sections/{id}")
    public ResponseEntity<NewsSection> getNewsSectionById(@PathVariable Long id) {
        return cmsService.getNewsSectionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/news-sections/{name}")
    public ResponseEntity<NewsSection> getNewsSectionByName(@PathVariable String name) {
        return cmsService.getNewsSectionByName(name)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/admin/news-sections")
    public ResponseEntity<NewsSection> createNewsSection(@RequestBody NewsSection section) {
        NewsSection created = cmsService.saveNewsSection(section);
        return ResponseEntity.ok(created);
    }
    
    @PutMapping("/admin/news-sections/{id}")
    public ResponseEntity<NewsSection> updateNewsSection(@PathVariable Long id, @RequestBody NewsSection section) {
        System.out.println("=== UPDATE NEWS SECTION ===");
        System.out.println("ID: " + id);
        System.out.println("Received layoutType: " + section.getLayoutType());
        System.out.println("Received name: " + section.getName());
        System.out.println("Received title: " + section.getTitle());
        System.out.println("Full section: " + section);
        
        // Fetch existing entity from database
        NewsSection existing = cmsService.getNewsSectionById(id)
            .orElseThrow(() -> new RuntimeException("News section not found"));
        
        // Update fields manually
        existing.setName(section.getName());
        existing.setTitle(section.getTitle());
        existing.setDescription(section.getDescription());
        existing.setLayoutType(section.getLayoutType());
        existing.setDisplayOrder(section.getDisplayOrder());
        existing.setBackgroundColor(section.getBackgroundColor());
        existing.setTitleAlign(section.getTitleAlign());
        existing.setArticlesLimit(section.getArticlesLimit());
        existing.setShowMoreButton(section.getShowMoreButton());
        existing.setMoreButtonText(section.getMoreButtonText());
        existing.setCategoryFilter(section.getCategoryFilter());
        existing.setPage(section.getPage());
        existing.setIsActive(section.getIsActive());
        
        NewsSection updated = cmsService.saveNewsSection(existing);
        
        System.out.println("=== AFTER SAVE ===");
        System.out.println("Saved layoutType: " + updated.getLayoutType());
        
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/admin/news-sections/{id}")
    public ResponseEntity<Void> deleteNewsSection(@PathVariable Long id) {
        cmsService.deleteNewsSection(id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/news-sections/{sectionName}/articles")
    public ResponseEntity<List<NewsArticle>> getNewsBySectionName(
            @PathVariable String sectionName,
            @RequestParam(defaultValue = "4") int limit) {
        return ResponseEntity.ok(cmsService.getNewsBySectionName(sectionName, limit));
    }

    // ==================== NEWS SIDEBAR WIDGETS ====================
    
    @GetMapping("/news-sidebar-widgets")
    public ResponseEntity<List<NewsSidebarWidget>> getActiveNewsSidebarWidgets() {
        return ResponseEntity.ok(cmsService.getActiveNewsSidebarWidgets());
    }
    
    @GetMapping("/admin/news-sidebar-widgets")
    public ResponseEntity<List<NewsSidebarWidget>> getAllNewsSidebarWidgets() {
        return ResponseEntity.ok(cmsService.getAllNewsSidebarWidgets());
    }
    
    @GetMapping("/admin/news-sidebar-widgets/{id}")
    public ResponseEntity<NewsSidebarWidget> getNewsSidebarWidgetById(@PathVariable Long id) {
        return ResponseEntity.ok(cmsService.getNewsSidebarWidgetById(id));
    }
    
    @PostMapping("/admin/news-sidebar-widgets")
    public ResponseEntity<NewsSidebarWidget> createNewsSidebarWidget(@RequestBody NewsSidebarWidget widget) {
        return ResponseEntity.ok(cmsService.createNewsSidebarWidget(widget));
    }
    
    @PutMapping("/admin/news-sidebar-widgets/{id}")
    public ResponseEntity<NewsSidebarWidget> updateNewsSidebarWidget(
            @PathVariable Long id,
            @RequestBody NewsSidebarWidget widget) {
        return ResponseEntity.ok(cmsService.updateNewsSidebarWidget(id, widget));
    }
    
    @DeleteMapping("/admin/news-sidebar-widgets/{id}")
    public ResponseEntity<Void> deleteNewsSidebarWidget(@PathVariable Long id) {
        cmsService.deleteNewsSidebarWidget(id);
        return ResponseEntity.ok().build();
    }
    
    // ==================== ARTICLE CTA SECTION ENDPOINTS ====================
    
    @GetMapping("/article-cta-section")
    public ResponseEntity<ArticleCtaSection> getArticleCtaSection() {
        return cmsService.getArticleCtaSection()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/admin/article-cta-section/{id}")
    public ResponseEntity<ArticleCtaSection> updateArticleCtaSection(
            @PathVariable Long id, 
            @RequestBody ArticleCtaSection section) {
        section.setId(id);
        return ResponseEntity.ok(cmsService.saveArticleCtaSection(section));
    }
    
    // ==================== ABOUT PAGE ENDPOINTS ====================
    
    @GetMapping("/about/{sectionKey}")
    public ResponseEntity<AboutPageContent> getAboutSection(@PathVariable String sectionKey) {
        AboutPageContent content = cmsService.getAboutSection(sectionKey);
        if (content != null) {
            return ResponseEntity.ok(content);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping("/about/{sectionKey}")
    public ResponseEntity<AboutPageContent> saveAboutSection(
            @PathVariable String sectionKey,
            @RequestBody AboutPageContent content) {
        try {
            System.out.println("=== SAVE ABOUT SECTION ===");
            System.out.println("Section Key: " + sectionKey);
            System.out.println("Content: " + content);
            System.out.println("Content JSON: " + content.getContentJson());
            System.out.println("Is Active: " + content.getIsActive());
            
            content.setSectionKey(sectionKey);
            AboutPageContent saved = cmsService.saveAboutSection(content);
            
            System.out.println("Saved successfully with ID: " + saved.getId());
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            System.err.println("Error saving about section: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/about")
    public ResponseEntity<List<AboutPageContent>> getAllAboutSections() {
        return ResponseEntity.ok(cmsService.getAllAboutSections());
    }
    
    // ==================== SERVICE CATEGORIES ====================
    
    // Public endpoints
    @GetMapping("/service-categories")
    public ResponseEntity<List<ServiceCategory>> getActiveServiceCategories() {
        return ResponseEntity.ok(cmsService.getActiveServiceCategories());
    }
    
    @GetMapping("/service-categories/{slug}")
    public ResponseEntity<ServiceCategory> getServiceCategoryBySlug(@PathVariable String slug) {
        return cmsService.getServiceCategoryBySlug(slug)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Admin endpoints
    @GetMapping("/admin/service-categories")
    public ResponseEntity<List<ServiceCategory>> getAllServiceCategories() {
        return ResponseEntity.ok(cmsService.getAllServiceCategories());
    }
    
    @PostMapping("/admin/service-categories")
    public ResponseEntity<ServiceCategory> createServiceCategory(@RequestBody ServiceCategory category) {
        return ResponseEntity.ok(cmsService.saveServiceCategory(category));
    }
    
    @PutMapping("/admin/service-categories/{id}")
    public ResponseEntity<ServiceCategory> updateServiceCategory(@PathVariable Long id, @RequestBody ServiceCategory category) {
        category.setId(id);
        return ResponseEntity.ok(cmsService.saveServiceCategory(category));
    }
    
    @DeleteMapping("/admin/service-categories/{id}")
    public ResponseEntity<Void> deleteServiceCategory(@PathVariable Long id) {
        cmsService.deleteServiceCategory(id);
        return ResponseEntity.ok().build();
    }
    
    // ==================== MEDICAL SERVICES ====================
    
    // Public endpoints
    @GetMapping("/medical-services")
    public ResponseEntity<List<MedicalService>> getActiveMedicalServices() {
        return ResponseEntity.ok(cmsService.getActiveMedicalServices());
    }
    
    @GetMapping("/medical-services/category/{categoryId}")
    public ResponseEntity<List<MedicalService>> getMedicalServicesByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(cmsService.getMedicalServicesByCategory(categoryId));
    }
    
    @GetMapping("/medical-services/featured")
    public ResponseEntity<List<MedicalService>> getFeaturedMedicalServices() {
        return ResponseEntity.ok(cmsService.getFeaturedMedicalServices());
    }
    
    @GetMapping("/medical-services/{slug}")
    public ResponseEntity<MedicalService> getMedicalServiceBySlug(@PathVariable String slug) {
        return cmsService.getMedicalServiceBySlug(slug)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Admin endpoints
    @GetMapping("/admin/medical-services")
    public ResponseEntity<List<MedicalService>> getAllMedicalServices() {
        return ResponseEntity.ok(cmsService.getAllMedicalServices());
    }
    
    @PostMapping("/admin/medical-services")
    public ResponseEntity<MedicalService> createMedicalService(@RequestBody MedicalService service) {
        return ResponseEntity.ok(cmsService.saveMedicalService(service));
    }
    
    @PutMapping("/admin/medical-services/{id}")
    public ResponseEntity<MedicalService> updateMedicalService(@PathVariable Long id, @RequestBody MedicalService service) {
        service.setId(id);
        return ResponseEntity.ok(cmsService.saveMedicalService(service));
    }
    
    @DeleteMapping("/admin/medical-services/{id}")
    public ResponseEntity<Void> deleteMedicalService(@PathVariable Long id) {
        cmsService.deleteMedicalService(id);
        return ResponseEntity.ok().build();
    }
}


