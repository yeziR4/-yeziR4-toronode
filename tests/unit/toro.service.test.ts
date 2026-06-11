const mockGetCurrencyBalance = jest.fn().mockResolvedValue({ balance: '300', currency: 'TORO' });

jest.mock('torosdk', () => ({ getCurrencyBalance: mockGetCurrencyBalance }));

jest.mock('axios');

import axios from 'axios';
import { toroService } from '../../src/services/toro.service';

const mockedAxios = axios as jest.Mocked<typeof axios>;

beforeEach(() => {
  jest.clearAllMocks();
  process.env.TORONET_BASE_URL = 'https://testnet.toronet.org/api';
});

describe('ToroService', () => {
  describe('getBalance', () => {
    it('returns balance from SDK getCurrencyBalance', async () => {
      const result = await toroService.getBalance('0xaddr');
      expect(result.success).toBe(true);
      expect(result.balance).toBe('300');
      expect(mockGetCurrencyBalance).toHaveBeenCalledWith({ currency: 'TORO', address: '0xaddr' });
    });

    it('falls back to direct API when SDK fails', async () => {
      mockGetCurrencyBalance.mockRejectedValueOnce(new Error('SDK error'));
      mockedAxios.post.mockResolvedValueOnce({ data: { balance: '150' } });

      const result = await toroService.getBalance('0xaddr');
      expect(result.success).toBe(true);
      expect(result.balance).toBe('150');
    });
  });

  describe('transfer', () => {
    it('sends transfer via direct API call', async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: { result: true, txid: '0xtxhash' } });

      const result = await toroService.transfer({
        senderAddr: '0xsender', senderPwd: 'pwd', receiverAddr: '0xreceiver', amount: '10'
      });

      expect(result.success).toBe(true);
      expect(result.txHash).toBe('0xtxhash');
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://testnet.toronet.org/api/token/toro/cl',
        expect.objectContaining({
          op: 'transfer',
          params: expect.arrayContaining([
            expect.objectContaining({ name: 'client', value: '0xsender' })
          ])
        })
      );
    });

    it('throws on API error result', async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: { result: false, error: 'insufficient balance' } });
      await expect(toroService.transfer({
        senderAddr: '0xsender', senderPwd: 'pwd', receiverAddr: '0xreceiver', amount: '10'
      })).rejects.toThrow('insufficient balance');
    });

    it('throws on malformed response', async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: null });
      await expect(toroService.transfer({
        senderAddr: '0xsender', senderPwd: 'pwd', receiverAddr: '0xreceiver', amount: '10'
      })).rejects.toThrow('Malformed response');
    });
  });
});
