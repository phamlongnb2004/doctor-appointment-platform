import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const cmsAPI = {
  // Public endpoints
  getHomePageContent: () => axios.get(`${API_BASE_URL}/cms/homepage-content`),
  getHomePageContentBySection: (sectionKey) => axios.get(`${API_BASE_URL}/cms/homepage-content/${sectionKey}`),
  getServices: () => axios.get(`${API_BASE_URL}/cms/services`),
  getLatestNews: (limit = 4) => axios.get(`${API_BASE_URL}/cms/news?limit=${limit}`),
  getFeaturedNews: (limit = 3) => axios.get(`${API_BASE_URL}/cms/news/featured?limit=${limit}`),
  getNewsBySlug: (slug) => axios.get(`${API_BASE_URL}/cms/news/${slug}`),
  getNewsByCategory: (category, limit = 20) => axios.get(`${API_BASE_URL}/cms/news/category/${category}?limit=${limit}`),
  getNewsCategories: () => axios.get(`${API_BASE_URL}/cms/news-categories`), // Public endpoint - returns NewsCategory objects
  
  // News Categories Management (Admin)
  getAllNewsCategories: () => {
    const token = localStorage.getItem('token');
    return axios.get(`${API_BASE_URL}/cms/admin/news-categories`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  createNewsCategory: (category) => {
    const token = localStorage.getItem('token');
    return axios.post(`${API_BASE_URL}/cms/admin/news-categories`, category, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  updateNewsCategory: (id, category) => {
    const token = localStorage.getItem('token');
    return axios.put(`${API_BASE_URL}/cms/admin/news-categories/${id}`, category, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  deleteNewsCategory: (id) => {
    const token = localStorage.getItem('token');
    return axios.delete(`${API_BASE_URL}/cms/admin/news-categories/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  getTestimonials: () => axios.get(`${API_BASE_URL}/cms/testimonials`),
  getFeaturedTestimonials: (limit = 3) => axios.get(`${API_BASE_URL}/cms/testimonials/featured?limit=${limit}`),
  
  // Admin endpoints - Get ALL items (including inactive)
  getAllServices: () => {
    const token = localStorage.getItem('token');
    return axios.get(`${API_BASE_URL}/cms/admin/services/all`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  getAllFeatures: () => {
    const token = localStorage.getItem('token');
    return axios.get(`${API_BASE_URL}/cms/admin/features/all`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  getAllSpecialties: () => {
    const token = localStorage.getItem('token');
    return axios.get(`${API_BASE_URL}/cms/admin/specialties/all`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  getAllStatistics: () => {
    const token = localStorage.getItem('token');
    return axios.get(`${API_BASE_URL}/cms/admin/statistics/all`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  getAllCertifications: () => {
    const token = localStorage.getItem('token');
    return axios.get(`${API_BASE_URL}/cms/admin/certifications/all`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  getAllBanners: () => {
    const token = localStorage.getItem('token');
    return axios.get(`${API_BASE_URL}/cms/admin/banners/all`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  getAllTestimonials: () => {
    const token = localStorage.getItem('token');
    return axios.get(`${API_BASE_URL}/cms/admin/testimonials/all`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  getAllHomePageContent: () => {
    const token = localStorage.getItem('token');
    return axios.get(`${API_BASE_URL}/cms/admin/homepage-content/all`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  // Bài viết của bác sĩ
  getArticlesByDoctor: (doctorId) => axios.get(`${API_BASE_URL}/cms/news/doctor/${doctorId}`),

  // Admin endpoints
  createHomePageContent: (data) => {
    const token = localStorage.getItem('token');
    return axios.post(`${API_BASE_URL}/cms/admin/homepage-content`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  updateHomePageContent: (id, data) => {
    const token = localStorage.getItem('token');
    return axios.put(`${API_BASE_URL}/cms/admin/homepage-content/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  deleteHomePageContent: (id) => {
    const token = localStorage.getItem('token');
    return axios.delete(`${API_BASE_URL}/cms/admin/homepage-content/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  createService: (data) => {
    const token = localStorage.getItem('token');
    return axios.post(`${API_BASE_URL}/cms/admin/services`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  updateService: (id, data) => {
    const token = localStorage.getItem('token');
    return axios.put(`${API_BASE_URL}/cms/admin/services/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  deleteService: (id) => {
    const token = localStorage.getItem('token');
    return axios.delete(`${API_BASE_URL}/cms/admin/services/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  createNewsArticle: (data) => {
    const token = localStorage.getItem('token');
    return axios.post(`${API_BASE_URL}/cms/admin/news`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  updateNewsArticle: (id, data) => {
    const token = localStorage.getItem('token');
    return axios.put(`${API_BASE_URL}/cms/admin/news/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  deleteNewsArticle: (id) => {
    const token = localStorage.getItem('token');
    return axios.delete(`${API_BASE_URL}/cms/admin/news/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  createTestimonial: (data) => {
    const token = localStorage.getItem('token');
    return axios.post(`${API_BASE_URL}/cms/admin/testimonials`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  updateTestimonial: (id, data) => {
    const token = localStorage.getItem('token');
    return axios.put(`${API_BASE_URL}/cms/admin/testimonials/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  deleteTestimonial: (id) => {
    const token = localStorage.getItem('token');
    return axios.delete(`${API_BASE_URL}/cms/admin/testimonials/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  // Doctor endpoints - Bác sĩ đăng bài
  createDoctorArticle: (data) => {
    const token = localStorage.getItem('token');
    return axios.post(`${API_BASE_URL}/cms/doctor/news`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  getDoctorArticles: (doctorId) => {
    const token = localStorage.getItem('token');
    return axios.get(`${API_BASE_URL}/cms/doctor/news/${doctorId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  updateDoctorArticle: (id, data) => {
    const token = localStorage.getItem('token');
    return axios.put(`${API_BASE_URL}/cms/doctor/news/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  deleteDoctorArticle: (id) => {
    const token = localStorage.getItem('token');
    return axios.delete(`${API_BASE_URL}/cms/doctor/news/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  // Admin endpoints - Quản lý bài viết
  getPendingArticles: () => {
    const token = localStorage.getItem('token');
    return axios.get(`${API_BASE_URL}/cms/admin/news/pending`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  getAllArticlesForAdmin: () => {
    const token = localStorage.getItem('token');
    return axios.get(`${API_BASE_URL}/cms/admin/news/all`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  approveArticle: (id) => {
    const token = localStorage.getItem('token');
    return axios.put(`${API_BASE_URL}/cms/admin/news/${id}/approve`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  rejectArticle: (id) => {
    const token = localStorage.getItem('token');
    return axios.put(`${API_BASE_URL}/cms/admin/news/${id}/reject`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  // Feature endpoints
  getFeatures: () => axios.get(`${API_BASE_URL}/cms/features`),
  
  createFeature: (data) => {
    const token = localStorage.getItem('token');
    return axios.post(`${API_BASE_URL}/cms/admin/features`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  updateFeature: (id, data) => {
    const token = localStorage.getItem('token');
    return axios.put(`${API_BASE_URL}/cms/admin/features/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  deleteFeature: (id) => {
    const token = localStorage.getItem('token');
    return axios.delete(`${API_BASE_URL}/cms/admin/features/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  // Specialty endpoints
  getSpecialties: () => axios.get(`${API_BASE_URL}/cms/specialties`),
  
  createSpecialty: (data) => {
    const token = localStorage.getItem('token');
    return axios.post(`${API_BASE_URL}/cms/admin/specialties`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  updateSpecialty: (id, data) => {
    const token = localStorage.getItem('token');
    return axios.put(`${API_BASE_URL}/cms/admin/specialties/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  deleteSpecialty: (id) => {
    const token = localStorage.getItem('token');
    return axios.delete(`${API_BASE_URL}/cms/admin/specialties/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  // Statistic endpoints
  getStatistics: () => axios.get(`${API_BASE_URL}/cms/statistics`),
  
  createStatistic: (data) => {
    const token = localStorage.getItem('token');
    return axios.post(`${API_BASE_URL}/cms/admin/statistics`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  updateStatistic: (id, data) => {
    const token = localStorage.getItem('token');
    return axios.put(`${API_BASE_URL}/cms/admin/statistics/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  deleteStatistic: (id) => {
    const token = localStorage.getItem('token');
    return axios.delete(`${API_BASE_URL}/cms/admin/statistics/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  // Certification endpoints
  getCertifications: () => axios.get(`${API_BASE_URL}/cms/certifications`),
  
  createCertification: (data) => {
    const token = localStorage.getItem('token');
    return axios.post(`${API_BASE_URL}/cms/admin/certifications`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  updateCertification: (id, data) => {
    const token = localStorage.getItem('token');
    return axios.put(`${API_BASE_URL}/cms/admin/certifications/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  deleteCertification: (id) => {
    const token = localStorage.getItem('token');
    return axios.delete(`${API_BASE_URL}/cms/admin/certifications/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  uploadCertificationImage: (formData) => {
    const token = localStorage.getItem('token');
    return axios.post(`${API_BASE_URL}/cms/admin/certifications/upload-image`, formData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  // Banner endpoints
  getBanners: () => axios.get(`${API_BASE_URL}/cms/banners`),
  getBannersByPage: (page) => axios.get(`${API_BASE_URL}/cms/banners/${page}`),
  
  createBanner: (data) => {
    const token = localStorage.getItem('token');
    return axios.post(`${API_BASE_URL}/cms/admin/banners`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  updateBanner: (id, data) => {
    const token = localStorage.getItem('token');
    return axios.put(`${API_BASE_URL}/cms/admin/banners/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  deleteBanner: (id) => {
    const token = localStorage.getItem('token');
    return axios.delete(`${API_BASE_URL}/cms/admin/banners/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  // Site Settings endpoints
  getSiteSettings: () => axios.get(`${API_BASE_URL}/cms/site-settings`),
  
  updateSiteSettings: (data) => {
    const token = localStorage.getItem('token');
    return axios.put(`${API_BASE_URL}/cms/admin/site-settings`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  // Membership Benefits endpoints
  getMembershipBenefits: () => axios.get(`${API_BASE_URL}/cms/membership-benefits`),
  
  getAllMembershipBenefits: () => {
    const token = localStorage.getItem('token');
    return axios.get(`${API_BASE_URL}/cms/admin/membership-benefits/all`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  createMembershipBenefit: (data) => {
    const token = localStorage.getItem('token');
    return axios.post(`${API_BASE_URL}/cms/admin/membership-benefits`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  updateMembershipBenefit: (id, data) => {
    const token = localStorage.getItem('token');
    return axios.put(`${API_BASE_URL}/cms/admin/membership-benefits/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  deleteMembershipBenefit: (id) => {
    const token = localStorage.getItem('token');
    return axios.delete(`${API_BASE_URL}/cms/admin/membership-benefits/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  // ==================== NEWS SECTIONS ====================
  
  // Get all active news sections (public)
  getAllActiveNewsSections: () => {
    return axios.get(`${API_BASE_URL}/cms/news-sections`);
  },
  
  // Get active news sections by page (home, news, or both)
  getActiveNewsSectionsByPage: (page) => {
    return axios.get(`${API_BASE_URL}/cms/news-sections/page/${page}`);
  },
  
  // Get all news sections (admin)
  getAllNewsSections: () => {
    const token = localStorage.getItem('token');
    return axios.get(`${API_BASE_URL}/cms/admin/news-sections`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  // Get news section by ID (admin)
  getNewsSectionById: (id) => {
    const token = localStorage.getItem('token');
    return axios.get(`${API_BASE_URL}/cms/admin/news-sections/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  // Get news section by name (public)
  getNewsSectionByName: (name) => {
    return axios.get(`${API_BASE_URL}/cms/news-sections/${name}`);
  },
  
  // Create news section (admin)
  createNewsSection: (data) => {
    const token = localStorage.getItem('token');
    return axios.post(`${API_BASE_URL}/cms/admin/news-sections`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  // Update news section (admin)
  updateNewsSection: (id, data) => {
    const token = localStorage.getItem('token');
    return axios.put(`${API_BASE_URL}/cms/admin/news-sections/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  // Delete news section (admin)
  deleteNewsSection: (id) => {
    const token = localStorage.getItem('token');
    return axios.delete(`${API_BASE_URL}/cms/admin/news-sections/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  // Get news articles by section name
  getNewsBySectionName: (sectionName, limit = 4) => {
    return axios.get(`${API_BASE_URL}/cms/news-sections/${sectionName}/articles`, {
      params: { limit }
    });
  },

  // ==================== NEWS SIDEBAR WIDGETS ====================
  
  // Get active sidebar widgets (public)
  getNewsSidebarWidgets: () => {
    return axios.get(`${API_BASE_URL}/cms/news-sidebar-widgets`);
  },
  
  // Get all sidebar widgets (admin)
  getAllNewsSidebarWidgets: () => {
    const token = localStorage.getItem('token');
    return axios.get(`${API_BASE_URL}/cms/admin/news-sidebar-widgets`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  // Create sidebar widget (admin)
  createNewsSidebarWidget: (data) => {
    const token = localStorage.getItem('token');
    return axios.post(`${API_BASE_URL}/cms/admin/news-sidebar-widgets`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  // Update sidebar widget (admin)
  updateNewsSidebarWidget: (id, data) => {
    const token = localStorage.getItem('token');
    return axios.put(`${API_BASE_URL}/cms/admin/news-sidebar-widgets/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  // Delete sidebar widget (admin)
  deleteNewsSidebarWidget: (id) => {
    const token = localStorage.getItem('token');
    return axios.delete(`${API_BASE_URL}/cms/admin/news-sidebar-widgets/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  // ==================== ARTICLE CTA SECTION ====================
  
  // Get article CTA section (public)
  getArticleCtaSection: () => {
    return axios.get(`${API_BASE_URL}/cms/article-cta-section`);
  },
  
  // Update article CTA section (admin)
  updateArticleCtaSection: (id, data) => {
    const token = localStorage.getItem('token');
    return axios.put(`${API_BASE_URL}/cms/admin/article-cta-section/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  // ==================== SLUG UTILITIES ====================
  
  // Generate slug from title
  generateSlug: (title) => {
    return axios.get(`${API_BASE_URL}/cms/slug/generate`, {
      params: { title }
    });
  },
  
  // Check if slug exists
  checkSlug: (slug, articleId = null) => {
    const params = { slug };
    if (articleId) {
      params.articleId = articleId;
    }
    return axios.get(`${API_BASE_URL}/cms/slug/check`, { params });
  },

  // ==================== ABOUT PAGE ====================
  
  // Get specific about section
  getAboutSection: (sectionKey) => {
    return axios.get(`${API_BASE_URL}/cms/about/${sectionKey}`);
  },
  
  // Save about section
  saveAboutSection: (sectionKey, data) => {
    return axios.post(`${API_BASE_URL}/cms/about/${sectionKey}`, data);
  },
  
  // Get all about sections
  getAllAboutSections: () => {
    return axios.get(`${API_BASE_URL}/cms/about`);
  }
};

export default cmsAPI;
