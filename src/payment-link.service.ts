import { BaseClient } from './base-client';
import { PaymentLinkRequest, PaymentLinkResponse, PhaJayConfig } from './types';

/**
 * Payment Link Service
 * 
 * Provides functionality to create payment links that redirect users to
 * a secure payment page supporting multiple local banks in Lao PDR.
 * 
 * Supported banks: JDB, LDB, IB, BCEL, STB
 */
export class PaymentLinkService extends BaseClient {
  constructor(config: PhaJayConfig) {
    super(config);
  }

  /**
   * Create a payment link
   * 
   * @param request Payment link request data
   * @returns Promise resolving to payment link response
   * 
   * @example
   * ```typescript
   * const paymentLink = await paymentLinkService.createPaymentLink({
   *   amount: 50000,
   *   description: "Buy premium subscription",
   *   orderNo: "ORDER_12345",
   *   tag1: "shop_id_123",
   *   tag2: "Premium Shop"
   * });
   * 
   * // Redirect user to: paymentLink.redirectURL
   * ```
   */
  async createPaymentLink(request: PaymentLinkRequest): Promise<PaymentLinkResponse> {
    return this.makeRequest<PaymentLinkResponse>(
      'POST', 
      '/link/payment-link',
      request
    );
  }

  /**
   * Validate webhook payload for security
   * 
   * @param payload Webhook payload received from PhaJay
   * @returns boolean indicating if payload is valid
   */
  validateWebhookPayload(payload: any): boolean {
    // Basic validation - you should implement proper signature verification
    // based on PhaJay's webhook security recommendations
    return payload && 
           payload.transactionId && 
           payload.status && 
           payload.paymentMethod;
  }

  /**
   * Process webhook callback
   * 
   * @param payload Webhook payload from PhaJay
   * @returns Processed webhook data
   */
  processWebhook(payload: any) {
    if (!this.validateWebhookPayload(payload)) {
      throw new Error('Invalid webhook payload');
    }

    return {
      transactionId: payload.transactionId,
      status: payload.status,
      amount: payload.txnAmount,
      orderNo: payload.orderNo,
      paymentMethod: payload.paymentMethod,
      linkCode: payload.linkCode,
      tags: {
        tag1: payload.tag1,
        tag2: payload.tag2,
        tag3: payload.tag3
      },
      raw: payload
    };
  }
}
