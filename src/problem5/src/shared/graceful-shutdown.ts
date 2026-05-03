import type { Server } from 'node:http';

import logger from '../config/logger';

export type CleanupTask = () => Promise<void>;

export function setupGracefulShutdown(
  server: Server,
  cleanupTasks: CleanupTask[],
): void {
  let isShuttingDown = false;

  const shutdown = (signal: string) => {
    if (isShuttingDown) {
      return;
    }

    isShuttingDown = true;
    logger.info(`Received ${signal}. Shutting down gracefully...`);

    server.close(async (closeError) => {
      if (closeError) {
        logger.error('Failed to close the HTTP server', { closeError });
        process.exit(1);
      }

      const cleanupResults = await Promise.allSettled(
        cleanupTasks.map((cleanupTask) => cleanupTask()),
      );
      const failedCleanup = cleanupResults.find(
        (cleanupResult) => cleanupResult.status === 'rejected',
      );

      if (failedCleanup) {
        logger.error('Shutdown finished with cleanup errors', { cleanupResults });
        process.exit(1);
      }

      logger.info('Graceful shutdown fully completed.');
      process.exit(0);
    });
  };

  process.once('SIGINT', () => shutdown('SIGINT'));
  process.once('SIGTERM', () => shutdown('SIGTERM'));
}
