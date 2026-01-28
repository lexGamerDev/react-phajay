import dotenv from 'dotenv';
import { PhaJayClient } from '../dist/index.esm.js';

// Load environment variables
dotenv.config();

const client = new PhaJayClient({
  secretKey: process.env.PHAJAY_SECRET_KEY || 'test-key',
  environment: process.env.PHAJAY_ENVIRONMENT || 'sandbox'
});

async function testPaymentLink() {
  console.log('🔗 Testing Payment Link Service...\n');

  try {
    const result = await client.paymentLink.createPaymentLink({
      amount: 50000,
      description: 'Test Payment Link from CLI',
      orderNo: `ORDER_${Date.now()}`,
      tag1: 'test_shop',
      tag2: 'cli_test'
    });

    console.log('✅ Payment Link Created Successfully!');
    console.log('📄 Response:', JSON.stringify(result, null, 2));
    console.log('\n🌐 Open this URL to test payment:');
    console.log(result.redirectURL);
    
  } catch (error) {
    console.error('❌ Payment Link Error:');
    console.error(error.message);
    if (error.details) {
      console.error('Details:', error.details);
    }
  }
}

// Run if called directly
if (process.argv[1].endsWith('test-payment-link.js')) {
  testPaymentLink();
}

export { testPaymentLink };
