import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Tabs, 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Switch, 
  InputNumber,
  message,
  Space,
  Popconfirm,
  Upload,
  Select,
  Tag,
  Layout,
  Menu,
  Avatar,
  Divider,
  ConfigProvider,
  Drawer,
  Typography
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  UploadOutlined,
  CheckOutlined,
  CloseOutlined,
  EyeOutlined,
  HomeOutlined,
  FileTextOutlined,
  SettingOutlined,
  PictureOutlined,
  CustomerServiceOutlined,
  StarOutlined,
  TrophyOutlined,
  BarChartOutlined,
  MedicineBoxOutlined,
  CommentOutlined,
  UserOutlined,
  TagOutlined,
  MenuOutlined,
  AppstoreOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import cmsAPI from '../services/cmsApi';
import axios from 'axios';
import ArticleCtaSection from '../components/ArticleCtaSection';
import '../styles/admin-cms.css';

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;
const { Sider, Content } = Layout;

// Get API base URL from environment variable
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

function AdminCMSPage() {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [currentTab, setCurrentTab] = useState('banners');
  const [form] = Form.useForm();
  const [userAvatar, setUserAvatar] = useState(null);
  const [benefitsList, setBenefitsList] = useState(['']); // Dynamic benefits list
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  
  // Article detail modal
  const [articleDetailVisible, setArticleDetailVisible] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Data states
  const [homePageContent, setHomePageContent] = useState([]);
  const [services, setServices] = useState([]);
  const [newsArticles, setNewsArticles] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [doctorArticles, setDoctorArticles] = useState([]);
  const [features, setFeatures] = useState([]);
  const [banners, setBanners] = useState([]); // Banner trang chủ
  const [newsBanners, setNewsBanners] = useState([]); // Banner trang tin tức
  const [specialties, setSpecialties] = useState([]);
  const [statistics, setStatistics] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [newsCategories, setNewsCategories] = useState([]);
  const [newsSections, setNewsSections] = useState([]);
  const [newsSidebarWidgets, setNewsSidebarWidgets] = useState([]);
  const [articleCtaSection, setArticleCtaSection] = useState(null);
  const [membershipBenefits, setMembershipBenefits] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [iconUrl, setIconUrl] = useState('');
  const [galleryImages, setGalleryImages] = useState([]); // For multiple images
  const [currentColor, setCurrentColor] = useState('#1890ff');
  const [currentTextColor, setCurrentTextColor] = useState('#FFFFFF');
  const [imagePreview, setImagePreview] = useState(''); // For doctor-articles image preview
  const [uploadedImage, setUploadedImage] = useState(null); // For doctor-articles uploaded file
  const [siteSettings, setSiteSettings] = useState({
    siteName: 'KHAMNOW',
    siteTagline: 'Chăm sóc sức khỏe',
    logoUrl: '',
    hotline: '19005656',
    email: '',
    address: ''
  });
  const [logoPreview, setLogoPreview] = useState('');
  const [statisticsBackgroundPreview, setStatisticsBackgroundPreview] = useState('');
  
  // Slug states
  const [slugChecking, setSlugChecking] = useState(false);
  const [slugExists, setSlugExists] = useState(false);
  const [slugSuggestion, setSlugSuggestion] = useState('');
  
  // About Page states
  const [aboutHero, setAboutHero] = useState(null);
  const [aboutMission, setAboutMission] = useState(null);
  const [aboutValues, setAboutValues] = useState([]);
  const [aboutAchievements, setAboutAchievements] = useState([]);
  const [aboutTimeline, setAboutTimeline] = useState([]);
  const [aboutTeam, setAboutTeam] = useState([]);
  const [aboutSubTab, setAboutSubTab] = useState('hero');
  
  // Medical Services states
  const [medicalServices, setMedicalServices] = useState([]);
  const [serviceCategories, setServiceCategories] = useState([]);

  useEffect(() => {
    fetchAllData();
    fetchUserAvatar();
  }, []);

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchUserAvatar = async () => {
    try {
      const userId = localStorage.getItem('userId');
      console.log('Fetching avatar for userId:', userId);
      if (userId) {
        const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        console.log('User data response:', response.data);
        console.log('Profile image:', response.data.profileImage);
        if (response.data.profileImage) {
          // profileImage already contains full URL or relative path
          const avatarUrl = response.data.profileImage.startsWith('http') 
            ? response.data.profileImage 
            : `${API_BASE_URL.replace('/api', '')}${response.data.profileImage}`;
          console.log('Setting avatar URL:', avatarUrl);
          setUserAvatar(avatarUrl);
        } else {
          console.log('No profile image found for user');
        }
      }
    } catch (error) {
      console.error('Error fetching user avatar:', error);
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      // Try admin endpoints first, fallback to public if not available
      const fetchWithFallback = async (adminEndpoint, publicEndpoint) => {
        try {
          console.log('Fetching:', adminEndpoint);
          return await axios.get(adminEndpoint, { headers });
        } catch (error) {
          console.error(`Error fetching ${adminEndpoint}:`, error.response?.status, error.response?.data);
          console.log(`Admin endpoint not available, using public: ${publicEndpoint}`);
          return await axios.get(publicEndpoint);
        }
      };
      
      const [
        homePageRes, 
        servicesRes, 
        newsRes, 
        testimonialsRes, 
        doctorArticlesRes, 
        featuresRes, 
        bannersRes,
        newsBannersRes,
        specialtiesRes,
        statisticsRes,
        certificationsRes,
        siteSettingsRes,
        newsCategoriesRes,
        membershipBenefitsRes,
        newsSectionsRes,
        newsSidebarWidgetsRes,
        articleCtaSectionRes,
        serviceCategoriesRes,
        medicalServicesRes
      ] = await Promise.all([
        fetchWithFallback(`${API_BASE_URL}/cms/admin/homepage-content/all`, `${API_BASE_URL}/cms/homepage-content`),
        fetchWithFallback(`${API_BASE_URL}/cms/admin/services/all`, `${API_BASE_URL}/cms/services`),
        cmsAPI.getLatestNews(100), // Get more for admin
        fetchWithFallback(`${API_BASE_URL}/cms/admin/testimonials/all`, `${API_BASE_URL}/cms/testimonials`),
        cmsAPI.getAllArticlesForAdmin(),
        fetchWithFallback(`${API_BASE_URL}/cms/admin/features/all`, `${API_BASE_URL}/cms/features`),
        fetchWithFallback(`${API_BASE_URL}/cms/admin/banners/all`, `${API_BASE_URL}/cms/banners`),
        cmsAPI.getBannersByPage('news'), // Fetch news banners separately
        fetchWithFallback(`${API_BASE_URL}/cms/admin/specialties/all`, `${API_BASE_URL}/cms/specialties`),
        fetchWithFallback(`${API_BASE_URL}/cms/admin/statistics/all`, `${API_BASE_URL}/cms/statistics`),
        fetchWithFallback(`${API_BASE_URL}/cms/admin/certifications/all`, `${API_BASE_URL}/cms/certifications`),
        cmsAPI.getSiteSettings(),
        cmsAPI.getAllNewsCategories(),
        cmsAPI.getAllMembershipBenefits(),
        cmsAPI.getAllNewsSections(),
        cmsAPI.getAllNewsSidebarWidgets(),
        cmsAPI.getArticleCtaSection().catch(() => ({ data: null })),
        cmsAPI.getAllServiceCategories(),
        cmsAPI.getAllMedicalServices()
      ]);

      setHomePageContent(homePageRes.data || []);
      setServices(servicesRes.data || []);
      setNewsArticles(newsRes.data || []);
      setTestimonials(testimonialsRes.data || []);
      setDoctorArticles(doctorArticlesRes.data || []);
      setFeatures(featuresRes.data || []);
      // Filter banners by page
      const allBanners = bannersRes.data || [];
      setBanners(allBanners.filter(b => b.page === 'home' || !b.page)); // Home banners
      setNewsBanners(newsBannersRes.data || []); // News banners
      setSpecialties(specialtiesRes.data || []);
      setStatistics(statisticsRes.data || []);
      setCertifications(certificationsRes.data || []);
      setSiteSettings(siteSettingsRes.data || siteSettings);
      setLogoPreview(siteSettingsRes.data?.logoUrl || '');
      setStatisticsBackgroundPreview(siteSettingsRes.data?.statisticsBackgroundImage || '');
      setNewsCategories(newsCategoriesRes.data || []);
      setMembershipBenefits(membershipBenefitsRes.data || []);
      setNewsSections(newsSectionsRes.data || []);
      setNewsSidebarWidgets(newsSidebarWidgetsRes.data || []);
      setArticleCtaSection(articleCtaSectionRes.data || null);
      setServiceCategories(serviceCategoriesRes.data || []);
      setMedicalServices(medicalServicesRes.data || []);
      
      // Fetch About Page data
      try {
        const aboutSections = await cmsAPI.getAllAboutSections();
        aboutSections.data.forEach(section => {
          const content = JSON.parse(section.contentJson);
          switch(section.sectionKey) {
            case 'hero':
              setAboutHero(content);
              break;
            case 'mission':
              setAboutMission(content);
              break;
            case 'values':
              setAboutValues(content);
              break;
            case 'achievements':
              setAboutAchievements(content);
              break;
            case 'timeline':
              setAboutTimeline(content);
              break;
            case 'team':
              setAboutTeam(content);
              break;
            default:
              break;
          }
        });
      } catch (error) {
        console.error('Error fetching about data:', error);
      }
    } catch (error) {
      console.error('Error in fetchAllData:', error);
      console.error('Error details:', error.response?.status, error.response?.data);
      message.error('Lỗi khi tải dữ liệu: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    setIconUrl(''); // Reset icon preview
    setImagePreview(''); // Reset image preview for doctor-articles
    setUploadedImage(null); // Reset uploaded image
    setGalleryImages([]); // Reset gallery images
    setBenefitsList(['']); // Reset benefits list
    setCurrentColor('#1890ff'); // Reset color
    setCurrentTextColor('#FFFFFF'); // Reset text color
    setSlugExists(false); // Reset slug validation
    setSlugSuggestion(''); // Reset slug suggestion
    setModalVisible(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setSlugExists(false); // Reset slug validation
    setSlugSuggestion(''); // Reset slug suggestion
    
    // Loại bỏ các trường datetime trước khi set vào form
    const { createdAt, updatedAt, publishedAt, ...formData } = item;
    
    // Parse categoryFilter JSON for news-sections
    if (currentTab === 'news-sections' && formData.categoryFilter) {
      try {
        formData.categoryFilter = JSON.parse(formData.categoryFilter);
      } catch (e) {
        // If not JSON, keep as is
        console.log('categoryFilter is not JSON:', formData.categoryFilter);
      }
    }
    
    // Set default layoutType if not present for news-sections
    if (currentTab === 'news-sections' && !formData.layoutType) {
      formData.layoutType = 'default';
    }
    
    form.setFieldsValue(formData);
    
    // Set icon preview from item (for all types that use icon/image)
    setIconUrl(item.icon || item.imageUrl || item.image1 || item.backgroundImage || '');
    
    // Set image preview for doctor-articles
    if (currentTab === 'doctor-articles' && item.imageUrl) {
      setImagePreview(item.imageUrl);
      setUploadedImage(null);
    } else {
      setImagePreview('');
      setUploadedImage(null);
    }
    
    // Load gallery images for medical-services
    if (currentTab === 'medical-services' && item.images) {
      try {
        const gallery = JSON.parse(item.images);
        setGalleryImages(Array.isArray(gallery) ? gallery : []);
      } catch (e) {
        setGalleryImages([]);
      }
    } else {
      setGalleryImages([]);
    }
    
    // Set color from item
    setCurrentColor(item.color || '#1890ff');
    setCurrentTextColor(item.textColor || '#FFFFFF');
    
    // Load benefits list for membership-benefits
    if (currentTab === 'membership-benefits') {
      const benefits = [
        item.benefit1,
        item.benefit2,
        item.benefit3,
        item.benefit4,
        item.benefit5
      ].filter(Boolean);
      setBenefitsList(benefits.length > 0 ? benefits : ['']);
    }
    
    setModalVisible(true);
  };

  const handleUploadIcon = async (file, fieldName = null) => {
    const formData = new FormData();
    formData.append('image', file);  // Changed from 'file' to 'image'
    
    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      console.log('🔵 Uploading image to:', `${API_BASE_URL}/images/articles`);
      
      const response = await axios.post(`${API_BASE_URL}/images/articles`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('🔵 Upload response:', response.data);
      
      const uploadedUrl = response.data.imageUrl || response.data.url;
      console.log('🔵 Extracted URL:', uploadedUrl);
      console.log('🔵 Current tab:', currentTab);
      
      setIconUrl(uploadedUrl);
      
      // Set appropriate field based on current tab or fieldName
      if (fieldName && typeof fieldName === 'string') {
        // For article-cta with specific field names
        console.log('🔵 Setting field:', fieldName, '=', uploadedUrl);
        form.setFieldsValue({ [fieldName]: uploadedUrl });
      } else if (currentTab === 'statistics') {
        console.log('🔵 Setting backgroundImage =', uploadedUrl);
        form.setFieldsValue({ backgroundImage: uploadedUrl });
      } else if (currentTab === 'membership-benefits') {
        console.log('🔵 Setting image1 =', uploadedUrl);
        form.setFieldsValue({ image1: uploadedUrl });
      } else if (currentTab === 'certifications') {
        console.log('🔵 Setting imageUrl =', uploadedUrl);
        form.setFieldsValue({ imageUrl: uploadedUrl });
      } else if (currentTab === 'banners' || currentTab === 'news-banners') {
        console.log('🔵 Setting imageUrl for banner =', uploadedUrl);
        form.setFieldsValue({ imageUrl: uploadedUrl });
        // Force validation to update
        form.validateFields(['imageUrl']).catch(() => {});
      } else {
        console.log('🔵 Setting icon and imageUrl =', uploadedUrl);
        form.setFieldsValue({ icon: uploadedUrl, imageUrl: uploadedUrl });
      }
      
      console.log('🔵 Form values after upload:', form.getFieldsValue());
      message.success('Upload hình ảnh thành công!');
    } catch (error) {
      console.error('❌ Upload error:', error);
      message.error('Lỗi khi upload: ' + (error.response?.data?.error || error.message));
    } finally {
      setUploading(false);
    }
    
    return false; // Prevent default upload behavior
  };

  // Upload multiple gallery images for medical services
  const handleUploadGalleryImages = async (info) => {
    const { fileList } = info;
    
    if (!fileList || fileList.length === 0) return;
    
    setUploading(true);
    const uploadedUrls = [];
    
    try {
      const token = localStorage.getItem('token');
      
      // Upload all files
      for (const fileItem of fileList) {
        const formData = new FormData();
        formData.append('image', fileItem.originFileObj || fileItem);
        
        const response = await axios.post(`${API_BASE_URL}/images/articles`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        });
        
        const uploadedUrl = response.data.imageUrl || response.data.url;
        uploadedUrls.push(uploadedUrl);
      }
      
      // Combine with existing gallery
      const newGallery = [...galleryImages, ...uploadedUrls];
      setGalleryImages(newGallery);
      
      // Set first image as main image if gallery was empty
      if (galleryImages.length === 0 && uploadedUrls.length > 0) {
        setIconUrl(uploadedUrls[0]);
        form.setFieldsValue({ imageUrl: uploadedUrls[0] });
        message.success(`Upload thành công ${uploadedUrls.length} hình ảnh! Ảnh đầu tiên đã được đặt làm ảnh chính.`);
      } else {
        message.success(`Đã thêm ${uploadedUrls.length} hình ảnh vào gallery!`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      message.error('Lỗi khi upload: ' + (error.response?.data?.error || error.message));
    } finally {
      setUploading(false);
    }
  };

  // Remove gallery image
  const handleRemoveGalleryImage = (index) => {
    const newGallery = galleryImages.filter((_, i) => i !== index);
    setGalleryImages(newGallery);
    
    // If removed first image, update main image to next one
    if (index === 0 && newGallery.length > 0) {
      setIconUrl(newGallery[0]);
      form.setFieldsValue({ imageUrl: newGallery[0] });
      message.success('Đã xóa hình ảnh! Ảnh tiếp theo đã được đặt làm ảnh chính.');
    } else {
      message.success('Đã xóa hình ảnh!');
    }
  };

  // Calculate discounted price based on percentage
  const handleDiscountPercentageChange = (value) => {
    const originalPrice = form.getFieldValue('originalPrice');
    if (originalPrice && value) {
      const discounted = originalPrice * (1 - value / 100);
      form.setFieldsValue({ discountedPrice: Math.round(discounted) });
    }
  };

  // Calculate discount percentage based on prices
  const handlePriceChange = () => {
    const originalPrice = form.getFieldValue('originalPrice');
    const discountedPrice = form.getFieldValue('discountedPrice');
    
    if (originalPrice && discountedPrice && originalPrice > 0) {
      const percentage = ((originalPrice - discountedPrice) / originalPrice) * 100;
      form.setFieldsValue({ discountPercentage: Math.round(percentage) });
    }
  };

  // ==================== SLUG HANDLERS ====================
  
  // Use ref to store timeout ID for debouncing title change
  const titleChangeTimeoutRef = React.useRef(null);
  
  const handleTitleChange = (e) => {
    const title = e.target.value;
    console.log('handleTitleChange called, title:', title, 'currentTab:', currentTab);
    
    // Only auto-generate slug for news, doctor-articles, and medical-services tabs
    if (currentTab !== 'news' && currentTab !== 'doctor-articles' && currentTab !== 'medical-services') {
      console.log('Tab not supported for auto-slug');
      return;
    }
    
    // Clear previous timeout
    if (titleChangeTimeoutRef.current) {
      clearTimeout(titleChangeTimeoutRef.current);
    }
    
    // Debounce slug generation (300ms delay)
    if (title && title.trim()) {
      console.log('Setting timeout for slug generation...');
      titleChangeTimeoutRef.current = setTimeout(async () => {
        try {
          console.log('Generating slug for:', title);
          const response = await cmsAPI.generateSlug(title);
          const generatedSlug = response.data.slug;
          console.log('Generated slug:', generatedSlug);
          form.setFieldsValue({ slug: generatedSlug });
          
          // Check if slug exists immediately after generating
          checkSlugExists(generatedSlug);
        } catch (error) {
          console.error('Error generating slug:', error);
        }
      }, 300);
    } else {
      // Clear slug if title is empty
      form.setFieldsValue({ slug: '' });
    }
  };
  
  const checkSlugExists = async (slug, articleId = null) => {
    if (!slug || !slug.trim()) {
      setSlugExists(false);
      setSlugSuggestion('');
      return;
    }
    
    setSlugChecking(true);
    try {
      // Determine type based on current tab
      const type = currentTab === 'medical-services' ? 'medical-service' : 'news';
      const params = new URLSearchParams();
      if (articleId || editingItem?.id) {
        params.append('articleId', articleId || editingItem.id);
      }
      params.append('type', type);
      
      const response = await axios.get(
        `${API_BASE_URL}/cms/slug/check/${slug}?${params.toString()}`
      );
      
      console.log('Slug check response:', response.data);
      setSlugExists(response.data.exists);
      setSlugSuggestion(response.data.suggestion || '');
    } catch (error) {
      console.error('Error checking slug:', error);
    } finally {
      setSlugChecking(false);
    }
  };
  
  // Use ref to store timeout ID for debouncing
  const slugCheckTimeoutRef = React.useRef(null);
  
  const handleSlugChange = (e) => {
    const slug = e.target.value;
    
    // Clear previous timeout
    if (slugCheckTimeoutRef.current) {
      clearTimeout(slugCheckTimeoutRef.current);
    }
    
    // Reset states immediately
    setSlugExists(false);
    setSlugSuggestion('');
    
    // Debounce check
    if (slug && slug.trim()) {
      slugCheckTimeoutRef.current = setTimeout(() => {
        checkSlugExists(slug);
      }, 500);
    }
  };
  
  const useSuggestedSlug = () => {
    if (slugSuggestion) {
      form.setFieldsValue({ slug: slugSuggestion });
      setSlugExists(false);
      setSlugSuggestion('');
    }
  };

  const handleDelete = async (id, type) => {
    try {
      switch (type) {
        case 'homepage':
          await cmsAPI.deleteHomePageContent(id);
          break;
        case 'services':
          await cmsAPI.deleteService(id);
          break;
        case 'testimonials':
          await cmsAPI.deleteTestimonial(id);
          break;
        case 'doctor-articles':
          await cmsAPI.deleteDoctorArticle(id);
          break;
        case 'features':
          await cmsAPI.deleteFeature(id);
          break;
        case 'banners':
        case 'news-banners':
          await cmsAPI.deleteBanner(id);
          break;
        case 'specialties':
          await cmsAPI.deleteSpecialty(id);
          break;
        case 'statistics':
          await cmsAPI.deleteStatistic(id);
          break;
        case 'certifications':
          await cmsAPI.deleteCertification(id);
          break;
        case 'news-categories':
          await cmsAPI.deleteNewsCategory(id);
          break;
        case 'membership-benefits':
          await cmsAPI.deleteMembershipBenefit(id);
          break;
        case 'news-sections':
          await cmsAPI.deleteNewsSection(id);
          break;
        case 'news-sidebar-widgets':
          await cmsAPI.deleteNewsSidebarWidget(id);
          break;
        case 'service-categories':
          await cmsAPI.deleteServiceCategory(id);
          break;
        case 'medical-services':
          await cmsAPI.deleteMedicalService(id);
          break;
      }
      message.success('Xóa thành công!');
      fetchAllData();
    } catch (error) {
      message.error('Lỗi khi xóa: ' + error.message);
    }
  };

  const handleToggleStatus = async (id, currentStatus, type) => {
    try {
      const newStatus = !currentStatus;
      
      // Get current item data first
      let currentItem;
      switch (type) {
        case 'homepage':
          currentItem = homePageContent.find(item => item.id === id);
          break;
        case 'services':
          currentItem = services.find(item => item.id === id);
          break;
        case 'testimonials':
          currentItem = testimonials.find(item => item.id === id);
          break;
        case 'features':
          currentItem = features.find(item => item.id === id);
          break;
        case 'banners':
          currentItem = banners.find(item => item.id === id);
          break;
        case 'news-banners':
          currentItem = newsBanners.find(item => item.id === id);
          break;
        case 'specialties':
          currentItem = specialties.find(item => item.id === id);
          break;
        case 'statistics':
          currentItem = statistics.find(item => item.id === id);
          break;
        case 'certifications':
          currentItem = certifications.find(item => item.id === id);
          break;
        case 'news-categories':
          currentItem = newsCategories.find(item => item.id === id);
          break;
        case 'membership-benefits':
          currentItem = membershipBenefits.find(item => item.id === id);
          break;
        case 'news-sections':
          currentItem = newsSections.find(item => item.id === id);
          break;
        case 'news-sidebar-widgets':
          currentItem = newsSidebarWidgets.find(item => item.id === id);
          break;
        case 'service-categories':
          currentItem = serviceCategories.find(item => item.id === id);
          break;
        case 'medical-services':
          currentItem = medicalServices.find(item => item.id === id);
          break;
      }
      
      if (!currentItem) {
        message.error('Không tìm thấy item!');
        return;
      }
      
      // Update only isActive field, keep all other data
      const updateData = {
        ...currentItem,
        isActive: newStatus
      };
      
      // Remove datetime fields to let backend handle them
      delete updateData.createdAt;
      delete updateData.updatedAt;
      delete updateData.publishedAt;
      
      switch (type) {
        case 'homepage':
          await cmsAPI.updateHomePageContent(id, updateData);
          break;
        case 'services':
          await cmsAPI.updateService(id, updateData);
          break;
        case 'testimonials':
          await cmsAPI.updateTestimonial(id, updateData);
          break;
        case 'features':
          await cmsAPI.updateFeature(id, updateData);
          break;
        case 'banners':
        case 'news-banners':
          await cmsAPI.updateBanner(id, updateData);
          break;
        case 'specialties':
          await cmsAPI.updateSpecialty(id, updateData);
          break;
        case 'statistics':
          await cmsAPI.updateStatistic(id, updateData);
          break;
        case 'certifications':
          await cmsAPI.updateCertification(id, updateData);
          break;
        case 'news-categories':
          await cmsAPI.updateNewsCategory(id, updateData);
          break;
        case 'membership-benefits':
          await cmsAPI.updateMembershipBenefit(id, updateData);
          break;
        case 'news-sections':
          await cmsAPI.updateNewsSection(id, updateData);
          break;
        case 'news-sidebar-widgets':
          await cmsAPI.updateNewsSidebarWidget(id, updateData);
          break;
        case 'service-categories':
          await cmsAPI.updateServiceCategory(id, updateData);
          break;
        case 'medical-services':
          await cmsAPI.updateMedicalService(id, updateData);
          break;
      }
      
      message.success(newStatus ? 'Đã kích hoạt!' : 'Đã tắt!');
      fetchAllData();
    } catch (error) {
      message.error('Lỗi khi cập nhật trạng thái: ' + error.message);
    }
  };
  
  const handleApprove = async (id) => {
    try {
      await cmsAPI.approveArticle(id);
      message.success('Duyệt bài viết thành công!');
      fetchAllData();
    } catch (error) {
      message.error('Lỗi khi duyệt: ' + error.message);
    }
  };
  
  const handleReject = async (id) => {
    try {
      await cmsAPI.rejectArticle(id);
      message.success('Từ chối bài viết thành công!');
      fetchAllData();
    } catch (error) {
      message.error('Lỗi khi từ chối: ' + error.message);
    }
  };

  const handleSubmit = async (values) => {
    try {
      console.log('🟢 === FORM SUBMIT START ===');
      console.log('🟢 Form values received:', values);
      console.log('🟢 iconUrl state:', iconUrl);
      console.log('🟢 Current tab:', currentTab);
      
      // Validate imageUrl for banners
      if ((currentTab === 'banners' || currentTab === 'news-banners') && !values.imageUrl) {
        console.error('❌ imageUrl is missing!');
        message.error('Vui lòng upload hình ảnh banner!');
        return;
      }
      
      const data = { ...values };
      
      // Upload image for doctor-articles if new image selected
      if (currentTab === 'doctor-articles' && uploadedImage) {
        const formData = new FormData();
        formData.append('image', uploadedImage);
        
        const token = localStorage.getItem('token');
        const uploadResponse = await axios.post(`${API_BASE_URL}/images/articles`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        });
        
        data.imageUrl = uploadResponse.data.imageUrl || uploadResponse.data.url;
      } else if (currentTab === 'doctor-articles' && imagePreview) {
        // Keep existing image if no new upload
        data.imageUrl = imagePreview;
      }
      
      // Debug log for banners
      if (currentTab === 'banners' || currentTab === 'news-banners') {
        console.log('🟢 === BANNER SUBMIT DEBUG ===');
        console.log('🟢 Current tab:', currentTab);
        console.log('🟢 Editing item:', editingItem);
        console.log('🟢 Form values:', values);
        console.log('🟢 Data to save:', data);
        console.log('🟢 iconUrl state:', iconUrl);
      }
      
      // Debug log for certifications
      if (currentTab === 'certifications') {
        console.log('Certification data before save:', JSON.stringify(data, null, 2));
        console.log('iconUrl state:', iconUrl);
      }
      
      // Loại bỏ các trường datetime để backend tự động tạo
      delete data.createdAt;
      delete data.updatedAt;
      delete data.publishedAt;
      
      // Convert categoryFilter array to JSON string for news-sections
      if (currentTab === 'news-sections' && data.categoryFilter) {
        if (Array.isArray(data.categoryFilter)) {
          data.categoryFilter = JSON.stringify(data.categoryFilter);
        }
      }
      
      // Debug log for news-sections
      if (currentTab === 'news-sections') {
        console.log('=== NEWS SECTION DATA BEFORE SAVE ===');
        console.log('layoutType:', data.layoutType);
        console.log('Full data:', JSON.stringify(data, null, 2));
      }
      
      // Process benefits list for membership-benefits
      if (currentTab === 'membership-benefits') {
        benefitsList.forEach((benefit, index) => {
          data[`benefit${index + 1}`] = benefit || '';
        });
        // Clear unused benefit fields
        for (let i = benefitsList.length + 1; i <= 5; i++) {
          data[`benefit${i}`] = '';
        }
        // Debug: Log data before sending
        console.log('Membership benefits data before save:', JSON.stringify(data, null, 2));
      }
      
      // Process gallery images for medical-services
      if (currentTab === 'medical-services') {
        data.images = JSON.stringify(galleryImages);
        console.log('Medical service data before save:', JSON.stringify(data, null, 2));
      }
      
      if (editingItem) {
        // Update
        switch (currentTab) {
          case 'homepage':
            await cmsAPI.updateHomePageContent(editingItem.id, data);
            break;
          case 'services':
            await cmsAPI.updateService(editingItem.id, data);
            break;
          case 'testimonials':
            await cmsAPI.updateTestimonial(editingItem.id, data);
            break;
          case 'doctor-articles':
            // Admin update doctor article - keep status unchanged
            await cmsAPI.updateNewsArticle(editingItem.id, data);
            break;
          case 'features':
            await cmsAPI.updateFeature(editingItem.id, data);
            break;
          case 'banners':
          case 'news-banners':
            console.log('🟢 Updating banner ID:', editingItem.id, 'with data:', JSON.stringify(data, null, 2));
            await cmsAPI.updateBanner(editingItem.id, data);
            console.log('🟢 Banner updated successfully!');
            break;
          case 'specialties':
            await cmsAPI.updateSpecialty(editingItem.id, data);
            break;
          case 'statistics':
            await cmsAPI.updateStatistic(editingItem.id, data);
            break;
          case 'certifications':
            await cmsAPI.updateCertification(editingItem.id, data);
            break;
          case 'news-categories':
            await cmsAPI.updateNewsCategory(editingItem.id, data);
            break;
          case 'membership-benefits':
            await cmsAPI.updateMembershipBenefit(editingItem.id, data);
            break;
          case 'news-sections':
            await cmsAPI.updateNewsSection(editingItem.id, data);
            break;
          case 'news-sidebar-widgets':
            await cmsAPI.updateNewsSidebarWidget(editingItem.id, data);
            break;
          case 'article-cta':
            await cmsAPI.updateArticleCtaSection(editingItem.id, data);
            // Reload data
            const ctaResponse = await cmsAPI.getArticleCtaSection();
            setArticleCtaSection(ctaResponse.data);
            break;
          case 'service-categories':
            await cmsAPI.updateServiceCategory(editingItem.id, data);
            break;
          case 'medical-services':
            await cmsAPI.updateMedicalService(editingItem.id, data);
            break;
        }
        message.success('Cập nhật thành công!');
      } else {
        // Create
        switch (currentTab) {
          case 'homepage':
            await cmsAPI.createHomePageContent(data);
            break;
          case 'services':
            await cmsAPI.createService(data);
            break;
          case 'testimonials':
            await cmsAPI.createTestimonial(data);
            break;
          case 'features':
            await cmsAPI.createFeature(data);
            break;
          case 'banners':
            // Set page to 'home' for home banners
            data.page = 'home';
            console.log('🟢 Creating HOME banner with data:', JSON.stringify(data, null, 2));
            await cmsAPI.createBanner(data);
            console.log('🟢 Banner created successfully!');
            break;
          case 'news-banners':
            // Set page to 'news' for news banners
            data.page = 'news';
            console.log('🟢 Creating NEWS banner with data:', JSON.stringify(data, null, 2));
            await cmsAPI.createBanner(data);
            console.log('🟢 Banner created successfully!');
            break;
          case 'specialties':
            await cmsAPI.createSpecialty(data);
            break;
          case 'statistics':
            await cmsAPI.createStatistic(data);
            break;
          case 'certifications':
            await cmsAPI.createCertification(data);
            break;
          case 'news-categories':
            await cmsAPI.createNewsCategory(data);
            break;
          case 'membership-benefits':
            await cmsAPI.createMembershipBenefit(data);
            break;
          case 'news-sections':
            await cmsAPI.createNewsSection(data);
            break;
          case 'news-sidebar-widgets':
            await cmsAPI.createNewsSidebarWidget(data);
            break;
          case 'service-categories':
            await cmsAPI.createServiceCategory(data);
            break;
          case 'medical-services':
            await cmsAPI.createMedicalService(data);
            break;
        }
        message.success('Tạo mới thành công!');
      }
      
      setModalVisible(false);
      fetchAllData();
    } catch (error) {
      message.error('Lỗi khi lưu: ' + error.message);
    }
  };

  // Column definitions
  const homePageColumns = [
    { title: 'Section Key', dataIndex: 'sectionKey', key: 'sectionKey' },
    { title: 'Tiêu đề', dataIndex: 'title', key: 'title' },
    { title: 'Phụ đề', dataIndex: 'subtitle', key: 'subtitle' },
    { 
      title: 'Trạng thái', 
      dataIndex: 'isActive', 
      key: 'isActive',
      render: (isActive, record) => (
        <Switch 
          checked={isActive} 
          onChange={() => handleToggleStatus(record.id, isActive, 'homepage')}
        />
      )
    },
    { title: 'Thứ tự', dataIndex: 'displayOrder', key: 'displayOrder' },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => handleDelete(record.id, 'homepage')}
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const servicesColumns = [
    { title: 'Tiêu đề', dataIndex: 'title', key: 'title' },
    { title: 'Mô tả', dataIndex: 'description', key: 'description', ellipsis: true },
    { title: 'Màu sắc', dataIndex: 'color', key: 'color' },
    { 
      title: 'Trạng thái', 
      dataIndex: 'isActive', 
      key: 'isActive',
      render: (isActive, record) => (
        <Switch 
          checked={isActive} 
          onChange={() => handleToggleStatus(record.id, isActive, 'services')}
        />
      )
    },
    { title: 'Thứ tự', dataIndex: 'displayOrder', key: 'displayOrder' },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => handleDelete(record.id, 'services')}
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const newsColumns = [
    { title: 'Tiêu đề', dataIndex: 'title', key: 'title', ellipsis: true },
    { title: 'Danh mục', dataIndex: 'category', key: 'category', width: '15%' },
    { title: 'Tác giả', dataIndex: 'author', key: 'author' },
    { title: 'Slug', dataIndex: 'slug', key: 'slug' },
    { 
      title: 'Nổi bật', 
      dataIndex: 'isFeatured', 
      key: 'isFeatured',
      render: (isFeatured) => <Switch checked={isFeatured} disabled />
    },
    { 
      title: 'Trạng thái', 
      dataIndex: 'isActive', 
      key: 'isActive',
      render: (isActive, record) => (
        <Switch 
          checked={isActive} 
          onChange={() => handleToggleStatus(record.id, isActive, 'news')}
        />
      )
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => handleDelete(record.id, 'news')}
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const testimonialsColumns = [
    { title: 'Tên khách hàng', dataIndex: 'customerName', key: 'customerName' },
    { title: 'Chức danh', dataIndex: 'customerTitle', key: 'customerTitle' },
    { title: 'Đánh giá', dataIndex: 'rating', key: 'rating' },
    { 
      title: 'Nổi bật', 
      dataIndex: 'isFeatured', 
      key: 'isFeatured',
      render: (isFeatured) => <Switch checked={isFeatured} disabled />
    },
    { 
      title: 'Trạng thái', 
      dataIndex: 'isActive', 
      key: 'isActive',
      render: (isActive, record) => (
        <Switch 
          checked={isActive} 
          onChange={() => handleToggleStatus(record.id, isActive, 'testimonials')}
        />
      )
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => handleDelete(record.id, 'testimonials')}
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const doctorArticlesColumns = [
    { 
      title: 'Tiêu đề', 
      dataIndex: 'title', 
      key: 'title', 
      ellipsis: true,
      width: '20%'
    },
    { 
      title: 'Danh mục', 
      dataIndex: 'category', 
      key: 'category',
      width: '12%',
      render: (category) => category ? (
        <Tag color="blue">{category}</Tag>
      ) : <Tag color="default">Chưa có</Tag>
    },
    { 
      title: 'Tác giả', 
      dataIndex: 'author', 
      key: 'author',
      width: '12%'
    },
    { 
      title: 'Bác sĩ', 
      key: 'doctor',
      render: (_, record) => record.doctor ? `Dr. ${record.doctor.user?.firstName} ${record.doctor.user?.lastName}` : 'N/A',
      width: '12%'
    },
    { 
      title: 'Trạng thái duyệt', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => {
        const statusMap = {
          'PENDING': { color: 'orange', text: 'Chờ duyệt' },
          'APPROVED': { color: 'green', text: 'Đã duyệt' },
          'REJECTED': { color: 'red', text: 'Từ chối' }
        };
        const s = statusMap[status] || { color: 'default', text: status };
        return <Tag color={s.color}>{s.text}</Tag>;
      },
      width: '10%'
    },
    { 
      title: 'Nổi bật', 
      dataIndex: 'isFeatured', 
      key: 'isFeatured',
      render: (isFeatured) => <Switch checked={isFeatured} disabled />,
      width: '8%'
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: '26%',
      render: (_, record) => (
        <Space>
          <Button 
            icon={<EyeOutlined />} 
            onClick={() => {
              setSelectedArticle(record);
              setArticleDetailVisible(true);
            }}
            size="small"
          >
            Xem
          </Button>
          {record.status === 'PENDING' && (
            <>
              <Button 
                icon={<CheckOutlined />} 
                onClick={() => handleApprove(record.id)}
                type="primary"
                size="small"
              >
                Duyệt
              </Button>
              <Button 
                icon={<CloseOutlined />} 
                onClick={() => handleReject(record.id)}
                danger
                size="small"
              >
                Từ chối
              </Button>
            </>
          )}
          <Button 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
            size="small"
          />
          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => handleDelete(record.id, 'doctor-articles')}
          >
            <Button icon={<DeleteOutlined />} danger size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const featuresColumns = [
    { title: 'Tiêu đề', dataIndex: 'title', key: 'title' },
    { title: 'Mô tả', dataIndex: 'description', key: 'description', ellipsis: true },
    { 
      title: 'Icon', 
      dataIndex: 'icon', 
      key: 'icon', 
      render: (icon) => icon ? (
        <img src={icon} alt="icon" style={{ width: 32, height: 32, objectFit: 'contain' }} />
      ) : null
    },
    { 
      title: 'Màu sắc', 
      dataIndex: 'color', 
      key: 'color',
      render: (color) => (
        <div style={{ 
          width: 40, 
          height: 20, 
          background: color, 
          borderRadius: 4,
          border: '1px solid #d9d9d9'
        }} />
      )
    },
    { 
      title: 'Trạng thái', 
      dataIndex: 'isActive', 
      key: 'isActive',
      render: (isActive, record) => (
        <Switch 
          checked={isActive} 
          onChange={() => handleToggleStatus(record.id, isActive, 'features')}
        />
      )
    },
    { title: 'Thứ tự', dataIndex: 'displayOrder', key: 'displayOrder' },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => handleDelete(record.id, 'features')}
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const bannerColumns = [
    { 
      title: 'Hình ảnh Banner', 
      dataIndex: 'imageUrl', 
      key: 'imageUrl',
      width: '50%',
      render: (url) => url ? (
        <img 
          src={url} 
          alt="banner" 
          style={{ 
            width: '100%',
            maxWidth: 400,
            height: 100, 
            objectFit: 'cover', 
            borderRadius: 4,
            border: '1px solid #d9d9d9'
          }} 
        />
      ) : 'Không có'
    },
    { 
      title: 'Trang', 
      dataIndex: 'page', 
      key: 'page',
      width: '12%',
      render: (page) => {
        const pageMap = {
          'home': { text: 'Trang chủ', color: 'blue' },
          'news': { text: 'Tin tức', color: 'green' },
          'doctors': { text: 'Bác sĩ', color: 'purple' }
        };
        const p = pageMap[page] || { text: page, color: 'default' };
        return <Tag color={p.color}>{p.text}</Tag>;
      }
    },
    { 
      title: 'Trạng thái', 
      dataIndex: 'isActive', 
      key: 'isActive',
      width: '10%',
      render: (isActive, record) => (
        <Switch 
          checked={isActive} 
          onChange={() => handleToggleStatus(record.id, isActive, 'banners')}
        />
      )
    },
    { 
      title: 'Thứ tự', 
      dataIndex: 'displayOrder', 
      key: 'displayOrder',
      width: '8%'
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: '20%',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => handleDelete(record.id, 'banners')}
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // News Banner Columns (without page column)
  const newsBannerColumns = [
    { 
      title: 'Hình ảnh Banner', 
      dataIndex: 'imageUrl', 
      key: 'imageUrl',
      width: '55%',
      render: (url) => url ? (
        <img 
          src={url} 
          alt="banner" 
          style={{ 
            width: '100%',
            maxWidth: 400,
            height: 100, 
            objectFit: 'cover', 
            borderRadius: 4,
            border: '1px solid #d9d9d9'
          }} 
        />
      ) : 'Không có'
    },
    { 
      title: 'Trạng thái', 
      dataIndex: 'isActive', 
      key: 'isActive',
      width: '12%',
      render: (isActive, record) => (
        <Switch 
          checked={isActive} 
          onChange={() => handleToggleStatus(record.id, isActive, 'news-banners')}
        />
      )
    },
    { 
      title: 'Thứ tự', 
      dataIndex: 'displayOrder', 
      key: 'displayOrder',
      width: '10%'
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: '23%',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => handleDelete(record.id, 'news-banners')}
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const specialtiesColumns = [
    { title: 'Tên chuyên khoa', dataIndex: 'name', key: 'name' },
    { 
      title: 'Icon', 
      dataIndex: 'icon', 
      key: 'icon', 
      render: (icon) => icon ? (
        <img src={icon} alt="icon" style={{ width: 32, height: 32, objectFit: 'contain' }} />
      ) : null
    },
    { title: 'URL', dataIndex: 'url', key: 'url', ellipsis: true },
    { 
      title: 'Nổi bật', 
      dataIndex: 'isFeatured', 
      key: 'isFeatured',
      render: (isFeatured) => <Switch checked={isFeatured} disabled />
    },
    { 
      title: 'Trạng thái', 
      dataIndex: 'isActive', 
      key: 'isActive',
      render: (isActive, record) => (
        <Switch 
          checked={isActive} 
          onChange={() => handleToggleStatus(record.id, isActive, 'specialties')}
        />
      )
    },
    { title: 'Thứ tự', dataIndex: 'displayOrder', key: 'displayOrder' },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => handleDelete(record.id, 'specialties')}
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const statisticsColumns = [
    { title: 'Nhãn', dataIndex: 'label', key: 'label' },
    { title: 'Giá trị', dataIndex: 'value', key: 'value' },
    { 
      title: 'Màu thẻ', 
      dataIndex: 'color', 
      key: 'color', 
      render: (color) => (
        <div style={{ 
          width: 60, 
          height: 30, 
          background: color, 
          borderRadius: 4, 
          border: '1px solid #d9d9d9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: 11,
          fontWeight: 600
        }}>
          {color}
        </div>
      )
    },
    { 
      title: 'Trạng thái', 
      dataIndex: 'isActive', 
      key: 'isActive',
      render: (isActive, record) => (
        <Switch 
          checked={isActive} 
          onChange={() => handleToggleStatus(record.id, isActive, 'statistics')}
        />
      )
    },
    { title: 'Thứ tự', dataIndex: 'displayOrder', key: 'displayOrder' },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => handleDelete(record.id, 'statistics')}
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const certificationsColumns = [
    { 
      title: 'Ảnh', 
      dataIndex: 'imageUrl', 
      key: 'imageUrl',
      width: 120,
      render: (imageUrl, record) => (
        imageUrl ? (
          <img 
            src={imageUrl} 
            alt={record.name} 
            style={{ 
              width: 100, 
              height: 60, 
              objectFit: 'cover', 
              borderRadius: 4,
              border: '1px solid #d9d9d9'
            }} 
          />
        ) : record.icon ? (
          <img src={record.icon} alt="icon" style={{ width: 32, height: 32, objectFit: 'contain' }} />
        ) : (
          <div style={{ fontSize: 24 }}>📜</div>
        )
      )
    },
    { title: 'Tên chứng chỉ', dataIndex: 'name', key: 'name' },
    { title: 'Mô tả', dataIndex: 'description', key: 'description', ellipsis: true },
    { title: 'Màu sắc', dataIndex: 'color', key: 'color', render: (color) => <div style={{ width: 40, height: 20, background: color, borderRadius: 4, border: '1px solid #d9d9d9' }} /> },
    { 
      title: 'Trạng thái', 
      dataIndex: 'isActive', 
      key: 'isActive',
      render: (isActive, record) => (
        <Switch 
          checked={isActive} 
          onChange={() => handleToggleStatus(record.id, isActive, 'certifications')}
        />
      )
    },
    { title: 'Thứ tự', dataIndex: 'displayOrder', key: 'displayOrder' },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => handleDelete(record.id, 'certifications')}
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const newsCategoriesColumns = [
    { title: 'Tên danh mục', dataIndex: 'name', key: 'name' },
    { title: 'Slug', dataIndex: 'slug', key: 'slug' },
    { title: 'Mô tả', dataIndex: 'description', key: 'description', ellipsis: true },
    { 
      title: 'Màu sắc', 
      dataIndex: 'color', 
      key: 'color',
      render: (color) => (
        <div style={{ 
          width: 40, 
          height: 20, 
          background: color, 
          borderRadius: 4,
          border: '1px solid #d9d9d9'
        }} />
      )
    },
    { 
      title: 'Trạng thái', 
      dataIndex: 'isActive', 
      key: 'isActive',
      render: (isActive, record) => (
        <Switch 
          checked={isActive} 
          onChange={() => handleToggleStatus(record.id, isActive, 'news-categories')}
        />
      )
    },
    { title: 'Thứ tự', dataIndex: 'displayOrder', key: 'displayOrder' },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => handleDelete(record.id, 'news-categories')}
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const membershipBenefitsColumns = [
    { title: 'Tiêu đề', dataIndex: 'title', key: 'title', width: '20%' },
    { 
      title: 'Ưu đãi', 
      key: 'benefits',
      width: '30%',
      render: (_, record) => (
        <div style={{ fontSize: 12 }}>
          {[record.benefit1, record.benefit2, record.benefit3].filter(Boolean).map((b, i) => (
            <div key={i}>• {b}</div>
          ))}
        </div>
      )
    },
    { 
      title: 'Hình ảnh', 
      key: 'images',
      width: '15%',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 4 }}>
          {record.image1 && <img src={record.image1} alt="img1" style={{ width: 30, height: 30, objectFit: 'cover', borderRadius: 4 }} />}
          {record.image2 && <img src={record.image2} alt="img2" style={{ width: 30, height: 30, objectFit: 'cover', borderRadius: 4 }} />}
          {record.image3 && <img src={record.image3} alt="img3" style={{ width: 30, height: 30, objectFit: 'cover', borderRadius: 4 }} />}
        </div>
      )
    },
    { 
      title: 'Trạng thái', 
      dataIndex: 'isActive', 
      key: 'isActive',
      width: '10%',
      render: (isActive, record) => (
        <Switch 
          checked={isActive} 
          onChange={() => handleToggleStatus(record.id, isActive, 'membership-benefits')}
        />
      )
    },
    { title: 'Thứ tự', dataIndex: 'displayOrder', key: 'displayOrder', width: '8%' },
    {
      title: 'Hành động',
      key: 'actions',
      width: '17%',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => handleDelete(record.id, 'membership-benefits')}
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const serviceCategoryColumns = [
    { title: 'Tên danh mục', dataIndex: 'name', key: 'name' },
    { title: 'Slug', dataIndex: 'slug', key: 'slug' },
    { title: 'Mô tả', dataIndex: 'description', key: 'description', ellipsis: true },
    { title: 'Thứ tự', dataIndex: 'displayOrder', key: 'displayOrder' },
    { 
      title: 'Trạng thái', 
      dataIndex: 'isActive', 
      key: 'isActive',
      render: (isActive, record) => (
        <Switch 
          checked={isActive} 
          onChange={() => handleToggleStatus(record.id, isActive, 'service-categories')}
        />
      )
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => handleDelete(record.id, 'service-categories')}
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const medicalServiceColumns = [
    { title: 'Tiêu đề', dataIndex: 'title', key: 'title', ellipsis: true },
    { 
      title: 'Danh mục', 
      dataIndex: 'categoryId', 
      key: 'categoryId',
      render: (categoryId) => {
        const category = serviceCategories.find(c => c.id === categoryId);
        return category ? category.name : '-';
      }
    },
    { 
      title: 'Giá gốc', 
      dataIndex: 'originalPrice', 
      key: 'originalPrice',
      render: (price) => price ? `${price.toLocaleString()}đ` : '-'
    },
    { 
      title: 'Giá KM', 
      dataIndex: 'discountedPrice', 
      key: 'discountedPrice',
      render: (price) => price ? `${price.toLocaleString()}đ` : '-'
    },
    { 
      title: 'Giảm giá', 
      dataIndex: 'discountPercentage', 
      key: 'discountPercentage',
      render: (percent) => percent ? `-${percent}%` : '-'
    },
    { 
      title: 'Nổi bật', 
      dataIndex: 'isFeatured', 
      key: 'isFeatured',
      render: (isFeatured) => isFeatured ? <Tag color="gold">Nổi bật</Tag> : null
    },
    { 
      title: 'Trạng thái', 
      dataIndex: 'isActive', 
      key: 'isActive',
      render: (isActive, record) => (
        <Switch 
          checked={isActive} 
          onChange={() => handleToggleStatus(record.id, isActive, 'medical-services')}
        />
      )
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => handleDelete(record.id, 'medical-services')}
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const renderForm = () => {
    switch (currentTab) {
      case 'homepage':
        return (
          <>
            <Form.Item name="sectionKey" label="Section Key" rules={[{ required: true }]}>
              <Input placeholder="hero, statistics, etc." />
            </Form.Item>
            <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="subtitle" label="Phụ đề">
              <Input />
            </Form.Item>
            <Form.Item name="content" label="Nội dung">
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item name="imageUrl" label="URL Hình ảnh">
              <Input />
            </Form.Item>
            <Form.Item name="buttonText" label="Text Button">
              <Input />
            </Form.Item>
            <Form.Item name="buttonUrl" label="URL Button">
              <Input />
            </Form.Item>
            <Form.Item name="extraData" label="Dữ liệu thêm (JSON)">
              <TextArea rows={3} />
            </Form.Item>
            <Form.Item name="displayOrder" label="Thứ tự hiển thị">
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item name="isActive" label="Kích hoạt" valuePropName="checked">
              <Switch />
            </Form.Item>
          </>
        );
      case 'services':
        return (
          <>
            <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="description" label="Mô tả">
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item name="imageUrl" label="Icon (Hình ảnh)">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Upload
                  beforeUpload={handleUploadIcon}
                  showUploadList={false}
                  accept="image/*"
                >
                  <Button icon={<UploadOutlined />} loading={uploading}>
                    Upload Icon
                  </Button>
                </Upload>
                {iconUrl && (
                  <div style={{ marginTop: 8 }}>
                    <img 
                      src={iconUrl} 
                      alt="icon preview" 
                      style={{ 
                        width: 80,
                        height: 80,
                        objectFit: 'contain',
                        border: '1px solid #d9d9d9',
                        borderRadius: 4,
                        padding: 4
                      }} 
                    />
                  </div>
                )}
              </Space>
            </Form.Item>
            <Form.Item name="color" label="Màu sắc" rules={[{ required: true }]}>
              <Space.Compact style={{ width: '100%' }}>
                <Input 
                  type="color" 
                  value={currentColor}
                  style={{ width: 80, height: 40 }} 
                  onChange={(e) => {
                    const newColor = e.target.value;
                    setCurrentColor(newColor);
                    form.setFieldsValue({ color: newColor });
                  }}
                />
                <Input 
                  placeholder="#10b981" 
                  value={currentColor}
                  style={{ flex: 1 }}
                  onChange={(e) => {
                    const newColor = e.target.value;
                    setCurrentColor(newColor);
                    form.setFieldsValue({ color: newColor });
                  }}
                />
              </Space.Compact>
            </Form.Item>
            <Form.Item name="buttonText" label="Text Button">
              <Input />
            </Form.Item>
            <Form.Item name="buttonUrl" label="URL Button">
              <Input />
            </Form.Item>
            <Form.Item name="displayOrder" label="Thứ tự hiển thị">
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item name="isActive" label="Kích hoạt" valuePropName="checked">
              <Switch />
            </Form.Item>
          </>
        );
      case 'doctor-articles':
        return (
          <>
            <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}>
              <Input onChange={handleTitleChange} placeholder="Nhập tiêu đề bài viết" />
            </Form.Item>
            <Form.Item name="excerpt" label="Tóm tắt">
              <TextArea rows={3} />
            </Form.Item>
            <Form.Item name="category" label="Danh mục" rules={[{ required: true }]}>
              <Select placeholder="Chọn danh mục">
                {newsCategories.filter(cat => cat.isActive).map(category => (
                  <Option key={category.id} value={category.name}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="content" label="Nội dung">
              <TextArea rows={6} />
            </Form.Item>
            <Form.Item label="Hình ảnh đại diện">
              <Upload
                listType="picture-card"
                showUploadList={false}
                beforeUpload={(file) => {
                  const isImage = file.type.startsWith('image/');
                  if (!isImage) {
                    message.error('Chỉ chấp nhận file ảnh!');
                    return false;
                  }
                  const isLt5M = file.size / 1024 / 1024 < 5;
                  if (!isLt5M) {
                    message.error('Kích thước ảnh phải nhỏ hơn 5MB!');
                    return false;
                  }
                  setUploadedImage(file);
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    setImagePreview(e.target.result);
                  };
                  reader.readAsDataURL(file);
                  return false;
                }}
                accept="image/*"
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
            <Form.Item 
              name="slug" 
              label="Slug (URL thân thiện)"
              rules={[{ required: true, message: 'Vui lòng nhập slug' }]}
              validateStatus={slugExists ? 'error' : slugChecking ? 'validating' : ''}
              help={
                slugExists ? (
                  <span style={{ color: '#ff4d4f' }}>
                    ⚠️ Slug này đã tồn tại! 
                    {slugSuggestion && (
                      <span>
                        {' '}Đề xuất: <a onClick={useSuggestedSlug} style={{ cursor: 'pointer' }}>{slugSuggestion}</a>
                      </span>
                    )}
                  </span>
                ) : slugChecking ? 'Đang kiểm tra...' : 'Slug sẽ tự động tạo từ tiêu đề'
              }
            >
              <Input 
                onChange={handleSlugChange} 
                placeholder="slug-tu-dong-tao-tu-tieu-de"
                disabled={slugChecking}
              />
            </Form.Item>
            <Form.Item name="author" label="Tác giả" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="status" label="Trạng thái duyệt" rules={[{ required: true }]}>
              <Select>
                <Option value="PENDING">Chờ duyệt</Option>
                <Option value="APPROVED">Đã duyệt</Option>
                <Option value="REJECTED">Từ chối</Option>
              </Select>
            </Form.Item>
            <Form.Item name="displayOrder" label="Thứ tự hiển thị">
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item name="isFeatured" label="Nổi bật" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item name="isActive" label="Kích hoạt" valuePropName="checked">
              <Switch />
            </Form.Item>
          </>
        );
      case 'testimonials':
        return (
          <>
            <Form.Item name="customerName" label="Tên khách hàng" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="customerTitle" label="Chức danh" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="customerImage" label="URL Ảnh khách hàng">
              <Input />
            </Form.Item>
            <Form.Item name="testimonialText" label="Nội dung đánh giá" rules={[{ required: true }]}>
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item name="rating" label="Đánh giá (1-5 sao)" rules={[{ required: true }]}>
              <InputNumber min={1} max={5} />
            </Form.Item>
            <Form.Item name="displayOrder" label="Thứ tự hiển thị">
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item name="isFeatured" label="Nổi bật" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item name="isActive" label="Kích hoạt" valuePropName="checked">
              <Switch />
            </Form.Item>
          </>
        );
      case 'features':
        return (
          <>
            <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="description" label="Mô tả" rules={[{ required: true }]}>
              <TextArea rows={3} />
            </Form.Item>
            <Form.Item name="icon" label="Icon (Hình ảnh)" rules={[{ required: true }]}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Upload
                  beforeUpload={handleUploadIcon}
                  showUploadList={false}
                  accept="image/*"
                >
                  <Button icon={<UploadOutlined />} loading={uploading}>
                    Upload Icon
                  </Button>
                </Upload>
                {iconUrl && (
                  <div style={{ marginTop: 8 }}>
                    <img src={iconUrl} alt="icon" style={{ width: 60, height: 60, objectFit: 'contain' }} />
                  </div>
                )}
              </Space>
            </Form.Item>
            <Form.Item name="color" label="Màu sắc" rules={[{ required: true }]}>
              <Space.Compact style={{ width: '100%' }}>
                <Input 
                  type="color" 
                  value={currentColor}
                  style={{ width: 80, height: 40 }} 
                  onChange={(e) => {
                    const newColor = e.target.value;
                    setCurrentColor(newColor);
                    form.setFieldsValue({ color: newColor });
                  }}
                />
                <Input 
                  placeholder="#10b981" 
                  value={currentColor}
                  style={{ flex: 1 }}
                  onChange={(e) => {
                    const newColor = e.target.value;
                    setCurrentColor(newColor);
                    form.setFieldsValue({ color: newColor });
                  }}
                />
              </Space.Compact>
            </Form.Item>
            <Form.Item name="displayOrder" label="Thứ tự hiển thị">
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item name="isActive" label="Kích hoạt" valuePropName="checked">
              <Switch />
            </Form.Item>
          </>
        );
      case 'banners':
        return (
          <>
            <Form.Item label="Hình ảnh Banner" required>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Upload
                  beforeUpload={handleUploadIcon}
                  showUploadList={false}
                  accept="image/*"
                >
                  <Button icon={<UploadOutlined />} loading={uploading}>
                    Upload Banner
                  </Button>
                </Upload>
                {iconUrl && (
                  <div style={{ marginTop: 8 }}>
                    <img 
                      src={iconUrl} 
                      alt="banner preview" 
                      style={{ 
                        width: '100%', 
                        maxWidth: 600,
                        height: 'auto',
                        objectFit: 'contain',
                        border: '1px solid #d9d9d9',
                        borderRadius: 4
                      }} 
                    />
                  </div>
                )}
              </Space>
            </Form.Item>
            {/* Hidden field to store Cloudinary URL */}
            <Form.Item name="imageUrl" hidden rules={[{ required: true, message: 'Vui lòng upload hình ảnh!' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="page" label="Trang hiển thị" rules={[{ required: true }]}>
              <Select placeholder="Chọn trang">
                <Option value="home">Trang chủ</Option>
                <Option value="news">Trang tin tức</Option>
                <Option value="doctors">Trang bác sĩ</Option>
              </Select>
            </Form.Item>
            <Form.Item name="displayOrder" label="Thứ tự hiển thị" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="isActive" label="Kích hoạt" valuePropName="checked">
              <Switch />
            </Form.Item>
          </>
        );
      case 'news-banners':
        return (
          <>
            <Form.Item label="Hình ảnh Banner" required>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Upload
                  beforeUpload={handleUploadIcon}
                  showUploadList={false}
                  accept="image/*"
                >
                  <Button icon={<UploadOutlined />} loading={uploading}>
                    Upload Banner
                  </Button>
                </Upload>
                {iconUrl && (
                  <div style={{ marginTop: 8 }}>
                    <img 
                      src={iconUrl} 
                      alt="banner preview" 
                      style={{ 
                        width: '100%', 
                        maxWidth: 600,
                        height: 'auto',
                        objectFit: 'contain',
                        border: '1px solid #d9d9d9',
                        borderRadius: 4
                      }} 
                    />
                  </div>
                )}
              </Space>
            </Form.Item>
            {/* Hidden field to store Cloudinary URL */}
            <Form.Item name="imageUrl" hidden rules={[{ required: true, message: 'Vui lòng upload hình ảnh!' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="displayOrder" label="Thứ tự hiển thị" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="isActive" label="Kích hoạt" valuePropName="checked">
              <Switch />
            </Form.Item>
          </>
        );
      case 'specialties':
        return (
          <>
            <Form.Item name="name" label="Tên chuyên khoa" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="icon" label="Icon (Hình ảnh)" rules={[{ required: true }]}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Upload
                  beforeUpload={handleUploadIcon}
                  showUploadList={false}
                  accept="image/*"
                >
                  <Button icon={<UploadOutlined />} loading={uploading}>
                    Upload Icon
                  </Button>
                </Upload>
                {iconUrl && (
                  <div style={{ marginTop: 8 }}>
                    <img src={iconUrl} alt="icon" style={{ width: 60, height: 60, objectFit: 'contain' }} />
                  </div>
                )}
              </Space>
            </Form.Item>
            <Form.Item name="url" label="Đường dẫn URL" rules={[{ required: true }]}>
              <Input placeholder="/doctors hoặc https://example.com" />
            </Form.Item>
            <Form.Item name="displayOrder" label="Thứ tự hiển thị">
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item name="isFeatured" label="Nổi bật (HOT)" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item name="isActive" label="Kích hoạt" valuePropName="checked">
              <Switch />
            </Form.Item>
          </>
        );
      case 'statistics':
        return (
          <>
            <Form.Item name="label" label="Nhãn" rules={[{ required: true }]}>
              <Input placeholder="Khách hàng mỗi năm" />
            </Form.Item>
            <Form.Item name="value" label="Giá trị" rules={[{ required: true }]}>
              <Input placeholder="4,000,000+" />
            </Form.Item>
            <Form.Item name="color" label="Màu sắc thẻ" rules={[{ required: true }]}>
              <Space.Compact style={{ width: '100%' }}>
                <Input 
                  type="color" 
                  value={currentColor}
                  style={{ width: 80, height: 40 }} 
                  onChange={(e) => {
                    const newColor = e.target.value;
                    setCurrentColor(newColor);
                    form.setFieldsValue({ color: newColor });
                  }}
                />
                <Input 
                  placeholder="#1890ff" 
                  value={currentColor}
                  style={{ flex: 1 }}
                  onChange={(e) => {
                    const newColor = e.target.value;
                    setCurrentColor(newColor);
                    form.setFieldsValue({ color: newColor });
                  }}
                />
              </Space.Compact>
              <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 4 }}>
                Màu nền của thẻ số liệu (mặc định: #1890ff - xanh dương)
              </div>
            </Form.Item>
            <Form.Item name="textColor" label="Màu chữ" rules={[{ required: true }]}>
              <Space.Compact style={{ width: '100%' }}>
                <Input 
                  type="color" 
                  value={currentTextColor}
                  style={{ width: 80, height: 40 }} 
                  onChange={(e) => {
                    const newColor = e.target.value;
                    setCurrentTextColor(newColor);
                    form.setFieldsValue({ textColor: newColor });
                  }}
                />
                <Input 
                  placeholder="#FFFFFF" 
                  value={currentTextColor}
                  style={{ flex: 1 }}
                  onChange={(e) => {
                    const newColor = e.target.value;
                    setCurrentTextColor(newColor);
                    form.setFieldsValue({ textColor: newColor });
                  }}
                />
              </Space.Compact>
              <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 4 }}>
                Màu chữ số liệu và nhãn (mặc định: #FFFFFF - trắng)
              </div>
            </Form.Item>
            <Form.Item name="displayOrder" label="Thứ tự hiển thị">
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item name="isActive" label="Kích hoạt" valuePropName="checked">
              <Switch />
            </Form.Item>
            <div style={{ 
              padding: 12, 
              background: '#e6f7ff', 
              borderRadius: 8, 
              marginTop: 16,
              border: '1px solid #91d5ff'
            }}>
              <div style={{ fontSize: 13, color: '#0050b3', marginBottom: 4, fontWeight: 600 }}>
                💡 Lưu ý về ảnh nền:
              </div>
              <div style={{ fontSize: 12, color: '#0050b3' }}>
                Ảnh nền cho section thống kê được cài đặt ở tab "Thông tin Website" → "Ảnh nền Section Thống kê"
              </div>
            </div>
          </>
        );
      case 'certifications':
        return (
          <>
            <Form.Item name="name" label="Tên chứng chỉ" rules={[{ required: true }]}>
              <Input placeholder="ISO 15189:2022" />
            </Form.Item>
            <Form.Item name="description" label="Mô tả">
              <TextArea rows={3} placeholder="Nhập mô tả chi tiết về chứng chỉ hoặc cơ sở vật chất" />
            </Form.Item>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                Ảnh chứng chỉ (Slider)
              </label>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Upload
                  beforeUpload={handleUploadIcon}
                  showUploadList={false}
                  accept="image/*"
                >
                  <Button icon={<UploadOutlined />} loading={uploading}>
                    Upload Ảnh Chứng chỉ
                  </Button>
                </Upload>
                {iconUrl && (
                  <div style={{ marginTop: 8 }}>
                    <img 
                      src={iconUrl} 
                      alt="certification" 
                      style={{ 
                        width: '100%',
                        maxWidth: 400,
                        height: 200,
                        objectFit: 'cover',
                        borderRadius: 8,
                        border: '1px solid #d9d9d9'
                      }} 
                    />
                  </div>
                )}
                <div style={{ fontSize: 12, color: '#8c8c8c' }}>
                  Ảnh này sẽ hiển thị trong slider trên trang chủ
                </div>
              </Space>
              <Form.Item name="imageUrl" hidden>
                <Input />
              </Form.Item>
            </div>
            <Form.Item name="icon" label="Icon (Tùy chọn - dùng nếu không có ảnh)">
              <Input placeholder="URL icon hoặc emoji 📜" />
              <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 4 }}>
                Chỉ hiển thị khi không có ảnh chứng chỉ
              </div>
            </Form.Item>
            <Form.Item name="color" label="Màu sắc" rules={[{ required: true }]}>
              <Space.Compact style={{ width: '100%' }}>
                <Input 
                  type="color" 
                  value={currentColor}
                  style={{ width: 80, height: 40 }} 
                  onChange={(e) => {
                    const newColor = e.target.value;
                    setCurrentColor(newColor);
                    form.setFieldsValue({ color: newColor });
                  }}
                />
                <Input 
                  placeholder="#10b981" 
                  value={currentColor}
                  style={{ flex: 1 }}
                  onChange={(e) => {
                    const newColor = e.target.value;
                    setCurrentColor(newColor);
                    form.setFieldsValue({ color: newColor });
                  }}
                />
              </Space.Compact>
            </Form.Item>
            <Form.Item name="displayOrder" label="Thứ tự hiển thị">
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item name="isActive" label="Kích hoạt" valuePropName="checked">
              <Switch />
            </Form.Item>
          </>
        );
      case 'news-categories':
        return (
          <>
            <Form.Item name="name" label="Tên danh mục" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="slug" label="Slug" rules={[{ required: true }]}>
              <Input placeholder="tin-tuc-y-khoa" />
            </Form.Item>
            <Form.Item name="description" label="Mô tả">
              <TextArea rows={3} />
            </Form.Item>
            <Form.Item name="color" label="Màu sắc">
              <Space.Compact style={{ width: '100%' }}>
                <Input 
                  type="color" 
                  value={currentColor}
                  style={{ width: 80, height: 40 }}
                  onChange={(e) => {
                    const newColor = e.target.value;
                    setCurrentColor(newColor);
                    form.setFieldsValue({ color: newColor });
                  }}
                />
                <Input 
                  placeholder="#667eea"
                  value={currentColor}
                  style={{ flex: 1 }}
                  onChange={(e) => {
                    const newColor = e.target.value;
                    setCurrentColor(newColor);
                    form.setFieldsValue({ color: newColor });
                  }}
                />
              </Space.Compact>
            </Form.Item>
            <Form.Item name="displayOrder" label="Thứ tự hiển thị">
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item name="isActive" label="Kích hoạt" valuePropName="checked">
              <Switch />
            </Form.Item>
          </>
        );
      case 'membership-benefits':
        return (
          <>
            <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}>
              <Input placeholder="ƯU ĐÃI THÀNH VIÊN CỦA KHAMNOW" />
            </Form.Item>
            <Form.Item name="subtitle" label="Phụ đề">
              <Input placeholder="Đăng ký thành viên để nhận nhiều ưu đãi đặc biệt" />
            </Form.Item>
            
            <div style={{ marginBottom: 16, fontWeight: 600, color: '#262626', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Danh sách ưu đãi:</span>
              <Button 
                type="dashed" 
                icon={<PlusOutlined />}
                size="small"
                onClick={() => setBenefitsList([...benefitsList, ''])}
              >
                Thêm ưu đãi
              </Button>
            </div>
            
            {benefitsList.map((benefit, index) => (
              <Form.Item 
                key={index}
                label={`Ưu đãi ${index + 1}`}
                style={{ marginBottom: 12 }}
              >
                <Space.Compact style={{ width: '100%' }}>
                  <Input 
                    value={benefit}
                    onChange={(e) => {
                      const newList = [...benefitsList];
                      newList[index] = e.target.value;
                      setBenefitsList(newList);
                    }}
                    placeholder={`Nhập nội dung ưu đãi ${index + 1}`}
                  />
                  {benefitsList.length > 1 && (
                    <Button 
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => {
                        const newList = benefitsList.filter((_, i) => i !== index);
                        setBenefitsList(newList.length > 0 ? newList : ['']);
                      }}
                    />
                  )}
                </Space.Compact>
              </Form.Item>
            ))}
            
            <div style={{ marginBottom: 16, fontWeight: 600, color: '#262626' }}>Hình ảnh:</div>
            <Form.Item name="image1" label="Hình ảnh section">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Upload
                  beforeUpload={handleUploadIcon}
                  showUploadList={false}
                  accept="image/*"
                >
                  <Button icon={<UploadOutlined />} loading={uploading}>
                    Upload Hình ảnh
                  </Button>
                </Upload>
                {iconUrl && (
                  <img src={iconUrl} alt="preview" style={{ width: 200, height: 150, objectFit: 'cover', borderRadius: 8 }} />
                )}
              </Space>
            </Form.Item>
            
            <div style={{ marginBottom: 16, fontWeight: 600, color: '#262626' }}>Form đăng ký:</div>
            <Form.Item name="emailPlaceholder" label="Placeholder email">
              <Input placeholder="Nhập email của bạn" />
            </Form.Item>
            
            <div style={{ marginBottom: 16, fontWeight: 600, color: '#262626' }}>Buttons:</div>
            <Form.Item name="button1Text" label="Text Button 1">
              <Input placeholder="Đăng ký thành viên" />
            </Form.Item>
            <Form.Item name="button1Url" label="URL Button 1">
              <Input placeholder="/register" />
            </Form.Item>
            <Form.Item name="button2Text" label="Text Button 2">
              <Input placeholder="Liên hệ chúng tôi" />
            </Form.Item>
            <Form.Item name="button2Url" label="URL Button 2">
              <Input placeholder="/doctors" />
            </Form.Item>
            
            <Form.Item name="displayOrder" label="Thứ tự hiển thị">
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item name="isActive" label="Kích hoạt" valuePropName="checked">
              <Switch />
            </Form.Item>
          </>
        );
      case 'service-categories':
        return (
          <>
            <Form.Item name="name" label="Tên danh mục" rules={[{ required: true }]}>
              <Input placeholder="Khám sức khỏe" />
            </Form.Item>
            <Form.Item name="slug" label="Slug">
              <Input placeholder="kham-suc-khoe" />
            </Form.Item>
            <Form.Item name="description" label="Mô tả">
              <TextArea rows={3} placeholder="Nhập mô tả danh mục" />
            </Form.Item>
            <Form.Item name="displayOrder" label="Thứ tự hiển thị">
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item name="isActive" label="Kích hoạt" valuePropName="checked">
              <Switch />
            </Form.Item>
          </>
        );
      case 'medical-services':
        return (
          <>
            <Form.Item name="categoryId" label="Danh mục" rules={[{ required: true }]}>
              <Select placeholder="Chọn danh mục">
                {serviceCategories.map(cat => (
                  <Option key={cat.id} value={cat.id}>{cat.name}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}>
              <Input 
                placeholder="Nhập tiêu đề ở đây..."
                onChange={handleTitleChange}
              />
            </Form.Item>
            <Form.Item 
              name="slug" 
              label={
                <span>
                  Slug 
                  <span style={{ color: '#8c8c8c', fontWeight: 'normal', marginLeft: 8 }}>
                    (Tự động tạo từ tiêu đề)
                  </span>
                </span>
              }
              validateStatus={slugExists ? 'error' : slugChecking ? 'validating' : ''}
              help={
                slugExists ? (
                  <span style={{ color: '#ff4d4f' }}>
                    Slug đã tồn tại! 
                    {slugSuggestion && (
                      <Button 
                        type="link" 
                        size="small" 
                        onClick={useSuggestedSlug}
                        style={{ padding: '0 4px', height: 'auto' }}
                      >
                        Dùng: {slugSuggestion}
                      </Button>
                    )}
                  </span>
                ) : slugChecking ? 'Đang kiểm tra...' : null
              }
            >
              <Input 
                placeholder="slug-tu-dong-tao"
                onChange={handleSlugChange}
              />
            </Form.Item>
            <Form.Item name="description" label="Mô tả ngắn">
              <TextArea rows={3} placeholder="Mô tả ngắn về dịch vụ" />
            </Form.Item>
            
            <Divider orientation="left">Hình ảnh (Upload nhiều ảnh cùng lúc)</Divider>
            <Form.Item 
              label="Thư viện ảnh"
              extra="Chọn nhiều ảnh cùng lúc. Ảnh đầu tiên sẽ là ảnh chính."
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                <Upload
                  beforeUpload={() => false}
                  onChange={handleUploadGalleryImages}
                  showUploadList={false}
                  accept="image/*"
                  multiple
                  disabled={uploading}
                  fileList={[]}
                >
                  <Button icon={<PictureOutlined />} loading={uploading} type="primary">
                    {galleryImages.length > 0 ? 'Thêm ảnh khác' : 'Chọn nhiều ảnh'}
                  </Button>
                </Upload>
                
                {galleryImages.length > 0 && (
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', 
                    gap: 12,
                    marginTop: 12
                  }}>
                    {galleryImages.map((url, index) => (
                      <div key={index} style={{ position: 'relative' }}>
                        <img 
                          src={url} 
                          alt={`gallery-${index}`} 
                          style={{ 
                            width: '100%', 
                            height: 120, 
                            objectFit: 'cover', 
                            borderRadius: 8,
                            border: index === 0 ? '3px solid #1890ff' : '1px solid #d9d9d9'
                          }} 
                        />
                        {index === 0 && (
                          <Tag 
                            color="blue" 
                            style={{ 
                              position: 'absolute', 
                              top: 4, 
                              left: 4,
                              fontWeight: 600
                            }}
                          >
                            Ảnh chính
                          </Tag>
                        )}
                        <Button
                          type="primary"
                          danger
                          size="small"
                          icon={<DeleteOutlined />}
                          onClick={() => handleRemoveGalleryImage(index)}
                          style={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            padding: '2px 8px',
                            height: 24
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
                
                {galleryImages.length === 0 && (
                  <div style={{ 
                    padding: 24, 
                    textAlign: 'center', 
                    background: '#fafafa', 
                    border: '2px dashed #d9d9d9',
                    borderRadius: 8,
                    color: '#8c8c8c'
                  }}>
                    <PictureOutlined style={{ fontSize: 32, marginBottom: 8 }} />
                    <div>Chưa có ảnh. Chọn nhiều ảnh cùng lúc.</div>
                    <div style={{ fontSize: 12, marginTop: 4 }}>Ảnh đầu tiên sẽ là ảnh chính</div>
                  </div>
                )}
              </Space>
            </Form.Item>
            
            {/* Hidden field for imageUrl (will be set from first gallery image) */}
            <Form.Item name="imageUrl" hidden>
              <Input />
            </Form.Item>
            
            <Divider orientation="left">Giá cả</Divider>
            <Form.Item name="originalPrice" label="Giá gốc (VNĐ)">
              <InputNumber 
                min={0} 
                style={{ width: '100%' }} 
                placeholder="Nhập giá gốc..."
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                onChange={handlePriceChange}
              />
            </Form.Item>
            <Form.Item name="discountPercentage" label="% Giảm giá">
              <InputNumber 
                min={0} 
                max={100} 
                style={{ width: '100%' }} 
                placeholder="Nhập % giảm giá..."
                onChange={handleDiscountPercentageChange}
              />
            </Form.Item>
            <Form.Item name="discountedPrice" label="Giá khuyến mãi (VNĐ)">
              <InputNumber 
                min={0} 
                style={{ width: '100%' }} 
                placeholder="Giá sau giảm (tự động tính)..."
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                onChange={handlePriceChange}
              />
            </Form.Item>
            
            <Divider orientation="left">Cài đặt</Divider>
            <Form.Item name="displayOrder" label="Thứ tự hiển thị">
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item name="isFeatured" label="Nổi bật" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item name="isActive" label="Kích hoạt" valuePropName="checked">
              <Switch />
            </Form.Item>
          </>
        );
      case 'news-sections':
        return (
          <>
            <Form.Item
              name="name"
              label="Tên section (slug)"
              rules={[{ required: true, message: 'Vui lòng nhập tên section' }]}
              extra="Ví dụ: featured, medlatec, health (không dấu, viết thường)"
            >
              <Input placeholder="featured" />
            </Form.Item>

            <Form.Item
              name="title"
              label="Tiêu đề hiển thị"
              rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
            >
              <Input placeholder="TIN TỨC NỔI BẬT" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Mô tả"
            >
              <TextArea rows={3} placeholder="Mô tả ngắn về section này" />
            </Form.Item>

            <Form.Item
              name="layoutType"
              label="Kiểu hiển thị"
              initialValue="default"
              extra="Default: 1 bài lớn + 4 bài nhỏ | Grid: 4 cột đều nhau (phong cách y khoa)"
            >
              <Select>
                <Option value="default">Default (1 lớn + 4 nhỏ)</Option>
                <Option value="grid">Grid (4 cột đều nhau)</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="categoryFilter"
              label="Lọc theo danh mục"
              extra="Chọn một hoặc nhiều danh mục. Để trống = hiển thị tất cả danh mục"
            >
              <Select 
                mode="multiple"
                placeholder="Chọn danh mục (có thể chọn nhiều)" 
                allowClear
                style={{ width: '100%' }}
              >
                {newsCategories.filter(cat => cat.isActive).map(category => (
                  <Option key={category.id} value={category.name}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="page"
              label="Hiển thị ở trang"
              initialValue="both"
              extra="Chọn trang nào section này sẽ hiển thị"
            >
              <Select>
                <Option value="home">Chỉ trang chủ</Option>
                <Option value="news">Chỉ trang tin tức</Option>
                <Option value="both">Cả hai trang</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="displayOrder"
              label="Thứ tự hiển thị"
              initialValue={0}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>


            <Form.Item
              name="titleAlign"
              label="Căn lề tiêu đề"
              initialValue="left"
            >
              <Select>
                <Option value="left">Trái</Option>
                <Option value="center">Giữa</Option>
                <Option value="right">Phải</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="backgroundColor"
              label="Màu nền"
              initialValue="#fff"
            >
              <Input type="color" style={{ width: '100%', height: 40 }} />
            </Form.Item>

            <Form.Item
              name="showMoreButton"
              label="Hiển thị nút xem thêm"
              valuePropName="checked"
              initialValue={true}
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="moreButtonText"
              label="Text nút xem thêm"
              initialValue="Xem thêm"
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="isActive"
              label="Trạng thái"
              valuePropName="checked"
              initialValue={true}
            >
              <Switch checkedChildren="Hiện" unCheckedChildren="Ẩn" />
            </Form.Item>
          </>
        );
      case 'news-sidebar-widgets':
        return (
          <>
            <Form.Item
              name="widgetType"
              label="Loại widget"
              rules={[{ required: true, message: 'Vui lòng chọn loại widget' }]}
              initialValue="hotline"
            >
              <Select>
                <Option value="hotline">Hotline</Option>
                <Option value="banner">Banner/Quảng cáo</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="title"
              label="Tiêu đề"
            >
              <Input placeholder="Hotline" />
            </Form.Item>

            <Form.Item
              name="subtitle"
              label="Phụ đề / Số hotline"
            >
              <Input placeholder="1900565656" />
            </Form.Item>

            <Form.Item
              name="hotline"
              label="Số hotline (cho widget hotline)"
            >
              <Input placeholder="1900565656" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Mô tả"
            >
              <TextArea rows={3} placeholder="Liên hệ ngay với số hotline..." />
            </Form.Item>

            <Form.Item name="imageUrl" label="Hình ảnh">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Upload
                  beforeUpload={handleUploadIcon}
                  showUploadList={false}
                  accept="image/*"
                >
                  <Button icon={<UploadOutlined />} loading={uploading}>
                    Upload Hình ảnh
                  </Button>
                </Upload>
                {iconUrl && (
                  <img 
                    src={iconUrl} 
                    alt="preview" 
                    style={{ 
                      width: '100%',
                      maxWidth: 400,
                      height: 200,
                      objectFit: 'cover',
                      borderRadius: 8
                    }} 
                  />
                )}
              </Space>
            </Form.Item>

            <Form.Item
              name="buttonText"
              label="Text nút"
            >
              <Input placeholder="Liên hệ với chúng tôi" />
            </Form.Item>

            <Form.Item
              name="buttonUrl"
              label="URL nút"
            >
              <Input placeholder="/contact" />
            </Form.Item>

            <Form.Item
              name="displayOrder"
              label="Thứ tự hiển thị"
              initialValue={0}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="isActive"
              label="Trạng thái"
              valuePropName="checked"
              initialValue={true}
            >
              <Switch checkedChildren="Hiện" unCheckedChildren="Ẩn" />
            </Form.Item>
          </>
        );
      case 'article-cta':
        return (
          <>
            <Form.Item name="title" label="Tiêu đề chính" rules={[{ required: true }]}>
              <Input placeholder="Lựa chọn dịch vụ" />
            </Form.Item>
            
            <Form.Item name="subtitle" label="Mô tả">
              <TextArea rows={2} placeholder="Quý khách hàng vui lòng lựa chọn dịch vụ y tế theo nhu cầu" />
            </Form.Item>

            <Divider>Dịch vụ 1</Divider>
            
            <Form.Item name="cta1Image" label="Hình ảnh 1">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Upload
                  beforeUpload={(file) => handleUploadIcon(file, 'cta1Image')}
                  showUploadList={false}
                  accept="image/*"
                >
                  <Button icon={<UploadOutlined />} loading={uploading}>
                    Upload Hình ảnh
                  </Button>
                </Upload>
                {form.getFieldValue('cta1Image') && (
                  <img 
                    src={form.getFieldValue('cta1Image')} 
                    alt="Preview" 
                    style={{ maxWidth: 200, maxHeight: 150, objectFit: 'cover', borderRadius: 8 }}
                  />
                )}
              </Space>
            </Form.Item>
            
            <Form.Item name="cta1Title" label="Tiêu đề 1" rules={[{ required: true }]}>
              <Input placeholder="Lấy mẫu xét nghiệm tại nhà" />
            </Form.Item>
            
            <Form.Item name="cta1Description" label="Mô tả 1">
              <TextArea rows={3} />
            </Form.Item>
            
            <Form.Item name="cta1ButtonText" label="Text nút 1">
              <Input placeholder="Đặt lịch" />
            </Form.Item>
            
            <Form.Item name="cta1ButtonUrl" label="Link nút 1">
              <Input placeholder="/appointment" />
            </Form.Item>

            <Divider>Dịch vụ 2</Divider>
            
            <Form.Item name="cta2Image" label="Hình ảnh 2">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Upload
                  beforeUpload={(file) => handleUploadIcon(file, 'cta2Image')}
                  showUploadList={false}
                  accept="image/*"
                >
                  <Button icon={<UploadOutlined />} loading={uploading}>
                    Upload Hình ảnh
                  </Button>
                </Upload>
                {form.getFieldValue('cta2Image') && (
                  <img 
                    src={form.getFieldValue('cta2Image')} 
                    alt="Preview" 
                    style={{ maxWidth: 200, maxHeight: 150, objectFit: 'cover', borderRadius: 8 }}
                  />
                )}
              </Space>
            </Form.Item>
            
            <Form.Item name="cta2Title" label="Tiêu đề 2" rules={[{ required: true }]}>
              <Input placeholder="Đặt lịch thăm khám tại KHAMNOW" />
            </Form.Item>
            
            <Form.Item name="cta2Description" label="Mô tả 2">
              <TextArea rows={3} />
            </Form.Item>
            
            <Form.Item name="cta2ButtonText" label="Text nút 2">
              <Input placeholder="Đặt lịch" />
            </Form.Item>
            
            <Form.Item name="cta2ButtonUrl" label="Link nút 2">
              <Input placeholder="/appointment" />
            </Form.Item>

            <Form.Item name="backgroundColor" label="Màu nền">
              <Input type="color" style={{ width: '100%', height: 40 }} />
            </Form.Item>

            <Divider>Hình ảnh bác sĩ bên phải</Divider>
            
            <Form.Item name="doctorImage" label="Hình ảnh bác sĩ">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Upload
                  beforeUpload={(file) => handleUploadIcon(file, 'doctorImage')}
                  showUploadList={false}
                  accept="image/*"
                >
                  <Button icon={<UploadOutlined />} loading={uploading}>
                    Upload Hình ảnh bác sĩ
                  </Button>
                </Upload>
                {form.getFieldValue('doctorImage') && (
                  <img 
                    src={form.getFieldValue('doctorImage')} 
                    alt="Doctor Preview" 
                    style={{ maxWidth: 200, maxHeight: 150, objectFit: 'cover', borderRadius: 8 }}
                  />
                )}
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Nếu không upload, sẽ dùng ảnh mặc định
                </Text>
              </Space>
            </Form.Item>
          </>
        );
      default:
        return null;
    }
  };

  // ==================== ABOUT PAGE RENDER FUNCTIONS ====================
  
  const AboutHeroForm = () => {
    const [heroForm] = Form.useForm();
    const [heroImageUrl, setHeroImageUrl] = useState('');
    const [uploading, setUploading] = useState(false);
    
    React.useEffect(() => {
      if (aboutHero) {
        heroForm.setFieldsValue(aboutHero);
        setHeroImageUrl(aboutHero.backgroundImage || '');
      }
    }, [aboutHero]);
    
    const handleUploadHeroImage = async (file) => { 
      const formData = new FormData();
      formData.append('image', file);
      
      setUploading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_BASE_URL}/images/articles`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        });
        
        const uploadedUrl = response.data.imageUrl || response.data.url;
        setHeroImageUrl(uploadedUrl);
        heroForm.setFieldsValue({ backgroundImage: uploadedUrl });
        message.success('Upload ảnh thành công!');
      } catch (error) {
        console.error('Upload error:', error);
        message.error('Lỗi khi upload: ' + (error.response?.data?.error || error.message));
      } finally {
        setUploading(false);
      }
      
      return false;
    };
    
    const handleSaveHero = async () => {
      try {
        const values = await heroForm.validateFields();
        console.log('Hero form values:', values);
        
        // Ensure backgroundImage is included
        if (!values.backgroundImage && heroImageUrl) {
          values.backgroundImage = heroImageUrl;
        }
        
        await cmsAPI.updateAboutSection('hero', {
          sectionKey: 'hero',
          contentJson: JSON.stringify(values),
          isActive: true
        });
        message.success('Đã lưu Hero Section!');
        fetchAllData();
      } catch (error) {
        console.error('Error saving hero:', error);
        message.error('Lỗi khi lưu: ' + (error.response?.data?.message || error.message));
      }
    };
    
    return (
      <Form form={heroForm} layout="vertical">
        <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}>
          <Input placeholder="Về chúng tôi" />
        </Form.Item>
        <Form.Item name="subtitle" label="Phụ đề">
          <TextArea rows={2} placeholder="Hệ thống Y tế chất lượng cao" />
        </Form.Item>
        <Form.Item name="backgroundImage" hidden>
          <Input />
        </Form.Item>
        <Form.Item label="Ảnh nền">
          <Upload
            showUploadList={false}
            accept="image/*"
            customRequest={({ file }) => handleUploadHeroImage(file)}
          >
            <Button icon={<UploadOutlined />} loading={uploading}>
              Upload ảnh nền
            </Button>
          </Upload>
          {heroImageUrl && (
            <div style={{ marginTop: 8 }}>
              <img 
                src={heroImageUrl} 
                alt="Preview" 
                style={{ 
                  width: '100%',
                  maxWidth: 400,
                  height: 200, 
                  objectFit: 'cover', 
                  borderRadius: 8,
                  border: '2px solid #1890ff'
                }} 
              />
              <div style={{ fontSize: 12, color: '#52c41a', marginTop: 4 }}>
                ✓ Ảnh đã upload
              </div>
            </div>
          )}
        </Form.Item>
        <Button type="primary" onClick={handleSaveHero}>
          Lưu thay đổi
        </Button>
      </Form>
    );
  };
  
  const AboutMissionForm = () => {
    const [missionForm] = Form.useForm();
    const [missionImageUrl, setMissionImageUrl] = useState('');
    const [uploading, setUploading] = useState(false);
    
    React.useEffect(() => {
      if (aboutMission) {
        missionForm.setFieldsValue(aboutMission);
        setMissionImageUrl(aboutMission.imageUrl || '');
      }
    }, [aboutMission]);
    
    const handleUploadMissionImage = async (file) => {
      const formData = new FormData();
      formData.append('image', file);
      
      setUploading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_BASE_URL}/images/articles`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        });
        
        const uploadedUrl = response.data.imageUrl || response.data.url;
        setMissionImageUrl(uploadedUrl);
        missionForm.setFieldsValue({ imageUrl: uploadedUrl });
        message.success('Upload ảnh thành công!');
      } catch (error) {
        console.error('Upload error:', error);
        message.error('Lỗi khi upload: ' + (error.response?.data?.error || error.message));
      } finally {
        setUploading(false);
      }
      
      return false;
    };
    
    const handleSaveMission = async () => {
      try {
        const values = await missionForm.validateFields();
        console.log('Mission form values:', values);
        
        // Ensure imageUrl is included
        if (!values.imageUrl && missionImageUrl) {
          values.imageUrl = missionImageUrl;
        }
        
        await cmsAPI.updateAboutSection('mission', {
          sectionKey: 'mission',
          contentJson: JSON.stringify(values),
          isActive: true
        });
        message.success('Đã lưu Mission Section!');
        fetchAllData();
      } catch (error) {
        console.error('Error saving mission:', error);
        message.error('Lỗi khi lưu: ' + (error.response?.data?.message || error.message));
      }
    };
    
    return (
      <Form form={missionForm} layout="vertical">
        <Form.Item name="label" label="Label">
          <Input placeholder="SỨ MỆNH CỦA CHÚNG TÔI" />
        </Form.Item>
        <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}>
          <Input placeholder="Mang đến dịch vụ y tế chất lượng cao" />
        </Form.Item>
        <Form.Item name="description" label="Mô tả">
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item name="imageUrl" hidden>
          <Input />
        </Form.Item>
        <Form.Item label="Hình ảnh">
          <Upload
            showUploadList={false}
            accept="image/*"
            customRequest={({ file }) => handleUploadMissionImage(file)}
          >
            <Button icon={<UploadOutlined />} loading={uploading}>
              Upload hình ảnh
            </Button>
          </Upload>
          {missionImageUrl && (
            <div style={{ marginTop: 8 }}>
              <img 
                src={missionImageUrl} 
                alt="Preview" 
                style={{ 
                  width: '100%',
                  maxWidth: 400,
                  height: 200, 
                  objectFit: 'cover', 
                  borderRadius: 8,
                  border: '2px solid #1890ff'
                }} 
              />
              <div style={{ fontSize: 12, color: '#52c41a', marginTop: 4 }}>
                ✓ Ảnh đã upload
              </div>
            </div>
          )}
        </Form.Item>
        <Form.Item name={['features', 0]} label="Feature 1">
          <Input />
        </Form.Item>
        <Form.Item name={['features', 1]} label="Feature 2">
          <Input />
        </Form.Item>
        <Form.Item name={['features', 2]} label="Feature 3">
          <Input />
        </Form.Item>
        <Button type="primary" onClick={handleSaveMission}>
          Lưu thay đổi
        </Button>
      </Form>
    );
  };
  
  const renderAboutHeroForm = () => <AboutHeroForm />;
  const renderAboutMissionForm = () => <AboutMissionForm />;
  
  const AboutValuesTable = () => {
    const [editingValue, setEditingValue] = useState(null);
    const [valueModalVisible, setValueModalVisible] = useState(false);
    const [valueForm] = Form.useForm();
    
    const handleAddValue = () => {
      setEditingValue(null);
      valueForm.resetFields();
      setValueModalVisible(true);
    };
    
    const handleEditValue = (value, index) => {
      setEditingValue({ ...value, index });
      valueForm.setFieldsValue(value);
      setValueModalVisible(true);
    };
    
    const handleDeleteValue = (index) => {
      const newValues = aboutValues.filter((_, i) => i !== index);
      saveValuesData(newValues);
    };
    
    const handleSaveValue = async () => {
      try {
        const values = await valueForm.validateFields();
        let newValues;
        
        if (editingValue && editingValue.index !== undefined) {
          // Edit existing
          newValues = [...aboutValues];
          newValues[editingValue.index] = values;
        } else {
          // Add new
          newValues = [...aboutValues, values];
        }
        
        await saveValuesData(newValues);
        setValueModalVisible(false);
      } catch (error) {
        console.error('Validation error:', error);
      }
    };
    
    const saveValuesData = async (data) => {
      try {
        await cmsAPI.updateAboutSection('values', {
          sectionKey: 'values',
          contentJson: JSON.stringify(data),
          isActive: true
        });
        message.success('Đã lưu Core Values!');
        fetchAllData();
      } catch (error) {
        message.error('Lỗi khi lưu!');
      }
    };
    
    const columns = [
      { title: 'Tiêu đề', dataIndex: 'title', key: 'title' },
      { title: 'Mô tả', dataIndex: 'description', key: 'description', ellipsis: true },
      { title: 'Icon', dataIndex: 'icon', key: 'icon' },
      { 
        title: 'Màu sắc', 
        dataIndex: 'color', 
        key: 'color',
        render: (color) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 20, height: 20, background: color, borderRadius: 4 }} />
            <span>{color}</span>
          </div>
        )
      },
      {
        title: 'Hành động',
        key: 'actions',
        render: (_, record, index) => (
          <Space>
            <Button icon={<EditOutlined />} onClick={() => handleEditValue(record, index)} />
            <Popconfirm
              title="Bạn có chắc muốn xóa?"
              onConfirm={() => handleDeleteValue(index)}
            >
              <Button icon={<DeleteOutlined />} danger />
            </Popconfirm>
          </Space>
        )
      }
    ];
    
    return (
      <div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddValue} style={{ marginBottom: 16 }}>
          Thêm giá trị
        </Button>
        <Table 
          dataSource={aboutValues} 
          columns={columns}
          rowKey={(record, index) => index}
        />
        
        <Modal
          title={editingValue ? 'Chỉnh sửa giá trị' : 'Thêm giá trị'}
          open={valueModalVisible}
          onCancel={() => setValueModalVisible(false)}
          onOk={handleSaveValue}
        >
          <Form form={valueForm} layout="vertical">
            <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}>
              <Input placeholder="Tận tâm" />
            </Form.Item>
            <Form.Item name="description" label="Mô tả" rules={[{ required: true }]}>
              <TextArea rows={3} placeholder="Mô tả giá trị..." />
            </Form.Item>
            <Form.Item name="icon" label="Icon" rules={[{ required: true }]}>
              <Select placeholder="Chọn icon">
                <Option value="HeartOutlined">HeartOutlined (Trái tim)</Option>
                <Option value="SafetyOutlined">SafetyOutlined (An toàn)</Option>
                <Option value="TeamOutlined">TeamOutlined (Nhóm)</Option>
                <Option value="TrophyOutlined">TrophyOutlined (Cúp)</Option>
              </Select>
            </Form.Item>
            <Form.Item name="color" label="Màu sắc" rules={[{ required: true }]}>
              <Input type="color" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  };
  
  const AboutAchievementsTable = () => {
    const [editingAchievement, setEditingAchievement] = useState(null);
    const [achievementModalVisible, setAchievementModalVisible] = useState(false);
    const [achievementForm] = Form.useForm();
    
    const handleAddAchievement = () => {
      setEditingAchievement(null);
      achievementForm.resetFields();
      setAchievementModalVisible(true);
    };
    
    const handleEditAchievement = (achievement, index) => {
      setEditingAchievement({ ...achievement, index });
      achievementForm.setFieldsValue(achievement);
      setAchievementModalVisible(true);
    };
    
    const handleDeleteAchievement = (index) => {
      const newAchievements = aboutAchievements.filter((_, i) => i !== index);
      saveAchievementsData(newAchievements);
    };
    
    const handleSaveAchievement = async () => {
      try {
        const values = await achievementForm.validateFields();
        let newAchievements;
        
        if (editingAchievement && editingAchievement.index !== undefined) {
          newAchievements = [...aboutAchievements];
          newAchievements[editingAchievement.index] = values;
        } else {
          newAchievements = [...aboutAchievements, values];
        }
        
        await saveAchievementsData(newAchievements);
        setAchievementModalVisible(false);
      } catch (error) {
        console.error('Validation error:', error);
      }
    };
    
    const saveAchievementsData = async (data) => {
      try {
        await cmsAPI.updateAboutSection('achievements', {
          sectionKey: 'achievements',
          contentJson: JSON.stringify(data),
          isActive: true
        });
        message.success('Đã lưu Achievements!');
        fetchAllData();
      } catch (error) {
        message.error('Lỗi khi lưu!');
      }
    };
    
    const columns = [
      { title: 'Tiêu đề', dataIndex: 'title', key: 'title' },
      { title: 'Giá trị', dataIndex: 'value', key: 'value' },
      { title: 'Suffix', dataIndex: 'suffix', key: 'suffix' },
      { title: 'Icon', dataIndex: 'icon', key: 'icon' },
      {
        title: 'Hành động',
        key: 'actions',
        render: (_, record, index) => (
          <Space>
            <Button icon={<EditOutlined />} onClick={() => handleEditAchievement(record, index)} />
            <Popconfirm
              title="Bạn có chắc muốn xóa?"
              onConfirm={() => handleDeleteAchievement(index)}
            >
              <Button icon={<DeleteOutlined />} danger />
            </Popconfirm>
          </Space>
        )
      }
    ];
    
    return (
      <div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddAchievement} style={{ marginBottom: 16 }}>
          Thêm thành tựu
        </Button>
        <Table 
          dataSource={aboutAchievements} 
          columns={columns}
          rowKey={(record, index) => index}
        />
        
        <Modal
          title={editingAchievement ? 'Chỉnh sửa thành tựu' : 'Thêm thành tựu'}
          open={achievementModalVisible}
          onCancel={() => setAchievementModalVisible(false)}
          onOk={handleSaveAchievement}
        >
          <Form form={achievementForm} layout="vertical">
            <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}>
              <Input placeholder="Bệnh nhân" />
            </Form.Item>
            <Form.Item name="value" label="Giá trị" rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} placeholder="500000" />
            </Form.Item>
            <Form.Item name="suffix" label="Suffix">
              <Input placeholder="+" />
            </Form.Item>
            <Form.Item name="icon" label="Icon" rules={[{ required: true }]}>
              <Select placeholder="Chọn icon">
                <Option value="TeamOutlined">TeamOutlined (Nhóm)</Option>
                <Option value="MedicineBoxOutlined">MedicineBoxOutlined (Y tế)</Option>
                <Option value="GlobalOutlined">GlobalOutlined (Toàn cầu)</Option>
                <Option value="TrophyOutlined">TrophyOutlined (Cúp)</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  };
  
  const AboutTimelineTable = () => {
    const [editingMilestone, setEditingMilestone] = useState(null);
    const [milestoneModalVisible, setMilestoneModalVisible] = useState(false);
    const [milestoneForm] = Form.useForm();
    
    const handleAddMilestone = () => {
      setEditingMilestone(null);
      milestoneForm.resetFields();
      setMilestoneModalVisible(true);
    };
    
    const handleEditMilestone = (milestone, index) => {
      setEditingMilestone({ ...milestone, index });
      milestoneForm.setFieldsValue(milestone);
      setMilestoneModalVisible(true);
    };
    
    const handleDeleteMilestone = (index) => {
      const newMilestones = aboutTimeline.filter((_, i) => i !== index);
      saveMilestonesData(newMilestones);
    };
    
    const handleSaveMilestone = async () => {
      try {
        const values = await milestoneForm.validateFields();
        let newMilestones;
        
        if (editingMilestone && editingMilestone.index !== undefined) {
          newMilestones = [...aboutTimeline];
          newMilestones[editingMilestone.index] = values;
        } else {
          newMilestones = [...aboutTimeline, values];
        }
        
        await saveMilestonesData(newMilestones);
        setMilestoneModalVisible(false);
      } catch (error) {
        console.error('Validation error:', error);
      }
    };
    
    const saveMilestonesData = async (data) => {
      try {
        await cmsAPI.updateAboutSection('timeline', {
          sectionKey: 'timeline',
          contentJson: JSON.stringify(data),
          isActive: true
        });
        message.success('Đã lưu Timeline!');
        fetchAllData();
      } catch (error) {
        message.error('Lỗi khi lưu!');
      }
    };
    
    const columns = [
      { title: 'Năm', dataIndex: 'year', key: 'year' },
      { title: 'Tiêu đề', dataIndex: 'title', key: 'title' },
      { title: 'Mô tả', dataIndex: 'description', key: 'description', ellipsis: true },
      {
        title: 'Hành động',
        key: 'actions',
        render: (_, record, index) => (
          <Space>
            <Button icon={<EditOutlined />} onClick={() => handleEditMilestone(record, index)} />
            <Popconfirm
              title="Bạn có chắc muốn xóa?"
              onConfirm={() => handleDeleteMilestone(index)}
            >
              <Button icon={<DeleteOutlined />} danger />
            </Popconfirm>
          </Space>
        )
      }
    ];
    
    return (
      <div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddMilestone} style={{ marginBottom: 16 }}>
          Thêm cột mốc
        </Button>
        <Table 
          dataSource={aboutTimeline} 
          columns={columns}
          rowKey={(record, index) => index}
        />
        
        <Modal
          title={editingMilestone ? 'Chỉnh sửa cột mốc' : 'Thêm cột mốc'}
          open={milestoneModalVisible}
          onCancel={() => setMilestoneModalVisible(false)}
          onOk={handleSaveMilestone}
        >
          <Form form={milestoneForm} layout="vertical">
            <Form.Item name="year" label="Năm" rules={[{ required: true }]}>
              <Input placeholder="2024" />
            </Form.Item>
            <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}>
              <Input placeholder="Thành lập" />
            </Form.Item>
            <Form.Item name="description" label="Mô tả" rules={[{ required: true }]}>
              <TextArea rows={3} placeholder="Mô tả cột mốc..." />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  };
  
  const AboutTeamTable = () => {
    const [editingMember, setEditingMember] = useState(null);
    const [memberModalVisible, setMemberModalVisible] = useState(false);
    const [memberForm] = Form.useForm();
    const [memberAvatarUrl, setMemberAvatarUrl] = useState('');
    const [uploading, setUploading] = useState(false);
    
    const handleAddMember = () => {
      setEditingMember(null);
      memberForm.resetFields();
      setMemberAvatarUrl('');
      setMemberModalVisible(true);
    };
    
    const handleEditMember = (member, index) => {
      setEditingMember({ ...member, index });
      memberForm.setFieldsValue(member);
      setMemberAvatarUrl(member.avatarUrl || '');
      setMemberModalVisible(true);
    };
    
    const handleDeleteMember = (index) => {
      const newTeam = aboutTeam.filter((_, i) => i !== index);
      saveTeamData(newTeam);
    };
    
    const handleUploadAvatar = async (file) => {
      const formData = new FormData();
      formData.append('image', file);
      
      setUploading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_BASE_URL}/images/articles`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        });
        
        const uploadedUrl = response.data.imageUrl || response.data.url;
        setMemberAvatarUrl(uploadedUrl);
        memberForm.setFieldsValue({ avatarUrl: uploadedUrl });
        message.success('Upload ảnh thành công!');
      } catch (error) {
        console.error('Upload error:', error);
        message.error('Lỗi khi upload!');
      } finally {
        setUploading(false);
      }
      
      return false;
    };
    
    const handleSaveMember = async () => {
      try {
        const values = await memberForm.validateFields();
        console.log('Member form values:', values);
        
        // Ensure avatarUrl is included
        if (!values.avatarUrl && memberAvatarUrl) {
          values.avatarUrl = memberAvatarUrl;
        }
        
        let newTeam;
        
        if (editingMember && editingMember.index !== undefined) {
          newTeam = [...aboutTeam];
          newTeam[editingMember.index] = values;
        } else {
          newTeam = [...aboutTeam, values];
        }
        
        await saveTeamData(newTeam);
        setMemberModalVisible(false);
      } catch (error) {
        console.error('Validation error:', error);
        message.error('Vui lòng điền đầy đủ thông tin!');
      }
    };
    
    const saveTeamData = async (data) => {
      try {
        await cmsAPI.updateAboutSection('team', {
          sectionKey: 'team',
          contentJson: JSON.stringify(data),
          isActive: true
        });
        message.success('Đã lưu Team!');
        fetchAllData();
      } catch (error) {
        message.error('Lỗi khi lưu!');
      }
    };
    
    const columns = [
      { title: 'Tên', dataIndex: 'name', key: 'name' },
      { title: 'Chức vụ', dataIndex: 'position', key: 'position' },
      { title: 'Chuyên khoa', dataIndex: 'specialty', key: 'specialty' },
      { 
        title: 'Avatar', 
        dataIndex: 'avatarUrl', 
        key: 'avatarUrl',
        render: (url) => url ? <Avatar src={url} size={40} /> : <Avatar icon={<UserOutlined />} size={40} />
      },
      {
        title: 'Hành động',
        key: 'actions',
        render: (_, record, index) => (
          <Space>
            <Button icon={<EditOutlined />} onClick={() => handleEditMember(record, index)} />
            <Popconfirm
              title="Bạn có chắc muốn xóa?"
              onConfirm={() => handleDeleteMember(index)}
            >
              <Button icon={<DeleteOutlined />} danger />
            </Popconfirm>
          </Space>
        )
      }
    ];
    
    return (
      <div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddMember} style={{ marginBottom: 16 }}>
          Thêm thành viên
        </Button>
        <Table 
          dataSource={aboutTeam} 
          columns={columns}
          rowKey={(record, index) => index}
        />
        
        <Modal
          title={editingMember ? 'Chỉnh sửa thành viên' : 'Thêm thành viên'}
          open={memberModalVisible}
          onCancel={() => setMemberModalVisible(false)}
          onOk={handleSaveMember}
          width={600}
        >
          <Form form={memberForm} layout="vertical">
            <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
              <Input placeholder="PGS.TS Nguyễn Văn A" />
            </Form.Item>
            <Form.Item name="position" label="Chức vụ" rules={[{ required: true }]}>
              <Input placeholder="Giám đốc Y khoa" />
            </Form.Item>
            <Form.Item name="specialty" label="Chuyên khoa" rules={[{ required: true }]}>
              <Input placeholder="Tim mạch" />
            </Form.Item>
            <Form.Item label="Avatar">
              <Upload
                showUploadList={false}
                accept="image/*"
                customRequest={({ file }) => handleUploadAvatar(file)}
              >
                <Button icon={<UploadOutlined />} loading={uploading}>
                  Upload avatar
                </Button>
              </Upload>
              {memberAvatarUrl && (
                <div style={{ marginTop: 8 }}>
                  <Avatar src={memberAvatarUrl} size={80} />
                  <div style={{ fontSize: 12, color: '#52c41a', marginTop: 4 }}>
                    ✓ Avatar đã upload
                  </div>
                </div>
              )}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  };
  
  const renderAboutValuesTable = () => <AboutValuesTable />;
  const renderAboutAchievementsTable = () => <AboutAchievementsTable />;
  const renderAboutTimelineTable = () => <AboutTimelineTable />;
  const renderAboutTeamTable = () => <AboutTeamTable />;

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#10b981',
          colorPrimaryHover: '#059669',
        },
        components: {
          Switch: {
            colorPrimary: '#10b981',
            colorPrimaryHover: '#059669',
            colorTextQuaternary: 'rgba(0, 0, 0, 0.25)',
          },
        },
      }}
    >
    <Layout style={{ minHeight: '100vh' }}>
      {/* Admin Header */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 64,
        background: '#fff',
        borderBottom: '1px solid #f0f0f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {isMobile && (
            <Button
              type="text"
              icon={<MenuOutlined style={{ fontSize: 20 }} />}
              onClick={() => setMobileMenuVisible(true)}
            />
          )}
          <Button 
            type="link" 
            icon={<HomeOutlined />}
            onClick={() => window.location.href = '/'}
            style={{ fontSize: 16 }}
          >
            {!isMobile && 'Về trang chủ'}
          </Button>
          <Button 
            type="link" 
            icon={<SettingOutlined />}
            onClick={() => window.location.href = '/admin'}
            style={{ fontSize: 16 }}
          >
            {!isMobile && 'Trang Quản trị'}
          </Button>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ color: '#8c8c8c', fontSize: 14 }}>
            Xin chào, <strong>{localStorage.getItem('userFirstName') || 'Admin'}</strong>
          </span>
          <Avatar 
            size={40}
            src={userAvatar}
            icon={<UserOutlined />}
            style={{ cursor: 'pointer', border: '2px solid #10b981' }}
            onClick={() => window.location.href = '/profile'}
          />
        </div>
      </div>

      {!isMobile && (
      <Sider 
        breakpoint="md"
        collapsedWidth="0"
        width={280} 
        style={{ 
          background: '#fff',
          boxShadow: '2px 0 8px rgba(0,0,0,0.06)',
          overflow: 'auto',
          height: 'calc(100vh - 64px)',
          position: 'fixed',
          left: 0,
          top: 64,
          bottom: 0
        }}
      >
        <div style={{ 
          padding: '24px 16px',
          borderBottom: '1px solid #f0f0f0',
          background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)'
        }}>
          <h2 style={{ 
            margin: 0, 
            color: '#fff',
            fontSize: 18,
            fontWeight: 700
          }}>
            Quản lý CMS
          </h2>
          <p style={{ 
            margin: '4px 0 0 0', 
            color: 'rgba(255,255,255,0.85)',
            fontSize: 12
          }}>
            Content Management System
          </p>
        </div>
        
        <Menu
          mode="inline"
          selectedKeys={[currentTab]}
          onClick={({ key }) => setCurrentTab(key)}
          style={{ 
            border: 'none',
            paddingTop: 8
          }}
        >
          <Menu.ItemGroup 
            key="homepage-group" 
            title={
              <span style={{ 
                fontSize: 12, 
                fontWeight: 700, 
                color: '#8c8c8c',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                <HomeOutlined /> Trang chủ
              </span>
            }
          >
            <Menu.Item key="banners" icon={<PictureOutlined />}>
              Banner Slider
            </Menu.Item>
            <Menu.Item key="services" icon={<CustomerServiceOutlined />}>
              Tiện ích khách hàng
            </Menu.Item>
            <Menu.Item key="features" icon={<StarOutlined />}>
              Tại sao chọn chúng tôi
            </Menu.Item>
            <Menu.Item key="specialties" icon={<MedicineBoxOutlined />}>
              Các chuyên khoa
            </Menu.Item>
            <Menu.Item key="statistics" icon={<BarChartOutlined />}>
              Số liệu thống kê
            </Menu.Item>
            <Menu.Item key="certifications" icon={<TrophyOutlined />}>
              Chứng chỉ và cơ sở vật chất
            </Menu.Item>
            <Menu.Item key="testimonials" icon={<CommentOutlined />}>
              Đánh giá khách hàng
            </Menu.Item>
            <Menu.Item key="membership-benefits" icon={<StarOutlined />}>
              Ưu đãi thành viên
            </Menu.Item>
          </Menu.ItemGroup>

          <Menu.ItemGroup 
            key="news-group" 
            title={
              <span style={{ 
                fontSize: 12, 
                fontWeight: 700, 
                color: '#8c8c8c',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                <FileTextOutlined /> Tin tức
              </span>
            }
          >
            <Menu.Item key="news-banners" icon={<PictureOutlined />}>
              Banner tin tức
            </Menu.Item>
            <Menu.Item key="doctor-articles" icon={<FileTextOutlined />}>
              Bài viết bác sĩ
            </Menu.Item>
            <Menu.Item key="news-categories" icon={<TagOutlined />}>
              Danh mục tin tức
            </Menu.Item>
            <Menu.Item key="news-sections" icon={<FileTextOutlined />}>
              Sections Tin tức
            </Menu.Item>
            <Menu.Item key="news-sidebar-widgets" icon={<PictureOutlined />}>
              Sidebar Tin tức
            </Menu.Item>
          </Menu.ItemGroup>

          <Menu.ItemGroup 
            key="article-detail-group" 
            title={
              <span style={{ 
                fontSize: 11, 
                fontWeight: 600, 
                color: '#8c8c8c', 
                textTransform: 'uppercase',
                letterSpacing: 0.5
              }}>
                Chi tiết bài viết
              </span>
            }
          >
            <Menu.Item key="article-cta" icon={<AppstoreOutlined />}>
              Section cuối bài viết
            </Menu.Item>
          </Menu.ItemGroup>

          <Menu.ItemGroup 
            key="about-group" 
            title={
              <span style={{ 
                fontSize: 11, 
                fontWeight: 600, 
                color: '#8c8c8c', 
                textTransform: 'uppercase',
                letterSpacing: 0.5
              }}>
                Trang giới thiệu
              </span>
            }
          >
            <Menu.Item key="about-page" icon={<InfoCircleOutlined />}>
              Trang giới thiệu
            </Menu.Item>
          </Menu.ItemGroup>

          <Menu.ItemGroup 
            key="services-group" 
            title={
              <span style={{ 
                fontSize: 12, 
                fontWeight: 700, 
                color: '#8c8c8c',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                <MedicineBoxOutlined /> Dịch vụ
              </span>
            }
          >
            <Menu.Item key="service-categories" icon={<TagOutlined />}>
              Danh mục dịch vụ
            </Menu.Item>
            <Menu.Item key="medical-services" icon={<MedicineBoxOutlined />}>
              Dịch vụ y tế
            </Menu.Item>
          </Menu.ItemGroup>

          <Menu.ItemGroup 
            key="settings-group" 
            title={
              <span style={{ 
                fontSize: 12, 
                fontWeight: 700, 
                color: '#8c8c8c',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                <SettingOutlined /> Cài đặt
              </span>
            }
          >
            <Menu.Item key="bank-account" icon={<SettingOutlined />}>
              Thông tin ngân hàng
            </Menu.Item>
            <Menu.Item key="footer-settings" icon={<SettingOutlined />}>
              Footer
            </Menu.Item>
            <Menu.Item key="site-settings" icon={<SettingOutlined />}>
              Thông tin Website
            </Menu.Item>
          </Menu.ItemGroup>
        </Menu>
      </Sider>
      )}

      <Layout style={{ marginLeft: isMobile ? 0 : 280 }}>
        <Content style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh', marginTop: 64 }}>
          {/* Banner Section */}
          {currentTab === 'banners' && (
            <Card 
              className="admin-cms-card"
              title={
                <div>
                  <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Banner Slider</div>
                  <div style={{ fontSize: 12, color: '#8c8c8c', fontWeight: 400 }}>
                    <HomeOutlined /> Hiển thị ở: Trang chủ (Đầu trang)
                  </div>
                </div>
              }
              extra={
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                  Thêm banner
                </Button>
              }
            >
              <Table
                className="admin-cms-table"
                columns={bannerColumns}
                dataSource={banners}
                rowKey="id"
                loading={loading}
              />
            </Card>
          )}

          {/* Services Section */}
          {currentTab === 'services' && (
            <Card 
              className="admin-cms-card"
              title={
                <div>
                  <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Tiện ích cho khách hàng</div>
                  <div style={{ fontSize: 12, color: '#8c8c8c', fontWeight: 400 }}>
                    <HomeOutlined /> Hiển thị ở: Trang chủ (Section 1)
                  </div>
                </div>
              }
              extra={
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                  Thêm dịch vụ
                </Button>
              }
            >
              <Table
                className="admin-cms-table"
                columns={servicesColumns}
                dataSource={services}
                rowKey="id"
                loading={loading}
              />
            </Card>
          )}

          {/* Features Section */}
          {currentTab === 'features' && (
            <Card 
              className="admin-cms-card"
              title={
                <div>
                  <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Tại sao chọn KHAMNOW?</div>
                  <div style={{ fontSize: 12, color: '#8c8c8c', fontWeight: 400 }}>
                    <HomeOutlined /> Hiển thị ở: Trang chủ (Section 2)
                  </div>
                </div>
              }
              extra={
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                  Thêm tính năng
                </Button>
              }
            >
              <Table
                className="admin-cms-table"
                columns={featuresColumns}
                dataSource={features}
                rowKey="id"
                loading={loading}
              />
            </Card>
          )}

          {/* Specialties Section */}
          {currentTab === 'specialties' && (
            <Card 
              className="admin-cms-card"
              title={
                <div>
                  <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Các chuyên khoa y tế</div>
                  <div style={{ fontSize: 12, color: '#8c8c8c', fontWeight: 400 }}>
                    <HomeOutlined /> Hiển thị ở: Trang chủ (Section 5)
                  </div>
                </div>
              }
              extra={
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                  Thêm chuyên khoa
                </Button>
              }
            >
              <Table
                className="admin-cms-table"
                columns={specialtiesColumns}
                dataSource={specialties}
                rowKey="id"
                loading={loading}
              />
            </Card>
          )}

          {/* Statistics Section */}
          {currentTab === 'statistics' && (
            <Card 
              className="admin-cms-card"
              title={
                <div>
                  <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>KHAMNOW trong số liệu</div>
                  <div style={{ fontSize: 12, color: '#8c8c8c', fontWeight: 400 }}>
                    <HomeOutlined /> Hiển thị ở: Trang chủ (Section 6)
                  </div>
                </div>
              }
              extra={
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                  Thêm thống kê
                </Button>
              }
            >
              <Table
                className="admin-cms-table"
                columns={statisticsColumns}
                dataSource={statistics}
                rowKey="id"
                loading={loading}
              />
            </Card>
          )}

          {/* Certifications Section */}
          {currentTab === 'certifications' && (
            <Card 
              className="admin-cms-card"
              title={
                <div>
                  <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Chứng chỉ và cơ sở vật chất</div>
                  <div style={{ fontSize: 12, color: '#8c8c8c', fontWeight: 400 }}>
                    <HomeOutlined /> Hiển thị ở: Trang chủ (Section 7)
                  </div>
                </div>
              }
              extra={
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                  Thêm chứng nhận
                </Button>
              }
            >
              <Table
                className="admin-cms-table"
                columns={certificationsColumns}
                dataSource={certifications}
                rowKey="id"
                loading={loading}
              />
            </Card>
          )}

          {/* Testimonials Section */}
          {currentTab === 'testimonials' && (
            <Card 
              className="admin-cms-card"
              title={
                <div>
                  <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Khách hàng nói gì về chúng tôi</div>
                  <div style={{ fontSize: 12, color: '#8c8c8c', fontWeight: 400 }}>
                    <HomeOutlined /> Hiển thị ở: Trang chủ (Section 8)
                  </div>
                </div>
              }
              extra={
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                  Thêm đánh giá
                </Button>
              }
            >
              <Table
                className="admin-cms-table"
                columns={testimonialsColumns}
                dataSource={testimonials}
                rowKey="id"
                loading={loading}
              />
            </Card>
          )}

          {/* Doctor Articles Section */}
          {currentTab === 'doctor-articles' && (
            <Card 
              className="admin-cms-card"
              title={
                <div>
                  <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Bài viết bác sĩ</div>
                  <div style={{ fontSize: 12, color: '#8c8c8c', fontWeight: 400 }}>
                    <FileTextOutlined /> Quản lý và duyệt bài viết từ bác sĩ
                  </div>
                </div>
              }
            >
              <Table
                className="admin-cms-table"
                columns={doctorArticlesColumns}
                dataSource={doctorArticles}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
              />
            </Card>
          )}

          {/* News Banners Section */}
          {currentTab === 'news-banners' && (
            <Card 
              className="admin-cms-card"
              title={
                <div>
                  <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Banner Tin tức</div>
                  <div style={{ fontSize: 12, color: '#8c8c8c', fontWeight: 400 }}>
                    <FileTextOutlined /> Hiển thị ở: Trang tin tức (Đầu trang)
                  </div>
                </div>
              }
              extra={
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  onClick={handleAdd}
                >
                  Thêm banner
                </Button>
              }
            >
              <Table 
                className="admin-cms-table"
                columns={newsBannerColumns}
                dataSource={newsBanners} 
                rowKey="id"
                loading={loading}
              />
            </Card>
          )}

          {/* News Categories Section */}
          {currentTab === 'news-categories' && (
            <Card 
              className="admin-cms-card"
              title={
                <div>
                  <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Quản lý danh mục tin tức</div>
                  <div style={{ fontSize: 12, color: '#8c8c8c', fontWeight: 400 }}>
                    <TagOutlined /> Quản lý các danh mục cho tin tức và bài viết
                  </div>
                </div>
              }
              extra={
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  onClick={handleAdd}
                >
                  Thêm danh mục
                </Button>
              }
            >
              <Table 
                className="admin-cms-table"
                columns={newsCategoriesColumns} 
                dataSource={newsCategories} 
                rowKey="id"
                loading={loading}
              />
            </Card>
          )}

          {/* Membership Benefits Section */}
          {currentTab === 'membership-benefits' && (
            <Card 
              className="admin-cms-card"
              title={
                <div>
                  <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Ưu đãi thành viên</div>
                  <div style={{ fontSize: 12, color: '#8c8c8c', fontWeight: 400 }}>
                    <StarOutlined /> Quản lý section ưu đãi thành viên trên trang chủ
                  </div>
                </div>
              }
              extra={
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  onClick={handleAdd}
                >
                  Thêm ưu đãi
                </Button>
              }
            >
              <Table 
                className="admin-cms-table"
                columns={membershipBenefitsColumns} 
                dataSource={membershipBenefits} 
                rowKey="id"
                loading={loading}
              />
            </Card>
          )}

          {/* News Sections Tab */}
          {currentTab === 'news-sections' && (
            <Card 
              className="admin-cms-card"
              title={
                <div>
                  <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Quản lý Sections Tin tức</div>
                  <div style={{ fontSize: 12, color: '#8c8c8c', fontWeight: 400 }}>
                    <FileTextOutlined /> Tạo và quản lý các sections tin tức động
                  </div>
                </div>
              }
              extra={
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAdd}
                >
                  Thêm Section mới
                </Button>
              }
            >
              <Table
                className="admin-cms-table"
                dataSource={newsSections}
                rowKey="id"
                loading={loading}
                columns={[
                  {
                    title: 'Tên',
                    dataIndex: 'name',
                    key: 'name',
                    render: (text) => <Tag color="blue">{text}</Tag>
                  },
                  {
                    title: 'Tiêu đề',
                    dataIndex: 'title',
                    key: 'title',
                  },
                  {
                    title: 'Danh mục lọc',
                    dataIndex: 'categoryFilter',
                    key: 'categoryFilter',
                    width: 200,
                    render: (categoryFilter) => {
                      if (!categoryFilter) {
                        return <Tag color="default">Tất cả</Tag>;
                      }
                      try {
                        // Parse JSON array
                        const categories = JSON.parse(categoryFilter);
                        if (Array.isArray(categories) && categories.length > 0) {
                          return (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                              {categories.map((cat, idx) => (
                                <Tag key={idx} color="green">{cat}</Tag>
                              ))}
                            </div>
                          );
                        }
                        return <Tag color="default">Tất cả</Tag>;
                      } catch (e) {
                        // If not JSON, treat as single category
                        return <Tag color="green">{categoryFilter}</Tag>;
                      }
                    }
                  },
                  {
                    title: 'Trang',
                    dataIndex: 'page',
                    key: 'page',
                    width: 120,
                    render: (page) => {
                      const pageMap = {
                        'home': { text: 'Trang chủ', color: 'blue' },
                        'news': { text: 'Tin tức', color: 'green' },
                        'both': { text: 'Cả hai', color: 'purple' }
                      };
                      const p = pageMap[page] || { text: page || 'Cả hai', color: 'default' };
                      return <Tag color={p.color}>{p.text}</Tag>;
                    }
                  },
                  {
                    title: 'Thứ tự',
                    dataIndex: 'displayOrder',
                    key: 'displayOrder',
                    sorter: (a, b) => a.displayOrder - b.displayOrder,
                    width: 100
                  },
                  {
                    title: 'Màu nền',
                    dataIndex: 'backgroundColor',
                    key: 'backgroundColor',
                    width: 100,
                    render: (color) => (
                      <div style={{
                        width: 40,
                        height: 24,
                        backgroundColor: color,
                        border: '1px solid #d9d9d9',
                        borderRadius: 4
                      }} />
                    )
                  },
                  {
                    title: 'Trạng thái',
                    dataIndex: 'isActive',
                    key: 'isActive',
                    width: 100,
                    render: (isActive, record) => (
                      <Switch 
                        checked={isActive} 
                        onChange={() => handleToggleStatus(record.id, isActive, 'news-sections')}
                      />
                    )
                  },
                  {
                    title: 'Hành động',
                    key: 'actions',
                    width: 150,
                    render: (_, record) => (
                      <Space>
                        <Button
                          icon={<EditOutlined />}
                          onClick={() => handleEdit(record)}
                        />
                        <Popconfirm
                          title="Bạn có chắc muốn xóa?"
                          onConfirm={() => handleDelete(record.id, 'news-sections')}
                        >
                          <Button icon={<DeleteOutlined />} danger />
                        </Popconfirm>
                      </Space>
                    )
                  }
                ]}
              />
            </Card>
          )}

          {/* News Sidebar Widgets Tab */}
          {currentTab === 'news-sidebar-widgets' && (
            <Card 
              className="admin-cms-card"
              title={
                <div>
                  <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Quản lý Sidebar Tin tức</div>
                  <div style={{ fontSize: 12, color: '#8c8c8c', fontWeight: 400 }}>
                    <PictureOutlined /> Quản lý hotline, banner và widgets trên sidebar trang tin tức
                  </div>
                </div>
              }
              extra={
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAdd}
                >
                  Thêm Widget
                </Button>
              }
            >
              <Table
                className="admin-cms-table"
                dataSource={newsSidebarWidgets}
                rowKey="id"
                loading={loading}
                columns={[
                  {
                    title: 'Loại',
                    dataIndex: 'widgetType',
                    key: 'widgetType',
                    width: 120,
                    render: (type) => {
                      const typeMap = {
                        'hotline': { text: 'Hotline', color: 'blue' },
                        'banner': { text: 'Banner', color: 'green' }
                      };
                      const t = typeMap[type] || { text: type, color: 'default' };
                      return <Tag color={t.color}>{t.text}</Tag>;
                    }
                  },
                  {
                    title: 'Tiêu đề',
                    dataIndex: 'title',
                    key: 'title',
                  },
                  {
                    title: 'Hình ảnh',
                    dataIndex: 'imageUrl',
                    key: 'imageUrl',
                    width: 150,
                    render: (url) => url ? (
                      <img 
                        src={url} 
                        alt="widget" 
                        style={{ 
                          width: 100,
                          height: 60,
                          objectFit: 'cover',
                          borderRadius: 4
                        }} 
                      />
                    ) : <Tag color="default">Không có</Tag>
                  },
                  {
                    title: 'Thứ tự',
                    dataIndex: 'displayOrder',
                    key: 'displayOrder',
                    sorter: (a, b) => a.displayOrder - b.displayOrder,
                    width: 100
                  },
                  {
                    title: 'Trạng thái',
                    dataIndex: 'isActive',
                    key: 'isActive',
                    width: 100,
                    render: (isActive, record) => (
                      <Switch 
                        checked={isActive} 
                        onChange={() => handleToggleStatus(record.id, isActive, 'news-sidebar-widgets')}
                      />
                    )
                  },
                  {
                    title: 'Hành động',
                    key: 'actions',
                    width: 150,
                    render: (_, record) => (
                      <Space>
                        <Button
                          icon={<EditOutlined />}
                          onClick={() => handleEdit(record)}
                        />
                        <Popconfirm
                          title="Bạn có chắc muốn xóa?"
                          onConfirm={() => handleDelete(record.id, 'news-sidebar-widgets')}
                        >
                          <Button icon={<DeleteOutlined />} danger />
                        </Popconfirm>
                      </Space>
                    )
                  }
                ]}
              />
            </Card>
          )}

          {/* Article CTA Section Tab */}
          {currentTab === 'article-cta' && articleCtaSection && (
            <Card 
              className="admin-cms-card"
              title={
                <div>
                  <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Section cuối bài viết</div>
                  <div style={{ fontSize: 12, color: '#8c8c8c', fontWeight: 400 }}>
                    <FileTextOutlined /> Hiển thị ở cuối mỗi trang chi tiết bài viết
                  </div>
                </div>
              }
              extra={
                <Button 
                  type="primary" 
                  icon={<EditOutlined />}
                  onClick={() => {
                    setEditingItem(articleCtaSection);
                    setModalVisible(true);
                  }}
                >
                  Chỉnh sửa
                </Button>
              }
            >
              {/* Preview */}
              <div style={{ padding: 24, background: '#f5f5f5', borderRadius: 8 }}>
                <ArticleCtaSection data={articleCtaSection} />
              </div>
            </Card>
          )}

          {/* Site Settings Section */}
          {currentTab === 'site-settings' && (
            <Card 
              className="admin-cms-card"
              title={
                <div>
                  <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Cài đặt Website</div>
                  <div style={{ fontSize: 12, color: '#8c8c8c', fontWeight: 400 }}>
                    <SettingOutlined /> Thông tin chung của website
                  </div>
                </div>
              }
            >
              <Card className="admin-cms-card" title="Thông tin Header" style={{ marginBottom: 16 }}>
                <Form
                  layout="vertical"
                  initialValues={{
                    siteName: siteSettings.siteName,
                    siteTagline: siteSettings.siteTagline,
                    hotline: siteSettings.hotline,
                    email: siteSettings.email,
                    address: siteSettings.address
                  }}
                  key={JSON.stringify(siteSettings)}
                  onFinish={async (values) => {
                    try {
                      setLoading(true);
                      // Clean data - ensure all fields are strings, not null/undefined
                      const dataToSave = {
                        siteName: String(values.siteName || 'KHAMNOW'),
                        siteTagline: String(values.siteTagline || ''),
                        logoUrl: String(logoPreview || ''),
                        hotline: String(values.hotline || '19005656'),
                        email: String(values.email || ''),
                        address: String(values.address || ''),
                        statisticsBackgroundImage: String(statisticsBackgroundPreview || ''),
                        facebookUrl: '',
                        youtubeUrl: '',
                        zaloUrl: ''
                      };
                      console.log('Saving site settings:', JSON.stringify(dataToSave, null, 2));
                      const response = await cmsAPI.updateSiteSettings(dataToSave);
                      console.log('Response:', response.data);
                      message.success('Cập nhật thành công!');
                      // Reload page to update header
                      setTimeout(() => {
                        window.location.reload();
                      }, 500);
                    } catch (error) {
                      console.error('Error updating site settings:', error);
                      console.error('Error response:', error.response);
                      console.error('Error data:', error.response?.data);
                      message.error('Lỗi khi cập nhật. Vui lòng kiểm tra Console để biết chi tiết.');
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  <Form.Item
                    label="Tên Website"
                    name="siteName"
                    rules={[{ required: true, message: 'Vui lòng nhập tên website!' }]}
                  >
                    <Input placeholder="KHAMNOW" />
                  </Form.Item>

                  <Form.Item
                    label="Slogan"
                    name="siteTagline"
                  >
                    <Input placeholder="Chăm sóc sức khỏe" />
                  </Form.Item>

                  <Form.Item
                    label="Logo Website"
                  >
                    <Upload
                      showUploadList={false}
                      accept="image/*"
                      customRequest={async ({ file, onSuccess, onError }) => {
                        try {
                          setUploading(true);
                          const formData = new FormData();
                          formData.append('image', file);
                          const response = await axios.post(`${API_BASE_URL}/images/articles`, formData, {
                            headers: {
                              'Content-Type': 'multipart/form-data',
                              'Authorization': `Bearer ${localStorage.getItem('token')}`
                            }
                          });
                          // Response is an object with url field, not a string
                          const logoUrl = response.data.url || response.data.imageUrl || response.data;
                          console.log('Logo uploaded:', logoUrl);
                          setLogoPreview(logoUrl);
                          message.success('Upload logo thành công! Nhớ click "Lưu thay đổi" để áp dụng.');
                          onSuccess();
                        } catch (error) {
                          console.error('Upload error:', error);
                          message.error('Lỗi khi upload: ' + error.message);
                          onError(error);
                        } finally {
                          setUploading(false);
                        }
                      }}
                    >
                      <Button icon={<UploadOutlined />} loading={uploading}>
                        {logoPreview ? 'Thay đổi Logo' : 'Upload Logo'}
                      </Button>
                    </Upload>
                    <div style={{ marginTop: 8 }}>
                      {logoPreview ? (
                        <div>
                          <img 
                          key={logoPreview}
                          src={logoPreview} 
                          alt="Logo Preview" 
                          style={{ 
                            width: 80, 
                            height: 80, 
                            objectFit: 'cover', 
                            borderRadius: 8, 
                            border: '2px solid #1890ff',
                            display: 'block'
                          }} 
                        />
                        <div style={{ fontSize: 11, color: '#52c41a', marginTop: 4 }}>
                          ✓ Logo đã upload
                        </div>
                      </div>
                    ) : (
                      <div style={{ fontSize: 12, color: '#8c8c8c' }}>
                        Chưa có logo
                      </div>
                    )}
                  </div>
                  <div style={{ marginTop: 4, fontSize: 12, color: '#8c8c8c' }}>
                    Khuyến nghị: Ảnh vuông, kích thước tối thiểu 100x100px
                  </div>
                </Form.Item>

                <Form.Item
                  label="Hotline"
                  name="hotline"
                  rules={[{ required: true, message: 'Vui lòng nhập số hotline!' }]}
                >
                  <Input placeholder="19005656" />
                </Form.Item>

                <Form.Item
                  label="Email"
                  name="email"
                >
                  <Input placeholder="info@medlatec.vn" />
                </Form.Item>

                <Form.Item
                  label="Địa chỉ"
                  name="address"
                >
                  <TextArea rows={3} placeholder="Hà Nội, Việt Nam" />
                </Form.Item>

                <Form.Item
                  label="Ảnh nền Section Thống kê"
                >
                  <Upload
                    showUploadList={false}
                    accept="image/*"
                    customRequest={async ({ file, onSuccess, onError }) => {
                      try {
                        setUploading(true);
                        const formData = new FormData();
                        formData.append('image', file);
                        const response = await axios.post(`${API_BASE_URL}/images/articles`, formData, {
                          headers: {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                          }
                        });
                        const bgUrl = response.data.url || response.data.imageUrl || response.data;
                        console.log('Statistics background uploaded:', bgUrl);
                        setStatisticsBackgroundPreview(bgUrl);
                        message.success('Upload ảnh nền thành công! Nhớ click "Lưu thay đổi" để áp dụng.');
                        onSuccess();
                      } catch (error) {
                        console.error('Upload error:', error);
                        message.error('Lỗi khi upload: ' + error.message);
                        onError(error);
                      } finally {
                        setUploading(false);
                      }
                    }}
                  >
                    <Button icon={<UploadOutlined />} loading={uploading}>
                      {statisticsBackgroundPreview ? 'Thay đổi ảnh nền' : 'Upload ảnh nền'}
                    </Button>
                  </Upload>
                  <div style={{ marginTop: 8 }}>
                    {statisticsBackgroundPreview ? (
                      <div>
                        <img 
                          key={statisticsBackgroundPreview}
                          src={statisticsBackgroundPreview} 
                          alt="Statistics Background" 
                          style={{ 
                            width: '100%',
                            maxWidth: 600,
                            height: 200, 
                            objectFit: 'cover', 
                            borderRadius: 8, 
                            border: '2px solid #1890ff',
                            display: 'block'
                          }} 
                        />
                        <div style={{ fontSize: 11, color: '#52c41a', marginTop: 4 }}>
                          ✓ Ảnh nền đã upload
                        </div>
                      </div>
                    ) : (
                      <div style={{ fontSize: 12, color: '#8c8c8c' }}>
                        Chưa có ảnh nền
                      </div>
                    )}
                  </div>
                  <div style={{ marginTop: 4, fontSize: 12, color: '#8c8c8c' }}>
                    Ảnh nền cho section "KHAMNOW TRONG SỐ LIỆU"<br/>
                    Khuyến nghị: Ảnh ngang, kích thước 1920x600px
                  </div>
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    Lưu thay đổi
                  </Button>
                </Form.Item>
              </Form>
            </Card>
            </Card>
          )}

          {/* Service Categories Tab */}
          {currentTab === 'service-categories' && (
            <Card 
              className="admin-cms-card"
              title={
                <div>
                  <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Danh mục dịch vụ</div>
                  <div style={{ fontSize: 12, color: '#8c8c8c', fontWeight: 400 }}>
                    <TagOutlined /> Quản lý danh mục dịch vụ y tế
                  </div>
                </div>
              }
              extra={
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                  Thêm danh mục
                </Button>
              }
            >
              <Table
                className="admin-cms-table"
                columns={serviceCategoryColumns}
                dataSource={serviceCategories}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
              />
            </Card>
          )}

          {/* Medical Services Tab */}
          {currentTab === 'medical-services' && (
            <Card 
              className="admin-cms-card"
              title={
                <div>
                  <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Dịch vụ y tế</div>
                  <div style={{ fontSize: 12, color: '#8c8c8c', fontWeight: 400 }}>
                    <MedicineBoxOutlined /> Quản lý dịch vụ y tế
                  </div>
                </div>
              }
              extra={
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                  Thêm dịch vụ
                </Button>
              }
            >
              <Table
                className="admin-cms-table"
                columns={medicalServiceColumns}
                dataSource={medicalServices}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
                scroll={{ x: 1200 }}
              />
            </Card>
          )}

          {/* Bank Account Tab */}
          {currentTab === 'bank-account' && (
            <Card 
              className="admin-cms-card"
              title={
                <div>
                  <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Thông tin ngân hàng</div>
                  <div style={{ fontSize: 12, color: '#8c8c8c', fontWeight: 400 }}>
                    <SettingOutlined /> Cấu hình thông tin ngân hàng cho thanh toán QR
                  </div>
                </div>
              }
            >
              <Form
                layout="vertical"
                initialValues={siteSettings}
                onFinish={async (values) => {
                  try {
                    await cmsAPI.updateSiteSettings({ ...siteSettings, ...values });
                    message.success('Cập nhật thành công!');
                    fetchAllData();
                  } catch (error) {
                    message.error('Lỗi khi cập nhật: ' + error.message);
                  }
                }}
              >
                <Form.Item label="Mã ngân hàng" name="bankId">
                  <Input placeholder="VD: MB, VCB, TCB" />
                </Form.Item>
                <Form.Item label="Tên ngân hàng" name="bankName">
                  <Input placeholder="VD: Ngân hàng Quân đội MB" />
                </Form.Item>
                <Form.Item label="Số tài khoản" name="bankAccountNo">
                  <Input placeholder="Nhập số tài khoản" />
                </Form.Item>
                <Form.Item label="Tên chủ tài khoản" name="bankAccountName">
                  <Input placeholder="Nhập tên chủ tài khoản" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Lưu thông tin
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          )}

          {/* Footer Settings Tab */}
          {currentTab === 'footer-settings' && (
            <Card 
              className="admin-cms-card"
              title={
                <div>
                  <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Cài đặt Footer</div>
                  <div style={{ fontSize: 12, color: '#8c8c8c', fontWeight: 400 }}>
                    <SettingOutlined /> Cấu hình nội dung footer
                  </div>
                </div>
              }
            >
              <Form
                layout="vertical"
                initialValues={siteSettings}
                onFinish={async (values) => {
                  try {
                    await cmsAPI.updateSiteSettings({ ...siteSettings, ...values });
                    message.success('Cập nhật thành công!');
                    fetchAllData();
                  } catch (error) {
                    message.error('Lỗi khi cập nhật: ' + error.message);
                  }
                }}
              >
                <Form.Item label="Giới thiệu Footer" name="footerAboutText">
                  <TextArea rows={4} placeholder="Nhập nội dung giới thiệu" />
                </Form.Item>
                <Form.Item label="Giờ làm việc" name="footerWorkingHours">
                  <TextArea rows={3} placeholder="VD: Thứ 2 - Thứ 7: 7:00 - 20:00" />
                </Form.Item>
                <Form.Item label="Facebook URL" name="footerFacebookUrl">
                  <Input placeholder="https://facebook.com/..." />
                </Form.Item>
                <Form.Item label="YouTube URL" name="footerYoutubeUrl">
                  <Input placeholder="https://youtube.com/..." />
                </Form.Item>
                <Form.Item label="Zalo URL" name="footerZaloUrl">
                  <Input placeholder="https://zalo.me/..." />
                </Form.Item>
                <Form.Item label="Copyright Text" name="footerCopyrightText">
                  <Input placeholder="© 2024 KHAMNOW. All rights reserved." />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Lưu cài đặt
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          )}

          {/* About Page Section */}
          {currentTab === 'about-page' && (
            <Card 
              className="admin-cms-card"
              title={
                <div>
                  <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Trang giới thiệu</div>
                  <div style={{ fontSize: 12, color: '#8c8c8c', fontWeight: 400 }}>
                    <InfoCircleOutlined /> Quản lý nội dung trang giới thiệu
                  </div>
                </div>
              }
            >
              <Tabs activeKey={aboutSubTab} onChange={setAboutSubTab}>
                <TabPane tab="Hero Section" key="hero">
                  {renderAboutHeroForm()}
                </TabPane>
                <TabPane tab="Mission & Vision" key="mission">
                  {renderAboutMissionForm()}
                </TabPane>
                <TabPane tab="Core Values" key="values">
                  {renderAboutValuesTable()}
                </TabPane>
                <TabPane tab="Achievements" key="achievements">
                  {renderAboutAchievementsTable()}
                </TabPane>
                <TabPane tab="Timeline" key="timeline">
                  {renderAboutTimelineTable()}
                </TabPane>
                <TabPane tab="Team" key="team">
                  {renderAboutTeamTable()}
                </TabPane>
              </Tabs>
            </Card>
          )}
        </Content>
      </Layout>

      {/* Modal for Add/Edit */}
      <Modal
        title={editingItem ? 'Chỉnh sửa' : 'Thêm mới'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ isActive: true, displayOrder: 0, rating: 5 }}
        >
          {renderForm()}
        </Form>
      </Modal>

      {/* Article Detail Modal */}
      <Modal
        title="Chi tiết bài viết"
        open={articleDetailVisible}
        onCancel={() => {
          setArticleDetailVisible(false);
          setSelectedArticle(null);
        }}
        footer={[
          <Button key="close" onClick={() => {
            setArticleDetailVisible(false);
            setSelectedArticle(null);
          }}>
            Đóng
          </Button>,
          selectedArticle?.status === 'PENDING' && (
            <Button 
              key="approve" 
              type="primary" 
              icon={<CheckOutlined />}
              onClick={() => {
                handleApprove(selectedArticle.id);
                setArticleDetailVisible(false);
                setSelectedArticle(null);
              }}
            >
              Duyệt bài viết
            </Button>
          ),
          selectedArticle?.status === 'PENDING' && (
            <Button 
              key="reject" 
              danger
              icon={<CloseOutlined />}
              onClick={() => {
                handleReject(selectedArticle.id);
                setArticleDetailVisible(false);
                setSelectedArticle(null);
              }}
            >
              Từ chối
            </Button>
          )
        ]}
        width={900}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: '75vh', overflowY: 'auto', overflowX: 'hidden' }}
      >
        {selectedArticle && (
          <div>
            {/* Status Badge */}
            <div style={{ marginBottom: 16 }}>
              <strong>Trạng thái: </strong>
              {selectedArticle.status === 'PENDING' && <Tag color="orange">Chờ duyệt</Tag>}
              {selectedArticle.status === 'APPROVED' && <Tag color="green">Đã duyệt</Tag>}
              {selectedArticle.status === 'REJECTED' && <Tag color="red">Từ chối</Tag>}
            </div>

            {/* Featured Image */}
            {selectedArticle.imageUrl && (
              <div style={{ marginBottom: 16 }}>
                <img 
                  src={selectedArticle.imageUrl} 
                  alt={selectedArticle.title}
                  style={{ 
                    width: '100%', 
                    maxHeight: 300, 
                    objectFit: 'cover',
                    borderRadius: 8,
                    border: '1px solid #d9d9d9'
                  }}
                />
              </div>
            )}

            {/* Title */}
            <h2 style={{ marginBottom: 8, fontSize: 24, fontWeight: 600 }}>
              {selectedArticle.title}
            </h2>

            {/* Meta Information */}
            <div style={{ 
              marginBottom: 16, 
              padding: 12, 
              background: '#f5f5f5', 
              borderRadius: 8,
              fontSize: 14
            }}>
              <div style={{ marginBottom: 4 }}>
                <strong>Tác giả:</strong> {selectedArticle.author}
              </div>
              {selectedArticle.doctor && (
                <div style={{ marginBottom: 4 }}>
                  <strong>Bác sĩ:</strong> Dr. {selectedArticle.doctor.user?.firstName} {selectedArticle.doctor.user?.lastName}
                  {selectedArticle.doctor.specialty && ` - ${selectedArticle.doctor.specialty}`}
                </div>
              )}
              <div style={{ marginBottom: 4 }}>
                <strong>Ngày tạo:</strong> {new Date(selectedArticle.createdAt).toLocaleString('vi-VN')}
              </div>
              <div style={{ marginBottom: 4 }}>
                <strong>Ngày xuất bản:</strong> {new Date(selectedArticle.publishedAt).toLocaleString('vi-VN')}
              </div>
              {selectedArticle.slug && (
                <div>
                  <strong>Slug:</strong> {selectedArticle.slug}
                </div>
              )}
            </div>

            {/* Excerpt */}
            {selectedArticle.excerpt && (
              <div style={{ 
                marginBottom: 16, 
                padding: 12, 
                background: '#e6f7ff', 
                borderLeft: '4px solid #1890ff',
                borderRadius: 4
              }}>
                <strong>Tóm tắt:</strong>
                <p style={{ marginTop: 8, marginBottom: 0 }}>{selectedArticle.excerpt}</p>
              </div>
            )}

            {/* Content */}
            <div style={{ marginTop: 16 }}>
              <strong style={{ fontSize: 16, display: 'block', marginBottom: 12 }}>Nội dung:</strong>
              <div 
                className="article-detail-content"
                style={{ 
                  padding: 16, 
                  background: '#fff',
                  border: '1px solid #d9d9d9',
                  borderRadius: 8,
                  lineHeight: 1.8,
                  overflow: 'hidden',
                  maxWidth: '100%'
                }}
                dangerouslySetInnerHTML={{ __html: selectedArticle.content || 'Không có nội dung' }}
              />
            </div>

            {/* Additional Info */}
            <div style={{ 
              marginTop: 16, 
              padding: 12, 
              background: '#fafafa', 
              borderRadius: 8,
              fontSize: 13
            }}>
              <div style={{ marginBottom: 4 }}>
                <strong>Nổi bật:</strong> {selectedArticle.isFeatured ? 'Có' : 'Không'}
              </div>
              <div style={{ marginBottom: 4 }}>
                <strong>Kích hoạt:</strong> {selectedArticle.isActive ? 'Có' : 'Không'}
              </div>
              <div>
                <strong>Thứ tự hiển thị:</strong> {selectedArticle.displayOrder || 0}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </Layout>

    {/* Mobile Menu Drawer */}
    <Drawer
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40,
            height: 40,
            background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <SettingOutlined style={{ fontSize: 20, color: 'white' }} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: '#1890ff' }}>Quản lý CMS</div>
            <div style={{ fontSize: 11, color: '#8c8c8c', textTransform: 'uppercase', letterSpacing: 1 }}>
              Content Management
            </div>
          </div>
        </div>
      }
      placement="left"
      onClose={() => setMobileMenuVisible(false)}
      open={mobileMenuVisible}
      width={280}
      closeIcon={<CloseOutlined style={{ fontSize: 18 }} />}
      styles={{
        header: {
          borderBottom: '1px solid #f0f0f0',
          padding: '20px 24px'
        },
        body: {
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }
      }}
    >
      {/* User Info */}
      <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid #f0f0f0',
        background: '#f8fafb'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar
            size={48}
            src={userAvatar}
            icon={<UserOutlined />}
            style={{ background: '#1890ff' }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: '#1e293b' }}>
              {localStorage.getItem('userFirstName') || 'Admin'}
            </div>
            <div style={{ fontSize: 12, color: '#64748b' }}>
              Quản trị viên CMS
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 120 }}>
        <Menu
          mode="inline"
          selectedKeys={[currentTab]}
          onClick={({ key }) => {
            setCurrentTab(key);
            setMobileMenuVisible(false);
          }}
          style={{ 
            border: 'none',
            paddingTop: 8
          }}
        >
        <Menu.ItemGroup 
          key="homepage-group" 
          title={
            <span style={{ 
              fontSize: 12, 
              fontWeight: 700, 
              color: '#8c8c8c',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              <HomeOutlined /> Trang chủ
            </span>
          }
        >
          <Menu.Item key="banners" icon={<PictureOutlined />}>
            Banner Slider
          </Menu.Item>
          <Menu.Item key="services" icon={<CustomerServiceOutlined />}>
            Tiện ích khách hàng
          </Menu.Item>
          <Menu.Item key="features" icon={<StarOutlined />}>
            Tại sao chọn chúng tôi
          </Menu.Item>
          <Menu.Item key="specialties" icon={<MedicineBoxOutlined />}>
            Các chuyên khoa
          </Menu.Item>
          <Menu.Item key="statistics" icon={<BarChartOutlined />}>
            Số liệu thống kê
          </Menu.Item>
          <Menu.Item key="certifications" icon={<TrophyOutlined />}>
            Chứng chỉ và cơ sở vật chất
          </Menu.Item>
          <Menu.Item key="testimonials" icon={<CommentOutlined />}>
            Đánh giá khách hàng
          </Menu.Item>
          <Menu.Item key="membership-benefits" icon={<StarOutlined />}>
            Ưu đãi thành viên
          </Menu.Item>
        </Menu.ItemGroup>

        <Menu.ItemGroup 
          key="news-group" 
          title={
            <span style={{ 
              fontSize: 12, 
              fontWeight: 700, 
              color: '#8c8c8c',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              <FileTextOutlined /> Tin tức
            </span>
          }
        >
          <Menu.Item key="news-banners" icon={<PictureOutlined />}>
            Banner tin tức
          </Menu.Item>
          <Menu.Item key="doctor-articles" icon={<FileTextOutlined />}>
            Bài viết bác sĩ
          </Menu.Item>
          <Menu.Item key="news-categories" icon={<TagOutlined />}>
            Danh mục tin tức
          </Menu.Item>
          <Menu.Item key="news-sections" icon={<FileTextOutlined />}>
            Sections Tin tức
          </Menu.Item>
          <Menu.Item key="news-sidebar-widgets" icon={<PictureOutlined />}>
            Sidebar Tin tức
          </Menu.Item>
        </Menu.ItemGroup>

        <Menu.ItemGroup 
          key="article-detail-group" 
          title={
            <span style={{ 
              fontSize: 12, 
              fontWeight: 700, 
              color: '#8c8c8c',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              <FileTextOutlined /> Chi tiết bài viết
            </span>
          }
        >
          <Menu.Item key="article-cta" icon={<AppstoreOutlined />}>
            Section cuối bài viết
          </Menu.Item>
        </Menu.ItemGroup>

        <Menu.ItemGroup 
          key="about-group" 
          title={
            <span style={{ 
              fontSize: 12, 
              fontWeight: 700, 
              color: '#8c8c8c',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              <InfoCircleOutlined /> Trang giới thiệu
            </span>
          }
        >
          <Menu.Item key="about-page" icon={<InfoCircleOutlined />}>
            Trang giới thiệu
          </Menu.Item>
        </Menu.ItemGroup>

        <Menu.ItemGroup 
          key="services-group" 
          title={
            <span style={{ 
              fontSize: 12, 
              fontWeight: 700, 
              color: '#8c8c8c',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              <MedicineBoxOutlined /> Dịch vụ
            </span>
          }
        >
          <Menu.Item key="service-categories" icon={<TagOutlined />}>
            Danh mục dịch vụ
          </Menu.Item>
          <Menu.Item key="medical-services" icon={<MedicineBoxOutlined />}>
            Dịch vụ y tế
          </Menu.Item>
        </Menu.ItemGroup>

        <Menu.ItemGroup 
          key="settings-group" 
          title={
            <span style={{ 
              fontSize: 12, 
              fontWeight: 700, 
              color: '#8c8c8c',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              <SettingOutlined /> Cài đặt
            </span>
          }
        >
          <Menu.Item key="bank-account" icon={<SettingOutlined />}>
            Thông tin ngân hàng
          </Menu.Item>
          <Menu.Item key="footer-settings" icon={<SettingOutlined />}>
            Footer
          </Menu.Item>
          <Menu.Item key="site-settings" icon={<SettingOutlined />}>
            Thông tin Website
          </Menu.Item>
        </Menu.ItemGroup>
      </Menu>
      </div>

      {/* Footer Actions */}
      <div style={{
        borderTop: '1px solid #f0f0f0',
        background: '#fff',
        padding: '16px 24px'
      }}>
        <Button
          type="primary"
          icon={<HomeOutlined />}
          block
          onClick={() => window.location.href = '/admin'}
          style={{ marginBottom: 8 }}
        >
          Về Dashboard
        </Button>
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 11, color: '#8c8c8c', marginBottom: 4 }}>Đường dây nóng</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <HomeOutlined style={{ color: '#1890ff', fontSize: 16 }} />
            <span style={{ fontWeight: 600, fontSize: 15, color: '#1e293b' }}>19005656</span>
          </div>
        </div>
      </div>
    </Drawer>
    </ConfigProvider>
  );
}

export default AdminCMSPage;