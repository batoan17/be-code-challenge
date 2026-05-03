import { createApp } from './app';
import { env } from './config/env';
import logger from './config/logger';
import prisma from './infrastructure/prisma/prisma';
import { setupGracefulShutdown, type CleanupTask } from './shared/graceful-shutdown';

async function bootstrap(): Promise<void> {
  const app = await createApp();
  const server = app.listen(env.PORT, () => {
    logger.info(`Node.js server listening on port ${env.PORT}`);
  });
  const cleanupTasks: CleanupTask[] = [
    async () => prisma.$disconnect(),
  ];

  setupGracefulShutdown(server, cleanupTasks);
}

void bootstrap();
