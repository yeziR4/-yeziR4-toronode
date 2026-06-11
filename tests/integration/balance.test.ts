import request from 'supertest';
import app from '../../src/app';

describe('Balance Routes', () => {
  describe('GET /balance/:address', () => {
    it('should return balances for a valid address', async () => {
      // Using a testnet address format
      const response = await request(app)
        .get('/balance/0x1234567890123456789012345678901234567890')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('ngnBalance');
      expect(response.body.data).toHaveProperty('usdBalance');
      expect(response.body.data).toHaveProperty('toroGBalance');
    });

    it('should reject invalid address format', async () => {
      const response = await request(app)
        .get('/balance/short')
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});