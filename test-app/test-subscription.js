/**
 * Test script for PhaJay QR Subscription
 * Tests real-time payment callbacks using Socket.IO
 */

import { PaymentQRService } from '../dist/index.esm.js';

// Configuration
const config = {
  secretKey: 'sk_test_example', // Replace with your actual secret key
  // Optional: specify custom subscription server
  // subscriptionUrl: 'wss://phajay.example.com'
};

async function testQRSubscription() {
  console.log('🚀 Testing PhaJay QR Subscription Service...\n');

  try {
    // Create payment QR service
    const qrService = new PaymentQRService(config);
    
    // First, generate a QR code
    console.log('📱 Generating QR code...');
    const qrResult = await qrService.generateQR({
      bank: 'BCEL',
      amount: 10000, // 100 LAK
      description: 'Test subscription payment'
    });
    
    console.log('✅ QR Generated:', {
      qrString: qrResult.qrString ? 'Generated' : 'Failed',
      qrImage: qrResult.qrImage ? 'Generated' : 'Failed'
    });

    // Subscribe to payment callbacks
    console.log('\n🔌 Setting up subscription...');
    
    await qrService.subscribe(
      // Payment received callback
      (paymentData) => {
        console.log('💰 Payment Received!');
        console.log('Transaction ID:', paymentData.transactionId);
        console.log('Amount:', paymentData.amount, 'LAK');
        console.log('Status:', paymentData.status);
        console.log('Timestamp:', new Date(paymentData.timestamp).toLocaleString());
        console.log('Full payment data:', JSON.stringify(paymentData, null, 2));
        
        // Here you would handle successful payment
        // e.g., update order status, send confirmation email, etc.
      },
      
      // Error callback
      (error) => {
        console.error('❌ Subscription Error:', error);
      }
    );

    // Check subscription status
    const status = qrService.getSubscriptionStatus();
    console.log('📊 Subscription Status:', status);

    console.log('\n✅ Subscription active! Waiting for payments...');
    console.log('💡 Simulate a payment or scan the QR code to test');
    console.log('⏹️  Press Ctrl+C to stop\n');

    // Keep the process alive
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down...');
      qrService.unsubscribe();
      process.exit(0);
    });

    // Simulate a test payment after 10 seconds (for testing)
    setTimeout(() => {
      console.log('🧪 Simulating test payment callback...');
      
      // Get the subscription service directly to simulate callback
      const subscription = qrService.getSubscription();
      if (subscription) {
        subscription.emit('payment', {
          transactionId: 'TEST_' + Date.now(),
          amount: 10000,
          currency: 'LAK',
          status: 'success',
          timestamp: new Date().toISOString(),
          bankCode: 'BCEL',
          description: 'Test subscription payment'
        });
      }
    }, 10000);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled Rejection:', error);
  process.exit(1);
});

// Run the test
testQRSubscription();
