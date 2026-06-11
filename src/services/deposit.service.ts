import { depositFunds, verifyDeposit, Currency } from 'torosdk';
import logger from '../utils/logger';
import {
  DepositInitRequest,
  DepositInitResponse,
  DepositVerifyRequest
} from '../types';

/**
 * Fiat Deposit Service — wraps torosdk v4.2.0 deposit methods.
 * 
 * ⚠️ IMPORTANT: Live fiat deposits require ConnectW project registration.
 * If ADMIN_WALLET_ADDRESS and ADMIN_WALLET_PASSWORD are not configured,
 * endpoints return mock responses with clear documentation.
 * 
 * Register at: https://payments.connectw.com
 */

const isDepositConfigured = (): boolean => {
  return !!(
    process.env.ADMIN_WALLET_ADDRESS && 
    process.env.ADMIN_WALLET_PASSWORD
  );
};

export const depositService = {
  /**
   * Initialize a fiat deposit for a user.
   * Requires ConnectW admin credentials in environment.
   */
  async init(params: DepositInitRequest): Promise<DepositInitResponse> {
    logger.info('Initializing deposit', {
      userAddress: params.userAddress,
      amount: params.amount,
      currency: params.currency
    });

    // If ConnectW not configured, return mock response for demonstration
    if (!isDepositConfigured()) {
      logger.warn('ConnectW not configured — returning mock deposit response');
      return {
        paymentlink: 'https://connectw.com/pay/demo-link',
        accountnumber: '2039932299',
        bankname: 'DemoBank',
        amount: params.amount,
        txid: `TX${Date.now()}-TORO`,
        note: 'MOCK RESPONSE: Configure ADMIN_WALLET_ADDRESS and ADMIN_WALLET_PASSWORD in .env for live deposits. Register at https://payments.connectw.com'
      };
    }

    const depositInfo = await depositFunds({
      userAddress: params.userAddress,
      username: params.username,
      amount: params.amount,
      currency: Currency[params.currency as keyof typeof Currency],
      admin: process.env.ADMIN_WALLET_ADDRESS!,
      adminpwd: process.env.ADMIN_WALLET_PASSWORD!
    });

    logger.info('Deposit initialized', { txid: depositInfo.txid });
    return depositInfo;
  },

  /**
   * Verify a completed fiat deposit.
   */
  async verify(params: DepositVerifyRequest): Promise<boolean> {
    logger.info('Verifying deposit', { txid: params.txid });

    if (!isDepositConfigured()) {
      logger.warn('ConnectW not configured — returning mock verification');
      return true;
    }

    const success = await verifyDeposit({
      currency: params.currency,
      txid: params.txid
    });

    logger.info('Deposit verification result', { txid: params.txid, success });
    return success;
  }
};