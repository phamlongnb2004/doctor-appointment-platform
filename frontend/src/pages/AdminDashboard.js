import React, { useState, useEffect } from 'react';
import { Layout, Menu, Card, Row, Col, Typography, Table, Tag, Button, Statistic, Space, Spin, Modal, Form, Select, Input, message, Avatar, Dropdown, Badge } from 'antd';
import { DashboardOutlined, UserOutlined, TeamOutlined, CalendarOutlined, LogoutOutlined, SettingOutlined, MedicineBoxOutlined, EditOutlined, BellOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { userAPI, doctorAPI, appointmentAPI } from '../services/api';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

function AdminDashboard({ user, onLogout }) {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    pendingAppointments: 0
  });
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [usersRes, doctorsRes, appointmentsRes] = await Promise.all([
        userAPI.getAllUsers(),
        doctorAPI.getAllDoctors(),
        appointmentAPI.getAllAppointments()
      ]);

      const allUsers = usersRes.data || [];
      const allDoctors = doctorsRes.data || [];
      const allAppointments = appointmentsRes.data || [];

      setUsers(allUsers);
      setDoctors(allDoctors);
      setAppointments(allAppointments);

      setStats({
        totalUsers: allUsers.length,
        totalDoctors: allDoctors.length,
        totalAppointments: allAppointments.length,
        pendingAppointments: allAppointments.filter(a => a.status === 'PENDING').length
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = ({ key }) => {
    setSelectedKey(key);
    if (key === 'logout') {
      onLogout();
      navigate('/');
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
      await doctorAPI.createDoctor({
        user: { id: userId },
        specialization: 'Chưa cập nhật',
        consultationFee: 0,
        experienceYears: 0
      });

      message.success('Đã phong bác sĩ!');
      fetchDashboardData();
    } catch (error) {
      message.error('Thất bại: ' + (error.response?.data?.message || error.message));
    }
  };

  const menuItems = [
    { key: 'overview', icon: <DashboardOutlined />, label: 'Tổng quan' },
    { key: 'users', icon: <TeamOutlined />, label: 'Quản lý người dùng' },
    { key: 'doctors', icon: <MedicineBoxOutlined />, label: 'Quản lý bác sĩ' },
    { key: 'appointments', icon: <CalendarOutlined />, label: 'Lịch hẹn' },
    { key: 'settings', icon: <SettingOutlined />, label: 'Cài đặt' },
    { type: 'divider' },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Đăng xuất', danger: true },
  ];

  const getRoleTagColor = (role) => {
    switch (role) {
      case 'ADMIN': return 'red';
      case 'DOCTOR': return 'blue';
      case 'PATIENT': return 'green';
      default: return 'default';
    }
  };

  const getRoleDisplay = (role) => {
    switch (role) {
      case 'ADMIN': return 'Quản trị';
      case 'DOCTOR': return 'Bác sĩ';
      case 'PATIENT': return 'Bệnh nhân';
      default: return role;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'green';
      case 'PENDING': return 'orange';
      case 'CONFIRMED': return 'cyan';
      case 'CANCELLED': return 'red';
      default: return 'default';
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
    status: u.active !== false ? 'Hoạt động' : 'Khóa'
  }));

  const doctorTableData = doctors.map((d, index) => ({
    key: index,
    id: d.id,
    userId: d.user?.id,
    name: `${d.user?.firstName || ''} ${d.user?.lastName || ''}`,
    email: d.user?.email || '',
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
    doctor: `${a.doctor?.user?.firstName || ''} ${a.doctor?.user?.lastName || ''}`,
    specialization: a.doctor?.specialization || '',
    date: a.appointmentDate || '',
    time: a.timeSlot || '',
    notes: a.notes || '',
    status: a.status || 'PENDING'
  }));

  const userColumns = [
    {
      title: 'Họ tên',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Text strong>{text}</Text>
    },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role) => <Tag color={getRoleTagColor(role)}>{getRoleDisplay(role)}</Tag>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Badge status={status === 'Hoạt động' ? 'success' : 'error'} text={status} />
      )
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEditUser(record)}
            style={{ borderRadius: '8px' }}
          >
            Sửa
          </Button>
          {record.role === 'PATIENT' && (
            <Button
              type="default"
              size="small"
              onClick={() => handlePromoteToDoctor(record.id)}
              style={{ borderRadius: '8px' }}
            >
              Phong BS
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const doctorColumns = [
    {
      title: 'Họ tên',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Text strong>{text}</Text>
    },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Chuyên khoa', dataIndex: 'specialization', key: 'specialization' },
    {
      title: 'Kinh nghiệm',
      dataIndex: 'experienceYears',
      key: 'experienceYears',
      render: (years) => `${years} năm`
    },
    {
      title: 'Phí khám',
      dataIndex: 'consultationFee',
      key: 'consultationFee',
      render: (fee) => fee?.toLocaleString() + ' VNĐ'
    },
    {
      title: 'Đánh giá',
      dataIndex: 'ratingScore',
      key: 'ratingScore',
      render: (score) => score?.toFixed(1) || '0.0'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Badge status={status === 'Hoạt động' ? 'success' : 'error'} text={status} />
      )
    },
  ];

  const appointmentColumns = [
    {
      title: 'Bệnh nhân',
      dataIndex: 'patient',
      key: 'patient',
      render: (text) => <Text strong>{text}</Text>
    },
    { title: 'SĐT', dataIndex: 'patientPhone', key: 'patientPhone' },
    {
      title: 'Bác sĩ',
      dataIndex: 'doctor',
      key: 'doctor',
      render: (text, record) => (
        <div>
          <Text>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>{record.specialization}</Text>
        </div>
      )
    },
    {
      title: 'Ngày/giờ',
      key: 'datetime',
      render: (_, record) => (
        <div>
          <Text>{record.date}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>{record.time}</Text>
        </div>
      )
    },
    {
      title: 'Ghi chú',
      dataIndex: 'notes',
      key: 'notes',
      ellipsis: true
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>{getStatusDisplay(status)}</Tag>
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
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div style={{ textAlign: 'center', padding: 100 }}>
          <Spin size="large" />
          <p style={{ marginTop: 16, color: '#666' }}>Đang tải dữ liệu...</p>
        </div>
      );
    }

    switch (selectedKey) {
      case 'users':
        return (
          <Card
            title={<Text strong style={{ fontSize: 18 }}>Danh sách người dùng</Text>}
            className="card-spacious"
            style={{ borderRadius: '16px' }}
          >
            <Table
              dataSource={userTableData}
              columns={userColumns}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Tổng ${total} người dùng`
              }}
              rowKey="key"
              size="middle"
            />
          </Card>
        );
      case 'doctors':
        return (
          <Card
            title={<Text strong style={{ fontSize: 18 }}>Danh sách bác sĩ</Text>}
            className="card-spacious"
            style={{ borderRadius: '16px' }}
          >
            <Table
              dataSource={doctorTableData}
              columns={doctorColumns}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Tổng ${total} bác sĩ`
              }}
              rowKey="key"
              size="middle"
            />
          </Card>
        );
      case 'appointments':
        return (
          <Card
            title={<Text strong style={{ fontSize: 18 }}>Danh sách lịch hẹn</Text>}
            className="card-spacious"
            style={{ borderRadius: '16px' }}
          >
            <Table
              dataSource={appointmentTableData}
              columns={appointmentColumns}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Tổng ${total} lịch hẹn`
              }}
              rowKey="key"
              size="middle"
            />
          </Card>
        );
      case 'settings':
        return (
          <Card
            title={<Text strong style={{ fontSize: 18 }}>Cài đặt hệ thống</Text>}
            className="card-spacious"
            style={{ borderRadius: '16px' }}
          >
            <Text type="secondary">Trang cài đặt đang được phát triển...</Text>
          </Card>
        );
      default:
        return (
          <>
            {/* Stats Cards */}
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={12} lg={6}>
                <Card
                  className="card-spacious"
                  style={{
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff'
                  }}
                  styles={{ body: { padding: '24px' } }}
                >
                  <Statistic
                    title={<Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>Tổng người dùng</Text>}
                    value={stats.totalUsers}
                    valueStyle={{ color: '#fff', fontSize: 32, fontWeight: 700 }}
                    suffix="người"
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card
                  className="card-spacious"
                  style={{
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
                    color: '#fff'
                  }}
                  styles={{ body: { padding: '24px' } }}
                >
                  <Statistic
                    title={<Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>Bác sĩ</Text>}
                    value={stats.totalDoctors}
                    valueStyle={{ color: '#fff', fontSize: 32, fontWeight: 700 }}
                    suffix="người"
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card
                  className="card-spacious"
                  style={{
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #fa8c16 0%, #d46b08 100%)',
                    color: '#fff'
                  }}
                  styles={{ body: { padding: '24px' } }}
                >
                  <Statistic
                    title={<Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>Tổng lịch hẹn</Text>}
                    value={stats.totalAppointments}
                    valueStyle={{ color: '#fff', fontSize: 32, fontWeight: 700 }}
                    suffix="lịch"
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card
                  className="card-spacious"
                  style={{
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #f5222d 0%, #cf1322 100%)',
                    color: '#fff'
                  }}
                  styles={{ body: { padding: '24px' } }}
                >
                  <Statistic
                    title={<Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>Chờ xác nhận</Text>}
                    value={stats.pendingAppointments}
                    valueStyle={{ color: '#fff', fontSize: 32, fontWeight: 700 }}
                    suffix="lịch"
                  />
                </Card>
              </Col>
            </Row>

            {/* Recent Data Tables */}
            <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
              <Col xs={24} lg={12}>
                <Card
                  title={<Text strong style={{ fontSize: 16 }}>Người dùng gần đây</Text>}
                  className="card-spacious"
                  style={{ borderRadius: '16px' }}
                  styles={{ body: { padding: '16px 24px' } }}
                >
                  <Table
                    dataSource={userTableData.slice(0, 5)}
                    columns={userColumns}
                    pagination={false}
                    size="middle"
                    rowKey="key"
                    scroll={{ x: true }}
                  />
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card
                  title={<Text strong style={{ fontSize: 16 }}>Lịch hẹn gần đây</Text>}
                  className="card-spacious"
                  style={{ borderRadius: '16px' }}
                  styles={{ body: { padding: '16px 24px' } }}
                >
                  <Table
                    dataSource={appointmentTableData.slice(0, 5)}
                    columns={appointmentColumns}
                    pagination={false}
                    size="middle"
                    rowKey="key"
                    scroll={{ x: true }}
                  />
                </Card>
              </Col>
            </Row>
          </>
        );
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        style={{
          background: '#fff',
          boxShadow: '2px 0 8px rgba(0,0,0,0.05)'
        }}
        width={250}
      >
        <div style={{
          padding: collapsed ? '20px 0' : '20px',
          textAlign: 'center',
          borderBottom: '1px solid #f0f0f0',
          minHeight: '64px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <MedicineBoxOutlined style={{ fontSize: 32, color: '#667eea' }} />
          {!collapsed && (
            <Title level={4} style={{ margin: '12px 0 0', color: '#667eea', whiteSpace: 'nowrap' }}>
              DoctorCare
            </Title>
          )}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ border: 'none', padding: '8px 12px' }}
          inlineIndent={12}
        />
      </Sider>
      <Layout style={{ background: '#f5f5f5' }}>
        <Header style={{
          background: '#fff',
          padding: '0 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          height: '64px',
          marginLeft: 0
        }}>
          <Title level={4} style={{ margin: 0, color: '#333' }}>
            {selectedKey === 'overview' && 'Tổng quan'}
            {selectedKey === 'users' && 'Quản lý người dùng'}
            {selectedKey === 'doctors' && 'Quản lý bác sĩ'}
            {selectedKey === 'appointments' && 'Quản lý lịch hẹn'}
            {selectedKey === 'settings' && 'Cài đặt'}
          </Title>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Button
              type="text"
              icon={<BellOutlined style={{ fontSize: 20 }} />}
              style={{ borderRadius: '50%', width: 40, height: 40 }}
            />
            <Dropdown menu={{ items: userMenuItems, onClick: handleUserMenuClick }} trigger={['click']}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                padding: '8px 12px',
                borderRadius: '12px',
                transition: 'all 0.3s ease'
              }}>
                <Avatar
                  size={40}
                  src={user?.profileImage}
                  icon={!user?.profileImage && <UserOutlined />}
                  style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                />
                <div style={{ lineHeight: 1.3 }}>
                  <Text strong style={{ display: 'block' }}>{user?.firstName} {user?.lastName}</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>Quản trị viên</Text>
                </div>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content style={{
          margin: '32px 32px',
          padding: '24px',
          minHeight: 'calc(100vh - 64px - 128px)',
          background: '#f5f5f5'
        }}>
          {renderContent()}
        </Content>
      </Layout>

      {/* Edit User Modal */}
      <Modal
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
                <Input disabled style={{ borderRadius: '8px' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="lastName" label="Tên">
                <Input disabled style={{ borderRadius: '8px' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="email" label="Email">
            <Input disabled style={{ borderRadius: '8px' }} />
          </Form.Item>
          <Form.Item name="role" label="Vai trò" rules={[{ required: true }]}>
            <Select placeholder="Chọn vai trò" style={{ borderRadius: '8px' }}>
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
