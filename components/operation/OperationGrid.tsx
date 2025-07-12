import { cn } from "@/lib/utils";
import { Operation } from "@/types";
import { View } from "react-native";
import { OperationCard } from "./OperationCard";

export interface OperationGridProps {
  operations: Operation[];
}

export const OperationGrid = ({ operations }: OperationGridProps) => {
  return (
    <View className="w-fit justify-center">
      <View
        className={cn("grid gap-2 items-center justify-center", {
          "grid-cols-3": operations.length > 4,
          "grid-cols-2": operations.length <= 4,
        })}
      >
        {operations.map((operation, index) => (
          <OperationCard operation={operation} key={index} />
        ))}
      </View>
    </View>
  );
};
