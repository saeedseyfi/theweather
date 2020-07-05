import { parse } from "./condition-code.ts";

type ObservationValue = { value: number; units: string };

export type Observation = {
  observation_time: string;
  min?: ObservationValue;
  max?: ObservationValue;
};

export type DayForecast = {
  temp: Observation[];
  precipitation: Observation[];
  precipitation_accumulation: ObservationValue;
  feels_like: Observation[];
  wind_speed: Observation[];
  weather_code: { value: string };
  observation_time: { value: string };
  lat: number;
  lon: number;
};

export type Report = {
  date: Date;
  condition: string;
  minTemp: number;
  maxTemp: number;
  minFeels: number;
  maxFeels: number;
  accPrecip: number;
}[];

export type Request = {
  lat: string;
  lon: string;
  days: string;
  temp: string;
  precip: string;
};
