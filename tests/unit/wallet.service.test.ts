const mockCreateWallet = jest.fn().mockResolvedValue('0xabcdef1234567890abcdef1234567890abcdef12');
const mockImportWallet = jest.fn().mockResolvedValue('0xabcdef1234567890abcdef1234567890abcdef12');
const mockVerifyWalletPwd = jest.fn().mockResolvedValue(true);
const mockGetWalletKey = jest.fn().mockResolvedValue({ pubkey: '0xpubkey', privkey: '0xprivkey' });

jest.mock('torosdk', () => ({
  createWallet: mockCreateWallet,
  importWalletFromPrivateKeyAndPassword: mockImportWallet,
  verifyWalletPassword: mockVerifyWalletPwd,
  getWalletKey: mockGetWalletKey
}));

import { walletService } from '../../src/services/wallet.service';

beforeEach(() => { jest.clearAllMocks(); });

describe('WalletService', () => {
  it('creates a wallet and returns address', async () => {
    const result = await walletService.create({ username: 'alice', password: 'securePass123' });
    expect(result.address).toBe('0xabcdef1234567890abcdef1234567890abcdef12');
    expect(mockCreateWallet).toHaveBeenCalledWith({ username: 'alice', password: 'securePass123' });
  });

  it('forwards SDK errors on create', async () => {
    mockCreateWallet.mockRejectedValueOnce(new Error('username taken'));
    await expect(walletService.create({ username: 'bob', password: 'pw' })).rejects.toThrow('username taken');
  });

  it('imports wallet from private key', async () => {
    const result = await walletService.import({ privateKey: '0xprivkey', password: 'pw' });
    expect(result.address).toBeTruthy();
    expect(mockImportWallet).toHaveBeenCalledWith({ pvKey: '0xprivkey', password: 'pw' });
  });

  it('returns boolean for verifyPassword', async () => {
    const result = await walletService.verifyPassword({ address: '0xaddr', password: 'pw' });
    expect(result).toBe(true);
    expect(mockVerifyWalletPwd).toHaveBeenCalledWith({ address: '0xaddr', password: 'pw' });
  });

  it('returns keys from getKeys', async () => {
    const result = await walletService.getKeys({ address: '0xaddr' });
    expect(result.pubkey).toBe('0xpubkey');
    expect(result.privkey).toBe('0xprivkey');
    expect(mockGetWalletKey).toHaveBeenCalledWith({ address: '0xaddr' });
  });
});
