import crypto from 'crypto';

// Sign the payload with HMAC-SHA256
// The receiver can verify this to confirm the request came from EDRIX
export const signPayload = (payload, secret) => {
  const body = JSON.stringify(payload);
  return crypto.createHmac('sha256', secret).update(body).digest('hex');
};

// Calculate next retry time using exponential backoff
// attempt 1 → 30s, attempt 2 → 2min, attempt 3 → 10min, attempt 4 → 1hr
export const getNextRetryAt = (attempts) => {
  const delays = [30, 120, 600, 3600]; // seconds
  const delay = delays[attempts] || delays[delays.length - 1];
  return new Date(Date.now() + delay * 1000);
};