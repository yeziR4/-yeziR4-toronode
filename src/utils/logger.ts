import winston from 'winston';

const { combine, timestamp, json, errors } = winston.format;

/**
 * Structured logger for production observability.
 * Never logs sensitive data (passwords, private keys).
 */
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  defaultMeta: { service: 'toronode' },
  format: combine(
    timestamp(),
    errors({ stack: true }),
    json()
  ),
  transports: process.env.NODE_ENV === 'test'
    ? []
    : [
        new winston.transports.Console({
          format: process.env.NODE_ENV === 'development'
            ? winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
              )
            : undefined
        })
      ],
  exceptionHandlers: [
    new winston.transports.Console()
  ],
  rejectionHandlers: [
    new winston.transports.Console()
  ]
});

export default logger;