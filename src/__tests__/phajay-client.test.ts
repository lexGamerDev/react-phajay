import { PhaJayClient, SupportedBank } from '../index';

describe('PhaJayClient', () => {
  const mockConfig = {
    secretKey: 'test-secret-key'
  };

  let client: PhaJayClient;

  beforeEach(() => {
    client = new PhaJayClient(mockConfig);
  });

  describe('Constructor', () => {
    it('should create client with valid config', () => {
      expect(client).toBeInstanceOf(PhaJayClient);
      expect(client.paymentLink).toBeDefined();
      expect(client.paymentQR).toBeDefined();
      expect(client.creditCard).toBeDefined();
    });

    it('should throw error with invalid config', () => {
      expect(() => {
        new PhaJayClient({ secretKey: '' });
      }).toThrow('Secret key is required');
    });
  });

  describe('Static methods', () => {
    it('should return version', () => {
      const version = PhaJayClient.getVersion();
      expect(version).toBe('1.3.0');
    });

    it('should validate config correctly', () => {
      expect(PhaJayClient.validateConfig({ secretKey: 'test' })).toBe(true);
      expect(PhaJayClient.validateConfig({ secretKey: '' })).toBe(false);
    });
  });
});
