import SettingsIconSvg from "@/assets/svgs/settings_icon.svg";
import { OperationList } from "@/components/operation/OperationList";
import { Page } from "@/components/Page";
import { Operation } from "@/types";
import { Stack } from "expo-router";
import { t } from "i18next";

const MAINTENANCE_OPERATIONS: Operation[] = [
  {
    icon: SettingsIconSvg,
    translationKey: "operations.maintenance_.testIo",
    linkTo: "/maintenance/testIo",
  },
];

export default function MaintenanceScreen() {
  return (
    <Page title={t("operationTitles.maintenance")} border="popOver">
      <Stack.Screen name="maintenance" />
      <OperationList operations={MAINTENANCE_OPERATIONS} />
    </Page>
  );
}
