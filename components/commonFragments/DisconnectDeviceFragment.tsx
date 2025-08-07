import reactLogoLottie from "@/assets/lottie/react-logo.json";
import Lottie from "lottie-react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Button } from "../ui/button";
import { Text } from "../ui/text";

export interface DisconnectHpLpFragmentProps {
  onContinuePress: () => void;
}

export const DisconnectDeviceFragment = ({
  onContinuePress,
}: DisconnectHpLpFragmentProps) => {
  const { t } = useTranslation();

  return (
    <View className="flex-1 flex-row gap-4">
      <View className="flex-1 bg-white/10 p-4 justify-between rounded">
        <View className="gap-2">
          <Text className="title-semibold-medium">
            {t("misc.instructions")}
          </Text>
          <Text className="paragraph-regular-medium">
            {t("messages.disconnectDeviceMessage")}
          </Text>
        </View>
        <View className="items-end">
          <Button onPress={onContinuePress}>
            <Text>{t("misc.continue")}</Text>
          </Button>
        </View>
      </View>
      <View className="justify-between">
        <Lottie
          className="w-[220px] bg-white/20 overflow-hidden border-2 border-white/20 rounded-full"
          animationData={reactLogoLottie}
          autoplay
          loop
        />
      </View>
    </View>
  );
};
