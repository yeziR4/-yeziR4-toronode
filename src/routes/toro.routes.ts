import { Router } from 'express';
import { z } from 'zod';
import { toroService } from '../services/toro.service';
import { validateRequest } from '../middleware/validateRequest';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

const transferSchema = z.object({
  senderAddr: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid sender address (must be 0x-hex, 42 chars)'),
  senderPwd: z.string().min(1, 'Sender password is required'),
  receiverAddr: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid receiver address (must be 0x-hex, 42 chars)'),
  amount: z.string().regex(/^\d+(\.\d+)?$/, 'Amount must be a positive number')
});

router.get(
  '/balance/:address',
  asyncHandler(async (req, res) => {
    const { address } = req.params;
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      res.status(400).json({ success: false, error: 'Invalid address format' });
      return;
    }
    const result = await toroService.getBalance(address);
    res.status(200).json({ success: true, data: result });
  })
);

router.post(
  '/transfer',
  validateRequest(transferSchema),
  asyncHandler(async (req, res) => {
    const result = await toroService.transfer(req.body);
    res.status(200).json({ success: true, data: result });
  })
);

export default router;
