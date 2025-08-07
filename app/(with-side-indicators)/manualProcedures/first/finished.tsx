import { Page } from "@/components/Page";
import { ProcedureFinishedFragment } from "@/components/commonFragments/ProcedureFinishedFragment";
import { useGlobalStore } from "@/stores/globalStore";
import { UNITS_OF_MEASURE_SYMBOLS } from "@/types";
import { useLocalSearchParams } from "expo-router";
import { useShallow } from "zustand/shallow";

export type FirstProcedureFinishedScreenProps = {
  vin: string;
  innerPhaseElapsedTime: string;
  totalTime: string;
  aAmount: string;
  bAmount: string;
};

export default function FirstProcedureFinishedScreen() {
  const { vin, innerPhaseElapsedTime, totalTime, aAmount, bAmount } =
    useLocalSearchParams<FirstProcedureFinishedScreenProps>();
  const { userUnitsOfMeasure } = useGlobalStore(
    useShallow((state) => ({
      userUnitsOfMeasure: state.userSettings.unitOfMeasures,
    }))
  );

  return (
    <Page border="popOver" noBackButton>
      <ProcedureFinishedFragment
        reportData={[
          {
            fieldKey:
              "operations.manual_.firstProcedure_.innerPhaseElapsedTime",
            value: Number(innerPhaseElapsedTime),
            valueType: "duration",
          },
          {
            fieldKey: "operations.manual_.firstProcedure_.totalTime",
            value: Number(totalTime),
            valueType: "duration",
          },
          {
            fieldKey: "operations.manual_.firstProcedure_.valueA",
            value: `${Number(aAmount)} ${
              UNITS_OF_MEASURE_SYMBOLS[userUnitsOfMeasure.volume]
            }`,
            valueType: "label",
          },
          {
            fieldKey: "operations.manual_.firstProcedure_.value1",
            value: `${Number(bAmount)} ${
              UNITS_OF_MEASURE_SYMBOLS[userUnitsOfMeasure.weight]
            }`,
            valueType: "label",
          },
          { fieldKey: "fields.vin", value: vin, valueType: "label" },
        ]}
      />
    </Page>
  );
}
