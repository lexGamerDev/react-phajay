# React PhaJay

Official React SDK for PhaJay Payment Gateway - Supporting Payment QR, Payment Link and Credit Card services in Lao PDR.

[![npm version](https://badge.fury.io/js/react-phajay.svg)](https://badge.fury.io/js/react-phajay)
[![Downloads](https://img.shields.io/npm/dm/react-phajay)](https://www.npmjs.com/package/react-phajay)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub issues](https://img.shields.io/github/issues/phajay/react-phajay)](https://github.com/phajay/react-phajay/issues)

> 🚨 **Production Ready** - This SDK is ready for production use with comprehensive error handling, type safety, and real-time features.

## Features

- 🏦 **Payment Links** - Single API integration connecting to multiple banks (JDB, LDB, IB, BCEL, STB)
- 📱 **QR Code Payments** - Bank-specific QR codes for mobile banking apps with real-time subscription
- 💳 **Credit Card Payments** - Secure 3DS credit card processing
- ⚡ **React Components** - Ready-to-use React components for seamless integration
- 🔴 **Real-time Subscriptions** - WebSocket-based payment monitoring and callbacks
- 🔒 **Type Safe** - Full TypeScript support with comprehensive type definitions
- 📝 **Well Documented** - Comprehensive documentation with examples

## Installation

```bash
npm install react-phajay
```

Or using yarn:

```bash
yarn add react-phajay
```

### Single Import for Everything

React PhaJay is designed for simplicity - import everything from one package:

```jsx
// Everything you need from one import
import { 
  // Core SDK
  PhaJayClient,
  
  // React Components
  PhaJayProvider, 
  PaymentQR, 
  PaymentLink, 
  PaymentCreditCard,
  
  // Types
  SupportedBank,
  PaymentQRProps,
  PaymentLinkProps
} from 'react-phajay';
```

## Quick Start

### Core SDK Usage

```typescript
import { PhaJayClient, SupportedBank } from 'react-phajay';

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

### React Components Usage

```jsx
import React from 'react';
import { PhaJayProvider, PaymentQR } from 'react-phajay';

function App() {
  return (
    <PhaJayProvider secretKey="your-secret-key">
      <PaymentQR 
        amount={50000}
        description="Coffee Payment"
        bank="BCEL"
        onPaymentSuccess={(data) => {
          console.log('Payment received!', data);
        }}
        onPaymentError={(error) => {
          console.error('Payment error:', error);
        }}
      />
    </PhaJayProvider>
  );
}
```

### Import Components

```jsx
// Single import for everything
import { 
  PhaJayProvider, 
  PaymentQR, 
  PaymentLink, 
  PaymentCreditCard,
  // Plus core SDK classes
  PhaJayClient,
  SupportedBank
} from 'react-phajay';

// No need for separate imports like 'react-phajay/react'
// Everything is available from the main package
```

### Auto-Redirect Features

All payment components automatically redirect users to the payment page by default:

```jsx
import { PhaJayProvider, PaymentLink, PaymentCreditCard } from 'react-phajay';

function PaymentButtons() {
  return (
    <PhaJayProvider secretKey="your-secret-key">
      {/* PaymentLink - Auto redirects to payment gateway */}
      <PaymentLink 
        amount={50000}
        description="Coffee Payment"
        onSuccess={(response) => {
          console.log('Redirecting to payment page...');
          // User will be automatically redirected
        }}
      />

      {/* PaymentCreditCard - Auto redirects to credit card form */}
      <PaymentCreditCard 
        amount={25000}
        description="Premium Service"
        onSuccess={(response) => {
          console.log('Redirecting to credit card payment...');
          // User will be automatically redirected
        }}
      />

      {/* To disable auto redirect, set autoRedirect={false} */}
      <PaymentLink 
        amount={10000}
        autoRedirect={false}
        onSuccess={(response) => {
          // Handle manually - no automatic redirect
          console.log('Payment URL:', response.redirectURL);
        }}
      />
    </PhaJayProvider>
  );
}
```

### PaymentQR Component with Automatic Real-time Subscription

```jsx
import { PhaJayProvider, PaymentQR } from 'react-phajay';

function QRPaymentComponent() {
  return (
    <PhaJayProvider secretKey="your-secret-key">
      <PaymentQR 
        amount={50000}
        description="Coffee Payment"
        bank="BCEL"
        onPaymentSuccess={(data) => {
          console.log('Payment received!', data);
          // Real-time subscription starts automatically!
          // No configuration needed
        }}
        onPaymentError={(error) => {
          console.error('Payment error:', error);
        }}
      />
    </PhaJayProvider>
  );
}
```

### Customizing Button Styles

All payment components support className-based styling and include default CSS:

```jsx
import { PhaJayProvider, PaymentQR, PaymentLink, PaymentCreditCard } from 'react-phajay';

function StyledPayments() {
  return (
    <PhaJayProvider secretKey="your-secret-key">
      {/* Using Tailwind CSS */}
      <PaymentQR 
        amount={25000}
        bank="BCEL"
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
      >
        Beautiful QR Button
      </PaymentQR>

      {/* Using custom CSS classes */}
      <PaymentLink 
        amount={100000}
        orderNo="ORDER_123"
        className="custom-payment-btn gradient-btn"
      >
        Gradient Payment Link
      </PaymentLink>

      {/* Using CSS modules */}
      <PaymentCreditCard 
        amount={75000}
        className="premium-button-style"
      >
        Premium Card Payment
      </PaymentCreditCard>
    </PhaJayProvider>
  );
}
```

### Default CSS Classes

Components automatically inject default styles, but you can override them:

```css
/* Default CSS class that all components use */
.phajay-payment-base {
  padding: 12px 24px;
  background-color: #09326a;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.phajay-payment-base:hover:not(:disabled) {
  background-color: #07274a;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.phajay-payment-base:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.phajay-payment-base.loading {
  background-color: #07274a;
  cursor: not-allowed;
  opacity: 0.8;
}
```

### Real-time Payment Monitoring

The PaymentQR component includes automatic subscription with intelligent error handling:

```jsx
import { PhaJayProvider, PaymentQR } from 'react-phajay';

function AutoSubscriptionDemo() {
  return (
    <PhaJayProvider secretKey="your-secret-key">
      <PaymentQR 
        amount={50000}
        bank="BCEL"
        onPaymentSuccess={(data) => {
          // This will be called when payment is received
          // OR after 10 seconds in demo mode if WebSocket connection fails
          console.log('Payment completed:', data);
        }}
        onPaymentError={(error) => {
          // Handle connection errors gracefully
          console.log('Payment monitoring error:', error.message);
        }}
      />
    </PhaJayProvider>
  );
}
```

**Automatic Features:**
- ⚡ **Auto-Start**: Subscription begins immediately when QR is generated
- 🔧 **Zero Config**: No `enableSubscription` prop needed
- 📊 **Visual Status**: Connection status indicators included
- 🎯 **Demo Fallback**: Simulates payment success after 10 seconds if connection fails
- ⏹️ **Auto-Stop**: Subscription ends when payment received or component unmounts

## Configuration

### Basic Configuration

```typescript
const client = new PhaJayClient({
  secretKey: 'your-secret-key' // Required: Get from PhaJay Portal
  // baseUrl is automatically set to: https://payment-gateway.phajay.co/v1/api
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

### Available Methods

```typescript
// Generate QR with bank specification
await client.paymentQR.generateQR({
  bank: SupportedBank.BCEL,
  amount: 50000,
  description: 'Coffee payment'
});

// Utility methods
const banks = client.paymentQR.getSupportedBanks();
const isSupported = client.paymentQR.isBankSupported('BCEL');
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
import { PhaJayAPIError } from 'react-phajay';

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
  // No need to specify baseUrl - automatically uses https://payment-gateway.phajay.co/v1/api
});
```

## TypeScript Support

Full TypeScript support with comprehensive type definitions:

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
  WebhookPayload,
  // React component types (all from same package)
  PaymentQRProps,
  PaymentLinkProps,
  PaymentCreditCardProps,
  PhaJayProviderProps
} from 'react-phajay';

// Type-safe client usage
const client: PhaJayClient = new PhaJayClient({
  secretKey: string
});

// Type-safe requests
const request: PaymentQRRequest = {
  bank: SupportedBank.BCEL,
  amount: 50000,
  description: 'Payment for order'
};
```

## Examples

### Quick Examples

```typescript
// 1. Basic Payment Link
import { PhaJayClient } from 'react-phajay';

const client = new PhaJayClient({ secretKey: 'your-key' });
const link = await client.paymentLink.createPaymentLink({
  amount: 50000,
  description: 'Order #123'
});
```

```jsx
// 2. React QR Component
import { PhaJayProvider, PaymentQR } from 'react-phajay';

<PhaJayProvider secretKey="your-key">
  <PaymentQR amount={25000} bank="BCEL" />
</PhaJayProvider>
```

### Complete Integration Example

```jsx
import React, { useState } from 'react';
import { PhaJayProvider, PaymentQR, PaymentLink, PaymentCreditCard } from 'react-phajay';

function PaymentDemo() {
  const [paymentStatus, setPaymentStatus] = useState('');

  return (
    <PhaJayProvider secretKey="your-secret-key">
      <div className="payment-container">
        <h2>Choose Payment Method</h2>
        
        {/* QR Payment */}
        <PaymentQR
          amount={50000}
          description="Product Purchase"
          bank="BCEL"
          onPaymentSuccess={(data) => {
            setPaymentStatus(`Payment successful! Transaction: ${data.transactionId}`);
          }}
          onPaymentError={(error) => {
            setPaymentStatus(`Payment failed: ${error.message}`);
          }}
        />
        
        {/* Payment Link */}
        <PaymentLink
          amount={75000}
          description="Service Payment"
          orderNo="ORDER-001"
          onSuccess={(response) => {
            console.log('Redirecting to:', response.redirectURL);
          }}
        />
        
        {/* Credit Card */}
        <PaymentCreditCard
          amount={100}  // USD
          description="Premium Service"
          onSuccess={(response) => {
            console.log('Card payment URL:', response.paymentUrl);
          }}
        />
        
        {paymentStatus && (
          <div className="payment-status">{paymentStatus}</div>
        )}
      </div>
    </PhaJayProvider>
  );
}
```

## Real-time Payment Subscriptions

For advanced use cases, you can use the subscription service directly:

```typescript
import { PhaJayClient } from 'react-phajay';

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

### Direct Service Usage

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

### Standalone Subscription Service

```typescript
// Method 2: Standalone subscription service
import { QRSubscriptionService } from 'react-phajay';

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
  secretKey: string;                    // Required: Your PhaJay secret key
  baseUrl?: string;                     // Optional: Defaults to https://payment-gateway.phajay.co/v1/api
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
- **Issues**: [GitHub Issues](https://github.com/phajay/react-phajay/issues)

## Changelog

### Version 1.0.0 (Current)
- 🎉 **Initial Release**: Complete React SDK for PhaJay Payment Gateway
- ⚡ **Auto-CSS Injection**: Automatic styling without manual CSS imports
- 🔄 **Single Import**: Import everything from `'react-phajay'`
- 🏦 **Multi-Payment Support**: PaymentLink, PaymentQR, PaymentCreditCard
- 📡 **Real-time Features**: Automatic WebSocket payment monitoring
- 🎨 **Customizable**: Override styles with className prop
- 🔒 **Type Safe**: Full TypeScript support and comprehensive error handling
- 📦 **Production Ready**: Optimized 61.6 kB bundle size

---

Made with ❤️ by [PhaJay Payment Gateway](https://www.phajay.co/en)
