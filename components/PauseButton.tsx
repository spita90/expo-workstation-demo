import { Text } from "@/components/ui/text";
import { ArrowLeft, PauseCircle, PlayCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";

export interface PauseButtonProps {
  isPaused: boolean;
  onPress: () => void;
}

export const PauseButton = ({ isPaused, onPress }: PauseButtonProps) => {
  const { t } = useTranslation();

  return (
    <Button
      variant="primaryLight"
      className="flex flex-row gap-2"
      onPress={onPress}
    >
      {isPaused ? (
        <>
          <PlayCircle color="white" />
          <Text className="paragraph-semibold-large">{t("misc.resume")}</Text>
        </>
      ) : (
        <>
          <PauseCircle color="white" />
          <Text className="paragraph-semibold-large">{t("misc.pause")}</Text>
        </>
      )}
    </Button>
  );
};
