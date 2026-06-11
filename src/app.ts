import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import { initSDK } from './config/sdk';
import logger from './utils/logger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Route imports
import walletRoutes from './routes/wallet.routes';
import tnsRoutes from './routes/tns.routes';
import balanceRoutes from './routes/balance.routes';
import depositRoutes from './routes/deposit.routes';
import kycRoutes from './routes/kyc.routes';
import blockchainRoutes from './routes/blockchain.routes';
import exchangeRoutes from './routes/exchange.routes';
import healthRoutes from './routes/health.routes';

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['API_KEY'];
const missingVars = requiredEnvVars.filter(v => !process.env[v]);
if (missingVars.length > 0) {
  logger.error('Missing required environment variables', { missing: missingVars });
  process.exit(1);
}

// Initialize Toronet SDK
initSDK();

// Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'X-API-Key']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'RATE_LIMIT_EXCEEDED',
    message: 'Too many requests from this IP, please try again later.',
    timestamp: new Date().toISOString()
  }
});
app.use(limiter);

// Stricter rate limit for wallet creation (prevents abuse)
const walletLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: {
    error: 'WALLET_CREATION_LIMIT',
    message: 'Wallet creation limit exceeded. Try again later.',
    timestamp: new Date().toISOString()
  }
});

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Request logging
app.use((req, res, next) => {
  logger.info('Incoming request', {
    method: req.method,
    path: req.path,
    ip: req.ip
  });
  next();
});

// Routes
app.use('/health', healthRoutes);
app.use('/wallet', walletLimiter, walletRoutes);
app.use('/tns', tnsRoutes);
app.use('/balance', balanceRoutes);
app.use('/deposit', depositRoutes);
app.use('/kyc', kycRoutes);
app.use('/blockchain', blockchainRoutes);
app.use('/exchange', exchangeRoutes);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`ToroNode server running`, {
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    network: process.env.TORONET_NETWORK || 'testnet'
  });
});

export default app;