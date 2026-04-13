import React from 'react';
import QuickBookingsTab from '../components/admin/QuickBookingsTab';
import '../styles/doctor-dashboard.css';
import '../styles/admin.css';

const DoctorQuickBookingsPage = () => {
  return (
    <div className="doctor-dashboard">
      <div className="page-header">
        <h1>Đặt Lịch Nhanh</h1>
        <p>Quản lý các yêu cầu đặt lịch nhanh từ bệnh nhân</p>
      </div>
      
      <div className="admin-table">
        <QuickBookingsTab isDoctorView={true} />
      </div>
    </div>
  );
};

export default DoctorQuickBookingsPage;
