type ObservationValue = { value: number; units: "C" | "F" };

export type Observation = {
  observation_time: string;
  min?: ObservationValue;
  max?: ObservationValue;
};

export type DayForecast = {
  temp: Observation[];
  precipitation: Observation[];
  observation_time: { value: string };
  lat: number;
  lon: number;
};
