/**
 * Jest test setup.
 * Initializes environment for integration tests.
 */

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.PORT = '3999';
process.env.TORONET_NETWORK = 'testnet';
process.env.API_KEY = 'test-api-key-12345';
process.env.LOG_LEVEL = 'error';