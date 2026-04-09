import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/service-wallet.css';

function ServiceWalletPage() {
    const [wallet, setWallet] = useState(null);
    const [codes, setCodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('services'); // services, codes
    const [showCodeModal, setShowCodeModal] = useState(false);
    const [selectedCode, setSelectedCode] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadWallet();
        loadCodes();
    }, []);

    const loadWallet = async () => {
        try {
            const response = await api.get('/wallet');
            setWallet(response.data);
        } catch (err) {
            setError('Không thể tải ví dịch vụ');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const loadCodes = async () => {
        try {
            const response = await api.get('/wallet/codes');
            setCodes(response.data);
        } catch (err) {
            console.error('Error loading codes:', err);
        }
    };

    const handleUseService = async (itemId) => {
        if (!window.confirm('Bạn có chắc muốn tạo mã sử dụng cho dịch vụ này?')) {
            return;
        }

        try {
            const response = await api.post('/wallet/use', {
                walletItemId: itemId,
                notes: ''
            });
            
            setSelectedCode(response.data);
            setShowCodeModal(true);
            
            // Reload wallet and codes
            await loadWallet();
            await loadCodes();
        } catch (err) {
            alert('Không thể tạo mã sử dụng: ' + (err.response?.data?.message || err.message));
        }
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'ACTIVE': { text: 'Còn hiệu lực', class: 'status-active' },
            'USED': { text: 'Đã sử dụng', class: 'status-used' },
            'EXPIRED': { text: 'Hết hạn', class: 'status-expired' },
            'CANCELLED': { text: 'Đã hủy', class: 'status-cancelled' }
        };
        const statusInfo = statusMap[status] || { text: status, class: '' };
        return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.text}</span>;
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleString('vi-VN');
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    if (loading) {
        return <div className="loading">Đang tải...</div>;
    }

    return (
        <div className="service-wallet-page">
            <div className="wallet-header">
                <h1>Ví Dịch Vụ Của Tôi</h1>
                <p>Quản lý các dịch vụ đã mua và mã sử dụng</p>
            </div>

            <div className="wallet-tabs">
                <button 
                    className={`tab-button ${activeTab === 'services' ? 'active' : ''}`}
                    onClick={() => setActiveTab('services')}
                >
                    Dịch vụ trong ví ({wallet?.items?.length || 0})
                </button>
                <button 
                    className={`tab-button ${activeTab === 'codes' ? 'active' : ''}`}
                    onClick={() => setActiveTab('codes')}
                >
                    Mã sử dụng ({codes.length})
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {activeTab === 'services' && (
                <div className="wallet-services">
                    {wallet?.items?.length === 0 ? (
                        <div className="empty-state">
                            <p>Bạn chưa có dịch vụ nào trong ví</p>
                            <button onClick={() => navigate('/services')} className="btn-primary">
                                Mua dịch vụ
                            </button>
                        </div>
                    ) : (
                        <div className="services-grid">
                            {wallet?.items?.map(item => (
                                <div key={item.id} className="service-card">
                                    {item.serviceImage && (
                                        <img src={item.serviceImage} alt={item.serviceTitle} />
                                    )}
                                    <div className="service-info">
                                        <h3>{item.serviceTitle}</h3>
                                        <p className="service-price">{formatPrice(item.unitPrice)}</p>
                                        <div className="service-quantity">
                                            <span>Số lượng: {item.quantity}</span>
                                            <span>Đã dùng: {item.usedQuantity}</span>
                                            <span className="available">Còn lại: {item.availableQuantity}</span>
                                        </div>
                                        {getStatusBadge(item.status)}
                                        <p className="service-date">
                                            Mua ngày: {formatDate(item.createdAt)}
                                        </p>
                                        {item.expiryDate && (
                                            <p className="service-expiry">
                                                Hết hạn: {formatDate(item.expiryDate)}
                                            </p>
                                        )}
                                        {item.availableQuantity > 0 && item.status === 'ACTIVE' && (
                                            <button 
                                                className="btn-use-service"
                                                onClick={() => handleUseService(item.id)}
                                            >
                                                Sử dụng dịch vụ
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'codes' && (
                <div className="wallet-codes">
                    {codes.length === 0 ? (
                        <div className="empty-state">
                            <p>Bạn chưa có mã sử dụng nào</p>
                        </div>
                    ) : (
                        <div className="codes-list">
                            {codes.map(code => (
                                <div key={code.id} className="code-card">
                                    <div className="code-header">
                                        <h3 className="code-number">{code.code}</h3>
                                        {getStatusBadge(code.status)}
                                    </div>
                                    <div className="code-details">
                                        <p><strong>Dịch vụ:</strong> {code.serviceTitle}</p>
                                        <p><strong>Tạo lúc:</strong> {formatDate(code.createdAt)}</p>
                                        {code.expiryDate && (
                                            <p><strong>Hết hạn:</strong> {formatDate(code.expiryDate)}</p>
                                        )}
                                        {code.status === 'USED' && (
                                            <>
                                                <p><strong>Đã sử dụng:</strong> {formatDate(code.usedAt)}</p>
                                                {code.usedByDoctorName && (
                                                    <p><strong>Bác sĩ:</strong> {code.usedByDoctorName}</p>
                                                )}
                                            </>
                                        )}
                                        {code.notes && (
                                            <p className="code-notes"><strong>Ghi chú:</strong> {code.notes}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {showCodeModal && selectedCode && (
                <div className="modal-overlay" onClick={() => setShowCodeModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2>Mã Sử Dụng Dịch Vụ</h2>
                        <div className="code-display">
                            <div className="code-large">{selectedCode.code}</div>
                            <p className="code-instruction">
                                Vui lòng cung cấp mã này cho bác sĩ khi đến khám
                            </p>
                        </div>
                        <div className="code-info">
                            <p><strong>Dịch vụ:</strong> {selectedCode.serviceTitle}</p>
                            <p><strong>Tạo lúc:</strong> {formatDate(selectedCode.createdAt)}</p>
                            {selectedCode.expiryDate && (
                                <p><strong>Hết hạn:</strong> {formatDate(selectedCode.expiryDate)}</p>
                            )}
                        </div>
                        <button className="btn-close" onClick={() => setShowCodeModal(false)}>
                            Đóng
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ServiceWalletPage;
