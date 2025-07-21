import { BackButton } from "@/components/BackButton";
import { Page } from "@/components/Page";
import { PauseButton } from "@/components/PauseButton";
import { ConnectDeviceFragment } from "@/components/commonFragments/ConnectDeviceFragment";
import { DisconnectDeviceFragment } from "@/components/commonFragments/DisconnectDeviceFragment";
import { PleaseWaitFragment } from "@/components/commonFragments/PleaseWaitFragment";
import { SecondProcedureRunningFragment } from "@/components/secondProcedure/SecondProcedureRunningFragment";
import { useToast } from "@/hooks/use-toast";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export type VacuumRunningScreenProps = {
  vin: string;
  durationSeconds: string;
};

const enum SecondProcedureState {
  INITIAL_CHECK,
  CONNECT_DEVICE,
  RUNNING,
  PAUSED,
  DISCONNECT_DEVICE,
  CLOSED,
}

export default function VacuumRunningScreen() {
  const { vin, durationSeconds } =
    useLocalSearchParams<VacuumRunningScreenProps>();

  const router = useRouter();
  const { errorToast } = useToast();
  const { t } = useTranslation();

  const finalElapsedTime = useRef<number>(0);

  const [procedureState, setProcedureState] = useState<SecondProcedureState>(
    SecondProcedureState.INITIAL_CHECK
  );
  const [totalElapsed, setTotalElapsed] = useState<number>(0);

  const sendMessageRead = async () => {
    if (procedureState === SecondProcedureState.CONNECT_DEVICE) {
      setProcedureState(SecondProcedureState.RUNNING);
    }
    if (procedureState === SecondProcedureState.DISCONNECT_DEVICE) {
      setProcedureState(SecondProcedureState.CLOSED);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTotalElapsed((currentElapsed) => currentElapsed + 1);
    }, 200);
    if (procedureState === SecondProcedureState.INITIAL_CHECK) {
      setTimeout(() => {
        setProcedureState(SecondProcedureState.CONNECT_DEVICE);
      }, 1000);
    }
    return () => clearInterval(interval);
  });

  useEffect(() => {
    if ([SecondProcedureState.DISCONNECT_DEVICE].includes(procedureState)) {
      finalElapsedTime.current = totalElapsed ?? 0;
      return;
    }
    if (procedureState === SecondProcedureState.CLOSED) {
      router.push({
        pathname: "/manualProcedures/second/finished",
        params: {
          vin: vin,
          elapsedTime: finalElapsedTime.current,
        },
      });
    }
  }, [procedureState]);

  const isWaiting = [SecondProcedureState.INITIAL_CHECK].includes(
    procedureState
  );

  const isRunningVacuum = [SecondProcedureState.RUNNING].includes(
    procedureState
  );

  const isPaused = [SecondProcedureState.PAUSED].includes(procedureState);

  const onPauseTogglePress = async () => {
    if (isPaused) {
      setProcedureState(SecondProcedureState.RUNNING);
    } else {
      setProcedureState(SecondProcedureState.PAUSED);
    }
  };

  const handleBackButtonPress = async () => {
    router.dismissTo("/manualProcedures");
  };

  const VacuumBackButton = () => {
    if (procedureState === SecondProcedureState.CONNECT_DEVICE)
      return <BackButton onPress={handleBackButtonPress} />;
    if (isRunningVacuum || isPaused)
      return <PauseButton isPaused={isPaused} onPress={onPauseTogglePress} />;
  };

  return (
    <Page
      title={t("operationTitles.vacuum")}
      border={isWaiting ? "basic" : "popOver"}
      noBackButton={isWaiting}
      backButton={<VacuumBackButton />}
    >
      {procedureState === SecondProcedureState.CONNECT_DEVICE && (
        <ConnectDeviceFragment onContinuePress={sendMessageRead} />
      )}
      {isWaiting && <PleaseWaitFragment type="startup" />}
      {procedureState === SecondProcedureState.RUNNING && (
        <SecondProcedureRunningFragment
          label={t("operations.manual_.vacuum_.vacuumInProgress")}
          elapsedTime={totalElapsed}
          maxTime={Number(durationSeconds)}
        />
      )}
      {isPaused && (
        <SecondProcedureRunningFragment
          label={t("misc.paused")}
          showOverlayed
        />
      )}
      {procedureState === SecondProcedureState.DISCONNECT_DEVICE && (
        <DisconnectDeviceFragment onContinuePress={sendMessageRead} />
      )}
    </Page>
  );
}
