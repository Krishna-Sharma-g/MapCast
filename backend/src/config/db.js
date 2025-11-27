import mongoose from 'mongoose';
import { env } from './env.js';

mongoose.set('strictQuery', true);

export const connectDB = async (uri = env.mongoUri) => {
  await mongoose.connect(uri, {
    dbName: uri.split('/').pop(),
  });
};

export const disconnectDB = async () => {
  await mongoose.connection.close();
};
