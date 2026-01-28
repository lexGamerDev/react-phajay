import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import QRCode from 'qrcode';
import { PhaJayClient } from '../dist/index.esm.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize PhaJay Client
const phaJayClient = new PhaJayClient({
  secretKey: process.env.PHAJAY_SECRET_KEY || '$2a$10$7pBgohWIIovcMxeAr7ItX.W1TkCkSIFZeRIjkTb3ZPvooztM8Kl0S'
});

// Serve test page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>PhaJay Payment Test</title>
        <meta charset="UTF-8">
        <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            .service-section { border: 1px solid #ddd; margin: 20px 0; padding: 20px; border-radius: 8px; }
            .form-group { margin: 10px 0; }
            label { display: block; margin-bottom: 5px; font-weight: bold; }
            input, select, textarea { width: 100%; padding: 8px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 4px; }
            button { background: #007cba; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
            button:hover { background: #005a87; }
            .result { background: #f0f0f0; padding: 15px; margin: 10px 0; border-radius: 4px; }
            .qr-code { text-align: center; margin: 20px 0; }
            .error { background: #ffe6e6; color: #d00; }
            .success { background: #e6ffe6; color: #060; }
            .nav-links { text-align: center; margin: 20px 0; }
            .nav-links a { margin: 0 15px; padding: 10px 20px; background: #28a745; color: white; text-decoration: none; border-radius: 4px; }
        </style>
    </head>
    <body>
        <h1>🏦 PhaJay Payment SDK Test</h1>
        <p>Environment: <strong>${process.env.PHAJAY_ENVIRONMENT || 'sandbox'}</strong></p>
        
        <div class="nav-links">
            <a href="/qr-monitor">📱 QR Payment Monitor</a>
            <a href="#payment-link">💰 Payment Links</a>
            <a href="#credit-card">💳 Credit Cards</a>
        </div>
        
        <!-- Payment Link Section -->
        <div id="payment-link" class="service-section">
            <h2>💰 Payment Link Test</h2>
            <form id="paymentLinkForm">
                <div class="form-group">
                    <label>Amount (LAK):</label>
                    <input type="number" id="linkAmount" value="50000" required>
                </div>
                <div class="form-group">
                    <label>Description:</label>
                    <input type="text" id="linkDescription" value="Test Payment Link" required>
                </div>
                <div class="form-group">
                    <label>Order No:</label>
                    <input type="text" id="linkOrderNo" value="ORDER_${Date.now()}">
                </div>
                <button type="submit">Create Payment Link</button>
            </form>
            <div id="paymentLinkResult"></div>
        </div>

        <!-- Payment QR Section -->
        <div class="service-section">
            <h2>📱 Payment QR Test</h2>
            <form id="paymentQRForm">
                <div class="form-group">
                    <label>Bank:</label>
                    <select id="qrBank" required>
                        <option value="BCEL">BCEL</option>
                        <option value="JDB">JDB</option>
                        <option value="LDB">LDB</option>
                        <option value="IB">Indochina Bank</option>
                        <option value="STB">ST Bank</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Amount (LAK):</label>
                    <input type="number" id="qrAmount" value="25000" required>
                </div>
                <div class="form-group">
                    <label>Description:</label>
                    <input type="text" id="qrDescription" value="Test QR Payment" required>
                </div>
                <button type="submit">Generate QR Code</button>
            </form>
            <div id="paymentQRResult"></div>
        </div>

        <!-- Credit Card Section -->
        <div id="credit-card" class="service-section">
            <h2>💳 Credit Card Test</h2>
            <form id="creditCardForm">
                <div class="form-group">
                    <label>Amount (USD):</label>
                    <input type="number" id="cardAmount" value="100" required>
                </div>
                <div class="form-group">
                    <label>Description:</label>
                    <input type="text" id="cardDescription" value="Test Credit Card Payment" required>
                </div>
                <button type="submit">Create Credit Card Payment</button>
            </form>
            <div id="creditCardResult"></div>
        </div>

        <script>
            // Payment Link Form
            document.getElementById('paymentLinkForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                const resultDiv = document.getElementById('paymentLinkResult');
                resultDiv.innerHTML = '<div class="result">Creating payment link...</div>';
                
                try {
                    const response = await fetch('/api/payment-link', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            amount: parseInt(document.getElementById('linkAmount').value),
                            description: document.getElementById('linkDescription').value,
                            orderNo: document.getElementById('linkOrderNo').value
                        })
                    });
                    const data = await response.json();
                    
                    if (data.success) {
                        resultDiv.innerHTML = \`
                            <div class="result success">
                                <h3>Payment Link Created!</h3>
                                <p><strong>URL:</strong> <a href="\${data.redirectURL}" target="_blank">\${data.redirectURL}</a></p>
                                <p><strong>Order:</strong> \${data.orderNo}</p>
                                <button onclick="window.open('\${data.redirectURL}', '_blank')">Open Payment Page</button>
                            </div>
                        \`;
                    } else {
                        resultDiv.innerHTML = \`<div class="result error">Error: \${data.error}</div>\`;
                    }
                } catch (error) {
                    resultDiv.innerHTML = \`<div class="result error">Error: \${error.message}</div>\`;
                }
            });

            // Payment QR Form
            document.getElementById('paymentQRForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                const resultDiv = document.getElementById('paymentQRResult');
                resultDiv.innerHTML = '<div class="result">Generating QR code...</div>';
                
                try {
                    const response = await fetch('/api/payment-qr', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            bank: document.getElementById('qrBank').value,
                            amount: parseInt(document.getElementById('qrAmount').value),
                            description: document.getElementById('qrDescription').value
                        })
                    });
                    const data = await response.json();
                    
                    if (data.success) {
                        resultDiv.innerHTML = \`
                            <div class="result success">
                                <h3>QR Code Generated!</h3>
                                <p><strong>Transaction ID:</strong> \${data.transactionId}</p>
                                <div class="qr-code">
                                    <img src="data:image/png;base64,\${data.qrImage}" alt="QR Code" style="max-width: 300px;">
                                </div>
                                <p><strong>Deep Link:</strong> <a href="\${data.link}" target="_blank">Open in Bank App</a></p>
                            </div>
                        \`;
                    } else {
                        resultDiv.innerHTML = \`<div class="result error">Error: \${data.error}</div>\`;
                    }
                } catch (error) {
                    resultDiv.innerHTML = \`<div class="result error">Error: \${error.message}</div>\`;
                }
            });

            // Credit Card Form
            document.getElementById('creditCardForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                const resultDiv = document.getElementById('creditCardResult');
                resultDiv.innerHTML = '<div class="result">Creating credit card payment...</div>';
                
                try {
                    const response = await fetch('/api/credit-card', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            amount: parseInt(document.getElementById('cardAmount').value),
                            description: document.getElementById('cardDescription').value
                        })
                    });
                    const data = await response.json();
                    
                    if (data.success) {
                        resultDiv.innerHTML = \`
                            <div class="result success">
                                <h3>Credit Card Payment Created!</h3>
                                <p><strong>Transaction ID:</strong> \${data.transactionId}</p>
                                <p><strong>Expires:</strong> \${data.expirationTime}</p>
                                <button onclick="window.open('\${data.paymentUrl}', '_blank')">Open Payment Page</button>
                            </div>
                        \`;
                    } else {
                        resultDiv.innerHTML = \`<div class="result error">Error: \${data.error}</div>\`;
                    }
                } catch (error) {
                    resultDiv.innerHTML = \`<div class="result error">Error: \${error.message}</div>\`;
                }
            });
        </script>
    </body>
    </html>
  `);
});

// QR Monitor page
app.get('/qr-monitor', (req, res) => {
  const fs = require('fs');
  const path = require('path');
  const monitorHtml = fs.readFileSync(path.join(__dirname, 'qr-monitor.html'), 'utf8');
  res.send(monitorHtml);
});

// API Routes

// Payment Link API
app.post('/api/payment-link', async (req, res) => {
  try {
    const { amount, description, orderNo } = req.body;
    
    const result = await phaJayClient.paymentLink.createPaymentLink({
      amount,
      description,
      orderNo
    });

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Payment Link Error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Payment QR API
app.post('/api/payment-qr', async (req, res) => {
  try {
    const { bank, amount, description } = req.body;
    
    const result = await phaJayClient.paymentQR.generateQR({
      bank: bank,
      amount,
      description
    });

    // Generate QR code image
    const qrImage = await QRCode.toDataURL(result.qrCode);
    const base64Data = qrImage.replace(/^data:image\/png;base64,/, '');

    res.json({
      success: true,
      transactionId: result.transactionId,
      qrCode: result.qrCode,
      link: result.link,
      qrImage: base64Data
    });
  } catch (error) {
    console.error('Payment QR Error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Credit Card API
app.post('/api/credit-card', async (req, res) => {
  try {
    const { amount, description } = req.body;
    
    const result = await phaJayClient.creditCard.createPayment({
      amount,
      description
    });

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Credit Card Error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Webhook endpoint
app.post('/webhook', (req, res) => {
  try {
    console.log('🔔 Webhook received:', JSON.stringify(req.body, null, 2));
    
    const payload = req.body;
    
    // Process based on payment method
    if (payload.paymentMethod === 'CREDIT_CARD') {
      const result = phaJayClient.creditCard.processWebhook(payload);
      console.log('💳 Credit Card Payment Processed:', result);
    } else {
      const result = phaJayClient.paymentLink.processWebhook(payload);
      console.log('🔗 Payment Link Processed:', result);
    }

    // Always respond with 200
    res.status(200).json({ 
      received: true, 
      timestamp: new Date().toISOString() 
    });
    
  } catch (error) {
    console.error('❌ Webhook Error:', error);
    res.status(400).json({ 
      error: 'Invalid webhook payload',
      timestamp: new Date().toISOString()
    });
  }
});

// Success/Cancel pages
app.get('/payment/success', (req, res) => {
  res.send(`
    <html>
      <head><title>Payment Success</title></head>
      <body style="font-family: Arial; text-align: center; padding: 50px;">
        <h1 style="color: green;">✅ Payment Successful!</h1>
        <p>Transaction details:</p>
        <pre style="background: #f0f0f0; padding: 20px; text-align: left; display: inline-block;">
${JSON.stringify(req.query, null, 2)}
        </pre>
        <br><br>
        <a href="/" style="background: #007cba; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Back to Test Page</a>
      </body>
    </html>
  `);
});

app.get('/payment/cancel', (req, res) => {
  res.send(`
    <html>
      <head><title>Payment Cancelled</title></head>
      <body style="font-family: Arial; text-align: center; padding: 50px;">
        <h1 style="color: orange;">⚠️ Payment Cancelled</h1>
        <p>The payment was cancelled by the user.</p>
        <a href="/" style="background: #007cba; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Back to Test Page</a>
      </body>
    </html>
  `);
});

// Start server
app.listen(PORT, () => {
  console.log(`
🚀 PhaJay Test Server Running!
📍 URL: http://localhost:${PORT}
🌍 Environment: ${process.env.PHAJAY_ENVIRONMENT || 'sandbox'}
⚙️  Webhook: ${process.env.WEBHOOK_URL || 'Not configured'}

💡 Next steps:
1. Copy .env.example to .env and fill in your details
2. Configure webhook URL in PhaJay Portal
3. Open http://localhost:${PORT} to start testing
  `);
});
