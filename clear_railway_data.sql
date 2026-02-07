-- Disable foreign key checks
SET FOREIGN_KEY_CHECKS = 0;

-- Truncate all tables (keeps structure, removes data)
TRUNCATE TABLE about_achievements;
TRUNCATE TABLE about_content;
TRUNCATE TABLE about_features;
TRUNCATE TABLE about_team_members;
TRUNCATE TABLE appointments;
TRUNCATE TABLE article_cta_section;
TRUNCATE TABLE banners;
TRUNCATE TABLE cart_items;
TRUNCATE TABLE carts;
TRUNCATE TABLE certifications;
TRUNCATE TABLE chat_messages;
TRUNCATE TABLE chat_participants;
TRUNCATE TABLE chat_rooms;
TRUNCATE TABLE doctor_articles;
TRUNCATE TABLE features;
TRUNCATE TABLE medical_service_images;
TRUNCATE TABLE medical_services;
TRUNCATE TABLE membership_benefits;
TRUNCATE TABLE newsletter_subscriptions;
TRUNCATE TABLE news_articles;
TRUNCATE TABLE news_categories;
TRUNCATE TABLE news_sections;
TRUNCATE TABLE news_sidebar_widgets;
TRUNCATE TABLE order_items;
TRUNCATE TABLE orders;
TRUNCATE TABLE site_settings;
TRUNCATE TABLE specialties;
TRUNCATE TABLE users;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;
