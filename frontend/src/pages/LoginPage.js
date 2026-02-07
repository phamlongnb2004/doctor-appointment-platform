import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Space, Tabs, Divider, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, GoogleOutlined, FacebookOutlined, MedicineBoxOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import webSocketService from '../services/websocket';
import useFallingFlowers from '../hooks/useFallingFlowers';
import '../styles/animations.css';

const { Title, Text, Link } = Typography;

function LoginPage({ onLogin }) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();
  const flowerContainerRef = useFallingFlowers({ maxPetals: 50 });

  const onFinishLogin = async (values) => {
    setLoading(true);
    try {
      const response = await userAPI.login(values.email, values.password);
      const userData = response.data;

      // Check if login was successful
      if (!userData || !userData.token) {
        message.error('Email hoặc mật khẩu không đúng!');
        return;
      }

      // Save token to localStorage
      localStorage.setItem('token', userData.token);
      localStorage.setItem('userId', userData.id);
      localStorage.setItem('sessionId', userData.sessionId);
      localStorage.setItem('userEmail', userData.email);
      localStorage.setItem('userFirstName', userData.firstName);
      localStorage.setItem('userLastName', userData.lastName);
      localStorage.setItem('userRole', userData.role);
      if (userData.profileImage) {
        localStorage.setItem('profileImageUrl', userData.profileImage);
      }
      console.log('Token saved to localStorage');

      // Connect to WebSocket for real-time status
      if (userData.sessionId) {
        webSocketService.connect(userData.id, userData.sessionId, (status) => {
          console.log('WebSocket status update:', status);
        });
        console.log('WebSocket connected for user:', userData.id);
      }

      onLogin(userData);
      message.success('Đăng nhập thành công!');
      navigate(userData.role === 'ADMIN' ? '/admin' : '/');
    } catch (error) {
      console.error('Login error:', error);
      message.error(error.response?.data?.error || 'Email hoặc mật khẩu không đúng!');
    } finally {
      setLoading(false);
    }
  };

  const onFinishRegister = async (values) => {
    setLoading(true);
    try {
      await userAPI.register({
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        role: 'PATIENT'
      });
      message.success('Đăng ký thành công! Vui lòng đăng nhập.');
      setActiveTab('login');
    } catch (error) {
      message.error(error.response?.data?.error || 'Đăng ký thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      padding: '20px',
      position: 'relative'
    }}>
      {/* Flower Animation Container */}
      <div ref={flowerContainerRef} id="hoamaitet" />
      
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <div style={{ 
          position: 'absolute', top: '20%', left: '10%', width: 400, height: 400, 
          background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
          borderRadius: '50%'
        }}></div>
        <div style={{ 
          position: 'absolute', bottom: '20%', right: '10%', width: 500, height: 500, 
          background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
          borderRadius: '50%'
        }}></div>
      </div>

      <Card 
        className="glass-card" 
        style={{ 
          width: '100%', 
          maxWidth: 450, 
          borderRadius: 24,
          boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <MedicineBoxOutlined style={{ fontSize: 48, color: '#667eea' }} />
          <Title level={2} style={{ margin: '16px 0 8px' }}>Doctor Appointment</Title>
          <Text type="secondary">Nền tảng đặt lịch khám bác sĩ hàng đầu</Text>
        </div>

        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          centered
          items={[
            {
              key: 'login',
              label: 'Đăng nhập',
              children: (
                <Form name="login" onFinish={onFinishLogin} layout="vertical" size="large">
                  <Form.Item name="email" rules={[{ required: true, message: 'Vui lòng nhập email!', type: 'email' }]}>
                    <Input prefix={<MailOutlined />} placeholder="Email" className="input-beautiful" />
                  </Form.Item>
                  <Form.Item name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
                    <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" className="input-beautiful" />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block className="btn-gradient">
                      Đăng nhập
                    </Button>
                  </Form.Item>
                </Form>
              )
            },
            {
              key: 'register',
              label: 'Đăng ký',
              children: (
                <Form name="register" onFinish={onFinishRegister} layout="vertical" size="large">
                  <Space style={{ width: '100%' }} size="middle">
                    <Form.Item name="firstName" rules={[{ required: true, message: 'Nhập họ!' }]} style={{ flex: 1 }}>
                      <Input prefix={<UserOutlined />} placeholder="Họ" className="input-beautiful" />
                    </Form.Item>
                    <Form.Item name="lastName" rules={[{ required: true, message: 'Nhập tên!' }]} style={{ flex: 1 }}>
                      <Input placeholder="Tên" className="input-beautiful" />
                    </Form.Item>
                  </Space>
                  <Form.Item name="email" rules={[{ required: true, message: 'Nhập email!', type: 'email' }]}>
                    <Input prefix={<MailOutlined />} placeholder="Email" className="input-beautiful" />
                  </Form.Item>
                  <Form.Item name="phone" rules={[{ required: true, message: 'Nhập số điện thoại!' }]}>
                    <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại" className="input-beautiful" />
                  </Form.Item>
                  <Form.Item name="password" rules={[{ required: true, message: 'Nhập mật khẩu!', min: 6 }]}>
                    <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu (>=6 ký tự)" className="input-beautiful" />
                  </Form.Item>
                  <Form.Item name="confirmPassword" dependencies={['password']} rules={[
                    { required: true, message: 'Xác nhận mật khẩu!' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) return Promise.resolve();
                        return Promise.reject(new Error('Mật khẩu không khớp!'));
                      }
                    })
                  ]}>
                    <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu" className="input-beautiful" />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block className="btn-gradient">
                      Đăng ký
                    </Button>
                  </Form.Item>
                </Form>
              )
            }
          ]}
        />

        <Divider plain>
          <Text type="secondary" style={{ fontSize: 12 }}>Hoặc đăng nhập với</Text>
        </Divider>

        <Space style={{ width: '100%', justifyContent: 'center' }}>
          <Button icon={<GoogleOutlined />} size="large" className="glass-card">Google</Button>
          <Button icon={<FacebookOutlined />} size="large" className="glass-card">Facebook</Button>
        </Space>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Link onClick={() => navigate('/')}>← Quay về trang chủ</Link>
        </div>
      </Card>
    </div>
  );
}

export default LoginPage;
