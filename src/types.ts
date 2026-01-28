// Common types
export interface PhaJayConfig {
  secretKey: string;
  baseUrl?: string;
}

export interface BaseRequest {
  amount: number;
  description: string;
  tag1?: string;
  tag2?: string;
  tag3?: string;
}

export interface BaseResponse {
  message: string;
}

// Payment Link types
export interface PaymentLinkRequest extends BaseRequest {
  orderNo?: string;
}

export interface PaymentLinkResponse extends BaseResponse {
  redirectURL: string;
  orderNo: string;
}

// Payment QR types
export enum SupportedBank {
  JDB = 'JDB',
  LDB = 'LDB',
  IB = 'IB',
  BCEL = 'BCEL',
  STB = 'STB'
}

export interface PaymentQRRequest extends BaseRequest {
  bank: SupportedBank;
}

export interface PaymentQRResponse extends BaseResponse {
  transactionId: string;
  qrCode: string;
  link: string;
}

// Credit Card types
export interface CreditCardRequest extends BaseRequest {
  // Optional fields for credit card payment
}

export interface CreditCardResponse extends BaseResponse {
  paymentUrl: string;
  expirationTime: string;
  transactionId: string;
  status: string;
}

// Webhook types
export interface WebhookPayload {
  message: string;
  refNo?: string;
  billNumber?: string;
  txnDateTime: string;
  txnAmount: number;
  sourceCurrency: string;
  sourceAccount?: string;
  merchantName?: string;
  sourceName?: string;
  description: string;
  exReferenceNo?: string;
  userId: string;
  linkCode?: string;
  transactionId: string;
  status: string;
  paymentMethod: string;
  orderNo?: string;
  successURL?: string;
  tag1?: string;
  tag2?: string;
  tag3?: string;
  tag4?: string;
  tag5?: string;
  tag6?: string;
  // Credit card specific fields
  currency?: string;
  cardType?: string;
  creditCardDetails?: {
    issuerCode?: string;
    cardHolderName: string;
    cardNumber: string;
    cardExpiry: string;
    authenticationStatus?: string;
    eciValue?: string;
    xidValue?: string;
    cavvValue?: string;
    enrolledFlag?: string;
  };
  transactionAmount?: {
    amountText: string;
    currencyCode: string;
    decimalPlaces: number;
    amount: number;
  };
}

// Error types
export interface PhaJayError {
  code: string;
  message: string;
  details?: any;
}

export class PhaJayAPIError extends Error {
  public code: string;
  public details?: any;

  constructor(error: PhaJayError) {
    super(error.message);
    this.code = error.code;
    this.details = error.details;
    this.name = 'PhaJayAPIError';
  }
}

// QR Subscription types
export interface QRSubscriptionConfig {
  secretKey: string;
  socketUrl?: string;
  onPaymentReceived?: (data: QRPaymentCallback) => void;
  onError?: (error: any) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export interface QRPaymentCallback {
  message: string;
  refNo: string;
  exReferenceNo: string;
  merchantName: string;
  description: string;
  paymentMethod: string;
  txnDateTime: string;
  txnAmount: number;
  billNumber: string;
  sourceAccount: string;
  sourceName: string;
  sourceCurrency: string;
  userId: string;
  status: string;
  transactionId: string;
  tag1?: string;
  tag2?: string;
  tag3?: string;
  tag4?: string;
  tag5?: string;
  tag6?: string;
}

export enum QRSubscriptionEvents {
  PAYMENT_RECEIVED = 'payment_received',
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  ERROR = 'error',
  RECONNECTING = 'reconnecting'
}
