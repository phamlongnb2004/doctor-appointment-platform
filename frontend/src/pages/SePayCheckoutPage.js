import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Spin, message } from 'antd';

function SePayCheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { sePayResponse } = location.state || {};

  useEffect(() => {
    if (!sePayResponse) {
      message.error('Không có thông tin thanh toán');
      navigate('/checkout');
      return;
    }

    // Kiểm tra response từ SePay API
    if (sePayResponse.status === 'success' && sePayResponse.checkout_url) {
      // Redirect đến checkout URL của SePay
      window.location.href = sePayResponse.checkout_url;
    } else {
      message.error('Không thể tạo thanh toán: ' + (sePayResponse.message || 'Unknown error'));
      navigate('/checkout');
    }
  }, [sePayResponse, navigate]);

  if (!sePayResponse) {
    return null;
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '60vh',
      padding: '40px 20px'
    }}>
      <Spin size="large" />
      <p style={{ marginTop: 20, fontSize: 16, color: '#595959' }}>
        Đang chuyển đến trang thanh toán SePay...
      </p>
      <p style={{ fontSize: 14, color: '#8c8c8c' }}>
        Vui lòng không đóng trang này
      </p>
    </div>
  );
}

export default SePayCheckoutPage;
