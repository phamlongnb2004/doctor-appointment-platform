import requests
import json

# Test SePay checkout API
def test_sepay_checkout():
    # URL của backend (thay đổi nếu cần)
    base_url = "https://doctor-appointment-backend-mq2p.onrender.com/api"
    # base_url = "http://localhost:8080/api"  # Uncomment để test local
    
    # Dữ liệu checkout
    checkout_data = {
        "items": [
            {
                "serviceId": 1,
                "quantity": 1
            }
        ],
        "customerName": "Nguyen Van Test",
        "customerEmail": "test@example.com",
        "customerPhone": "0123456789",
        "shippingAddress": "123 Test Street"
    }
    
    print("🔄 Đang gửi request checkout...")
    print(f"URL: {base_url}/orders/sepay/checkout")
    print(f"Data: {json.dumps(checkout_data, indent=2, ensure_ascii=False)}")
    
    try:
        response = requests.post(
            f"{base_url}/orders/sepay/checkout",
            json=checkout_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"\n📊 Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ SUCCESS - Không còn lỗi 500!")
            result = response.json()
            print(f"\n📦 Response:")
            print(json.dumps(result, indent=2, ensure_ascii=False))
            
            # Kiểm tra các field quan trọng
            required_fields = [
                'merchantId', 'operation', 'orderInvoiceNumber', 
                'orderAmount', 'currency', 'orderDescription',
                'successUrl', 'errorUrl', 'cancelUrl', 'signature'
            ]
            
            print("\n🔍 Kiểm tra các field bắt buộc:")
            for field in required_fields:
                if field in result:
                    print(f"  ✅ {field}: {result[field]}")
                else:
                    print(f"  ❌ {field}: THIẾU!")
            
            # Kiểm tra operation field
            if result.get('operation') == 'PURCHASE':
                print("\n✅ Field 'operation' đã được thêm đúng!")
            else:
                print(f"\n❌ Field 'operation' sai: {result.get('operation')}")
                
        else:
            print(f"❌ FAILED - Status: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")

# Test IPN endpoint
def test_sepay_ipn():
    base_url = "https://doctor-appointment-backend-mq2p.onrender.com/api"
    # base_url = "http://localhost:8080/api"  # Uncomment để test local
    
    # Giả lập IPN data từ SePay
    ipn_data = {
        "timestamp": 1759134682,
        "notification_type": "ORDER_PAID",
        "order": {
            "id": "test-order-id",
            "order_id": "NQD-TEST123",
            "order_status": "CAPTURED",
            "order_currency": "VND",
            "order_amount": "100000.00",
            "order_invoice_number": "ORD-TEST-001",
            "order_description": "Test payment"
        },
        "transaction": {
            "id": "test-transaction-id",
            "payment_method": "BANK_TRANSFER",
            "transaction_status": "APPROVED",
            "transaction_amount": "100000"
        }
    }
    
    print("\n\n🔄 Đang test IPN endpoint...")
    print(f"URL: {base_url}/orders/sepay/ipn")
    
    try:
        response = requests.post(
            f"{base_url}/orders/sepay/ipn",
            json=ipn_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"\n📊 Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ IPN endpoint hoạt động!")
            print(f"Response: {response.json()}")
        else:
            print(f"❌ IPN failed: {response.text}")
            
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")

if __name__ == "__main__":
    print("=" * 60)
    print("🧪 TEST SEPAY INTEGRATION")
    print("=" * 60)
    
    # Test 1: Checkout API
    test_sepay_checkout()
    
    # Test 2: IPN endpoint
    test_sepay_ipn()
    
    print("\n" + "=" * 60)
    print("✅ Test hoàn tất!")
    print("=" * 60)
