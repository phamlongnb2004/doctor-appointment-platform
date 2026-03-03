-- Add doctors page hero section settings to site_settings table

ALTER TABLE site_settings 
ADD COLUMN doctors_hero_title VARCHAR(255) DEFAULT 'Đặt lịch khám bác sĩ';

ALTER TABLE site_settings 
ADD COLUMN doctors_hero_subtitle VARCHAR(500) DEFAULT 'Tìm kiếm và đặt lịch khám với hơn 200 bác sĩ chuyên khoa hàng đầu';

ALTER TABLE site_settings 
ADD COLUMN doctors_hero_background VARCHAR(500);

-- Update default values if site_settings exists
UPDATE site_settings 
SET 
    doctors_hero_title = COALESCE(doctors_hero_title, 'Đặt lịch khám bác sĩ'),
    doctors_hero_subtitle = COALESCE(doctors_hero_subtitle, 'Tìm kiếm và đặt lịch khám với hơn 200 bác sĩ chuyên khoa hàng đầu')
WHERE id = 1;
