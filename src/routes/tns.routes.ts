import { Router } from 'express';
import { z } from 'zod';
import { tnsService } from '../services/tns.service';
import { validateRequest } from '../middleware/validateRequest';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

const registerTNSSchema = z.object({
  address: z.string().min(1, 'Address is required'),
  password: z.string().min(1, 'Password is required'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(50)
});

/**
 * POST /tns/register
 * Register a TNS name for a wallet.
 * Body: { address: string, password: string, username: string }
 */
router.post(
  '/register',
  validateRequest(registerTNSSchema),
  asyncHandler(async (req, res) => {
    await tnsService.register(req.body);
    res.status(201).json({
      success: true,
      message: `TNS name '${req.body.username}' registered successfully`
    });
  })
);

export default router;