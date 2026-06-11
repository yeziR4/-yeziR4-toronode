import request from 'supertest';
import app from '../../src/app';

describe('Health Route', () => {
  it('should return healthy status', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe('healthy');
    expect(response.body.data.sdk).toHaveProperty('network');
    expect(response.body.data.sdk).toHaveProperty('baseURL');
  });
});