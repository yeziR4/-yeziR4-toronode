import { getBalance } from 'torosdk';
import logger from '../utils/logger';
import { BalanceResponse } from '../types';

/**
 * Balance Service — wraps torosdk v4.2.0 balance methods.
 * Returns normalized string balances for NGN, USD, and ToroG.
 */

export const balanceService = {
  /**
   * Get full balance breakdown for a wallet address.
   * @param address — Toronet wallet address
   * @returns balances for NGN, USD, and ToroG
   */
  async getBalance(address: string): Promise<BalanceResponse> {
    logger.info('Fetching balance', { address });

    const balances = await getBalance({ address });

    logger.info('Balance retrieved', { 
      address,
      ngn: balances.ngnBalance,
      usd: balances.usdBalance,
      toroG: balances.toroGBalance
    });

    return balances;
  }
};