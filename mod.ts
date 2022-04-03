import { report } from "./lib/report.ts";
import { forecast } from "./lib/forecast.ts";
import { filter } from "./lib/filter.ts";
import args from "./lib/args.ts";

const nextDays = await forecast(args);
const filteredDays = filter(nextDays, args);
await report(filteredDays, args);
