import { BackButton } from "@/components/BackButton";
import { Page } from "@/components/Page";
import { PauseButton } from "@/components/PauseButton";
import { ConnectDeviceFragment } from "@/components/commonFragments/ConnectDeviceFragment";
import { DisconnectDeviceFragment } from "@/components/commonFragments/DisconnectDeviceFragment";
import { PleaseWaitFragment } from "@/components/commonFragments/PleaseWaitFragment";
import { SecondProcedureRunningFragment } from "@/components/secondProcedure/SecondProcedureRunningFragment";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export type SecondProcedureRunningScreenProps = {
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

export default function SecondProcedureRunningScreen() {
  const { vin, durationSeconds } =
    useLocalSearchParams<SecondProcedureRunningScreenProps>();

  const router = useRouter();
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
      if (procedureState !== SecondProcedureState.RUNNING) return;
      if (totalElapsed >= Number(durationSeconds)) {
        setProcedureState(SecondProcedureState.DISCONNECT_DEVICE);
        return;
      }
      setTotalElapsed((currentElapsed) => currentElapsed + 1);
    }, 1000);
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

  const isRunningSecondProcedure = [SecondProcedureState.RUNNING].includes(
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

  const SecondProcedureBackButton = () => {
    if (procedureState === SecondProcedureState.CONNECT_DEVICE)
      return <BackButton onPress={handleBackButtonPress} />;
    if (isRunningSecondProcedure || isPaused)
      return <PauseButton isPaused={isPaused} onPress={onPauseTogglePress} />;
  };

  return (
    <Page
      title={t("operationTitles.secondProcedure")}
      border={isWaiting ? "basic" : "popOver"}
      noBackButton={isWaiting}
      backButton={<SecondProcedureBackButton />}
    >
      {procedureState === SecondProcedureState.CONNECT_DEVICE && (
        <ConnectDeviceFragment onContinuePress={sendMessageRead} />
      )}
      {isWaiting && <PleaseWaitFragment type="startup" />}
      {procedureState === SecondProcedureState.RUNNING && (
        <SecondProcedureRunningFragment
          label={t(
            "operations.manual_.secondProcedure_.secondProcedureInProgress"
          )}
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
