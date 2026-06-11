const mockInitializeSDK = jest.fn();
const mockGetSDKConfig = jest.fn(() => ({
  getNetwork: () => 'testnet',
  getBaseURL: () => 'https://testnet.toronet.org/api',
  getConfig: () => ({ network: 'testnet', baseURL: 'https://testnet.toronet.org/api' })
}));

jest.mock('torosdk', () => ({
  initializeSDK: mockInitializeSDK,
  getSDKConfig: mockGetSDKConfig
}));

import { initSDK, getCurrentConfig } from '../../src/config/sdk';

beforeEach(() => {
  jest.clearAllMocks();
  delete process.env.TORONET_NETWORK;
  delete process.env.TORONET_BASE_URL;
});

describe('SDK Config', () => {
  describe('initSDK', () => {
    it('initializes with testnet by default', () => {
      expect(() => initSDK()).not.toThrow();
      expect(mockInitializeSDK).toHaveBeenCalledWith({ network: 'testnet' });
    });

    it('uses TORONET_BASE_URL when provided', () => {
      process.env.TORONET_BASE_URL = 'https://custom.api';
      expect(() => initSDK()).not.toThrow();
      expect(mockInitializeSDK).toHaveBeenCalledWith({
        network: 'testnet',
        baseURL: 'https://custom.api'
      });
    });

    it('throws on invalid network', () => {
      process.env.TORONET_NETWORK = 'invalidnet';
      expect(() => initSDK()).toThrow('Invalid TORONET_NETWORK');
    });
  });

  describe('getCurrentConfig', () => {
    it('returns config object', () => {
      const config = getCurrentConfig();
      expect(config).toHaveProperty('network');
      expect(config).toHaveProperty('baseURL');
    });
  });
});
