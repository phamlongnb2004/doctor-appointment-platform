import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/examination.css';

const DoctorExaminationPage = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [appointment, setAppointment] = useState(null);
  const [medicalRecord, setMedicalRecord] = useState(null);
  const [formData, setFormData] = useState({
    chiefComplaint: '',
    symptoms: '',
    diagnosis: '',
    treatment: '',
    prescription: '',
    notes: '',
    vitalSigns: {
      bloodPressure: '',
      temperature: '',
      heartRate: '',
      respiratoryRate: '',
      oxygenSaturation: '',
      weight: '',
      height: ''
    },
    followUpInstructions: ''
  });
  const [attachments, setAttachments] = useState([]);
  const [uploadingFile, setUploadingFile] = useState(false);

  useEffect(() => {
    loadAppointmentData();
  }, [appointmentId]);

  const loadAppointmentData = async () => {
    try {
      setLoading(true);
      const appointmentRes = await api.get(`/appointments/${appointmentId}`);
      setAppointment(appointmentRes.data);

      // Try to load existing medical record
      try {
        const recordRes = await api.get(`/medical-records/appointment/${appointmentId}`);
        setMedicalRecord(recordRes.data);
        populateFormData(recordRes.data);
      } catch (err) {
        // No medical record yet
        console.log('No medical record found');
      }
    } catch (error) {
      console.error('Error loading appointment:', error);
      alert('Không thể tải thông tin lịch hẹn');
    } finally {
      setLoading(false);
    }
  };

  const populateFormData = (record) => {
    setFormData({
      chiefComplaint: record.chiefComplaint || '',
      symptoms: record.symptoms || '',
      diagnosis: record.diagnosis || '',
      treatment: record.treatment || '',
      prescription: record.prescription || '',
      notes: record.notes || '',
      vitalSigns: record.vitalSigns ? JSON.parse(record.vitalSigns) : {
        bloodPressure: '',
        temperature: '',
        heartRate: '',
        respiratoryRate: '',
        oxygenSaturation: '',
        weight: '',
        height: ''
      },
      followUpInstructions: record.followUpInstructions || ''
    });
    setAttachments(record.attachments || []);
  };

  const handleStartExamination = async () => {
    try {
      setLoading(true);
      const response = await api.post(`/medical-records/start/${appointmentId}`);
      setMedicalRecord(response.data);
      alert('Đã bắt đầu khám bệnh');
      loadAppointmentData();
    } catch (error) {
      console.error('Error starting examination:', error);
      alert(error.response?.data?.error || 'Không thể bắt đầu khám');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVitalSignsChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      vitalSigns: {
        ...prev.vitalSigns,
        [name]: value
      }
    }));
  };

  const handleSave = async () => {
    if (!medicalRecord) {
      alert('Vui lòng bắt đầu khám trước');
      return;
    }

    try {
      setLoading(true);
      const dataToSend = {
        ...formData,
        vitalSigns: JSON.stringify(formData.vitalSigns)
      };
      const response = await api.put(`/medical-records/${medicalRecord.id}`, dataToSend);
      setMedicalRecord(response.data);
      alert('Đã lưu thông tin');
    } catch (error) {
      console.error('Error saving medical record:', error);
      alert('Không thể lưu thông tin');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const description = prompt('Mô tả file (tùy chọn):');
    
    try {
      setUploadingFile(true);
      const formData = new FormData();
      formData.append('file', file);
      if (description) formData.append('description', description);

      const response = await api.post(
        `/medical-records/${medicalRecord.id}/attachments`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      
      setAttachments(prev => [...prev, response.data]);
      alert('Đã tải lên file thành công');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Không thể tải lên file');
    } finally {
      setUploadingFile(false);
      e.target.value = '';
    }
  };

  const handleDeleteAttachment = async (attachmentId) => {
    if (!window.confirm('Bạn có chắc muốn xóa file này?')) return;

    try {
      await api.delete(`/medical-records/attachments/${attachmentId}`);
      setAttachments(prev => prev.filter(a => a.id !== attachmentId));
      alert('Đã xóa file');
    } catch (error) {
      console.error('Error deleting attachment:', error);
      alert('Không thể xóa file');
    }
  };

  const handleComplete = async () => {
    if (!window.confirm('Bạn có chắc muốn hoàn thành khám? Sau khi hoàn thành sẽ không thể chỉnh sửa.')) {
      return;
    }

    try {
      setLoading(true);
      await api.post(`/medical-records/${medicalRecord.id}/complete`);
      alert('Đã hoàn thành khám bệnh');
      navigate('/doctor/appointments');
    } catch (error) {
      console.error('Error completing examination:', error);
      alert('Không thể hoàn thành khám');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !appointment) {
    return <div className="loading">Đang tải...</div>;
  }

  if (!appointment) {
    return <div className="error">Không tìm thấy lịch hẹn</div>;
  }

  const isCompleted = medicalRecord?.examinationEndTime;
  const canEdit = medicalRecord && !isCompleted;

  return (
    <div className="examination-page">
      <div className="examination-header">
        <h1>Khám bệnh</h1>
        <button onClick={() => navigate(-1)} className="btn-back">Quay lại</button>
      </div>

      <div className="patient-info-card">
        <h2>Thông tin bệnh nhân</h2>
        <div className="info-grid">
          <div><strong>Họ tên:</strong> {appointment.patient?.firstName} {appointment.patient?.lastName}</div>
          <div><strong>Email:</strong> {appointment.patient?.email}</div>
          <div><strong>Số điện thoại:</strong> {appointment.patient?.phoneNumber}</div>
          <div><strong>Ngày hẹn:</strong> {new Date(appointment.appointmentDateTime).toLocaleString('vi-VN')}</div>
        </div>
      </div>

      {!medicalRecord && appointment.status === 'CONFIRMED' && (
        <div className="start-examination-section">
          <button 
            onClick={handleStartExamination} 
            className="btn-primary btn-large"
            disabled={loading}
          >
            Bắt đầu khám
          </button>
        </div>
      )}

      {medicalRecord && (
        <div className="medical-record-form">
          <div className="form-section">
            <h3>Dấu hiệu sinh tồn</h3>
            <div className="vital-signs-grid">
              <div className="form-group">
                <label>Huyết áp</label>
                <input
                  type="text"
                  name="bloodPressure"
                  value={formData.vitalSigns.bloodPressure}
                  onChange={handleVitalSignsChange}
                  placeholder="120/80"
                  disabled={!canEdit}
                />
              </div>
              <div className="form-group">
                <label>Nhiệt độ (°C)</label>
                <input
                  type="text"
                  name="temperature"
                  value={formData.vitalSigns.temperature}
                  onChange={handleVitalSignsChange}
                  placeholder="36.5"
                  disabled={!canEdit}
                />
              </div>
              <div className="form-group">
                <label>Nhịp tim (bpm)</label>
                <input
                  type="text"
                  name="heartRate"
                  value={formData.vitalSigns.heartRate}
                  onChange={handleVitalSignsChange}
                  placeholder="72"
                  disabled={!canEdit}
                />
              </div>
              <div className="form-group">
                <label>Nhịp thở (lần/phút)</label>
                <input
                  type="text"
                  name="respiratoryRate"
                  value={formData.vitalSigns.respiratoryRate}
                  onChange={handleVitalSignsChange}
                  placeholder="16"
                  disabled={!canEdit}
                />
              </div>
              <div className="form-group">
                <label>SpO2 (%)</label>
                <input
                  type="text"
                  name="oxygenSaturation"
                  value={formData.vitalSigns.oxygenSaturation}
                  onChange={handleVitalSignsChange}
                  placeholder="98"
                  disabled={!canEdit}
                />
              </div>
              <div className="form-group">
                <label>Cân nặng (kg)</label>
                <input
                  type="text"
                  name="weight"
                  value={formData.vitalSigns.weight}
                  onChange={handleVitalSignsChange}
                  placeholder="65"
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Thông tin khám</h3>
            
            <div className="form-group">
              <label>Lý do khám</label>
              <textarea
                name="chiefComplaint"
                value={formData.chiefComplaint}
                onChange={handleInputChange}
                rows="2"
                disabled={!canEdit}
              />
            </div>

            <div className="form-group">
              <label>Triệu chứng</label>
              <textarea
                name="symptoms"
                value={formData.symptoms}
                onChange={handleInputChange}
                rows="3"
                disabled={!canEdit}
              />
            </div>

            <div className="form-group">
              <label>Chẩn đoán</label>
              <textarea
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleInputChange}
                rows="3"
                disabled={!canEdit}
              />
            </div>

            <div className="form-group">
              <label>Phương pháp điều trị</label>
              <textarea
                name="treatment"
                value={formData.treatment}
                onChange={handleInputChange}
                rows="3"
                disabled={!canEdit}
              />
            </div>

            <div className="form-group">
              <label>Đơn thuốc</label>
              <textarea
                name="prescription"
                value={formData.prescription}
                onChange={handleInputChange}
                rows="4"
                placeholder="Tên thuốc, liều lượng, cách dùng..."
                disabled={!canEdit}
              />
            </div>

            <div className="form-group">
              <label>Ghi chú</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows="3"
                disabled={!canEdit}
              />
            </div>

            <div className="form-group">
              <label>Hướng dẫn tái khám</label>
              <textarea
                name="followUpInstructions"
                value={formData.followUpInstructions}
                onChange={handleInputChange}
                rows="2"
                disabled={!canEdit}
              />
            </div>
          </div>

          <div className="form-section">
            <h3>File đính kèm</h3>
            {canEdit && (
              <div className="upload-section">
                <input
                  type="file"
                  id="file-upload"
                  onChange={handleFileUpload}
                  disabled={uploadingFile}
                  style={{ display: 'none' }}
                />
                <label htmlFor="file-upload" className="btn-secondary">
                  {uploadingFile ? 'Đang tải lên...' : 'Thêm file'}
                </label>
              </div>
            )}
            
            <div className="attachments-list">
              {attachments.map(attachment => (
                <div key={attachment.id} className="attachment-item">
                  <a href={attachment.fileUrl} target="_blank" rel="noopener noreferrer">
                    {attachment.fileName}
                  </a>
                  {attachment.description && <p>{attachment.description}</p>}
                  {canEdit && (
                    <button 
                      onClick={() => handleDeleteAttachment(attachment.id)}
                      className="btn-delete-small"
                    >
                      Xóa
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="form-actions">
            {canEdit && (
              <>
                <button 
                  onClick={handleSave} 
                  className="btn-primary"
                  disabled={loading}
                >
                  Lưu
                </button>
                <button 
                  onClick={handleComplete} 
                  className="btn-success"
                  disabled={loading}
                >
                  Hoàn thành khám
                </button>
              </>
            )}
            {isCompleted && (
              <div className="completed-badge">
                ✓ Đã hoàn thành khám lúc {new Date(medicalRecord.examinationEndTime).toLocaleString('vi-VN')}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorExaminationPage;
