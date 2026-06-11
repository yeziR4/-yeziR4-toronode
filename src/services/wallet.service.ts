import {
  createWallet,
  importWalletFromPrivateKeyAndPassword,
  verifyWalletPassword,
  getWalletKey
} from 'torosdk';
import logger from '../utils/logger';
import {
  WalletCreateRequest,
  WalletCreateResponse,
  WalletImportRequest,
  WalletVerifyRequest,
  WalletKeyRequest,
  WalletKeyResponse
} from '../types';

/**
 * Wallet Service — wraps torosdk v4.2.0 wallet methods.
 * All methods return typed promises for consistent error handling.
 */

export const walletService = {
  /**
   * Create a new Toronet wallet.
   * @param params — username and password for the new wallet
   * @returns wallet address
   */
  async create(params: WalletCreateRequest): Promise<WalletCreateResponse> {
    logger.info('Creating new wallet');

    const address = await createWallet({
      username: params.username,
      password: params.password
    });

    logger.info('Wallet created successfully', { address });
    return { address };
  },

  /**
   * Import an existing wallet using private key.
   * @param params — privateKey and new password
   * @returns imported wallet address
   */
  async import(params: WalletImportRequest): Promise<WalletCreateResponse> {
    logger.info('Importing wallet from private key');

    const address = await importWalletFromPrivateKeyAndPassword({
      pvKey: params.privateKey,
      password: params.password
    });

    logger.info('Wallet imported successfully', { address });
    return { address };
  },

  /**
   * Verify if a password is valid for a given wallet address.
   * @param params — address and password to verify
   * @returns boolean indicating validity
   */
  async verifyPassword(params: WalletVerifyRequest): Promise<boolean> {
    logger.info('Verifying wallet password', { address: params.address });

    const result = await verifyWalletPassword({
      address: params.address,
      password: params.password
    });

    const isValid = Boolean(result);
    logger.info('Password verification result', { 
      address: params.address, 
      isValid 
    });
    return isValid;
  },

  /**
   * Retrieve wallet public and private keys.
   * ⚠️ ADMIN ONLY — requires API key authentication.
   * Never expose this endpoint without auth middleware.
   */
  async getKeys(params: WalletKeyRequest): Promise<WalletKeyResponse> {
    logger.info('Retrieving wallet keys', { address: params.address });

    const keyInfo = await getWalletKey({
      address: params.address
    });

    logger.warn('Wallet keys accessed', { address: params.address });
    return keyInfo;
  }
};