import { writeLog } from '../modules/logs/logs.queries.js';

export const loggerMiddleware = (req, res, next) => {
  const start = Date.now();

  res.on('finish', async () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const color = status >= 500 ? '🔴' : status >= 400 ? '🟡' : '🟢';

    // Console log as before
    console.log(`${color} ${req.method} ${req.originalUrl} ${status} — ${duration}ms`);

    // Write to database if org is known (authenticated requests)
    const orgId = req.params?.orgId || req.apiKey?.org_id;
    if (orgId) {
      try {
        await writeLog({
          org_id: orgId,
          level: status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info',
          message: `${req.method} ${req.originalUrl} ${status}`,
          metadata: { duration_ms: duration, ip: req.ip, status },
          source: 'api',
        });
      } catch (_) {
        // Never let logging crash the app
      }
    }
  });

  next();
};