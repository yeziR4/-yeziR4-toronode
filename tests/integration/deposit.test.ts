import request from 'supertest';
import app from '../../src/app';

describe('Deposit Routes', () => {
  describe('POST /deposit/init', () => {
    it('should initialize deposit with valid params', async () => {
      const response = await request(app)
        .post('/deposit/init')
        .send({
          userAddress: '0x1234567890123456789012345678901234567890',
          username: 'testuser',
          amount: '1000',
          currency: 'NGN'
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('txid');
      expect(response.body.data).toHaveProperty('amount');

      // Should include mock note when ConnectW not configured
      expect(response.body.data.note).toContain('MOCK RESPONSE');
    });

    it('should reject invalid currency', async () => {
      const response = await request(app)
        .post('/deposit/init')
        .send({
          userAddress: '0x1234567890123456789012345678901234567890',
          username: 'testuser',
          amount: '1000',
          currency: 'INVALID'
        })
        .expect(400);

      expect(response.body.error).toBe('SCHEMA_VALIDATION_ERROR');
    });
  });

  describe('POST /deposit/verify', () => {
    it('should verify deposit with valid params', async () => {
      const response = await request(app)
        .post('/deposit/verify')
        .send({
          currency: 'NGN',
          txid: 'TX12345-TORO'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.verified).toBe(true);
    });
  });
});