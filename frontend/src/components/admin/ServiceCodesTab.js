import React, { useState, useEffect } from 'react';
import api from '../../services/api';

function ServiceCodesTab() {
    const [codes, setCodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');

    useEffect(() => {
        loadCodes();
    }, []);

    const loadCodes = async () => {
        try {
            setLoading(true);
            const response = await api.get('/wallet/admin/codes');
            setCodes(response.data);
        } catch (err) {
            setError('Không thể tải danh sách mã');
            console.error(err);
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
            'EXPIRED': { text: 'Hết hạn', class: 'status-expired' },
            'CANCELLED': { text: 'Đã hủy', class: 'status-cancelled' }
        };
        const statusInfo = statusMap[status] || { text: status, class: '' };
        return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.text}</span>;
    };

    const filteredCodes = codes.filter(code => {
        const matchesSearch = 
            code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            code.serviceTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            code.userName?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = filterStatus === 'ALL' || code.status === filterStatus;
        
        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: codes.length,
        active: codes.filter(c => c.status === 'ACTIVE').length,
        used: codes.filter(c => c.status === 'USED').length,
        expired: codes.filter(c => c.status === 'EXPIRED').length
    };

    if (loading) {
        return <div className="loading">Đang tải...</div>;
    }

    return (
        <div className="service-codes-tab">
            <div className="tab-header">
                <h2>Quản Lý Mã Dịch Vụ</h2>
                <button onClick={loadCodes} className="btn-refresh">
                    Làm mới
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-value">{stats.total}</div>
                    <div className="stat-label">Tổng số mã</div>
                </div>
                <div className="stat-card active">
                    <div className="stat-value">{stats.active}</div>
                    <div className="stat-label">Còn hiệu lực</div>
                </div>
                <div className="stat-card used">
                    <div className="stat-value">{stats.used}</div>
                    <div className="stat-label">Đã sử dụng</div>
                </div>
                <div className="stat-card expired">
                    <div className="stat-value">{stats.expired}</div>
                    <div className="stat-label">Hết hạn</div>
                </div>
            </div>

            <div className="filters">
                <input
                    type="text"
                    placeholder="Tìm kiếm mã, dịch vụ, bệnh nhân..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="filter-select"
                >
                    <option value="ALL">Tất cả trạng thái</option>
                    <option value="ACTIVE">Còn hiệu lực</option>
                    <option value="USED">Đã sử dụng</option>
                    <option value="EXPIRED">Hết hạn</option>
                    <option value="CANCELLED">Đã hủy</option>
                </select>
            </div>

            <div className="codes-table-container">
                <table className="codes-table">
                    <thead>
                        <tr>
                            <th>Mã</th>
                            <th>Dịch vụ</th>
                            <th>Bệnh nhân</th>
                            <th>Trạng thái</th>
                            <th>Ngày tạo</th>
                            <th>Bác sĩ sử dụng</th>
                            <th>Ngày sử dụng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCodes.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="empty-row">
                                    Không tìm thấy mã nào
                                </td>
                            </tr>
                        ) : (
                            filteredCodes.map(code => (
                                <tr key={code.id}>
                                    <td className="code-cell">{code.code}</td>
                                    <td>{code.serviceTitle}</td>
                                    <td>{code.userName || 'N/A'}</td>
                                    <td>{getStatusBadge(code.status)}</td>
                                    <td>{formatDate(code.createdAt)}</td>
                                    <td>{code.usedByDoctorName || '-'}</td>
                                    <td>{code.usedAt ? formatDate(code.usedAt) : '-'}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <style jsx>{`
                .service-codes-tab {
                    padding: 20px;
                }

                .tab-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                }

                .tab-header h2 {
                    margin: 0;
                    color: #2c3e50;
                }

                .btn-refresh {
                    padding: 10px 20px;
                    background: #3498db;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: background 0.3s;
                }

                .btn-refresh:hover {
                    background: #2980b9;
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin-bottom: 30px;
                }

                .stat-card {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    text-align: center;
                }

                .stat-card.active {
                    border-left: 4px solid #27ae60;
                }

                .stat-card.used {
                    border-left: 4px solid #3498db;
                }

                .stat-card.expired {
                    border-left: 4px solid #e74c3c;
                }

                .stat-value {
                    font-size: 32px;
                    font-weight: bold;
                    color: #2c3e50;
                    margin-bottom: 5px;
                }

                .stat-label {
                    color: #7f8c8d;
                    font-size: 14px;
                }

                .filters {
                    display: flex;
                    gap: 15px;
                    margin-bottom: 20px;
                }

                .search-input,
                .filter-select {
                    padding: 10px;
                    border: 2px solid #ddd;
                    border-radius: 5px;
                    font-size: 14px;
                }

                .search-input {
                    flex: 1;
                }

                .filter-select {
                    min-width: 200px;
                }

                .codes-table-container {
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    overflow-x: auto;
                }

                .codes-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .codes-table th {
                    background: #f8f9fa;
                    padding: 15px;
                    text-align: left;
                    font-weight: 600;
                    color: #2c3e50;
                    border-bottom: 2px solid #ecf0f1;
                }

                .codes-table td {
                    padding: 15px;
                    border-bottom: 1px solid #ecf0f1;
                    color: #555;
                }

                .codes-table tbody tr:hover {
                    background: #f8f9fa;
                }

                .code-cell {
                    font-family: monospace;
                    font-weight: bold;
                    color: #3498db;
                }

                .empty-row {
                    text-align: center;
                    padding: 40px;
                    color: #7f8c8d;
                }

                .status-badge {
                    display: inline-block;
                    padding: 5px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: bold;
                }

                .status-active {
                    background: #d4edda;
                    color: #155724;
                }

                .status-used {
                    background: #d1ecf1;
                    color: #0c5460;
                }

                .status-expired {
                    background: #f8d7da;
                    color: #721c24;
                }

                .status-cancelled {
                    background: #e2e3e5;
                    color: #383d41;
                }

                .error-message {
                    background: #f8d7da;
                    color: #721c24;
                    padding: 15px;
                    border-radius: 5px;
                    margin-bottom: 20px;
                }

                .loading {
                    text-align: center;
                    padding: 40px;
                    color: #7f8c8d;
                }
            `}</style>
        </div>
    );
}

export default ServiceCodesTab;
