import { Router } from 'express';
import { getCurrentConfig } from '../config/sdk';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

/**
 * GET /health
 * Health check endpoint.
 * Returns SDK configuration and server status.
 */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const config = getCurrentConfig();
    res.status(200).json({
      success: true,
      data: {
        status: 'healthy',
        sdk: config,
        timestamp: new Date().toISOString()
      }
    });
  })
);

export default router;