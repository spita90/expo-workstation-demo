import { Text } from "@/components/ui/text";
import { Operation } from "@/types";
import { useRouter } from "expo-router";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";

export interface OperationCardProps {
  operation: Operation;
}

export const OperationRow = ({ operation }: OperationCardProps) => {
  const { t } = useTranslation();
  const router = useRouter();

  const handlePress = () => {
    router.push(operation.linkTo);
  };

  return (
    <Pressable
      className="h-[100px] bg-gradient-button-fill border-gradient-button-stroke rounded shadow-md active:opacity-80"
      onPress={handlePress}
    >
      <View className="w-full h-full flex-row p-4 gap-4 items-center justify-between">
        <View className="flex-row items-center gap-4">
          {operation.icon && <operation.icon height={60} width={60} />}
          <Text className="title-semibold-medium">
            {t(operation.translationKey)}
          </Text>
        </View>
        {!operation.icon && (
          <ChevronRight size={32} color="white" className="" />
        )}
      </View>
    </Pressable>
  );
};
