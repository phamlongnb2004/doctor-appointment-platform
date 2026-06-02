-- Create password_reset_tokens table for forgot password functionality
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    used BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create index for faster lookups
CREATE INDEX idx_password_reset_token ON password_reset_tokens(token);
CREATE INDEX idx_password_reset_user_id ON password_reset_tokens(user_id);
CREATE INDEX idx_password_reset_expires ON password_reset_tokens(expires_at);

-- Comment
COMMENT ON TABLE password_reset_tokens IS 'Lưu trữ token reset mật khẩu';
COMMENT ON COLUMN password_reset_tokens.token IS 'Token ngẫu nhiên để reset password';
COMMENT ON COLUMN password_reset_tokens.expires_at IS 'Thời gian hết hạn token (15 phút)';
COMMENT ON COLUMN password_reset_tokens.used IS 'Đánh dấu token đã được sử dụng';
