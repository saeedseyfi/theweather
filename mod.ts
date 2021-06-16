import { DayForecast, Request } from "./lib/types.ts";
import args from "./lib/args.ts";
import report from "./lib/report.ts";
import { forecast } from "./lib/forecast.ts";

async function filter(
  days: DayForecast[],
  desiredMinTemp: number,
  desiredMaxPrecip: number,
  desiredMaxWind: number,
  desiredMaxWindGusts: number,
) {
  return days
    .filter(({ temperatureMax, precipitationIntensity, windSpeed, windGust }) =>
      temperatureMax >= desiredMinTemp &&
      precipitationIntensity <= desiredMaxPrecip &&
      windSpeed <= desiredMaxWind &&
      windGust <= desiredMaxWindGusts
    );
}

const {
  lat,
  lon,
  days = "15",
  temp = "20",
  precip = "1",
  wind = "8",
  gust = "10",
} = args as Request;

if (!lat || !lon) {
  throw new Error("lat/lon args are required");
}

const filteredDays = await filter(
  await forecast(lat, lon, Number(days)),
  Number(temp),
  Number(precip),
  Number(wind),
  Number(gust),
);

await report({ lat, lon, days, temp, precip, wind, gust }, filteredDays);
