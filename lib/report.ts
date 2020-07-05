import { Table } from "https://deno.land/x/tbl/mod.ts";
import { DAY_MS } from "./constants.ts";
import { Report, Request } from "./types.ts";

const printTemp = (temp: number, feels: number) =>
  temp !== feels ? `${temp} (feels like ${feels})` : temp;

export default (request: Request, report: Report) => {
  const { days, temp, precip, lat, lon } = request;

  console.log(
    `You asked to find the dates in coming ${days} days that is above ${temp}ºC and bellow ${precip}mm/hr precipitation.`,
  );

  if (report.length > 0) {
    const table = new Table({
      header: [
        "Date",
        "Overall condition",
        "High / Low (ºC)",
        "Total precip (mm)",
      ],
    });

    report.forEach(({
      date,
      condition,
      accPrecip,
      maxTemp,
      minTemp,
      minFeels,
      maxFeels,
    }) =>
      table.push([
        `${date.toDateString()} (+${
          Math.round((date.getTime() - Date.now()) / DAY_MS)
        } days)`,
        condition,
        `${printTemp(maxTemp, maxFeels)} / ${printTemp(minTemp, minFeels)}`,
        accPrecip,
      ])
    );

    console.log(table.toString());

    console.log(
      "More details:",
      `https://weather.com/weather/monthly/l/${lat},${lon}`,
    );
  } else {
    console.error(`Oops no date matched the given criteria.`);
    Deno.exit(1);
  }
};
