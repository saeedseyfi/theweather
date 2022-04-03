import { TomorrowApiNearbyResponse } from "./types.ts";
import { createUrl } from "./utils.ts";

export function getDailyForecastUrl(
  lat: string | number,
  lon: string | number,
): Promise<string> {
  return fetch(
    createUrl({
      url: `https://weather-services.tomorrow.io/backend/v1/cities/nearby`,
      query: {
        location: [lat, lon].join(),
        count: 1,
      },
    }),
    { headers: { "content-type": "application/json" } },
  )
    .then((res) => res.json() as Promise<TomorrowApiNearbyResponse>)
    .then((res) => {
      if (!res?.data?.cities?.[0]) {
        throw new Error(
          "Unexpected response, nearby api: \n" + JSON.stringify(res, null, 2),
        );
      }
      if (res.code && res.message) {
        throw new Error(res.message);
      }
      return res.data?.cities?.[0];
    })
    .then(({ countryCode, stateCode, name, id }) =>
      encodeURI(
        `https://www.tomorrow.io/weather/${countryCode}/${stateCode}/${name}/${id}/daily/`,
      )
    );
}
