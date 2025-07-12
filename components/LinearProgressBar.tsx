import { clamp } from "lodash";
import { motion } from "motion/react";
import { View } from "react-native";
import { Text } from "./ui/text";

export interface LinearProgressBarProps {
  fillPercentage: number;
  hidePercentageLabel?: boolean;
}

export const LinearProgressBar = ({
  fillPercentage,
  hidePercentageLabel,
}: LinearProgressBarProps) => {
  const fillPercentageValue = clamp(fillPercentage, 0, 100);

  return (
    <View className="flex-1 flex-row gap-2">
      <View className="flex-1 justify-center">
        <motion.div
          className={`absolute bg-primary-600 rounded-full h-1`}
          animate={{
            width: fillPercentageValue + "%",
          }}
        />
        <View className="bg-white/20 rounded-full h-1 w-full" />
      </View>
      {!hidePercentageLabel ? (
        <View className="w-10 h-4 items-end justify-center">
          <Text className="paragraph-regular-medium">
            {Math.ceil(fillPercentageValue)}%
          </Text>
        </View>
      ) : (
        <View className="h-4" />
      )}
    </View>
  );
};
