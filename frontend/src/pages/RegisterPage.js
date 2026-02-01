import React, { useState } from 'react';
import { Tabs, Form, Input, Button, Typography, Divider, Row, Col, message, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, SafetyOutlined, MedicineBoxOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import useFallingFlowers from '../hooks/useFallingFlowers';
import '../styles/animations.css';

const { Title, Text, Paragraph } = Typography;

function RegisterPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const flowerContainerRef = useFallingFlowers(10);

  const handleRegister = async (values) => {
    setLoading(true);
    try {
      // Only allow PATIENT registration
      const userData = {
        ...values,
        role: 'PATIENT'
      };
      await userAPI.register(userData);
      message.success('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (error) {
      message.error(error.response?.data?.message || 'Đăng ký thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={flowerContainerRef} className="login-page" style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: 500, width: '100%' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <MedicineBoxOutlined style={{ fontSize: 64, color: '#fff' }} />
          <Title level={2} style={{ color: '#fff', marginTop: 16, marginBottom: 8 }}>
            Doctor Appointment
          </Title>
          <Paragraph style={{ color: 'rgba(255,255,255,0.7)' }}>
            Đăng ký để đặt lịch khám bác sĩ
          </Paragraph>
        </div>

        {/* Register Card */}
        <div className="glass-card" style={{ 
          background: 'rgba(255,255,255,0.95)',
          borderRadius: 20,
          padding: '40px 32px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}>
          <Title level={4} style={{ textAlign: 'center', marginBottom: 24 }}>Đăng Ký Tài Khoản</Title>
          
          <Form form={form} layout="vertical" onFinish={handleRegister} size="large">
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="firstName"
                  rules={[{ required: true, message: 'Vui lòng nhập họ!' }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Họ" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="lastName"
                  rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Tên" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' }
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Email" />
            </Form.Item>

            <Form.Item
              name="phone"
              rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
            >
              <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Mật khẩu không khớp!'));
                  },
                }),
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu" />
            </Form.Item>

            <Form.Item name="agreement" valuePropName="checked" rules={[
              { validator: (_, value) => value ? Promise.resolve() : Promise.reject('Vui lòng đồng ý với điều khoản!') }
            ]}>
              <Checkbox>
                Tôi đồng ý với <a href="#" onClick={(e) => e.preventDefault()}>điều khoản sử dụng</a>
              </Checkbox>
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading} 
                block 
                style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  height: 48,
                  fontSize: 16,
                  fontWeight: 600
                }}
              >
                Đăng Ký Ngay
              </Button>
            </Form.Item>
          </Form>

          <Divider plain>hoặc</Divider>

          <div style={{ textAlign: 'center' }}>
            <Text type="secondary">Đã có tài khoản? </Text>
            <Button type="link" onClick={() => navigate('/login')} style={{ padding: 0 }}>
              Đăng nhập ngay
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
