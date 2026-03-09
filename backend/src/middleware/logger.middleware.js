// Logs every incoming request — method, path, time taken
// Helps debug: "which endpoint is slow?"

export const loggerMiddleware = (req, res, next) => {
  const start = Date.now();

  // When the response finishes, log the result
  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const color = status >= 500 ? '🔴' : status >= 400 ? '🟡' : '🟢';

    console.log(`${color} ${req.method} ${req.originalUrl} ${status} — ${duration}ms`);
  });

  next(); // Continue to the actual route
};