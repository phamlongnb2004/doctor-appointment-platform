import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from 'antd';
import './styles/medlatec-theme.css';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DoctorListPage from './pages/DoctorListPage';
import DoctorDetailPage from './pages/DoctorDetailPage';
import AppointmentPage from './pages/AppointmentPage';
import AppointmentsListPage from './pages/AppointmentsListPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import ChatPage from './pages/ChatPage';
import AdminCMSPage from './pages/AdminCMSPage';
import DoctorArticlesPage from './pages/DoctorArticlesPage';
import DoctorProfileEditPage from './pages/DoctorProfileEditPage';
import NewsDetailPage from './pages/NewsDetailPage';
import NewsListPage from './pages/NewsListPage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import MyOrdersPage from './pages/MyOrdersPage';
import PaymentTestPage from './pages/PaymentTestPage';
import SePayCheckoutPage from './pages/SePayCheckoutPage';
import SePayTestPage from './pages/SePayTestPage';
import ServiceWalletPage from './pages/ServiceWalletPage';
import DoctorVerifyCodePage from './pages/DoctorVerifyCodePage';
import DoctorExaminationPage from './pages/DoctorExaminationPage';
import PatientMedicalHistoryPage from './pages/PatientMedicalHistoryPage';
import NotFoundPage from './pages/NotFoundPage';
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingBookingButton from './components/FloatingBookingButton';
import { CartProvider } from './contexts/CartContext';
import webSocketService from './services/websocket';

const { Content } = Layout;

function AppContent({ user, isAuthenticated, handleLogin, handleLogout, handleUserUpdate }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  const isAdmin = user?.role === 'ADMIN';
  const isDoctor = user?.role === 'DOCTOR';
  const isConsultant = user?.role === 'CONSULTANT';
  const canChat = isAuthenticated && (isAdmin || isDoctor || isConsultant || user?.role === 'PATIENT');

  return (
    <Layout className="layout">
      {!isAdminRoute && <Header user={user} onLogout={handleLogout} />}
      <Content style={{ padding: '0' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:slug" element={<ServiceDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/sepay-checkout" element={<SePayCheckoutPage />} />
          <Route path="/order-success/:orderNumber" element={<OrderSuccessPage />} />
          <Route 
            path="/my-orders" 
            element={isAuthenticated ? <MyOrdersPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/wallet" 
            element={isAuthenticated ? <ServiceWalletPage /> : <Navigate to="/login" />} 
          />
          <Route path="/payment-test" element={<PaymentTestPage />} />
          <Route path="/sepay-test" element={<SePayTestPage />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/doctors" element={<DoctorListPage />} />
          <Route path="/doctors/:id" element={<DoctorDetailPage />} />
          <Route path="/news" element={<NewsListPage />} />
          <Route path="/news/:slug" element={<NewsDetailPage />} />
          
          {/* Protected Routes */}
          <Route
            path="/appointment"
            element={isAuthenticated ? <AppointmentPage user={user} /> : <Navigate to="/login" />}
          />
          <Route
            path="/appointments"
            element={isAuthenticated ? <AppointmentsListPage user={user} /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile"
            element={isAuthenticated ? (
              <ProfilePage user={user} onUserUpdate={handleUserUpdate} />
            ) : (
              <Navigate to="/login" />
            )}
          />
          
          {/* Chat Route - Available for all authenticated users */}
          <Route
            path="/chat"
            element={canChat ? (
              <ChatPage user={user} />
            ) : (
              <Navigate to="/login" />
            )}
          />
          
          {/* Doctor Articles Route - For doctors only */}
          <Route
            path="/doctor/articles"
            element={
              isAuthenticated && isDoctor ? (
                <DoctorArticlesPage user={user} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          
          {/* Doctor Profile Edit Route - For doctors only */}
          <Route
            path="/doctor/profile-edit"
            element={
              isAuthenticated && isDoctor ? (
                <DoctorProfileEditPage />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          
          {/* Doctor Verify Code Route - For doctors only */}
          <Route
            path="/doctor/verify-code"
            element={
              isAuthenticated && isDoctor ? (
                <DoctorVerifyCodePage />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          
          {/* Doctor Examination Route - For doctors only */}
          <Route
            path="/doctor/examination/:appointmentId"
            element={
              isAuthenticated && isDoctor ? (
                <DoctorExaminationPage />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          
          {/* Patient Medical History Route - For patients */}
          <Route
            path="/patient/medical-history"
            element={
              isAuthenticated ? (
                <PatientMedicalHistoryPage />
              ) : (
                <Navigate to="/login" />
              )
            }
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
            path="/admin/cms"
            element={
              isAuthenticated && isAdmin ? (
                <AdminCMSPage />
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
          
          {/* 404 - Catch all unmatched routes */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Content>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <FloatingBookingButton />}
    </Layout>
  );
}

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

          // Reconnect to WebSocket ONLY if sessionId exists
          const sessionId = localStorage.getItem('sessionId');
          const userId = localStorage.getItem('userId');
          if (sessionId && userId && parsedUser.id) {
            console.log('Reconnecting WebSocket for user:', userId);
            try {
              webSocketService.connect(parseInt(userId), sessionId, (status) => {
                console.log('WebSocket status update:', status);
              });
            } catch (error) {
              console.warn('WebSocket connection failed:', error);
            }
          }
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

    // Connect to WebSocket for real-time status ONLY if sessionId exists
    if (userData.sessionId && userData.id) {
      localStorage.setItem('sessionId', userData.sessionId);
      try {
        webSocketService.connect(userData.id, userData.sessionId, (status) => {
          console.log('WebSocket status update:', status);
        });
        console.log('WebSocket connected for user:', userData.id);
      } catch (error) {
        console.warn('WebSocket connection failed:', error);
      }
    }
  };

  const handleLogout = () => {
    console.log('Logging out user');

    // Disconnect WebSocket
    webSocketService.disconnect();

    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('auth_time');
    localStorage.removeItem('userId');
    localStorage.removeItem('sessionId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userFirstName');
    localStorage.removeItem('userLastName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('cart_session_id'); // Clear cart session
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

  return (
    <Router>
      <CartProvider>
        <AppContent 
          user={user}
          isAuthenticated={isAuthenticated}
          handleLogin={handleLogin}
          handleLogout={handleLogout}
          handleUserUpdate={handleUserUpdate}
        />
      </CartProvider>
    </Router>
  );
}

export default App;
