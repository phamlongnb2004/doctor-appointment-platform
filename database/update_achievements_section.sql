-- Add icon_url column to about_achievements table for custom icon uploads
ALTER TABLE about_achievements 
ADD COLUMN icon_url VARCHAR(500) AFTER icon;

-- Create table for achievements section settings (title, background image)
CREATE TABLE IF NOT EXISTS about_achievements_section (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    section_title VARCHAR(255) NOT NULL DEFAULT 'Con số ấn tượng',
    background_image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default section settings
INSERT INTO about_achievements_section (section_title, is_active) VALUES
('Con số ấn tượng', TRUE);
