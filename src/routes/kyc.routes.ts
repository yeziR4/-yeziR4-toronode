import { Router } from 'express';
import { z } from 'zod';
import { kycService } from '../services/kyc.service';
import { validateRequest } from '../middleware/validateRequest';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

const kycSchema = z.object({
  bvn: z.string().length(11, 'BVN must be 11 digits'),
  name: z.string().min(2, 'Name is required'),
  currency: z.string().min(1, 'Currency is required'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits')
});

/**
 * POST /kyc/submit
 * Submit KYC verification.
 * Body: { bvn, name, currency, phone }
 */
router.post(
  '/submit',
  validateRequest(kycSchema),
  asyncHandler(async (req, res) => {
    await kycService.submit(req.body);
    res.status(201).json({
      success: true,
      message: 'KYC verification submitted successfully'
    });
  })
);

export default router;