import React, { useState, useEffect } from 'react';
import { Layout, Button, Dropdown, Avatar, message, Input, Drawer, Badge } from 'antd';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  UserOutlined, 
  LogoutOutlined, 
  DashboardOutlined, 
  SettingOutlined, 
  PhoneOutlined,
  SearchOutlined,
  EditOutlined,
  MenuOutlined,
  CloseOutlined,
  RightOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons';
import { userAPI } from '../services/api';
import webSocketService from '../services/websocket';
import cmsAPI from '../services/cmsApi';
import { useCart } from '../contexts/CartContext';

const { Header } = Layout;

function HeaderComponent({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, resetCart } = useCart();
  const [siteSettings, setSiteSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchSiteSettings();
  }, []);

  // Helper function to check if menu item is active
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const fetchSiteSettings = async () => {
    try {
      setLoading(true);
      const response = await cmsAPI.getSiteSettings();
      setSiteSettings(response.data);
    } catch (error) {
      console.error('Error fetching site settings:', error);
      // Set default values if fetch fails
      setSiteSettings({
        siteName: 'MEDLATEC',
        siteTagline: 'Chăm sóc sức khỏe',
        logoUrl: null,
        hotline: '19005656'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (userId) {
        await userAPI.logout(parseInt(userId));
      }
      webSocketService.disconnect();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      resetCart(); // Reset cart before logout
      onLogout();
      navigate('/');
      message.success('Đã đăng xuất!');
    }
  };

  const isAdmin = user?.role === 'ADMIN';
  const isDoctor = user?.role === 'DOCTOR';
  const isConsultant = user?.role === 'CONSULTANT';
  const canChat = user && (isAdmin || isDoctor || isConsultant || user?.role === 'PATIENT');
  const canPostArticle = isAdmin || isDoctor;

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
    {
      key: 'my-orders',
      label: 'Đơn hàng của tôi',
      onClick: () => navigate('/my-orders'),
    },
  ];

  if (isAdmin) {
    userMenuItems.push({
      key: 'admin',
      icon: <DashboardOutlined />,
      label: 'Quản trị',
      onClick: () => navigate('/admin'),
    });
  }

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

  // Don't render until settings are loaded
  if (loading || !siteSettings) {
    return null;
  }

  // Don't render until settings are loaded
  if (loading || !siteSettings) {
    return null;
  }

  return (
    <>
      {/* Main Header */}
      <Header 
        style={{ 
          background: '#fff', 
          padding: '0 24px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          borderBottom: '1px solid #f0f0f0',
          height: 64,
          lineHeight: '64px'
        }}>
        <div style={{ 
          maxWidth: 1400, 
          margin: '0 auto',
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          height: '100%'
        }}>
          {/* Logo */}
          <Link to="/" className="header-logo" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 10,
            textDecoration: 'none'
          }}>
            {siteSettings.logoUrl ? (
              <img 
                src={siteSettings.logoUrl} 
                alt={siteSettings.siteName}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  objectFit: 'cover',
                  border: '1px solid #e8e8e8'
                }}
              />
            ) : (
              <div style={{
                background: '#1890ff',
                width: 36,
                height: 36,
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: 18 }}>🏥</span>
              </div>
            )}
            <div>
              <div style={{ 
                fontSize: 18, 
                fontWeight: 700, 
                color: '#1890ff',
                lineHeight: '20px'
              }}>
                {siteSettings.siteName}
              </div>
              {siteSettings.siteTagline && (
                <div style={{ 
                  fontSize: 9, 
                  color: '#8c8c8c',
                  lineHeight: '12px'
                }}>
                  {siteSettings.siteTagline}
                </div>
              )}
            </div>
          </Link>

          {/* Search Bar */}
          <div className="header-search" style={{ flex: 1, maxWidth: 320, margin: '0 20px' }}>
            <Input
              placeholder="Tìm kiếm..."
              prefix={<SearchOutlined />}
              style={{ 
                borderRadius: 20,
                fontSize: 13
              }}
            />
          </div>

          {/* Right Side */}
          <div className="header-right" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {/* Hotline */}
            <a href={`tel:${siteSettings.hotline}`} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 4,
              padding: '3px 8px',
              background: '#e6f7ff',
              borderRadius: 4,
              textDecoration: 'none',
              border: '1px solid #91d5ff',
              height: 26
            }}>
              <PhoneOutlined style={{ color: '#1890ff', fontSize: 12 }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#1890ff' }}>{siteSettings.hotline}</span>
            </a>

            {/* Cart Icon */}
            <Badge count={cart.totalItems} offset={[-2, 2]} size="small">
              <Button
                icon={<ShoppingCartOutlined />}
                onClick={() => navigate('/cart')}
                style={{
                  border: '1px solid #d9d9d9',
                  borderRadius: 4,
                  height: 26,
                  padding: '0 8px',
                  fontSize: 14
                }}
              />
            </Badge>

            {/* Post Article Button */}
            {canPostArticle && (
              <Button
                size="small"
                icon={<EditOutlined />}
                onClick={() => navigate(isDoctor ? '/doctor/articles' : '/admin/cms')}
                style={{
                  background: '#722ed1',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 4,
                  fontSize: 12,
                  padding: '0 10px',
                  height: 26
                }}
              >
                Đăng bài
              </Button>
            )}

            {/* User Actions */}
            {user ? (
              <Dropdown menu={{ items: userMenuItems }} trigger={['click']}>
                <div style={{ 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 6, 
                  padding: '2px 8px', 
                  borderRadius: 4,
                  border: '1px solid #d9d9d9',
                  background: '#fafafa',
                  height: 26
                }}>
                  <Avatar
                    size={20}
                    src={user.profileImage}
                    icon={!user.profileImage && <UserOutlined />}
                  />
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#262626' }}>
                    {user.firstName}
                  </span>
                  {isAdmin && (
                    <span style={{ 
                      fontSize: 8, 
                      color: '#fff',
                      background: '#f5222d',
                      padding: '0px 4px',
                      borderRadius: 2,
                      marginLeft: 8,
                      lineHeight: '14px',
                      display: 'inline-block'
                    }}>
                      Admin
                    </span>
                  )}
                </div>
              </Dropdown>
            ) : (
              <div style={{ display: 'flex', gap: 6 }}>
                <Button 
                  size="small"
                  style={{ 
                    borderRadius: 4,
                    fontSize: 12,
                    height: 26,
                    padding: '0 12px'
                  }}
                  onClick={() => navigate('/register')}
                >
                  Đăng ký
                </Button>
                <Button 
                  type="primary"
                  size="small"
                  style={{ 
                    borderRadius: 4,
                    fontSize: 12,
                    height: 26,
                    padding: '0 12px'
                  }}
                  onClick={() => navigate('/login')}
                >
                  Đăng nhập
                </Button>
              </div>
            )}
            
            {/* Mobile Menu Button - Right on mobile */}
            <Button
              className="mobile-menu-button"
              icon={<MenuOutlined />}
              onClick={() => setMobileMenuOpen(true)}
              style={{
                display: 'none',
                border: 'none',
                background: 'transparent',
                fontSize: 20,
                padding: 0,
                width: 40,
                height: 40
              }}
            />
          </div>
        </div>
      </Header>

      {/* Navigation Menu - Modern Design */}
      <div style={{ 
        background: '#fff',
        borderBottom: '1px solid #e8e8e8',
        padding: '0 24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
      }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <nav style={{ 
            display: 'flex',
            justifyContent: 'center',
            gap: 8,
            padding: '12px 0'
          }}>
            <Link 
              to="/" 
              className={`modern-nav-link ${isActive('/') ? 'active' : ''}`}
              style={{
                padding: '10px 20px',
                fontSize: 15,
                fontWeight: 500,
                color: 'rgb(3, 66, 142)',
                textDecoration: 'none',
                borderRadius: 20,
                transition: 'all 0.3s ease',
                position: 'relative'
              }}
            >
              Trang chủ
            </Link>
            <Link 
              to="/about" 
              className={`modern-nav-link ${isActive('/about') ? 'active' : ''}`}
              style={{
                padding: '10px 20px',
                fontSize: 15,
                fontWeight: 500,
                color: 'rgb(3, 66, 142)',
                textDecoration: 'none',
                borderRadius: 20,
                transition: 'all 0.3s ease',
                position: 'relative'
              }}
            >
              Giới thiệu
            </Link>
            <Link 
              to="/services" 
              className={`modern-nav-link ${isActive('/services') ? 'active' : ''}`}
              style={{
                padding: '10px 20px',
                fontSize: 15,
                fontWeight: 500,
                color: 'rgb(3, 66, 142)',
                textDecoration: 'none',
                borderRadius: 20,
                transition: 'all 0.3s ease',
                position: 'relative'
              }}
            >
              Dịch vụ y tế
            </Link>
            <Link 
              to="/doctors" 
              className={`modern-nav-link ${isActive('/doctors') ? 'active' : ''}`}
              style={{
                padding: '10px 20px',
                fontSize: 15,
                fontWeight: 500,
                color: 'rgb(3, 66, 142)',
                textDecoration: 'none',
                borderRadius: 20,
                transition: 'all 0.3s ease',
                position: 'relative'
              }}
            >
              Đặt lịch khám
            </Link>
            <Link 
              to="/news" 
              className={`modern-nav-link ${isActive('/news') ? 'active' : ''}`}
              style={{
                padding: '10px 20px',
                fontSize: 15,
                fontWeight: 500,
                color: 'rgb(3, 66, 142)',
                textDecoration: 'none',
                borderRadius: 20,
                transition: 'all 0.3s ease',
                position: 'relative'
              }}
            >
              Tin tức
            </Link>
            {user && canChat && (
              <Link 
                to="/chat" 
                className={`modern-nav-link ${isActive('/chat') ? 'active' : ''}`}
                style={{
                  padding: '10px 20px',
                  fontSize: 15,
                  fontWeight: 500,
                  color: 'rgb(3, 66, 142)',
                  textDecoration: 'none',
                  borderRadius: 20,
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}
              >
                Chat tư vấn
              </Link>
            )}
            {user && (
              <Link 
                to="/appointments" 
                className={`modern-nav-link ${isActive('/appointments') ? 'active' : ''}`}
                style={{
                  padding: '10px 20px',
                  fontSize: 15,
                  fontWeight: 500,
                  color: 'rgb(3, 66, 142)',
                  textDecoration: 'none',
                  borderRadius: 20,
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}
              >
                Lịch hẹn
              </Link>
            )}
          </nav>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <Drawer
        placement="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        width={300}
        closeIcon={<CloseOutlined />}
        styles={{
          body: { padding: 0 },
          header: { borderBottom: '1px solid #f0f0f0' }
        }}
      >
        <div style={{ padding: '20px 0' }}>
          {/* User Section */}
          {user ? (
            <div style={{ padding: '0 20px 20px', borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 15 }}>
                <Avatar size={40} src={user.profileImage} icon={!user.profileImage && <UserOutlined />} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{user.firstName} {user.lastName}</div>
                  {isAdmin && <span style={{ fontSize: 11, color: '#f5222d' }}>Admin</span>}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding: '0 20px 20px', borderBottom: '1px solid #f0f0f0', display: 'flex', gap: 10 }}>
              <Button type="primary" block onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}>
                Đăng nhập
              </Button>
              <Button block onClick={() => { navigate('/register'); setMobileMenuOpen(false); }}>
                Đăng ký
              </Button>
            </div>
          )}

          {/* Menu Items */}
          <div style={{ padding: '10px 0' }}>
            <div 
              onClick={() => { navigate('/'); setMobileMenuOpen(false); }}
              style={{ padding: '15px 20px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <span style={{ fontSize: 15, color: '#262626' }}>Trang chủ</span>
            </div>
            
            <div 
              onClick={() => { navigate('/about'); setMobileMenuOpen(false); }}
              style={{ padding: '15px 20px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <span style={{ fontSize: 15, color: '#262626' }}>Giới thiệu</span>
              <RightOutlined style={{ fontSize: 12, color: '#8c8c8c' }} />
            </div>
            
            <div 
              onClick={() => { navigate('/services'); setMobileMenuOpen(false); }}
              style={{ padding: '15px 20px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <span style={{ fontSize: 15, color: '#262626' }}>Dịch vụ y tế</span>
              <RightOutlined style={{ fontSize: 12, color: '#8c8c8c' }} />
            </div>
            
            <div 
              onClick={() => { navigate('/doctors'); setMobileMenuOpen(false); }}
              style={{ padding: '15px 20px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <span style={{ fontSize: 15, color: '#262626' }}>Đặt lịch khám</span>
            </div>
            
            <div 
              onClick={() => { navigate('/news'); setMobileMenuOpen(false); }}
              style={{ padding: '15px 20px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <span style={{ fontSize: 15, color: '#262626' }}>Tin tức</span>
            </div>

            {user && canChat && (
              <div 
                onClick={() => { navigate('/chat'); setMobileMenuOpen(false); }}
                style={{ padding: '15px 20px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <span style={{ fontSize: 15, color: '#262626' }}>Chat tư vấn</span>
              </div>
            )}

            {user && (
              <div 
                onClick={() => { navigate('/appointments'); setMobileMenuOpen(false); }}
                style={{ padding: '15px 20px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <span style={{ fontSize: 15, color: '#262626' }}>Lịch hẹn</span>
              </div>
            )}
          </div>

          {/* User Actions */}
          {user && (
            <div style={{ padding: '20px', borderTop: '1px solid #f0f0f0' }}>
              <div 
                onClick={() => { navigate('/profile'); setMobileMenuOpen(false); }}
                style={{ padding: '12px 0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
              >
                <UserOutlined />
                <span>Hồ sơ của tôi</span>
              </div>
              
              {isAdmin && (
                <div 
                  onClick={() => { navigate('/admin'); setMobileMenuOpen(false); }}
                  style={{ padding: '12px 0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
                >
                  <DashboardOutlined />
                  <span>Quản trị</span>
                </div>
              )}
              
              {isDoctor && (
                <div 
                  onClick={() => { navigate('/doctor/dashboard'); setMobileMenuOpen(false); }}
                  style={{ padding: '12px 0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
                >
                  <SettingOutlined />
                  <span>Quản lý lịch</span>
                </div>
              )}
              
              <div 
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                style={{ padding: '12px 0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, color: '#f5222d' }}
              >
                <LogoutOutlined />
                <span>Đăng xuất</span>
              </div>
            </div>
          )}

          {/* Hotline */}
          <div style={{ padding: '20px', background: '#f5f5f5' }}>
            <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 5 }}>Đường dây nóng</div>
            <a href={`tel:${siteSettings.hotline}`} style={{ fontSize: 18, fontWeight: 600, color: '#1890ff', textDecoration: 'none' }}>
              <PhoneOutlined /> {siteSettings.hotline}
            </a>
          </div>
        </div>
      </Drawer>
    </>
  );
}

export default HeaderComponent;
