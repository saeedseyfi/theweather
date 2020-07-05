import config from "./lib/config.ts";
import args from "./lib/args.ts";
import { stringify } from "./lib/qs.ts";
import { parse } from "./lib/condition-code.ts";
import { DAY_MS } from "./lib/constants.ts";
import report from "./lib/report.ts";
import { DayForecast, Observation } from "./lib/types.ts";

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
        fields: [
          "weather_code",
          "temp",
          "precipitation_accumulation",
          "feels_like",
          "wind_speed",
        ],
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

async function filter(
  days: DayForecast[],
  desiredMinTemp: number,
  desiredMaxPrecip: number,
) {
  return days
    .map(
      (
        {
          temp,
          precipitation_accumulation,
          observation_time,
          feels_like,
          weather_code,
        },
      ) => {
        const maxObservation = (max: number, observation: Observation) => {
          const value = observation?.max?.value || max;
          return value >= max ? value : max;
        };
        const minObservation = (min: number, observation: Observation) => {
          const value = observation?.min?.value || min;
          return value <= min ? value : min;
        };

        return {
          date: new Date(observation_time.value),
          condition: parse(weather_code.value),
          minTemp: Math.round(temp.reduce(minObservation, 100)),
          maxTemp: Math.round(temp.reduce(maxObservation, -100)),
          minFeels: Math.round(feels_like.reduce(minObservation, 100)),
          maxFeels: Math.round(feels_like.reduce(maxObservation, -100)),
          accPrecip: precipitation_accumulation.value,
        };
      },
    )
    .filter(({ maxTemp, accPrecip }) =>
      maxTemp >= desiredMinTemp && accPrecip <= desiredMaxPrecip
    );
}

const { lat, lon, days = "14", temp = "20", precip = "1" } = args;

if (!lat || !lon) {
  throw new Error("lat/lon args are required");
}

const filteredDays = await filter(
  await forecast(lat, lon, Number(days)),
  Number(temp),
  Number(precip),
);

await report({ lat, lon, days, temp, precip }, filteredDays);
