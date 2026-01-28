# 🧪 PhaJay Payment SDK - Testing Guide

This directory contains a complete testing environment for the PhaJay Payment SDK that allows you to test all payment methods locally before deploying to production.

## 🚀 Quick Start

### 1. Setup Environment

```bash
# Navigate to test app directory
cd test-app

# Install dependencies
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your PhaJay credentials
```

### 2. Configure Your Environment

Edit `.env` file with your details:

```env
PHAJAY_SECRET_KEY=your-sandbox-secret-key
PHAJAY_ENVIRONMENT=sandbox
CALLBACK_SUCCESS_URL=http://localhost:3000/payment/success
CALLBACK_CANCEL_URL=http://localhost:3000/payment/cancel
WEBHOOK_URL=https://your-ngrok-url.ngrok-free.app/webhook
PORT=3000
```

### 3. Get Your Credentials

1. Go to [PhaJay Portal](https://portal.phajay.co/)
2. Register and complete KYC (required for credit cards)
3. Navigate to **Key Management** to get your secret key
4. Configure callback URLs in **Settings > Callback URL**
5. Configure webhook URL in **Settings > Webhook Setting**

## 🧪 Testing Methods

### Method 1: Web Interface (Recommended)

Start the web server:
```bash
npm start
# or for auto-reload during development
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to access the interactive test interface.

### Method 2: Command Line Testing

Test individual services:

```bash
# Test Payment Link
npm run test-payment-link

# Test Payment QR (all banks)
npm run test-payment-qr

# Test Credit Card (requires KYC)
npm run test-credit-card
```

### Method 3: Webhook Testing

Start webhook server:
```bash
npm run webhook-server
```

For public webhook URL (required for PhaJay callbacks):
```bash
# Set AUTO_NGROK=true in .env, or manually:
ngrok http 3001
```

## 📱 Testing Each Service

### 1. Payment Link Testing

**What it does:** Creates payment links that redirect users to bank selection page

**Test steps:**
1. Create payment link via web interface or CLI
2. Open the generated link in browser
3. Select a bank (BCEL, JDB, LDB, IB, STB)  
4. Complete payment in bank's interface
5. Verify webhook callback is received

**Expected flow:**
```
Your App → PhaJay → Bank Selection → Bank Payment → Success/Webhook
```

### 2. Payment QR Testing  

**What it does:** Generates bank-specific QR codes for mobile banking

**Test steps:**
1. Generate QR code for specific bank
2. QR image is displayed/saved
3. Scan with corresponding bank's mobile app
4. Complete payment in mobile app
5. Verify webhook callback

**Available banks:**
- **BCEL** (Note: English descriptions only)
- **JDB** (Joint Development Bank)
- **LDB** (Lao Development Bank) 
- **IB** (Indochina Bank)
- **STB** (ST Bank Laos)

### 3. Credit Card Testing

**What it does:** Creates secure credit card payment pages

**Requirements:**
- KYC-approved account
- 3DS-enabled credit cards only

**Test steps:**
1. Create credit card payment
2. Open payment URL in browser
3. Enter card details (test cards available in sandbox)
4. Complete 3DS authentication
5. Verify webhook callback

## 🔗 Webhook Testing

The webhook server logs all incoming callbacks and processes them using the SDK.

**Webhook URL format:**
```
https://your-ngrok-url.ngrok-free.app/webhook
```

**Configure in PhaJay Portal:**
1. Go to **Settings > Webhook Setting**
2. Set **Endpoint** to your ngrok webhook URL
3. Save configuration

**Webhook payload examples:**

Payment Link webhook:
```json
{
  "message": "SUCCESS",
  "transactionId": "uuid",
  "status": "PAYMENT_COMPLETED",
  "paymentMethod": "JDB",
  "txnAmount": 50000,
  "orderNo": "ORDER_123"
}
```

Credit Card webhook:
```json
{
  "message": "SUCCESS", 
  "transactionId": "uuid",
  "status": "PAYMENT_COMPLETED",
  "paymentMethod": "CREDIT_CARD",
  "txnAmount": 100,
  "currency": "USD",
  "cardType": "CC-VI"
}
```

## 🛠 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start web test interface |
| `npm run dev` | Start with auto-reload |
| `npm run test-payment-link` | Test payment link CLI |
| `npm run test-payment-qr` | Test QR generation CLI |
| `npm run test-credit-card` | Test credit card CLI |
| `npm run webhook-server` | Start webhook server |

## 📁 Files Overview

| File | Purpose |
|------|---------|
| `index.js` | Main web interface server |
| `test-payment-link.js` | Payment link CLI test |
| `test-payment-qr.js` | Payment QR CLI test |
| `test-credit-card.js` | Credit card CLI test |
| `webhook-server.js` | Dedicated webhook server |
| `.env.example` | Environment variables template |

## 🐛 Troubleshooting

### Common Issues

**1. "Secret key is required" error:**
- Check `.env` file exists and has `PHAJAY_SECRET_KEY`
- Verify key is correct from PhaJay Portal

**2. "KYC required" for credit cards:**
- Complete KYC verification at PhaJay Portal
- Use sandbox environment for initial testing

**3. Webhook not receiving callbacks:**
- Ensure ngrok is running and URL is public
- Configure webhook URL in PhaJay Portal
- Check webhook server logs for errors

**4. QR code not working:**
- Verify bank is supported
- For BCEL: Use English descriptions only
- Test with actual mobile banking app

**5. Payment link redirect issues:**
- Check callback URLs in PhaJay Portal settings
- Ensure success/cancel URLs are accessible

### Debug Mode

Add debug logging:
```javascript
// Add to any test file
process.env.NODE_ENV = 'development';
```

### Test Data

**Sandbox test amounts:**
- Small: 1,000 - 10,000 LAK
- Medium: 50,000 - 100,000 LAK  
- Large: 500,000+ LAK

**Credit card test data:**
- Available in PhaJay Portal documentation
- Use 3DS-enabled test cards only

## 🚀 Next Steps

Once testing is complete:

1. **Switch to Production:**
   - Update `PHAJAY_ENVIRONMENT=production`
   - Use production secret key
   - Update webhook URLs to production

2. **Deploy Your App:**
   - Deploy to your hosting platform
   - Configure production webhook URLs
   - Test with real payments

3. **Monitor:**
   - Check PhaJay Portal for transaction logs  
   - Monitor webhook delivery
   - Handle error cases appropriately

## 🆘 Support

- **Documentation:** [https://payment-doc.phajay.co/v1](https://payment-doc.phajay.co/v1)
- **Portal:** [https://portal.phajay.co](https://portal.phajay.co)
- **SDK Issues:** Check console logs and error messages

Happy testing! 🎉
