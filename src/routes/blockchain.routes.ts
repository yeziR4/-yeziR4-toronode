import { Router } from 'express';
import { blockchainService } from '../services/blockchain.service';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

/**
 * GET /blockchain/status
 * Get blockchain health and sync status.
 */
router.get(
  '/status',
  asyncHandler(async (req, res) => {
    const status = await blockchainService.getStatus();
    res.status(200).json({
      success: true,
      data: status
    });
  })
);

/**
 * GET /blockchain/block/:blockId
 * Get block details by ID.
 */
router.get(
  '/block/:blockId',
  asyncHandler(async (req, res) => {
    const { blockId } = req.params;
    const block = await blockchainService.getBlock(blockId);
    res.status(200).json({
      success: true,
      data: block
    });
  })
);

/**
 * GET /blockchain/transaction/:hash
 * Get transaction details by hash.
 */
router.get(
  '/transaction/:hash',
  asyncHandler(async (req, res) => {
    const { hash } = req.params;
    const tx = await blockchainService.getTransaction(hash);
    res.status(200).json({
      success: true,
      data: tx
    });
  })
);

/**
 * GET /blockchain/transaction/:hash/receipt
 * Get transaction receipt by hash.
 */
router.get(
  '/transaction/:hash/receipt',
  asyncHandler(async (req, res) => {
    const { hash } = req.params;
    const receipt = await blockchainService.getReceipt(hash);
    res.status(200).json({
      success: true,
      data: receipt
    });
  })
);

export default router;