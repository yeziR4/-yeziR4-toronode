const mockGetRates = jest.fn().mockResolvedValue({ TORO: { USD: '0.05' } });

jest.mock('torosdk', () => ({ getSupportedAssetsExchangeRates: mockGetRates }));

import { exchangeService } from '../../src/services/exchange.service';

beforeEach(() => { jest.clearAllMocks(); });

describe('ExchangeService', () => {
  it('returns exchange rates', async () => {
    const result = await exchangeService.getRates();
    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
    expect(mockGetRates).toHaveBeenCalled();
  });

  it('forwards SDK errors', async () => {
    mockGetRates.mockRejectedValueOnce(new Error('rates unavailable'));
    await expect(exchangeService.getRates()).rejects.toThrow('rates unavailable');
  });
});
