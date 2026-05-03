import type { HealthReport } from '../domain/health';
import { getDatabaseStatus } from '../infrastructure/repositories/health.repository';

export async function checkHealth(): Promise<{
  statusCode: number;
  body: HealthReport;
}> {
  const database = await getDatabaseStatus();
  const status = database === 'connected' ? 'UP' : 'DOWN';

  return {
    statusCode: status === 'UP' ? 200 : 503,
    body: {
      status,
      service: 'crude-server',
      database,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
  };
}
