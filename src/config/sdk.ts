import { initializeSDK, getSDKConfig } from 'torosdk';
import logger from '../utils/logger';

/**
 * Initialize the Toronet SDK with environment configuration.
 * Must be called before any service methods are used.
 *
 * Default SDK base URLs are wrong (testnet → http://testnet.toronet.org = 404).
 * Override via TORONET_BASE_URL env var (e.g. https://testnet.toronet.org/api).
 */
export const initSDK = (): void => {
  const network = process.env.TORONET_NETWORK || 'testnet';

  if (!['mainnet', 'testnet'].includes(network)) {
    throw new Error(`Invalid TORONET_NETWORK: ${network}. Must be 'mainnet' or 'testnet'`);
  }

  const options: Record<string, string> = { network: network as 'mainnet' | 'testnet' };
  if (process.env.TORONET_BASE_URL) options.baseURL = process.env.TORONET_BASE_URL;

  initializeSDK(options);

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