"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.today = void 0;
var today = function (time, hours, min, sec, ms) {
  if (time === void 0) time = new Date();
  if (hours === void 0) hours = 4;
  if (min === void 0) min = 0;
  if (sec === void 0) sec = 0;
  if (ms === void 0) ms = 0;
  time.setUTCHours(hours, min, sec, ms);
  return time;
};
exports.today = today;
