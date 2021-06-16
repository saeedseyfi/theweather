"use strict";
var __awaiter = (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function (resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator = (this && this.__generator) || function (thisArg, body) {
  var _ = {
      label: 0,
      sent: function () {
        if (t[0] & 1) throw t[1];
        return t[1];
      },
      trys: [],
      ops: [],
    },
    f,
    y,
    t,
    g;
  return g = { next: verb(0), "throw": verb(1), "return": verb(2) },
    typeof Symbol === "function" && (g[Symbol.iterator] = function () {
      return this;
    }),
    g;
  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (_) {
      try {
        if (
          f = 1,
            y && (t = op[0] & 2
              ? y["return"]
              : op[0]
              ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
              : y.next) &&
            !(t = t.call(y, op[1])).done
        ) {
          return t;
        }
        if (y = 0, t) op = [op[0] & 2, t.value];
        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;
          case 4:
            _.label++;
            return { value: op[1], done: false };
          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;
          case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;
          default:
            if (
              !(t = _.trys, t = t.length > 0 && t[t.length - 1]) &&
              (op[0] === 6 || op[0] === 2)
            ) {
              _ = 0;
              continue;
            }
            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
              _.label = op[1];
              break;
            }
            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            if (t[2]) _.ops.pop();
            _.trys.pop();
            continue;
        }
        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }
    if (op[0] & 5) throw op[1];
    return { value: op[0] ? op[1] : void 0, done: true };
  }
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_ts_1 = require("./lib/config.ts");
var args_ts_1 = require("./lib/args.ts");
var weather_code_ts_1 = require("./lib/weather-code.ts");
var constants_ts_1 = require("./lib/constants.ts");
var report_ts_1 = require("./lib/report.ts");
var CLIMACELL_APIKEY = config_ts_1.default.CLIMACELL_APIKEY;
/**
 * Creates a full URL from a base URL and query params.
 * @param url
 * @param query
 * @returns {string}
 */
var createUrl = function (_a) {
  var url = _a.url, _b = _a.query, query = _b === void 0 ? {} : _b;
  var urlBuilder = new URL(url);
  Object.entries(query).forEach(function (_a) {
    var key = _a[0], value = _a[1];
    if (value == null) {
      return;
    }
    if (Array.isArray(value)) {
      value.forEach(function (val) {
        return urlBuilder.searchParams.append(key, val);
      });
      return;
    }
    urlBuilder.searchParams.append(key, value);
  });
  return urlBuilder.toString();
};
function forecast(lat, lon, days) {
  if (days === void 0) days = 7;
  var fields = [
    "weatherCode",
    "temperatureMin",
    "temperatureMax",
    "temperatureApparentMin",
    "temperatureApparentMax",
    "precipitationProbability",
    "precipitationIntensity",
    "windSpeed",
    "windGust",
  ];
  return fetch(
    createUrl({
      url: "https://api.tomorrow.io/v4/timelines",
      query: {
        location: [lat, lon].join(),
        fields: fields.join(),
        units: "metric",
        timesteps: "1d",
        startTime: (new Date()).toISOString(),
        endTime: (new Date(Date.now() + constants_ts_1.DAY_MS * days))
          .toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        apikey: CLIMACELL_APIKEY,
      },
    }),
    { headers: { "content-type": "application/json" } },
  )
    .then(function (res) {
      return res.json();
    })
    .then(function (res) {
      var _a, _b, _c;
      var intervals = (_c = (_b = (_a = res === null || res === void 0
                          ? void 0
                          : res.data) === null || _a === void 0
                    ? void 0
                    : _a.timelines) === null || _b === void 0
              ? void 0
              : _b[0]) === null || _c === void 0
        ? void 0
        : _c.intervals;
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
    .then(function (intervals) {
      return intervals.map(function (_a) {
        var startTime = _a.startTime,
          _b = _a.values,
          weatherCode = _b.weatherCode,
          precipitationIntensity = _b.precipitationIntensity,
          precipitationProbability = _b.precipitationProbability,
          temperatureMin = _b.temperatureMin,
          temperatureMax = _b.temperatureMax,
          temperatureApparentMin = _b.temperatureApparentMin,
          temperatureApparentMax = _b.temperatureApparentMax,
          windSpeed = _b.windSpeed,
          windGust = _b.windGust;
        console.log(
          startTime,
          new Date(startTime).getTime(),
          Date.now(),
          new Date(startTime).getTime() - Date.now(),
          (new Date(startTime).getTime() - Date.now()) / constants_ts_1.DAY_MS,
        ); // FIXME remove logs
        return ({
          date: new Date(startTime),
          weather: weather_code_ts_1.parse(weatherCode),
          temperatureMin: Math.round(temperatureMin),
          temperatureMax: Math.round(temperatureMax),
          temperatureApparentMin: Math.round(temperatureApparentMin),
          temperatureApparentMax: Math.round(temperatureApparentMax),
          precipitationIntensity: precipitationIntensity,
          precipitationProbability: precipitationProbability,
          windGust: Math.round(windGust),
          windSpeed: Math.round(windSpeed),
        });
      });
    });
}
function filter(
  days,
  desiredMinTemp,
  desiredMaxPrecip,
  desiredMaxWind,
  desiredMaxWindGusts,
) {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      return [
        2, /*return*/
        days
          .filter(function (_a) {
            var temperatureMax = _a.temperatureMax,
              precipitationIntensity = _a.precipitationIntensity,
              windSpeed = _a.windSpeed,
              windGust = _a.windGust;
            return temperatureMax >= desiredMinTemp &&
              precipitationIntensity <= desiredMaxPrecip &&
              windSpeed <= desiredMaxWind &&
              windGust <= desiredMaxWindGusts;
          }),
      ];
    });
  });
}
var _a = args_ts_1.default,
  lat = _a.lat,
  lon = _a.lon,
  _b = _a.days,
  days = _b === void 0 ? "15" : _b,
  _c = _a.temp,
  temp = _c === void 0 ? "20" : _c,
  _d = _a.precip,
  precip = _d === void 0 ? "1" : _d,
  _e = _a.wind,
  wind = _e === void 0 ? "8" : _e,
  _f = _a.gustd,
  gustd = _f === void 0 ? "10" : _f;
if (!lat || !lon) {
  throw new Error("lat/lon args are required");
}
var filteredDays = await filter(
  await forecast(lat, lon, Number(days)),
  Number(temp),
  Number(precip),
  Number(wind),
  Number(gust),
);
await report_ts_1.default({
  lat: lat,
  lon: lon,
  days: days,
  temp: temp,
  precip: precip,
  wind: wind,
  gust: gust,
}, filteredDays);
