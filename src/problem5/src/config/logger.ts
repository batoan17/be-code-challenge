import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  defaultMeta: {
    service: 'crude-server',
  },
  transports: [
    new winston.transports.Console({
      format:
        process.env.NODE_ENV === 'production'
          ? winston.format.combine(
              winston.format.timestamp(),
              winston.format.json(),
            )
          : winston.format.combine(
              winston.format.colorize(),
              winston.format.simple(),
            ),
    }),
  ],
});

export default logger;
