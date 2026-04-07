// Test để so sánh signature calculation
const crypto = require('crypto');

// Thông tin test
const SECRET_KEY = 'spsk_test_YtN9NC2N9adiW58jM8CUnBNd95pVtZUK';
const MERCHANT_ID = 'SP-TEST-PT873684';

// Data mẫu giống như Java sẽ tạo
const testData = {
  merchant: MERCHANT_ID,
  operation: 'PURCHASE',
  payment_method: 'BANK_TRANSFER',
  order_amount: 100000,
  currency: 'VND',
  order_invoice_number: 'TEST-ORDER-001',
  order_description: 'Thanh toan don hang TEST-ORDER-001',
  success_url: 'https://doctor-appointment-frontend-ujug.onrender.com/checkout?success=true',
  error_url: 'https://doctor-appointment-frontend-ujug.onrender.com/checkout?error=payment_failed',
  cancel_url: 'https://doctor-appointment-frontend-ujug.onrender.com/checkout?cancelled=true'
};

console.log('=== TEST SIGNATURE CALCULATION ===\n');
console.log('1. Test Data:');
console.log(JSON.stringify(testData, null, 2));
console.log('');

// Tính signature theo cách của SDK
function calculateSignature(fields, secretKey) {
  const signed = [];
  const signedFields = Object.keys(fields).filter(field => [
    'merchant', 'env', 'operation', 'payment_method', 'order_amount',
    'currency', 'order_invoice_number', 'order_description', 'customer_id',
    'agreement_id', 'agreement_name', 'agreement_type',
    'agreement_payment_frequency', 'agreement_amount_per_payment',
    'success_url', 'error_url', 'cancel_url', 'order_id'
  ].includes(field));
  
  for (const field of signedFields) {
    if (fields[field] === undefined) continue;
    signed.push(`${field}=${fields[field] ?? ''}`);
  }
  
  console.log('2. Signed Fields (theo thứ tự):');
  signed.forEach((part, index) => {
    console.log(`   ${index + 1}. ${part}`);
  });
  console.log('');
  
  const dataString = signed.join(',');
  console.log('3. Data String (nối bằng dấu phẩy):');
  console.log(`   "${dataString}"`);
  console.log('');
  
  const hmac = crypto.createHmac('sha256', secretKey);
  hmac.update(dataString);
  const signature = hmac.digest('base64');
  
  console.log('4. Signature (Base64):');
  console.log(`   ${signature}`);
  console.log('');
  
  return signature;
}

const signature = calculateSignature(testData, SECRET_KEY);

console.log('5. Form data hoàn chỉnh để submit:');
const formData = {
  ...testData,
  signature: signature
};
console.log(JSON.stringify(formData, null, 2));
