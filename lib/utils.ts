import { clsx, type ClassValue } from "clsx";
import { Unit } from "convert-units";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatManometerNumber(value: number): string {
  const formattedValue = value.toFixed(2); // Sempre 2 decimali
  const [integerPart, decimalPart] = formattedValue.split(".");
  const formattedIntegerPart =
    integerPart.length === 1 ? "0" + integerPart : integerPart;
  return `${formattedIntegerPart}.${decimalPart}`;
}

export type UnitOfMeasureType =
  | "pressure"
  | "weight"
  | "temperature"
  | "volume";

export enum UnitOfMeasure {
  UNIT_UNKNOWN,
  BAR,
  POUND_PER_SQUARE_INCH,
  GRAMS,
  POUND,
  OUNCE,
  OUNCE_USCS,
  CELSIUS_DEGREES,
  FAHRENHEIT_DEGREES,
  MILLILITERS,
  FL_OUNCE,
  FL_OUNCE_USCS,
  PERCENTAGE,
}

export const getUnitOfMeasureType = (
  unitOfMeasure: UnitOfMeasure
): UnitOfMeasureType | undefined => {
  switch (unitOfMeasure) {
    case UnitOfMeasure.BAR:
    case UnitOfMeasure.POUND_PER_SQUARE_INCH:
      return "pressure";
    case UnitOfMeasure.GRAMS:
    case UnitOfMeasure.POUND:
    case UnitOfMeasure.OUNCE:
    case UnitOfMeasure.OUNCE_USCS:
      return "weight";
    case UnitOfMeasure.CELSIUS_DEGREES:
    case UnitOfMeasure.FAHRENHEIT_DEGREES:
      return "temperature";
    case UnitOfMeasure.MILLILITERS:
    case UnitOfMeasure.FL_OUNCE:
    case UnitOfMeasure.FL_OUNCE_USCS:
      return "volume";
    default:
      return undefined;
  }
};

export const unitsOfMeasureByType: Record<UnitOfMeasureType, UnitOfMeasure[]> =
  {
    pressure: [UnitOfMeasure.BAR, UnitOfMeasure.POUND_PER_SQUARE_INCH],
    weight: [UnitOfMeasure.GRAMS, UnitOfMeasure.POUND, UnitOfMeasure.OUNCE],
    temperature: [
      UnitOfMeasure.CELSIUS_DEGREES,
      UnitOfMeasure.FAHRENHEIT_DEGREES,
    ],
    volume: [UnitOfMeasure.MILLILITERS, UnitOfMeasure.FL_OUNCE],
  };

export function getConvertUnitOfMeasure(
  unitOfMeasure: UnitOfMeasure
): Unit | undefined {
  switch (unitOfMeasure) {
    case UnitOfMeasure.BAR:
      return "bar";
    case UnitOfMeasure.POUND_PER_SQUARE_INCH:
      return "psi";
    case UnitOfMeasure.GRAMS:
      return "g";
    case UnitOfMeasure.POUND:
      return "lb";
    case UnitOfMeasure.OUNCE:
      return "oz";
    case UnitOfMeasure.CELSIUS_DEGREES:
      return "C";
    case UnitOfMeasure.FAHRENHEIT_DEGREES:
      return "F";
    case UnitOfMeasure.MILLILITERS:
      return "ml";
    case UnitOfMeasure.FL_OUNCE:
      return "fl-oz";
    default:
      return undefined;
  }
}

export const getMinutesLabelFromSeconds = (seconds: number): string => {
  return `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0")}`;
};

export function getManometerHeight({
  pressureValue,
  unitOfMeasure,
  scale,
}: {
  pressureValue: number;
  unitOfMeasure: UnitOfMeasure;
  scale: { psi: number; bar: number; height: number }[];
}) {
  const isPsi = unitOfMeasure === UnitOfMeasure.POUND_PER_SQUARE_INCH;
  //Find the two points between which the pressure value is located
  let lower = scale[0];
  let upper = scale[scale.length - 1];
  for (let i = 0; i < scale.length - 1; i++) {
    if (
      pressureValue >= (isPsi ? scale[i].psi : scale[i].bar) &&
      pressureValue <= (isPsi ? scale[i + 1].psi : scale[i + 1].bar)
    ) {
      lower = scale[i];
      upper = scale[i + 1];
      break;
    }
  }
  // Interpolate the height between the two points
  const height =
    lower.height +
    ((pressureValue - (isPsi ? lower.psi : lower.bar)) /
      (isPsi ? upper.psi - lower.psi : upper.bar - lower.bar)) *
      (upper.height - lower.height);

  return height;
}

export function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function getEnumKeyByValue<T extends object>(
  enumObj: T,
  value: T[keyof T]
): keyof T | undefined {
  return Object.keys(enumObj).find(
    (key) => enumObj[key as keyof T] === value
  ) as keyof T | undefined;
}
