import { parse } from "https://deno.land/std@0.133.0/flags/mod.ts";
import { getIPLocation } from "https://deno.land/x/ip_location@v1.0.0/geoIP.ts";
import { IpLocationApiResponse, ParsedArgs } from "./types.ts";

const args = parse(Deno.args);
let { lat, lon } = args;
const { days = 15, temp = 20, precip = 1, wind = 8, gust = 10 } = args;

// Get lat and lon from IP address, if not provided
if (!lat || !lon) {
  try {
    const ipLocation: IpLocationApiResponse = await getIPLocation();
    lat = ipLocation.latitude;
    lon = ipLocation.longitude;
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

export default {
  lat,
  lon,
  days,
  temp,
  precip,
  wind,
  gust,
} as ParsedArgs; // TODO: assuming passed args are valid in type?
