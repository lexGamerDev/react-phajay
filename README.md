# React PhaJay

Official React SDK for PhaJay Payment Gateway - Supporting Payment QR, Payment Link and Credit Card services in Lao PDR.

[![npm version](https://badge.fury.io/js/react-phajay.svg)](https://badge.fury.io/js/react-phajay)
[![Downloads](https://img.shields.io/npm/dm/react-phajay)](https://www.npmjs.com/package/react-phajay)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub issues](https://img.shields.io/github/issues/phajay/react-phajay)](https://github.com/lailaolabdev/react-phajay/issues)

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
    <PhaJayProvider config={{ secretKey: "your-secret-key" }}>
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
    <PhaJayProvider config={{ secretKey: "your-secret-key" }}>
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
    <PhaJayProvider config={{ secretKey: "your-secret-key" }}>
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
    <PhaJayProvider config={{ secretKey: "your-secret-key" }}>
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

## Webhook Configuration

### Configure URLs in PhaJay Portal

1. Login to [PhaJay Portal](https://portal.phajay.co/)
2. Go to **Settings > Callback URL Setting**
   - **Success URL**: Where users go after successful payment
   - **Cancel URL**: Where users go if they cancel

3. Go to **Settings > Webhook Setting**
   - **Endpoint**: Your server's webhook URL (e.g., `https://yourdomain.com/api/webhook`)

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

<PhaJayProvider config={{ secretKey: "your-key" }}>
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
    <PhaJayProvider config={{ secretKey: "your-secret-key" }}>
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
- **Issues**: [GitHub Issues](https://github.com/lailaolabdev/react-phajay/issues)

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
