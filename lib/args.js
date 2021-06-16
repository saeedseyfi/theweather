"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mod_ts_1 = require("https://deno.land/x/dotenv/mod.ts");
exports.default = Deno.args.map(mod_ts_1.parse).reduce(function (acc, item) {
  return Object.assign(acc, item);
});
