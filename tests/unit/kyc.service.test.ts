const mockPerformKYC = jest.fn().mockResolvedValue(true);

jest.mock('torosdk', () => ({ performKYCForCustomer: mockPerformKYC }));

import { kycService } from '../../src/services/kyc.service';

beforeEach(() => {
  jest.clearAllMocks();
  process.env.ADMIN_WALLET_ADDRESS = '0xadmin';
  process.env.ADMIN_WALLET_PASSWORD = 'adminpw';
});

describe('KYCService', () => {
  it('submits KYC with correct params', async () => {
    await kycService.submit({
      bvn: '12345678901', name: 'Alice Smith', currency: 'NGN', phone: '+2348012345678'
    });
    expect(mockPerformKYC).toHaveBeenCalledWith(
      expect.objectContaining({
        bvn: '12345678901',
        firstName: 'Alice Smith',
        currency: 'NGN',
        phoneNumber: '+2348012345678'
      })
    );
  });

  it('forwards SDK errors', async () => {
    mockPerformKYC.mockRejectedValueOnce(new Error('KYC failed'));
    await expect(
      kycService.submit({ bvn: '12345678901', name: 'A', currency: 'NGN', phone: '+234' })
    ).rejects.toThrow('KYC failed');
  });
});
