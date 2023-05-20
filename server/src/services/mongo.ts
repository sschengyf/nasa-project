import * as dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const MONGO_URL = `mongodb+srv://nasa-api:${process.env.MONGODB_PASSWORD}@nasaproject.qeka15l.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connection.once('open', () => {
  console.log('MongoDB is connected!');
});

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

export async function mongoConnect() {
  await mongoose.connect(MONGO_URL);
}

export async function mongoDisconnect() {
  await mongoose.disconnect();
}
