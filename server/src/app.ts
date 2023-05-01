import express from 'express';
import planetsRouter from './routes/planets/planets.router';

const app = express();

app.use(express.json());
app.use(planetsRouter);

export default app;
