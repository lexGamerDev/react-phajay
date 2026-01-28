# PhaJay Payment SDK

Official TypeScript/JavaScript SDK for PhaJay Payment Gateway - Supporting Payment QR, Payment Link and Credit Card services in Lao PDR.

[![npm version](https://badge.fury.io/js/phajay-payment-sdk.svg)](https://badge.fury.io/js/phajay-payment-sdk)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🏦 **Payment Links** - Single API integration connecting to multiple banks (JDB, LDB, IB, BCEL, STB)
- 📱 **QR Code Payments** - Bank-specific QR codes for mobile banking apps
- 💳 **Credit Card Payments** - Secure 3DS credit card processing
- 🔒 **Type Safe** - Full TypeScript support with comprehensive type definitions
- 📝 **Well Documented** - Comprehensive documentation with examples

## Installation

```bash
npm install phajay-payment-sdk
```

Or using yarn:

```bash
yarn add phajay-payment-sdk
```

## Quick Start

```typescript
import { PhaJayClient, SupportedBank } from 'phajay-payment-sdk';

// Initialize the client
const client = new PhaJayClient({
  secretKey: 'your-secret-key'
});

// Create a payment link
const paymentLink = await client.paymentLink.createPaymentLink({
  amount: 50000,
  description: 'Order payment',
  orderNo: 'ORDER_12345'
});

// Redirect user to payment page
window.location.href = paymentLink.redirectURL;
```

## Configuration

### Basic Configuration

```typescript
const client = new PhaJayClient({
  secretKey: 'your-secret-key', // Required: Get from PhaJay Portal
  baseUrl: 'custom-url'        // Optional: Custom API base URL
});
```

### Getting Your Secret Key

1. Register at [PhaJay Portal](https://portal.phajay.co/)
2. Complete KYC verification (required for credit card payments)
3. Navigate to Key Management to get your secret key
4. Configure callback URLs and webhooks in Settings

## Services

### 1. Payment Link Service

Create payment links that support multiple banks with a single integration.

#### Supported Banks
- **JDB** - Joint Development Bank
- **LDB** - Lao Development Bank  
- **IB** - Indochina Bank
- **BCEL** - Banque pour le Commerce Extérieur Lao
- **STB** - ST Bank Laos

```typescript
// Create payment link
const paymentLink = await client.paymentLink.createPaymentLink({
  amount: 100000,           // Amount in LAK
  description: 'Product purchase',
  orderNo: 'ORDER_001',     // Optional: Your order number
  tag1: 'shop_id',         // Optional: Custom field 1
  tag2: 'customer_id',     // Optional: Custom field 2
  tag3: 'additional_info'  // Optional: Custom field 3
});

console.log('Redirect to:', paymentLink.redirectURL);
```

#### Process Webhook

```typescript
// In your webhook endpoint
app.post('/webhook', (req, res) => {
  try {
    const result = client.paymentLink.processWebhook(req.body);
    
    console.log('Payment completed:', result.transactionId);
    console.log('Status:', result.status);
    console.log('Amount:', result.amount);
    console.log('Order:', result.orderNo);
    
    res.status(200).json({ received: true });
  } catch (error) {
    res.status(400).json({ error: 'Invalid webhook' });
  }
});
```

### 2. Payment QR Service

Generate bank-specific QR codes for mobile banking apps.

```typescript
// Generate QR code for specific bank
const qr1 = await client.paymentQR.generateQR({
  bank: SupportedBank.BCEL,
  amount: 50000,
  description: 'Coffee payment',
  tag1: 'shop_location'
});

// Generate QR for different bank
const qr2 = await client.paymentQR.generateQR({
  bank: SupportedBank.JDB,
  amount: 30000,
  description: 'Restaurant payment'
});

console.log('QR Code:', qr1.qrCode);      // Display as QR image
console.log('Deep Link:', qr1.link);      // Bank app deep link
```

#### Available Methods

```typescript
// Generate QR with bank in request object
generateQR(request: PaymentQRRequest)

// Utility methods
getSupportedBanks(): SupportedBank[]
isBankSupported(bank: string): boolean
```

### 3. Credit Card Service

Secure credit card processing with 3D Secure authentication.

**Note:** Requires KYC-approved account and only accepts 3DS-enabled cards.

```typescript
// Create credit card payment
const payment = await client.creditCard.createPayment({
  amount: 100,              // Amount in USD
  description: 'Premium service',
  tag1: 'customer_id',
  tag2: 'service_type',
  tag3: 'order_reference'
});

console.log('Payment URL:', payment.paymentUrl);
console.log('Transaction ID:', payment.transactionId);
console.log('Expires:', payment.expirationTime);

// Redirect user to payment.paymentUrl
```

#### Process Credit Card Webhook

```typescript
app.post('/webhook', (req, res) => {
  const payload = req.body;
  
  if (payload.paymentMethod === 'CREDIT_CARD') {
    const result = client.creditCard.processWebhook(payload);
    
    console.log('Card payment:', result.transactionId);
    console.log('Card type:', result.cardType);
    console.log('Card holder:', result.cardDetails?.cardHolderName);
    console.log('Masked card:', result.cardDetails?.maskedCardNumber);
  }
  
  res.status(200).json({ received: true });
});
```

## Webhook Configuration

### 1. Configure URLs in PhaJay Portal

1. Login to [PhaJay Portal](https://portal.phajay.co/)
2. Go to **Settings > Callback URL Setting**
   - **Success URL**: Where users go after successful payment
   - **Cancel URL**: Where users go if they cancel

3. Go to **Settings > Webhook Setting**
   - **Endpoint**: Your server's webhook URL (e.g., `https://yourdomain.com/api/webhook`)

### 2. Handle Webhook Requests

```typescript
import express from 'express';

const app = express();
app.use(express.json());

app.post('/api/webhook', (req, res) => {
  try {
    const payload = req.body;
    
    // Process based on payment method
    let result;
    if (payload.paymentMethod === 'CREDIT_CARD') {
      result = client.creditCard.processWebhook(payload);
    } else {
      result = client.paymentLink.processWebhook(payload);
    }
    
    // Update your database
    await updatePaymentStatus(result.transactionId, result.status);
    
    // Must respond with 200 to acknowledge receipt
    res.status(200).json({ received: true });
    
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: 'Invalid webhook payload' });
  }
});
```

## Error Handling

```typescript
import { PhaJayAPIError } from 'phajay-payment-sdk';

try {
  const paymentLink = await client.paymentLink.createPaymentLink({
    amount: 50000,
    description: 'Test payment'
  });
} catch (error) {
  if (error instanceof PhaJayAPIError) {
    console.error('API Error:', error.code, error.message);
    console.error('Details:', error.details);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## Environment Setup

### Configuration

```typescript
const client = new PhaJayClient({
  secretKey: 'your-secret-key'  // Get from PhaJay Portal
});

// With custom API base URL (optional)
const customClient = new PhaJayClient({
  secretKey: 'your-secret-key',
  baseUrl: 'https://custom-api.example.com/v1/api'
});
```

## TypeScript Support

The SDK is written in TypeScript and provides comprehensive type definitions:

```typescript
import { 
  PhaJayClient,
  PaymentLinkRequest,
  PaymentLinkResponse,
  PaymentQRRequest,
  PaymentQRResponse,
  CreditCardRequest,
  CreditCardResponse,
  SupportedBank,
  WebhookPayload
} from 'phajay-payment-sdk';
```

## Examples

Check the [examples](./examples/) directory for complete implementation examples:

- [Basic Usage](./examples/basic-usage.ts) - All service examples
- [QR Subscription](./test-app/demo-subscription.js) - Real-time payment callbacks
- Express.js webhook handlers
- React.js integration examples

## Real-time Payment Subscriptions

Subscribe to real-time payment callbacks using Socket.IO for instant payment notifications.

### Quick Setup

```typescript
import { PhaJayClient } from 'phajay-payment-sdk';

const client = new PhaJayClient({
  secretKey: 'your-secret-key'
});

// Subscribe to QR payment callbacks
await client.subscribeToQRPayments(
  (paymentData) => {
    console.log('Payment received:', paymentData);
    
    // Handle successful payment
    updateOrderStatus(paymentData.transactionId, 'paid');
    sendConfirmationEmail(paymentData);
  },
  (error) => {
    console.error('Subscription error:', error);
  }
);
```

### Advanced Subscription Control

```typescript
// Method 1: Using QR Service directly
const qrService = client.paymentQR;

await qrService.subscribe(
  (paymentData) => {
    console.log('QR Payment completed:', {
      transactionId: paymentData.transactionId,
      amount: paymentData.amount,
      bankCode: paymentData.bankCode,
      status: paymentData.status
    });
  },
  (error) => {
    console.error('QR Subscription error:', error);
  }
);

// Check connection status
const status = qrService.getSubscriptionStatus();
console.log('Connected:', status.connected);
console.log('Reconnect attempts:', status.reconnectAttempts);
```

```typescript
// Method 2: Standalone subscription service
import { QRSubscriptionService } from 'phajay-payment-sdk';

const subscription = new QRSubscriptionService({
  secretKey: 'your-secret-key',
  subscriptionUrl: 'wss://custom-server.example.com', // Optional
  onPaymentReceived: (data) => {
    console.log('Payment callback:', data);
  },
  onError: (error) => {
    console.error('Error:', error);
  }
});

await subscription.connect();
```

### Subscription Configuration

```typescript
interface QRSubscriptionConfig {
  secretKey: string;
  subscriptionUrl?: string;           // Default: 'https://payment-gateway.phajay.co/'
  reconnectAttempts?: number;         // Default: 5
  reconnectDelay?: number;            // Default: 1000ms
  onPaymentReceived?: (data: any) => void;
  onError?: (error: any) => void;
  onConnected?: () => void;
  onDisconnected?: () => void;
}
```

## API Reference

### PhaJayClient

#### Constructor
- `new PhaJayClient(config: PhaJayConfig)`

#### Services
- `paymentLink: PaymentLinkService`
- `paymentQR: PaymentQRService`  
- `creditCard: CreditCardService`

### Configuration Types

```typescript
interface PhaJayConfig {
  secretKey: string;                    // Required
  baseUrl?: string;                     // Optional custom API URL
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Documentation**: [https://payment-doc.phajay.co/v1](https://payment-doc.phajay.co/v1)
- **Portal**: [https://portal.phajay.co](https://portal.phajay.co)
- **Issues**: [GitHub Issues](https://github.com/phajay/phajay-payment-sdk/issues)

## Changelog

### 1.3.0
- 🔧 **BREAKING CHANGE**: Removed `generateQRByBank()` and `generateQRByBankName()` methods
- 🎯 **Simplified API**: Use only `generateQR()` method with bank in request object
- 🧹 **Cleaned**: Updated all examples and documentation to use single QR generation method
- ✅ **Tests**: All tests now pass with simplified API

### 1.2.0
- 🔧 **BREAKING CHANGE**: Removed sandbox environment support - production only
- 🎯 **Simplified**: Single environment configuration (production)
- 📝 **Updated**: Documentation and examples to reflect production-only setup
- 🧹 **Cleaned**: Removed all sandbox-related code and configurations

### 1.1.0
- ✨ **NEW**: Real-time Payment Subscriptions via Socket.IO
- ✨ **NEW**: QRSubscriptionService for advanced subscription control
- ✨ **NEW**: Convenience methods in PhaJayClient for subscription
- 🔧 Added subscription status monitoring and connection management
- 📚 Enhanced documentation with subscription examples
- 🧪 Added subscription demo and test utilities

### 1.0.0
- Initial release
- Payment Link service
- Payment QR service 
- Credit Card service
- Full TypeScript support
- Comprehensive documentation

---

Made with ❤️ by [PhaJay Payment Gateway](https://www.phajay.co/en)
