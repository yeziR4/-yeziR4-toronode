import { initializeSDK, getSDKConfig } from 'torosdk';
import logger from '../utils/logger';

/**
 * Initialize the Toronet SDK with environment configuration.
 * Must be called before any service methods are used.
 * 
 * Tested against: torosdk v4.2.0
 */
export const initSDK = (): void => {
  const network = process.env.TORONET_NETWORK || 'testnet';

  if (!['mainnet', 'testnet'].includes(network)) {
    throw new Error(`Invalid TORONET_NETWORK: ${network}. Must be 'mainnet' or 'testnet'`);
  }

  initializeSDK({ network: network as 'mainnet' | 'testnet' });

  const config = getSDKConfig();
  logger.info(`ToroNet SDK initialized`, {
    network: config.getNetwork(),
    baseURL: config.getBaseURL()
  });
};

/**
 * Get current SDK configuration for health checks.
 */
export const getCurrentConfig = () => {
  const config = getSDKConfig();
  return {
    network: config.getNetwork(),
    baseURL: config.getBaseURL()
  };
};