import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { jwt } from 'better-auth/plugins/jwt';
import { bearer } from 'better-auth/plugins/bearer';
import { getMongoDb } from './mongodb';

let authInstance: any = null;

export function getAuth() {
  if (authInstance) return authInstance;

  const db = getMongoDb();
  const secret = process.env.BETTER_AUTH_SECRET || 'd173cc85815aabd6c8f3ec3f28c2aca8de4c4bc5016523c7aa96c28bd11c8b6a';
  const baseURL = process.env.BETTER_AUTH_URL || 'http://localhost:3000';

  const hasGoogleOAuth = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

  authInstance = betterAuth({
    database: mongodbAdapter(db),
    secret,
    baseURL,
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 6,
      autoSignIn: true,
    },
    socialProviders: {
      ...(hasGoogleOAuth
        ? {
            google: {
              clientId: process.env.GOOGLE_CLIENT_ID!,
              clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            },
          }
        : {}),
    },
    plugins: [
      jwt({
        jwt: {
          expirationTime: '7d',
        },
      }),
      bearer(),
    ],
    trustedOrigins: [
      baseURL,
      process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:3000',
      process.env.CLIENT_URL || 'http://localhost:3000',
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
    ],
  });

  return authInstance;
}

export const auth = new Proxy({} as any, {
  get(_target, prop) {
    const a = getAuth();
    return a[prop];
  },
});

export default auth;
