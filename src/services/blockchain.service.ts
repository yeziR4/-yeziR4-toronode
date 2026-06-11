import {
  getBlockchainStatus,
  getBlock,
  getTransaction,
  getReceipt
} from 'torosdk';
import logger from '../utils/logger';
import {
  BlockchainStatusResponse,
  BlockResponse,
  TransactionResponse,
  TransactionReceiptResponse
} from '../types';

/**
 * Blockchain Query Service — wraps torosdk v4.2.0 query methods.
 * Read-only operations for chain exploration and monitoring.
 */

export const blockchainService = {
  /**
   * Get current blockchain health and sync status.
   */
  async getStatus(): Promise<BlockchainStatusResponse> {
    logger.info('Fetching blockchain status');

    const status = await getBlockchainStatus();

    logger.info('Blockchain status retrieved');
    return status as BlockchainStatusResponse;
  },

  /**
   * Get block details by ID.
   * @param blockId — block identifier
   */
  async getBlock(blockId: string): Promise<BlockResponse> {
    logger.info('Fetching block', { blockId });

    const block = await getBlock({ blockId });

    logger.info('Block retrieved', { blockId });
    return block as BlockResponse;
  },

  /**
   * Get transaction details by hash.
   * @param hash — transaction hash
   */
  async getTransaction(hash: string): Promise<TransactionResponse> {
    logger.info('Fetching transaction', { hash });

    const tx = await getTransaction({ hash });

    logger.info('Transaction retrieved', { hash });
    return tx as TransactionResponse;
  },

  /**
   * Get transaction receipt by hash.
   * @param hash — transaction hash
   */
  async getReceipt(hash: string): Promise<TransactionReceiptResponse> {
    logger.info('Fetching receipt', { hash });

    const receipt = await getReceipt({ hash });

    logger.info('Receipt retrieved', { hash });
    return receipt as TransactionReceiptResponse;
  }
};