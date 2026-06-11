const mockRequest = (): any => ({});
const mockResponse = (): any => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};
const mockNext = (): any => jest.fn();

import { errorHandler } from '../../src/middleware/errorHandler';

describe('errorHandler', () => {
  beforeEach(() => { process.env.NODE_ENV = 'development'; });

  it('returns 500 with error message in dev', () => {
    const req = mockRequest();
    const res = mockResponse();
    const next = mockNext();
    const err = new Error('Something broke');

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Something broke'
    }));
  });

  it('hides details in production', () => {
    process.env.NODE_ENV = 'production';
    const req = mockRequest();
    const res = mockResponse();
    const next = mockNext();
    const err = new Error('Something broke');

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'An unexpected error occurred'
    }));
  });

  it('returns 500 for non-Error throws', () => {
    const req = mockRequest();
    const res = mockResponse();
    const next = mockNext();

    errorHandler('string error' as unknown as Error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
