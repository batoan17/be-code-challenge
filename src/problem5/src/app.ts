import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';

import { env } from './config/env';
import logger from './config/logger';
import { docsRouter, healthRouter, userRouter } from './interfaces/index';
import { errorMiddleware } from './shared/error-middleware';

export async function createApp() {
  const app = express();

  app.use(helmet());
  app.use(hpp());
  app.use(
    cors({
      origin:
        env.CORS_ORIGIN === '*'
          ? true
          : env.CORS_ORIGIN.split(',').map((origin) => origin.trim()),
      credentials: true,
    }),
  );
  app.use(
    rateLimit({
      windowMs: 10 * 60 * 1000,
      max: 100,
    }),
  );
  app.use(express.json());
  app.use(
    morgan('combined', {
      stream: {
        write: (message) => logger.info(message.trim()),
      },
    }),
  );

  app.use('/docs', docsRouter);
  app.use('/health', healthRouter);
  app.use('/users', userRouter);

  app.use(errorMiddleware);

  return app;
}
