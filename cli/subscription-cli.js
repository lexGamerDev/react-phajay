#!/usr/bin/env node

/**
 * PhaJay QR Subscription CLI Tool
 * Quick command-line tool to test subscription functionality
 */

import { PaymentQRService, QRSubscriptionService } from '../dist/index.esm.js';
import { createInterface } from 'readline';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function main() {
  console.log('🚀 PhaJay QR Subscription CLI Tool\n');

  try {
    // Get configuration
    const secretKey = await askQuestion('Enter your Secret Key: ');
    const environment = await askQuestion('Environment (sandbox/production) [production]: ') || 'production';
    
    if (!secretKey) {
      console.error('❌ Secret key is required');
      process.exit(1);
    }

    console.log('\n📊 Configuration:');
    console.log(`   Secret Key: ${secretKey.substring(0, 8)}...`);
    console.log(`   Environment: ${environment}\n`);

    // Choose subscription method
    console.log('🔧 Choose subscription method:');
    console.log('   1. QR Service subscription (recommended)');
    console.log('   2. Standalone subscription service');
    
    const method = await askQuestion('Enter choice (1 or 2): ');

    if (method === '1') {
      await testQRServiceSubscription({ secretKey, environment });
    } else if (method === '2') {
      await testStandaloneSubscription({ secretKey, environment });
    } else {
      console.error('❌ Invalid choice');
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

async function testQRServiceSubscription(config) {
  console.log('\n🔧 Testing QR Service Subscription...');

  const qrService = new PaymentQRService(config);
  
  // Subscribe to payments
  await qrService.subscribe(
    (paymentData) => {
      console.log('\n✅ Payment Received!');
      console.log('   Transaction ID:', paymentData.transactionId);
      console.log('   Amount:', paymentData.amount, paymentData.currency || 'LAK');
      console.log('   Bank:', paymentData.bankCode);
      console.log('   Status:', paymentData.status);
      console.log('   Time:', new Date(paymentData.timestamp).toLocaleString());
      
      if (paymentData.description) {
        console.log('   Description:', paymentData.description);
      }
      
      console.log('\n💡 Listening for more payments...');
    },
    (error) => {
      console.error('\n❌ Subscription Error:', error.message);
      console.log('🔄 The service will attempt to reconnect...');
    }
  );

  // Show status
  const status = qrService.getSubscriptionStatus();
  console.log('📊 Subscription Status:', JSON.stringify(status, null, 2));

  console.log('\n✨ Subscription is active!');
  console.log('💡 Test by making a payment with your QR codes');
  console.log('⏹️  Press Ctrl+C to stop\n');

  // Simulate test payment after 5 seconds
  setTimeout(() => {
    console.log('🧪 Simulating test payment...');
    const subscription = qrService.getSubscription();
    if (subscription) {
      subscription.emit('payment', {
        transactionId: 'TEST_' + Date.now(),
        amount: 10000,
        currency: 'LAK',
        status: 'success',
        timestamp: new Date().toISOString(),
        bankCode: 'BCEL',
        description: 'CLI Test Payment'
      });
    }
  }, 5000);

  // Handle shutdown
  process.on('SIGINT', () => {
    console.log('\n\n🛑 Shutting down...');
    qrService.unsubscribe();
    process.exit(0);
  });

  // Keep running
  await new Promise(() => {});
}

async function testStandaloneSubscription(config) {
  console.log('\n🔧 Testing Standalone Subscription Service...');

  const subscription = new QRSubscriptionService({
    ...config,
    onPaymentReceived: (data) => {
      console.log('\n✅ Payment Received!');
      console.log('   Full Data:', JSON.stringify(data, null, 2));
      console.log('\n💡 Listening for more payments...');
    },
    onError: (error) => {
      console.error('\n❌ Subscription Error:', error);
      console.log('🔄 The service will attempt to reconnect...');
    },
    onConnected: () => {
      console.log('🔌 Connected to payment server');
    },
    onDisconnected: () => {
      console.log('🔌 Disconnected from payment server');
    }
  });

  // Connect to server
  await subscription.connect();

  // Show status
  const status = subscription.getConnectionStatus();
  console.log('📊 Connection Status:', JSON.stringify(status, null, 2));

  console.log('\n✨ Subscription is active!');
  console.log('💡 Test by making a payment with your QR codes');
  console.log('⏹️  Press Ctrl+C to stop\n');

  // Simulate test payment
  setTimeout(() => {
    console.log('🧪 Simulating test payment...');
    subscription.emit('payment', {
      transactionId: 'STANDALONE_' + Date.now(),
      amount: 25000,
      currency: 'LAK',
      status: 'success',
      timestamp: new Date().toISOString(),
      bankCode: 'JDB',
      description: 'Standalone CLI Test'
    });
  }, 5000);

  // Handle shutdown
  process.on('SIGINT', () => {
    console.log('\n\n🛑 Shutting down...');
    subscription.disconnect();
    process.exit(0);
  });

  // Keep running
  await new Promise(() => {});
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('\n❌ Uncaught Exception:', error.message);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('\n❌ Unhandled Rejection:', error);
  process.exit(1);
});

main();
