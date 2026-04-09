-- Service Voucher System
-- Bảng lưu trữ voucher dịch vụ trong ví của khách hàng

CREATE TABLE IF NOT EXISTS service_vouchers (
    id BIGSERIAL PRIMARY KEY,
    voucher_code VARCHAR(20) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL,
    order_id BIGINT NOT NULL,
    order_item_id BIGINT,
    service_id BIGINT NOT NULL,
    service_name VARCHAR(255) NOT NULL,
    service_description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    usage_code VARCHAR(12) UNIQUE,
    used_at TIMESTAMP,
    used_by_doctor_id BIGINT,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_voucher_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_voucher_order FOREIGN KEY (order_id) REFERENCES orders(id),
    CONSTRAINT fk_voucher_service FOREIGN KEY (service_id) REFERENCES medical_services(id),
    CONSTRAINT fk_voucher_doctor FOREIGN KEY (used_by_doctor_id) REFERENCES doctors(id),
    
    CONSTRAINT chk_voucher_status CHECK (status IN ('ACTIVE', 'USED', 'EXPIRED', 'CANCELLED'))
);

-- Index for faster queries
CREATE INDEX idx_voucher_user ON service_vouchers(user_id);
CREATE INDEX idx_voucher_code ON service_vouchers(voucher_code);
CREATE INDEX idx_voucher_usage_code ON service_vouchers(usage_code);
CREATE INDEX idx_voucher_status ON service_vouchers(status);
CREATE INDEX idx_voucher_order ON service_vouchers(order_id);

-- Comments
COMMENT ON TABLE service_vouchers IS 'Bảng lưu trữ voucher dịch vụ trong ví khách hàng';
COMMENT ON COLUMN service_vouchers.voucher_code IS 'Mã voucher duy nhất (VOU-XXXXXX)';
COMMENT ON COLUMN service_vouchers.usage_code IS 'Mã sử dụng 6 chữ số để đi khám (chỉ tạo khi khách ấn "Sử dụng")';
COMMENT ON COLUMN service_vouchers.status IS 'ACTIVE: Chưa dùng, USED: Đã dùng, EXPIRED: Hết hạn, CANCELLED: Đã hủy';
