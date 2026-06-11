const mockGetBalance = jest.fn().mockResolvedValue({
  ngnBalance: '5000', usdBalance: '12.50', toroGBalance: '200'
});

jest.mock('torosdk', () => ({ getBalance: mockGetBalance }));

import { balanceService } from '../../src/services/balance.service';

beforeEach(() => { jest.clearAllMocks(); });

describe('BalanceService', () => {
  it('returns balances for a valid address', async () => {
    const result = await balanceService.getBalance('0xaddr');
    expect(result.ngnBalance).toBe('5000');
    expect(result.usdBalance).toBe('12.50');
    expect(result.toroGBalance).toBe('200');
    expect(mockGetBalance).toHaveBeenCalledWith({ address: '0xaddr' });
  });

  it('forwards SDK errors', async () => {
    mockGetBalance.mockRejectedValueOnce(new Error('network error'));
    await expect(balanceService.getBalance('0xbad')).rejects.toThrow('network error');
  });
});
