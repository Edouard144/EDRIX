// This catches ANY error thrown anywhere in the app
// Without this, one crash = server dies

export const errorMiddleware = (err, req, res, next) => {
  console.error('🔴 Error:', err.message);

  // Joi validation errors
  if (err.isJoi) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: err.details.map((d) => d.message),
    });
  }

  // PostgreSQL unique constraint (duplicate email, etc.)
  if (err.code === '23505') {
    return res.status(409).json({
      success: false,
      message: 'Already exists',
    });
  }

  // Default: 500 Internal Server Error
  return res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
};