import express from 'express';
import dotenv from 'dotenv';
import ngrok from 'ngrok';
import { PhaJayClient } from '../dist/index.esm.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.WEBHOOK_PORT || 3001;

// Initialize PhaJay Client
const phaJayClient = new PhaJayClient({
  secretKey: process.env.PHAJAY_SECRET_KEY || 'test-key',
  environment: process.env.PHAJAY_ENVIRONMENT || 'sandbox'
});

// Middleware
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.PHAJAY_ENVIRONMENT || 'sandbox'
  });
});

// Main webhook endpoint
app.post('/webhook', (req, res) => {
  const startTime = Date.now();
  
  try {
    console.log('\n🔔 Webhook Received:');
    console.log('⏰ Timestamp:', new Date().toISOString());
    console.log('📨 Headers:', JSON.stringify(req.headers, null, 2));
    console.log('📄 Payload:', JSON.stringify(req.body, null, 2));
    
    const payload = req.body;
    
    // Validate payload
    if (!payload || !payload.paymentMethod) {
      console.error('❌ Invalid webhook payload - missing paymentMethod');
      return res.status(400).json({ 
        error: 'Invalid payload - missing paymentMethod',
        timestamp: new Date().toISOString()
      });
    }

    let result;
    
    // Process based on payment method
    if (payload.paymentMethod === 'CREDIT_CARD') {
      console.log('💳 Processing Credit Card Webhook...');
      result = phaJayClient.creditCard.processWebhook(payload);
      
      console.log('✅ Credit Card Payment Processed:');
      console.log(`   Transaction ID: ${result.transactionId}`);
      console.log(`   Status: ${result.status}`);
      console.log(`   Amount: $${result.amount} ${result.currency}`);
      console.log(`   Card Type: ${result.cardType}`);
      
      if (result.cardDetails) {
        console.log(`   Card Holder: ${result.cardDetails.cardHolderName}`);
        console.log(`   Card Number: ${result.cardDetails.maskedCardNumber}`);
      }
      
    } else {
      console.log('🔗 Processing Payment Link Webhook...');
      result = phaJayClient.paymentLink.processWebhook(payload);
      
      console.log('✅ Payment Link Processed:');
      console.log(`   Transaction ID: ${result.transactionId}`);
      console.log(`   Status: ${result.status}`);
      console.log(`   Amount: ${result.amount} LAK`);
      console.log(`   Payment Method: ${result.paymentMethod}`);
      console.log(`   Order No: ${result.orderNo}`);
    }

    // Log processing time
    const processingTime = Date.now() - startTime;
    console.log(`⚡ Processing time: ${processingTime}ms`);

    // Always respond with 200 to acknowledge receipt
    res.status(200).json({ 
      received: true, 
      timestamp: new Date().toISOString(),
      processingTime: `${processingTime}ms`
    });
    
  } catch (error) {
    console.error('❌ Webhook Processing Error:', error.message);
    console.error('Stack:', error.stack);
    
    res.status(400).json({ 
      error: 'Invalid webhook payload',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Start server and optionally expose via ngrok
async function startServer() {
  const server = app.listen(PORT, () => {
    console.log(`
🎣 Webhook Server Started!
📍 Local URL: http://localhost:${PORT}
🔍 Health check: http://localhost:${PORT}/health
📝 Webhook endpoint: http://localhost:${PORT}/webhook
    `);
  });

  // Auto-expose via ngrok if requested
  if (process.env.AUTO_NGROK === 'true') {
    try {
      console.log('🌐 Exposing webhook via ngrok...');
      const ngrokUrl = await ngrok.connect(PORT);
      console.log(`✅ Ngrok URL: ${ngrokUrl}`);
      console.log(`📝 Webhook URL: ${ngrokUrl}/webhook`);
      console.log(`
💡 Configure this webhook URL in PhaJay Portal:
   Settings > Webhook Setting > Endpoint: ${ngrokUrl}/webhook
      `);
      
      // Update environment variable for convenience
      process.env.WEBHOOK_URL = `${ngrokUrl}/webhook`;
      
    } catch (ngrokError) {
      console.error('⚠️  Ngrok setup failed:', ngrokError.message);
      console.log('You can manually expose the webhook using: ngrok http', PORT);
    }
  } else {
    console.log(`
💡 To expose webhook publicly:
   1. Install ngrok: npm install -g ngrok
   2. Run: ngrok http ${PORT}
   3. Configure webhook URL in PhaJay Portal
   
   Or set AUTO_NGROK=true in .env to auto-expose
    `);
  }

  return server;
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down webhook server...');
  try {
    await ngrok.kill();
    console.log('✅ Ngrok disconnected');
  } catch (error) {
    // Ignore ngrok errors on shutdown
  }
  process.exit(0);
});

// Start server if called directly
if (process.argv[1].endsWith('webhook-server.js')) {
  startServer();
}

export { startServer };
