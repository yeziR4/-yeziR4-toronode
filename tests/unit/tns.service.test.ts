const mockConfigureTNS = jest.fn().mockResolvedValue(undefined);

jest.mock('torosdk', () => ({ configureTNS: mockConfigureTNS }));

import { tnsService } from '../../src/services/tns.service';

beforeEach(() => { jest.clearAllMocks(); });

describe('TNSService', () => {
  it('registers a TNS name', async () => {
    await tnsService.register({ address: '0xaddr', password: 'pw', username: 'alice' });
    expect(mockConfigureTNS).toHaveBeenCalledWith({
      address: '0xaddr', password: 'pw', username: 'alice'
    });
  });

  it('forwards SDK errors', async () => {
    mockConfigureTNS.mockRejectedValueOnce(new Error('name taken'));
    await expect(
      tnsService.register({ address: '0xaddr', password: 'pw', username: 'alice' })
    ).rejects.toThrow('name taken');
  });
});
