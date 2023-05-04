import { Handler } from 'express';
import { getAllLaunches } from '../../models/launches.model';

export function httpGetAllLaunches(
  ...[req, res]: Parameters<Handler>
): ReturnType<Handler> {
  res.status(200).json(getAllLaunches());
}
