import dotenv from 'dotenv';
import { PhaJayClient } from '../dist/index.esm.js';

// Load environment variables
dotenv.config();

const client = new PhaJayClient({
  secretKey: process.env.PHAJAY_SECRET_KEY || 'test-key',
  environment: process.env.PHAJAY_ENVIRONMENT || 'sandbox'
});

async function testCreditCard() {
  console.log('💳 Testing Credit Card Service...\n');

  try {
    const result = await client.creditCard.createPayment({
      amount: 100,
      description: 'Test Credit Card Payment from CLI',
      tag1: 'test_customer',
      tag2: 'cli_test',
      tag3: `ORDER_CC_${Date.now()}`
    });

    console.log('✅ Credit Card Payment Created Successfully!');
    console.log('📄 Response:', JSON.stringify(result, null, 2));
    console.log('\n🌐 Open this URL to test payment:');
    console.log(result.paymentUrl);
    console.log('\n⏰ Payment expires at:', result.expirationTime);
    
  } catch (error) {
    console.error('❌ Credit Card Error:');
    console.error(error.message);
    if (error.details) {
      console.error('Details:', error.details);
    }
    
    // Check common issues
    if (error.message.includes('KYC') || error.message.includes('unauthorized')) {
      console.log('\n💡 Note: Credit Card payments require KYC approval.');
      console.log('Please ensure your account is KYC-approved at https://portal.phajay.co/');
    }
  }
}

// Run if called directly
if (process.argv[1].endsWith('test-credit-card.js')) {
  testCreditCard();
}

export { testCreditCard };
