const Currency: Record<string, string> = {
  Naira: 'NGN',
  Euro: 'EUR',
  Dollar: 'USD',
  Pound: 'GBP',
  Kenyan_Shilling: 'KSH',
  South_African_Rand: 'ZAR',
  NGN: 'NGN',
  EUR: 'EUR',
  USD: 'USD',
  GBP: 'GBP',
  KSH: 'KSH',
  ZAR: 'ZAR'
};

const mockWalletAddress = '0xabcdef1234567890abcdef1234567890abcdef12';

export const createWallet = jest.fn().mockResolvedValue(mockWalletAddress);
export const importWalletFromPrivateKeyAndPassword = jest.fn().mockResolvedValue(mockWalletAddress);
export const verifyWalletPassword = jest.fn().mockResolvedValue(true);
export const getWalletKey = jest.fn().mockResolvedValue({ pubkey: '0xpubkey', privkey: '0xprivkey' });

export const getBalance = jest.fn().mockResolvedValue({
  ngnBalance: '5000',
  usdBalance: '12.50',
  toroGBalance: '200'
});

export const getCurrencyBalance = jest.fn().mockResolvedValue({ balance: '300', currency: 'TORO' });

export const depositFunds = jest.fn().mockResolvedValue({
  paymentlink: 'https://connectw.com/pay/test',
  amount: '1000',
  txid: 'TX12345'
});
export const verifyDeposit = jest.fn().mockResolvedValue(true);
export const getSupportedAssetsExchangeRates = jest.fn().mockResolvedValue({
  TORO: { USD: '0.05', NGN: '65' },
  USD: { TORO: '20', NGN: '1300' }
});
export const performKYCForCustomer = jest.fn().mockResolvedValue(true);
export const configureTNS = jest.fn().mockResolvedValue(undefined);
export const getBlockchainStatus = jest.fn().mockResolvedValue({ status: 'running', syncStatus: 'synced' });
export const getBlockById = jest.fn().mockResolvedValue({ blockId: '1000', hash: '0xblockhash' });
export const getTransaction = jest.fn().mockResolvedValue({ hash: '0xtxhash', status: 'confirmed' });
export const getReceipt = jest.fn().mockResolvedValue({ hash: '0xtxhash', status: 'success' });
export const initializeSDK = jest.fn();
export const getSDKConfig = jest.fn(() => ({
  getNetwork: () => 'testnet',
  getBaseURL: () => 'https://testnet.toronet.org/api',
  getConfig: () => ({ network: 'testnet', baseURL: 'https://testnet.toronet.org/api' })
}));
