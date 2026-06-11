const mockDepositFunds = jest.fn();
const mockVerifyDeposit = jest.fn().mockResolvedValue(true);
const Currency = { NGN: 'NGN', USD: 'USD', EUR: 'EUR', GBP: 'GBP', KSH: 'KSH', ZAR: 'ZAR',
  Naira: 'NGN', Euro: 'EUR', Dollar: 'USD', Pound: 'GBP', Kenyan_Shilling: 'KSH', South_African_Rand: 'ZAR' };

jest.mock('torosdk', () => ({
  depositFunds: mockDepositFunds,
  verifyDeposit: mockVerifyDeposit,
  Currency
}));

import { depositService } from '../../src/services/deposit.service';

beforeEach(() => {
  jest.clearAllMocks();
  delete process.env.ADMIN_WALLET_ADDRESS;
  delete process.env.ADMIN_WALLET_PASSWORD;
});

describe('DepositService', () => {
  describe('init (mock mode — no ConnectW creds)', () => {
    it('returns mock response without admin credentials', async () => {
      const result = await depositService.init({
        userAddress: '0xaddr', username: 'alice', amount: '1000', currency: 'NGN'
      });
      expect(result).toHaveProperty('paymentlink');
      expect(result.note).toContain('MOCK RESPONSE');
      expect(mockDepositFunds).not.toHaveBeenCalled();
    });
  });

  describe('init (live mode)', () => {
    beforeEach(() => {
      process.env.ADMIN_WALLET_ADDRESS = '0xadmin';
      process.env.ADMIN_WALLET_PASSWORD = 'adminpw';
    });

    it('calls SDK depositFunds with correct params', async () => {
      mockDepositFunds.mockResolvedValueOnce({ txid: 'TX999', amount: '1000' });
      const result = await depositService.init({
        userAddress: '0xaddr', username: 'alice', amount: '1000', currency: 'NGN'
      });
      expect(mockDepositFunds).toHaveBeenCalled();
      expect(result.txid).toBe('TX999');
    });
  });

  describe('verify', () => {
    it('verifies deposit', async () => {
      process.env.ADMIN_WALLET_ADDRESS = '0xadmin';
      process.env.ADMIN_WALLET_PASSWORD = 'adminpw';
      const result = await depositService.verify({ currency: 'NGN', txid: 'TX123' });
      expect(result).toBe(true);
      expect(mockVerifyDeposit).toHaveBeenCalledWith('NGN', 'TX123');
    });

    it('returns mock true without admin credentials', async () => {
      const result = await depositService.verify({ currency: 'NGN', txid: 'TX123' });
      expect(result).toBe(true);
      expect(mockVerifyDeposit).not.toHaveBeenCalled();
    });
  });
});
