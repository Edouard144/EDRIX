// All fixed values in one place
// Change here = changes everywhere
export const CONSTANTS = {
  // Bcrypt hashing strength (12 = secure but not too slow)
  SALT_ROUNDS: 12,

  // Max login attempts before lockout
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION_MINUTES: 15,

  // API rate limiting
  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: 100,

  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
};