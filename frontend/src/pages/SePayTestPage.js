import React, { useState } from 'react';
import { Card, Form, Input, Button, message, Divider } from 'antd';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

function SePayTestPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [checkoutData, setCheckoutData] = useState(null);

  const handleTest = async (values) => {
    try {
      setLoading(true);
      
      // Tạo test checkout
      const checkoutRequest = {
        customerName: values.customerName,
        customerEmail: values.customerEmail,
        customerPhone: values.customerPhone,
        shippingAddress: 'Test Address',
        shippingCity: 'Hà Nội',
        shippingWard: 'Test Ward',
        paymentMethod: 'SEPAY',
        sessionId: 'test-session-' + Date.now()
      };

      const response = await axios.post(
        `${API_BASE_URL}/orders/sepay/checkout`,
        checkoutRequest
      );

      setCheckoutData(response.data);
      message.success('Tạo checkout thành công! Kiểm tra response bên dưới.');
    } catch (error) {
      console.error('Test error:', error);
      message.error('Lỗi: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitToSePay = () => {
    if (checkoutData && checkoutData.checkout_url) {
      // Redirect to SePay checkout URL
      window.location.href = checkoutData.checkout_url;
    } else {
      message.error('Không có checkout URL');
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 24px' }}>
      <h1>SePay Integration Test</h1>
      
      <Card title="Test Checkout" style={{ marginBottom: 24 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleTest}
          initialValues={{
            customerName: 'Nguyễn Văn Test',
            customerEmail: 'test@example.com',
            customerPhone: '0912345678'
          }}
        >
          <Form.Item
            label="Tên khách hàng"
            name="customerName"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="customerEmail"
            rules={[{ required: true, type: 'email' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="customerPhone"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={loading}>
            Tạo Test Checkout
          </Button>
        </Form>
      </Card>

      {checkoutData && (
        <>
          <Card title="Checkout Response" style={{ marginBottom: 24 }}>
            <div style={{ marginBottom: 16 }}>
              <strong>Status:</strong>
              <div style={{ 
                background: checkoutData.status === 'success' ? '#f6ffed' : '#fff2e8', 
                padding: 8, 
                borderRadius: 4,
                marginTop: 4,
                color: checkoutData.status === 'success' ? '#52c41a' : '#fa8c16',
                fontWeight: 600
              }}>
                {checkoutData.status}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <strong>Checkout URL:</strong>
              <div style={{ 
                background: '#f5f5f5', 
                padding: 8, 
                borderRadius: 4,
                marginTop: 4,
                wordBreak: 'break-all'
              }}>
                {checkoutData.checkout_url || 'N/A'}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <strong>Order Number:</strong>
              <div style={{ 
                background: '#f5f5f5', 
                padding: 8, 
                borderRadius: 4,
                marginTop: 4
              }}>
                {checkoutData.order_invoice_number || 'N/A'}
              </div>
            </div>

            <Divider />

            <div>
              <strong>Full Response:</strong>
              <pre style={{ 
                background: '#f5f5f5', 
                padding: 16, 
                borderRadius: 4,
                marginTop: 8,
                overflow: 'auto'
              }}>
                {JSON.stringify(checkoutData, null, 2)}
              </pre>
            </div>

            {checkoutData.checkout_url && (
              <Button 
                type="primary" 
                size="large"
                onClick={handleSubmitToSePay}
                style={{ marginTop: 16 }}
              >
                Chuyển đến SePay (Test Payment)
              </Button>
            )}
          </Card>

          <Card title="Test Instructions">
            <ol>
              <li>Nhấn "Submit to SePay" để chuyển đến trang thanh toán test</li>
              <li>Trên trang SePay, chọn phương thức thanh toán test</li>
              <li>Hoàn tất thanh toán test</li>
              <li>Kiểm tra IPN callback trong logs backend</li>
              <li>Verify đơn hàng được cập nhật trạng thái</li>
            </ol>

            <Divider />

            <div>
              <strong>IPN Endpoint:</strong>
              <div style={{ 
                background: '#f5f5f5', 
                padding: 8, 
                borderRadius: 4,
                marginTop: 4
              }}>
                POST {API_BASE_URL}/orders/sepay/ipn
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              <strong>Note:</strong> Đảm bảo IPN URL có thể truy cập từ internet. 
              Nếu đang test local, sử dụng ngrok hoặc công cụ tương tự.
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

export default SePayTestPage;
