import { Page } from "@/components/Page";
import { ProcedureFinishedFragment } from "@/components/commonFragments/ProcedureFinishedFragment";
import { useLocalSearchParams } from "expo-router";

export type VacuumFinishedScreenProps = {
  vin: string;
  elapsedTime: string;
  holdTime: string;
};

export default function VacuumFinishedScreen() {
  const { vin, elapsedTime, holdTime } =
    useLocalSearchParams<VacuumFinishedScreenProps>();

  return (
    <Page border="popOver" noBackButton>
      <ProcedureFinishedFragment
        reportData={[
          {
            fieldKey: "operations.manual_.vacuum_.vacuumTime",
            value: Number(elapsedTime),
            valueType: "duration",
          },
          {
            fieldKey: "operations.manual_.vacuum_.vacuumHoldTime",
            value: Number(holdTime),
            valueType: "duration",
          },
          { fieldKey: "fields.vin", value: vin, valueType: "label" },
        ]}
      />
    </Page>
  );
}
