-- Tạo bảng service_wallets (ví dịch vụ)
CREATE TABLE IF NOT EXISTS service_wallets (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tạo bảng service_wallet_items (các dịch vụ trong ví)
CREATE TABLE IF NOT EXISTS service_wallet_items (
    id BIGSERIAL PRIMARY KEY,
    wallet_id BIGINT NOT NULL,
    order_id BIGINT NOT NULL,
    order_number VARCHAR(50) NOT NULL,
    service_id BIGINT NOT NULL,
    service_title VARCHAR(255) NOT NULL,
    service_image TEXT,
    service_slug VARCHAR(255),
    quantity INTEGER NOT NULL DEFAULT 1,
    used_quantity INTEGER NOT NULL DEFAULT 0,
    unit_price DECIMAL(15, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    expiry_date TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (wallet_id) REFERENCES service_wallets(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES medical_services(id) ON DELETE CASCADE
);

-- Tạo bảng service_usage_codes (mã sử dụng dịch vụ)
CREATE TABLE IF NOT EXISTS service_usage_codes (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    wallet_item_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    service_id BIGINT NOT NULL,
    service_title VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    used_by_doctor_id BIGINT,
    used_at TIMESTAMP,
    expiry_date TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (wallet_item_id) REFERENCES service_wallet_items(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES medical_services(id) ON DELETE CASCADE,
    FOREIGN KEY (used_by_doctor_id) REFERENCES doctors(id) ON DELETE SET NULL
);

-- Tạo indexes để tăng hiệu suất truy vấn
CREATE INDEX IF NOT EXISTS idx_service_wallets_user_id ON service_wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_service_wallet_items_wallet_id ON service_wallet_items(wallet_id);
CREATE INDEX IF NOT EXISTS idx_service_wallet_items_order_id ON service_wallet_items(order_id);
CREATE INDEX IF NOT EXISTS idx_service_wallet_items_status ON service_wallet_items(status);
CREATE INDEX IF NOT EXISTS idx_service_usage_codes_code ON service_usage_codes(code);
CREATE INDEX IF NOT EXISTS idx_service_usage_codes_user_id ON service_usage_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_service_usage_codes_status ON service_usage_codes(status);
CREATE INDEX IF NOT EXISTS idx_service_usage_codes_used_by_doctor_id ON service_usage_codes(used_by_doctor_id);

-- Comments để giải thích các bảng
COMMENT ON TABLE service_wallets IS 'Ví dịch vụ của người dùng';
COMMENT ON TABLE service_wallet_items IS 'Các dịch vụ đã mua trong ví';
COMMENT ON TABLE service_usage_codes IS 'Mã sử dụng dịch vụ (mỗi mã chỉ dùng 1 lần)';

COMMENT ON COLUMN service_wallet_items.status IS 'ACTIVE: Còn dùng được, USED: Đã dùng hết, EXPIRED: Hết hạn';
COMMENT ON COLUMN service_usage_codes.status IS 'ACTIVE: Chưa dùng, USED: Đã dùng, EXPIRED: Hết hạn, CANCELLED: Đã hủy';
