import rateLimit from 'express-rate-limit';

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 300 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests from this address. Please try again after a few minutes.',
    },
  },
});

export const orderLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 15, // limit order creations to 15 per 10 minutes
  message: {
    success: false,
    error: {
      code: 'ORDER_RATE_LIMIT',
      message: 'Too many order attempts. Please wait a few moments before trying again.',
    },
  },
});

export const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    error: {
      code: 'FORM_RATE_LIMIT',
      message: 'Too many submissions. Please wait a few minutes before submitting again.',
    },
  },
});

