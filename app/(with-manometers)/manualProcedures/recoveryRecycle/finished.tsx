import { Page } from "@/components/Page";
import { ProcedureFinishedFragment } from "@/components/commonFragments/ProcedureFinishedFragment";
import { useGlobalStore } from "@/stores/globalStore";
import { UNITS_OF_MEASURE_SYMBOLS } from "@/types";
import { useLocalSearchParams } from "expo-router";
import { useShallow } from "zustand/shallow";

export type RecoveryRecycleFinishedScreenProps = {
  vin: string;
  oilDischargeElapsedTime: string;
  totalRecoveryTime: string;
  recoveredOil: string;
  recoveredGas: string;
};

export default function RecoveryRecycleFinishedScreen() {
  const {
    vin,
    oilDischargeElapsedTime,
    totalRecoveryTime,
    recoveredOil,
    recoveredGas,
  } = useLocalSearchParams<RecoveryRecycleFinishedScreenProps>();
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
            fieldKey: "operations.manual_.recoveryRecycle_.oilDischargeTime",
            value: Number(oilDischargeElapsedTime),
            valueType: "duration",
          },
          {
            fieldKey: "operations.manual_.recoveryRecycle_.recoveryTotalTime",
            value: Number(totalRecoveryTime),
            valueType: "duration",
          },
          {
            fieldKey: "operations.manual_.recoveryRecycle_.recoveredOil",
            value: `${Number(recoveredOil)} ${
              UNITS_OF_MEASURE_SYMBOLS[userUnitsOfMeasure.volume]
            }`,
            valueType: "label",
          },
          {
            fieldKey: "operations.manual_.recoveryRecycle_.recoveredGas",
            value: `${Number(recoveredGas)} ${
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
