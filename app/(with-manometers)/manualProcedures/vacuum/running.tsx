import { BackButton } from "@/components/BackButton";
import { Page } from "@/components/Page";
import { PauseButton } from "@/components/PauseButton";
import { ConnectDeviceFragment } from "@/components/commonFragments/ConnectDeviceFragment";
import { DisconnectDeviceFragment } from "@/components/commonFragments/DisconnectDeviceFragment";
import { PleaseWaitFragment } from "@/components/commonFragments/PleaseWaitFragment";
import { ProcedureMessageFragment } from "@/components/commonFragments/ProcedureMessageFragment";
import { VacuumRunningFragment } from "@/components/vacuum/VacuumRunningFragment";
import { useToast } from "@/hooks/use-toast";
import { useGlobalStore } from "@/stores/globalStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useShallow } from "zustand/shallow";

const VACUUM_ALARM_STATES = [
  FSMVacuumStates.FSM_VACUUM_STATE_ALARM,
  FSMVacuumStates.FSM_VACUUM_STATE_ALARM_LEAK_DETECTED,
  FSMVacuumStates.FSM_VACUUM_STATE_ALARM_SYSTEM_NOT_EMPTY,
];

const errorMessageKeysByProcedureState: Partial<
  Record<FSMVacuumStates, string>
> = {
  [FSMVacuumStates.FSM_VACUUM_STATE_ALARM]: "errors.vacuum.alarm",
  [FSMVacuumStates.FSM_VACUUM_STATE_ALARM_LEAK_DETECTED]:
    "errors.vacuum.leakDetected",
  [FSMVacuumStates.FSM_VACUUM_STATE_ALARM_SYSTEM_NOT_EMPTY]:
    "errors.vacuum.systemNotEmpty",
};

export type VacuumRunningScreenProps = {
  vin: string;
};

export default function VacuumRunningScreen() {
  const { vin } = useLocalSearchParams<VacuumRunningScreenProps>();

  const router = useRouter();
  const { errorToast } = useToast();
  const { t } = useTranslation();

  const finalElapsedTime = useRef<number>(0);
  const finalHoldTime = useRef<number>(0);

  const { procedureStateMetric, vacuumElapsedMetric, vacuumHoldElapsedMetric } =
    useGlobalStore(
      useShallow((state) => ({
        procedureStateMetric: state.currentProcedureMetrics[FSM_STATE_METRIC],
        vacuumElapsedMetric:
          state.currentProcedureMetrics[VACUUM_TIME_ELAPSED_METRIC],
        vacuumHoldElapsedMetric:
          state.currentProcedureMetrics[VACUUM_HOLD_TIME_ELAPSED_METRIC],
      }))
    );

  const procedureState = (getMetricValue(procedureStateMetric) ??
    0) as FSMVacuumStates;

  const vacuumElapsed = vacuumElapsedMetric
    ? Number(getMetricValue(vacuumElapsedMetric))
    : undefined;
  const vacuumHoldElapsed = vacuumHoldElapsedMetric
    ? Number(getMetricValue(vacuumHoldElapsedMetric))
    : undefined;

  const sendMessageRead = async () => {
    try {
      await HttpClient.messageReadProcedure("ac-vacuum");
    } catch (e: any) {
      console.error(e);
      errorToast(e.message ?? e?.description ?? t("errors.genericError"));
    }
  };

  useEffect(() => {
    if (
      [
        ...VACUUM_ALARM_STATES,
        FSMVacuumStates.FSM_VACUUM_STATE_MESSAGE_DISCONNECT_HP_LP,
      ].includes(procedureState)
    ) {
      finalElapsedTime.current = vacuumElapsed ?? 0;
      finalHoldTime.current = vacuumHoldElapsed ?? 0;
      return;
    }
    if (procedureState === FSMVacuumStates.FSM_VACUUM_STATE_CLOSED) {
      router.push({
        pathname: "/manualProcedures/vacuum/finished",
        params: {
          vin: vin,
          elapsedTime: finalElapsedTime.current,
          holdTime: finalHoldTime.current,
        },
      });
    }
  }, [procedureState]);

  const isWaiting = [
    FSMVacuumStates.FSM_VACUUM_STATE_INITIAL_PRESSURE_CHECK,
    FSMVacuumStates.FSM_VACUUM_STATE_VACUUM_RUNNING_LEAK_TEST,
  ].includes(procedureState);

  const isRunningVacuum = [
    FSMVacuumStates.FSM_VACUUM_STATE_VACUUM_RUNNING,
    FSMVacuumStates.FSM_VACUUM_STATE_LEAK_DETECTION,
  ].includes(procedureState);

  const isPaused = [FSMVacuumStates.FSM_VACUUM_STATE_PAUSE].includes(
    procedureState
  );

  const isInAlarmState = VACUUM_ALARM_STATES.includes(procedureState);

  const onPauseTogglePress = async () => {
    try {
      if (isPaused) {
        await HttpClient.resumeProcedure("ac-vacuum");
      } else {
        await HttpClient.pauseProcedure("ac-vacuum");
      }
    } catch (e: any) {
      console.error(e);
      errorToast(e.message ?? e?.description ?? t("errors.genericError"));
    }
  };

  const handleBackButtonPress = async () => {
    router.dismissTo("/manualProcedures");
  };

  const VacuumBackButton = () => {
    if (
      procedureState === FSMVacuumStates.FSM_VACUUM_STATE_MESSAGE_CONNECT_HP_LP
    )
      return <BackButton onPress={handleBackButtonPress} />;
    if (isRunningVacuum || isPaused)
      return <PauseButton isPaused={isPaused} onPress={onPauseTogglePress} />;
  };

  return (
    <Page
      title={t("operationTitles.vacuum")}
      border={isWaiting ? "basic" : "popOver"}
      noBackButton={isWaiting || isInAlarmState}
      backButton={<VacuumBackButton />}
    >
      {procedureState ===
        FSMVacuumStates.FSM_VACUUM_STATE_MESSAGE_CONNECT_HP_LP && (
        <ConnectDeviceFragment onContinuePress={sendMessageRead} />
      )}
      {isWaiting && <PleaseWaitFragment type="startup" />}
      {procedureState === FSMVacuumStates.FSM_VACUUM_STATE_VACUUM_RUNNING && (
        <VacuumRunningFragment
          label={t("operations.manual_.vacuum_.vacuumInProgress")}
          elapsedTimeMetric={VACUUM_TIME_ELAPSED_METRIC}
        />
      )}
      {procedureState === FSMVacuumStates.FSM_VACUUM_STATE_LEAK_DETECTION && (
        <VacuumRunningFragment
          label={t("operations.manual_.vacuum_.leakCheckInProgress")}
          elapsedTimeMetric={VACUUM_HOLD_TIME_ELAPSED_METRIC}
        />
      )}
      {isPaused && (
        <VacuumRunningFragment label={t("misc.paused")} showOverlayed />
      )}
      {isInAlarmState && (
        <ProcedureMessageFragment
          type="error"
          messageKey={
            errorMessageKeysByProcedureState[procedureState] ??
            "errors.genericError"
          }
          onOKPress={sendMessageRead}
        />
      )}
      {procedureState ===
        FSMVacuumStates.FSM_VACUUM_STATE_MESSAGE_DISCONNECT_HP_LP && (
        <DisconnectDeviceFragment onContinuePress={sendMessageRead} />
      )}
    </Page>
  );
}
