import { Text } from "@/components/ui/text";
import { Operation } from "@/types";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";

export interface OperationCardProps {
  operation: Operation;
}

export const OperationCard = ({ operation }: OperationCardProps) => {
  const { t } = useTranslation();
  const router = useRouter();

  const handlePress = () => {
    router.push(operation.linkTo);
  };

  return (
    <Pressable
      className="h-[240px] w-[250px] bg-gradient-button-fill border-gradient-button-stroke rounded shadow-md active:opacity-80"
      onPress={handlePress}
    >
      <View className="w-full h-full flex-col pt-4 gap-8 items-center justify-center">
        {operation.icon && <operation.icon height={100} width={100} />}
        <Text className="title-semibold-medium">
          {t(operation.translationKey)}
        </Text>
      </View>
    </Pressable>
  );
};
