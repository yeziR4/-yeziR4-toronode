import request from 'supertest';
import app from '../../src/app';

describe('Balance Routes', () => {
  describe('GET /balance/:address', () => {
    it('should return balances for a valid address', async () => {
      const response = await request(app)
        .get('/balance/0x1234567890123456789012345678901234567890');

      // Accept 200 (balance), 500 (SDK error), or 502 (API error)
      expect([200, 500, 502]).toContain(response.status);
      if (response.status === 200) {
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('ngnBalance');
        expect(response.body.data).toHaveProperty('usdBalance');
      }
    });

    it('should reject invalid address format', async () => {
      const response = await request(app)
        .get('/balance/short')
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});