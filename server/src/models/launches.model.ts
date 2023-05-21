import axios from 'axios';
import launches, { Launch } from './launches.mongo';
import planets from './planets.mongo';
import { LaunchDoc } from './launch';

export type NewLaunchData = Pick<
  Launch,
  'mission' | 'rocket' | 'launchDate' | 'target'
>;

const DEFAULT_FLIGHT_NUMBER = 100;

export async function getAllLaunches(skip: number, limit: number) {
  return await launches
    .find(
      {},
      {
        __v: 0,
        _id: 0,
      }
    )
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
}

export async function saveLaunch(launch: Launch) {
  return await launches.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    { upsert: true }
  );
}

export async function scheduleNewLaunch(launch: NewLaunchData) {
  const planet = await planets.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error('No accordingly planet found.');
  }

  const newFlightNumber = (await getLatestFlightNumber()) + 1;

  const newLaunch = {
    ...launch,
    ...{
      flightNumber: newFlightNumber,
      success: true,
      upcoming: true,
      customer: ['ZTM', 'NASA'],
    },
  };

  await saveLaunch(newLaunch);

  return newLaunch;
}

async function findLaunch(filter: Record<string, unknown>) {
  return await launches.findOne(filter);
}

export async function doesLaunchExistWithId(launchId: number) {
  return await !!findLaunch({ flightNumber: launchId });
}

async function getLatestFlightNumber() {
  const latestLaunch = await launches.findOne({}).sort('-flightNumber');
  return latestLaunch?.flightNumber || DEFAULT_FLIGHT_NUMBER;
}

export async function abortLaunchById(launchId: number) {
  const aborted = await launches.updateOne(
    { flightNumber: launchId },
    {
      upcoming: false,
      success: false,
    }
  );

  return aborted.modifiedCount === 1;
}

const SPACEX_API_LAUNCHES_QUERY_URL =
  'https://api.spacexdata.com/v4/launches/query';

export async function loadLaunchData() {
  const spaceXLaunch = await findLaunch({
    flightNumber: 1,
    rocket: 'Falcon 1',
    mission: 'FalconSat',
  });

  if (!!spaceXLaunch) {
    console.log('Launch data already loaded.');
    return;
  }

  console.log('Loading SpaceX launch data...');

  const response = await axios.post<{ docs: LaunchDoc[] }>(
    SPACEX_API_LAUNCHES_QUERY_URL,
    {
      query: {},
      options: {
        pagination: false,
        populate: [
          {
            path: 'rocket',
            select: {
              name: 1,
            },
          },
          {
            path: 'payloads',
            select: {
              customers: 1,
            },
          },
        ],
      },
    }
  );

  if (response.status !== 200) {
    console.log('Something went wrong when load SpaceX launch data.');
    throw new Error('Failed to load SpaceX launch data.');
  }

  const launchDocs = response.data.docs;
  for (const {
    payloads,
    flight_number,
    name,
    rocket,
    date_local,
    upcoming,
    success,
  } of launchDocs) {
    const customers = payloads.flatMap((payload) => payload['customers']);

    const launch: Launch = {
      flightNumber: flight_number,
      mission: name,
      rocket: rocket.name,
      launchDate: date_local,
      upcoming,
      success,
      customer: customers,
      target: '',
    };

    console.log(`${launch.flightNumber} ${launch.mission}`);

    saveLaunch(launch);
  }
}
