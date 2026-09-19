import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from server/.env or root .env
dotenv.config({ path: path.resolve(process.cwd(), 'server/.env') });
dotenv.config();

export interface ServerConfig {
  SERVER_PORT: number;
  CLIENT_URL: string;
  MONGODB_URI: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  INTERNAL_SERVER_URL: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
}

/**
 * Validates mandatory and optional environment variables for the Express API server.
 * Never outputs secret values into log streams.
 */
export function validateServerEnvironment(): ServerConfig {
  const mandatoryVars = [
    'MONGODB_URI',
    'BETTER_AUTH_SECRET',
    'BETTER_AUTH_URL',
    'CLIENT_URL',
  ] as const;

  for (const varName of mandatoryVars) {
    if (!process.env[varName]) {
      console.error(`❌ CRITICAL: Missing required environment variable: ${varName}`);
      throw new Error(`Missing required environment variable: ${varName}`);
    }
  }

  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.warn(
      '⚠️ Notice: GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is not configured. Google OAuth sign-in will be inactive until credentials are provided in Google Cloud Console.'
    );
  }

  const port = Number(process.env.SERVER_PORT || process.env.EXPRESS_PORT || 5000);

  return {
    SERVER_PORT: port,
    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
    MONGODB_URI: process.env.MONGODB_URI!,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET!,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
    INTERNAL_SERVER_URL: process.env.INTERNAL_SERVER_URL || 'http://localhost:5000',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  };
}
