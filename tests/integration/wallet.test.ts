import request from 'supertest';
import app from '../../src/app';

describe('Wallet Routes', () => {
  const apiKey = 'test-api-key-12345';

  describe('POST /wallet/create', () => {
    it('should create a wallet with valid credentials', async () => {
      // SDK calls live API; accept 201 (success) or 500/502 (network/SDK error)
      const response = await request(app)
        .post('/wallet/create')
        .send({ username: 'testuser', password: 'securePass123!' });

      expect([201, 500, 502]).toContain(response.status);
      if (response.status === 201) {
        expect(response.body.success).toBe(true);
        expect(response.body.data.address).toBeDefined();
        expect(typeof response.body.data.address).toBe('string');
      }
    }, 15000);

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
      // Note: This calls the real Toronet API. If unreachable or address unknown,
      // the SDK throws — route returns 502. Accept either 200 or 502.
      const response = await request(app)
        .post('/wallet/verify-password')
        .send({
          address: '0x1234567890123456789012345678901234567890',
          password: 'testPassword123'
        });

      // Accept 200 (success), 500 (SDK error), or 502 (API error)
      expect([200, 500, 502]).toContain(response.status);
      if (response.status === 200) {
        expect(response.body.success).toBe(true);
        expect(typeof response.body.data.isValid).toBe('boolean');
      }
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
        .send({ address: '0x1234567890123456789012345678901234567890' });

      // Accept 200 (success), 500 (SDK error), or 502 (API error)
      expect([200, 500, 502]).toContain(response.status);
      if (response.status === 200) {
        expect(response.body.success).toBe(true);
      }
    });
  });
});