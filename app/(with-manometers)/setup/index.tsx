import LanguageIconSvg from "@/assets/svgs/language_icon.svg";
import QuicksetupIconSvg from "@/assets/svgs/quicksetup_icon.svg";
import UnitOfMeasureIconSvg from "@/assets/svgs/unit_of_measure_icon.svg";
import { OperationList } from "@/components/operation/OperationList";
import { Page } from "@/components/Page";
import { Operation } from "@/types";
import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

export const QUICK_SETUP_OPERATIONS: Operation[] = [
  {
    icon: LanguageIconSvg,
    translationKey: "operations.setup_.language",
    linkTo: "/setup/language",
  },
  {
    icon: UnitOfMeasureIconSvg,
    translationKey: "operations.setup_.unitsOfMeasure",
    linkTo: "/setup/unitsOfMeasure",
  },
];

const SETUP_OPERATIONS: Operation[] = [
  {
    icon: LanguageIconSvg,
    translationKey: "operations.setup_.language",
    linkTo: "/setup/language",
  },
  {
    icon: UnitOfMeasureIconSvg,
    translationKey: "operations.setup_.unitsOfMeasure",
    linkTo: "/setup/unitsOfMeasure",
  },
];

export default function SetupScreen() {
  const { t } = useTranslation();

  return (
    <Page title={t("operationTitles.setup")} border="popOver">
      <Stack.Screen name="setup" />
      <OperationList operations={SETUP_OPERATIONS} />
    </Page>
  );
}
