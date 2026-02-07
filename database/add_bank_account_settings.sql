-- Add bank account fields to site_settings table
ALTER TABLE site_settings 
ADD COLUMN bank_id VARCHAR(50) DEFAULT 'MB',
ADD COLUMN bank_name VARCHAR(255) DEFAULT 'MB Bank',
ADD COLUMN bank_account_no VARCHAR(50) DEFAULT '0123456789',
ADD COLUMN bank_account_name VARCHAR(255) DEFAULT 'MEDLATEC';

-- Update existing record with default values
UPDATE site_settings 
SET 
    bank_id = 'MB',
    bank_name = 'MB Bank',
    bank_account_no = '0123456789',
    bank_account_name = 'MEDLATEC'
WHERE id = 1;
