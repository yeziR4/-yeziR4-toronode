import { Router } from 'express';
import { z } from 'zod';
import { depositService } from '../services/deposit.service';
import { validateRequest } from '../middleware/validateRequest';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

const initDepositSchema = z.object({
  userAddress: z.string().min(1, 'User address is required'),
  username: z.string().min(1, 'Username is required'),
  amount: z.string().min(1, 'Amount is required'),
  currency: z.enum(['NGN', 'USD', 'EUR', 'GBP', 'KSH', 'ZAR'])
});

const verifyDepositSchema = z.object({
  currency: z.string().min(1, 'Currency is required'),
  txid: z.string().min(1, 'Transaction ID is required')
});

/**
 * POST /deposit/init
 * Initialize a fiat deposit.
 * Body: { userAddress, username, amount, currency }
 * 
 * ⚠️ Returns mock response if ConnectW is not configured.
 * Set ADMIN_WALLET_ADDRESS and ADMIN_WALLET_PASSWORD in .env for live mode.
 */
router.post(
  '/init',
  validateRequest(initDepositSchema),
  asyncHandler(async (req, res) => {
    const result = await depositService.init(req.body);
    res.status(201).json({
      success: true,
      data: result
    });
  })
);

/**
 * POST /deposit/verify
 * Verify a completed fiat deposit.
 * Body: { currency, txid }
 */
router.post(
  '/verify',
  validateRequest(verifyDepositSchema),
  asyncHandler(async (req, res) => {
    const success = await depositService.verify(req.body);
    res.status(200).json({
      success: true,
      data: { verified: success }
    });
  })
);

export default router;