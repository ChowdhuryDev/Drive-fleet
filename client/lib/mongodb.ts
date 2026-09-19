import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('CRITICAL: MONGODB_URI environment variable is missing.');
  throw new Error('Please add your MONGODB_URI to environment variables.');
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;

export function getMongoDb() {
  if (!uri) {
    throw new Error('MONGODB_URI is required to access MongoDB.');
  }
  const directClient = new MongoClient(uri);
  return directClient.db();
}
