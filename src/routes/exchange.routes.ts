import { Router } from 'express';
import { exchangeService } from '../services/exchange.service';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

/**
 * GET /exchange/rates
 * Get current exchange rates.
 */
router.get(
  '/rates',
  asyncHandler(async (req, res) => {
    const rates = await exchangeService.getRates();
    res.status(200).json({
      success: true,
      data: rates
    });
  })
);

export default router;