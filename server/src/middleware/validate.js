import { z } from 'zod';

/**
 * Express middleware to validate request bodies against a Zod schema
 */
export function validateBody(schema) {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
            details: error.errors,
          },
        });
      }
      next(error);
    }
  };
}

/**
 * Express middleware to validate request query parameters
 */
export function validateQuery(schema) {
  return (req, res, next) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
            details: error.errors,
          },
        });
      }
      next(error);
    }
  };
}

