const mockGetBlockchainStatus = jest.fn().mockResolvedValue({ status: 'running', syncStatus: 'synced' });
const mockGetBlockById = jest.fn().mockResolvedValue({ blockId: '1000', hash: '0xblockhash' });
const mockGetTransaction = jest.fn().mockResolvedValue({ hash: '0xtxhash', status: 'confirmed' });
const mockGetReceipt = jest.fn().mockResolvedValue({ hash: '0xtxhash', status: 'success' });

jest.mock('torosdk', () => ({
  getBlockchainStatus: mockGetBlockchainStatus,
  getBlockById: mockGetBlockById,
  getTransaction: mockGetTransaction,
  getReceipt: mockGetReceipt
}));

import { blockchainService } from '../../src/services/blockchain.service';

beforeEach(() => { jest.clearAllMocks(); });

describe('BlockchainService', () => {
  it('getStatus returns blockchain status', async () => {
    const result = await blockchainService.getStatus();
    expect(result.status).toBe('running');
    expect(mockGetBlockchainStatus).toHaveBeenCalled();
  });

  it('getBlock calls getBlockById', async () => {
    const result = await blockchainService.getBlock('1000');
    expect(result.blockId).toBe('1000');
    expect(mockGetBlockById).toHaveBeenCalledWith('1000');
  });

  it('getTransaction calls SDK with hash string', async () => {
    const result = await blockchainService.getTransaction('0xhash');
    expect(result.hash).toBe('0xtxhash');
    expect(mockGetTransaction).toHaveBeenCalledWith('0xhash');
  });

  it('getReceipt calls SDK with hash string', async () => {
    const result = await blockchainService.getReceipt('0xhash');
    expect(result.status).toBe('success');
    expect(mockGetReceipt).toHaveBeenCalledWith('0xhash');
  });

  it('forwards SDK errors', async () => {
    mockGetBlockchainStatus.mockRejectedValueOnce(new Error('API unreachable'));
    await expect(blockchainService.getStatus()).rejects.toThrow('API unreachable');
  });
});
