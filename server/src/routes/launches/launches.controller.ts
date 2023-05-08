import { Handler, Request, Response } from 'express';
import {
  getAllLaunches,
  addNewLaunch,
  NewLaunchData,
} from '../../models/launches.model';

export interface RequestBody<T> extends Request {
  body: T;
}

export function httpGetAllLaunches(
  ...[req, res]: Parameters<Handler>
): ReturnType<Handler> {
  res.status(200).json(getAllLaunches());
}

export const httpAddNewLaunch: Handler = function (
  req: RequestBody<NewLaunchData & { launchDate: string }>,
  res
) {
  const newLaunchData = req.body;
  const { mission, rocket, launchDate, target } = newLaunchData;
  if (!mission || !rocket || !launchDate || !target) {
    return res.status(400).json({
      error: 'Missing required launch property.',
    });
  }

  const launchDateObj = new Date(newLaunchData.launchDate);
  if (isNaN(launchDateObj.valueOf())) {
    return res.status(400).json({
      error: 'Invalid launch date',
    });
  }

  const newLaunch = addNewLaunch({
    ...newLaunchData,
    ...{ launchDate: launchDateObj },
  });

  res.status(201).json(newLaunch);
};
