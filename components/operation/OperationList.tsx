import { Operation } from "@/types";
import { View } from "react-native";
import { ScrollableList } from "../ScrollableList";
import { OperationRow } from "./OperationRow";

export interface OperationListProps {
  operations: Operation[];
}

export const OperationList = ({ operations }: OperationListProps) => {
  return (
    <ScrollableList
      items={operations}
      renderItem={({ item }) => <OperationRow operation={item} />}
      itemSeparatorComponent={() => <View className="h-4" />}
    />
  );
};
