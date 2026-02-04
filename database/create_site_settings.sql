-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    site_name VARCHAR(255) NOT NULL DEFAULT 'MEDLATEC',
    site_tagline VARCHAR(255) DEFAULT 'Chăm sóc sức khỏe',
    logo_url VARCHAR(500),
    hotline VARCHAR(50) NOT NULL DEFAULT '19005656',
    email VARCHAR(255),
    address TEXT,
    facebook_url VARCHAR(500),
    youtube_url VARCHAR(500),
    zalo_url VARCHAR(500)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default settings
INSERT INTO site_settings (site_name, site_tagline, hotline, email, address) 
VALUES ('MEDLATEC', 'Chăm sóc sức khỏe', '19005656', 'info@medlatec.vn', 'Hà Nội, Việt Nam');
