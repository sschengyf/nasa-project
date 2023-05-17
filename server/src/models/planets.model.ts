import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';
import planets from './planets.mongo';

export type CsvPlanet = {
  kepid: number;
  kepoi_name: string;
  kepler_name: string;
  koi_disposition: string;
  koi_pdisposition: string;
  koi_score: number;
  koi_fpflag_nt: boolean;
  koi_fpflag_ss: boolean;
  koi_fpflag_co: boolean;
  koi_fpflag_ec: boolean;
  koi_period: number;
  koi_period_err1: number;
  koi_period_err2: number;
  koi_time0bk: number;
  koi_time0bk_err1: number;
  koi_time0bk_err2: number;
  koi_impact: number;
  koi_impact_err1: number;
  koi_impact_err2: number;
  koi_duration: number;
  koi_duration_err1: number;
  koi_duration_err2: number;
  koi_depth: number;
  koi_depth_err1: number;
  koi_depth_err2: number;
  koi_prad: number;
  koi_prad_err1: number;
  koi_prad_err2: number;
  koi_teq: number;
  koi_teq_err1: number;
  koi_teq_err2: number;
  koi_insol: number;
  koi_insol_err1: number;
  koi_insol_err2: number;
  koi_model_snr: number;
  koi_tce_plnt_num: number;
  koi_tce_delivname: string;
  koi_steff: number;
  koi_steff_err1: number;
  koi_steff_err2: number;
  koi_slogg: number;
  koi_slogg_err1: number;
  koi_slogg_err2: number;
  koi_srad: number;
  koi_srad_err1: number;
  koi_srad_err2: number;
  ra: number;
  dec: number;
  koi_kepmag: number;
};

function isHabitablePlanet(planet: CsvPlanet) {
  return (
    planet['koi_disposition'] === 'CONFIRMED' &&
    planet['koi_insol'] > 0.36 &&
    planet['koi_insol'] < 1.11 &&
    planet['koi_prad'] < 1.6
  );
}

export function loadPlanetsData() {
  return new Promise<void>((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, '..', '..', 'data', 'kepler_data.csv')
    )
      .pipe(
        parse({
          comment: '#',
          columns: true,
        })
      )
      .on('data', (data) => {
        if (isHabitablePlanet(data)) {
          savePlanet(data);
        }
      })
      .on('error', (err) => {
        reject(err);
      })
      .on('end', async () => {
        const habitablePlanets = await getAllPlanets();
        console.log(`${habitablePlanets.length} habitable planets found!`);
        resolve();
      });
  });
}

async function savePlanet(planet: CsvPlanet) {
  try {
    await planets.updateOne(
      { keplerName: planet.kepler_name },
      { keplerName: planet.kepler_name },
      { upsert: true }
    );
  } catch (err) {
    console.error(`Something went wrong when save planet ${err}`);
  }
}

export async function getAllPlanets() {
  return await planets.find({});
}
