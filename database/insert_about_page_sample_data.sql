-- Insert sample data for About Page
-- Run this after creating the about_page_content table

-- Hero Section
INSERT INTO about_page_content (section_key, content_json, is_active, created_at, updated_at) VALUES
('hero', '{
  "title": "Về Chúng Tôi",
  "subtitle": "Hệ thống Y tế chất lượng cao",
  "backgroundImage": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1920"
}', true, NOW(), NOW());

-- Mission Section
INSERT INTO about_page_content (section_key, content_json, is_active, created_at, updated_at) VALUES
('mission', '{
  "label": "SỨ MỆNH CỦA CHÚNG TÔI",
  "title": "Mang đến dịch vụ y tế chất lượng cao",
  "description": "Chúng tôi cam kết cung cấp dịch vụ chăm sóc sức khỏe toàn diện, chuyên nghiệp với đội ngũ bác sĩ giàu kinh nghiệm và trang thiết bị hiện đại. Sứ mệnh của chúng tôi là đem lại sức khỏe và hạnh phúc cho mọi người.",
  "imageUrl": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800",
  "features": [
    "Đội ngũ bác sĩ chuyên môn cao",
    "Trang thiết bị y tế hiện đại",
    "Dịch vụ chăm sóc tận tâm",
    "Giá cả hợp lý, minh bạch"
  ]
}', true, NOW(), NOW());

-- Core Values
INSERT INTO about_page_content (section_key, content_json, is_active, created_at, updated_at) VALUES
('values', '[
  {
    "icon": "HeartOutlined",
    "title": "Tận Tâm",
    "description": "Chăm sóc bệnh nhân với sự tận tâm và trách nhiệm cao nhất",
    "color": "#ff4d4f"
  },
  {
    "icon": "SafetyOutlined",
    "title": "An Toàn",
    "description": "Đảm bảo an toàn tuyệt đối trong mọi quy trình điều trị",
    "color": "#52c41a"
  },
  {
    "icon": "TeamOutlined",
    "title": "Đồng Hành",
    "description": "Luôn đồng hành cùng bệnh nhân trên hành trình chữa bệnh",
    "color": "#1890ff"
  },
  {
    "icon": "TrophyOutlined",
    "title": "Chất Lượng",
    "description": "Cam kết chất lượng dịch vụ y tế hàng đầu",
    "color": "#faad14"
  }
]', true, NOW(), NOW());

-- Achievements
INSERT INTO about_page_content (section_key, content_json, is_active, created_at, updated_at) VALUES
('achievements', '[
  {
    "_section": true,
    "sectionTitle": "Con số ấn tượng",
    "backgroundImage": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920",
    "overlayColor": "rgba(0, 0, 0, 0.6)",
    "labelColor": "#FFFFFF",
    "titleColor": "#FFFFFF",
    "textColor": "#FFFFFF"
  },
  {
    "value": 15,
    "suffix": "+",
    "title": "Năm kinh nghiệm",
    "iconUrl": ""
  },
  {
    "value": 50,
    "suffix": "+",
    "title": "Bác sĩ chuyên khoa",
    "iconUrl": ""
  },
  {
    "value": 100,
    "suffix": "K+",
    "title": "Bệnh nhân tin tưởng",
    "iconUrl": ""
  },
  {
    "value": 98,
    "suffix": "%",
    "title": "Hài lòng dịch vụ",
    "iconUrl": ""
  }
]', true, NOW(), NOW());

-- Timeline
INSERT INTO about_page_content (section_key, content_json, is_active, created_at, updated_at) VALUES
('timeline', '[
  {
    "year": "2010",
    "title": "Thành lập",
    "description": "Khởi đầu với phòng khám nhỏ, chúng tôi đặt nền móng cho sứ mệnh chăm sóc sức khỏe cộng đồng"
  },
  {
    "year": "2015",
    "title": "Mở rộng quy mô",
    "description": "Nâng cấp thành bệnh viện đa khoa với đầy đủ chuyên khoa và trang thiết bị hiện đại"
  },
  {
    "year": "2020",
    "title": "Chuyển đổi số",
    "description": "Triển khai hệ thống đặt lịch khám online và quản lý hồ sơ bệnh án điện tử"
  },
  {
    "year": "2024",
    "title": "Phát triển bền vững",
    "description": "Trở thành một trong những hệ thống y tế hàng đầu với hơn 100,000 bệnh nhân tin tưởng"
  }
]', true, NOW(), NOW());

-- Team
INSERT INTO about_page_content (section_key, content_json, is_active, created_at, updated_at) VALUES
('team', '[
  {
    "name": "BS. Nguyễn Văn A",
    "position": "Giám đốc Y khoa",
    "specialty": "Tim mạch",
    "avatarUrl": "https://i.pravatar.cc/150?img=12"
  },
  {
    "name": "BS. Trần Thị B",
    "position": "Phó Giám đốc",
    "specialty": "Nội khoa",
    "avatarUrl": "https://i.pravatar.cc/150?img=5"
  },
  {
    "name": "BS. Lê Văn C",
    "position": "Trưởng khoa Ngoại",
    "specialty": "Ngoại khoa",
    "avatarUrl": "https://i.pravatar.cc/150?img=33"
  },
  {
    "name": "BS. Phạm Thị D",
    "position": "Trưởng khoa Sản",
    "specialty": "Sản phụ khoa",
    "avatarUrl": "https://i.pravatar.cc/150?img=9"
  }
]', true, NOW(), NOW());
