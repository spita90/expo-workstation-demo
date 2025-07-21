import AutomaticProc from "@/assets/svgs/automatic_proc.svg";
import Info from "@/assets/svgs/info.svg";
import Maintenance from "@/assets/svgs/maintenance.svg";
import ManualProc from "@/assets/svgs/manual_proc.svg";
import Service from "@/assets/svgs/service.svg";
import Setup from "@/assets/svgs/setup.svg";
import { OperationGrid } from "@/components/operation/OperationGrid";
import { Page } from "@/components/Page";
import { Operation } from "@/types";
import { Stack } from "expo-router";

const OPERATIONS: Operation[] = [
  {
    translationKey: "operations.automatic",
    icon: AutomaticProc,
    linkTo: "/automaticProcedures",
  },
  {
    translationKey: "operations.manual",
    icon: ManualProc,
    linkTo: "/manualProcedures",
  },
  {
    translationKey: "operations.setup",
    icon: Setup,
    linkTo: "/setup",
  },
  {
    translationKey: "operations.maintenance",
    icon: Maintenance,
    linkTo: "/maintenance",
  },
  {
    translationKey: "operations.info",
    icon: Info,
    linkTo: "/info",
  },
];

export default function HomeScreen() {
  return (
    <>
      <Stack.Screen name="home" />
      <Page noBackButton>
        <OperationGrid operations={OPERATIONS} />
      </Page>
    </>
  );
}
