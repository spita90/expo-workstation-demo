import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";

export interface BackButtonProps {
  onPress?: () => void;
}

export const BackButton = ({ onPress }: BackButtonProps) => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <Button
      variant="secondary"
      className="flex flex-row gap-2"
      onPress={() => {
        if (onPress) {
          onPress();
          return;
        }
        if (router.canGoBack()) router.back();
        else router.replace("/home");
      }}
    >
      <ArrowLeft color="white" />
      <Text className="paragraph-semibold-large">{t("misc.back")}</Text>
    </Button>
  );
};
