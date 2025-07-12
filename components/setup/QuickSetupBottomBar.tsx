import { QUICK_SETUP_OPERATIONS } from "@/app/(with-manometers)/setup";
import { Link, usePathname } from "expo-router";
import { t } from "i18next";
import { View } from "react-native";
import { StepChip } from "../StepChip";
import { Button } from "../ui/button";
import { Text } from "../ui/text";

export const QuickSetupBottomBar = () => {
  const route = usePathname();

  const quickSetupStepIndex = QUICK_SETUP_OPERATIONS.findIndex(
    (operation) =>
      typeof operation.linkTo === "object" &&
      "pathname" in operation.linkTo &&
      operation.linkTo.pathname === route
  );

  if (quickSetupStepIndex === -1) return null;

  return (
    <View className="flex-row justify-between">
      <StepChip
        currentStep={quickSetupStepIndex + 1}
        totalSteps={QUICK_SETUP_OPERATIONS.length}
      />
      <View className="flex-row gap-2">
        {quickSetupStepIndex > 0 && (
          <Link
            href={QUICK_SETUP_OPERATIONS[quickSetupStepIndex - 1].linkTo}
            asChild
          >
            <Button variant="outline">
              <Text>{t("buttons.previous")}</Text>
            </Button>
          </Link>
        )}
        {quickSetupStepIndex < QUICK_SETUP_OPERATIONS.length - 1 && (
          <Link
            href={QUICK_SETUP_OPERATIONS[quickSetupStepIndex + 1].linkTo}
            asChild
          >
            <Button>
              <Text>{t("buttons.next")}</Text>
            </Button>
          </Link>
        )}
        {quickSetupStepIndex === QUICK_SETUP_OPERATIONS.length - 1 && (
          <Link href="/setup/finishQuicksetup" asChild>
            <Button>
              <Text>{t("buttons.next")}</Text>
            </Button>
          </Link>
        )}
      </View>
    </View>
  );
};
