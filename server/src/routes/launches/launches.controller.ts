import { Handler } from 'express';
import { launches } from '../../models/launches.model';

export function getAllLaunches(
  ...[req, res]: Parameters<Handler>
): ReturnType<Handler> {
  res.status(200).json(Array.from(launches.values()));
}
