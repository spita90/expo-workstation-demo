import { View } from "react-native";
import { Text } from "./ui/text";

export interface StepChipProps {
  currentStep: number;
  totalSteps: number;
  label?: string;
}

export const StepChip = ({ currentStep, totalSteps, label }: StepChipProps) => {
  return (
    <View className="flex-row gap-3 items-center">
      <View className="px-4 py-2 rounded bg-white/20">
        <Text className="paragraph-semibold-large">
          {currentStep}/{totalSteps}
        </Text>
      </View>
      {label && <Text className="title-semibold-medium">{label}</Text>}
    </View>
  );
};
