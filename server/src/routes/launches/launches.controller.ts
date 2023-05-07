import { Handler } from 'express';
import { getAllLaunches, addNewLaunch } from '../../models/launches.model';

export function httpGetAllLaunches(
  ...[req, res]: Parameters<Handler>
): ReturnType<Handler> {
  res.status(200).json(getAllLaunches());
}

export function httpAddNewLaunch(
  ...[req, res]: Parameters<Handler>
): ReturnType<Handler> {
  const newLaunchData = req.body;
  const newLaunch = addNewLaunch({
    ...newLaunchData,
    ...{ launchDate: new Date(newLaunchData.launchDate) },
  });

  res.status(201).json(newLaunch);
}
