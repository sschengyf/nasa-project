import express from 'express';
import { httpGetAllLaunches } from './launches.controller';

const launchesRouter = express.Router();

launchesRouter.get('/launches', httpGetAllLaunches);

export default launchesRouter;
