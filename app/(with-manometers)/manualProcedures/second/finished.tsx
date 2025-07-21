import { Page } from "@/components/Page";
import { ProcedureFinishedFragment } from "@/components/commonFragments/ProcedureFinishedFragment";
import { useLocalSearchParams } from "expo-router";

export type SecondProcedureFinishedScreenProps = {
  vin: string;
  elapsedTime: string;
  holdTime: string;
};

export default function SecondProcedureFinishedScreen() {
  const { vin, elapsedTime, holdTime } =
    useLocalSearchParams<SecondProcedureFinishedScreenProps>();

  return (
    <Page border="popOver" noBackButton>
      <ProcedureFinishedFragment
        reportData={[
          {
            fieldKey: "operations.manual_.secondProcedure_.secondProcedureTime",
            value: Number(elapsedTime),
            valueType: "duration",
          },
          {
            fieldKey:
              "operations.manual_.secondProcedure_.secondProcedureHoldTime",
            value: Number(holdTime),
            valueType: "duration",
          },
          { fieldKey: "fields.vin", value: vin, valueType: "label" },
        ]}
      />
    </Page>
  );
}
