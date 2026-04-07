import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Spin, Result, Button } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

function SePayCheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const formRef = useRef(null);
  const sePayResponse = location.state?.sePayResponse;

  useEffect(() => {
    if (!sePayResponse) {
      return;
    }

    // Tự động submit form sau khi render
    if (formRef.current) {
      formRef.current.submit();
    }
  }, [sePayResponse]);

  if (!sePayResponse) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        padding: '24px'
      }}>
        <Result
          status="error"
          title="Lỗi thanh toán"
          subTitle="Không tìm thấy thông tin thanh toán"
          extra={[
            <Button type="primary" key="back" onClick={() => navigate('/checkout')}>
              Quay lại thanh toán
            </Button>,
            <Button key="home" onClick={() => navigate('/')}>
              Về trang chủ
            </Button>
          ]}
        />
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '60vh',
      gap: 24
    }}>
      <Spin 
        indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
        size="large"
      />
      <div style={{ 
        fontSize: 18, 
        color: '#595959',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: 8 }}>
          Đang chuyển đến cổng thanh toán SePay...
        </div>
        <div style={{ fontSize: 14, color: '#8c8c8c' }}>
          Vui lòng không đóng trang này
        </div>
      </div>

      {/* Hidden form để submit đến SePay theo tài liệu - sử dụng camelCase */}
      <form 
        ref={formRef}
        method="POST" 
        action={sePayResponse.checkout_url}
        style={{ display: 'none' }}
      >
        <input type="hidden" name="merchantId" value={sePayResponse.merchantId} />
        <input type="hidden" name="operation" value={sePayResponse.operation} />
        <input type="hidden" name="orderInvoiceNumber" value={sePayResponse.orderInvoiceNumber} />
        <input type="hidden" name="orderAmount" value={sePayResponse.orderAmount} />
        <input type="hidden" name="currency" value={sePayResponse.currency} />
        <input type="hidden" name="orderDescription" value={sePayResponse.orderDescription} />
        <input type="hidden" name="paymentMethod" value={sePayResponse.paymentMethod} />
        <input type="hidden" name="successUrl" value={sePayResponse.successUrl} />
        <input type="hidden" name="errorUrl" value={sePayResponse.errorUrl} />
        <input type="hidden" name="cancelUrl" value={sePayResponse.cancelUrl} />
        <input type="hidden" name="signature" value={sePayResponse.signature} />
        
        {/* Optional fields */}
        {sePayResponse.customerName && (
          <input type="hidden" name="customerName" value={sePayResponse.customerName} />
        )}
        {sePayResponse.customerEmail && (
          <input type="hidden" name="customerEmail" value={sePayResponse.customerEmail} />
        )}
        {sePayResponse.customerPhone && (
          <input type="hidden" name="customerPhone" value={sePayResponse.customerPhone} />
        )}
      </form>
    </div>
  );
}

export default SePayCheckoutPage;
