import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/forgot-password.css';

function ForgotPasswordPage() {
    const [step, setStep] = useState(1); // 1: Email, 2: Token, 3: New Password
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    // Step 1: Gửi email
    const handleSendEmail = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await api.post('/users/forgot-password', { email });
            setSuccess(response.data.message);
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.error || 'Có lỗi xảy ra, vui lòng thử lại');
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Xác nhận token
    const handleVerifyToken = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await api.post('/users/verify-reset-token', { token });
            if (response.data.valid) {
                setSuccess('Mã xác nhận hợp lệ!');
                setStep(3);
            } else {
                setError('Mã xác nhận không hợp lệ hoặc đã hết hạn');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Mã xác nhận không hợp lệ');
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Đặt lại mật khẩu
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validate
        if (newPassword.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        setLoading(true);

        try {
            const response = await api.post('/users/reset-password', {
                token,
                newPassword
            });
            setSuccess(response.data.message);
            
            // Chuyển về trang login sau 2 giây
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Có lỗi xảy ra, vui lòng thử lại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password-page">
            <div className="forgot-password-container">
                <div className="forgot-password-header">
                    <div className="back-button" onClick={() => navigate('/login')}>
                        ← Quay lại đăng nhập
                    </div>
                    <h1>Quên mật khẩu</h1>
                    <p className="subtitle">
                        {step === 1 && 'Nhập email để nhận mã xác nhận'}
                        {step === 2 && 'Nhập mã xác nhận đã gửi đến email'}
                        {step === 3 && 'Tạo mật khẩu mới cho tài khoản'}
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="progress-steps">
                    <div className={`step ${step >= 1 ? 'active' : ''}`}>
                        <div className="step-number">1</div>
                        <div className="step-label">Email</div>
                    </div>
                    <div className={`step-line ${step >= 2 ? 'active' : ''}`}></div>
                    <div className={`step ${step >= 2 ? 'active' : ''}`}>
                        <div className="step-number">2</div>
                        <div className="step-label">Xác nhận</div>
                    </div>
                    <div className={`step-line ${step >= 3 ? 'active' : ''}`}></div>
                    <div className={`step ${step >= 3 ? 'active' : ''}`}>
                        <div className="step-number">3</div>
                        <div className="step-label">Mật khẩu mới</div>
                    </div>
                </div>

                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="alert alert-success">
                        {success}
                    </div>
                )}

                {/* Step 1: Email */}
                {step === 1 && (
                    <form onSubmit={handleSendEmail} className="forgot-password-form">
                        <div className="form-group">
                            <label>Email đăng ký</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="email@example.com"
                                required
                                disabled={loading}
                            />
                            <small>Nhập email bạn đã dùng để đăng ký tài khoản</small>
                        </div>

                        <button 
                            type="submit" 
                            className="btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Đang gửi...' : 'Gửi mã xác nhận'}
                        </button>
                    </form>
                )}

                {/* Step 2: Token */}
                {step === 2 && (
                    <form onSubmit={handleVerifyToken} className="forgot-password-form">
                        <div className="form-group">
                            <label>Mã xác nhận</label>
                            <input
                                type="text"
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                placeholder="Nhập mã 6 chữ số"
                                maxLength="6"
                                required
                                disabled={loading}
                                className="token-input"
                            />
                            <small>Mã xác nhận gồm 6 chữ số đã được gửi đến email <strong>{email}</strong></small>
                        </div>

                        <div className="form-actions">
                            <button 
                                type="button" 
                                className="btn-secondary"
                                onClick={() => setStep(1)}
                                disabled={loading}
                            >
                                ← Quay lại
                            </button>
                            <button 
                                type="submit" 
                                className="btn-primary"
                                disabled={loading}
                            >
                                {loading ? 'Đang xác nhận...' : 'Xác nhận'}
                            </button>
                        </div>

                        <div className="resend-section">
                            <p>Không nhận được mã?</p>
                            <button 
                                type="button"
                                className="btn-link"
                                onClick={() => {
                                    setStep(1);
                                    setToken('');
                                }}
                                disabled={loading}
                            >
                                Gửi lại mã
                            </button>
                        </div>
                    </form>
                )}

                {/* Step 3: New Password */}
                {step === 3 && (
                    <form onSubmit={handleResetPassword} className="forgot-password-form">
                        <div className="form-group">
                            <label>Mật khẩu mới</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Nhập mật khẩu mới"
                                minLength="6"
                                required
                                disabled={loading}
                            />
                            <small>Mật khẩu phải có ít nhất 6 ký tự</small>
                        </div>

                        <div className="form-group">
                            <label>Xác nhận mật khẩu</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Nhập lại mật khẩu mới"
                                minLength="6"
                                required
                                disabled={loading}
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default ForgotPasswordPage;
