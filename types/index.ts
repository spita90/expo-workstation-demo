import { UnitOfMeasure } from "@/lib/utils";
import { Href } from "expo-router";
import { FunctionComponent, SVGProps } from "react";

export const UNITS_OF_MEASURE_SYMBOLS: Partial<Record<UnitOfMeasure, string>> =
  {
    [UnitOfMeasure.BAR]: "bar",
    [UnitOfMeasure.POUND_PER_SQUARE_INCH]: "psi",
    [UnitOfMeasure.GRAMS]: "g",
    [UnitOfMeasure.POUND]: "lb",
    [UnitOfMeasure.OUNCE]: "oz",
    [UnitOfMeasure.CELSIUS_DEGREES]: "° C",
    [UnitOfMeasure.FAHRENHEIT_DEGREES]: "° F",
    [UnitOfMeasure.MILLILITERS]: "ml",
    [UnitOfMeasure.FL_OUNCE]: "fl. oz",
  };

export enum Peripheral {
  EV_01 = 1,
  EV_02 = 2,
  EV_03 = 3,
  EV_04 = 4,
  EV_05 = 5,
  EV_06 = 6,
  EV_07 = 7,
  EV_08 = 8,
  EV_09 = 9,
  EV_10 = 10,
  EV_11 = 11,
  EV_12 = 12,
  EV_13 = 13,
  EV_14 = 14,
  EV_15 = 15,
  EV_16 = 16,
  EV_17 = 17,
  EV_18 = 18,
  EV_19 = 19,
  EV_20 = 20,
  EV_21 = 21,
  EV_22 = 22,
  COMPRESSOR = 23,
  HEATER = 24,
  VACUUM_PUMP = 25,
  CONDENSER_FAN = 26,
}

export type Metric = {
  name: string;
  value: string;
  unitOfMeasure: UnitOfMeasure;
  decimals?: number;
};

export interface Operation {
  translationKey: string;
  icon?: FunctionComponent<SVGProps<SVGSVGElement>>;
  linkTo: Href;
}
