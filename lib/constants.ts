import { Transition } from "motion/react";

export const TANK_TEMPERATURE_CELSIUS_MIN = 0;
export const TANK_TEMPERATURE_CELSIUS_MAX = 60;

export const TANK_MANOMETER_PSI_MIN = 0;
export const TANK_MANOMETER_PSI_MAX = 360;
export const TANK_MANOMETER_BAR_MIN = 0;
export const TANK_MANOMETER_BAR_MAX = 25;

export const MANOMETER_MOTION_TRANSITION: Transition = {
  duration: 0.1,
};
