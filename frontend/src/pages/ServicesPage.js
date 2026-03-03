import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Breadcrumb, Spin, Tag, Button } from 'antd';
import { HomeOutlined, ShoppingCartOutlined } from '@ant-design/icons';
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
      {/* Breadcrumb */}
      <div style={{ background: '#f5f5f5', padding: '16px 24px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/"><HomeOutlined /> Trang chủ</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Dịch vụ y tế</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 24px' }}>
        <Row gutter={24}>
          {/* Sidebar - Categories */}
          <Col xs={24} lg={6}>
            <Card 
              title={
                <div style={{ fontSize: 16, fontWeight: 600 }}>
                  DANH MỤC DỊCH VỤ
                </div>
              }
              className="services-sidebar"
              style={{ marginBottom: 24 }}
            >
              <div className="category-list">
                {categoryList.map(cat => (
                  <div
                    key={cat.key}
                    className={`category-item ${selectedCategory === cat.key ? 'active' : ''}`}
                    onClick={() => handleCategoryChange(cat.key)}
                    style={{
                      padding: '12px 16px',
                      cursor: 'pointer',
                      borderLeft: selectedCategory === cat.key ? '3px solid #1890ff' : '3px solid transparent',
                      background: selectedCategory === cat.key ? '#e6f7ff' : 'transparent',
                      marginBottom: 8,
                      borderRadius: 4,
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span style={{ 
                      fontWeight: selectedCategory === cat.key ? 600 : 400,
                      color: selectedCategory === cat.key ? '#1890ff' : '#262626'
                    }}>
                      {cat.name}
                    </span>
                    <span style={{ 
                      fontSize: 12, 
                      color: '#8c8c8c',
                      background: '#f5f5f5',
                      padding: '2px 8px',
                      borderRadius: 10
                    }}>
                      ({cat.count})
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Sidebar with only hotline widget from CMS */}
            <NewsSidebar onlyHotline={true} />
          </Col>

          {/* Services Grid */}
          <Col xs={24} lg={18}>
            {/* Header */}
            <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Title level={3} style={{ margin: 0 }}>Dịch vụ y tế</Title>
                <Text type="secondary">Hiển thị {displayStart}-{displayEnd} của {totalItems} kết quả</Text>
              </div>
              <select 
                style={{ 
                  padding: '8px 16px', 
                  borderRadius: 4, 
                  border: '1px solid #d9d9d9',
                  fontSize: 14
                }}
              >
                <option>Sắp xếp theo mới nhất</option>
                <option>Giá: Thấp đến cao</option>
                <option>Giá: Cao đến thấp</option>
                <option>Tên: A-Z</option>
              </select>
            </div>

            {/* Services Grid */}
            <Row gutter={[24, 24]}>
              {currentServices.map((service, index) => (
                <Col xs={24} sm={12} lg={8} key={service.id || index}>
                  <Card
                    hoverable
                    className="service-card"
                    style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                    bodyStyle={{ 
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      flex: 1
                    }}
                    cover={
                      <div style={{ 
                        position: 'relative', 
                        height: 250,
                        background: service.imageUrl ? 'transparent' : (service.color || '#f0f0f0'),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden'
                      }}>
                        {/* Discount Badge */}
                        {service.discountPercentage > 0 && (
                          <div style={{
                            position: 'absolute',
                            top: 12,
                            left: 12,
                            background: '#1890ff',
                            color: '#fff',
                            padding: '6px 10px',
                            borderRadius: '50%',
                            fontWeight: 700,
                            fontSize: 12,
                            zIndex: 2,
                            width: 50,
                            height: 50,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                          }}>
                            -{service.discountPercentage}%
                          </div>
                        )}
                        
                        {service.imageUrl ? (
                          <img 
                            src={service.imageUrl} 
                            alt={service.title}
                            style={{ 
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                        ) : (
                          <div style={{ 
                            fontSize: 80, 
                            opacity: 0.3,
                            color: '#fff'
                          }}>
                            🏥
                          </div>
                        )}
                      </div>
                    }
                  >
                    <Title level={5} style={{ 
                      marginBottom: 8,
                      fontSize: 16,
                      minHeight: 48,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {service.title}
                    </Title>

                    {/* Price */}
                    <div style={{ marginBottom: 16, flex: 1 }}>
                      {service.discountPercentage > 0 ? (
                        <>
                          <Text delete style={{ color: '#8c8c8c', fontSize: 13, marginRight: 8 }}>
                            {service.originalPrice?.toLocaleString('vi-VN')} ₫
                          </Text>
                          <Text strong style={{ color: '#f5222d', fontSize: 18 }}>
                            {service.discountedPrice?.toLocaleString('vi-VN')} ₫
                          </Text>
                        </>
                      ) : (
                        <Text strong style={{ color: '#1890ff', fontSize: 18 }}>
                          {(service.originalPrice || service.discountedPrice)?.toLocaleString('vi-VN')} ₫
                        </Text>
                      )}
                    </div>

                    <Button 
                      type="primary" 
                      block
                      icon={<ShoppingCartOutlined />}
                      onClick={() => navigate(`/services/${service.slug}`)}
                      style={{ 
                        background: service.color || '#1890ff',
                        border: 'none',
                        borderRadius: 6,
                        height: 40,
                        fontWeight: 600,
                        marginTop: 'auto'
                      }}
                    >
                      ĐẶT NGAY
                    </Button>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ 
                marginTop: 48, 
                textAlign: 'center',
                padding: '24px 0',
                borderTop: '1px solid #f0f0f0'
              }}>
                <Button.Group>
                  <Button 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    « Trước
                  </Button>
                  {[...Array(totalPages)].map((_, index) => (
                    <Button 
                      key={index + 1}
                      type={currentPage === index + 1 ? 'primary' : 'default'}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </Button>
                  ))}
                  <Button 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Sau »
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
