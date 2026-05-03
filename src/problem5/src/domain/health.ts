export interface HealthReport {
  status: 'UP' | 'DOWN';
  service: string;
  database: 'connected' | 'error';
  timestamp: string;
  uptime: number;
}
