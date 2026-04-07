#!/usr/bin/env python3
"""
Test SePay configuration by calling backend API
"""
import requests
import json

BACKEND_URL = "https://doctor-appointment-backend-mq2p.onrender.com/api"

def test_sepay_config():
    print("=" * 50)
    print("Kiểm tra cấu hình SePay...")
    print("=" * 50)
    
    # Test 1: Check if backend is running
    print("\n1. Kiểm tra backend...")
    try:
        response = requests.get(f"{BACKEND_URL}/orders/test", timeout=10)
        if response.status_code == 200:
            print("✓ Backend đang chạy")
        else:
            print(f"✗ Backend trả về status: {response.status_code}")
            return
    except Exception as e:
        print(f"✗ Không thể kết nối backend: {e}")
        return
    
    # Test 2: Try to create a test checkout
    print("\n2. Thử tạo checkout SePay...")
    
    checkout_data = {
        "customerName": "Test User",
        "customerEmail": "test@example.com",
        "customerPhone": "0123456789",
        "shippingAddress": "Test Address",
        "paymentMethod": "SEPAY",
        "items": [
            {
                "serviceId": 1,
                "serviceName": "Test Service",
                "quantity": 1,
                "price": 100000
            }
        ]
    }
    
    try:
        response = requests.post(
            f"{BACKEND_URL}/orders/sepay/checkout?userId=1",
            json=checkout_data,
            timeout=30
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print("✓ Checkout thành công!")
            data = response.json()
            print(f"\nResponse:")
            print(json.dumps(data, indent=2, ensure_ascii=False))
        else:
            print(f"✗ Lỗi {response.status_code}")
            print(f"\nResponse:")
            try:
                print(json.dumps(response.json(), indent=2, ensure_ascii=False))
            except:
                print(response.text)
                
    except requests.exceptions.Timeout:
        print("✗ Timeout - Backend mất quá nhiều thời gian để phản hồi")
    except Exception as e:
        print(f"✗ Lỗi: {e}")
    
    print("\n" + "=" * 50)
    print("Kết luận:")
    print("=" * 50)
    print("""
Nếu thấy lỗi 500:
1. Kiểm tra biến môi trường SePay trên Render
2. Đảm bảo đã set: SEPAY_MERCHANT_ID, SEPAY_SECRET_KEY
3. Deploy lại backend sau khi thêm biến môi trường

Nếu thấy lỗi khác:
- Kiểm tra logs trên Render Dashboard
- Tab Logs → Tìm dòng có "SePay" hoặc "checkout"
    """)

if __name__ == '__main__':
    test_sepay_config()
