import { Handler, Request } from 'express';
import {
  getAllLaunches,
  scheduleNewLaunch,
  doesLaunchExistWithId,
  abortLaunchById,
  NewLaunchData,
} from '../../../models/launches.model';

export interface RequestBody<T> extends Request {
  body: T;
}

export async function httpGetAllLaunches(...[req, res]: Parameters<Handler>) {
  return res.status(200).json(await getAllLaunches());
}

export const httpAddNewLaunch: Handler = async (
  req: RequestBody<NewLaunchData & { launchDate: string }>,
  res
) => {
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
      error: 'Invalid launch date.',
    });
  }

  const newLaunch = await scheduleNewLaunch({
    ...newLaunchData,
    ...{ launchDate: launchDateObj },
  });

  res.status(201).json(newLaunch);
};

export const httpAbortLaunch: Handler = async (req, res) => {
  const launchId = Number(req.params.id);
  const launchExists = await doesLaunchExistWithId(launchId);

  if (!launchExists) {
    return res.status(404).json({
      error: 'Launch not found.',
    });
  }

  const aborted = await abortLaunchById(launchId);

  if (!aborted) {
    return res.status(400).json({
      error: 'Launch not aborted.',
    });
  }

  return res.status(200).json({
    ok: true,
  });
};
