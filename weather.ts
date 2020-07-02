import config from "./config.ts";
import args from "./args.ts";
import { stringify } from "./qs.ts";

const DAY_MS = 1000 * 60 * 60 * 24;
const { CLIMACELL_APIKEY } = config;

type ObservationValue = { value: number; units: "C" | "F" };
type Observation = {
  observation_time: string;
  min?: ObservationValue;
  max?: ObservationValue;
};
type Day = {
  temp: Observation[];
  precipitation: Observation[];
  observation_time: { value: string };
  lat: number;
  lon: number;
};

function forecast(
  lat: string | number,
  lon: string | number,
  days: number = 7,
): Promise<Day[]> {
  return fetch(
    `https://api.climacell.co/v3/weather/forecast/daily?${
      stringify({
        lat,
        lon,
        end_time: (new Date(Date.now() + DAY_MS * days)).toISOString(),
        fields: ["temp", "precipitation"],
        apikey: CLIMACELL_APIKEY,
      })
    }`,
    {
      headers: {
        "content-type": "application/json",
      },
    },
  )
    .then((res) => res.json())
    .then((data) => {
      if (!data) {
        throw new Error("No data returned");
      }
      if (data.errorCode && data.message) {
        throw new Error(data.message);
      }
      return data;
    });
}

async function findSunnyDays(
  days: Day[],
  desiredMinTemp: number,
  desiredMaxPrecip: number,
) {
  return days
    .map(({ temp, precipitation, observation_time }) => {
      const reduceObservation = (threshold: number) =>
        (max: number, observation: Observation) => {
          const value = observation.max?.value || 0;
          const maxPassed = value >= max;
          return maxPassed ? value : max;
        };

      return {
        date: observation_time.value,
        maxTemp: temp.reduce(reduceObservation(desiredMinTemp), 0),
        maxPrecip: precipitation.reduce(reduceObservation(desiredMaxPrecip), 0),
      };
    })
    .filter(({ maxTemp, maxPrecip }) =>
      maxTemp >= desiredMinTemp && maxPrecip <= desiredMaxPrecip
    );
}

const { lat, lon, days = "14", temp = "20", precip = "1" } = args;

if (!lat || !lon) {
  throw new Error("lat/lon args are required");
}

const sunnyDays = await findSunnyDays(
  await forecast(lat, lon, Number(days)),
  Number(temp),
  Number(precip),
);

console.table(sunnyDays.map(({ date, maxPrecip, maxTemp }) => ({
  "Date": new Date(date).toDateString(),
  "Highest Temp (C)": maxTemp,
  "Highest Precip (mm/hr)": maxPrecip,
})));
