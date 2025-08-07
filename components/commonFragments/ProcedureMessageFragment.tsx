import { useTranslation } from "react-i18next";
import SetupSvg from "@/assets/svgs/setup.svg";
import { View } from "react-native";
import { Text } from "../ui/text";
import { Button } from "../ui/button";

export interface ProcedureMessageFragmentProps {
  type: "error" | "warning";
  messageKey: string;
  onOKPress: () => void;
}

const titleByType: Record<ProcedureMessageFragmentProps["type"], string> = {
  error: "misc.error",
  warning: "misc.warning",
};

export const ProcedureMessageFragment = ({
  type,
  messageKey,
  onOKPress,
}: ProcedureMessageFragmentProps) => {
  const { t } = useTranslation();

  return (
    <View className="flex-1 justify-center items-center gap-4 rounded">
      <SetupSvg />
      <View className="gap-2">
        <Text className="paragraph-semibold-large text-center">
          {t(titleByType[type])}
        </Text>
        {type === "error" && (
          <Text className="paragraph-regular-medium text-center">
            {t("errors.procedureError")}
          </Text>
        )}
        <Text className="paragraph-regular-medium text-center">
          {t(messageKey)}
        </Text>
      </View>
      <Button onPress={onOKPress}>
        <Text className="paragraph-regular-medium">{t("misc.ok")}</Text>
      </Button>
    </View>
  );
};
