import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Row, Col, Button, InputNumber, Empty, Spin, Breadcrumb, Card } from 'antd';
import { HomeOutlined, DeleteOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useCart } from '../contexts/CartContext';
import defaultProductImage from '../assets/default-product.png';
import '../styles/cart.css';

function CartPage() {
  const navigate = useNavigate();
  const { cart, loading, updateCartItem, removeCartItem, clearCart } = useCart();

  const handleQuantityChange = async (itemId, newQuantity) => {
    try {
      await updateCartItem(itemId, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await removeCartItem(itemId);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="cart-page">
      {/* Breadcrumb */}
      <div style={{ background: '#f5f5f5', padding: '16px 24px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/"><HomeOutlined /> Trang chủ</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Giỏ hàng</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>
          Giỏ hàng của bạn
        </h1>

        {cart.items.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Giỏ hàng trống"
            style={{ padding: '60px 0' }}
          >
            <Button type="primary" size="large" onClick={() => navigate('/services')}>
              Tiếp tục mua sắm
            </Button>
          </Empty>
        ) : (
          <Row gutter={24}>
            {/* Cart Items */}
            <Col xs={24} lg={16}>
              <Card>
                {/* Header */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: 16,
                  borderBottom: '1px solid #f0f0f0',
                  marginBottom: 16
                }}>
                  <span style={{ fontWeight: 600 }}>
                    Sản phẩm ({cart.totalItems})
                  </span>
                  <Button 
                    type="text" 
                    danger 
                    size="small"
                    onClick={handleClearCart}
                  >
                    Xóa tất cả
                  </Button>
                </div>

                {/* Cart Items List */}
                {cart.items.map(item => (
                  <div 
                    key={item.id}
                    className="cart-item"
                    style={{
                      display: 'flex',
                      gap: 16,
                      padding: '16px 0',
                      borderBottom: '1px solid #f0f0f0'
                    }}
                  >
                    {/* Image */}
                    <div 
                      style={{ 
                        width: 100, 
                        height: 100, 
                        flexShrink: 0,
                        cursor: 'pointer',
                        background: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 8,
                        border: '1px solid #e8e8e8',
                        overflow: 'hidden'
                      }}
                      onClick={() => navigate(`/services/${item.serviceSlug || item.serviceId}`)}
                    >
                      {item.serviceImage ? (
                        <img 
                          src={item.serviceImage}
                          alt={item.serviceTitle}
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover'
                          }}
                          onError={(e) => {
                            e.target.src = defaultProductImage;
                            e.target.style.objectFit = 'contain';
                            e.target.style.padding = '16px';
                          }}
                        />
                      ) : (
                        <img 
                          src={defaultProductImage}
                          alt="Default product"
                          style={{ 
                            width: '70%', 
                            height: '70%', 
                            objectFit: 'contain',
                            opacity: 0.6
                          }}
                        />
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1 }}>
                      <h3 
                        style={{ 
                          fontSize: 16, 
                          fontWeight: 600, 
                          marginBottom: 8,
                          cursor: 'pointer'
                        }}
                        onClick={() => navigate(`/services/${item.serviceSlug || item.serviceId}`)}
                      >
                        {item.serviceTitle}
                      </h3>
                      
                      <div style={{ 
                        fontSize: 18, 
                        fontWeight: 700, 
                        color: '#262626',
                        marginBottom: 12
                      }}>
                        {item.price?.toLocaleString('vi-VN')} ₫
                      </div>

                      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                        {/* Quantity */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 14, color: '#8c8c8c' }}>Số lượng:</span>
                          <InputNumber
                            min={1}
                            max={item.availableQuantity || 999}
                            value={item.quantity}
                            onChange={(value) => handleQuantityChange(item.id, value)}
                            style={{ width: 100 }}
                          />
                        </div>

                        {/* Remove Button */}
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          Xóa
                        </Button>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div style={{ 
                      textAlign: 'right',
                      minWidth: 120
                    }}>
                      <div style={{ fontSize: 14, color: '#8c8c8c', marginBottom: 4 }}>
                        Tạm tính
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: '#0066CC' }}>
                        {item.subtotal?.toLocaleString('vi-VN')} ₫
                      </div>
                    </div>
                  </div>
                ))}
              </Card>
            </Col>

            {/* Order Summary */}
            <Col xs={24} lg={8}>
              <Card 
                title="Tổng đơn hàng"
                style={{ position: 'sticky', top: 80 }}
              >
                <div style={{ marginBottom: 16 }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginBottom: 12
                  }}>
                    <span style={{ color: '#8c8c8c' }}>Tạm tính:</span>
                    <span style={{ fontWeight: 600 }}>
                      {cart.totalAmount?.toLocaleString('vi-VN')} ₫
                    </span>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginBottom: 12
                  }}>
                    <span style={{ color: '#8c8c8c' }}>Phí vận chuyển:</span>
                    <span style={{ fontWeight: 600, color: '#52c41a' }}>
                      Miễn phí
                    </span>
                  </div>

                  <div style={{ 
                    borderTop: '1px solid #f0f0f0',
                    paddingTop: 12,
                    marginTop: 12
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      fontSize: 18
                    }}>
                      <span style={{ fontWeight: 600 }}>Tổng cộng:</span>
                      <span style={{ fontWeight: 700, color: '#0066CC', fontSize: 20 }}>
                        {cart.totalAmount?.toLocaleString('vi-VN')} ₫
                      </span>
                    </div>
                  </div>
                </div>

                <Button 
                  type="primary" 
                  size="large" 
                  block
                  onClick={handleCheckout}
                  style={{ 
                    height: 50,
                    fontSize: 16,
                    fontWeight: 600,
                    marginBottom: 12
                  }}
                >
                  Thanh toán
                </Button>

                <Button 
                  size="large" 
                  block
                  icon={<ShoppingOutlined />}
                  onClick={() => navigate('/services')}
                  style={{ height: 50 }}
                >
                  Tiếp tục mua sắm
                </Button>

                {/* Info Box */}
                <div style={{ 
                  marginTop: 24,
                  padding: 16,
                  background: '#f5f5f5',
                  borderRadius: 8
                }}>
                  <div style={{ fontSize: 13, color: '#595959', lineHeight: 1.6 }}>
                    <div style={{ fontWeight: 600, marginBottom: 8 }}>
                      🎁 Ưu đãi đặc biệt
                    </div>
                    <ul style={{ margin: 0, paddingLeft: 20 }}>
                      <li>Miễn phí vận chuyển toàn quốc</li>
                      <li>Hỗ trợ đổi trả trong 7 ngày</li>
                      <li>Tích điểm thành viên</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        )}
      </div>
    </div>
  );
}

export default CartPage;
