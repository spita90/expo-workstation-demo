import { useGlobalStore } from "@/stores/globalStore";
import {
  FILTER_METRIC,
  HIGH_PRESSURE_METRIC,
  HP_MANOMETER_BAR_MAX,
  HP_MANOMETER_BAR_MIN,
  LOAD_METRIC,
  LOW_PRESSURE_METRIC,
  LP_MANOMETER_BAR_MAX,
  LP_MANOMETER_BAR_MIN,
  OTHER_MANOMETER_BAR_MAX,
  OTHER_MANOMETER_BAR_MIN,
  OTHER_PRESSURE_METRIC,
  TEMPERATURE_CELSIUS_MAX,
  TEMPERATURE_CELSIUS_MIN,
  TEMPERATURE_METRIC,
} from "./constants";
import { UnitOfMeasure } from "./utils";

const METRIC_SEND_INTERVAL = 500;

let temperature = TEMPERATURE_CELSIUS_MIN;
let filter = 100;
let load = 0;
let lowPressure = LP_MANOMETER_BAR_MIN;
let highPressure = HP_MANOMETER_BAR_MIN;
let otherPressure = OTHER_MANOMETER_BAR_MIN;

export const metricsEmulator = () => {
  const interval = setInterval(() => {
    temperature = (temperature + 2) % TEMPERATURE_CELSIUS_MAX;
    filter = filter - 4 < 0 ? 100 : filter - 4;
    load = load + 4 > 100 ? 0 : load + 4;
    lowPressure =
      lowPressure + 0.5 > LP_MANOMETER_BAR_MAX
        ? LP_MANOMETER_BAR_MIN
        : lowPressure + 0.5;
    highPressure =
      highPressure + 1 > HP_MANOMETER_BAR_MAX
        ? HP_MANOMETER_BAR_MIN
        : highPressure + 1;
    otherPressure =
      otherPressure + 1 > OTHER_MANOMETER_BAR_MAX
        ? OTHER_MANOMETER_BAR_MIN
        : otherPressure + 1;

    useGlobalStore.getState().setPowerBoardDriverMetrics([
      {
        name: TEMPERATURE_METRIC,
        value: temperature.toString(),
        unitOfMeasure: UnitOfMeasure.CELSIUS_DEGREES,
      },
      {
        name: FILTER_METRIC,
        value: filter.toString(),
        unitOfMeasure: UnitOfMeasure.PERCENTAGE,
      },
      {
        name: LOAD_METRIC,
        value: load.toString(),
        unitOfMeasure: UnitOfMeasure.PERCENTAGE,
      },
      {
        name: LOW_PRESSURE_METRIC,
        value: lowPressure.toString(),
        unitOfMeasure: UnitOfMeasure.BAR,
      },
      {
        name: HIGH_PRESSURE_METRIC,
        value: highPressure.toString(),
        unitOfMeasure: UnitOfMeasure.BAR,
      },
      {
        name: OTHER_PRESSURE_METRIC,
        value: otherPressure.toString(),
        unitOfMeasure: UnitOfMeasure.BAR,
      },
    ]);
  }, METRIC_SEND_INTERVAL);

  return () => clearInterval(interval);
};
