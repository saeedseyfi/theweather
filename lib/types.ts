export type TomorrowApiForecastResponse<F extends string> = {
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

export type TomorrowApiNearbyResponse = {
  code?: string;
  message?: string;
  data?: {
    cities?: {
      isCapital?: boolean;
      id?: string;
      stateCode?: string;
      countryCode?: string;
      population?: number;
      name?: string;
      state?: string;
      country?: string;
      lat?: number;
      lng?: number;
      timezone?: string;
      locationType?: string;
      originalName?: string;
    }[];
    places?: {
      id?: string;
      countryCode?: string;
      type?: string;
      class?: string;
      name?: string;
      country?: string;
      lat?: number;
      lng?: number;
      timezone?: string;
      locationType?: string;
    }[];
  };
};

export type IpLocationApiResponse = {
  latitude: number;
  longitude: number;
  timezone: string;
  city: string;
  [key: string]: unknown;
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

export type ParsedArgs = {
  lat: number;
  lon: number;
  days: number;
  temp: number;
  precip: number;
  wind: number;
  gust: number;
};
