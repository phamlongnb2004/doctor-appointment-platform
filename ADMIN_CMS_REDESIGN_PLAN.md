# Admin CMS Redesign Plan - Vertical Sidebar Layout

## Current Structure
- Horizontal tabs at top
- All sections in one page
- No clear organization by page

## New Structure - Vertical Sidebar

### Layout
```
┌─────────────┬──────────────────────────────────┐
│             │                                  │
│  SIDEBAR    │         CONTENT AREA             │
│  (250px)    │                                  │
│             │                                  │
│  📄 Pages   │    Selected Section Content      │
│    Home     │                                  │
│    About    │                                  │
│    News     │                                  │
│             │                                  │
│  ⚙️ Settings│                                  │
│    Site     │                                  │
│    General  │                                  │
│             │                                  │
└─────────────┴──────────────────────────────────┘
```

### Menu Structure

**📄 TRANG CHỦ (Homepage)**
- Banner Slider
- Tiện ích cho khách hàng (Services)
- Tại sao chọn Medlatec (Features)
- Tin tức y khoa (News Articles)
- Đội ngũ chuyên gia (Doctors - read only)
- Các chuyên khoa (Specialties)
- Medlatec trong số liệu (Statistics)
- Chứng nhận & Giải thưởng (Certifications)
- Đánh giá khách hàng (Testimonials)

**📰 TIN TỨC (News)**
- Quản lý bài viết
- Duyệt bài viết bác sĩ

**⚙️ CÀI ĐẶT (Settings)**
- Thông tin website (Site Settings)
- Logo, Hotline, Email, Address

## Implementation Steps

1. Create Layout component with Sider
2. Create Menu with grouped items
3. Move tab content to separate components
4. Add page indicators for each section
5. Improve visual hierarchy

## Benefits
- Better organization
- Clear page context
- Easier navigation
- More professional look
- Scalable structure
