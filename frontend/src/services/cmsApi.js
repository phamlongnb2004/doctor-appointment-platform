import axios from 'axios';

// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const cmsAPI = {
  // Public endpoints
  getHomePageContent: () => axios.get(`${API_BASE_URL}/cms/homepage-content`),
  getHomePageContentBySection: (sectionKey) => axios.get(`${API_BASE_URL}/cms/homepage-content/${sectionKey}`),
  getServices: () => axios.get(`${API_BASE_URL}/cms/services`),
  getLatestNews: (limit = 4) => axios.get(`${API_BASE_URL}/cms/news?limit=${limit}`),
  getFeaturedNews: (limit = 3) => axios.get(`${API_BASE_URL}/cms/news/featured?limit=${limit}`),
  getNewsBySlug: (slug) => axios.get(`${API_BASE_URL}/cms/news/${slug}`),
  getTestimonials: () => axios.get(`${API_BASE_URL}/cms/testimonials`),
  getFeaturedTestimonials: (limit = 3) => axios.get(`${API_BASE_URL}/cms/testimonials/featured?limit=${limit}`),
  
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

  getAllSpecialtiesForAdmin: () => {
    const token = localStorage.getItem('token');
    return axios.get(`${API_BASE_URL}/cms/admin/specialties`, {
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

  getAllCertificationsForAdmin: () => {
    const token = localStorage.getItem('token');
    return axios.get(`${API_BASE_URL}/cms/admin/certifications`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  // Banner endpoints
  getBannersByPage: (page) => axios.get(`${API_BASE_URL}/cms/banners/${page}`),
  
  getAllBanners: () => {
    const token = localStorage.getItem('token');
    return axios.get(`${API_BASE_URL}/cms/admin/banners/all`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
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

  // Statistics endpoints
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

  // Site Settings endpoints
  getSiteSettings: () => axios.get(`${API_BASE_URL}/cms/site-settings`),
  
  updateSiteSettings: (data) => {
    const token = localStorage.getItem('token');
    return axios.put(`${API_BASE_URL}/cms/admin/site-settings`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  // News Category endpoints
  getAllNewsCategories: () => {
    const token = localStorage.getItem('token');
    return axios.get(`${API_BASE_URL}/cms/admin/news-categories`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  createNewsCategory: (data) => {
    const token = localStorage.getItem('token');
    return axios.post(`${API_BASE_URL}/cms/admin/news-categories`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  updateNewsCategory: (id, data) => {
    const token = localStorage.getItem('token');
    return axios.put(`${API_BASE_URL}/cms/admin/news-categories/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  deleteNewsCategory: (id) => {
    const token = localStorage.getItem('token');
    return axios.delete(`${API_BASE_URL}/cms/admin/news-categories/${id}`, {
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

  // News Sections endpoints
  getAllNewsSections: () => {
    const token = localStorage.getItem('token');
    return axios.get(`${API_BASE_URL}/cms/admin/news-sections`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  getActiveNewsSectionsByPage: (page) => axios.get(`${API_BASE_URL}/cms/news-sections/page/${page}`),
  
  getNewsBySectionName: (sectionName, limit = 4) => 
    axios.get(`${API_BASE_URL}/cms/news-sections/${sectionName}/articles?limit=${limit}`),
  
  createNewsSection: (data) => {
    const token = localStorage.getItem('token');
    return axios.post(`${API_BASE_URL}/cms/admin/news-sections`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  updateNewsSection: (id, data) => {
    const token = localStorage.getItem('token');
    return axios.put(`${API_BASE_URL}/cms/admin/news-sections/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  deleteNewsSection: (id) => {
    const token = localStorage.getItem('token');
    return axios.delete(`${API_BASE_URL}/cms/admin/news-sections/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  // News Sidebar Widgets endpoints
  getAllNewsSidebarWidgets: () => {
    const token = localStorage.getItem('token');
    return axios.get(`${API_BASE_URL}/cms/admin/news-sidebar-widgets`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  getActiveNewsSidebarWidgets: () => axios.get(`${API_BASE_URL}/cms/news-sidebar-widgets`),
  
  createNewsSidebarWidget: (data) => {
    const token = localStorage.getItem('token');
    return axios.post(`${API_BASE_URL}/cms/admin/news-sidebar-widgets`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  updateNewsSidebarWidget: (id, data) => {
    const token = localStorage.getItem('token');
    return axios.put(`${API_BASE_URL}/cms/admin/news-sidebar-widgets/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  
  deleteNewsSidebarWidget: (id) => {
    const token = localStorage.getItem('token');
    return axios.delete(`${API_BASE_URL}/cms/admin/news-sidebar-widgets/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  // Article CTA Section endpoints
  getArticleCtaSection: () => axios.get(`${API_BASE_URL}/cms/article-cta-section`),
  
  updateArticleCtaSection: (id, data) => {
    const token = localStorage.getItem('token');
    return axios.put(`${API_BASE_URL}/cms/admin/article-cta-section/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  // About Page endpoints
  getAllAboutSections: () => axios.get(`${API_BASE_URL}/cms/about`),
  
  getAboutSection: (sectionKey) => axios.get(`${API_BASE_URL}/cms/about/${sectionKey}`),
  
  updateAboutSection: (sectionKey, data) => {
    const token = localStorage.getItem('token');
    return axios.post(`${API_BASE_URL}/cms/about/${sectionKey}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  // Slug utilities
  generateSlug: (title) => axios.get(`${API_BASE_URL}/cms/slug/generate`, { params: { title } }),
  
  checkSlug: (slug, articleId = null) => {
    const params = articleId ? `?articleId=${articleId}` : '';
    return axios.get(`${API_BASE_URL}/cms/slug/check/${slug}${params}`);
  },

  // Service Category endpoints
  getServiceCategories: () => axios.get(`${API_BASE_URL}/cms/service-categories`),

  getAllServiceCategories: () => {
    const token = localStorage.getItem('token');
    return axios.get(`${API_BASE_URL}/cms/admin/service-categories`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  createServiceCategory: (data) => {
    const token = localStorage.getItem('token');
    return axios.post(`${API_BASE_URL}/cms/admin/service-categories`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  updateServiceCategory: (id, data) => {
    const token = localStorage.getItem('token');
    return axios.put(`${API_BASE_URL}/cms/admin/service-categories/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  deleteServiceCategory: (id) => {
    const token = localStorage.getItem('token');
    return axios.delete(`${API_BASE_URL}/cms/admin/service-categories/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  // Medical Service endpoints
  getMedicalServices: () => axios.get(`${API_BASE_URL}/cms/medical-services`),

  getMedicalServiceBySlug: (slug) => axios.get(`${API_BASE_URL}/cms/medical-services/${slug}`),

  getMedicalServicesByCategory: (categoryId) => 
    axios.get(`${API_BASE_URL}/cms/medical-services/category/${categoryId}`),

  getAllMedicalServices: () => {
    const token = localStorage.getItem('token');
    return axios.get(`${API_BASE_URL}/cms/admin/medical-services`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  createMedicalService: (data) => {
    const token = localStorage.getItem('token');
    return axios.post(`${API_BASE_URL}/cms/admin/medical-services`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  updateMedicalService: (id, data) => {
    const token = localStorage.getItem('token');
    return axios.put(`${API_BASE_URL}/cms/admin/medical-services/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  deleteMedicalService: (id) => {
    const token = localStorage.getItem('token');
    return axios.delete(`${API_BASE_URL}/cms/admin/medical-services/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};

export default cmsAPI;
