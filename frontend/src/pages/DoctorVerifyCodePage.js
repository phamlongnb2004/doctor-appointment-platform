import React, { useState } from 'react';
import api from '../services/api';
import '../styles/verify-code.css';

function DoctorVerifyCodePage() {
    const [code, setCode] = useState('');
    const [codeInfo, setCodeInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [notes, setNotes] = useState('');
    const [verifySuccess, setVerifySuccess] = useState(false);

    const handleLookup = async (e) => {
        e.preventDefault();
        if (!code.trim()) {
            setError('Vui lòng nhập mã');
            return;
        }

        setLoading(true);
        setError('');
        setCodeInfo(null);
        setVerifySuccess(false);

        try {
            const response = await api.get(`/wallet/codes/lookup/${code.trim()}`);
            setCodeInfo(response.data);
        } catch (err) {
            setError('Không tìm thấy mã hoặc mã không hợp lệ');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async () => {
        if (!window.confirm('Xác nhận sử dụng mã này?')) {
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await api.post('/wallet/codes/verify', {
                code: code.trim(),
                notes: notes
            });
            setCodeInfo(response.data);
            setVerifySuccess(true);
            setNotes('');
        } catch (err) {
            setError('Không thể xác nhận mã: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleString('vi-VN');
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'ACTIVE': { text: 'Còn hiệu lực', class: 'status-active' },
            'USED': { text: 'Đã sử dụng', class: 'status-used' },
            'EXPIRED': { text: 'Hết hạn', class: 'status-expired' }
        };
        const statusInfo = statusMap[status] || { text: status, class: '' };
        return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.text}</span>;
    };

    return (
        <div className="verify-code-page">
            <div className="verify-header">
                <h1>Xác Nhận Mã Dịch Vụ</h1>
                <p>Tra cứu và xác nhận mã sử dụng dịch vụ của bệnh nhân</p>
            </div>

            <div className="verify-container">
                <form onSubmit={handleLookup} className="lookup-form">
                    <div className="form-group">
                        <label>Nhập mã dịch vụ:</label>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                            placeholder="VD: SVC240409123456"
                            className="code-input"
                            disabled={loading}
                        />
                    </div>
                    <button type="submit" className="btn-lookup" disabled={loading}>
                        {loading ? 'Đang tra cứu...' : 'Tra cứu'}
                    </button>
                </form>

                {error && <div className="error-message">{error}</div>}
                {verifySuccess && (
                    <div className="success-message">
                        Đã xác nhận sử dụng mã thành công!
                    </div>
                )}

                {codeInfo && (
                    <div className="code-info-card">
                        <div className="code-info-header">
                            <h2>Thông Tin Mã</h2>
                            {getStatusBadge(codeInfo.status)}
                        </div>

                        <div className="code-details">
                            <div className="detail-row">
                                <span className="label">Mã:</span>
                                <span className="value code-number">{codeInfo.code}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">Dịch vụ:</span>
                                <span className="value">{codeInfo.serviceTitle}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">Bệnh nhân:</span>
                                <span className="value">{codeInfo.userName}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">Ngày tạo:</span>
                                <span className="value">{formatDate(codeInfo.createdAt)}</span>
                            </div>
                            {codeInfo.expiryDate && (
                                <div className="detail-row">
                                    <span className="label">Hết hạn:</span>
                                    <span className="value">{formatDate(codeInfo.expiryDate)}</span>
                                </div>
                            )}
                            {codeInfo.status === 'USED' && (
                                <>
                                    <div className="detail-row">
                                        <span className="label">Đã sử dụng:</span>
                                        <span className="value">{formatDate(codeInfo.usedAt)}</span>
                                    </div>
                                    {codeInfo.usedByDoctorName && (
                                        <div className="detail-row">
                                            <span className="label">Bác sĩ:</span>
                                            <span className="value">{codeInfo.usedByDoctorName}</span>
                                        </div>
                                    )}
                                </>
                            )}
                            {codeInfo.notes && (
                                <div className="detail-row">
                                    <span className="label">Ghi chú:</span>
                                    <span className="value">{codeInfo.notes}</span>
                                </div>
                            )}
                        </div>

                        {codeInfo.valid && codeInfo.status === 'ACTIVE' && (
                            <div className="verify-section">
                                <div className="form-group">
                                    <label>Ghi chú (tùy chọn):</label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Nhập ghi chú về buổi khám..."
                                        rows="3"
                                        className="notes-input"
                                    />
                                </div>
                                <button 
                                    onClick={handleVerify} 
                                    className="btn-verify"
                                    disabled={loading}
                                >
                                    Xác nhận sử dụng
                                </button>
                            </div>
                        )}

                        {!codeInfo.valid && (
                            <div className="warning-message">
                                Mã này không còn hiệu lực hoặc đã được sử dụng
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default DoctorVerifyCodePage;
