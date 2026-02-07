import React, { useState } from 'react';
import { Card, Form, Input, Button, message, Typography } from 'antd';
import axios from 'axios';

const { Title, Text } = Typography;

function PaymentTestPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleConfirmPayment = async (values) => {
    try {
      setLoading(true);
      
      // Gọi API để xác nhận thanh toán
      await axios.post('http://localhost:8080/api/orders/webhook/payment', {
        orderNumber: values.orderNumber,
        status: 'SUCCESS',
        transactionId: `TXN${Date.now()}`,
        amount: values.amount
      });

      message.success('Đã xác nhận thanh toán thành công!');
      form.resetFields();
    } catch (error) {
      console.error('Error confirming payment:', error);
      message.error('Lỗi khi xác nhận thanh toán!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: '#f0f2f5',
      padding: '40px 24px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Card 
        style={{ 
          maxWidth: 500,
          width: '100%',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={3}>🏦 Giả lập xác nhận thanh toán</Title>
          <Text type="secondary">
            Trang này dùng để test xác nhận thanh toán (giả lập webhook từ ngân hàng)
          </Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleConfirmPayment}
        >
          <Form.Item
            label="Mã đơn hàng"
            name="orderNumber"
            rules={[{ required: true, message: 'Vui lòng nhập mã đơn hàng!' }]}
          >
            <Input 
              placeholder="ORD20260207..." 
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Số tiền (VNĐ)"
            name="amount"
            rules={[{ required: true, message: 'Vui lòng nhập số tiền!' }]}
          >
            <Input 
              type="number"
              placeholder="500000" 
              size="large"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={loading}
            style={{ marginTop: 16 }}
          >
            Xác nhận thanh toán
          </Button>
        </Form>

        <div style={{ 
          marginTop: 24,
          padding: 16,
          background: '#e6f7ff',
          border: '1px solid #91d5ff',
          borderRadius: 8
        }}>
          <Text style={{ fontSize: 13, color: '#0050b3' }}>
            <strong>💡 Hướng dẫn:</strong><br />
            1. Tạo đơn hàng với phương thức "Chuyển khoản ngân hàng"<br />
            2. Copy mã đơn hàng từ modal QR<br />
            3. Paste vào form này và nhấn "Xác nhận thanh toán"<br />
            4. Hệ thống sẽ tự động cập nhật trạng thái thanh toán
          </Text>
        </div>
      </Card>
    </div>
  );
}

export default PaymentTestPage;
