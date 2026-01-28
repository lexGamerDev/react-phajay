import { PhaJayClient, SupportedBank } from '../src/index';

// Initialize the client
const client = new PhaJayClient({
  secretKey: 'your-secret-key-here',
});

async function paymentLinkExample() {
  try {
    console.log('Creating payment link...');
    
    const paymentLink = await client.paymentLink.createPaymentLink({
      amount: 50000, // 50,000 LAK
      description: 'Buy premium subscription',
      orderNo: `ORDER_${Date.now()}`,
      tag1: 'shop_id_123',
      tag2: 'Premium Shop',
      tag3: 'subscription_plan_premium'
    });

    console.log('Payment link created:', paymentLink.redirectURL);
    console.log('Order number:', paymentLink.orderNo);

    // In a real application, redirect user to: paymentLink.redirectURL
    
  } catch (error) {
    console.error('Payment link creation failed:', error);
  }
}

async function paymentQRExample() {
  try {
    console.log('Generating QR code for BCEL...');
    
    // Generate QR using the main generateQR method
    const qrResponse1 = await client.paymentQR.generateQR({
      bank: SupportedBank.BCEL,
      amount: 25000, // 25,000 LAK
      description: 'Coffee Shop Payment', // Note: BCEL doesn't support Lao/Thai characters
      tag1: 'shop_123',
      tag2: 'location_central'
    });

    console.log('QR Code generated successfully');
    console.log('Transaction ID:', qrResponse1.transactionId);
    console.log('QR String:', qrResponse1.qrCode);
    console.log('Deep Link:', qrResponse1.link);

    // Generate QR for different bank
    const qrResponse2 = await client.paymentQR.generateQR({
      bank: SupportedBank.JDB,
      amount: 30000, // 30,000 LAK
      description: 'Restaurant Payment',
      tag1: 'restaurant_456'
    });

    console.log('\nQR Code generated successfully for JDB');
    console.log('Transaction ID:', qrResponse2.transactionId);
    console.log('Bank:', 'JDB');

    // Another example with different bank
    const qrResponse3 = await client.paymentQR.generateQR({
      bank: SupportedBank.LDB,
      amount: 15000,
      description: 'Service Payment'
    });

    console.log('\nQR Code generated successfully (Method 3)');
    console.log('Transaction ID:', qrResponse3.transactionId);
    console.log('Bank:', 'LDB');

    // In a real application:
    // 1. Display the QR code using qrResponse.qrCode
    // 2. Or provide deep link button: qrResponse.link
    
  } catch (error) {
    console.error('QR generation failed:', error);
  }
}

async function creditCardExample() {
  try {
    console.log('Creating credit card payment...');
    
    const creditCardPayment = await client.creditCard.createPayment({
      amount: 100, // $100 USD
      description: 'Premium Service Purchase',
      tag1: 'customer_id_456',
      tag2: 'service_premium',
      tag3: 'ORDER-2023-001'
    });

    console.log('Credit card payment created:', creditCardPayment.paymentUrl);
    console.log('Transaction ID:', creditCardPayment.transactionId);
    console.log('Expires at:', creditCardPayment.expirationTime);
    console.log('Status:', creditCardPayment.status);

    // In a real application, redirect user to: creditCardPayment.paymentUrl
    
  } catch (error) {
    console.error('Credit card payment creation failed:', error);
  }
}

// Example webhook handler for Express.js
function webhookHandler(req: any, res: any) {
  try {
    const payload = req.body;
    
    // Determine payment method and process accordingly
    switch (payload.paymentMethod) {
      case 'CREDIT_CARD':
        const creditCardResult = client.creditCard.processWebhook(payload);
        console.log('Credit card payment processed:', creditCardResult);
        break;
        
      default:
        // Handle payment link webhooks (JDB, BCEL, LDB, IB, STB)
        const paymentLinkResult = client.paymentLink.processWebhook(payload);
        console.log('Payment link processed:', paymentLinkResult);
        break;
    }

    // Always respond with 200 to acknowledge receipt
    res.status(200).json({ received: true });
    
  } catch (error) {
    console.error('Webhook processing failed:', error);
    res.status(400).json({ error: 'Invalid webhook payload' });
  }
}

// Run examples
async function runExamples() {
  console.log('=== PhaJay Payment SDK Examples ===\n');
  
  await paymentLinkExample();
  console.log('\n' + '='.repeat(50) + '\n');
  
  await paymentQRExample();
  console.log('\n' + '='.repeat(50) + '\n');
  
  await creditCardExample();
  console.log('\n' + '='.repeat(50) + '\n');
  
  console.log('Webhook handler example provided above');
}

// Uncomment to run examples
// runExamples();

export {
  paymentLinkExample,
  paymentQRExample,  
  creditCardExample,
  webhookHandler
};
