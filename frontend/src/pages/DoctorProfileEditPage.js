import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Button, message, Card, Spin, Upload, Select, Modal } from 'antd';
import { SaveOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { doctorAPI, userAPI } from '../services/api';
import RichTextEditor from '../components/RichTextEditor';
import axios from 'axios';
import '../styles/doctor-profile-edit.css';
import 'react-quill/dist/quill.snow.css';

const { TextArea } = Input;
const { Option } = Select;

function DoctorProfileEditPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [doctorData, setDoctorData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [specialties, setSpecialties] = useState([]);
  const [certificationImages, setCertificationImages] = useState([]);
  const [biography, setBiography] = useState('');
  const navigate = useNavigate();
  
  // Address data (API v2)
  const [provinces, setProvinces] = useState([]);
  const [modalWards, setModalWards] = useState([]);
  const [modalStreet, setModalStreet] = useState('');
  const [modalProvince, setModalProvince] = useState(null);
  const [modalWard, setModalWard] = useState(null);
  const [addressModalVisible, setAddressModalVisible] = useState(false);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');

    if (userRole !== 'DOCTOR') {
      message.error('Chỉ bác sĩ mới có thể truy cập trang này');
      navigate('/');
      return;
    }

    fetchDoctorProfile(userId);
    fetchSpecialties();
    fetchProvinces();
  }, [navigate]);
  
  const fetchProvinces = async () => {
    try {
      const response = await axios.get('https://provinces.open-api.vn/api/v2/p/');
      setProvinces(response.data);
    } catch (error) {
      console.error('Error fetching provinces:', error);
      message.error('Không thể tải danh sách tỉnh/thành phố');
    }
  };
  
  const handleModalProvinceChange = async (value) => {
    const province = provinces.find(p => p.code === value);
    setModalProvince(province);
    setModalWard(null);
    setModalWards([]);
    
    try {
      const response = await axios.get(`https://provinces.open-api.vn/api/v2/p/${value}?depth=2`);
      setModalWards(response.data.wards || []);
    } catch (error) {
      console.error('Error fetching wards:', error);
      message.error('Không thể tải danh sách phường/xã');
    }
  };
  
  const handleApplyAddress = () => {
    let fullAddress = modalStreet;
    if (modalWard && modalProvince) {
      fullAddress = `${modalStreet}, ${modalWard.name}, ${modalProvince.name}`;
    } else if (modalProvince) {
      fullAddress = `${modalStreet}, ${modalProvince.name}`;
    }
    form.setFieldsValue({ clinicStreet: fullAddress });
    setAddressModalVisible(false);
    // Reset modal state
    setModalStreet('');
    setModalProvince(null);
    setModalWard(null);
    setModalWards([]);
  };

  const fetchSpecialties = async () => {
    try {
      const response = await doctorAPI.getSpecialties();
      setSpecialties(response.data || []);
    } catch (error) {
      console.error('Error fetching specialties:', error);
    }
  };

  const fetchDoctorProfile = async (userId) => {
    try {
      setLoading(true);
      
      // Fetch user data
      const userResponse = await userAPI.getUserById(userId);
      setUserData(userResponse.data);
      
      // Fetch doctor data
      const doctorResponse = await doctorAPI.getDoctorByUserId(userId);
      const doctor = doctorResponse.data;
      setDoctorData(doctor);
      
      // Fetch certifications - handle 404 gracefully
      try {
        const certResponse = await doctorAPI.getDoctorCertifications(doctor.id);
        const certs = (certResponse.data || []).map((cert, index) => ({
          uid: cert.id,
          name: cert.title || `Chứng chỉ ${index + 1}`,
          status: 'done',
          url: cert.imageUrl,
          id: cert.id,
        }));
        setCertificationImages(certs);
      } catch (certError) {
        console.log('No certifications found or error fetching certifications:', certError);
        setCertificationImages([]);
      }
      
      // Set form values
      form.setFieldsValue({
        firstName: userResponse.data.firstName,
        lastName: userResponse.data.lastName,
        email: userResponse.data.email,
        specialization: doctor.specialization,
        experienceYears: doctor.experienceYears,
        consultationFee: doctor.consultationFee,
        clinicStreet: doctor.clinicAddress || '',
      });
      
      // Set biography separately for RichTextEditor
      setBiography(doctor.biography || '');
    } catch (error) {
      console.error('Error fetching doctor profile:', error);
      message.error('Không thể tải thông tin bác sĩ');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setSaving(true);
      const userId = localStorage.getItem('userId');
      
      // Use clinicStreet as the full address
      const clinicAddress = values.clinicStreet || '';
      
      console.log('=== SUBMITTING DOCTOR PROFILE ===');
      console.log('Clinic Address:', clinicAddress);
      console.log('All values:', values);
      
      // Update doctor profile
      const doctorUpdateData = {
        specialization: values.specialization,
        experienceYears: values.experienceYears,
        consultationFee: values.consultationFee,
        biography: biography,
        clinicAddress: clinicAddress,
      };
      
      console.log('Doctor Update Data:', doctorUpdateData);
      
      const response = await doctorAPI.updateMyDoctorProfile(userId, doctorUpdateData);
      console.log('Update response:', response.data);
      
      // Handle certification images - only upload new ones
      const newImages = certificationImages.filter(img => img.originFileObj);
      if (newImages.length > 0) {
        try {
          for (const img of newImages) {
            await doctorAPI.uploadCertification(userId, img.originFileObj, img.name || 'Chứng chỉ', '');
          }
          message.success('Cập nhật thông tin và upload chứng chỉ thành công!');
        } catch (certError) {
          console.error('Error uploading certifications:', certError);
          message.warning('Thông tin đã được cập nhật nhưng không thể upload chứng chỉ. Vui lòng kiểm tra cấu hình Cloudinary.');
        }
      } else {
        message.success('Cập nhật thông tin thành công!');
      }
      
      navigate(`/doctors/${doctorData.id}`);
    } catch (error) {
      console.error('Error updating doctor profile:', error);
      message.error(error.response?.data?.error || 'Không thể cập nhật thông tin');
    } finally {
      setSaving(false);
    }
  };
  
  const handleRemoveCertification = async (file) => {
    if (file.id) {
      // Existing certification - delete from server
      try {
        const userId = localStorage.getItem('userId');
        await doctorAPI.deleteCertification(userId, file.id);
        message.success('Đã xóa chứng chỉ');
        return true;
      } catch (error) {
        message.error('Không thể xóa chứng chỉ');
        return false;
      }
    }
    return true; // Allow removal of new uploads
  };

  if (loading) {
    return (
      <div className="doctor-profile-edit-loading">
        <Spin size="large" />
        <p>Đang tải thông tin...</p>
      </div>
    );
  }

  return (
    <div className="doctor-profile-edit-page">
      <div className="doctor-profile-edit-container">
        <Card 
          title={
            <div className="doctor-profile-edit-header">
              <h2>Chỉnh sửa thông tin bác sĩ</h2>
              <p>Cập nhật thông tin hiển thị trên trang cá nhân của bạn</p>
            </div>
          }
          className="doctor-profile-edit-card"
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="doctor-profile-edit-form"
          >
            <div className="form-section">
              <h3 className="section-title">Thông tin cá nhân</h3>
              <p className="section-note">Để thay đổi tên và email, vui lòng cập nhật trong phần Hồ sơ của tôi</p>
              
              <Form.Item label="Họ" name="firstName">
                <Input disabled />
              </Form.Item>

              <Form.Item label="Tên" name="lastName">
                <Input disabled />
              </Form.Item>

              <Form.Item label="Email" name="email">
                <Input disabled />
              </Form.Item>
            </div>

            <div className="form-section">
              <h3 className="section-title">Thông tin chuyên môn</h3>
              
              <Form.Item
                label="Chuyên khoa"
                name="specialization"
                rules={[{ required: true, message: 'Vui lòng chọn chuyên khoa' }]}
              >
                <Select 
                  placeholder="Chọn chuyên khoa"
                  showSearch
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {specialties.map((specialty) => (
                    <Option key={specialty.id} value={specialty.name}>
                      {specialty.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              
              <Form.Item
                label="Ảnh chứng chỉ & Bằng cấp"
                extra="Upload ảnh bằng cấp, chứng chỉ của bạn (có thể upload nhiều ảnh, tối đa 10 ảnh)"
              >
                <Upload
                  listType="picture-card"
                  fileList={certificationImages}
                  onPreview={(file) => {
                    window.open(file.url || file.thumbUrl, '_blank');
                  }}
                  onChange={({ fileList }) => setCertificationImages(fileList)}
                  onRemove={handleRemoveCertification}
                  beforeUpload={() => false}
                  multiple
                  accept="image/*"
                >
                  {certificationImages.length >= 10 ? null : (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>

              <Form.Item
                label="Số năm kinh nghiệm"
                name="experienceYears"
                rules={[{ required: true, message: 'Vui lòng nhập số năm kinh nghiệm' }]}
              >
                <InputNumber 
                  min={0} 
                  max={50} 
                  style={{ width: '100%' }}
                  placeholder="Số năm"
                />
              </Form.Item>

              <Form.Item
                label="Phí khám (VNĐ)"
                name="consultationFee"
                rules={[{ required: true, message: 'Vui lòng nhập phí khám' }]}
              >
                <InputNumber 
                  min={0}
                  step={50000}
                  style={{ width: '100%' }}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  placeholder="Ví dụ: 500000"
                />
              </Form.Item>
            </div>

            <div className="form-section">
              <h3 className="section-title">Giới thiệu</h3>
              
              <div style={{ marginBottom: 24 }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: 8,
                  fontSize: 14,
                  fontWeight: 500
                }}>
                  Tiểu sử
                </label>
                <RichTextEditor
                  value={biography}
                  onChange={setBiography}
                  placeholder="Giới thiệu về bản thân, kinh nghiệm làm việc, lĩnh vực chuyên môn... Bạn có thể chèn ảnh, định dạng text, thay đổi cỡ chữ, màu sắc, v.v."
                />
              </div>

              <h3 className="section-title" style={{ marginTop: 32 }}>Địa chỉ phòng khám</h3>
              
              <Form.Item
                label="Địa chỉ phòng khám"
                name="clinicStreet"
                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ phòng khám' }]}
                extra={
                  <div style={{ marginTop: 8 }}>
                    <Button 
                      size="small" 
                      onClick={() => setAddressModalVisible(true)}
                    >
                      📍 Chọn từ danh sách tỉnh/phường
                    </Button>
                  </div>
                }
              >
                <Input.TextArea 
                  rows={3}
                  placeholder="Ví dụ: 123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, Thành phố Hồ Chí Minh"
                  size="large"
                />
              </Form.Item>
            </div>

            <Modal
              title="Chọn địa chỉ"
              open={addressModalVisible}
              onOk={handleApplyAddress}
              onCancel={() => {
                setAddressModalVisible(false);
                setModalStreet('');
                setModalProvince(null);
                setModalWard(null);
                setModalWards([]);
              }}
              okText="Áp dụng"
              cancelText="Hủy"
              width={600}
            >
              <div style={{ marginTop: 16 }}>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
                    Số nhà, tên đường
                  </label>
                  <Input 
                    value={modalStreet}
                    onChange={(e) => setModalStreet(e.target.value)}
                    placeholder="Ví dụ: 123 Nguyễn Huệ"
                    size="large"
                  />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
                    Tỉnh/Thành phố
                  </label>
                  <Select
                    value={modalProvince?.code}
                    size="large"
                    placeholder="Chọn tỉnh/thành phố"
                    showSearch
                    style={{ width: '100%' }}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    onChange={handleModalProvinceChange}
                    options={provinces.map(p => ({
                      value: p.code,
                      label: p.name
                    }))}
                  />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
                    Phường/Xã/Quận/Huyện
                  </label>
                  <Select
                    value={modalWard?.code}
                    size="large"
                    placeholder="Chọn phường/xã/quận/huyện"
                    showSearch
                    style={{ width: '100%' }}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    onChange={(value) => {
                      const ward = modalWards.find(w => w.code === value);
                      setModalWard(ward);
                    }}
                    disabled={modalWards.length === 0}
                    options={modalWards.map(w => ({
                      value: w.code,
                      label: w.name
                    }))}
                  />
                  {modalWards.length === 0 && modalProvince && (
                    <div style={{ marginTop: 4, fontSize: 12, color: '#8c8c8c' }}>
                      Đang tải danh sách phường/xã...
                    </div>
                  )}
                  {!modalProvince && (
                    <div style={{ marginTop: 4, fontSize: 12, color: '#8c8c8c' }}>
                      Vui lòng chọn tỉnh/thành phố trước
                    </div>
                  )}
                </div>
              </div>
            </Modal>

            <div className="form-actions">
              <Button 
                onClick={() => navigate(`/doctors/${doctorData.id}`)}
                size="large"
              >
                Hủy
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={saving}
                icon={<SaveOutlined />}
                size="large"
              >
                Lưu thay đổi
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
}

export default DoctorProfileEditPage;
