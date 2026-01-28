import { EventEmitter } from 'events';
import { QRSubscriptionConfig, QRPaymentCallback, QRSubscriptionEvents } from './types';

/**
 * Payment QR Subscription Service
 * 
 * Provides real-time subscription to Payment QR callbacks using SocketIO.
 * Automatically handles connection, reconnection, and event dispatching.
 */
export class QRSubscriptionService extends EventEmitter {
  private config: QRSubscriptionConfig;
  private socket: any = null;
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 10;
  private reconnectDelay: number = 5000; // 5 seconds
  private reconnectTimer: NodeJS.Timeout | null = null;

  constructor(config: QRSubscriptionConfig) {
    super();
    this.config = {
      socketUrl: 'https://payment-gateway.phajay.co/',
      ...config
    };

    // Set up event handlers from config
    if (config.onPaymentReceived) {
      this.on(QRSubscriptionEvents.PAYMENT_RECEIVED, config.onPaymentReceived);
    }
    if (config.onError) {
      this.on(QRSubscriptionEvents.ERROR, config.onError);
    }
    if (config.onConnect) {
      this.on(QRSubscriptionEvents.CONNECTED, config.onConnect);
    }
    if (config.onDisconnect) {
      this.on(QRSubscriptionEvents.DISCONNECTED, config.onDisconnect);
    }
  }

  /**
   * Connect to PhaJay SocketIO server and subscribe to payment events
   */
  async connect(): Promise<void> {
    try {
      // Dynamic import for socket.io-client (only load when needed)
      const { io } = await import('socket.io-client');
      
      if (this.socket && this.isConnected) {
        console.log('Socket is already connected');
        return;
      }

      console.log(`🔌 Connecting to PhaJay SocketIO: ${this.config.socketUrl}`);
      
      this.socket = io(this.config.socketUrl!, {
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay
      });

      this.setupSocketEventHandlers();
      
    } catch (error) {
      console.error('Failed to load socket.io-client:', error);
      this.emit(QRSubscriptionEvents.ERROR, new Error('Failed to load socket.io-client. Make sure to install: npm install socket.io-client'));
    }
  }

  /**
   * Setup socket event handlers
   */
  private setupSocketEventHandlers(): void {
    if (!this.socket) return;

    // Connection established
    this.socket.on('connect', () => {
      console.log('✅ Connected to PhaJay Payment server!');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.emit(QRSubscriptionEvents.CONNECTED);
      
      // Subscribe to payment events using secret key
      const eventName = `join::${this.config.secretKey}`;
      console.log(`🔔 Subscribing to payment events: ${eventName}`);
      
      this.socket.on(eventName, (data: QRPaymentCallback) => {
        console.log('💰 Payment data received:', data);
        this.emit(QRSubscriptionEvents.PAYMENT_RECEIVED, data);
      });
    });

    // Connection error
    this.socket.on('connect_error', (error: any) => {
      console.error('❌ Connection failed:', error);
      this.isConnected = false;
      this.emit(QRSubscriptionEvents.ERROR, error);
      this.handleReconnection();
    });

    // Disconnection
    this.socket.on('disconnect', (reason: string) => {
      console.log('🔌 Disconnected from server:', reason);
      this.isConnected = false;
      this.emit(QRSubscriptionEvents.DISCONNECTED, reason);
      
      if (reason === 'io server disconnect') {
        // Server disconnected, reconnect manually
        this.handleReconnection();
      }
    });

    // Reconnection attempt
    this.socket.on('reconnect_attempt', (attemptNumber: number) => {
      console.log(`🔄 Reconnection attempt ${attemptNumber}/${this.maxReconnectAttempts}`);
      this.emit(QRSubscriptionEvents.RECONNECTING, attemptNumber);
    });

    // Reconnection failed
    this.socket.on('reconnect_failed', () => {
      console.error('❌ Failed to reconnect after maximum attempts');
      this.emit(QRSubscriptionEvents.ERROR, new Error('Reconnection failed after maximum attempts'));
    });
  }

  /**
   * Handle reconnection logic
   */
  private handleReconnection(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('❌ Maximum reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    this.reconnectTimer = setTimeout(() => {
      console.log(`🔄 Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      if (this.socket && !this.isConnected) {
        this.socket.connect();
      }
    }, this.reconnectDelay);
  }

  /**
   * Disconnect from the server
   */
  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.socket) {
      console.log('🔌 Disconnecting from PhaJay server...');
      this.socket.disconnect();
      this.socket = null;
    }
    
    this.isConnected = false;
    this.reconnectAttempts = 0;
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): {
    connected: boolean;
    reconnectAttempts: number;
    socketId?: string;
  } {
    return {
      connected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      socketId: this.socket?.id
    };
  }

  /**
   * Process received payment callback data
   */
  processPaymentCallback(data: QRPaymentCallback) {
    return {
      transactionId: data.transactionId,
      status: data.status,
      amount: data.txnAmount,
      currency: data.sourceCurrency,
      paymentMethod: data.paymentMethod,
      timestamp: data.txnDateTime,
      bankReference: data.refNo,
      externalReference: data.exReferenceNo,
      description: data.description,
      sourceAccount: data.sourceAccount,
      sourceName: data.sourceName,
      tags: {
        tag1: data.tag1,
        tag2: data.tag2,
        tag3: data.tag3,
        tag4: data.tag4,
        tag5: data.tag5,
        tag6: data.tag6
      },
      raw: data
    };
  }

  /**
   * Check if payment is completed successfully
   */
  isPaymentCompleted(data: QRPaymentCallback): boolean {
    return data.status === 'PAYMENT_COMPLETED' && data.message === 'SUCCESS';
  }
}
