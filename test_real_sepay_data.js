// Test với data thực tế từ form
const crypto = require('crypto');

const SECRET_KEY = 'spsk_test_YtN9NC2N9adiW58jM8CUnBNd95pVtZUK';
const MERCHANT_ID = 'SP-TEST-PT873684';

// Data thực tế từ form (theo ảnh)
const realData = {
  merchant: 'SP-TEST-PT873684',
  operation: 'PURCHASE',
  order_invoice_number: 'ORD202604072141452036',
  order_amount: 20000,
  currency: 'VND',
  order_description: 'Thanh toan don hang ORD202604072141452036',
  payment_method: 'BANK_TRANSFER',
  success_url: 'https://doctor-appointment-frontend-ujug.onrender.com/order-success/ORD202604072141452036',
  error_url: 'https://doctor-appointment-frontend-ujug.onrender.com/checkout?error=payment_failed&order=ORD202604072141452036',
  cancel_url: 'https://doctor-appointment-frontend-ujug.onrender.com/checkout?cancelled=true&order=ORD202604072141452036',
  // Các field này KHÔNG được sign
  customer_name: 'Long Pham',
  customer_email: 'phamthanhlong.contact@gmail.com',
  customer_phone: '0912203956'
};

console.log('=== TEST VỚI DATA THỰC TẾ ===\n');

function calculateSignature(fields, secretKey) {
  const signed = [];
  const signedFields = Object.keys(fields).filter(field => [
    'merchant', 'env', 'operation', 'payment_method', 'order_amount',
    'currency', 'order_invoice_number', 'order_description', 'customer_id',
    'agreement_id', 'agreement_name', 'agreement_type',
    'agreement_payment_frequency', 'agreement_amount_per_payment',
    'success_url', 'error_url', 'cancel_url', 'order_id'
  ].includes(field));
  
  console.log('1. Các field được sign:');
  for (const field of signedFields) {
    if (fields[field] === undefined) continue;
    const part = `${field}=${fields[field] ?? ''}`;
    signed.push(part);
    console.log(`   - ${part}`);
  }
  console.log('');
  
  console.log('2. Các field KHÔNG được sign (bị bỏ qua):');
  Object.keys(fields).forEach(field => {
    if (!signedFields.includes(field)) {
      console.log(`   - ${field}=${fields[field]}`);
    }
  });
  console.log('');
  
  const dataString = signed.join(',');
  console.log('3. Data String:');
  console.log(`   ${dataString}`);
  console.log('');
  
  const hmac = crypto.createHmac('sha256', secretKey);
  hmac.update(dataString);
  const signature = hmac.digest('base64');
  
  console.log('4. Signature (Base64):');
  console.log(`   ${signature}`);
  console.log('');
  
  return signature;
}

const signature = calculateSignature(realData, SECRET_KEY);

console.log('5. Form data để submit (bao gồm cả field không sign):');
const formData = {
  ...realData,
  signature: signature
};
Object.keys(formData).forEach(key => {
  console.log(`   ${key}: ${formData[key]}`);
});
