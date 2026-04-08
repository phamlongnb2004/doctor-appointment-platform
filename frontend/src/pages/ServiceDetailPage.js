import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Row, Col, Button, Breadcrumb, Spin, Tag, InputNumber, message, Card } from 'antd';
import { HomeOutlined, ShoppingCartOutlined, PhoneOutlined, CheckOutlined } from '@ant-design/icons';
import cmsAPI from '../services/cmsApi';
import { useCart } from '../contexts/CartContext';
import '../styles/service-detail.css';

const { Meta } = Card;

function ServiceDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [service, setService] = useState(null);
  const [category, setCategory] = useState(null);
  const [relatedServices, setRelatedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchServiceDetail();
  }, [slug]);

  useEffect(() => {
    if (service) {
      // Parse images array
      let imagesList = [];
      if (service.images) {
        try {
          imagesList = JSON.parse(service.images);
        } catch (e) {
          imagesList = service.imageUrl ? [service.imageUrl] : [];
        }
      } else if (service.imageUrl) {
        imagesList = [service.imageUrl];
      }
      setImages(imagesList);
      setSelectedImage(0);
    }
  }, [service]);

  const fetchServiceDetail = async () => {
    try {
      setLoading(true);
      const response = await cmsAPI.getMedicalServiceBySlug(slug);
      const serviceData = response.data;
      setService(serviceData);

      // Fetch category
      if (serviceData.categoryId) {
        const [categoryRes, relatedRes] = await Promise.all([
          cmsAPI.getServiceCategories(),
          cmsAPI.getMedicalServicesByCategory(serviceData.categoryId)
        ]);
        
        const cat = categoryRes.data.find(c => c.id === serviceData.categoryId);
        setCategory(cat);
        
        // Filter out current service from related
        setRelatedServices(relatedRes.data.filter(s => s.id !== serviceData.id).slice(0, 4));
      }
    } catch (error) {
      console.error('Error fetching service:', error);
      message.error('Không tìm thấy dịch vụ');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      await addToCart(service.id, quantity);
      // Success message is shown by CartContext
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    try {
      await addToCart(service.id, quantity);
      navigate('/cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!service) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h2>Không tìm thấy dịch vụ</h2>
        <Button type="primary" onClick={() => navigate('/services')}>
          Quay lại danh sách dịch vụ
        </Button>
      </div>
    );
  }

  const hasDiscount = service.discountPercentage > 0;

  return (
    <div className="service-detail-page">
      {/* Breadcrumb */}
      <div style={{ background: '#f5f5f5', padding: '16px 24px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <Breadcrumb
            items={[
              {
                title: <Link to="/"><HomeOutlined /> Trang chủ</Link>
              },
              {
                title: <Link to="/services">Dịch vụ y tế</Link>
              },
              ...(category ? [{
                title: category.name
              }] : []),
              {
                title: service.title
              }
            ]}
          />
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 24px' }}>
        <Row gutter={32}>
          {/* Left - Product Images */}
          <Col xs={24} lg={10}>
            <div className="service-image-container">
              {hasDiscount && (
                <div className="discount-badge">
                  -{service.discountPercentage}%
                </div>
              )}
              {/* Main Image */}
              <img 
                src={images[selectedImage] || 'https://via.placeholder.com/500x500?text=Dịch+vụ'} 
                alt={service.title}
                style={{ 
                  width: '100%', 
                  borderRadius: 8,
                  border: '1px solid #e8e8e8'
                }}
              />
            </div>

            {/* Thumbnail images */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
                {images.map((img, index) => (
                  <div 
                    key={index}
                    style={{
                      width: 80,
                      height: 80,
                      border: selectedImage === index ? '2px solid #1890ff' : '2px solid #d9d9d9',
                      borderRadius: 4,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img 
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                ))}
              </div>
            )}
          </Col>

          {/* Right - Product Info */}
          <Col xs={24} lg={14}>
            <div className="service-info">
              <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
                {service.title}
              </h1>

              {/* Price */}
              <div style={{ marginBottom: 24 }}>
                {hasDiscount ? (
                  <>
                    <div style={{ marginBottom: 8 }}>
                      <span style={{ 
                        fontSize: 16, 
                        color: '#8c8c8c', 
                        textDecoration: 'line-through',
                        marginRight: 12
                      }}>
                        {service.originalPrice?.toLocaleString('vi-VN')} ₫
                      </span>
                    </div>
                    <div style={{ fontSize: 32, fontWeight: 700, color: '#f5222d' }}>
                      {service.discountedPrice?.toLocaleString('vi-VN')} ₫
                    </div>
                  </>
                ) : (
                  <div style={{ fontSize: 32, fontWeight: 700, color: '#1890ff' }}>
                    {(service.originalPrice || service.discountedPrice)?.toLocaleString('vi-VN')} ₫
                  </div>
                )}
              </div>

              {/* Description */}
              <div style={{ 
                padding: 16, 
                background: '#f5f5f5', 
                borderRadius: 8,
                marginBottom: 24
              }}>
                <div style={{ margin: 0, fontSize: 15, lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                  {service.description}
                </div>
              </div>

              {/* Deal Info */}
              <div style={{ 
                padding: 16, 
                background: '#fff7e6', 
                border: '1px solid #ffd591',
                borderRadius: 8,
                marginBottom: 24
              }}>
                <div style={{ fontWeight: 600, marginBottom: 8, color: '#fa8c16' }}>
                  🔥 DEAL SIÊU HỜI – SỐ LƯỢNG CÓ HẠN🔥
                </div>
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  <li>Chỉ áp dụng cho KH sắn deal trên Web online trong khung giờ từ 11 – 13h</li>
                  <li>Deal không có giá trị quy đổi thành tiền mặt, dùng người sử dụng, không trao đổi hay mua bán</li>
                  <li>Bảo lưu thời gian sử dụng deal trong 3 tháng tính từ ngày mua</li>
                </ul>
                <div style={{ marginTop: 8, fontSize: 13, fontStyle: 'italic' }}>
                  (Ưu đãi chỉ dành cho khách hàng người Việt Nam)
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                <Button 
                  size="large"
                  icon={<ShoppingCartOutlined />}
                  onClick={handleAddToCart}
                  loading={addingToCart}
                  style={{ 
                    flex: 1,
                    height: 50,
                    fontSize: 16,
                    fontWeight: 600
                  }}
                >
                  THÊM VÀO GIỎ HÀNG
                </Button>
                <Button 
                  type="primary"
                  size="large"
                  onClick={handleBuyNow}
                  style={{ 
                    flex: 1,
                    height: 50,
                    fontSize: 16,
                    fontWeight: 600,
                    background: service.color || '#1890ff',
                    borderColor: service.color || '#1890ff'
                  }}
                >
                  MUA NGAY
                </Button>
              </div>

              {/* Contact Box */}
              <div style={{ 
                padding: 20, 
                background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                borderRadius: 8,
                color: '#fff',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: 14, marginBottom: 8 }}>
                  Hãy để lại SDT, chuyên viên tư vấn của chúng tôi sẽ gọi ngay cho bạn miễn phí!
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <input 
                    type="tel"
                    placeholder="Nhập số điện thoại..."
                    style={{
                      flex: 1,
                      padding: '10px 16px',
                      border: 'none',
                      borderRadius: 4,
                      fontSize: 14
                    }}
                  />
                  <Button 
                    size="large"
                    style={{ 
                      background: '#fff',
                      color: '#1890ff',
                      fontWeight: 600,
                      border: 'none'
                    }}
                  >
                    Gửi
                  </Button>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Description Tab */}
        <div style={{ marginTop: 48 }}>
          <div style={{ 
            padding: '16px 24px',
            background: '#1890ff',
            color: '#fff',
            fontSize: 18,
            fontWeight: 600,
            borderRadius: '8px 8px 0 0',
            textAlign: 'center'
          }}>
            MÔ TẢ
          </div>
          <div style={{ 
            padding: 32,
            background: '#fff',
            border: '1px solid #e8e8e8',
            borderTop: 'none',
            borderRadius: '0 0 8px 8px'
          }}>
            <div 
              className="service-content"
              dangerouslySetInnerHTML={{ __html: service.content || service.description }}
              style={{ lineHeight: 1.8, fontSize: 15 }}
            />
          </div>
        </div>

        {/* Related Services */}
        {relatedServices.length > 0 && (
          <div style={{ marginTop: 48 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, textAlign: 'center' }}>
              SẢN PHẨM TƯƠNG TỰ
            </h2>
            <Row gutter={[24, 24]}>
              {relatedServices.map(relatedService => (
                <Col xs={24} sm={12} lg={6} key={relatedService.id}>
                  <Card
                    hoverable
                    cover={
                      <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                        {relatedService.discountPercentage > 0 && (
                          <div style={{
                            position: 'absolute',
                            top: 8,
                            left: 8,
                            background: '#1890ff',
                            color: '#fff',
                            padding: '4px 8px',
                            borderRadius: 4,
                            fontWeight: 700,
                            fontSize: 12,
                            zIndex: 2
                          }}>
                            -{relatedService.discountPercentage}%
                          </div>
                        )}
                        <img 
                          src={relatedService.imageUrl || 'https://via.placeholder.com/300x200'}
                          alt={relatedService.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    }
                    onClick={() => navigate(`/services/${relatedService.slug}`)}
                  >
                    <Meta 
                      title={
                        <div style={{ 
                          fontSize: 14, 
                          fontWeight: 600,
                          minHeight: 40,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {relatedService.title}
                        </div>
                      }
                      description={
                        <div>
                          {relatedService.discountPercentage > 0 ? (
                            <>
                              <div style={{ textDecoration: 'line-through', color: '#8c8c8c', fontSize: 12 }}>
                                {relatedService.originalPrice?.toLocaleString('vi-VN')} ₫
                              </div>
                              <div style={{ color: '#f5222d', fontSize: 16, fontWeight: 700 }}>
                                {relatedService.discountedPrice?.toLocaleString('vi-VN')} ₫
                              </div>
                            </>
                          ) : (
                            <div style={{ color: '#1890ff', fontSize: 16, fontWeight: 700 }}>
                              {(relatedService.originalPrice || relatedService.discountedPrice)?.toLocaleString('vi-VN')} ₫
                            </div>
                          )}
                        </div>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </div>
    </div>
  );
}

export default ServiceDetailPage;
