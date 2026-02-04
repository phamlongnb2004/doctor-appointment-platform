# Admin CMS - Tên Tab theo Trang chủ ✅

## Thứ tự Tab (theo thứ tự xuất hiện trên Trang chủ)

### 1. **Banner Slider** 
- **Key**: `banners`
- **Phần trên trang chủ**: Banner Slider (đầu trang)
- **Mô tả**: Quản lý các banner tự động chuyển ở đầu trang

### 2. **Tiện ích cho khách hàng**
- **Key**: `services`
- **Phần trên trang chủ**: TIỆN ÍCH CHO KHÁCH HÀNG
- **Mô tả**: 4 dịch vụ tiện ích (Đặt lịch, Tra cứu, Bảng giá, Hỏi đáp)

### 3. **Tại sao chọn MEDLATEC?**
- **Key**: `features`
- **Phần trên trang chủ**: TẠI SAO CHỌN MEDLATEC?
- **Mô tả**: 4 tính năng nổi bật với icon emoji

### 4. **Tin tức y khoa**
- **Key**: `news`
- **Phần trên trang chủ**: TIN TỨC Y KHOA
- **Mô tả**: Các bài viết tin tức y tế

### 5. **Các chuyên khoa y tế**
- **Key**: `specialties`
- **Phần trên trang chủ**: Các chuyên khoa y tế tại MEDLATEC
- **Mô tả**: 18 chuyên khoa với icon emoji

### 6. **MEDLATEC trong số liệu**
- **Key**: `statistics`
- **Phần trên trang chủ**: MEDLATEC TRONG SỐ LIỆU
- **Mô tả**: 4 số liệu thống kê (30+ năm, 500K+ bệnh nhân, etc.)

### 7. **Chứng nhận & Giải thưởng**
- **Key**: `certifications`
- **Phần trên trang chủ**: CHỨNG NHẬN & GIẢI THƯỞNG
- **Mô tả**: 6 chứng nhận quốc tế (ISO, CAP, JCI, etc.)

### 8. **Khách hàng nói gì về chúng tôi**
- **Key**: `testimonials`
- **Phần trên trang chủ**: KHÁCH HÀNG NÓI GÌ VỀ CHÚNG TÔI
- **Mô tả**: Đánh giá từ khách hàng

### 9. **Bài viết bác sĩ**
- **Key**: `doctor-articles`
- **Phần trên trang chủ**: Không hiển thị (chỉ ở trang riêng)
- **Mô tả**: Quản lý bài viết do bác sĩ viết

---

## So sánh Tên Tab Cũ vs Mới

| Tên Cũ | Tên Mới | Lý do thay đổi |
|---------|---------|----------------|
| Nội dung trang chủ | ❌ Đã xóa | Không cần thiết |
| Dịch vụ | **Tiện ích cho khách hàng** | Khớp với tên trên trang chủ |
| Tin tức | **Tin tức y khoa** | Khớp với tên trên trang chủ |
| Đánh giá khách hàng | **Khách hàng nói gì về chúng tôi** | Khớp với tên trên trang chủ |
| Bài viết bác sĩ | **Bài viết bác sĩ** | Giữ nguyên |
| Tính năng nổi bật | **Tại sao chọn MEDLATEC?** | Khớp với tên trên trang chủ |
| Banners | **Banner Slider** | Rõ ràng hơn |
| Chuyên khoa | **Các chuyên khoa y tế** | Khớp với tên trên trang chủ |
| Thống kê | **MEDLATEC trong số liệu** | Khớp với tên trên trang chủ |
| Chứng nhận | **Chứng nhận & Giải thưởng** | Khớp với tên trên trang chủ |

---

## Mapping: Tab → Phần Trang chủ

```
┌─────────────────────────────────────────────────────────────┐
│                        TRANG CHỦ                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Banner Slider                    [Tab: Banner Slider]  │
│     (Auto-rotating banners)                                 │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  2. TIỆN ÍCH CHO KHÁCH HÀNG         [Tab: Tiện ích...]    │
│     - Đặt lịch khám                                        │
│     - Tra cứu kết quả                                      │
│     - Bảng giá dịch vụ                                     │
│     - Hỏi đáp chuyên gia                                   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  3. Các dịch vụ y tế MEDLATEC       [Tab: Tiện ích...]    │
│     (3 cards với ảnh)                                       │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  4. TẠI SAO CHỌN MEDLATEC?          [Tab: Tại sao chọn...] │
│     (4 tính năng với icon)                                  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  5. TIN TỨC Y KHOA                  [Tab: Tin tức y khoa]  │
│     (4 bài viết mới nhất)                                   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  6. ĐỘI NGŨ CHUYÊN GIA Y TẾ         [Không có tab CMS]    │
│     (Top 3 bác sĩ - tự động)                                │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  7. Các chuyên khoa y tế tại        [Tab: Các chuyên khoa] │
│     MEDLATEC (18 chuyên khoa)                               │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  8. MEDLATEC TRONG SỐ LIỆU          [Tab: MEDLATEC trong...] │
│     (4 số liệu thống kê)                                    │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  9. CHỨNG NHẬN & GIẢI THƯỞNG        [Tab: Chứng nhận...]   │
│     (6 chứng nhận)                                          │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  10. KHÁCH HÀNG NÓI GÌ VỀ CHÚNG TÔI [Tab: Khách hàng...]   │
│      (3 đánh giá khách hàng)                                │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  11. CƠ SỞ VẬT CHẤT                 [Không có tab CMS]     │
│      (Hardcode - ảnh tĩnh)                                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Lợi ích của việc đổi tên

### ✅ Dễ nhận biết
- Admin nhìn vào tab là biết ngay phần nào trên trang chủ
- Không cần phải đoán hoặc nhớ

### ✅ Chuyên nghiệp
- Tên tab khớp 100% với tên trên trang chủ
- Thống nhất về ngôn ngữ

### ✅ Tiết kiệm thời gian
- Không cần tìm kiếm tab nào quản lý phần nào
- Giảm thiểu nhầm lẫn

---

## Hướng dẫn sử dụng

### Khi muốn chỉnh phần trên trang chủ:

1. **Banner ở đầu trang** → Vào tab **"Banner Slider"**
2. **Tiện ích 4 ô** → Vào tab **"Tiện ích cho khách hàng"**
3. **Tại sao chọn MEDLATEC** → Vào tab **"Tại sao chọn MEDLATEC?"**
4. **Tin tức** → Vào tab **"Tin tức y khoa"**
5. **Chuyên khoa** → Vào tab **"Các chuyên khoa y tế"**
6. **Số liệu** → Vào tab **"MEDLATEC trong số liệu"**
7. **Chứng nhận** → Vào tab **"Chứng nhận & Giải thưởng"**
8. **Đánh giá** → Vào tab **"Khách hàng nói gì về chúng tôi"**

---

## Tab mặc định

Khi mở Admin CMS, tab **"Banner Slider"** sẽ được mở đầu tiên vì:
- Đây là phần đầu tiên trên trang chủ
- Quan trọng nhất (banner chính)
- Thường xuyên cần cập nhật

---

**Ngày cập nhật:** 3 tháng 2, 2026
**Trạng thái:** ✅ Hoàn thành
