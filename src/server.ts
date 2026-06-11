import app from './app';
import logger from './utils/logger';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`ToroNode server running`, {
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    network: process.env.TORONET_NETWORK || 'testnet'
  });
});
