import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { validateServerEnvironment } from './config/env';
import { connectDB } from './config/db';
import { seedInitialCarsIfEmpty } from './utils/seedData';

import carRoutes from './routes/carRoutes';
import myCarsRoutes from './routes/myCarsRoutes';
import bookingRoutes from './routes/bookingRoutes';
import userRoutes from './routes/userRoutes';

// Validate environment on load (Requirement 24: clear error if mandatory vars missing)
const envConfig = validateServerEnvironment();

const app = express();
const SERVER_PORT = envConfig.SERVER_PORT;

// CORS configuration (Requirements 8 & 20: Strict origins with credentials enabled)
const allowedOrigins = [
  envConfig.CLIENT_URL,
  'http://localhost:3000',
  'http://127.0.0.1:3000',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, server-to-server, SSR)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || origin.includes('localhost') || origin.includes('run.app')) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Health Check (Requirement 43)
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'DriveFleet Express REST API',
    database: 'MongoDB Atlas',
    timestamp: new Date().toISOString(),
  });
});

// REST API Endpoints
app.use('/api/cars', carRoutes);
app.use('/api/my-cars', myCarsRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);

// 404 Handler for undefined API routes
app.use('/api/*', (_req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found on DriveFleet server.',
  });
});

// Global Error Handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Express server unhandled error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

export const startServer = async () => {
  try {
    // Connect to MongoDB Atlas (fails clearly if MONGODB_URI missing as per Requirement 13, 21 & 47)
    await connectDB();
    await seedInitialCarsIfEmpty();

    app.listen(SERVER_PORT, () => {
      console.log(`🚀 DriveFleet Express REST API running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    console.error('CRITICAL: Server initialization stopped:', (error as Error).message);
    process.exit(1);
  }
};

// Start if executed directly
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
