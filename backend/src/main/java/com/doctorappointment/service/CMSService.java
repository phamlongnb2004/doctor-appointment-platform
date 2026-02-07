package com.doctorappointment.service;

import com.doctorappointment.model.*;
import com.doctorappointment.repository.*;
import com.doctorappointment.util.SlugUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CMSService {
    
    @Autowired
    private HomePageContentRepository homePageContentRepository;
    
    @Autowired
    private ServiceRepository serviceRepository;
    
    @Autowired
    private NewsArticleRepository newsArticleRepository;
    
    @Autowired
    private TestimonialRepository testimonialRepository;
    
    @Autowired
    private FeatureRepository featureRepository;
    
    @Autowired
    private SpecialtyRepository specialtyRepository;
    
    @Autowired
    private StatisticRepository statisticRepository;
    
    @Autowired
    private CertificationRepository certificationRepository;
    
    @Autowired
    private BannerRepository bannerRepository;
    
    @Autowired
    private SiteSettingsRepository siteSettingsRepository;
    
    @Autowired
    private DoctorRepository doctorRepository;
    
    @Autowired
    private NewsCategoryRepository newsCategoryRepository;
    
    @Autowired
    private ServiceCategoryRepository serviceCategoryRepository;
    
    @Autowired
    private MedicalServiceRepository medicalServiceRepository;
    
    @Autowired
    private MembershipBenefitRepository membershipBenefitRepository;
    
    // Site Settings Methods
    public SiteSettings getSiteSettings() {
        List<SiteSettings> settings = siteSettingsRepository.findAll();
        if (settings.isEmpty()) {
            // Return default settings if none exist
            SiteSettings defaultSettings = new SiteSettings();
            defaultSettings.setSiteName("MEDLATEC");
            defaultSettings.setSiteTagline("Chăm sóc sức khỏe");
            defaultSettings.setHotline("19005656");
            return defaultSettings;
        }
        return settings.get(0);
    }
    
    public SiteSettings updateSiteSettings(SiteSettings settings) {
        List<SiteSettings> existingSettings = siteSettingsRepository.findAll();
        if (!existingSettings.isEmpty()) {
            settings.setId(existingSettings.get(0).getId());
        }
        return siteSettingsRepository.save(settings);
    }
    
    // HomePage Content Methods
    public List<HomePageContent> getAllActiveHomePageContent() {
        return homePageContentRepository.findAllActiveOrderByDisplayOrder();
    }
    
    public Optional<HomePageContent> getHomePageContentBySection(String sectionKey) {
        return homePageContentRepository.findActiveBySectionKey(sectionKey);
    }
    
    public HomePageContent saveHomePageContent(HomePageContent content) {
        return homePageContentRepository.save(content);
    }
    
    public void deleteHomePageContent(Long id) {
        homePageContentRepository.deleteById(id);
    }
    
    // Service Methods
    public List<com.doctorappointment.model.Service> getAllActiveServices() {
        return serviceRepository.findAllActiveOrderByDisplayOrder();
    }
    
    public com.doctorappointment.model.Service saveService(com.doctorappointment.model.Service service) {
        return serviceRepository.save(service);
    }
    
    public void deleteService(Long id) {
        serviceRepository.deleteById(id);
    }
    
    public Optional<com.doctorappointment.model.Service> getServiceById(Long id) {
        return serviceRepository.findById(id);
    }
    
    // News Article Methods
    public List<NewsArticle> getLatestNewsArticles(int limit) {
        return newsArticleRepository.findAllActiveOrderByPublishedAtDesc(PageRequest.of(0, limit));
    }
    
    public List<NewsArticle> getFeaturedNewsArticles(int limit) {
        return newsArticleRepository.findFeaturedArticles(PageRequest.of(0, limit));
    }
    
    public NewsArticle saveNewsArticle(NewsArticle article) {
        try {
            System.out.println("=== CMSService.saveNewsArticle ===");
            System.out.println("Article: " + article);
            // Nếu có doctor ID, load doctor entity từ database
            if (article.getDoctor() != null && article.getDoctor().getId() != null) {
                System.out.println("Loading doctor with ID: " + article.getDoctor().getId());
                Doctor doctor = doctorRepository.findById(article.getDoctor().getId())
                    .orElseThrow(() -> new RuntimeException("Doctor not found with id: " + article.getDoctor().getId()));
                System.out.println("Doctor loaded: " + doctor.getId());
                article.setDoctor(doctor);
            }
            NewsArticle saved = newsArticleRepository.save(article);
            System.out.println("Article saved with ID: " + saved.getId());
            return saved;
        } catch (Exception e) {
            System.err.println("Error in saveNewsArticle: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    public void deleteNewsArticle(Long id) {
        newsArticleRepository.deleteById(id);
    }
    
    public Optional<NewsArticle> getNewsArticleById(Long id) {
        return newsArticleRepository.findById(id);
    }
    
    public Optional<NewsArticle> getNewsArticleBySlug(String slug) {
        return newsArticleRepository.findBySlugAndIsActiveTrue(slug);
    }
    
    // Lấy bài viết theo category
    public List<NewsArticle> getNewsArticlesByCategory(String category, int limit) {
        return newsArticleRepository.findByCategoryAndIsActiveTrueOrderByPublishedAtDesc(category, PageRequest.of(0, limit));
    }
    
    // Lấy tất cả categories (old - returns category names as strings)
    public List<String> getAllNewsCategoryNames() {
        return newsArticleRepository.findDistinctCategories();
    }
    
    // Bài viết của bác sĩ
    public List<NewsArticle> getArticlesByDoctorId(Long doctorId) {
        return newsArticleRepository.findByDoctorId(doctorId);
    }
    
    public List<NewsArticle> getApprovedArticlesByDoctorId(Long doctorId) {
        return newsArticleRepository.findByDoctorIdAndApproved(doctorId);
    }
    
    // Admin quản lý
    public List<NewsArticle> getPendingArticles() {
        return newsArticleRepository.findPendingArticles();
    }
    
    public List<NewsArticle> getAllArticlesForAdmin() {
        return newsArticleRepository.findAllArticles();
    }
    
    public NewsArticle approveArticle(Long id) {
        Optional<NewsArticle> article = newsArticleRepository.findById(id);
        if (article.isPresent()) {
            NewsArticle a = article.get();
            a.setStatus("APPROVED");
            a.setPublishedAt(LocalDateTime.now());
            return newsArticleRepository.save(a);
        }
        return null;
    }
    
    public NewsArticle rejectArticle(Long id) {
        Optional<NewsArticle> article = newsArticleRepository.findById(id);
        if (article.isPresent()) {
            NewsArticle a = article.get();
            a.setStatus("REJECTED");
            return newsArticleRepository.save(a);
        }
        return null;
    }
    
    // Testimonial Methods
    public List<Testimonial> getAllActiveTestimonials() {
        return testimonialRepository.findAllActiveOrderByDisplayOrder();
    }
    
    public List<Testimonial> getFeaturedTestimonials(int limit) {
        return testimonialRepository.findFeaturedTestimonials(PageRequest.of(0, limit));
    }
    
    public Testimonial saveTestimonial(Testimonial testimonial) {
        return testimonialRepository.save(testimonial);
    }
    
    public void deleteTestimonial(Long id) {
        testimonialRepository.deleteById(id);
    }
    
    public Optional<Testimonial> getTestimonialById(Long id) {
        return testimonialRepository.findById(id);
    }
    
    // Feature Methods
    public List<Feature> getAllActiveFeatures() {
        return featureRepository.findByIsActiveTrueOrderByDisplayOrderAsc();
    }
    
    public Feature saveFeature(Feature feature) {
        return featureRepository.save(feature);
    }
    
    public void deleteFeature(Long id) {
        featureRepository.deleteById(id);
    }
    
    public Optional<Feature> getFeatureById(Long id) {
        return featureRepository.findById(id);
    }
    
    // Specialty Methods
    public List<Specialty> getAllActiveSpecialties() {
        return specialtyRepository.findByIsActiveTrueOrderByDisplayOrderAsc();
    }
    
    public List<Specialty> getAllSpecialties() {
        return specialtyRepository.findAll();
    }
    
    public Specialty saveSpecialty(Specialty specialty) {
        return specialtyRepository.save(specialty);
    }
    
    public void deleteSpecialty(Long id) {
        specialtyRepository.deleteById(id);
    }
    
    public Optional<Specialty> getSpecialtyById(Long id) {
        return specialtyRepository.findById(id);
    }
    
    // Certification Methods
    public List<Certification> getAllActiveCertifications() {
        return certificationRepository.findByIsActiveTrueOrderByDisplayOrderAsc();
    }
    
    public List<Certification> getAllCertifications() {
        return certificationRepository.findAll();
    }
    
    public Certification saveCertification(Certification certification) {
        return certificationRepository.save(certification);
    }
    
    public void deleteCertification(Long id) {
        certificationRepository.deleteById(id);
    }
    
    public Optional<Certification> getCertificationById(Long id) {
        return certificationRepository.findById(id);
    }
    
    // Statistic Methods
    public List<Statistic> getAllActiveStatistics() {
        return statisticRepository.findByIsActiveTrueOrderByDisplayOrderAsc();
    }
    
    public List<Statistic> getAllStatistics() {
        return statisticRepository.findAll();
    }
    
    public Statistic saveStatistic(Statistic statistic) {
        return statisticRepository.save(statistic);
    }
    
    public void deleteStatistic(Long id) {
        statisticRepository.deleteById(id);
    }
    
    public Optional<Statistic> getStatisticById(Long id) {
        return statisticRepository.findById(id);
    }
    
    // Banner Methods
    public List<Banner> getAllActiveBanners() {
        return bannerRepository.findByIsActiveTrueOrderByDisplayOrderAsc();
    }
    
    public List<Banner> getActiveBannersByPage(String page) {
        return bannerRepository.findByPageAndIsActiveTrueOrderByDisplayOrderAsc(page);
    }
    
    public List<Banner> getAllBanners() {
        return bannerRepository.findAll();
    }
    
    public Banner saveBanner(Banner banner) {
        return bannerRepository.save(banner);
    }
    
    public void deleteBanner(Long id) {
        bannerRepository.deleteById(id);
    }
    
    public Optional<Banner> getBannerById(Long id) {
        return bannerRepository.findById(id);
    }
    
    // Admin Methods - Get ALL items (including inactive)
    public List<HomePageContent> getAllHomePageContent() {
        return homePageContentRepository.findAll();
    }
    
    public List<com.doctorappointment.model.Service> getAllServices() {
        return serviceRepository.findAll();
    }
    
    public List<Testimonial> getAllTestimonials() {
        return testimonialRepository.findAll();
    }
    
    public List<Feature> getAllFeatures() {
        return featureRepository.findAll();
    }
    
    // News Category Methods
    public List<NewsCategory> getAllActiveNewsCategories() {
        return newsCategoryRepository.findAllActiveOrderByDisplayOrder();
    }
    
    public List<NewsCategory> getAllNewsCategories() {
        return newsCategoryRepository.findAllOrderByDisplayOrder();
    }
    
    public NewsCategory saveNewsCategory(NewsCategory category) {
        return newsCategoryRepository.save(category);
    }
    
    public void deleteNewsCategory(Long id) {
        newsCategoryRepository.deleteById(id);
    }
    
    public Optional<NewsCategory> getNewsCategoryById(Long id) {
        return newsCategoryRepository.findById(id);
    }
    
    public Optional<NewsCategory> getNewsCategoryBySlug(String slug) {
        return newsCategoryRepository.findBySlug(slug);
    }
    
    public boolean existsByName(String name) {
        return newsCategoryRepository.existsByName(name);
    }
    
    public boolean existsBySlug(String slug) {
        return newsCategoryRepository.existsBySlug(slug);
    }
    
    // Membership Benefit Methods
    public List<MembershipBenefit> getAllActiveMembershipBenefits() {
        return membershipBenefitRepository.findByIsActiveTrueOrderByDisplayOrderAsc();
    }
    
    public List<MembershipBenefit> getAllMembershipBenefits() {
        return membershipBenefitRepository.findAllByOrderByDisplayOrderAsc();
    }
    
    public Optional<MembershipBenefit> getMembershipBenefitById(Long id) {
        return membershipBenefitRepository.findById(id);
    }
    
    public MembershipBenefit saveMembershipBenefit(MembershipBenefit benefit) {
        return membershipBenefitRepository.save(benefit);
    }
    
    public void deleteMembershipBenefit(Long id) {
        membershipBenefitRepository.deleteById(id);
    }
    
    // News Section Methods
    @Autowired
    private NewsSectionRepository newsSectionRepository;
    
    @Autowired
    private NewsSidebarWidgetRepository newsSidebarWidgetRepository;
    
    public List<NewsSection> getAllActiveNewsSections() {
        return newsSectionRepository.findByIsActiveTrueOrderByDisplayOrderAsc();
    }
    
    public List<NewsSection> getActiveNewsSectionsByPage(String page) {
        // Get sections for specific page or 'both'
        return newsSectionRepository.findByIsActiveTrueAndPageInOrderByDisplayOrderAsc(
            List.of(page, "both")
        );
    }
    
    public List<NewsSection> getAllNewsSections() {
        return newsSectionRepository.findAllByOrderByDisplayOrderAsc();
    }
    
    public Optional<NewsSection> getNewsSectionById(Long id) {
        return newsSectionRepository.findById(id);
    }
    
    public Optional<NewsSection> getNewsSectionByName(String name) {
        return newsSectionRepository.findByName(name);
    }
    
    public NewsSection saveNewsSection(NewsSection section) {
        return newsSectionRepository.save(section);
    }
    
    public void deleteNewsSection(Long id) {
        newsSectionRepository.deleteById(id);
    }
    
    public List<NewsArticle> getNewsBySectionName(String sectionName, int limit) {
        // Get section to check category filter
        NewsSection section = newsSectionRepository.findByName(sectionName)
            .orElse(null);
        
        if (section == null) {
            return new ArrayList<>();
        }
        
        // If section has category filter, filter by categories ONLY (not by section_name)
        if (section.getCategoryFilter() != null && !section.getCategoryFilter().isEmpty()) {
            // Parse JSON array of categories
            try {
                // Remove brackets and quotes, split by comma
                String categoriesStr = section.getCategoryFilter()
                    .replace("[", "")
                    .replace("]", "")
                    .replace("\"", "");
                
                if (categoriesStr.trim().isEmpty()) {
                    // Empty array, return all approved articles
                    return newsArticleRepository.findByStatusAndIsActiveTrueOrderByPublishedAtDesc(
                        "APPROVED",
                        PageRequest.of(0, limit)
                    );
                }
                
                String[] categories = categoriesStr.split(",");
                List<String> categoryList = new ArrayList<>();
                for (String cat : categories) {
                    categoryList.add(cat.trim());
                }
                
                // Get articles from all selected categories (NO section_name filter)
                return newsArticleRepository.findByCategoryInAndStatusAndIsActiveTrueOrderByPublishedAtDesc(
                    categoryList,
                    "APPROVED",
                    PageRequest.of(0, limit)
                );
            } catch (Exception e) {
                // If parsing fails, return all approved articles
                return newsArticleRepository.findByStatusAndIsActiveTrueOrderByPublishedAtDesc(
                    "APPROVED",
                    PageRequest.of(0, limit)
                );
            }
        }
        
        // If no category filter, return all approved articles
        return newsArticleRepository.findByStatusAndIsActiveTrueOrderByPublishedAtDesc(
            "APPROVED",
            PageRequest.of(0, limit)
        );
    }

    // ==================== NEWS SIDEBAR WIDGETS ====================
    
    public List<NewsSidebarWidget> getAllNewsSidebarWidgets() {
        return newsSidebarWidgetRepository.findAllByOrderByDisplayOrderAsc();
    }
    
    public List<NewsSidebarWidget> getActiveNewsSidebarWidgets() {
        return newsSidebarWidgetRepository.findAllActiveOrderByDisplayOrder();
    }
    
    public NewsSidebarWidget getNewsSidebarWidgetById(Long id) {
        return newsSidebarWidgetRepository.findById(id).orElse(null);
    }
    
    public NewsSidebarWidget createNewsSidebarWidget(NewsSidebarWidget widget) {
        return newsSidebarWidgetRepository.save(widget);
    }
    
    public NewsSidebarWidget updateNewsSidebarWidget(Long id, NewsSidebarWidget widget) {
        widget.setId(id);
        return newsSidebarWidgetRepository.save(widget);
    }
    
    public void deleteNewsSidebarWidget(Long id) {
        newsSidebarWidgetRepository.deleteById(id);
    }
    
    // ==================== ARTICLE CTA SECTION ====================
    
    @Autowired
    private ArticleCtaSectionRepository articleCtaSectionRepository;
    
    public Optional<ArticleCtaSection> getArticleCtaSection() {
        return articleCtaSectionRepository.findFirstByIsActiveTrueOrderByIdAsc();
    }
    
    public ArticleCtaSection saveArticleCtaSection(ArticleCtaSection section) {
        return articleCtaSectionRepository.save(section);
    }
    
    // ==================== ABOUT PAGE CONTENT ====================
    
    @Autowired
    private AboutPageContentRepository aboutPageContentRepository;
    
    public AboutPageContent getAboutSection(String sectionKey) {
        return aboutPageContentRepository.findBySectionKey(sectionKey).orElse(null);
    }
    
    public AboutPageContent saveAboutSection(AboutPageContent content) {
        // Check if section already exists
        Optional<AboutPageContent> existing = aboutPageContentRepository.findBySectionKey(content.getSectionKey());
        if (existing.isPresent()) {
            // Update existing record
            AboutPageContent existingContent = existing.get();
            existingContent.setContentJson(content.getContentJson());
            existingContent.setIsActive(content.getIsActive());
            return aboutPageContentRepository.save(existingContent);
        } else {
            // Create new record
            return aboutPageContentRepository.save(content);
        }
    }
    
    public List<AboutPageContent> getAllAboutSections() {
        return aboutPageContentRepository.findAll();
    }
    
    // ==================== SERVICE CATEGORIES ====================
    
    public List<ServiceCategory> getActiveServiceCategories() {
        return serviceCategoryRepository.findByIsActiveTrueOrderByDisplayOrderAsc();
    }
    
    public List<ServiceCategory> getAllServiceCategories() {
        return serviceCategoryRepository.findAllByOrderByDisplayOrderAsc();
    }
    
    public Optional<ServiceCategory> getServiceCategoryBySlug(String slug) {
        return serviceCategoryRepository.findBySlug(slug);
    }
    
    public ServiceCategory saveServiceCategory(ServiceCategory category) {
        return serviceCategoryRepository.save(category);
    }
    
    public void deleteServiceCategory(Long id) {
        serviceCategoryRepository.deleteById(id);
    }
    
    // ==================== MEDICAL SERVICES ====================
    
    public List<MedicalService> getActiveMedicalServices() {
        return medicalServiceRepository.findByIsActiveTrueOrderByDisplayOrderAsc();
    }
    
    public List<MedicalService> getAllMedicalServices() {
        return medicalServiceRepository.findAllByOrderByDisplayOrderAsc();
    }
    
    public List<MedicalService> getMedicalServicesByCategory(Long categoryId) {
        return medicalServiceRepository.findByCategoryIdAndIsActiveTrueOrderByDisplayOrderAsc(categoryId);
    }
    
    public List<MedicalService> getFeaturedMedicalServices() {
        return medicalServiceRepository.findByIsFeaturedTrueAndIsActiveTrueOrderByDisplayOrderAsc();
    }
    
    public Optional<MedicalService> getMedicalServiceBySlug(String slug) {
        return medicalServiceRepository.findBySlug(slug);
    }
    
    public MedicalService saveMedicalService(MedicalService service) {
        // Auto-generate slug if not provided or empty
        if (service.getSlug() == null || service.getSlug().trim().isEmpty()) {
            String baseSlug = SlugUtils.toSlug(service.getTitle());
            String uniqueSlug = generateUniqueSlug(baseSlug, service.getId());
            service.setSlug(uniqueSlug);
        } else {
            // If slug is provided, ensure it's unique
            String providedSlug = SlugUtils.toSlug(service.getSlug());
            String uniqueSlug = generateUniqueSlug(providedSlug, service.getId());
            service.setSlug(uniqueSlug);
        }
        
        return medicalServiceRepository.save(service);
    }
    
    private String generateUniqueSlug(String baseSlug, Long serviceId) {
        String slug = baseSlug;
        int counter = 1;
        
        // Check if slug exists (excluding current service if updating)
        while (true) {
            Optional<MedicalService> existing = medicalServiceRepository.findBySlug(slug);
            
            // If no existing service found, or it's the same service being updated
            if (!existing.isPresent() || (serviceId != null && existing.get().getId().equals(serviceId))) {
                break;
            }
            
            // Slug exists, append counter
            slug = baseSlug + "-" + counter;
            counter++;
        }
        
        return slug;
    }
    
    public void deleteMedicalService(Long id) {
        medicalServiceRepository.deleteById(id);
    }
}

