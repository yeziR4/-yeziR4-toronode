/**
 * Jest test setup.
 * Initializes environment for integration tests.
 */

// Suppress console.error during tests (expected error paths are intentional)
jest.spyOn(console, 'error').mockImplementation(jest.fn());

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.PORT = '3999';
process.env.TORONET_NETWORK = 'testnet';
process.env.TORONET_BASE_URL = 'https://testnet.toronet.org/api';
process.env.API_KEY = 'test-api-key-12345';
process.env.LOG_LEVEL = 'error';