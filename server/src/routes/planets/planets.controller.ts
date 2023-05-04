import { Handler } from 'express';
import { getAllPlanets } from '../../models/planets.model';

export function httpGetAllPlanets(
  ...[req, res]: Parameters<Handler>
): ReturnType<Handler> {
  res.status(200).json(getAllPlanets());
}
