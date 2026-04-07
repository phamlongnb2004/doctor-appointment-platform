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

      {/* Hidden form để submit đến SePay - THỨ TỰ QUAN TRỌNG! */}
      <form 
        ref={formRef}
        method="POST" 
        action={sePayResponse.checkout_url}
        style={{ display: 'none' }}
      >
        {/* Thứ tự phải giống backend để signature đúng */}
        <input type="hidden" name="merchant" value={sePayResponse.merchant} />
        <input type="hidden" name="operation" value={sePayResponse.operation} />
        <input type="hidden" name="payment_method" value={sePayResponse.payment_method} />
        <input type="hidden" name="order_amount" value={sePayResponse.order_amount} />
        <input type="hidden" name="currency" value={sePayResponse.currency} />
        <input type="hidden" name="order_invoice_number" value={sePayResponse.order_invoice_number} />
        <input type="hidden" name="order_description" value={sePayResponse.order_description} />
        <input type="hidden" name="success_url" value={sePayResponse.success_url} />
        <input type="hidden" name="error_url" value={sePayResponse.error_url} />
        <input type="hidden" name="cancel_url" value={sePayResponse.cancel_url} />
        <input type="hidden" name="signature" value={sePayResponse.signature} />
        
        {/* Optional fields */}
        {sePayResponse.customer_name && (
          <input type="hidden" name="customer_name" value={sePayResponse.customer_name} />
        )}
        {sePayResponse.customer_email && (
          <input type="hidden" name="customer_email" value={sePayResponse.customer_email} />
        )}
        {sePayResponse.customer_phone && (
          <input type="hidden" name="customer_phone" value={sePayResponse.customer_phone} />
        )}
      </form>
    </div>
  );
}

export default SePayCheckoutPage;
