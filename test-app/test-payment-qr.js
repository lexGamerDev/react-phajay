import dotenv from 'dotenv';
import QRCode from 'qrcode';
import { PhaJayClient, SupportedBank } from '../dist/index.esm.js';

// Load environment variables
dotenv.config();

const client = new PhaJayClient({
  secretKey: process.env.PHAJAY_SECRET_KEY || 'test-key',
  environment: process.env.PHAJAY_ENVIRONMENT || 'sandbox'
});

async function testPaymentQR() {
  console.log('📱 Testing Payment QR Service...\n');

  const banks = ['BCEL', 'JDB', 'LDB', 'IB', 'STB'];
  
  for (const bank of banks) {
    try {
      console.log(`\n🏦 Testing ${bank} Bank...`);
      
      const result = await client.paymentQR.generateQR({
        bank: bank,
        amount: 25000,
        description: `Test QR Payment - ${bank}`,
        tag1: 'test_shop',
        tag2: bank.toLowerCase()
      });

      console.log('✅ QR Generated Successfully!');
      console.log('📄 Response:', {
        transactionId: result.transactionId,
        bank: bank,
        qrCodeLength: result.qrCode.length,
        hasDeepLink: !!result.link
      });

      // Generate QR code image and save to file
      try {
        const qrImagePath = `qr_${bank.toLowerCase()}_${Date.now()}.png`;
        await QRCode.toFile(`./test-app/${qrImagePath}`, result.qrCode);
        console.log(`💾 QR image saved: ${qrImagePath}`);
      } catch (qrError) {
        console.log('⚠️  Could not save QR image:', qrError.message);
      }

      if (result.link) {
        console.log(`🔗 Deep Link: ${result.link}`);
      }
      
    } catch (error) {
      console.error(`❌ ${bank} QR Error:`, error.message);
    }
  }

  // Test utility methods
  console.log('\n🔧 Testing Utility Methods:');
  console.log('Supported Banks:', client.paymentQR.getSupportedBanks());
  console.log('Is BCEL supported?', client.paymentQR.isBankSupported('BCEL'));
  console.log('Is INVALID supported?', client.paymentQR.isBankSupported('INVALID'));
}

// Run if called directly
if (process.argv[1].endsWith('test-payment-qr.js')) {
  testPaymentQR();
}

export { testPaymentQR };
