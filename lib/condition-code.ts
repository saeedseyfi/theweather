/*
all codes:
    "tstorm"
    "clear"
    "cloudy"
    "rain"
    "snow_heavy"
    "snow"
    "snow_light"
    "freezing_rain_heavy"
    "freezing_rain"
    "freezing_rain_light"
    "freezing_drizzle"
    "ice_pellets_heavy"
    "ice_pellets"
    "ice_pellets_light"
    "flurries"
    "rain_heavy"
    "rain_light"
    "drizzle"
    "fog_light"
    "fog"
    "mostly_cloudy"
    "partly_cloudy"
    "mostly_clear"
 */

const normalize = (rawCode: string) => {
  const code = rawCode.replace(/_/, " ");
  switch (code) {
    case "tstorm":
      return "thunderstorm";
    default:
      return code;
  }
};

const getEmoji = (rawCode: string) => {
  switch (rawCode) {
    case "tstorm":
      return "🌩️";

    case "clear":
      return "🌞";

    case "rain":
    case "rain_heavy":
    case "rain_light":
      return "🌧";

    case "snow":
    case "snow_heavy":
    case "snow_light":
    case "freezing_rain_heavy":
    case "freezing_rain":
    case "freezing_rain_light":
    case "freezing_drizzle":
    case "ice_pellets_heavy":
    case "ice_pellets":
    case "ice_pellets_light":
    case "flurries":
      return "❄️";

    case "cloudy":
      return "☁️ "; // extra space is intentional

    case "mostly_cloudy":
    case "partly_cloudy":
    case "mostly_clear":
      return "⛅";

    case "drizzle":
    case "fog_light":
    case "fog":
      return "🌁";

    default:
      return "";
  }
};

export const parse = (code: string) => {
  const normalizedCode = normalize(code);
  // const emoji = getEmoji(code);

  // return `${emoji ? `${emoji} ` : ""}${normalizedCode}`; // emoji rendering issue
  return normalizedCode;
};
