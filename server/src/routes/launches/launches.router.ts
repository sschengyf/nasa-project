import express from 'express';
import { getAllLaunches } from './launches.controller';

const launchesRouter = express.Router();

launchesRouter.get('/launches', getAllLaunches);

export default launchesRouter;
