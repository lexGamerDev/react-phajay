import { BaseClient } from './base-client';
import { CreditCardRequest, CreditCardResponse, PhaJayConfig } from './types';

/**
 * Credit Card Service
 * 
 * Provides secure credit card payment processing through PhaJay's banking partners.
 * All transactions require 3D Secure (3DS) authentication for enhanced security.
 * 
 * Note: Only KYC-approved accounts can use credit card payments.
 */
export class CreditCardService extends BaseClient {
  constructor(config: PhaJayConfig) {
    super(config);
  }

  /**
   * Create a credit card payment page link
   * 
   * @param request Credit card payment request data
   * @returns Promise resolving to payment page URL and transaction details
   * 
   * @example
   * ```typescript
   * const paymentPage = await creditCardService.createPayment({
   *   amount: 100,
   *   description: "Premium Service Purchase",
   *   tag1: "customer_id_456",
   *   tag2: "service_premium",
   *   tag3: "ORDER-2023-001"
   * });
   * 
   * // Redirect user to: paymentPage.paymentUrl
   * // Transaction ID: paymentPage.transactionId
   * // Expires at: paymentPage.expirationTime
   * ```
   */
  async createPayment(request: CreditCardRequest): Promise<CreditCardResponse> {
    return this.makeRequest<CreditCardResponse>(
      'POST',
      '/jdb2c2p/payment/payment-link',
      request
    );
  }

  /**
   * Process credit card webhook callback
   * 
   * @param payload Webhook payload from PhaJay
   * @returns Processed credit card payment data
   */
  processWebhook(payload: any) {
    if (!this.validateWebhookPayload(payload)) {
      throw new Error('Invalid credit card webhook payload');
    }

    return {
      transactionId: payload.transactionId,
      status: payload.status,
      amount: payload.txnAmount,
      currency: payload.currency,
      paymentMethod: payload.paymentMethod,
      cardType: payload.cardType,
      cardDetails: payload.creditCardDetails ? {
        cardHolderName: payload.creditCardDetails.cardHolderName,
        maskedCardNumber: payload.creditCardDetails.cardNumber,
        cardExpiry: payload.creditCardDetails.cardExpiry
      } : null,
      transactionAmount: payload.transactionAmount,
      tags: {
        tag1: payload.tag1,
        tag2: payload.tag2,
        tag3: payload.tag3,
        tag4: payload.tag4,
        tag5: payload.tag5,
        tag6: payload.tag6
      },
      raw: payload
    };
  }

  /**
   * Validate credit card webhook payload
   * 
   * @param payload Webhook payload received from PhaJay
   * @returns boolean indicating if payload is valid
   */
  private validateWebhookPayload(payload: any): boolean {
    return payload && 
           payload.transactionId && 
           payload.status && 
           payload.paymentMethod === 'CREDIT_CARD' &&
           payload.txnAmount &&
           payload.currency;
  }

  /**
   * Check if payment is completed successfully
   * 
   * @param payload Webhook payload
   * @returns boolean indicating if payment is successful
   */
  isPaymentSuccessful(payload: any): boolean {
    return payload.status === 'PAYMENT_COMPLETED' && payload.message === 'SUCCESS';
  }

  /**
   * Get payment status from webhook
   * 
   * @param payload Webhook payload
   * @returns Payment status
   */
  getPaymentStatus(payload: any): string {
    return payload.status || 'UNKNOWN';
  }
}
