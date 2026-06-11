import { getSupportedAssetsExchangeRates } from 'torosdk';
import logger from '../utils/logger';
import { ExchangeRatesResponse } from '../types';

/**
 * Exchange Rate Service — wraps torosdk v4.2.0 query methods.
 * Provides live FX rates for supported currencies.
 */

export const exchangeService = {
  /**
   * Get current exchange rates from Toronet.
   */
  async getRates(): Promise<ExchangeRatesResponse> {
    logger.info('Fetching exchange rates');

    const rates = await getSupportedAssetsExchangeRates();

    logger.info('Exchange rates retrieved');
    return rates as ExchangeRatesResponse;
  }
};