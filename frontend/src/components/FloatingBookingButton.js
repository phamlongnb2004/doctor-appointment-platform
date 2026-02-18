import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarOutlined } from '@ant-design/icons';
import '../styles/floating-booking-button.css';

function FloatingBookingButton() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/doctors');
  };

  return (
    <div className="floating-booking-button" onClick={handleClick}>
      <div className="floating-booking-icon">
        <CalendarOutlined />
      </div>
      <span className="floating-booking-text">Đặt lịch</span>
    </div>
  );
}

export default FloatingBookingButton;
