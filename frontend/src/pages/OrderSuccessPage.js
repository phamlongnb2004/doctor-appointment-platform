import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, Button, Result, Spin, Descriptions, Timeline } from 'antd';
import { CheckCircleOutlined, HomeOutlined, FileTextOutlined } from '@ant-design/icons';
import { useCart } from '../contexts/CartContext';
import axios from 'axios';
import '../styles/order.css';

// Get API base URL from environment variable
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

function OrderSuccessPage() {
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  const { refreshCart } = useCart();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
    // Refresh cart to ensure it's cleared after successful order
    refreshCart();
    // Auto-confirm payment when user returns from payment gateway (only for local testing)
    // On production, SePay will send IPN callback directly to backend
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      confirmPaymentIfNeeded();
    }
  }, [orderNumber]);

  const confirmPaymentIfNeeded = async () => {
    try {
      // Khi test local với database Render, gọi IPN endpoint trên Render
      // để cập nhật database chung
      const ipnUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'https://doctor-appointment-backend-mq2p.onrender.com/api/orders/sepay/ipn'
        : `${API_BASE_URL}/orders/sepay/ipn`;
      
      // Simulate SePay IPN callback
      await axios.post(ipnUrl, {
        notification_type: 'ORDER_PAID',
        order: {
          order_invoice_number: orderNumber,
          order_status: 'CAPTURED'
        }
      });
      
      console.log('Payment confirmed via IPN for order:', orderNumber);
      // Reload order after confirmation
      setTimeout(() => fetchOrder(), 1000);
    } catch (error) {
      console.error('Error confirming payment:', error);
    }
  };

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/orders/number/${orderNumber}`);
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      'PENDING': 'Chờ xác nhận',
      'CONFIRMED': 'Đã xác nhận',
      'PROCESSING': 'Đang xử lý',
      'COMPLETED': 'Hoàn thành',
      'CANCELLED': 'Đã hủy'
    };
    return statusMap[status] || status;
  };

  const getPaymentStatusText = (status) => {
    const statusMap = {
      'PENDING': 'Chờ thanh toán',
      'PAID': 'Đã thanh toán',
      'FAILED': 'Thanh toán thất bại'
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ maxWidth: 800, margin: '60px auto', padding: '0 24px' }}>
        <Result
          status="404"
          title="Không tìm thấy đơn hàng"
          subTitle="Đơn hàng không tồn tại hoặc đã bị xóa"
          extra={
            <Button type="primary" onClick={() => navigate('/')}>
              Về trang chủ
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="order-success-page" style={{ background: '#f5f5f5', minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* Success/Cancelled Message */}
        <Result
          status={order.status === 'CANCELLED' ? 'warning' : 'success'}
          icon={order.status === 'CANCELLED' ? undefined : <CheckCircleOutlined style={{ color: '#52c41a' }} />}
          title={order.status === 'CANCELLED' ? 'Đơn hàng đã bị hủy' : 'Đặt dịch vụ thành công!'}
          subTitle={
            <div>
              <div style={{ fontSize: 16, marginBottom: 8 }}>
                Mã đơn hàng: <strong>{order.orderNumber}</strong>
              </div>
              <div style={{ color: '#8c8c8c' }}>
                {order.status === 'CANCELLED' 
                  ? 'Đơn hàng này đã bị hủy. Bạn có thể đặt lại dịch vụ nếu muốn.'
                  : 'Cảm ơn bạn đã tin tưởng sử dụng dịch vụ của chúng tôi. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.'
                }
              </div>
            </div>
          }
          extra={[
            <Button type="primary" key="home" icon={<HomeOutlined />} onClick={() => navigate('/')}>
              Về trang chủ
            </Button>,
            <Button key="services" onClick={() => navigate('/services')}>
              {order.status === 'CANCELLED' ? 'Đặt lại dịch vụ' : 'Tiếp tục đặt dịch vụ'}
            </Button>
          ]}
        />

        {/* Order Details */}
        <Card 
          title={
            <span style={{ fontSize: 18, fontWeight: 600 }}>
              <FileTextOutlined /> Chi tiết đơn hàng
            </span>
          }
          style={{ marginTop: 24 }}
        >
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Mã đơn hàng">
              <strong>{order.orderNumber}</strong>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <span style={{ 
                color: order.status === 'COMPLETED' ? '#52c41a' : '#1890ff',
                fontWeight: 600
              }}>
                {getStatusText(order.status)}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Thanh toán">
              <span style={{ fontWeight: 600 }}>
                {getPaymentStatusText(order.paymentStatus)}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Phương thức thanh toán">
              {order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : 
               order.paymentMethod === 'BANK_TRANSFER' ? 'Chuyển khoản ngân hàng' : 
               order.paymentMethod === 'MOMO' ? 'Ví MoMo' : order.paymentMethod}
            </Descriptions.Item>
          </Descriptions>

          <div style={{ marginTop: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>
              Thông tin khách hàng
            </h3>
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Họ tên">{order.customerName}</Descriptions.Item>
              <Descriptions.Item label="Email">{order.customerEmail}</Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">{order.customerPhone}</Descriptions.Item>
              <Descriptions.Item label="Địa chỉ">
                {order.shippingAddress}
                {order.shippingWard && `, ${order.shippingWard}`}
                {order.shippingDistrict && `, ${order.shippingDistrict}`}
                {order.shippingCity && `, ${order.shippingCity}`}
              </Descriptions.Item>
              {order.shippingNotes && (
                <Descriptions.Item label="Ghi chú">{order.shippingNotes}</Descriptions.Item>
              )}
            </Descriptions>
          </div>

          <div style={{ marginTop: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>
              Dịch vụ đã đặt
            </h3>
            {order.items.map((item, index) => (
              <div 
                key={item.id}
                style={{
                  display: 'flex',
                  gap: 16,
                  padding: 16,
                  background: '#fafafa',
                  borderRadius: 8,
                  marginBottom: 12
                }}
              >
                <div style={{ 
                  width: 80, 
                  height: 80, 
                  flexShrink: 0,
                  background: '#fff',
                  borderRadius: 8,
                  overflow: 'hidden',
                  border: '1px solid #e8e8e8'
                }}>
                  {item.serviceImage ? (
                    <img 
                      src={item.serviceImage}
                      alt={item.serviceTitle}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ 
                      width: '100%', 
                      height: '100%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      fontSize: 32,
                      opacity: 0.3
                    }}>
                      🏥
                    </div>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
                    {item.serviceTitle}
                  </div>
                  <div style={{ color: '#8c8c8c', marginBottom: 4 }}>
                    Số lượng: {item.quantity}
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: '#1890ff' }}>
                    {item.subtotal?.toLocaleString('vi-VN')} ₫
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ 
            marginTop: 24,
            padding: 16,
            background: '#f0f5ff',
            borderRadius: 8,
            border: '1px solid #d6e4ff'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span>Tạm tính:</span>
              <span style={{ fontWeight: 600 }}>
                {order.totalAmount?.toLocaleString('vi-VN')} ₫
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span>Phí vận chuyển:</span>
              <span style={{ fontWeight: 600, color: '#52c41a' }}>
                Miễn phí
              </span>
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              paddingTop: 12,
              borderTop: '1px solid #d6e4ff',
              fontSize: 18
            }}>
              <span style={{ fontWeight: 600 }}>Tổng cộng:</span>
              <span style={{ fontWeight: 700, color: '#f5222d' }}>
                {order.finalAmount?.toLocaleString('vi-VN')} ₫
              </span>
            </div>
          </div>
        </Card>

        {/* Next Steps - Only show if order is not cancelled */}
        {order.status !== 'CANCELLED' && (
          <Card 
            title="Các bước tiếp theo"
            style={{ marginTop: 24 }}
          >
            <Timeline
              items={[
                {
                  color: 'green',
                  children: (
                    <div>
                      <div style={{ fontWeight: 600 }}>Đơn hàng đã được tiếp nhận</div>
                      <div style={{ color: '#8c8c8c', fontSize: 14 }}>
                        Chúng tôi đã nhận được yêu cầu đặt dịch vụ của bạn
                      </div>
                    </div>
                  )
                },
                {
                  color: 'blue',
                  children: (
                    <div>
                      <div style={{ fontWeight: 600 }}>Xác nhận đơn hàng</div>
                      <div style={{ color: '#8c8c8c', fontSize: 14 }}>
                        Nhân viên sẽ liên hệ xác nhận trong vòng 24h
                      </div>
                    </div>
                  )
                },
                {
                  color: 'blue',
                  children: (
                    <div>
                      <div style={{ fontWeight: 600 }}>Chuẩn bị dịch vụ</div>
                      <div style={{ color: '#8c8c8c', fontSize: 14 }}>
                        Chúng tôi sẽ chuẩn bị và sắp xếp lịch hẹn phù hợp
                      </div>
                    </div>
                  )
                },
                {
                  color: 'gray',
                  children: (
                    <div>
                      <div style={{ fontWeight: 600 }}>Hoàn thành dịch vụ</div>
                      <div style={{ color: '#8c8c8c', fontSize: 14 }}>
                        Bạn sẽ nhận được dịch vụ theo lịch hẹn
                      </div>
                    </div>
                  )
                }
              ]}
            />
          </Card>
        )}

        {/* Support Info */}
        <Card style={{ marginTop: 24, background: '#fff7e6', border: '1px solid #ffd591' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
              Cần hỗ trợ?
            </div>
            <div style={{ color: '#8c8c8c', marginBottom: 16 }}>
              Liên hệ với chúng tôi nếu bạn có bất kỳ thắc mắc nào
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#1890ff', marginBottom: 8 }}>
              Hotline: 19005656
            </div>
            <div style={{ color: '#8c8c8c' }}>
              Email: support@khamnow.vn
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default OrderSuccessPage;
