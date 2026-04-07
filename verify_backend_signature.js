// Script để verify signature từ backend
// Chạy: node verify_backend_signature.js

const crypto = require('crypto');

const SECRET_KEY = 'spsk_test_YtN9NC2N9adiW58jM8CUnBNd95pVtZUK';

// Data từ backend logs
const backendData = {
  merchant: 'SP-TEST-PT873684',
  operation: 'PURCHASE',
  payment_method: 'BANK_TRANSFER',
  order_amount: 20000,
  currency: 'VND',
  order_invoice_number: 'ORD202604072210016617',
  order_description: 'Thanh toan don hang ORD202604072210016617',
  success_url: 'https://doctor-appointment-frontend-ujug.onrender.com/order-success/ORD202604072210016617',
  error_url: 'https://doctor-appointment-frontend-ujug.onrender.com/checkout?error=payment_failed&order=ORD202604072210016617',
  cancel_url: 'https://doctor-appointment-frontend-ujug.onrender.com/checkout?cancelled=true&order=ORD202604072210016617'
};

console.log('=== VERIFY BACKEND SIGNATURE ===\n');

console.log('1. Backend Data:');
Object.keys(backendData).forEach(key => {
  console.log(`   ${key} = ${backendData[key]}`);
});
console.log('');

// Tính signature theo SDK
function calculateSignature(fields, secretKey) {
  const signed = [];
  const signedFieldNames = [
    'merchant', 'env', 'operation', 'payment_method', 'order_amount',
    'currency', 'order_invoice_number', 'order_description', 'customer_id',
    'agreement_id', 'agreement_name', 'agreement_type',
    'agreement_payment_frequency', 'agreement_amount_per_payment',
    'success_url', 'error_url', 'cancel_url', 'order_id'
  ];
  
  // Lấy field theo thứ tự xuất hiện trong object
  for (const key in fields) {
    if (signedFieldNames.includes(key) && fields[key] !== undefined && fields[key] !== null) {
      signed.push(`${key}=${fields[key]}`);
    }
  }
  
  console.log('2. Signed Parts:');
  signed.forEach((part, index) => {
    console.log(`   ${index + 1}. ${part}`);
  });
  console.log('');
  
  const dataString = signed.join(',');
  console.log('3. Data String:');
  console.log(`   ${dataString}`);
  console.log('');
  
  const hmac = crypto.createHmac('sha256', secretKey);
  hmac.update(dataString);
  const signature = hmac.digest('base64');
  
  return signature;
}

const expectedSignature = calculateSignature(backendData, SECRET_KEY);

console.log('4. Expected Signature (Node.js):');
console.log(`   ${expectedSignature}`);
console.log('');

// Signature từ backend logs
const backendSignature = 'PMXDf/tqmbwaD/QFxntS6cCsDVsJ2XV0HeusTwcbjAw=';
console.log('5. So sánh:');
console.log(`   Backend:  ${backendSignature}`);
console.log(`   Expected: ${expectedSignature}`);
console.log(`   Match: ${backendSignature === expectedSignature ? 'YES ✓' : 'NO ✗'}`);
