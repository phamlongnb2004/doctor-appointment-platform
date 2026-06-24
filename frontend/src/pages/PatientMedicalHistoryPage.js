import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/examination.css';

const PatientMedicalHistoryPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [user, setUser] = useState(null);
  
  // Filter states
  const [filterYear, setFilterYear] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadUserAndRecords();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [medicalRecords, filterYear, filterMonth, filterStatus]);

  const loadUserAndRecords = async () => {
    try {
      setLoading(true);
      const userRes = await api.get('/users/me');
      setUser(userRes.data);
      
      const recordsRes = await api.get(`/medical-records/patient/${userRes.data.id}`);
      setMedicalRecords(recordsRes.data);
    } catch (error) {
      console.error('Error loading medical records:', error);
      alert('Không thể tải lịch sử khám bệnh');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...medicalRecords];

    // Filter by year
    if (filterYear) {
      filtered = filtered.filter(record => {
        const recordYear = new Date(record.examinationStartTime).getFullYear();
        return recordYear === parseInt(filterYear);
      });
    }

    // Filter by month
    if (filterMonth) {
      filtered = filtered.filter(record => {
        const recordMonth = new Date(record.examinationStartTime).getMonth() + 1;
        return recordMonth === parseInt(filterMonth);
      });
    }

    // Filter by status
    if (filterStatus !== 'all') {
      if (filterStatus === 'completed') {
        filtered = filtered.filter(record => record.examinationEndTime);
      } else if (filterStatus === 'in-progress') {
        filtered = filtered.filter(record => !record.examinationEndTime);
      }
    }

    setFilteredRecords(filtered);
  };

  const resetFilters = () => {
    setFilterYear('');
    setFilterMonth('');
    setFilterStatus('all');
  };

  // Get unique years from records
  const getAvailableYears = () => {
    const years = medicalRecords.map(record => 
      new Date(record.examinationStartTime).getFullYear()
    );
    return [...new Set(years)].sort((a, b) => b - a);
  };

  const handleViewRecord = (record) => {
    setSelectedRecord(record);
  };

  const handleCloseDetail = () => {
    setSelectedRecord(null);
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <div className="examination-page">
      <div className="examination-header">
        <h1>Lịch sử khám bệnh</h1>
        <button onClick={() => navigate(-1)} className="btn-back">Quay lại</button>
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <div className="filter-row">
          <div className="filter-group">
            <label>Năm:</label>
            <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
              <option value="">Tất cả</option>
              {getAvailableYears().map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Tháng:</label>
            <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
              <option value="">Tất cả</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month => (
                <option key={month} value={month}>Tháng {month}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Trạng thái:</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">Tất cả</option>
              <option value="completed">Đã hoàn thành</option>
              <option value="in-progress">Đang khám</option>
            </select>
          </div>

          <button onClick={resetFilters} className="btn-reset-filter">
            Xóa bộ lọc
          </button>
        </div>

        <div className="filter-result">
          Tìm thấy <strong>{filteredRecords.length}</strong> hồ sơ
        </div>
      </div>

      {medicalRecords.length === 0 ? (
        <div className="patient-info-card">
          <p>Bạn chưa có lịch sử khám bệnh nào.</p>
        </div>
      ) : (
        <>
          {!selectedRecord ? (
            <>
              {filteredRecords.length === 0 ? (
                <div className="patient-info-card">
                  <p>Không tìm thấy hồ sơ nào phù hợp với bộ lọc.</p>
                </div>
              ) : (
                <div className="medical-records-list">
                  {filteredRecords.map(record => (
                <div key={record.id} className="medical-record-card-horizontal">
                  <div className="record-left-section">
                    <div className="record-date-badge">
                      <div className="date-number">{new Date(record.examinationStartTime).getDate()}</div>
                      <div className="date-text">
                        Tháng {new Date(record.examinationStartTime).getMonth() + 1}/{new Date(record.examinationStartTime).getFullYear()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="record-middle-section">
                    <div className="record-header-row">
                      <h3 className="record-title">
                        Khám ngày {new Date(record.examinationStartTime).toLocaleDateString('vi-VN')}
                      </h3>
                      {record.examinationEndTime ? (
                        <span className="status-badge-modern status-completed">
                          Đã hoàn thành
                        </span>
                      ) : (
                        <span className="status-badge-modern status-in-progress">
                          Đang khám
                        </span>
                      )}
                    </div>
                    
                    <div className="record-info-grid">
                      <div className="info-item-modern">
                        <svg className="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <div>
                          <div className="info-label-modern">Bác sĩ</div>
                          <div className="info-value-modern">{record.doctorName}</div>
                        </div>
                      </div>
                      
                      <div className="info-item-modern">
                        <svg className="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <div>
                          <div className="info-label-modern">Chẩn đoán</div>
                          <div className="info-value-modern">{record.diagnosis || 'Chưa có'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="record-right-section">
                    <button 
                      onClick={() => handleViewRecord(record)}
                      className="btn-view-modern"
                    >
                      <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              ))}
            </div>
              )}
            </>
          ) : (
            <MedicalRecordDetail 
              record={selectedRecord} 
              onClose={handleCloseDetail}
            />
          )}
        </>
      )}
    </div>
  );
};

const MedicalRecordDetail = ({ record, onClose }) => {
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [hasReview, setHasReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState(null);

  const vitalSigns = record.vitalSigns ? JSON.parse(record.vitalSigns) : {};

  useEffect(() => {
    loadUserAndCheckReview();
  }, []);

  const loadUserAndCheckReview = async () => {
    try {
      const userRes = await api.get('/users/me');
      setUser(userRes.data);

      // Check if already reviewed
      const reviewRes = await api.get(`/reviews/medical-record/${record.id}/exists`);
      setHasReview(reviewRes.data.exists);
    } catch (error) {
      console.error('Error checking review:', error);
    }
  };

  const handleSubmitReview = async () => {
    if (rating === 0) {
      alert('Vui lòng chọn số sao đánh giá');
      return;
    }

    try {
      setSubmitting(true);
      await api.post(`/reviews/medical-record/${record.id}`, {
        patientId: user.id,
        rating: rating,
        comment: comment
      });

      alert('Đánh giá thành công! Cảm ơn bạn đã đánh giá.');
      setHasReview(true);
      setShowRatingForm(false);
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Có lỗi xảy ra khi gửi đánh giá: ' + (error.response?.data?.error || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  const StarRating = () => {
    return (
      <div style={{ display: 'flex', gap: '5px', fontSize: '32px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            style={{
              cursor: 'pointer',
              color: star <= (hoverRating || rating) ? '#ffc107' : '#ddd',
              transition: 'color 0.2s'
            }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="medical-record-form">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>Chi tiết hồ sơ khám bệnh</h2>
        <button onClick={onClose} className="btn-back">Đóng</button>
      </div>

      <div className="form-section">
        <h3>Thông tin chung</h3>
        <div className="info-grid">
          <div><strong>Bác sĩ:</strong> {record.doctorName}</div>
          <div><strong>Ngày khám:</strong> {new Date(record.examinationStartTime).toLocaleString('vi-VN')}</div>
          {record.examinationEndTime && (
            <div><strong>Hoàn thành:</strong> {new Date(record.examinationEndTime).toLocaleString('vi-VN')}</div>
          )}
        </div>
      </div>

      {Object.keys(vitalSigns).some(key => vitalSigns[key]) && (
        <div className="form-section">
          <h3>Dấu hiệu sinh tồn</h3>
          <div className="vital-signs-grid">
            {vitalSigns.bloodPressure && (
              <div><strong>Huyết áp:</strong> {vitalSigns.bloodPressure} mmHg</div>
            )}
            {vitalSigns.temperature && (
              <div><strong>Nhiệt độ:</strong> {vitalSigns.temperature} °C</div>
            )}
            {vitalSigns.heartRate && (
              <div><strong>Nhịp tim:</strong> {vitalSigns.heartRate} bpm</div>
            )}
            {vitalSigns.respiratoryRate && (
              <div><strong>Nhịp thở:</strong> {vitalSigns.respiratoryRate} lần/phút</div>
            )}
            {vitalSigns.oxygenSaturation && (
              <div><strong>SpO2:</strong> {vitalSigns.oxygenSaturation}%</div>
            )}
            {vitalSigns.weight && (
              <div><strong>Cân nặng:</strong> {vitalSigns.weight} kg</div>
            )}
          </div>
        </div>
      )}

      <div className="form-section">
        <h3>Thông tin khám</h3>
        
        {record.chiefComplaint && (
          <div className="form-group">
            <label>Lý do khám</label>
            <div style={{ padding: '10px', background: '#f8f9fa', borderRadius: '4px' }}>
              {record.chiefComplaint}
            </div>
          </div>
        )}

        {record.symptoms && (
          <div className="form-group">
            <label>Triệu chứng</label>
            <div style={{ padding: '10px', background: '#f8f9fa', borderRadius: '4px' }}>
              {record.symptoms}
            </div>
          </div>
        )}

        {record.diagnosis && (
          <div className="form-group">
            <label>Chẩn đoán</label>
            <div style={{ padding: '10px', background: '#f8f9fa', borderRadius: '4px' }}>
              {record.diagnosis}
            </div>
          </div>
        )}

        {record.treatment && (
          <div className="form-group">
            <label>Phương pháp điều trị</label>
            <div style={{ padding: '10px', background: '#f8f9fa', borderRadius: '4px' }}>
              {record.treatment}
            </div>
          </div>
        )}

        {record.prescription && (
          <div className="form-group">
            <label>Đơn thuốc</label>
            <div style={{ padding: '10px', background: '#f8f9fa', borderRadius: '4px', whiteSpace: 'pre-wrap' }}>
              {record.prescription}
            </div>
          </div>
        )}

        {record.notes && (
          <div className="form-group">
            <label>Ghi chú của bác sĩ</label>
            <div style={{ padding: '10px', background: '#f8f9fa', borderRadius: '4px' }}>
              {record.notes}
            </div>
          </div>
        )}

        {record.followUpInstructions && (
          <div className="form-group">
            <label>Hướng dẫn tái khám</label>
            <div style={{ padding: '10px', background: '#f8f9fa', borderRadius: '4px' }}>
              {record.followUpInstructions}
            </div>
          </div>
        )}
      </div>

      {record.attachments && record.attachments.length > 0 && (
        <div className="form-section">
          <h3>File đính kèm</h3>
          <div className="attachments-list">
            {record.attachments.map(attachment => (
              <div key={attachment.id} className="attachment-item">
                <div style={{ flex: 1 }}>
                  <a href={attachment.fileUrl} target="_blank" rel="noopener noreferrer">
                    {attachment.fileName}
                  </a>
                  {attachment.description && <p>{attachment.description}</p>}
                  <p style={{ fontSize: '11px', color: '#999' }}>
                    Tải lên: {new Date(attachment.uploadedAt).toLocaleString('vi-VN')}
                  </p>
                </div>
                <a 
                  href={attachment.fileUrl} 
                  download 
                  className="btn-secondary"
                  style={{ padding: '8px 16px', textDecoration: 'none' }}
                >
                  Tải xuống
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rating Section - Only show if examination is completed and not reviewed yet */}
      {record.examinationEndTime && !hasReview && (
        <div className="form-section" style={{ border: '2px solid #4CAF50', borderRadius: '8px', padding: '20px', background: '#f0f9ff' }}>
          <h3 style={{ color: '#1976d2', marginBottom: '15px' }}>
            ⭐ Đánh giá bác sĩ {record.doctorName}
          </h3>
          
          {!showRatingForm ? (
            <button 
              onClick={() => setShowRatingForm(true)}
              className="btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '16px' }}
            >
              Viết đánh giá ngay
            </button>
          ) : (
            <div>
              <div className="form-group">
                <label style={{ fontSize: '16px', fontWeight: 'bold' }}>
                  Đánh giá của bạn <span style={{ color: 'red' }}>*</span>
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                  <StarRating />
                  {rating > 0 && (
                    <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#1976d2' }}>
                      {rating} sao
                    </span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label style={{ fontSize: '16px', fontWeight: 'bold' }}>
                  Nhận xét (tùy chọn)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Chia sẻ trải nghiệm của bạn với bác sĩ..."
                  rows="4"
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <button 
                  onClick={handleSubmitReview}
                  disabled={submitting || rating === 0}
                  className="btn-primary"
                  style={{ flex: 1, padding: '12px', fontSize: '16px' }}
                >
                  {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                </button>
                <button 
                  onClick={() => {
                    setShowRatingForm(false);
                    setRating(0);
                    setComment('');
                  }}
                  className="btn-secondary"
                  style={{ padding: '12px 24px' }}
                >
                  Hủy
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {record.examinationEndTime && hasReview && (
        <div className="form-section" style={{ background: '#e8f5e9', padding: '15px', borderRadius: '8px' }}>
          <p style={{ margin: 0, color: '#2e7d32', fontWeight: 'bold' }}>
            ✅ Bạn đã đánh giá bác sĩ này rồi. Cảm ơn bạn!
          </p>
        </div>
      )}
    </div>
  );
};

export default PatientMedicalHistoryPage;
