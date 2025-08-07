import { HIGH_PRESSURE_METRIC, LOW_PRESSURE_METRIC } from "@/lib/constants";
import { cn, getMinutesLabelFromSeconds, UnitOfMeasure } from "@/lib/utils";
import { useGlobalStore } from "@/stores/globalStore";
import { UNITS_OF_MEASURE_SYMBOLS } from "@/types";
import { clamp } from "lodash";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { useShallow } from "zustand/shallow";
import { LinearProgressBar } from "../LinearProgressBar";
import { SemicircleGauge } from "../SemicircleGauge";
import { Text } from "../ui/text";

const VACUUM_PRESSURE_BAR_MIN = -1;
const VACUUM_PRESSURE_BAR_MAX = 50;
const VACUUM_PRESSURE_PSI_MIN = -15;
const VACUUM_PRESSURE_PSI_MAX = 725;

export interface SecondProcedureRunningFragmentProps {
  label?: string;
  elapsedTime?: number;
  maxTime?: number;
  showOverlayed?: boolean;
}

export const SecondProcedureRunningFragment = ({
  label,
  elapsedTime,
  maxTime,
  showOverlayed,
}: SecondProcedureRunningFragmentProps) => {
  const { t } = useTranslation();
  const { pressureUnitOfMeasure, lowPressureMetric, highPressureMetric } =
    useGlobalStore(
      useShallow((state) => ({
        pressureUnitOfMeasure: state.userSettings.unitOfMeasures.pressure,
        lowPressureMetric: state.pbdMetrics[LOW_PRESSURE_METRIC],
        highPressureMetric: state.pbdMetrics[HIGH_PRESSURE_METRIC],
      }))
    );

  const lowPressure = Number(lowPressureMetric?.converted ?? 0);
  const highPressure = Number(highPressureMetric?.converted ?? 0);

  const isPsi = pressureUnitOfMeasure === UnitOfMeasure.POUND_PER_SQUARE_INCH;

  const [maxPressure, setMaxPressure] = useState(
    Math.max(lowPressure, highPressure)
  );

  useEffect(() => {
    setMaxPressure(Math.max(lowPressure, highPressure));
  }, [lowPressure, highPressure]);

  const pressurePerc =
    (clamp(
      maxPressure,
      isPsi ? VACUUM_PRESSURE_PSI_MIN : VACUUM_PRESSURE_BAR_MIN,
      isPsi ? VACUUM_PRESSURE_PSI_MAX : VACUUM_PRESSURE_BAR_MAX
    ) /
      (isPsi ? VACUUM_PRESSURE_PSI_MAX : VACUUM_PRESSURE_BAR_MAX)) *
    100;

  const timerLabel =
    elapsedTime !== undefined
      ? getMinutesLabelFromSeconds(elapsedTime)
      : undefined;

  return (
    <View
      className={cn(
        "flex-1 bg-white/10 justify-center items-center gap-2 p-4 rounded",
        showOverlayed && "bg-black/20 opacity-60"
      )}
    >
      <View>
        <SemicircleGauge fillPercentage={pressurePerc} />
        <View className="absolute w-full gap-8 bottom-4">
          <View className="flex-row justify-center items-end gap-2">
            <Text className="text-center text-[50px] font-semibold">
              {maxPressure.toFixed(1)}
            </Text>
            <Text className="text-center text-[36px]">
              {UNITS_OF_MEASURE_SYMBOLS[pressureUnitOfMeasure]}
            </Text>
          </View>
          <View className="flex-row mx-8 justify-between">
            <Text className="text-left title-semibold-large">
              {isPsi ? VACUUM_PRESSURE_PSI_MIN : VACUUM_PRESSURE_BAR_MIN}
            </Text>
            <Text className="text-center title-regular-large">
              {t("fields.maxPressure")}
            </Text>
            <Text className="text-right title-semibold-large">
              {isPsi ? VACUUM_PRESSURE_PSI_MAX : VACUUM_PRESSURE_BAR_MAX}
            </Text>
          </View>
        </View>
      </View>
      <View className="w-full p-4 border-[1px] gap-2 border-white/20 rounded">
        <View className="flex-row justify-between">
          <Text className="paragraph-semibold-medium">{label}</Text>
          <Text className="paragraph-semibold-medium">
            {timerLabel ? `${timerLabel} min` : ""}
          </Text>
        </View>
        <LinearProgressBar
          fillPercentage={
            elapsedTime !== undefined && maxTime
              ? (elapsedTime / maxTime) * 100
              : 0
          }
          hidePercentageLabel={elapsedTime === undefined}
        />
      </View>
    </View>
  );
};
