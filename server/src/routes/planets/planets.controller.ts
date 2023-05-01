import { Handler } from 'express';
import planets from '../../models/planets.model';

export function getAllPlanets(
  ...[req, res]: Parameters<Handler>
): ReturnType<Handler> {
  res.status(200).json(planets);
}
