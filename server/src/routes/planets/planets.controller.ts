import { Handler } from 'express';
import { getAllPlanets } from '../../models/planets.model';

export async function httpGetAllPlanets(...[req, res]: Parameters<Handler>) {
  res.status(200).json(await getAllPlanets());
}
