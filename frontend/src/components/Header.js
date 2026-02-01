import React from 'react';
import { Layout, Menu, Button, Dropdown, Avatar } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { UserOutlined, LogoutOutlined, DashboardOutlined, SettingOutlined, MedicineBoxOutlined } from '@ant-design/icons';

const { Header } = Layout;

function HeaderComponent({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const isAdmin = user?.role === 'ADMIN';
  const isDoctor = user?.role === 'DOCTOR';

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Hồ sơ của tôi',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'appointments',
      label: 'Lịch hẹn của tôi',
      onClick: () => navigate('/appointments'),
    },
  ];

  // Add admin menu item if user is admin
  if (isAdmin) {
    userMenuItems.push({
      key: 'admin',
      icon: <DashboardOutlined />,
      label: 'Quản trị',
      onClick: () => navigate('/admin'),
    });
  }

  // Add doctor menu item if user is doctor
  if (isDoctor) {
    userMenuItems.push({
      key: 'doctor',
      icon: <SettingOutlined />,
      label: 'Quản lý lịch',
      onClick: () => navigate('/doctor/dashboard'),
    });
  }

  userMenuItems.push({ type: 'divider' });
  userMenuItems.push({
    key: 'logout',
    icon: <LogoutOutlined />,
    label: 'Đăng xuất',
    onClick: handleLogout,
  });

  return (
    <Header style={{ background: '#fff', padding: '0 40px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
        <Link to="/" style={{ fontSize: '22px', fontWeight: '700', color: '#667eea', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MedicineBoxOutlined style={{ fontSize: 28 }} />
          <span style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Doctor Appointment</span>
        </Link>
        <Menu mode="horizontal" style={{ border: 'none', flex: 1, marginLeft: '40px', background: 'transparent' }}>
          <Menu.Item key="home" style={{ margin: '0 8px', borderRadius: '8px 8px 0 0', height: '48px', lineHeight: '48px' }}>
            <Link to="/">Trang chủ</Link>
          </Menu.Item>
          <Menu.Item key="doctors" style={{ margin: '0 8px', borderRadius: '8px 8px 0 0', height: '48px', lineHeight: '48px' }}>
            <Link to="/doctors">Bác sĩ</Link>
          </Menu.Item>
          {user && (
            <Menu.Item key="appointments" style={{ margin: '0 8px', borderRadius: '8px 8px 0 0', height: '48px', lineHeight: '48px' }}>
              <Link to="/appointments">Lịch hẹn</Link>
            </Menu.Item>
          )}
        </Menu>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginLeft: '20px' }}>
          {user ? (
            <Dropdown menu={{ items: userMenuItems }} trigger={['click']}>
              <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px', borderRadius: '12px', transition: 'all 0.3s ease' }}>
                <Avatar
                  size={40}
                  src={user.profileImage}
                  icon={!user.profileImage && <UserOutlined />}
                  style={{ border: '2px solid #667eea' }}
                />
                <span style={{ fontWeight: 500 }}>{user.firstName} {user.lastName}</span>
                {isAdmin && (
                  <span style={{
                    background: 'linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%)',
                    color: '#fff',
                    padding: '4px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 600
                  }}>
                    Admin
                  </span>
                )}
                {isDoctor && !isAdmin && (
                  <span style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                    padding: '4px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 600
                  }}>
                    Bác sĩ
                  </span>
                )}
              </span>
            </Dropdown>
          ) : (
            <>
              <Button type="primary" size="large" onClick={() => navigate('/login')} style={{ borderRadius: '10px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none', height: '42px', fontWeight: 600 }}>
                Đăng nhập
              </Button>
              <Button size="large" onClick={() => navigate('/register')} style={{ borderRadius: '10px', height: '42px', fontWeight: 600 }}>
                Đăng ký
              </Button>
            </>
          )}
        </div>
      </div>
    </Header>
  );
}

export default HeaderComponent;
