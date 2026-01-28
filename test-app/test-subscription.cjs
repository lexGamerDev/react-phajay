#!/usr/bin/env node

import PhaJaySDK from '../dist/index.js';
import dotenv from 'dotenv';

dotenv.config();

// Initialize client
const client = new PhaJaySDK.PhaJayClient({
  apiKey: process.env.PHAJAY_API_KEY,
  environment: process.env.PHAJAY_ENVIRONMENT || 'production',
  baseURL: process.env.PHAJAY_BASE_URL
});

async function testQRSubscription() {
  console.log('🧪 Testing QR Payment Subscription...\n');

  try {
    // 1. Generate QR Code
    console.log('📱 Step 1: Generating QR Code...');
    const qrResult = await client.paymentQR.generateQRByBankName('BCEL', {
      amount: 50000,
      description: 'Subscription Test Payment'
    });
    
    console.log(`✅ QR Generated: ${qrResult.transactionId}`);
    console.log(`📋 QR Code: ${qrResult.qrCode.substring(0, 50)}...`);
    console.log(`🔗 Deep Link: ${qrResult.link}\n`);

    // 2. Create Subscription
    console.log('🔔 Step 2: Creating Subscription...');
    const subscription = client.paymentQR.createSubscription({
      development: true, // Use development mode for testing
      webhookUrl: 'http://localhost:3000/webhook/payment-qr',
      transactionId: qrResult.transactionId
    });

    console.log('✅ Subscription created successfully');

    // 3. Set up event listeners
    subscription.on('paymentCompleted', (data) => {
      console.log('\n🎉 PAYMENT COMPLETED!');
      console.log('📦 Callback Data:');
      console.log(JSON.stringify(data, null, 2));
      
      // Exit after receiving payment
      setTimeout(() => {
        console.log('\n✨ Test completed successfully!');
        process.exit(0);
      }, 1000);
    });

    subscription.on('error', (error) => {
      console.error('\n❌ Subscription Error:', error.message);
    });

    // 4. Start listening
    console.log('👂 Step 3: Starting subscription listener...');
    subscription.start();
    console.log('✅ Subscription is now active\n');

    // 5. Instructions for user
    console.log('📋 Instructions:');
    console.log('1. Open your mobile banking app');
    console.log('2. Scan the QR code or use the deep link above');
    console.log('3. Complete the payment');
    console.log('4. Watch for the real-time callback below');
    console.log('5. Or press Ctrl+C to simulate payment\n');

    // Handle manual simulation
    process.on('SIGINT', async () => {
      console.log('\n🔄 Simulating payment completion...');
      
      const mockData = {
        transactionId: qrResult.transactionId,
        amount: "50000",
        currency: "LAK",
        bankCode: "BCEL",
        status: "COMPLETED",
        paidAt: new Date().toISOString(),
        webhookType: "payment_completed"
      };

      subscription.simulatePayment(mockData);
    });

    console.log('⏳ Waiting for payment or Ctrl+C to simulate...');

  } catch (error) {
    console.error('❌ Test Failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the test
testQRSubscription();
