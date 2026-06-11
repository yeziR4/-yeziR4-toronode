import { Request, Response, NextFunction } from 'express';
import { requireApiKey } from '../../src/middleware/auth';

function mockReqRes() {
  const req = { headers: {}, path: '/test', ip: '127.0.0.1' } as unknown as Request;
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
  const next = jest.fn() as NextFunction;
  return { req, res, next };
}

beforeEach(() => {
  delete process.env.API_KEY;
});

describe('Auth middleware (requireApiKey)', () => {
  it('returns 401 when no API key provided', () => {
    process.env.API_KEY = 'secret123';
    const { req, res, next } = mockReqRes();
    requireApiKey(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when wrong API key provided', () => {
    process.env.API_KEY = 'secret123';
    const { req, res, next } = mockReqRes();
    req.headers['x-api-key'] = 'wrong-key';
    requireApiKey(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('calls next when valid API key provided', () => {
    process.env.API_KEY = 'secret123';
    const { req, res, next } = mockReqRes();
    req.headers['x-api-key'] = 'secret123';
    requireApiKey(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('returns 500 when API_KEY not configured', () => {
    const { req, res, next } = mockReqRes();
    req.headers['x-api-key'] = 'anything';
    requireApiKey(req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'CONFIGURATION_ERROR' })
    );
  });
});
