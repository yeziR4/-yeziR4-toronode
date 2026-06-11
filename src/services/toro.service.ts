import axios from 'axios';
import { getCurrencyBalance } from 'torosdk';
import logger from '../utils/logger';
import { ToroBalanceResponse, ToroTransferRequest, ToroTransferResponse } from '../types';

function getBaseURL(): string {
  return process.env.TORONET_BASE_URL || 'https://testnet.toronet.org/api';
}

export const toroService = {
  async getBalance(address: string): Promise<ToroBalanceResponse> {
    logger.info('Fetching TORO balance', { address });

    try {
      const result = await getCurrencyBalance({ currency: 'TORO', address });
      const balance = typeof result === 'object' && result !== null
        ? String(result.balance ?? result.toroBalance ?? result.amount ?? '0')
        : String(result ?? '0');

      return { success: true, address, balance };
    } catch (err: unknown) {
      logger.warn('getCurrencyBalance failed, trying direct API', { err: String(err) });

      const response = await axios.post(getBaseURL() + '/token/toro/cl', {
        op: 'balance',
        params: [{ name: 'client', value: address }]
      });

      const data = response.data;
      let balance = '0';
      if (data && typeof data === 'object') {
        balance = String(data.balance ?? data.amount ?? data.toroBalance ?? '0');
      }

      return { success: true, address, balance };
    }
  },

  async transfer(params: ToroTransferRequest): Promise<ToroTransferResponse> {
    logger.info('Initiating TORO transfer', {
      sender: params.senderAddr,
      receiver: params.receiverAddr,
      amount: params.amount
    });

    const response = await axios.post(getBaseURL() + '/token/toro/cl', {
      op: 'transfer',
      params: [
        { name: 'client', value: params.senderAddr },
        { name: 'clientpwd', value: params.senderPwd },
        { name: 'to', value: params.receiverAddr },
        { name: 'val', value: params.amount }
      ]
    });

    if (!response.data || typeof response.data !== 'object') {
      throw new Error('Malformed response from Toronet API');
    }

    if (response.data.result === false) {
      throw new Error(response.data.error ?? 'TORO transfer failed');
    }

    const result: ToroTransferResponse = {
      success: true,
      sender: params.senderAddr,
      receiver: params.receiverAddr,
      amount: params.amount,
      txHash: response.data.txHash ?? response.data.txid
    };

    logger.info('TORO transfer completed', { txHash: result.txHash });
    return result;
  }
};
