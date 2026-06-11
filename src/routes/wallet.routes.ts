import { Router } from 'express';
import { z } from 'zod';
import { walletService } from '../services/wallet.service';
import { validateRequest } from '../middleware/validateRequest';
import { requireApiKey } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

const createWalletSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters')
});

const importWalletSchema = z.object({
  privateKey: z.string().min(1, 'Private key is required'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

const verifyPasswordSchema = z.object({
  address: z.string().min(1, 'Address is required'),
  password: z.string().min(1, 'Password is required')
});

const getKeySchema = z.object({
  address: z.string().min(1, 'Address is required')
});

/**
 * POST /wallet/create
 * Create a new Toronet wallet.
 * Body: { password: string }
 */
router.post(
  '/create',
  validateRequest(createWalletSchema),
  asyncHandler(async (req, res) => {
    const result = await walletService.create(req.body);
    res.status(201).json({
      success: true,
      data: result
    });
  })
);

/**
 * POST /wallet/import
 * Import wallet from private key.
 * Body: { privateKey: string, password: string }
 */
router.post(
  '/import',
  validateRequest(importWalletSchema),
  asyncHandler(async (req, res) => {
    const result = await walletService.import(req.body);
    res.status(200).json({
      success: true,
      data: result
    });
  })
);

/**
 * POST /wallet/verify-password
 * Verify wallet password.
 * Body: { address: string, password: string }
 */
router.post(
  '/verify-password',
  validateRequest(verifyPasswordSchema),
  asyncHandler(async (req, res) => {
    const isValid = await walletService.verifyPassword(req.body);
    res.status(200).json({
      success: true,
      data: { isValid }
    });
  })
);

/**
 * POST /wallet/keys
 * Retrieve wallet keys (ADMIN ONLY).
 * Requires X-API-Key header.
 * Body: { address: string }
 */
router.post(
  '/keys',
  requireApiKey,
  validateRequest(getKeySchema),
  asyncHandler(async (req, res) => {
    const result = await walletService.getKeys(req.body);
    res.status(200).json({
      success: true,
      data: result
    });
  })
);

export default router;