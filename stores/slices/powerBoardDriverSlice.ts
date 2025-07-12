import {
  getConvertUnitOfMeasure,
  getUnitOfMeasureType,
  UnitOfMeasure,
} from "@/lib/utils";
import convert, { Unit } from "convert-units";
import { StateCreator } from "zustand";
import { UnitOfMeasureSettings } from "./appConfigSlice";
import { Metric } from "@/types";

type PowerBoardDriverMetricValue = {
  raw: string; // board raw value in board unit of measure
  unitOfMeasure: UnitOfMeasure; // board unit of measure
  converted: string; // gui display value converted in unit of measure chosen by user
};

export type PowerBoardDriverState = {
  [key: string]: PowerBoardDriverMetricValue;
};

export type PowerBoardDriverStore = {
  pbdMetrics: PowerBoardDriverState;
  setPowerBoardDriverMetrics(metrics: Metric[]): void;
  clearPbdMetrics(): void;
};

const convertMetricValue = (
  value: string,
  sourceUnit: UnitOfMeasure,
  targetUnit: UnitOfMeasure
): string => {
  if (
    Number.isNaN(Number(value)) ||
    !sourceUnit ||
    !targetUnit ||
    sourceUnit === targetUnit
  )
    return value;

  return convert(Number(value))
    .from(getConvertUnitOfMeasure(sourceUnit) as Unit)
    .to(getConvertUnitOfMeasure(targetUnit) as Unit)
    .toString();
};

const formatDecimalValue = (value: string, decimals: number): string => {
  const numValue = Number(value);
  if (Number.isNaN(numValue)) return value;
  return numValue.toFixed(decimals);
};

const getMetricField = (
  metric: Metric,
  userUnitOfMeasures: UnitOfMeasureSettings
): PowerBoardDriverMetricValue => {
  const result: PowerBoardDriverMetricValue = {
    raw: metric.value ?? "",
    unitOfMeasure: UnitOfMeasure.UNIT_UNKNOWN,
    converted: "",
  };

  result.converted = result.raw;

  // Handle unit conversion
  if (metric.unitOfMeasure) {
    result.unitOfMeasure = metric.unitOfMeasure;
    const measureType = getUnitOfMeasureType(result.unitOfMeasure);
    const userUnit = measureType
      ? userUnitOfMeasures[measureType as keyof UnitOfMeasureSettings]
      : null;

    if (userUnit && userUnit !== result.unitOfMeasure) {
      result.converted = convertMetricValue(
        result.raw,
        result.unitOfMeasure,
        userUnit
      );
    }
  }

  // Handle decimal formatting
  if (metric.decimals !== undefined) {
    result.converted = formatDecimalValue(result.converted, metric.decimals);
  }

  return result;
};

export const createPowerBoardDriverSlice: StateCreator<
  PowerBoardDriverStore & {
    userSettings: { unitOfMeasures: UnitOfMeasureSettings }; // access appConfig slice
  },
  [],
  [],
  PowerBoardDriverStore
> = (set, get) => ({
  pbdMetrics: {},
  setPowerBoardDriverMetrics(metrics: Metric[]) {
    const userUnitOfMeasures = get().userSettings.unitOfMeasures;
    set({
      pbdMetrics: {
        ...get().pbdMetrics,
        ...metrics.reduce((acc, metric) => {
          if (metric.name) {
            acc[metric.name] = getMetricField(metric, userUnitOfMeasures);
          }
          return acc;
        }, {} as PowerBoardDriverState),
      },
    });
  },
  clearPbdMetrics() {
    set({ pbdMetrics: {} });
  },
});
