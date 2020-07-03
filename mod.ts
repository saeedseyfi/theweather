import config from "./lib/config.ts";
import args from "./lib/args.ts";
import { stringify } from "./lib/qs.ts";
import { DayForecast, Observation } from "./lib/types.ts";

const DAY_MS = 1000 * 60 * 60 * 24;
const { CLIMACELL_APIKEY } = config;

function forecast(
  lat: string | number,
  lon: string | number,
  days: number = 7,
): Promise<DayForecast[]> {
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
  days: DayForecast[],
  desiredMinTemp: number,
  desiredMaxPrecip: number,
) {
  return days
    .map(({ temp, precipitation, observation_time }) => {
      const maxObservation = (max: number, observation: Observation) => {
        const value = observation?.max?.value || max;
        return value >= max ? value : max;
      };
      const minObservation = (min: number, observation: Observation) => {
        const value = observation?.min?.value || min;
        return value <= min ? value : min;
      };

      return {
        date: observation_time.value,
        minTemp: temp.reduce(minObservation, 100),
        maxTemp: temp.reduce(maxObservation, -100),
        maxPrecip: precipitation.reduce(maxObservation, 0),
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

console.log(
  `You asked to find the dates in coming ${days} days that is above ${temp}ºC and bellow ${precip}mm/hr precipitation.`,
);

if (sunnyDays.length > 0) {
  console.table(
    sunnyDays.map(({ date, maxPrecip, maxTemp, minTemp }) => ({
      "Date": new Date(date).toDateString(),
      "Highest Temp (C)": maxTemp,
      "Lowest Temp (C)": minTemp,
      "Highest Precip (mm/hr)": maxPrecip,
    })),
  );
  console.log(
    "More details:",
    `https://weather.com/weather/monthly/l/${lat},${lon}`,
  );
} else {
  console.error(`Oops no date matched the given criteria.`);
  Deno.exit(1);
}
