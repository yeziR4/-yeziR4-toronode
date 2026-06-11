import { Router } from 'express';
import { z } from 'zod';
import { balanceService } from '../services/balance.service';
import { validateRequest } from '../middleware/validateRequest';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

/**
 * GET /balance/:address
 * Get balance breakdown for a wallet address.
 */
router.get(
  '/:address',
  asyncHandler(async (req, res) => {
    const { address } = req.params;

    // Basic address validation
    if (!address || address.length < 10) {
      res.status(400).json({
        success: false,
        error: 'Invalid address format'
      });
      return;
    }

    const balances = await balanceService.getBalance(address);
    res.status(200).json({
      success: true,
      data: balances
    });
  })
);

export default router;