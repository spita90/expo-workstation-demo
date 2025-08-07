import AutomaticProc from "@/assets/svgs/automatic_proc.svg";
import ManualProc from "@/assets/svgs/manual_proc.svg";
import Service from "@/assets/svgs/service.svg";
import Setup from "@/assets/svgs/setup.svg";
import { OperationGrid } from "@/components/operation/OperationGrid";
import { Page } from "@/components/Page";
import { Operation } from "@/types";
import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

const MANUAL_OPERATIONS: Operation[] = [
  {
    translationKey: "operations.manual_.firstProcedure",
    icon: AutomaticProc,
    linkTo: "/manualProcedures/first",
  },
  {
    translationKey: "operations.manual_.secondProcedure",
    icon: ManualProc,
    linkTo: "/manualProcedures/second",
  },
  {
    translationKey: "operations.manual_.thirdProcedure",
    icon: Service,
    linkTo: "/manualProcedures/third",
  },
  {
    translationKey: "operations.manual_.fourthProcedure",
    icon: Setup,
    linkTo: "/manualProcedures/fourth",
  },
];

export default function ManualProceduresScreen() {
  const { t } = useTranslation();

  return (
    <Page title={t("operationTitles.manual")}>
      <Stack.Screen name="manualProcedures" />
      <View className="flex flex-1 flex-row mt-4 gap-4 flex-wrap">
        <OperationGrid operations={MANUAL_OPERATIONS} />
      </View>
    </Page>
  );
}
