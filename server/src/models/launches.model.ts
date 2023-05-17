import { Launch } from './launches.mongo';

export type NewLaunchData = Pick<
  Launch,
  'mission' | 'rocket' | 'launchDate' | 'target'
>;

const launches = new Map<number, Launch>();

const defaultLaunch: Launch = {
  flightNumber: 100,
  mission: 'Kepler Exploration X',
  rocket: 'Explorer IS1',
  launchDate: new Date('December 27, 2030'),
  target: 'Kepler-442 b',
  customer: ['ZTM', 'NASA'],
  upcoming: true,
  success: true,
};

launches.set(defaultLaunch.flightNumber, defaultLaunch);

export function getAllLaunches(): Launch[] {
  return Array.from(launches.values());
}

export function addNewLaunch(launch: NewLaunchData) {
  const flightNumbers = launches.keys();
  const descFlightNumbers = Array.from(flightNumbers).sort((a, b) => b - a);
  const lastFlightNumber = descFlightNumbers[0];
  const newFlightNumber = lastFlightNumber + 1;

  launches.set(newFlightNumber, {
    ...launch,
    ...{
      flightNumber: newFlightNumber,
      success: true,
      upcoming: true,
      customer: ['ZTM', 'NASA'],
    },
  });

  return launches.get(newFlightNumber);
}

export function doesLaunchExistWithId(launchId: number) {
  return launches.has(launchId);
}

export function abortLaunchById(launchId: number) {
  const launch = launches.get(launchId);
  launch &&
    launches.set(launchId, {
      ...launch,
      ...{ upcoming: false, success: false },
    });

  return launches.get(launchId);
}
