import { performKYCForCustomer } from 'torosdk';
import logger from '../utils/logger';
import { KYCSubmitRequest } from '../types';

/**
 * KYC Service — wraps torosdk v4.2.0 KYC methods.
 * BVN-based identity verification for NGN transactions.
 */

export const kycService = {
  /**
   * Submit KYC verification for a customer.
   * Required for high-volume NGN/USD operations.
   * @param params — BVN, name, currency, phone
   */
  async submit(params: KYCSubmitRequest): Promise<void> {
    logger.info('Submitting KYC verification', {
      name: params.name,
      currency: params.currency
    });

    await performKYCForCustomer({
      bvn: params.bvn,
      name: params.name,
      currency: params.currency,
      phone: params.phone
    });

    logger.info('KYC submitted successfully', { name: params.name });
  }
};