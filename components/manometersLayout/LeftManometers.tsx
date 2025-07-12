import GasIcon from "@/assets/svgs/gas_icon.svg";
import { Text } from "@/components/ui/text";
import { LOW_PRESSURE_METRIC } from "@/lib/constants";
import { formatManometerNumber } from "@/lib/utils";
import { useGlobalStore } from "@/stores/globalStore";
import { UNITS_OF_MEASURE_SYMBOLS } from "@/types";
import { View } from "react-native";
import { useShallow } from "zustand/shallow";
import { GasLevel } from "./left/GasLevel";
import { LowPressureManometer } from "./left/LowPressureManometer";

export const LeftManometers = () => {
  const { pressureUnitOfMeasure, lowPressureMetric } = useGlobalStore(
    useShallow((state) => ({
      pressureUnitOfMeasure: state.userSettings.unitOfMeasures.pressure,
      lowPressureMetric: state.pbdMetrics[LOW_PRESSURE_METRIC],
    }))
  );

  return (
    <View className="relative h-full">
      <View className="absolute left-[47%] top-[44%] -mt-1 ml-1">
        <Text className="font-agdasima font-normal text-[42px] leading-[24px] tracking-normal">
          {formatManometerNumber(Number(lowPressureMetric?.converted ?? 0))}
        </Text>
        <Text className="font-agdasima font-normal text-[28px] leading-[24px] ml-0.5 mt-2 text-[#777777]">
          {UNITS_OF_MEASURE_SYMBOLS[pressureUnitOfMeasure]}
        </Text>
      </View>
      <LowPressureManometer />
      <GasLevel />
      <View className="absolute left-[104%] bottom-0 h-[8%]">
        <GasIcon />
      </View>
    </View>
  );
};
