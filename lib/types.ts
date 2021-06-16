export type ApiResponse<F extends string> = {
  code?: string;
  message?: string;
  data?: {
    timelines?: {
      timestep: string;
      startTime: string;
      endTime: string;
      intervals: {
        startTime: string;
        values: {
          [key in F]?: any;
        };
      }[];
    }[];
  };
};

export type DayForecast = {
  date: Date;
  weather: string;
  temperatureMin: number;
  temperatureMax: number;
  temperatureApparentMin: number;
  temperatureApparentMax: number;
  precipitationProbability: number;
  precipitationIntensity: number;
  windSpeed: number;
  windGust: number;
};

export type Report = DayForecast[];

export type Request = {
  lat: string;
  lon: string;
  days: string;
  temp: string;
  precip: string;
  wind: string;
  gust: string;
};
