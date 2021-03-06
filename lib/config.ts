import { config } from "https://deno.land/x/dotenv/mod.ts";

const env = config({ safe: true });

export default env as {
  CLIMACELL_APIKEY: string;
};
