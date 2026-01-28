import { PaymentQRService } from '../payment-qr.service';
import { SupportedBank } from '../types';

describe('PaymentQRService', () => {
  const mockConfig = {
    secretKey: 'test-secret-key'
  };

  let service: PaymentQRService;

  beforeEach(() => {
    service = new PaymentQRService(mockConfig);
  });

  describe('Utility methods', () => {
    it('should return supported banks', () => {
      const supportedBanks = service.getSupportedBanks();
      expect(supportedBanks).toEqual(['JDB', 'LDB', 'IB', 'BCEL', 'STB']);
    });

    it('should check if bank is supported', () => {
      expect(service.isBankSupported('BCEL')).toBe(true);
      expect(service.isBankSupported('JDB')).toBe(true);
      expect(service.isBankSupported('INVALID')).toBe(false);
    });
  });
});
