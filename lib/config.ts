import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";

const env = config({ safe: true });

export default env as {
  TOMORROW_APIKEY: string;
  IPIFY_APIKEY: string;
};
