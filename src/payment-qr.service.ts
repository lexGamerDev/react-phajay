import { BaseClient } from './base-client';
import { PaymentQRRequest, PaymentQRResponse, SupportedBank, PhaJayConfig, QRSubscriptionConfig } from './types';
import { QRSubscriptionService } from './qr-subscription.service';
import axios, { AxiosInstance } from 'axios';

/**
 * Payment QR Service
 * 
 * Generates QR codes for different banks in Lao PDR.
 * Users can scan these QR codes with their mobile banking apps to complete payments.
 * 
 * Supported banks: BCEL, JDB, LDB, IB, STB
 */
export class PaymentQRService extends BaseClient {
  private qrClient: AxiosInstance;
  private subscriptionService: QRSubscriptionService | null = null;
  
  private readonly bankEndpoints = {
    [SupportedBank.JDB]: '/payment/generate-jdb-qr',
    [SupportedBank.LDB]: '/payment/generate-ldb-qr', 
    [SupportedBank.IB]: '/payment/generate-ib-qr',
    [SupportedBank.BCEL]: '/payment/generate-bcel-qr',
    [SupportedBank.STB]: '/payment/generate-stb-qr'
  };

  constructor(config: PhaJayConfig) {
    super(config);
    
    // Create separate axios client for QR API that uses secretKey header
    this.qrClient = axios.create({
      baseURL: this.config.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        'secretKey': this.config.secretKey // Payment QR API uses secretKey header
      },
      timeout: 30000
    });
  }

  /**
   * Generate QR code for a specific bank
   * 
   * @param request Payment QR request data
   * @returns Promise resolving to QR code response
   * 
   * @example
   * ```typescript
   * const qrResponse = await qrService.generateQR({
   *   bank: SupportedBank.BCEL,
   *   amount: 25000,
   *   description: "Coffee Shop Payment",
   *   tag1: "shop_123",
   *   tag2: "location_central"
   * });
   * 
   * // Display QR code: qrResponse.qrCode
   * // Or use deep link: qrResponse.link
   * ```
   */
  async generateQR(request: PaymentQRRequest): Promise<PaymentQRResponse> {
    const endpoint = this.bankEndpoints[request.bank];
    if (!endpoint) {
      throw new Error(`Unsupported bank: ${request.bank}`);
    }

    // Remove bank from request body as it's part of the endpoint
    const { bank, ...requestBody } = request;
    
    try {
      const response = await this.qrClient.post(endpoint, requestBody);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(`QR Generation Error: ${error.response.data?.message || error.message}`);
      }
      throw error;
    }
  }

  /**
   * Get list of supported banks
   */
  getSupportedBanks(): SupportedBank[] {
    return Object.values(SupportedBank);
  }

  /**
   * Check if a bank is supported
   */
  isBankSupported(bank: string): bank is SupportedBank {
    return Object.values(SupportedBank).includes(bank as SupportedBank);
  }

  /**
   * Create subscription service for real-time payment callbacks
   * 
   * @param config Subscription configuration
   * @returns QRSubscriptionService instance
   * 
   * @example
   * ```typescript
   * const subscription = qrService.createSubscription({
   *   secretKey: 'your-secret-key',
   *   onPaymentReceived: (data) => {
   *     console.log('Payment received:', data);
   *   },
   *   onError: (error) => {
   *     console.error('Subscription error:', error);
   *   }
   * });
   * 
   * await subscription.connect();
   * ```
   */
  createSubscription(config?: Partial<QRSubscriptionConfig>): QRSubscriptionService {
    const subscriptionConfig: QRSubscriptionConfig = {
      secretKey: this.config.secretKey,
      ...config
    };

    this.subscriptionService = new QRSubscriptionService(subscriptionConfig);
    return this.subscriptionService;
  }

  /**
   * Get current subscription service
   */
  getSubscription(): QRSubscriptionService | null {
    return this.subscriptionService;
  }

  /**
   * Subscribe to payment callbacks with built-in subscription service
   * 
   * @param onPaymentReceived Callback for payment received events
   * @param onError Callback for error events
   * @returns Promise that resolves when connected
   * 
   * @example
   * ```typescript
   * await qrService.subscribe(
   *   (paymentData) => {
   *     console.log('Payment completed:', paymentData.transactionId);
   *     // Handle successful payment
   *   },
   *   (error) => {
   *     console.error('Subscription error:', error);
   *   }
   * );
   * ```
   */
  async subscribe(
    onPaymentReceived: (data: any) => void,
    onError?: (error: any) => void
  ): Promise<void> {
    if (!this.subscriptionService) {
      this.subscriptionService = this.createSubscription({
        onPaymentReceived,
        onError
      });
    }

    await this.subscriptionService.connect();
  }

  /**
   * Unsubscribe from payment callbacks
   */
  unsubscribe(): void {
    if (this.subscriptionService) {
      this.subscriptionService.disconnect();
      this.subscriptionService = null;
    }
  }

  /**
   * Get subscription connection status
   */
  getSubscriptionStatus() {
    return this.subscriptionService?.getConnectionStatus() || {
      connected: false,
      reconnectAttempts: 0
    };
  }
}
