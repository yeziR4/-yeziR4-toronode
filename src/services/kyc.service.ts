import { performKYCForCustomer } from 'torosdk';
import logger from '../utils/logger';
import { KYCSubmitRequest } from '../types';

/**
 * KYC Service — wraps torosdk KYC methods.
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
      firstName: params.name,
      middleName: '',
      lastName: '',
      bvn: params.bvn,
      currency: params.currency,
      phoneNumber: params.phone,
      dob: '',
      address: '',
      admin: process.env.ADMIN_WALLET_ADDRESS || '',
      adminpwd: process.env.ADMIN_WALLET_PASSWORD || ''
    });

    logger.info('KYC submitted successfully', { name: params.name });
  }
};