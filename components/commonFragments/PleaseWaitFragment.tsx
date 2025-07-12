import { useTranslation } from "react-i18next";
import SetupSvg from "@/assets/svgs/setup.svg";
import { View } from "react-native";
import { Text } from "../ui/text";

export interface PleaseWaitFragmentProps {
  type?: "startup";
}

export const PleaseWaitFragment = ({ type }: PleaseWaitFragmentProps) => {
  const { t } = useTranslation();

  return (
    <View className="flex-1 justify-center items-center gap-2 rounded">
      <SetupSvg />
      <View>
        {type === "startup" && (
          <Text className="paragraph-regular-large text-center">
            {t("misc.startup")}
          </Text>
        )}
        <Text className="paragraph-regular-medium text-center">
          {t("misc.pleaseWait")}
        </Text>
      </View>
    </View>
  );
};
