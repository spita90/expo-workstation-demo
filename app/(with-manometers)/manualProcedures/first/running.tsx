import { BackButton } from "@/components/BackButton";
import { Page } from "@/components/Page";
import { PauseButton } from "@/components/PauseButton";
import { ConnectDeviceFragment } from "@/components/commonFragments/ConnectDeviceFragment";
import { DisconnectDeviceFragment } from "@/components/commonFragments/DisconnectDeviceFragment";
import { PleaseWaitFragment } from "@/components/commonFragments/PleaseWaitFragment";
import { FirstProcedureRunningFragment } from "@/components/firstProcedure/FirstProcedureRunningFragment";
import {
  getConvertUnitOfMeasure,
  getUnitOfMeasureType,
  UnitOfMeasure,
} from "@/lib/utils";
import { useGlobalStore } from "@/stores/globalStore";
import convert, { Unit } from "convert-units";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useShallow } from "zustand/shallow";

export type RecoveryRecycleRunningScreenProps = {
  vin: string;
};

export enum FirstProcedureState {
  INITIAL_CHECK,
  CONNECT_DEVICE,
  RUNNING,
  PAUSED,
  DISCONNECT_DEVICE,
  CLOSED,
}

const A_AMOUNT_UOM = UnitOfMeasure.GRAMS;
const B_AMOUNT_UOM = UnitOfMeasure.GRAMS;

export default function FirstProcedureRunningScreen() {
  const { vin } = useLocalSearchParams<RecoveryRecycleRunningScreenProps>();

  const finalInnerPhaseElapsedTime = useRef<number>(0);
  const finalTotalTime = useRef<number>(0);
  const finalAAmount = useRef<number>(0);
  const finalBAmount = useRef<number>(0);

  const router = useRouter();
  const { t } = useTranslation();

  const { userUnitsOfMeasure } = useGlobalStore(
    useShallow((state) => ({
      userUnitsOfMeasure: state.userSettings.unitOfMeasures,
    }))
  );

  const [procedureState, setProcedureState] = useState<FirstProcedureState>(
    FirstProcedureState.INITIAL_CHECK
  );
  const [innerPhaseElapsed, setInnerPhaseElapsed] = useState<number>(0);
  const [totalElapsed, setTotalElapsed] = useState<number>(0);
  const [aAmount, setAAmount] = useState<number>(0);
  const [bAmount, setBAmount] = useState<number>(0);

  const sendMessageRead = async () => {
    if (procedureState === FirstProcedureState.CONNECT_DEVICE) {
      setProcedureState(FirstProcedureState.RUNNING);
    }
    if (procedureState === FirstProcedureState.DISCONNECT_DEVICE) {
      setProcedureState(FirstProcedureState.CLOSED);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTotalElapsed((currentElapsed) => currentElapsed + 1);
      setInnerPhaseElapsed((currentElapsed) => currentElapsed + 1);
    }, 200);
    if (procedureState === FirstProcedureState.INITIAL_CHECK) {
      setTimeout(() => {
        setProcedureState(FirstProcedureState.CONNECT_DEVICE);
      }, 1000);
    }
    return () => clearInterval(interval);
  });

  useEffect(() => {
    if ([FirstProcedureState.DISCONNECT_DEVICE].includes(procedureState)) {
      finalInnerPhaseElapsedTime.current = innerPhaseElapsed ?? 0;
      finalTotalTime.current = totalElapsed ?? 0;
      finalAAmount.current = convert(aAmount)
        .from(getConvertUnitOfMeasure(A_AMOUNT_UOM) as Unit)
        .to(
          getConvertUnitOfMeasure(
            userUnitsOfMeasure[getUnitOfMeasureType(A_AMOUNT_UOM) ?? "volume"]
          ) as Unit
        );
      finalBAmount.current = convert(bAmount)
        .from(getConvertUnitOfMeasure(B_AMOUNT_UOM) as Unit)
        .to(
          getConvertUnitOfMeasure(
            userUnitsOfMeasure[getUnitOfMeasureType(B_AMOUNT_UOM) ?? "weight"]
          ) as Unit
        );
      return;
    }
    if (procedureState === FirstProcedureState.CLOSED) {
      router.push({
        pathname: "/manualProcedures/first/finished",
        params: {
          vin: vin,
          innerPhaseElapsedTime: finalInnerPhaseElapsedTime.current,
          totalTime: finalTotalTime.current,
          aAmount: finalAAmount.current.toFixed(2),
          bAmount: finalBAmount.current.toFixed(2),
        },
      });
    }
  }, [procedureState]);

  const isWaiting = [FirstProcedureState.INITIAL_CHECK].includes(
    procedureState
  );

  const isRunning = [FirstProcedureState.RUNNING].includes(procedureState);

  const isPaused = [FirstProcedureState.PAUSED].includes(procedureState);

  const onPauseTogglePress = async () => {
    if (isPaused) {
      setProcedureState(FirstProcedureState.RUNNING);
    } else {
      setProcedureState(FirstProcedureState.PAUSED);
    }
  };

  const handleBackButtonPress = async () => {
    router.dismissTo("/manualProcedures");
  };

  const RecoveryBackButton = () => {
    if (procedureState === FirstProcedureState.CONNECT_DEVICE)
      return <BackButton onPress={handleBackButtonPress} />;
    if (isRunning || isPaused)
      return <PauseButton isPaused={isPaused} onPress={onPauseTogglePress} />;
  };

  return (
    <Page
      title={t("operationTitles.recoveryRecycle")}
      border={isWaiting ? "basic" : "popOver"}
      noBackButton={isWaiting}
      backButton={<RecoveryBackButton />}
    >
      {procedureState === FirstProcedureState.CONNECT_DEVICE && (
        <ConnectDeviceFragment onContinuePress={sendMessageRead} />
      )}
      {isWaiting && <PleaseWaitFragment />}
      {(isRunning || isPaused) && <FirstProcedureRunningFragment />}
      {procedureState === FirstProcedureState.DISCONNECT_DEVICE && (
        <DisconnectDeviceFragment onContinuePress={sendMessageRead} />
      )}
    </Page>
  );
}
