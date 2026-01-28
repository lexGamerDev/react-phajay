import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import { PhaJayConfig, PhaJayAPIError } from './types';

export class BaseClient {
  protected client: AxiosInstance;
  protected config: PhaJayConfig;

  constructor(config: PhaJayConfig) {
    this.config = {
      baseUrl: config.baseUrl || 'https://payment-gateway.phajay.co/v1/api',
      ...config
    };

    // Create base64 encoded authorization header
    const authString = typeof window !== 'undefined' && window.btoa 
      ? window.btoa(this.config.secretKey)
      : Buffer.from(this.config.secretKey).toString('base64');

    this.client = axios.create({
      baseURL: this.config.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authString}`
      },
      timeout: 30000
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (error.response) {
          throw new PhaJayAPIError({
            code: error.response.status.toString(),
            message: (error.response.data as any)?.message || error.message,
            details: error.response.data
          });
        } else if (error.request) {
          throw new PhaJayAPIError({
            code: 'NETWORK_ERROR',
            message: 'Network error occurred'
          });
        } else {
          throw new PhaJayAPIError({
            code: 'UNKNOWN_ERROR',
            message: error.message
          });
        }
      }
    );
  }

  protected async makeRequest<T>(method: 'GET' | 'POST' | 'PUT' | 'DELETE', url: string, data?: any): Promise<T> {
    const response = await this.client.request({
      method,
      url,
      data
    });
    
    return response.data;
  }
}
