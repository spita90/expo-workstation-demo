import { Transition } from "motion/react";

export const TEMPERATURE_CELSIUS_MIN = 0;
export const TEMPERATURE_CELSIUS_MAX = 60;

export const OTHER_MANOMETER_PSI_MIN = 0;
export const OTHER_MANOMETER_PSI_MAX = 360;
export const OTHER_MANOMETER_BAR_MIN = 0;
export const OTHER_MANOMETER_BAR_MAX = 25;

export const LP_MANOMETER_PSI_MIN = -30;
export const LP_MANOMETER_PSI_MAX = 300;
export const LP_MANOMETER_BAR_MIN = -1;
export const LP_MANOMETER_BAR_MAX = 20;

export const HP_MANOMETER_PSI_MIN = -30;
export const HP_MANOMETER_PSI_MAX = 900;
export const HP_MANOMETER_BAR_MIN = -1;
export const HP_MANOMETER_BAR_MAX = 70;

export const TEMPERATURE_METRIC = "temperature";
export const FILTER_METRIC = "filter";
export const LOW_PRESSURE_METRIC = "lowPressure";
export const HIGH_PRESSURE_METRIC = "highPressure";
export const OTHER_PRESSURE_METRIC = "otherPressure";
export const LOAD_METRIC = "load";

export const MANOMETER_MOTION_TRANSITION: Transition = {
  duration: 0.1,
};
