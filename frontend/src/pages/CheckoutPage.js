import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Row, Col, Card, Form, Input, Button, Radio, Breadcrumb, message, Spin, Modal, Image, Select } from 'antd';
import { HomeOutlined, CheckCircleOutlined, QrcodeOutlined, CloseOutlined } from '@ant-design/icons';
import { useCart } from '../contexts/CartContext';
import axios from 'axios';
import '../styles/checkout.css';

const { TextArea } = Input;

// Get API base URL from environment variable
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, loading: cartLoading } = useCart();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [orderData, setOrderData] = useState(null);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [bankInfo, setBankInfo] = useState({
    bankId: 'MB',
    bankName: 'MB Bank',
    accountNo: '0123456789',
    accountName: 'KHAMNOW'
  });
  
  // Address data (API v2 - sau sát nhập tỉnh, chỉ còn Province → Ward)
  const [provinces, setProvinces] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  
  // Store selected names for submission
  const [selectedProvinceData, setSelectedProvinceData] = useState(null);
  const [selectedWardData, setSelectedWardData] = useState(null);

  const getUserInfo = () => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        return JSON.parse(user);
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  const getSessionId = () => {
    return localStorage.getItem('cart_session_id');
  };

  // Check login requirement
  useEffect(() => {
    const user = getUserInfo();
    if (!user) {
      message.warning('Vui lòng đăng nhập để thanh toán');
      // Save current path to redirect back after login
      localStorage.setItem('redirect_after_login', '/checkout');
      navigate('/login');
    }
  }, [navigate]);

  // Fetch bank info from site settings
  useEffect(() => {
    const fetchBankInfo = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/cms/site-settings`);
        const settings = response.data;
        if (settings.bankId && settings.bankAccountNo) {
          setBankInfo({
            bankId: settings.bankId,
            bankName: settings.bankName || 'MB Bank',
            accountNo: settings.bankAccountNo,
            accountName: settings.bankAccountName || 'KHAMNOW'
          });
        }
      } catch (error) {
        console.error('Error fetching bank info:', error);
      }
    };
    fetchBankInfo();
  }, []);

  // Fetch provinces on mount (API v2)
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get('https://provinces.open-api.vn/api/v2/p/');
        setProvinces(response.data);
      } catch (error) {
        console.error('Error fetching provinces:', error);
        message.error('Không thể tải danh sách tỉnh/thành phố');
      }
    };
    fetchProvinces();
  }, []);

  // Fetch wards when province changes (API v2 - không còn district)
  const handleProvinceChange = async (value) => {
    const province = provinces.find(p => p.code === value);
    setSelectedProvince(value);
    setSelectedProvinceData(province);
    setSelectedWardData(null);
    setWards([]);
    form.setFieldsValue({ shippingWard: undefined });
    
    try {
      const response = await axios.get(`https://provinces.open-api.vn/api/v2/p/${value}?depth=2`);
      setWards(response.data.wards || []);
    } catch (error) {
      console.error('Error fetching wards:', error);
      message.error('Không thể tải danh sách phường/xã');
    }
  };
  
  // Handle ward selection
  const handleWardChange = (value) => {
    const ward = wards.find(w => w.code === value);
    setSelectedWardData(ward);
  };

  // Generate QR Code using VietQR API
  const generateQRCode = (orderNumber, amount) => {
    // Sử dụng thông tin ngân hàng từ CMS
    const template = 'compact'; // Template QR
    
    // Nội dung chuyển khoản
    const description = `KHAMNOW ${orderNumber}`;
    
    // Tạo URL QR code sử dụng VietQR API
    const qrUrl = `https://img.vietqr.io/image/${bankInfo.bankId}-${bankInfo.accountNo}-${template}.png?amount=${amount}&addInfo=${encodeURIComponent(description)}&accountName=${encodeURIComponent(bankInfo.accountName)}`;
    
    return qrUrl;
  };

  // Check payment status periodically
  useEffect(() => {
    let intervalId;
    
    if (checkingPayment && orderData) {
      intervalId = setInterval(async () => {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/orders/number/${orderData.orderNumber}`
          );
          
          if (response.data.paymentStatus === 'PAID') {
            setCheckingPayment(false);
            setQrModalVisible(false);
            message.success('Thanh toán thành công!');
            navigate(`/order-success/${orderData.orderNumber}`);
          }
        } catch (error) {
          console.error('Error checking payment status:', error);
        }
      }, 5000); // Check every 5 seconds
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [checkingPayment, orderData, navigate]);

  const handleCheckout = async (values) => {
    try {
      setLoading(true);
      const user = getUserInfo();
      const sessionId = getSessionId();

      // Replace codes with actual names (API v2 - không có district)
      const checkoutData = {
        customerName: values.customerName,
        customerEmail: values.customerEmail,
        customerPhone: values.customerPhone,
        shippingAddress: values.shippingAddress,
        shippingCity: selectedProvinceData?.name || values.shippingCity,
        shippingDistrict: null, // API v2 không có district sau sát nhập tỉnh
        shippingWard: selectedWardData?.name || values.shippingWard || '',
        shippingNotes: values.shippingNotes || '',
        paymentMethod,
        sessionId
      };

      console.log('Checkout data:', checkoutData);
      console.log('User ID:', user?.id);
      console.log('Session ID:', sessionId);

      // Nếu chọn SEPAY, gọi API riêng
      if (paymentMethod === 'SEPAY') {
        const params = user ? { userId: user.id } : {};
        const response = await axios.post(
          `${API_BASE_URL}/orders/sepay/checkout`,
          checkoutData,
          { params }
        );

        const sePayResponse = response.data;
        
        // Chuyển đến trang SePay checkout với response data
        navigate('/sepay-checkout', { 
          state: { sePayResponse }
        });
        return;
      }

      // Các phương thức thanh toán khác (COD, BANK_TRANSFER, MOMO)
      const params = user ? { userId: user.id } : {};
      const response = await axios.post(
        `${API_BASE_URL}/orders/checkout`,
        checkoutData,
        { params }
      );

      const order = response.data;
      setOrderData(order);

      // Nếu chọn chuyển khoản ngân hàng, hiển thị QR code
      if (paymentMethod === 'BANK_TRANSFER' || paymentMethod === 'MOMO') {
        const qrUrl = generateQRCode(order.orderNumber, order.finalAmount);
        setQrCodeUrl(qrUrl);
        setQrModalVisible(true);
        setCheckingPayment(true);
        message.info('Vui lòng quét mã QR để thanh toán');
      } else {
        // COD - chuyển thẳng đến trang success
        message.success('Đặt hàng thành công!');
        navigate(`/order-success/${order.orderNumber}`);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      message.error('Lỗi khi đặt hàng. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelPayment = async () => {
    setQrModalVisible(false);
    setCheckingPayment(false);
    
    // Cancel the order automatically
    if (orderData && orderData.id) {
      try {
        await axios.put(
          `${API_BASE_URL}/orders/${orderData.id}/cancel`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        message.success('Đã hủy đơn hàng. Sản phẩm vẫn còn trong giỏ hàng.');
        // Redirect to cart page
        setTimeout(() => {
          navigate('/cart');
        }, 1000);
      } catch (error) {
        console.error('Error cancelling order:', error);
        message.warning('Đã hủy thanh toán. Bạn có thể thanh toán sau trong mục "Đơn hàng của tôi"');
        setTimeout(() => {
          navigate('/my-orders');
        }, 1000);
      }
    } else {
      // If no order data, just go back to cart
      navigate('/cart');
    }
  };

  if (cartLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="checkout-page">
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 24px', textAlign: 'center' }}>
          <h2>Giỏ hàng trống</h2>
          <p>Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán</p>
          <Button type="primary" onClick={() => navigate('/services')}>
            Tiếp tục mua sắm
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      {/* Breadcrumb */}
      <div style={{ background: '#f5f5f5', padding: '16px 24px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/"><HomeOutlined /> Trang chủ</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="/cart">Giỏ hàng</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Thanh toán</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>
          Thanh toán
        </h1>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleCheckout}
          initialValues={{
            paymentMethod: 'COD'
          }}
        >
          <Row gutter={24}>
            {/* Left Column - Form */}
            <Col xs={24} lg={16}>
              <Card title="Thông tin giao hàng" style={{ marginBottom: 24 }}>
                <Row gutter={16}>
                  <Col xs={24}>
                    <Form.Item
                      label="Họ và tên"
                      name="customerName"
                      rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                    >
                      <Input size="large" placeholder="Nguyễn Văn A" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Email"
                      name="customerEmail"
                      rules={[
                        { required: true, message: 'Vui lòng nhập email!' },
                        { type: 'email', message: 'Email không hợp lệ!' }
                      ]}
                    >
                      <Input size="large" placeholder="email@example.com" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Số điện thoại"
                      name="customerPhone"
                      rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                    >
                      <Input size="large" placeholder="0912345678" />
                    </Form.Item>
                  </Col>

                  <Col xs={24}>
                    <Form.Item
                      label="Địa chỉ"
                      name="shippingAddress"
                      rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                    >
                      <Input size="large" placeholder="Số nhà, tên đường" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Tỉnh/Thành phố"
                      name="shippingCity"
                      rules={[{ required: true, message: 'Vui lòng chọn tỉnh/thành phố!' }]}
                    >
                      <Select
                        size="large"
                        placeholder="Chọn tỉnh/thành phố"
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        onChange={handleProvinceChange}
                        options={provinces.map(p => ({
                          value: p.code,
                          label: p.name
                        }))}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={16}>
                    <Form.Item
                      label="Phường/Xã/Quận/Huyện"
                      name="shippingWard"
                      help="Sau sát nhập tỉnh, chọn trực tiếp phường/xã/quận/huyện"
                    >
                      <Select
                        size="large"
                        placeholder="Chọn phường/xã/quận/huyện"
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        onChange={handleWardChange}
                        disabled={!selectedProvince}
                        options={wards.map(w => ({
                          value: w.code,
                          label: w.name
                        }))}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24}>
                    <Form.Item
                      label="Ghi chú"
                      name="shippingNotes"
                    >
                      <TextArea 
                        rows={3} 
                        placeholder="Ghi chú thêm về đơn hàng (tùy chọn)"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              <Card title="Phương thức thanh toán">
                <Radio.Group 
                  value={paymentMethod} 
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <div style={{ marginBottom: 16 }}>
                    <Radio value="COD" style={{ fontSize: 16 }}>
                      <strong>Thanh toán khi nhận hàng (COD)</strong>
                      <div style={{ color: '#8c8c8c', fontSize: 14, marginTop: 4 }}>
                        Thanh toán bằng tiền mặt khi nhận hàng
                      </div>
                    </Radio>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <Radio value="SEPAY" style={{ fontSize: 16 }}>
                      <strong>🏦 Thanh toán qua SePay</strong>
                      <div style={{ color: '#8c8c8c', fontSize: 14, marginTop: 4 }}>
                        Thanh toán an toàn qua cổng SePay (Chuyển khoản ngân hàng, Ví điện tử)
                      </div>
                    </Radio>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <Radio value="BANK_TRANSFER" style={{ fontSize: 16 }}>
                      <strong>Chuyển khoản ngân hàng (QR Code)</strong>
                      <div style={{ color: '#8c8c8c', fontSize: 14, marginTop: 4 }}>
                        Chuyển khoản trực tiếp vào tài khoản ngân hàng
                      </div>
                    </Radio>
                  </div>
                  <div>
                    <Radio value="MOMO" style={{ fontSize: 16 }}>
                      <strong>Ví MoMo (QR Code)</strong>
                      <div style={{ color: '#8c8c8c', fontSize: 14, marginTop: 4 }}>
                        Thanh toán qua ví điện tử MoMo
                      </div>
                    </Radio>
                  </div>
                </Radio.Group>
              </Card>
            </Col>

            {/* Right Column - Order Summary */}
            <Col xs={24} lg={8}>
              <Card 
                title="Đơn hàng của bạn"
                style={{ position: 'sticky', top: 80 }}
              >
                {/* Order Items */}
                <div style={{ marginBottom: 16 }}>
                  {cart.items.map(item => (
                    <div 
                      key={item.id}
                      style={{
                        display: 'flex',
                        gap: 12,
                        marginBottom: 16,
                        paddingBottom: 16,
                        borderBottom: '1px solid #f0f0f0'
                      }}
                    >
                      <div style={{ 
                        width: 60, 
                        height: 60, 
                        flexShrink: 0,
                        background: '#f5f5f5',
                        borderRadius: 8,
                        overflow: 'hidden'
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
                            fontSize: 24,
                            opacity: 0.3
                          }}>
                            🏥
                          </div>
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, marginBottom: 4 }}>
                          {item.serviceTitle}
                        </div>
                        <div style={{ fontSize: 12, color: '#8c8c8c' }}>
                          Số lượng: {item.quantity}
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#1890ff' }}>
                          {item.subtotal?.toLocaleString('vi-VN')} ₫
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div style={{ borderTop: '2px solid #f0f0f0', paddingTop: 16 }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginBottom: 12
                  }}>
                    <span>Tạm tính:</span>
                    <span style={{ fontWeight: 600 }}>
                      {cart.totalAmount?.toLocaleString('vi-VN')} ₫
                    </span>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginBottom: 12
                  }}>
                    <span>Phí vận chuyển:</span>
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
                      <span style={{ fontWeight: 700, color: '#f5222d' }}>
                        {cart.totalAmount?.toLocaleString('vi-VN')} ₫
                      </span>
                    </div>
                  </div>
                </div>

                <Button 
                  type="primary" 
                  size="large" 
                  block
                  htmlType="submit"
                  loading={loading}
                  icon={<CheckCircleOutlined />}
                  style={{ 
                    height: 50,
                    fontSize: 16,
                    fontWeight: 600,
                    marginTop: 24
                  }}
                >
                  Đặt hàng
                </Button>

                <div style={{ 
                  marginTop: 16,
                  padding: 12,
                  background: '#f5f5f5',
                  borderRadius: 8,
                  fontSize: 13,
                  color: '#595959'
                }}>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>
                    🔒 Thanh toán an toàn
                  </div>
                  Thông tin của bạn được bảo mật và mã hóa
                </div>
              </Card>
            </Col>
          </Row>
        </Form>
      </div>

      {/* QR Code Payment Modal */}
      <Modal
        title={
          <div style={{ textAlign: 'center', fontSize: 20, fontWeight: 600 }}>
            <QrcodeOutlined style={{ marginRight: 8, color: '#1890ff' }} />
            Quét mã QR để thanh toán
          </div>
        }
        open={qrModalVisible}
        onCancel={handleCancelPayment}
        footer={null}
        width={500}
        centered
        closeIcon={<CloseOutlined />}
      >
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          {/* QR Code */}
          <div style={{ 
            background: '#fff',
            padding: 20,
            borderRadius: 12,
            marginBottom: 20,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <Image
              src={qrCodeUrl}
              alt="QR Code"
              style={{ 
                width: '100%',
                maxWidth: 300,
                margin: '0 auto'
              }}
              preview={false}
            />
          </div>

          {/* Payment Info */}
          <div style={{ 
            background: '#f5f5f5',
            padding: 16,
            borderRadius: 8,
            marginBottom: 16,
            textAlign: 'left'
          }}>
            <div style={{ marginBottom: 12 }}>
              <span style={{ color: '#8c8c8c' }}>Ngân hàng:</span>
              <span style={{ fontWeight: 600, marginLeft: 8 }}>{bankInfo.bankName}</span>
            </div>
            <div style={{ marginBottom: 12 }}>
              <span style={{ color: '#8c8c8c' }}>Số tài khoản:</span>
              <span style={{ fontWeight: 600, marginLeft: 8 }}>{bankInfo.accountNo}</span>
            </div>
            <div style={{ marginBottom: 12 }}>
              <span style={{ color: '#8c8c8c' }}>Chủ tài khoản:</span>
              <span style={{ fontWeight: 600, marginLeft: 8 }}>{bankInfo.accountName}</span>
            </div>
            <div style={{ marginBottom: 12 }}>
              <span style={{ color: '#8c8c8c' }}>Số tiền:</span>
              <span style={{ fontWeight: 700, marginLeft: 8, color: '#f5222d', fontSize: 18 }}>
                {orderData?.finalAmount?.toLocaleString('vi-VN')} ₫
              </span>
            </div>
            <div>
              <span style={{ color: '#8c8c8c' }}>Nội dung:</span>
              <span style={{ fontWeight: 600, marginLeft: 8, color: '#1890ff' }}>
                KHAMNOW {orderData?.orderNumber}
              </span>
            </div>
          </div>

          {/* Instructions */}
          <div style={{ 
            background: '#e6f7ff',
            border: '1px solid #91d5ff',
            padding: 16,
            borderRadius: 8,
            marginBottom: 16,
            textAlign: 'left'
          }}>
            <div style={{ fontWeight: 600, marginBottom: 8, color: '#0050b3' }}>
              📱 Hướng dẫn thanh toán:
            </div>
            <ol style={{ margin: 0, paddingLeft: 20, color: '#595959' }}>
              <li>Mở ứng dụng ngân hàng của bạn</li>
              <li>Chọn chức năng quét mã QR</li>
              <li>Quét mã QR phía trên</li>
              <li>Kiểm tra thông tin và xác nhận thanh toán</li>
            </ol>
          </div>

          {/* Status */}
          {checkingPayment && (
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              padding: 16,
              background: '#fffbe6',
              border: '1px solid #ffe58f',
              borderRadius: 8,
              marginBottom: 16
            }}>
              <Spin size="small" />
              <span style={{ color: '#d48806', fontWeight: 500 }}>
                Đang chờ xác nhận thanh toán...
              </span>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12 }}>
            <Button 
              block
              size="large"
              onClick={handleCancelPayment}
            >
              Thanh toán sau
            </Button>
            <Button 
              type="primary"
              block
              size="large"
              onClick={() => {
                message.info('Vui lòng chờ hệ thống tự động xác nhận thanh toán');
              }}
            >
              Đã thanh toán
            </Button>
          </div>

          <div style={{ 
            marginTop: 16,
            fontSize: 13,
            color: '#8c8c8c',
            textAlign: 'center'
          }}>
            💡 Hệ thống sẽ tự động xác nhận khi nhận được thanh toán
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default CheckoutPage;
