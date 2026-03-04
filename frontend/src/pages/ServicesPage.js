import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Breadcrumb, Spin, Tag, Button, Empty } from 'antd';
import { HomeOutlined, ShoppingCartOutlined, ClockCircleOutlined, SafetyOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import cmsAPI from '../services/cmsApi';
import NewsSidebar from '../components/NewsSidebar';
import '../styles/services.css';

const { Title, Text, Paragraph } = Typography;

function ServicesPage() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [allServices, setAllServices] = useState([]); // Store all services for counting
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12); // 12 items per page

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [servicesRes, categoriesRes] = await Promise.all([
        cmsAPI.getMedicalServices(),
        cmsAPI.getServiceCategories()
      ]);
      setServices(servicesRes.data || []);
      setAllServices(servicesRes.data || []); // Store all services
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryKey) => {
    setSelectedCategory(categoryKey);
    setCurrentPage(1); // Reset to page 1 when changing category
    
    // Filter from allServices instead of fetching from server
    if (categoryKey === 'all') {
      setServices(allServices);
    } else {
      const category = categories.find(c => c.slug === categoryKey);
      if (category) {
        const filtered = allServices.filter(s => s.categoryId === category.id);
        setServices(filtered);
      }
    }
  };

  // Calculate pagination
  const totalItems = services.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentServices = services.slice(startIndex, endIndex);
  const displayStart = totalItems > 0 ? startIndex + 1 : 0;
  const displayEnd = Math.min(endIndex, totalItems);

  // Build category list with counts using allServices
  const categoryList = [
    { key: 'all', name: 'Tất cả dịch vụ', count: allServices.length },
    ...categories.map(cat => ({
      key: cat.slug,
      name: cat.name,
      count: allServices.filter(s => s.categoryId === cat.id).length
    }))
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="services-page">
      {/* Hero Section */}
      <div className="services-hero">
        <div className="services-hero-content">
          <Title level={1} style={{ color: '#fff', marginBottom: 16, fontSize: 42 }}>
            Dịch Vụ Y Tế Chuyên Nghiệp
          </Title>
          <Paragraph style={{ color: '#fff', fontSize: 18, maxWidth: 600, margin: '0 auto' }}>
            Cung cấp các gói khám sức khỏe toàn diện với đội ngũ bác sĩ giàu kinh nghiệm và trang thiết bị hiện đại
          </Paragraph>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="services-breadcrumb">
        <div className="container">
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/"><HomeOutlined /> Trang chủ</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Dịch vụ y tế</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>

      {/* Main Content */}
      <div className="container services-container">
        <Row gutter={[24, 24]}>
          {/* Sidebar - Categories */}
          <Col xs={24} lg={6}>
            <div className="services-sidebar-wrapper">
              <Card 
                className="services-category-card"
                bordered={false}
              >
                <div className="category-header">
                  <Title level={4} style={{ margin: 0, color: '#003a70' }}>
                    Danh Mục Dịch Vụ
                  </Title>
                </div>
                <div className="category-list">
                  {categoryList.map(cat => (
                    <div
                      key={cat.key}
                      className={`category-item ${selectedCategory === cat.key ? 'active' : ''}`}
                      onClick={() => handleCategoryChange(cat.key)}
                    >
                      <span className="category-name">{cat.name}</span>
                      <span className="category-count">{cat.count}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Sidebar with only hotline widget from CMS */}
              <NewsSidebar onlyHotline={true} />
            </div>
          </Col>

          {/* Services Grid */}
          <Col xs={24} lg={18}>
            {/* Header */}
            <div className="services-header">
              <div className="services-header-info">
                <Title level={3} style={{ margin: 0, color: '#003a70' }}>
                  {selectedCategory === 'all' 
                    ? 'Tất Cả Dịch Vụ' 
                    : categoryList.find(c => c.key === selectedCategory)?.name || 'Dịch Vụ'}
                </Title>
                <Text type="secondary" style={{ fontSize: 15 }}>
                  Hiển thị {displayStart}-{displayEnd} trong tổng số {totalItems} dịch vụ
                </Text>
              </div>
            </div>

            {/* Services Grid */}
            {currentServices.length > 0 ? (
              <Row gutter={[24, 24]}>
                {currentServices.map((service, index) => (
                  <Col xs={24} sm={12} lg={8} key={service.id || index}>
                    <Card
                      hoverable
                      className="service-card-professional"
                      bordered={false}
                      cover={
                        <div className="service-card-cover">
                          {/* Discount Badge */}
                          {service.discountPercentage > 0 && (
                            <div className="discount-badge">
                              <span className="discount-text">-{service.discountPercentage}%</span>
                            </div>
                          )}
                          
                          {service.imageUrl ? (
                            <img 
                              src={service.imageUrl} 
                              alt={service.title}
                              className="service-image"
                            />
                          ) : (
                            <div className="service-placeholder" style={{ background: service.color || '#e8f4f8' }}>
                              <SafetyOutlined style={{ fontSize: 60, color: '#003a70', opacity: 0.3 }} />
                            </div>
                          )}
                          
                          <div className="service-overlay">
                            <Button 
                              type="primary" 
                              size="large"
                              icon={<ShoppingCartOutlined />}
                              onClick={() => navigate(`/services/${service.slug}`)}
                              className="service-quick-view"
                            >
                              Xem Chi Tiết
                            </Button>
                          </div>
                        </div>
                      }
                    >
                      <div className="service-card-body">
                        <Title level={5} className="service-title">
                          {service.title}
                        </Title>

                        {/* Price */}
                        <div className="service-price-section">
                          {service.discountPercentage > 0 ? (
                            <div className="price-with-discount">
                              <Text delete className="original-price">
                                {service.originalPrice?.toLocaleString('vi-VN')}₫
                              </Text>
                              <Text strong className="discounted-price">
                                {service.discountedPrice?.toLocaleString('vi-VN')}₫
                              </Text>
                            </div>
                          ) : (
                            <Text strong className="regular-price">
                              {(service.originalPrice || service.discountedPrice)?.toLocaleString('vi-VN')}₫
                            </Text>
                          )}
                        </div>

                        <Button 
                          type="primary" 
                          block
                          size="large"
                          icon={<ShoppingCartOutlined />}
                          onClick={() => navigate(`/services/${service.slug}`)}
                          className="service-book-btn"
                          style={{
                            background: '#003a70',
                            borderColor: '#003a70'
                          }}
                        >
                          Đặt Lịch Ngay
                        </Button>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <Empty 
                description="Không tìm thấy dịch vụ nào"
                style={{ padding: '60px 0' }}
              />
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="services-pagination">
                <Button.Group size="large">
                  <Button 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    ‹ Trước
                  </Button>
                  {[...Array(totalPages)].map((_, index) => {
                    // Show first, last, current, and adjacent pages
                    if (
                      index === 0 || 
                      index === totalPages - 1 || 
                      (index >= currentPage - 2 && index <= currentPage)
                    ) {
                      return (
                        <Button 
                          key={index + 1}
                          type={currentPage === index + 1 ? 'primary' : 'default'}
                          onClick={() => setCurrentPage(index + 1)}
                        >
                          {index + 1}
                        </Button>
                      );
                    } else if (index === currentPage - 3 || index === currentPage + 1) {
                      return <Button key={index + 1} disabled>...</Button>;
                    }
                    return null;
                  })}
                  <Button 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Sau ›
                  </Button>
                </Button.Group>
              </div>
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default ServicesPage;
