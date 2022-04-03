import { DayForecast, ParsedArgs } from "./types.ts";

export function filter(
  daysForecast: DayForecast[],
  request: ParsedArgs,
) {
  const {
    temp: desiredMinTemp,
    precip: desiredMaxPrecip,
    wind: desiredMaxWind,
    gust: desiredMaxWindGusts,
  } = request;

  return daysForecast
    .filter(({ temperatureMax, precipitationIntensity, windSpeed, windGust }) =>
      temperatureMax >= desiredMinTemp &&
      precipitationIntensity <= desiredMaxPrecip &&
      windSpeed <= desiredMaxWind &&
      windGust <= desiredMaxWindGusts
    );
}
