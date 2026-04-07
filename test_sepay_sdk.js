// Test SePay Node.js SDK để xem cách hoạt động
const { SePayPgClient } = require('sepay-pg-node');

// Khởi tạo client
const client = new SePayPgClient({
  env: 'sandbox',
  merchant_id: 'SP-TEST-PT873684',
  secret_key: 'spsk_test_YtN9NC2N9adiW58jM8CUnBNd95pVtZUK'
});

console.log('=== TEST SEPAY NODE.JS SDK ===\n');

// Lấy checkout URL
const checkoutURL = client.checkout.initCheckoutUrl();
console.log('1. Checkout URL:', checkoutURL);
console.log('');

// Tạo form fields
const checkoutFormfields = client.checkout.initOneTimePaymentFields({
  operation: 'PURCHASE',
  payment_method: 'BANK_TRANSFER',
  order_invoice_number: 'TEST-ORDER-001',
  order_amount: 100000,
  currency: 'VND',
  order_description: 'Test thanh toan don hang',
  success_url: 'https://example.com/success',
  error_url: 'https://example.com/error',
  cancel_url: 'https://example.com/cancel',
});

console.log('2. Form Fields (với signature):');
console.log(JSON.stringify(checkoutFormfields, null, 2));
console.log('');

console.log('3. Field names (kiểm tra snake_case hay camelCase):');
Object.keys(checkoutFormfields).forEach(key => {
  console.log(`   - ${key}: ${checkoutFormfields[key]}`);
});
