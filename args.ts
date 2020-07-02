import { parse } from "https://deno.land/x/dotenv/mod.ts";

export default Deno.args.map(parse).reduce((acc, item) =>
  Object.assign(acc, item)
);
