# Hướng Dẫn Chat Với Bác Sĩ

## Tính năng mới
Đã thêm chức năng chat trực tiếp với bác sĩ từ:
1. **Trang danh sách bác sĩ** (`/doctors`)
2. **Trang chi tiết bác sĩ** (`/doctors/:id`)

## Cách sử dụng

### 1. Từ trang danh sách bác sĩ
- Truy cập `/doctors`
- Xem danh sách các bác sĩ
- Mỗi card bác sĩ có 2 nút:
  - **"Xem chi tiết"**: Chuyển đến trang chi tiết bác sĩ
  - **"Chat"**: Bắt đầu chat trực tiếp với bác sĩ

### 2. Từ trang chi tiết bác sĩ
- Truy cập `/doctors/:id`
- Xem thông tin chi tiết bác sĩ
- Có nút **"Chat với [Tên bác sĩ]"** màu xanh lá
- Click để bắt đầu chat

## Quyền chat
Hệ thống kiểm tra quyền chat dựa trên role:
- **PATIENT**: Có thể chat với DOCTOR và CONSULTANT
- **DOCTOR**: Có thể chat với PATIENT và CONSULTANT  
- **CONSULTANT**: Có thể chat với PATIENT và DOCTOR
- **ADMIN**: Có thể chat với tất cả

## Luồng hoạt động
1. User click nút "Chat"
2. Hệ thống kiểm tra quyền chat giữa 2 user
3. Nếu có quyền:
   - Tạo hoặc lấy phòng chat private giữa 2 người
   - Chuyển đến trang chat với phòng đã chọn
4. Nếu không có quyền: Hiển thị thông báo lỗi

## API endpoints sử dụng
- `GET /api/chat/can-chat/{userId1}/{userId2}`: Kiểm tra quyền chat
- `POST /api/chat/rooms/private`: Tạo hoặc lấy phòng chat private

## Files đã cập nhật
1. `frontend/src/pages/DoctorListPage.js`: Thêm nút chat trong danh sách
2. `frontend/src/pages/DoctorDetailPage.js`: Thêm nút chat trong chi tiết
3. `frontend/src/components/ChatButton.js`: Cải thiện UI và text
4. `frontend/src/pages/LoginPage.js`: Lưu thêm thông tin user vào localStorage
5. `frontend/src/App.js`: Xóa thông tin user khi logout

## Test accounts
- Patient: patient@doctor.com / password123
- Doctor: doctor@doctor.com / password123
- Consultant: consultant@doctor.com / password123
- Admin: admin@doctor.com / password123

## Cách test
1. Login với tài khoản patient
2. Truy cập `/doctors`
3. Click nút "Chat" trên bất kỳ bác sĩ nào
4. Sẽ được chuyển đến trang chat với phòng chat private
5. Có thể nhắn tin trực tiếp với bác sĩ

## Lưu ý
- Cần đăng nhập để sử dụng chức năng chat
- Chỉ có thể chat với những role được phép theo quy định
- Chat là real-time thông qua WebSocket