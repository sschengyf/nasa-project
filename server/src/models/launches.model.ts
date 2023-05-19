import launches, { Launch } from './launches.mongo';
import planets from './planets.mongo';

export type NewLaunchData = Pick<
  Launch,
  'mission' | 'rocket' | 'launchDate' | 'target'
>;

const DEFAULT_FLIGHT_NUMBER = 100;

export async function getAllLaunches() {
  return await launches.find(
    {},
    {
      __v: 0,
      _id: 0,
    }
  );
}

export async function saveLaunch(launch: Launch) {
  const planet = await planets.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error('No accordingly planet found.');
  }

  return await launches.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    { upsert: true }
  );
}

export async function scheduleNewLaunch(launch: NewLaunchData) {
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

export async function doesLaunchExistWithId(launchId: number) {
  return await !!launches.findOne({ flightNumber: launchId });
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
