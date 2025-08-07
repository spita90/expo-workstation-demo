import TankIcon from "@/assets/svgs/tank_icon.svg";
import { Text } from "@/components/ui/text";
import { HIGH_PRESSURE_METRIC } from "@/lib/constants";
import { formatManometerNumber } from "@/lib/utils";
import { useGlobalStore } from "@/stores/globalStore";
import { UNITS_OF_MEASURE_SYMBOLS } from "@/types";
import { View } from "react-native";
import { useShallow } from "zustand/shallow";
import { HighPressureManometer } from "./right/HighPressureManometer";
import { TankLevel } from "./right/TankLevel";

export const RightManometers = () => {
  const { pressureUnitOfMeasure, highPressureMetric } = useGlobalStore(
    useShallow((state) => ({
      pressureUnitOfMeasure: state.userSettings.unitOfMeasures.pressure,
      highPressureMetric: state.pbdMetrics[HIGH_PRESSURE_METRIC],
    }))
  );

  return (
    <View className="relative h-full">
      <View className="absolute right-[47%] top-[44%] items-end -mt-1 mr-1">
        <Text className="font-agdasima font-normal text-[42px] leading-[24px] tracking-normal">
          {formatManometerNumber(Number(highPressureMetric?.converted ?? 0))}
        </Text>
        <Text className="font-agdasima font-normal text-[28px] leading-[24px] ml-0.5 mt-2 text-[#777777]">
          {UNITS_OF_MEASURE_SYMBOLS[pressureUnitOfMeasure]}
        </Text>
      </View>
      <HighPressureManometer />
      <TankLevel />
      <View className="absolute right-[104%] bottom-0 h-[8%]">
        <TankIcon />
      </View>
    </View>
  );
};
