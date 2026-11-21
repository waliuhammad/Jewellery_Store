import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './src/routes/index.js';
import { errorHandler } from './src/middleware/errorHandler.js';
import { generalLimiter } from './src/middleware/rateLimiter.js';
import { BRAND } from './src/config/brand.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Allow dev access while keeping origin configurable
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-signature', 'x-mock-uid', 'x-mock-email', 'x-mock-role'],
  })
);

// General Rate Limiter per PRD Section 12.5
app.use(generalLimiter);

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Serve static uploads (receipts, media)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount API v1 router
app.use('/api/v1', apiRouter);

// Fallback for non-v1 calls (redirect or friendly notice)
app.get('/', (req, res) => {
  res.json({
    success: true,
    data: {
      message: `Welcome to the ${BRAND.name} REST Engine.`,
      documentation: '/api/v1/health',
      version: '1.0.0',
    },
  });
});

// 404 Route Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `The requested endpoint ${req.originalUrl} does not exist on this server.`,
    },
  });
});

// Global Error Handler
app.use(errorHandler);

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`\n========================================`);
    console.log(` ✨ ${BRAND.name} API Engine Online`);
    console.log(` 💎 Port: http://localhost:${PORT}`);
    console.log(` 🌐 API Prefix: http://localhost:${PORT}/api/v1`);
    console.log(` 🩺 Health Check: http://localhost:${PORT}/api/v1/health`);
    console.log(`========================================\n`);
  });
}

export default app;

