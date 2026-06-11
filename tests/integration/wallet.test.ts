import request from 'supertest';
import app from '../../src/app';

describe('Wallet Routes', () => {
  const apiKey = 'test-api-key-12345';

  describe('POST /wallet/create', () => {
    it('should create a wallet with valid password', async () => {
      const response = await request(app)
        .post('/wallet/create')
        .send({ password: 'securePass123!' })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.address).toBeDefined();
      expect(typeof response.body.data.address).toBe('string');
    });

    it('should reject short passwords', async () => {
      const response = await request(app)
        .post('/wallet/create')
        .send({ password: 'short' })
        .expect(400);

      expect(response.body.error).toBe('SCHEMA_VALIDATION_ERROR');
    });

    it('should reject missing password', async () => {
      const response = await request(app)
        .post('/wallet/create')
        .send({})
        .expect(400);

      expect(response.body.error).toBe('SCHEMA_VALIDATION_ERROR');
    });
  });

  describe('POST /wallet/verify-password', () => {
    it('should verify password format', async () => {
      // Note: This requires a real wallet address on testnet
      // For integration testing, we test the route structure
      const response = await request(app)
        .post('/wallet/verify-password')
        .send({
          address: '0x1234567890123456789012345678901234567890',
          password: 'testPassword123'
        })
        .expect(200);

      // Result depends on actual testnet wallet
      expect(response.body.success).toBe(true);
      expect(typeof response.body.data.isValid).toBe('boolean');
    });
  });

  describe('POST /wallet/keys', () => {
    it('should reject without API key', async () => {
      const response = await request(app)
        .post('/wallet/keys')
        .send({ address: '0x1234567890123456789012345678901234567890' })
        .expect(401);

      expect(response.body.error).toBe('UNAUTHORIZED');
    });

    it('should accept with valid API key', async () => {
      const response = await request(app)
        .post('/wallet/keys')
        .set('X-API-Key', apiKey)
        .send({ address: '0x1234567890123456789012345678901234567890' })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });
});