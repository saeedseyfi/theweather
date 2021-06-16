"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mod_ts_1 = require("https://deno.land/x/ascii_table@v0.1.0/mod.ts");
var constants_ts_1 = require("./constants.ts");
var utils_ts_1 = require("./utils.ts");
var printTemp = function (temp, feels) {
  return temp !== feels ? temp + " (feels " + feels + ")" : temp;
};
exports.default = (function (request, report) {
  var days = request.days,
    temp = request.temp,
    precip = request.precip,
    lat = request.lat,
    lon = request.lon;
  if (report.length > 0) {
    var table = new mod_ts_1.default().parse({
      title: "Dates in coming " + days + " days that are above " + temp +
        "\u00BAC that have bellow " + precip + "mm/hr precipitation.",
      heading: [
        "Date",
        "Overall condition",
        "High / Low (ºC)",
        "Wind / Gusts (m/h)",
        "Precip (mm) / Probability (%)",
      ],
      rows: report.map(function (_a) {
        var date = _a.date,
          weather = _a.weather,
          precipitationIntensity = _a.precipitationIntensity,
          precipitationProbability = _a.precipitationProbability,
          temperatureMin = _a.temperatureMin,
          temperatureMax = _a.temperatureMax,
          temperatureApparentMin = _a.temperatureApparentMin,
          temperatureApparentMax = _a.temperatureApparentMax,
          windSpeed = _a.windSpeed,
          windGust = _a.windGust;
        return [
          date.toDateString() + " (+" +
          (date.getTime() - utils_ts_1.today().getTime()) /
            constants_ts_1.DAY_MS +
          " days)",
          weather,
          [
            printTemp(temperatureMax, temperatureApparentMax),
            printTemp(temperatureMin, temperatureApparentMin),
          ].join(" / "),
          [windSpeed, windGust].join(" / "),
          precipitationProbability
            ? [precipitationIntensity, precipitationProbability].join(" / ")
            : "-",
        ];
      }),
    });
    console.log(table.toString());
    console.log(
      "More details:",
      "https://weather.com/weather/monthly/l/" + lat + "," + lon,
    );
  } else {
    console.error("Oops no date matched the given criteria.");
    Deno.exit(1);
  }
});
