# Hướng dẫn cập nhật HomePage.js - Code đầy đủ

## Phần 1: Xóa hardcode specialties array

Tìm và XÓA đoạn code này (khoảng dòng 137-155):

```javascript
const specialties = [
  { name: 'Chuyên khoa Nội', icon: '🫁', color: '#1890ff' },
  { name: 'Ung bướu', icon: '🎗️', color: '#52c41a' },
  { name: 'Chuyên khoa Sản Phụ khoa', icon: '👶', color: '#fa8c16' },
  { name: 'Chẩn đoán hình ảnh', icon: '📷', color: '#1890ff' },
  { name: 'Trung tâm xét nghiệm MEDLATEC', icon: '🔬', color: '#722ed1' },
  { name: 'Khoa ngoại', icon: '⚕️', color: '#eb2f96' },
  { name: 'Tiêu hóa', icon: '🫄', color: '#13c2c2' },
  { name: 'Nội tiết', icon: '🩺', color: '#a0d911' },
  { name: 'Tim mạch', icon: '❤️', color: '#f5222d' },
  { name: 'Nam khoa', icon: '👨', color: '#1890ff' },
  { name: 'Chuyên khoa Cơ xương khớp', icon: '🦴', color: '#52c41a' },
  { name: 'Truyền nhiễm', icon: '🦠', color: '#fa8c16' },
  { name: 'Thần kinh', icon: '🧠', color: '#722ed1' },
  { name: 'Nhi khoa', icon: '👶', color: '#eb2f96' },
  { name: 'Mắt', icon: '👁️', color: '#13c2c2' },
  { name: 'Tai mũi họng', icon: '👂', color: '#a0d911' },
  { name: 'Da liễu', icon: '🧴', color: '#f5222d' },
  { name: 'Răng hàm mặt', icon: '🦷', color: '#1890ff' }
];
```

## Phần 2: Thay thế Specialties Section

Tìm phần `{/* Specialties Section - CÁC CHUYÊN KHOA Y TẾ TẠI MEDLATEC */}` (khoảng dòng 1000-1100)

Thay thế toàn bộ phần render specialties.map bằng code sau:

```javascript
{/* Specialties Section - CÁC CHUYÊN KHOA Y TẾ TẠI MEDLATEC */}
<div style={{ 
  background: '#fff',
  padding: '80px 24px'
}}>
  <div style={{ maxWidth: 1200, margin: '0 auto' }}>
    <div style={{ textAlign: 'center', marginBottom: 48 }}>
      <Title level={2} style={{ color: '#262626', marginBottom: 16, fontSize: 32 }}>
        Các chuyên khoa y tế tại <span style={{ color: '#1890ff' }}>MEDLATEC</span>
      </Title>
    </div>
    
    <div style={{ 
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: 2,
      background: '#f0f0f0',
      borderRadius: 12,
      overflow: 'hidden'
    }}>
      {specialties.length > 0 ? (
        specialties.map((specialty, index) => (
          <div
            key={specialty.id || index}
            style={{
              background: '#fff',
              padding: '32px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: index === 3 ? '3px solid #1890ff' : 'none',
              position: 'relative',
              minHeight: 140
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f0f9ff';
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(24,144,255,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#fff';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            onClick={() => navigate('/doctors')}
          >
            <div style={{ fontSize: 40, marginBottom: 16 }}>{specialty.icon}</div>
            <div style={{ 
              color: specialty.color, 
              fontWeight: 600,
              fontSize: 14,
              lineHeight: 1.4
            }}>
              {specialty.name}
            </div>
            {index === 3 && (
              <div style={{
                position: 'absolute',
                top: 8,
                right: 8,
                background: '#1890ff',
                color: '#fff',
                fontSize: 10,
                padding: '4px 8px',
                borderRadius: 4,
                fontWeight: 600
              }}>
                HOT
              </div>
            )}
          </div>
        ))
      ) : (
        // Fallback if no data
        <>
          <div style={{ background: '#fff', padding: '32px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🫁</div>
            <div style={{ color: '#1890ff', fontWeight: 600, fontSize: 14 }}>
              Chuyên khoa Nội
            </div>
          </div>
          {/* Add more fallback items if needed */}
        </>
      )}
    </div>
    
    <div style={{ textAlign: 'center', marginTop: 32 }}>
      <Button 
        size="large"
        style={{ 
          borderRadius: 8,
          border: '2px solid #1890ff',
          color: '#1890ff',
          fontWeight: 600,
          padding: '0 32px',
          height: 48
        }}
        onClick={() => navigate('/doctors')}
      >
        Xem tất cả
      </Button>
    </div>
  </div>
</div>
```

## Phần 3: Thay thế Certifications Section

Tìm phần `{/* Certifications Section */}` (khoảng dòng 1250-1350)

Thay thế toàn bộ section bằng code sau:

```javascript
{/* Certifications Section */}
<div style={{ 
  background: '#fff',
  padding: '80px 24px'
}}>
  <div style={{ maxWidth: 1200, margin: '0 auto' }}>
    <div style={{ textAlign: 'center', marginBottom: 48 }}>
      <Title level={2} style={{ color: '#262626', marginBottom: 16, fontSize: 32 }}>
        CHỨNG NHẬN & GIẢI THƯỞNG
      </Title>
      <Paragraph style={{ color: '#666', fontSize: 16 }}>
        Được công nhận bởi các tổ chức uy tín trong và ngoài nước
      </Paragraph>
    </div>
    
    <Row gutter={[32, 32]} justify="center">
      {certifications.length > 0 ? (
        certifications.map((cert, index) => (
          <Col xs={12} sm={8} md={4} key={cert.id || index}>
            <div style={{ 
              textAlign: 'center',
              padding: 24,
              background: '#f8f9fa',
              borderRadius: 12,
              border: `2px solid ${cert.color}`
            }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{cert.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: cert.color }}>
                {cert.name}
              </div>
            </div>
          </Col>
        ))
      ) : (
        // Fallback if no data
        <>
          <Col xs={12} sm={8} md={4}>
            <div style={{ 
              textAlign: 'center',
              padding: 24,
              background: '#f8f9fa',
              borderRadius: 12,
              border: '2px solid #1890ff'
            }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🏆</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1890ff' }}>
                ISO 15189:2022
              </div>
            </div>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <div style={{ 
              textAlign: 'center',
              padding: 24,
              background: '#f8f9fa',
              borderRadius: 12,
              border: '2px solid #52c41a'
            }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>✅</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#52c41a' }}>
                CAP ACCREDITED
              </div>
            </div>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <div style={{ 
              textAlign: 'center',
              padding: 24,
              background: '#f8f9fa',
              borderRadius: 12,
              border: '2px solid #fa8c16'
            }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🎖️</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#fa8c16' }}>
                BỘ Y TẾ
              </div>
            </div>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <div style={{ 
              textAlign: 'center',
              padding: 24,
              background: '#f8f9fa',
              borderRadius: 12,
              border: '2px solid #722ed1'
            }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🌟</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#722ed1' }}>
                TOP 10 VN
              </div>
            </div>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <div style={{ 
              textAlign: 'center',
              padding: 24,
              background: '#f8f9fa',
              borderRadius: 12,
              border: '2px solid #eb2f96'
            }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🏥</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#eb2f96' }}>
                JCI STANDARD
              </div>
            </div>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <div style={{ 
              textAlign: 'center',
              padding: 24,
              background: '#f8f9fa',
              borderRadius: 12,
              border: '2px solid #13c2c2'
            }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🔬</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#13c2c2' }}>
                NABL CERTIFIED
              </div>
            </div>
          </Col>
        </>
      )}
    </Row>
  </div>
</div>
```

## Lưu ý

- Đảm bảo đã thêm states `specialties` và `certifications` ở đầu component
- Đảm bảo đã fetch data trong `fetchAllData()`
- Sau khi cập nhật, save file và kiểm tra không có lỗi syntax
- Frontend sẽ tự reload và hiển thị dữ liệu mới

## Kiểm tra

1. Mở Console (F12) - không có lỗi
2. Trang chủ hiển thị đầy đủ specialties và certifications
3. Hover vào các items có hiệu ứng
4. Click vào specialty navigate đến /doctors

---

**Hoàn thành! Tất cả nội dung đã dynamic! 🎉**
