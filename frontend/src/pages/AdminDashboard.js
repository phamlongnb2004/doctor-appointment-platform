import React, { useState, useEffect } from 'react';
import { Layout, Menu, Card, Row, Col, Typography, Table, Tag, Button, Space, Modal, Form, Select, Input, message, Avatar, Dropdown, Badge, Progress, List, Typography as AntTypography, Drawer } from 'antd';
import { DashboardOutlined, UserOutlined, TeamOutlined, CalendarOutlined, LogoutOutlined, SettingOutlined, MedicineBoxOutlined, EditOutlined, BellOutlined, PlusOutlined, SearchOutlined, FilterOutlined, ArrowUpOutlined, ArrowDownOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, WifiOutlined, MenuOutlined, CloseOutlined, MailOutlined, DeleteOutlined, ShoppingCartOutlined, BarChartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { userAPI, doctorAPI, appointmentAPI } from '../services/api';
import webSocketService from '../services/websocket';
import ReportsTab from '../components/admin/ReportsTab';
import '../styles/admin.css';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Paragraph } = AntTypography;

// Get API base URL from environment variable
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

function AdminDashboard({ user, onLogout }) {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [selectedKey, setSelectedKey] = useState(() => {
    // Restore last active tab from localStorage
    return localStorage.getItem('adminActiveTab') || 'overview';
  });
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    onlineUsers: 0
  });
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [newsletterSubscribers, setNewsletterSubscribers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [onlineUsersList, setOnlineUsersList] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userAvatar, setUserAvatar] = useState(null);
  const [editForm] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
    fetchOnlineUsers();
    fetchUserAvatar();

    // Subscribe to WebSocket status updates
    const handleStatusChange = (status) => {
      console.log('Status change received:', status);
      if (status.type === 'USER_LOGIN' || status.type === 'USER_LOGOUT' || status.type === 'USER_DISCONNECT') {
        fetchOnlineUsers();
        fetchDashboardData();
      }
    };

    // Set up WebSocket subscription if not already connected
    if (!webSocketService.isConnected()) {
      const userId = parseInt(localStorage.getItem('userId'));
      const sessionId = localStorage.getItem('sessionId');
      if (userId && sessionId) {
        webSocketService.connect(userId, sessionId, handleStatusChange);
      }
    }

    // Set up polling for online users (every 30 seconds)
    const pollingInterval = setInterval(() => {
      fetchOnlineUsers();
    }, 30000);

    return () => {
      clearInterval(pollingInterval);
    };
  }, []);

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchOnlineUsers = async () => {
    try {
      const response = await userAPI.getOnlineUsers();
      const onlineList = response.data || [];
      setOnlineUsersList(onlineList);
      const onlineIds = new Set(onlineList.map(u => u.userId));
      setOnlineUsers(onlineIds);

      // Update stats with online count
      setStats(prev => ({
        ...prev,
        onlineUsers: onlineList.length
      }));
    } catch (error) {
      console.error('Error fetching online users:', error);
    }
  };

  const fetchUserAvatar = async () => {
    try {
      const userId = localStorage.getItem('userId');
      console.log('AdminDashboard - Fetching avatar for userId:', userId);
      if (userId) {
        const response = await userAPI.getUserById(userId);
        console.log('AdminDashboard - User data:', response.data);
        console.log('AdminDashboard - Profile image:', response.data.profileImage);
        if (response.data.profileImage) {
          // profileImage already contains full URL or relative path
          const avatarUrl = response.data.profileImage.startsWith('http') 
            ? response.data.profileImage 
            : `${API_BASE_URL.replace('/api', '')}${response.data.profileImage}`;
          console.log('AdminDashboard - Setting avatar URL:', avatarUrl);
          setUserAvatar(avatarUrl);
        } else {
          console.log('AdminDashboard - No profile image found');
        }
      }
    } catch (error) {
      console.error('Error fetching user avatar:', error);
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [usersRes, doctorsRes, appointmentsRes, onlineUsersRes, newsletterRes, ordersRes] = await Promise.all([
        userAPI.getAllUsers(),
        doctorAPI.getAllDoctors(),
        appointmentAPI.getAllAppointments(),
        userAPI.getOnlineUsers(),
        fetch(`${API_BASE_URL}/newsletter/subscribers`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }).then(res => res.json()).catch(() => []),
        fetch(`${API_BASE_URL}/orders/all`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }).then(res => res.json()).catch(() => [])
      ]);

      const allUsers = usersRes.data || [];
      const allDoctors = doctorsRes.data || [];
      const allAppointments = appointmentsRes.data || [];
      const onlineList = onlineUsersRes.data || [];
      const allSubscribers = Array.isArray(newsletterRes) ? newsletterRes : [];
      const allOrders = Array.isArray(ordersRes) ? ordersRes : [];

      setUsers(allUsers);
      setDoctors(allDoctors);
      setAppointments(allAppointments);
      setOnlineUsersList(onlineList);
      setNewsletterSubscribers(allSubscribers);
      setOrders(allOrders);
      
      const onlineIds = new Set(onlineList.map(u => u.userId));
      setOnlineUsers(onlineIds);

      setStats({
        totalUsers: allUsers.length,
        totalDoctors: allDoctors.length,
        totalAppointments: allAppointments.length,
        pendingAppointments: allAppointments.filter(a => a.status === 'PENDING').length,
        onlineUsers: onlineList.length
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = ({ key }) => {
    setSelectedKey(key);
    // Save active tab to localStorage
    localStorage.setItem('adminActiveTab', key);
    setMobileMenuVisible(false); // Close mobile menu after selection
    if (key === 'logout') {
      onLogout();
      navigate('/');
    } else if (key === 'cms') {
      navigate('/admin/cms');
    }
  };

  const handleEditUser = (record) => {
    setEditingUser(record);
    editForm.setFieldsValue({
      role: record.role,
      firstName: record.firstName,
      lastName: record.lastName,
      email: record.email
    });
    setEditModalVisible(true);
  };

  const handleSaveUser = async () => {
    try {
      const values = await editForm.validateFields();
      await userAPI.updateUser(editingUser.id, values);

      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...values } : u));

      message.success('Cập nhật thành công!');
      setEditModalVisible(false);
      fetchDashboardData();
    } catch (error) {
      message.error('Cập nhật thất bại!');
    }
  };

  const handlePromoteToDoctor = async (userId) => {
    try {
      // Sử dụng secret endpoint để promote user lên DOCTOR
      const response = await fetch(`${API_BASE_URL}/users/${userId}/promote?secret=mySuperSecretAdminKey2026&role=DOCTOR`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        message.success('Đã phong bác sĩ thành công!');
        fetchDashboardData(); // Reload data to show updated role
      } else {
        const error = await response.json();
        message.error('Thất bại: ' + (error.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error promoting to doctor:', error);
      message.error('Thất bại: ' + error.message);
    }
  };

  const handlePromoteToConsultant = async (userId) => {
    try {
      // Sử dụng secret endpoint để promote user lên CONSULTANT
      const response = await fetch(`${API_BASE_URL}/users/${userId}/promote?secret=mySuperSecretAdminKey2026&role=CONSULTANT`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        message.success('Đã phong tư vấn viên thành công!');
        fetchDashboardData(); // Reload data to show updated role
      } else {
        const error = await response.json();
        message.error('Thất bại: ' + (error.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error promoting to consultant:', error);
      message.error('Thất bại: ' + error.message);
    }
  };

  const menuItems = [
    { key: 'overview', icon: <DashboardOutlined />, label: 'Tổng quan' },
    { key: 'reports', icon: <BarChartOutlined />, label: 'Báo cáo & Thống kê' },
    { key: 'users', icon: <TeamOutlined />, label: 'Quản lý người dùng' },
    { key: 'doctors', icon: <MedicineBoxOutlined />, label: 'Quản lý bác sĩ' },
    { key: 'appointments', icon: <CalendarOutlined />, label: 'Lịch hẹn' },
    { key: 'orders', icon: <ShoppingCartOutlined />, label: 'Quản lý đơn hàng' },
    { key: 'newsletter', icon: <MailOutlined />, label: 'Thành viên Newsletter' },
    { key: 'cms', icon: <EditOutlined />, label: 'Quản lý nội dung' },
    { key: 'settings', icon: <SettingOutlined />, label: 'Cài đặt' },
    { type: 'divider' },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Đăng xuất', danger: true },
  ];

  const getRoleTagColor = (role) => {
    switch (role) {
      case 'ADMIN': return '#f50';
      case 'DOCTOR': return '#2f54eb';
      case 'CONSULTANT': return '#52c41a';
      case 'PATIENT': return '#1890ff';
      default: return '#d9d9d9';
    }
  };

  const getRoleDisplay = (role) => {
    switch (role) {
      case 'ADMIN': return 'Quản trị';
      case 'DOCTOR': return 'Bác sĩ';
      case 'CONSULTANT': return 'Tư vấn';
      case 'PATIENT': return 'Bệnh nhân';
      default: return role;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return '#52c41a';
      case 'PENDING': return '#faad14';
      case 'CONFIRMED': return '#13c2c2';
      case 'CANCELLED': return '#ff4d4f';
      default: return '#d9d9d9';
    }
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'COMPLETED': return 'Hoàn thành';
      case 'PENDING': return 'Chờ xác nhận';
      case 'CONFIRMED': return 'Đã xác nhận';
      case 'CANCELLED': return 'Đã hủy';
      default: return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'PENDING': return <ClockCircleOutlined style={{ color: '#faad14' }} />;
      case 'CONFIRMED': return <CheckCircleOutlined style={{ color: '#13c2c2' }} />;
      case 'CANCELLED': return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
      default: return null;
    }
  };

  // Transform data for tables
  const userTableData = users.map((u, index) => ({
    key: index,
    id: u.id,
    firstName: u.firstName || '',
    lastName: u.lastName || '',
    name: `${u.firstName || ''} ${u.lastName || ''}`,
    email: u.email || '',
    phone: u.phone || '',
    role: u.role || 'PATIENT',
    status: u.active !== false ? 'Hoạt động' : 'Khóa',
    onlineStatus: onlineUsers.has(u.id) ? 'online' : 'offline'
  }));

  const doctorTableData = doctors.map((d, index) => ({
    key: index,
    id: d.id,
    userId: d.userId,
    name: `${d.firstName || ''} ${d.lastName || ''}`,
    email: d.email || '',
    specialization: d.specialization || '',
    experienceYears: d.experienceYears || 0,
    consultationFee: d.consultationFee || 0,
    ratingScore: d.ratingScore || 0,
    status: d.active !== false ? 'Hoạt động' : 'Khóa'
  }));

  const appointmentTableData = appointments.map((a, index) => ({
    key: index,
    id: a.id,
    patient: `${a.patient?.firstName || ''} ${a.patient?.lastName || ''}`,
    patientPhone: a.patient?.phone || '',
    doctor: `${a.doctor?.firstName || ''} ${a.doctor?.lastName || ''}`,
    specialization: a.doctor?.specialization || '',
    date: a.appointmentDate || '',
    time: a.timeSlot || '',
    notes: a.notes || '',
    status: a.status || 'PENDING'
  }));

  const userColumns = [
    {
      title: 'Người dùng',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar
            size={40}
            style={{
              backgroundColor: getRoleTagColor(record.role),
              fontWeight: 600
            }}
          >
            {record.firstName?.charAt(0)}{record.lastName?.charAt(0)}
          </Avatar>
          <div>
            <Text strong style={{ display: 'block', fontSize: 14 }}>{text}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>{record.email}</Text>
          </div>
        </div>
      )
    },
    { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone', width: 130 },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      width: 120,
      render: (role) => (
        <Tag
          style={{
            borderRadius: 20,
            padding: '2px 12px',
            border: 'none',
            background: `${getRoleTagColor(role)}15`,
            color: getRoleTagColor(role),
            fontWeight: 500
          }}
        >
          {getRoleDisplay(role)}
        </Tag>
      )
    },
    {
      title: 'Trạng thái hoạt động',
      dataIndex: 'onlineStatus',
      key: 'onlineStatus',
      width: 140,
      render: (status) => {
        const isOnline = status === 'online';
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Badge
              status={isOnline ? 'success' : 'default'}
              style={{ width: 8, height: 8 }}
            />
            <Text style={{
              color: isOnline ? '#52c41a' : '#8c8c8c',
              fontSize: 13,
              fontWeight: 500
            }}>
              {isOnline ? 'Đang hoạt động' : 'Offline'}
            </Text>
          </div>
        );
      }
    },
    {
      title: 'Trạng thái tài khoản',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => (
        <Badge
          status={status === 'Hoạt động' ? 'success' : 'error'}
          text={<Text style={{ color: status === 'Hoạt động' ? '#52c41a' : '#ff4d4f' }}>{status}</Text>}
        />
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Button
            type="text"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEditUser(record)}
            style={{
              borderRadius: 8,
              color: '#667eea',
              background: '#667eea15'
            }}
          >
            Sửa
          </Button>
          {record.role === 'PATIENT' && (
            <>
              <Button
                type="text"
                size="small"
                onClick={() => handlePromoteToDoctor(record.id)}
                style={{
                  borderRadius: 8,
                  color: '#2f54eb',
                  background: '#2f54eb15'
                }}
              >
                Phong BS
              </Button>
              <Button
                type="text"
                size="small"
                onClick={() => handlePromoteToConsultant(record.id)}
                style={{
                  borderRadius: 8,
                  color: '#52c41a',
                  background: '#52c41a15',
                  marginLeft: 4
                }}
              >
                Phong TV
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  const doctorColumns = [
    {
      title: 'Bác sĩ',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar
            size={40}
            style={{ backgroundColor: '#2f54eb' }}
          >
            {record.name.split(' ').map(n => n.charAt(0)).join('').slice(0, 2)}
          </Avatar>
          <div>
            <Text strong style={{ display: 'block', fontSize: 14 }}>{text}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>{record.email}</Text>
          </div>
        </div>
      )
    },
    { title: 'Chuyên khoa', dataIndex: 'specialization', key: 'specialization', width: 150 },
    {
      title: 'Kinh nghiệm',
      dataIndex: 'experienceYears',
      key: 'experienceYears',
      width: 100,
      render: (years) => <Text>{years} năm</Text>
    },
    {
      title: 'Phí khám',
      dataIndex: 'consultationFee',
      key: 'consultationFee',
      width: 120,
      render: (fee) => <Text strong style={{ color: '#667eea' }}>{fee?.toLocaleString()} VNĐ</Text>
    },
    {
      title: 'Đánh giá',
      dataIndex: 'ratingScore',
      key: 'ratingScore',
      width: 100,
      render: (score) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ color: '#faad14', fontWeight: 600 }}>{score?.toFixed(1) || '0.0'}</span>
        </div>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => (
        <Badge
          status={status === 'Hoạt động' ? 'success' : 'error'}
          text={<Text style={{ color: status === 'Hoạt động' ? '#52c41a' : '#ff4d4f' }}>{status}</Text>}
        />
      )
    },
  ];

  const appointmentColumns = [
    {
      title: 'Bệnh nhân',
      dataIndex: 'patient',
      key: 'patient',
      width: 180,
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar size={36} style={{ backgroundColor: '#52c41a' }}>
            {text.split(' ').map(n => n.charAt(0)).join('').slice(0, 2)}
          </Avatar>
          <div>
            <Text strong style={{ display: 'block', fontSize: 14 }}>{text}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>{record.patientPhone}</Text>
          </div>
        </div>
      )
    },
    {
      title: 'Bác sĩ',
      dataIndex: 'doctor',
      key: 'doctor',
      width: 160,
      render: (text, record) => (
        <div>
          <Text strong style={{ fontSize: 14 }}>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>{record.specialization}</Text>
        </div>
      )
    },
    {
      title: 'Thời gian',
      key: 'datetime',
      width: 140,
      render: (_, record) => (
        <div>
          <Text style={{ fontSize: 14 }}>{record.date}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>{record.time}</Text>
        </div>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: (status) => (
        <Tag
          style={{
            borderRadius: 20,
            padding: '4px 12px',
            border: 'none',
            background: `${getStatusColor(status)}15`,
            color: getStatusColor(status),
            fontWeight: 500,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          {getStatusIcon(status)}
          {getStatusDisplay(status)}
        </Tag>
      )
    },
    {
      title: 'Ghi chú',
      dataIndex: 'notes',
      key: 'notes',
      width: 180,
      ellipsis: true,
      render: (text) => (
        <Paragraph
          type="secondary"
          ellipsis={{ rows: 1 }}
          style={{ margin: 0, fontSize: 13 }}
        >
          {text || '-'}
        </Paragraph>
      )
    },
  ];

  const userMenuItems = [
    { key: 'profile', icon: <UserOutlined />, label: 'Hồ sơ' },
    { key: 'settings', icon: <SettingOutlined />, label: 'Cài đặt' },
    { type: 'divider' },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Đăng xuất', danger: true },
  ];

  const handleUserMenuClick = ({ key }) => {
    if (key === 'logout') {
      onLogout();
      navigate('/');
    } else if (key === 'profile') {
      navigate('/profile');
    } else if (key === 'settings') {
      // Navigate to settings or show settings modal
      message.info('Chức năng cài đặt đang được phát triển');
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="admin-loading">
          <div className="admin-loading-spinner">
            <div className="spinner-ring"></div>
            <MedicineBoxOutlined style={{ fontSize: 48, color: '#667eea' }} />
          </div>
          <Text className="loading-text">�ang tải dữ liệu...</Text>
        </div>
      );
    }

    switch (selectedKey) {
      case 'reports':
        return <ReportsTab />;
      case 'users':
        return (
          <div className="admin-section">
            <div className="admin-section-header">
              <div className="admin-section-title">
                <TeamOutlined />
                <Title level={3}>Quản lý người dùng</Title>
              </div>
              <div className="admin-section-actions">
                <Input
                  placeholder="Tìm kiếm người dùng..."
                  prefix={<SearchOutlined style={{ color: '#999' }} />}
                  className="admin-search-input"
                />
                <Button type="primary" icon={<PlusOutlined />} className="admin-btn-primary">
                  Thêm người dùng
                </Button>
              </div>
            </div>
            <Card className="admin-card" style={{ borderRadius: 24 }}>
              <Table
                dataSource={userTableData}
                columns={userColumns}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showTotal: (total) => `Tổng ${total} người dùng`
                }}
                rowKey="key"
                className="admin-table"
                scroll={{ x: 920 }}
              />
            </Card>
          </div>
        );
      case 'doctors':
        return (
          <div className="admin-section">
            <div className="admin-section-header">
              <div className="admin-section-title">
                <MedicineBoxOutlined />
                <Title level={3}>Quản lý bác sĩ</Title>
              </div>
              <div className="admin-section-actions">
                <Input
                  placeholder="Tìm kiếm bác sĩ..."
                  prefix={<SearchOutlined style={{ color: '#999' }} />}
                  className="admin-search-input"
                />
                <Button type="primary" icon={<PlusOutlined />} className="admin-btn-primary">
                  Thêm bác sĩ
                </Button>
              </div>
            </div>
            <Card className="admin-card" style={{ borderRadius: 24 }}>
              <Table
                dataSource={doctorTableData}
                columns={doctorColumns}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showTotal: (total) => `Tổng ${total} bác sĩ`
                }}
                rowKey="key"
                className="admin-table"
                scroll={{ x: 1030 }}
              />
            </Card>
          </div>
        );
      case 'appointments':
        return (
          <div className="admin-section">
            <div className="admin-section-header">
              <div className="admin-section-title">
                <CalendarOutlined />
                <Title level={3}>Quản lý lịch hẹn</Title>
              </div>
              <div className="admin-section-actions">
                <Input
                  placeholder="Tìm kiếm lịch hẹn..."
                  prefix={<SearchOutlined style={{ color: '#999' }} />}
                  className="admin-search-input"
                />
                <Button icon={<FilterOutlined />} className="admin-btn-secondary">
                  Lọc
                </Button>
              </div>
            </div>
            <Card className="admin-card" style={{ borderRadius: 24 }}>
              <Table
                dataSource={appointmentTableData}
                columns={appointmentColumns}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showTotal: (total) => `Tổng ${total} lịch hẹn`
                }}
                rowKey="key"
                className="admin-table"
                scroll={{ x: 920 }}
              />
            </Card>
          </div>
        );
      case 'newsletter':
        return (
          <div className="admin-section">
            <div className="admin-section-header">
              <div className="admin-section-title">
                <MailOutlined />
                <Title level={3}>Quản lý thành viên Newsletter</Title>
              </div>
              <div className="admin-section-actions">
                <Input
                  placeholder="Tìm kiếm email..."
                  prefix={<SearchOutlined style={{ color: '#999' }} />}
                  className="admin-search-input"
                />
              </div>
            </div>
            <Card className="admin-card" style={{ borderRadius: 24 }}>
              <Table
                dataSource={newsletterSubscribers.map((sub, index) => ({
                  key: index,
                  id: sub.id,
                  email: sub.email,
                  name: sub.name || '-',
                  phone: sub.phone || '-',
                  isVerified: sub.isVerified,
                  isActive: sub.isActive,
                  createdAt: sub.createdAt ? new Date(sub.createdAt).toLocaleString('vi-VN') : '-',
                  verifiedAt: sub.verifiedAt ? new Date(sub.verifiedAt).toLocaleString('vi-VN') : '-'
                }))}
                columns={[
                  {
                    title: 'Email',
                    dataIndex: 'email',
                    key: 'email',
                    width: 220,
                    render: (text) => <Text strong>{text}</Text>
                  },
                  {
                    title: 'Tên',
                    dataIndex: 'name',
                    key: 'name',
                    width: 150
                  },
                  {
                    title: 'Số điện thoại',
                    dataIndex: 'phone',
                    key: 'phone',
                    width: 130
                  },
                  {
                    title: 'Xác nhận',
                    dataIndex: 'isVerified',
                    key: 'isVerified',
                    width: 100,
                    render: (verified) => (
                      <Tag color={verified ? 'success' : 'warning'}>
                        {verified ? 'Đã xác nhận' : 'Chưa xác nhận'}
                      </Tag>
                    )
                  },
                  {
                    title: 'Trạng thái',
                    dataIndex: 'isActive',
                    key: 'isActive',
                    width: 100,
                    render: (active, record) => (
                      <Button
                        type="text"
                        size="small"
                        onClick={async () => {
                          try {
                            await fetch(`${API_BASE_URL}/newsletter/subscribers/${record.id}/toggle`, {
                              method: 'PUT',
                              headers: {
                                'Authorization': `Bearer ${localStorage.getItem('token')}`
                              }
                            });
                            message.success('Đã cập nhật trạng thái!');
                            fetchDashboardData();
                          } catch (error) {
                            message.error('Có lỗi xảy ra!');
                          }
                        }}
                      >
                        <Tag color={active ? 'success' : 'default'}>
                          {active ? 'Hoạt động' : 'Tạm dừng'}
                        </Tag>
                      </Button>
                    )
                  },
                  {
                    title: 'Ngày đăng ký',
                    dataIndex: 'createdAt',
                    key: 'createdAt',
                    width: 160
                  },
                  {
                    title: 'Ngày xác nhận',
                    dataIndex: 'verifiedAt',
                    key: 'verifiedAt',
                    width: 160
                  },
                  {
                    title: 'Thao tác',
                    key: 'action',
                    width: 100,
                    fixed: 'right',
                    render: (_, record) => (
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        size="small"
                        onClick={async () => {
                          Modal.confirm({
                            title: 'Xác nhận xóa',
                            content: `Bạn có chắc muốn xóa thành viên ${record.email}?`,
                            okText: 'Xóa',
                            cancelText: 'Hủy',
                            okButtonProps: { danger: true },
                            onOk: async () => {
                              try {
                                await fetch(`${API_BASE_URL}/newsletter/subscribers/${record.id}`, {
                                  method: 'DELETE',
                                  headers: {
                                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                                  }
                                });
                                message.success('Đã xóa thành viên!');
                                fetchDashboardData();
                              } catch (error) {
                                message.error('Có lỗi xảy ra!');
                              }
                            }
                          });
                        }}
                      >
                        Xóa
                      </Button>
                    )
                  }
                ]}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showTotal: (total) => `Tổng ${total} thành viên`
                }}
                rowKey="key"
                className="admin-table"
                scroll={{ x: 1200 }}
              />
            </Card>
          </div>
        );
      case 'orders':
        return (
          <div className="admin-section">
            <div className="admin-section-header">
              <div className="admin-section-title">
                <ShoppingCartOutlined />
                <Title level={3}>Quản lý đơn hàng</Title>
              </div>
              <div className="admin-section-actions">
                <Input
                  placeholder="Tìm kiếm đơn hàng..."
                  prefix={<SearchOutlined style={{ color: '#999' }} />}
                  className="admin-search-input"
                />
                <Button icon={<FilterOutlined />} className="admin-btn-secondary">
                  Lọc
                </Button>
              </div>
            </div>
            <Card className="admin-card" style={{ borderRadius: 24 }}>
              <Table
                dataSource={orders.map((order, index) => ({
                  key: index,
                  id: order.id,
                  orderNumber: order.orderNumber,
                  customerName: order.customerName,
                  customerEmail: order.customerEmail,
                  customerPhone: order.customerPhone,
                  totalAmount: order.totalAmount,
                  finalAmount: order.finalAmount,
                  paymentMethod: order.paymentMethod,
                  paymentStatus: order.paymentStatus,
                  status: order.status,
                  itemCount: order.items?.length || 0,
                  createdAt: order.createdAt ? new Date(order.createdAt).toLocaleString('vi-VN') : '-'
                }))}
                columns={[
                  {
                    title: 'Mã đơn hàng',
                    dataIndex: 'orderNumber',
                    key: 'orderNumber',
                    width: 180,
                    render: (text) => <Text strong style={{ color: '#667eea' }}>{text}</Text>
                  },
                  {
                    title: 'Khách hàng',
                    key: 'customer',
                    width: 200,
                    render: (_, record) => (
                      <div>
                        <Text strong style={{ display: 'block', fontSize: 14 }}>{record.customerName}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>{record.customerPhone}</Text>
                      </div>
                    )
                  },
                  {
                    title: 'Số dịch vụ',
                    dataIndex: 'itemCount',
                    key: 'itemCount',
                    width: 100,
                    render: (count) => <Tag color="blue">{count} dịch vụ</Tag>
                  },
                  {
                    title: 'Tổng tiền',
                    dataIndex: 'finalAmount',
                    key: 'finalAmount',
                    width: 140,
                    render: (amount) => (
                      <Text strong style={{ color: '#667eea', fontSize: 15 }}>
                        {amount?.toLocaleString()} VNĐ
                      </Text>
                    )
                  },
                  {
                    title: 'Thanh toán',
                    key: 'payment',
                    width: 140,
                    render: (_, record) => (
                      <div>
                        <Tag color={record.paymentMethod === 'COD' ? 'orange' : 'green'}>
                          {record.paymentMethod === 'COD' ? 'Tiền mặt' : 'Chuyển khoản'}
                        </Tag>
                        <br />
                        <Tag
                          style={{ marginTop: 4 }}
                          color={record.paymentStatus === 'PAID' ? 'success' : 'warning'}
                        >
                          {record.paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                        </Tag>
                      </div>
                    )
                  },
                  {
                    title: 'Trạng thái',
                    dataIndex: 'status',
                    key: 'status',
                    width: 140,
                    render: (status) => {
                      const statusConfig = {
                        PENDING: { color: '#faad14', text: 'Chờ xử lý', icon: <ClockCircleOutlined /> },
                        CONFIRMED: { color: '#13c2c2', text: 'Đã xác nhận', icon: <CheckCircleOutlined /> },
                        PROCESSING: { color: '#1890ff', text: 'Đang xử lý', icon: <ClockCircleOutlined /> },
                        COMPLETED: { color: '#52c41a', text: 'Hoàn thành', icon: <CheckCircleOutlined /> },
                        CANCELLED: { color: '#ff4d4f', text: 'Đã hủy', icon: <CloseCircleOutlined /> }
                      };
                      const config = statusConfig[status] || statusConfig.PENDING;
                      return (
                        <Tag
                          style={{
                            borderRadius: 20,
                            padding: '4px 12px',
                            border: 'none',
                            background: `${config.color}15`,
                            color: config.color,
                            fontWeight: 500,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6
                          }}
                        >
                          {config.icon}
                          {config.text}
                        </Tag>
                      );
                    }
                  },
                  {
                    title: 'Ngày đặt',
                    dataIndex: 'createdAt',
                    key: 'createdAt',
                    width: 160
                  },
                  {
                    title: 'Thao tác',
                    key: 'action',
                    width: 120,
                    fixed: 'right',
                    render: (_, record) => {
                      const getMenuItems = () => {
                        const items = [
                          {
                            key: 'view',
                            label: 'Xem chi tiết',
                            icon: <SearchOutlined />
                          }
                        ];

                        if (record.status === 'PENDING') {
                          items.push({
                            key: 'confirm',
                            label: 'Xác nhận đơn',
                            icon: <CheckCircleOutlined />,
                            style: { color: '#52c41a' }
                          });
                        }

                        if (record.status !== 'CANCELLED' && record.status !== 'COMPLETED') {
                          items.push({
                            key: 'cancel',
                            label: 'Hủy đơn hàng',
                            icon: <CloseCircleOutlined />,
                            danger: true
                          });
                        }

                        return items;
                      };

                      const handleMenuClick = ({ key }) => {
                        const orderDetails = orders.find(o => o.id === record.id);
                        
                        if (key === 'view') {
                          Modal.info({
                            title: 'Chi tiết đơn hàng',
                            width: 700,
                            content: (
                              <div style={{ marginTop: 20 }}>
                                <div style={{ 
                                  background: '#f5f5f5', 
                                  padding: '16px', 
                                  borderRadius: '8px',
                                  marginBottom: '16px'
                                }}>
                                  <Text strong style={{ fontSize: 16, color: '#667eea' }}>
                                    {record.orderNumber}
                                  </Text>
                                </div>
                                
                                <div style={{ marginBottom: 16 }}>
                                  <Text strong>Thông tin khách hàng:</Text>
                                  <div style={{ marginTop: 8, paddingLeft: 16 }}>
                                    <p style={{ margin: '4px 0' }}>• Họ tên: {record.customerName}</p>
                                    <p style={{ margin: '4px 0' }}>• Email: {record.customerEmail}</p>
                                    <p style={{ margin: '4px 0' }}>• Số điện thoại: {record.customerPhone}</p>
                                  </div>
                                </div>

                                <div style={{ marginBottom: 16 }}>
                                  <Text strong>Thông tin đơn hàng:</Text>
                                  <div style={{ marginTop: 8, paddingLeft: 16 }}>
                                    <p style={{ margin: '4px 0' }}>• Số dịch vụ: {record.itemCount}</p>
                                    <p style={{ margin: '4px 0' }}>• Tổng tiền: {record.finalAmount?.toLocaleString()} VNĐ</p>
                                    <p style={{ margin: '4px 0' }}>• Phương thức: {record.paymentMethod === 'COD' ? 'Tiền mặt' : 'Chuyển khoản'}</p>
                                    <p style={{ margin: '4px 0' }}>• Thanh toán: {record.paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}</p>
                                    <p style={{ margin: '4px 0' }}>• Trạng thái: {record.status}</p>
                                    <p style={{ margin: '4px 0' }}>• Ngày đặt: {record.createdAt}</p>
                                  </div>
                                </div>
                              </div>
                            )
                          });
                        } else if (key === 'confirm') {
                          Modal.confirm({
                            title: 'Xác nhận đơn hàng',
                            width: 600,
                            content: (
                              <div style={{ marginTop: 20 }}>
                                <div style={{ 
                                  background: '#f0f9ff', 
                                  padding: '16px', 
                                  borderRadius: '8px',
                                  marginBottom: '16px',
                                  border: '1px solid #bae7ff'
                                }}>
                                  <Text strong style={{ fontSize: 16, color: '#1890ff' }}>
                                    {record.orderNumber}
                                  </Text>
                                </div>
                                <p><strong>Khách hàng:</strong> {record.customerName}</p>
                                <p><strong>Số điện thoại:</strong> {record.customerPhone}</p>
                                <p><strong>Tổng tiền:</strong> {record.finalAmount?.toLocaleString()} VNĐ</p>
                                <p style={{ marginTop: 16, color: '#52c41a' }}>
                                  <CheckCircleOutlined /> Bạn có chắc chắn muốn xác nhận đơn hàng này?
                                </p>
                              </div>
                            ),
                            okText: 'Xác nhận',
                            cancelText: 'Hủy',
                            okButtonProps: { type: 'primary' },
                            onOk: async () => {
                              try {
                                await fetch(`${API_BASE_URL}/orders/${record.id}/status`, {
                                  method: 'PUT',
                                  headers: {
                                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                                    'Content-Type': 'application/json'
                                  },
                                  body: JSON.stringify({ status: 'CONFIRMED' })
                                });
                                message.success('Đã xác nhận đơn hàng thành công!');
                                fetchDashboardData();
                              } catch (error) {
                                message.error('Có lỗi xảy ra khi xác nhận đơn hàng!');
                              }
                            }
                          });
                        } else if (key === 'cancel') {
                          Modal.confirm({
                            title: 'Hủy đơn hàng',
                            width: 600,
                            content: (
                              <div style={{ marginTop: 20 }}>
                                <div style={{ 
                                  background: '#fff2e8', 
                                  padding: '16px', 
                                  borderRadius: '8px',
                                  marginBottom: '16px',
                                  border: '1px solid #ffbb96'
                                }}>
                                  <Text strong style={{ fontSize: 16, color: '#ff4d4f' }}>
                                    {record.orderNumber}
                                  </Text>
                                </div>
                                <p><strong>Khách hàng:</strong> {record.customerName}</p>
                                <p><strong>Số điện thoại:</strong> {record.customerPhone}</p>
                                <p><strong>Tổng tiền:</strong> {record.finalAmount?.toLocaleString()} VNĐ</p>
                                <p><strong>Trạng thái hiện tại:</strong> {record.status}</p>
                                <p style={{ marginTop: 16, color: '#ff4d4f' }}>
                                  <CloseCircleOutlined /> Bạn có chắc chắn muốn hủy đơn hàng này?
                                </p>
                              </div>
                            ),
                            okText: 'Hủy đơn hàng',
                            cancelText: 'Không',
                            okButtonProps: { danger: true },
                            onOk: async () => {
                              try {
                                await fetch(`${API_BASE_URL}/orders/${record.id}/status`, {
                                  method: 'PUT',
                                  headers: {
                                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                                    'Content-Type': 'application/json'
                                  },
                                  body: JSON.stringify({ status: 'CANCELLED' })
                                });
                                message.success('Đã hủy đơn hàng thành công!');
                                fetchDashboardData();
                              } catch (error) {
                                message.error('Có lỗi xảy ra khi hủy đơn hàng!');
                              }
                            }
                          });
                        }
                      };

                      return (
                        <Dropdown
                          menu={{
                            items: getMenuItems(),
                            onClick: handleMenuClick
                          }}
                          trigger={['click']}
                        >
                          <Button
                            type="text"
                            icon={<SettingOutlined />}
                            style={{
                              borderRadius: 8,
                              color: '#667eea',
                              background: '#667eea15'
                            }}
                          >
                            Thao tác
                          </Button>
                        </Dropdown>
                      );
                    }
                  }
                ]}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showTotal: (total) => `Tổng ${total} đơn hàng`
                }}
                rowKey="key"
                className="admin-table"
                scroll={{ x: 1400 }}
              />
            </Card>
          </div>
        );
      case 'settings':
        return (
          <div className="admin-section">
            <div className="admin-section-header">
              <div className="admin-section-title">
                <SettingOutlined />
                <Title level={3}>Cài đặt hệ thống</Title>
              </div>
            </div>
            <Card className="admin-card" style={{ borderRadius: 24 }}>
              <div className="admin-settings-placeholder">
                <SettingOutlined style={{ fontSize: 64, color: '#d9d9d9', marginBottom: 16 }} />
                <Text type="secondary" style={{ fontSize: 16 }}>Trang cài đặt đang được phát triển...</Text>
              </div>
            </Card>
          </div>
        );
      default:
        return (
          <div className="admin-dashboard">
            {/* Welcome Banner - Modern Design */}
            <div className="admin-welcome-banner">
              <div className="admin-welcome-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(255,255,255,0.2)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                  }}>
                    <DashboardOutlined style={{ fontSize: '28px', color: 'white' }} />
                  </div>
                  <div>
                    <Title level={2} style={{ margin: 0, color: 'white', fontSize: '28px', fontWeight: '700' }}>
                      Xin chào, {user?.firstName} {user?.lastName}
                    </Title>
                    <Text className="admin-welcome-subtitle" style={{ 
                      fontSize: '15px', 
                      color: 'rgba(255,255,255,0.9)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginTop: '4px'
                    }}>
                      <CheckCircleOutlined style={{ fontSize: '16px' }} />
                      Chào mừng bạn trở lại bảng điều khiển quản trị
                    </Text>
                  </div>
                </div>
              </div>
              <div className="admin-welcome-actions">
                <Button 
                  icon={<CalendarOutlined />} 
                  className="admin-btn-secondary"
                  onClick={() => setSelectedKey('appointments')}
                  style={{ height: '44px', borderRadius: '12px' }}
                >
                  Xem lịch hẹn
                </Button>
                <Button 
                  type="primary" 
                  icon={<BarChartOutlined />} 
                  className="admin-btn-primary"
                  onClick={() => setSelectedKey('reports')}
                  style={{ height: '44px', borderRadius: '12px' }}
                >
                  Xem báo cáo
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <Row gutter={[24, 24]} className="admin-stats-row">
              <Col xs={24} sm={12} lg={6}>
                <div className="admin-stat-card admin-stat-card--users">
                  <div className="admin-stat-icon">
                    <TeamOutlined />
                  </div>
                  <div className="admin-stat-content">
                    <Text className="admin-stat-label">Tổng người dùng</Text>
                    <Title level={2} className="admin-stat-value">{stats.totalUsers}</Title>
                    <div className="admin-stat-trend admin-trend-up">
                      <ArrowUpOutlined /> +12% so với tháng trước
                    </div>
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <div className="admin-stat-card admin-stat-card--doctors">
                  <div className="admin-stat-icon">
                    <MedicineBoxOutlined />
                  </div>
                  <div className="admin-stat-content">
                    <Text className="admin-stat-label">Bác sĩ</Text>
                    <Title level={2} className="admin-stat-value">{stats.totalDoctors}</Title>
                    <div className="admin-stat-trend admin-trend-up">
                      <ArrowUpOutlined /> +8% so với tháng trước
                    </div>
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <div className="admin-stat-card admin-stat-card--appointments">
                  <div className="admin-stat-icon">
                    <CalendarOutlined />
                  </div>
                  <div className="admin-stat-content">
                    <Text className="admin-stat-label">Tổng lịch hẹn</Text>
                    <Title level={2} className="admin-stat-value">{stats.totalAppointments}</Title>
                    <div className="admin-stat-trend admin-trend-up">
                      <ArrowUpOutlined /> +23% so với tháng trước
                    </div>
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <div className="admin-stat-card admin-stat-card--online">
                  <div className="admin-stat-icon" style={{ background: '#52c41a20' }}>
                    <WifiOutlined style={{ color: '#52c41a' }} />
                  </div>
                  <div className="admin-stat-content">
                    <Text className="admin-stat-label">Đang hoạt động</Text>
                    <Title level={2} className="admin-stat-value" style={{ color: '#52c41a' }}>{stats.onlineUsers}</Title>
                    <div className="admin-stat-trend admin-trend-up">
                      <WifiOutlined /> Cập nhật real-time
                    </div>
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <div className="admin-stat-card admin-stat-card--pending">
                  <div className="admin-stat-icon">
                    <ClockCircleOutlined />
                  </div>
                  <div className="admin-stat-content">
                    <Text className="admin-stat-label">Chờ xác nhận</Text>
                    <Title level={2} className="admin-stat-value">{stats.pendingAppointments}</Title>
                    <div className="admin-stat-trend admin-trend-down">
                      <ArrowDownOutlined /> -5% so với tháng trước
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

            {/* Recent Data Tables */}
            <div className="admin-tables-container">
              <Col xs={24}>
                <Card
                  className="admin-card admin-card--recent"
                  style={{ borderRadius: 24 }}
                  title={
                    <div className="admin-card-header">
                      <TeamOutlined />
                      <Text strong style={{ fontSize: 16 }}>Người dùng gần đây</Text>
                    </div>
                  }
                  extra={<Button type="link" onClick={() => { setSelectedKey('users'); localStorage.setItem('adminActiveTab', 'users'); }}>Xem tất cả</Button>}
                >
                  <Table
                    dataSource={userTableData.slice(0, 5)}
                    columns={userColumns}
                    pagination={false}
                    size="middle"
                    rowKey="key"
                    className="admin-table admin-table--compact"
                    scroll={{ x: 900 }}
                  />
                </Card>
              </Col>
              <Col xs={24}>
                <Card
                  className="admin-card admin-card--recent"
                  style={{ borderRadius: 24 }}
                  title={
                    <div className="admin-card-header">
                      <CalendarOutlined />
                      <Text strong style={{ fontSize: 16 }}>Lịch hẹn gần đây</Text>
                    </div>
                  }
                  extra={<Button type="link" onClick={() => { setSelectedKey('appointments'); localStorage.setItem('adminActiveTab', 'appointments'); }}>Xem tất cả</Button>}
                >
                  <Table
                    dataSource={appointmentTableData.slice(0, 5)}
                    columns={appointmentColumns}
                    pagination={false}
                    size="middle"
                    rowKey="key"
                    className="admin-table admin-table--compact"
                    scroll={{ x: 800 }}
                  />
                </Card>
              </Col>
            </div>

            {/* Quick Actions & Activity */}
            <Row gutter={[24, 24]} className="admin-activity-row">
              <Col xs={24} lg={8}>
                <Card className="admin-card" style={{ borderRadius: 24 }} title={
                  <div className="admin-card-header">
                    <WifiOutlined style={{ color: '#52c41a' }} />
                    <Text strong style={{ fontSize: 16 }}>Người dùng đang online</Text>
                  </div>
                }>
                  <List
                    itemLayout="horizontal"
                    dataSource={onlineUsersList.slice(0, 5)}
                    locale={{ emptyText: 'Không có người dùng online' }}
                    renderItem={(onlineUser) => (
                      <List.Item className="admin-doctor-item">
                        <List.Item.Meta
                          avatar={
                            <Badge status="success" offset={[-5, 35]}>
                              <Avatar size={44} style={{ backgroundColor: '#52c41a' }}>
                                {onlineUser.userName?.split(' ').map(n => n.charAt(0)).join('').slice(0, 2)}
                              </Avatar>
                            </Badge>
                          }
                          title={
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <Text strong>{onlineUser.userName}</Text>
                              <Badge status="success" text="" />
                            </div>
                          }
                          description={
                            <div>
                              <Text type="secondary" style={{ fontSize: 12 }}>{onlineUser.userEmail}</Text>
                              <div style={{ marginTop: 4 }}>
                                <Text type="secondary" style={{ fontSize: 11 }}>
                                  {onlineUser.ipAddress && `IP: ${onlineUser.ipAddress}`}
                                </Text>
                              </div>
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
              <Col xs={24} lg={8}>
                <Card className="admin-card" style={{ borderRadius: 24 }} title={
                  <div className="admin-card-header">
                    <MedicineBoxOutlined />
                    <Text strong style={{ fontSize: 16 }}>Bác sĩ hoạt động</Text>
                  </div>
                }>
                  <List
                    itemLayout="horizontal"
                    dataSource={doctors.slice(0, 4)}
                    renderItem={(doctor) => (
                      <List.Item className="admin-doctor-item">
                        <List.Item.Meta
                          avatar={
                            <Avatar size={44} style={{ backgroundColor: '#2f54eb' }}>
                              {doctor.firstName?.charAt(0)}{doctor.lastName?.charAt(0)}
                            </Avatar>
                          }
                          title={
                            <Text strong>{doctor.firstName} {doctor.lastName}</Text>
                          }
                          description={
                            <div>
                              <Tag style={{ borderRadius: 12, padding: '0 8px', fontSize: 11 }}>{doctor.specialization}</Tag>
                              <div style={{ marginTop: 4 }}>
                                <Progress percent={doctor.ratingScore * 20} size="small" showInfo={false} strokeColor="#faad14" />
                              </div>
                            </div>
                          }
                        />
                        <div className="admin-doctor-rating">
                          <span style={{ color: '#faad14', fontWeight: 600 }}>{doctor.ratingScore?.toFixed(1)}</span>
                        </div>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
              <Col xs={24} lg={16}>
                <Card className="admin-card" style={{ borderRadius: 24 }} title={
                  <div className="admin-card-header">
                    <CheckCircleOutlined />
                    <Text strong style={{ fontSize: 16 }}>Hoạt động gần đây</Text>
                  </div>
                }>
                  <div className="admin-activity-list">
                    {appointments.slice(0, 5).map((apt, index) => (
                      <div key={index} className="admin-activity-item">
                        <div className="admin-activity-icon" style={{ background: `${getStatusColor(apt.status)}20` }}>
                          {getStatusIcon(apt.status)}
                        </div>
                        <div className="admin-activity-content">
                          <Text strong>{apt.patient?.firstName} {apt.patient?.lastName}</Text>
                          <Text type="secondary"> đặt lịch hẹn với </Text>
                          <Text strong>{apt.doctor?.user?.firstName} {apt.doctor?.user?.lastName}</Text>
                        </div>
                        <div className="admin-activity-time">
                          <Text type="secondary" style={{ fontSize: 12 }}>{apt.appointmentDate} {apt.timeSlot}</Text>
                        </div>
                      </div>
                    ))}
                    {appointments.length === 0 && (
                      <div className="admin-empty-state">
                        <Text type="secondary">Chưa có hoạt động nào</Text>
                      </div>
                    )}
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        );
    }
  };

  return (
    <Layout className="admin-layout">
      {!isMobile && (
      <Sider
        breakpoint="md"
        collapsedWidth="0"
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        onBreakpoint={(broken) => {
          setCollapsed(broken);
        }}
        className="admin-sider"
        width={280}
        theme="light"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          overflow: 'auto',
          height: '100vh'
        }}
      >
        <div className="admin-logo">
          <div className="admin-logo-icon">
            <MedicineBoxOutlined />
          </div>
          {!collapsed && (
            <div className="admin-logo-text">
              <Title level={4} className="admin-logo-title">DoctorCare</Title>
              <Text type="secondary" className="admin-logo-subtitle">Quản trị viên</Text>
            </div>
          )}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={handleMenuClick}
          className="admin-menu"
        />
      </Sider>
      )}
      <Layout className="admin-main-layout" style={{ marginLeft: isMobile ? 0 : (collapsed ? 80 : 280) }}>
        <Header className="admin-header" style={{ 
          position: 'fixed',
          top: 0,
          right: 0,
          left: isMobile ? 0 : (collapsed ? 80 : 280),
          zIndex: 100,
          background: '#fff',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <div className="admin-header-left">
            {isMobile && (
              <Button
                type="text"
                icon={<MenuOutlined style={{ fontSize: 20 }} />}
                onClick={() => setMobileMenuVisible(true)}
                style={{ marginRight: 16 }}
              />
            )}
            <Button
              type="link"
              icon={<DashboardOutlined />}
              onClick={() => navigate('/')}
              style={{ marginRight: 16 }}
            >
              {!isMobile && 'Về trang chủ'}
            </Button>
            <Badge count={3} size="small">
              <Button type="text" icon={<BellOutlined style={{ fontSize: 20 }} />} className="admin-notification-btn" />
            </Badge>
          </div>
          <div className="admin-header-right">
            <Dropdown menu={{ items: userMenuItems, onClick: handleUserMenuClick }} trigger={['click']} placement="bottomRight">
              <div className="admin-user-dropdown">
                <Avatar
                  size={42}
                  src={userAvatar}
                  icon={<UserOutlined />}
                  className="admin-user-avatar"
                />
                <div className="admin-user-info">
                  <Text strong style={{ display: 'block' }}>{user?.firstName || localStorage.getItem('userFirstName')} {user?.lastName || localStorage.getItem('userLastName')}</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>Quản trị viên</Text>
                </div>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content className="admin-content" style={{ marginTop: 64 }}>
          {renderContent()}
        </Content>
      </Layout>

      {/* Mobile Menu Drawer */}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40,
              height: 40,
              background: '#10b981',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <MedicineBoxOutlined style={{ fontSize: 20, color: 'white' }} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#10b981' }}>DoctorCare</div>
              <div style={{ fontSize: 11, color: '#8c8c8c', textTransform: 'uppercase', letterSpacing: 1 }}>
                Quản trị viên
              </div>
            </div>
          </div>
        }
        placement="left"
        onClose={() => setMobileMenuVisible(false)}
        open={mobileMenuVisible}
        width={280}
        closeIcon={<CloseOutlined style={{ fontSize: 18 }} />}
        styles={{
          header: {
            borderBottom: '1px solid #f0f0f0',
            padding: '20px 24px'
          },
          body: {
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }
        }}
      >
        {/* User Info */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #f0f0f0',
          background: '#f8fafb'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar
              size={48}
              src={userAvatar}
              icon={<UserOutlined />}
              style={{ background: '#10b981' }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: '#1e293b' }}>
                {user?.firstName || localStorage.getItem('userFirstName')} {user?.lastName || localStorage.getItem('userLastName')}
              </div>
              <div style={{ fontSize: 12, color: '#64748b' }}>
                Quản trị viên
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 100 }}>
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            items={menuItems}
            onClick={handleMenuClick}
            style={{
              border: 'none',
              padding: '12px 16px'
            }}
          />
        </div>

        {/* Footer Actions */}
        <div style={{
          borderTop: '1px solid #f0f0f0',
          background: '#fff',
          padding: '16px 24px'
        }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: '#8c8c8c', marginBottom: 4 }}>Đường dây nóng</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <BellOutlined style={{ color: '#10b981', fontSize: 16 }} />
              <span style={{ fontWeight: 600, fontSize: 15, color: '#1e293b' }}>19005656</span>
            </div>
          </div>
        </div>
      </Drawer>

      {/* Edit User Modal */}
      <Modal
        className="admin-modal"
        title={<Text strong style={{ fontSize: 18 }}>Chỉnh sửa người dùng</Text>}
        open={editModalVisible}
        onOk={handleSaveUser}
        onCancel={() => setEditModalVisible(false)}
        width={520}
        styles={{
          body: { padding: '24px 32px' }
        }}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={editForm} layout="vertical" size="large">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="firstName" label="Họ">
                <Input disabled style={{ borderRadius: 12 }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="lastName" label="Tên">
                <Input disabled style={{ borderRadius: 12 }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="email" label="Email">
            <Input disabled style={{ borderRadius: 12 }} />
          </Form.Item>
          <Form.Item name="role" label="Vai trò" rules={[{ required: true }]}>
            <Select placeholder="Chọn vai trò" style={{ borderRadius: 12 }}>
              <Select.Option value="PATIENT">Bệnh nhân</Select.Option>
              <Select.Option value="DOCTOR">Bác sĩ</Select.Option>
              <Select.Option value="ADMIN">Quản trị</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
}

export default AdminDashboard;
