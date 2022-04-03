import AsciiTable from "https://deno.land/x/ascii_table@v0.1.0/mod.ts";
import { DAY_MS } from "./constants.ts";
import { Report, Request } from "./types.ts";
import { today } from "./utils.ts";
import { getDailyForecastUrl } from "./details.ts";

const printTemp = (temp: number, feels: number) =>
  temp !== feels ? `${temp} (feels ${feels})` : temp;

export default async (request: Request, report: Report) => {
  const { days, temp, precip, lat, lon, wind, gust } = request;

  if (report.length > 0) {
    const table = new AsciiTable().parse({
      title:
        `Filters: In coming ${days} days, above ${temp}ºC, precipitation <= ${precip}mm/hr, wind speed <= ${wind}m/h, wind gusts <= ${gust}m/h`,
      heading: [
        "Date",
        "Overall condition",
        "High / Low (ºC)",
        "Wind / Gusts (m/h)",
        "Precip (mm) / Probability (%)",
      ],
      rows: report.map(({
        date,
        weather,
        precipitationIntensity,
        precipitationProbability,
        temperatureMin,
        temperatureMax,
        temperatureApparentMin,
        temperatureApparentMax,
        windSpeed,
        windGust,
      }) => [
        `${date.toDateString()} (+${
          (date.getTime() - today().getTime()) /
          DAY_MS
        } days)`,
        weather,
        [
          printTemp(temperatureMax, temperatureApparentMax),
          printTemp(temperatureMin, temperatureApparentMin),
        ].join(
          ` / `,
        ),
        [windSpeed, windGust].join(` / `),
        precipitationProbability
          ? [precipitationIntensity, precipitationProbability].join(` / `)
          : "-",
      ]),
    });

    console.log(table.toString());

    console.log(
      "More details:",
      await getDailyForecastUrl(lat, lon),
    );
  } else {
    console.error(`Oops no date matched the given criteria.`);
    Deno.exit(1);
  }
};
