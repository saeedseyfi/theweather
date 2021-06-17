import { getIPLocation } from "https://deno.land/x/ip_location@v1.0.0/mod.ts";
import { DayForecast, IpLocationApiResponse, Request } from "./lib/types.ts";
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

let { lat, lon } = args as Request;
const { days = "15", temp = "20", precip = "1", wind = "8", gust = "10" } =
  args as Request;

if (!lat || !lon) {
  try {
    const ipLocation: IpLocationApiResponse = await getIPLocation();
    lat = String(ipLocation.latitude);
    lon = String(ipLocation.longitude);
    console.log(
      `Fetching weather forecast for ${ipLocation.city}(${lat},${lon})...`,
    );
  } catch (e) {
    console.error(e);
  }

  if (!lat || !lon) {
    throw new Error(
      "Unable to fetch location, provide lat/lon args or check location API.",
    );
  }
}

const filteredDays = await filter(
  await forecast(lat, lon, Number(days)),
  Number(temp),
  Number(precip),
  Number(wind),
  Number(gust),
);

await report({ lat, lon, days, temp, precip, wind, gust }, filteredDays);
