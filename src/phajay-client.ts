import { PhaJayConfig } from './types';
import { PaymentLinkService } from './payment-link.service';
import { PaymentQRService } from './payment-qr.service';
import { CreditCardService } from './credit-card.service';

/**
 * Main PhaJay Payment Gateway SDK Client
 * 
 * Provides access to all PhaJay payment services:
 * - Payment Links (multi-bank support)
 * - Payment QR codes (bank-specific)
 * - Credit Card payments (3DS secure)
 * 
 * @example
 * ```typescript
 * import { PhaJayClient } from 'phajay-payment-sdk';
 * 
 * const client = new PhaJayClient({
 *   secretKey: 'your-secret-key'
 * });
 * 
 * // Create payment link
 * const paymentLink = await client.paymentLink.createPaymentLink({
 *   amount: 50000,
 *   description: 'Order payment'
 * });
 * 
 * // Generate QR code
 * const qrCode = await client.paymentQR.generateBCELQR({
 *   amount: 25000,
 *   description: 'Coffee payment'
 * });
 * 
 * // Create credit card payment
 * const creditCard = await client.creditCard.createPayment({
 *   amount: 100,
 *   description: 'Premium service'
 * });
 * ```
 */
export class PhaJayClient {
  public readonly paymentLink: PaymentLinkService;
  public readonly paymentQR: PaymentQRService;
  public readonly creditCard: CreditCardService;

  constructor(config: PhaJayConfig) {
    if (!config.secretKey) {
      throw new Error('Secret key is required');
    }

    this.paymentLink = new PaymentLinkService(config);
    this.paymentQR = new PaymentQRService(config);
    this.creditCard = new CreditCardService(config);
  }

  /**
   * Get SDK version
   */
  static getVersion(): string {
    return '1.3.0';
  }

  /**
   * Validate configuration
   */
  static validateConfig(config: PhaJayConfig): boolean {
    if (!config.secretKey || typeof config.secretKey !== 'string') {
      return false;
    }

    return true;
  }

  /**
   * Subscribe to QR payment callbacks
   * Convenience method that uses the PaymentQR service subscription
   * 
   * @param onPaymentReceived Callback for successful payments
   * @param onError Callback for errors
   * @returns Promise that resolves when connected
   * 
   * @example
   * ```typescript
   * await client.subscribeToQRPayments(
   *   (paymentData) => {
   *     console.log('Payment received:', paymentData);
   *     // Handle successful payment
   *   },
   *   (error) => {
   *     console.error('Subscription error:', error);
   *   }
   * );
   * ```
   */
  async subscribeToQRPayments(
    onPaymentReceived: (data: any) => void,
    onError?: (error: any) => void
  ): Promise<void> {
    return this.paymentQR.subscribe(onPaymentReceived, onError);
  }

  /**
   * Unsubscribe from QR payment callbacks
   */
  unsubscribeFromQRPayments(): void {
    this.paymentQR.unsubscribe();
  }

  /**
   * Get QR subscription connection status
   */
  getQRSubscriptionStatus() {
    return this.paymentQR.getSubscriptionStatus();
  }
}
