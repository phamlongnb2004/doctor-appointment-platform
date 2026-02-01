import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DoctorListPage from './pages/DoctorListPage';
import DoctorDetailPage from './pages/DoctorDetailPage';
import AppointmentPage from './pages/AppointmentPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import Header from './components/Header';

const { Content, Footer } = Layout;

function App() {
  // Initialize state from localStorage
  const [user, setUser] = React.useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed && parsed.email) {
          return parsed;
        }
      }
    } catch (error) {
      console.error('Error reading user from localStorage:', error);
    }
    return null;
  });

  const [isAuthenticated, setIsAuthenticated] = React.useState(() => {
    return !!localStorage.getItem('user');
  });

  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Verify localStorage on mount
    const storedUser = localStorage.getItem('user');
    console.log('App mounted, checking localStorage...');
    console.log('Stored user:', storedUser);

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('Parsed user:', parsedUser);
        if (parsedUser && parsedUser.email) {
          setUser(parsedUser);
          setIsAuthenticated(true);
          console.log('User restored from localStorage');
        }
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    console.log('Logging in user:', userData);
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('auth_time', Date.now().toString());
    console.log('User saved to localStorage');
  };

  const handleLogout = () => {
    console.log('Logging out user');
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('auth_time');
  };

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // Show loading while checking localStorage
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="loading-spinner" style={{
            width: 50,
            height: 50,
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ color: '#666' }}>Đang tải...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  const isAdmin = user?.role === 'ADMIN';
  const isDoctor = user?.role === 'DOCTOR';

  return (
    <Router>
      <Layout className="layout">
        <Header user={user} onLogout={handleLogout} />
        <Content style={{ padding: '50px' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/doctors" element={<DoctorListPage />} />
            <Route path="/doctors/:id" element={<DoctorDetailPage />} />
            
            {/* Protected Routes */}
            <Route
              path="/appointments"
              element={isAuthenticated ? <AppointmentPage user={user} /> : <Navigate to="/login" />}
            />
            <Route
              path="/profile"
              element={isAuthenticated ? (
                <ProfilePage user={user} onUserUpdate={handleUserUpdate} />
              ) : (
                <Navigate to="/login" />
              )}
            />
            
            {/* Admin Only Routes */}
            <Route
              path="/admin"
              element={
                isAuthenticated && isAdmin ? (
                  <AdminDashboard user={user} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/admin/users"
              element={
                isAuthenticated && isAdmin ? (
                  <AdminDashboard user={user} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/admin/doctors"
              element={
                isAuthenticated && isAdmin ? (
                  <AdminDashboard user={user} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/admin/appointments"
              element={
                isAuthenticated && isAdmin ? (
                  <AdminDashboard user={user} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
          </Routes>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Doctor Appointment Platform ©2024 Created by Your Company
        </Footer>
      </Layout>
    </Router>
  );
}

export default App;
