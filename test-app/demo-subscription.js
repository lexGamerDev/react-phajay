/**
 * Simple Subscription Demo for PhaJay QR Payments
 * Demonstrates subscription functionality without real API calls
 */

import { PaymentQRService, QRSubscriptionService } from '../dist/index.esm.js';

async function demoSubscription() {
  console.log('🚀 PhaJay QR Payment Subscription Demo\n');

  try {
    // Configuration (can be fake for demo)
    const config = {
      secretKey: '$2a$10$7pBgohWIIovcMxeAr7ItX.W1TkCkSIFZeRIjkTb3ZPvooztM8Kl0S',
      environment: 'production'
    };

    // Create payment QR service
    const qrService = new PaymentQRService(config);
    
    console.log('📱 Setting up payment subscription...');

    // Method 1: Using convenience methods on QR service
    console.log('\n🔧 Method 1: QR Service Subscription');
    await qrService.subscribe(
      (paymentData) => {
        console.log('✅ Payment Received via QR Service!');
        console.log('   Transaction ID:', paymentData.transactionId);
        console.log('   Amount:', paymentData.amount, 'LAK');
        console.log('   Status:', paymentData.status);
        console.log('   Bank:', paymentData.bankCode);
      },
      (error) => {
        console.error('❌ QR Service Error:', error.message);
      }
    );

    // Method 2: Using standalone subscription service
    console.log('\n🔧 Method 2: Standalone Subscription Service');
    const subscriptionService = new QRSubscriptionService({
      secretKey: config.secretKey,
      onPaymentReceived: (data) => {
        console.log('✅ Payment Received via Standalone Service!');
        console.log('   Full Data:', JSON.stringify(data, null, 2));
      },
      onError: (error) => {
        console.error('❌ Standalone Service Error:', error);
      }
    });

    // Connect to subscription
    await subscriptionService.connect();

    // Show status
    console.log('\n📊 Subscription Status:');
    console.log('   QR Service:', JSON.stringify(qrService.getSubscriptionStatus(), null, 2));
    console.log('   Standalone:', JSON.stringify(subscriptionService.getConnectionStatus(), null, 2));

    console.log('\n✨ Subscriptions are active!');
    console.log('💡 Simulating payment events...\n');

    // Simulate some payment events
    setTimeout(() => {
      console.log('🧪 Simulating BCEL payment...');
      const subscription = qrService.getSubscription();
      if (subscription) {
        subscription.emit('payment', {
          transactionId: 'BCEL_' + Date.now(),
          amount: 25000,
          currency: 'LAK',
          status: 'success',
          timestamp: new Date().toISOString(),
          bankCode: 'BCEL',
          description: 'Coffee purchase'
        });
      }
    }, 2000);

    setTimeout(() => {
      console.log('🧪 Simulating JDB payment...');
      subscriptionService.emit('payment', {
        transactionId: 'JDB_' + Date.now(),
        amount: 50000,
        currency: 'LAK',
        status: 'success',
        timestamp: new Date().toISOString(),
        bankCode: 'JDB',
        description: 'Product purchase'
      });
    }, 4000);

    setTimeout(() => {
      console.log('🧪 Simulating APB payment...');
      const subscription = qrService.getSubscription();
      if (subscription) {
        subscription.emit('payment', {
          transactionId: 'APB_' + Date.now(),
          amount: 15000,
          currency: 'LAK',
          status: 'success',
          timestamp: new Date().toISOString(),
          bankCode: 'APB',
          description: 'Service payment'
        });
      }
    }, 6000);

    // Keep running for demo
    setTimeout(() => {
      console.log('\n🏁 Demo completed!');
      console.log('📚 Usage Summary:');
      console.log('   1. Create PaymentQRService with your config');
      console.log('   2. Use qrService.subscribe() for simple subscription');
      console.log('   3. Or create QRSubscriptionService for advanced control');
      console.log('   4. Handle payment events in your callbacks');
      console.log('   5. Use getSubscriptionStatus() to monitor connection\n');
      
      // Cleanup
      qrService.unsubscribe();
      subscriptionService.disconnect();
      process.exit(0);
    }, 8000);

  } catch (error) {
    console.error('❌ Demo Error:', error.message);
    process.exit(1);
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n\n🛑 Demo interrupted. Goodbye!');
  process.exit(0);
});

// Run demo
demoSubscription();
