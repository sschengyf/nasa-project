import http from 'http';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app';
import { loadPlanetsData } from './models/planets.model';

dotenv.config();

const PORT = process.env.PORT || 8000;

const MONGO_URL = `mongodb+srv://nasa-api:${process.env.MONGODB_PASSWORD}@nasaproject.qeka15l.mongodb.net/?retryWrites=true&w=majority`;

const server = http.createServer(app);

mongoose.connection.once('open', () => {
  console.log('MongoDB is connected!');
});

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

async function startServer() {
  await mongoose.connect(MONGO_URL);
  await loadPlanetsData();

  server.listen(PORT, () => {
    console.log('Listening on port: ', PORT);
  });
}

startServer();
