import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    console.error('CRITICAL: MONGODB_URI environment variable is missing.');
    throw new Error('MONGODB_URI is required. The platform must connect to MongoDB Atlas.');
  }

  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ Connected to MongoDB Atlas successfully');
  } catch (error) {
    console.error('CRITICAL: Failed to connect to MongoDB Atlas:', error);
    throw new Error(`Failed to connect to MongoDB Atlas: ${(error as Error).message}`);
  }
};
