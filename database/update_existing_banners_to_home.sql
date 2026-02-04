-- Update existing banners to have page = 'home' if not already set
-- This ensures existing banners continue to show on homepage

UPDATE banners 
SET page = 'home' 
WHERE page IS NULL OR page = '';

-- Verify the update
SELECT id, image_url, page, display_order, is_active 
FROM banners 
ORDER BY page, display_order;
