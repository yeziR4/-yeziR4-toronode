import { configureTNS } from 'torosdk';
import logger from '../utils/logger';
import { TNSRegisterRequest } from '../types';

/**
 * TNS (Toronet Naming System) Service.
 * Maps human-readable names to wallet addresses.
 */

export const tnsService = {
  /**
   * Register a TNS name for a wallet address.
   * @param params — address, password, and desired username
   */
  async register(params: TNSRegisterRequest): Promise<void> {
    logger.info('Registering TNS name', { 
      address: params.address, 
      username: params.username 
    });

    await configureTNS({
      address: params.address,
      password: params.password,
      username: params.username
    });

    logger.info('TNS name registered successfully', { 
      username: params.username 
    });
  }
};