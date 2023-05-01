import express from 'express';
import { getAllPlanets } from './planets.controller';

const planetsRouter = express.Router();

planetsRouter.get('/planets', getAllPlanets);

export default planetsRouter;
