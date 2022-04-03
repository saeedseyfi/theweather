import {
  DayForecast,
  ParsedArgs,
  TomorrowApiForecastResponse,
} from "./types.ts";
import { createUrl } from "./utils.ts";
import { DAY_MS } from "./constants.ts";
import { parse } from "./weather-code.ts";
import config from "./config.ts";

const { TOMORROW_APIKEY } = config;

export function forecast(request: ParsedArgs): Promise<DayForecast[]> {
  const { lat, lon, days } = request;
  const fields = [
    "weatherCode",
    "temperatureMin",
    "temperatureMax",
    "temperatureApparentMin",
    "temperatureApparentMax",
    "precipitationProbability",
    "precipitationIntensity",
    "windSpeed",
    "windGust",
  ] as const;
  return fetch(
    createUrl({
      url: "https://api.tomorrow.io/v4/timelines",
      query: {
        location: [lat, lon].join(),
        fields: fields.join(),
        units: "metric",
        timesteps: `1d`,
        startTime: (new Date()).toISOString(),
        endTime: (new Date(Date.now() + DAY_MS * days)).toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        apikey: TOMORROW_APIKEY,
      },
    }),
    { headers: { "content-type": "application/json" } },
  )
    .then((res) =>
      res.json() as Promise<TomorrowApiForecastResponse<typeof fields[number]>>
    )
    .then((res) => {
      const intervals = res?.data?.timelines?.[0]?.intervals;
      if (!intervals) {
        throw new Error(
          "Unexpected response: \n" + JSON.stringify(res, null, 2),
        );
      }
      if (res.code && res.message) {
        throw new Error(res.message);
      }
      return intervals;
    })
    .then((intervals) =>
      intervals.map(({
        startTime,
        values: {
          weatherCode,
          precipitationIntensity,
          precipitationProbability,
          temperatureMin,
          temperatureMax,
          temperatureApparentMin,
          temperatureApparentMax,
          windSpeed,
          windGust,
        },
      }) => ({
        date: new Date(startTime),
        weather: parse(weatherCode),
        temperatureMin: Math.round(temperatureMin),
        temperatureMax: Math.round(temperatureMax),
        temperatureApparentMin: Math.round(temperatureApparentMin),
        temperatureApparentMax: Math.round(temperatureApparentMax),
        precipitationIntensity: precipitationIntensity,
        precipitationProbability: precipitationProbability,
        windGust: Math.round(windGust),
        windSpeed: Math.round(windSpeed),
      }))
    );
}
