import { BackButton } from "@/components/BackButton";
import { Page } from "@/components/Page";
import { PauseButton } from "@/components/PauseButton";
import { ConnectDeviceFragment } from "@/components/commonFragments/ConnectDeviceFragment";
import { DisconnectDeviceFragment } from "@/components/commonFragments/DisconnectDeviceFragment";
import { PleaseWaitFragment } from "@/components/commonFragments/PleaseWaitFragment";
import { ProcedureMessageFragment } from "@/components/commonFragments/ProcedureMessageFragment";
import { RecoveryRecycleRunningFragment } from "@/components/recoveryRecycle/RecoveryRecycleRunningFragment";
import { useToast } from "@/hooks/use-toast";
import { getConvertUnitOfMeasure, getUnitOfMeasureType } from "@/lib/utils";
import { useGlobalStore } from "@/stores/globalStore";
import convert, { Unit } from "convert-units";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useShallow } from "zustand/shallow";

export type RecoveryRecycleRunningScreenProps = {
  vin: string;
};

export default function RecoveryRecycleRunningScreen() {
  const { vin } = useLocalSearchParams<RecoveryRecycleRunningScreenProps>();

  const finalOilDischargeElapsedTime = useRef<number>(0);
  const finalTotalRecoveryTime = useRef<number>(0);
  const finalRecoveredOil = useRef<number>(0);
  const finalRecoveredGas = useRef<number>(0);

  const router = useRouter();
  const { errorToast } = useToast();
  const { t } = useTranslation();

  const { userUnitsOfMeasure } = useGlobalStore(
    useShallow((state) => ({
      userUnitsOfMeasure: state.userSettings.unitOfMeasures,
    }))
  );

  const procedureState = (getMetricValue(procedureStateMetric) ??
    0) as FSMACRecoveryRecycleStates;

  const oilDischargeElapsed = oilDischargeTimerMetric
    ? Number(getMetricValue(oilDischargeTimerMetric))
    : undefined;

  const totalRecoveryElapsed = totalRecoveryTimerMetric
    ? Number(getMetricValue(totalRecoveryTimerMetric))
    : undefined;

  const recoveredOil = recoveredOilMetric
    ? Number(getMetricValue(recoveredOilMetric))
    : undefined;
  const recoveredOilUnitOfMeasure = Number(
    getMetricPropertyValue(recoveredOilMetric, "unit_of_measure")
  ) as UnitOfMeasure;

  const recoveredGas = recoveredGasMetric
    ? Number(getMetricValue(recoveredGasMetric))
    : undefined;
  const recoveredGasUnitOfMeasure = Number(
    getMetricPropertyValue(recoveredGasMetric, "unit_of_measure")
  ) as UnitOfMeasure;

  const sendMessageRead = async () => {
    try {
      await HttpClient.messageReadProcedure("ac-recovery");
    } catch (e: any) {
      console.error(e);
      errorToast(e.message ?? e?.description ?? t("errors.genericError"));
    }
  };

  useEffect(() => {
    if (
      [
        ...RECOVERY_ALARM_STATES,
        FSMACRecoveryRecycleStates.FSM_AC_RECOVERY_RECYCLE_STATE_MESSAGE_DISCONNECT_HP_LP,
      ].includes(procedureState)
    ) {
      finalOilDischargeElapsedTime.current = oilDischargeElapsed ?? 0;
      finalTotalRecoveryTime.current = totalRecoveryElapsed ?? 0;
      finalRecoveredOil.current = convert(Number(recoveredOil ?? 0))
        .from(getConvertUnitOfMeasure(recoveredOilUnitOfMeasure) as Unit)
        .to(
          getConvertUnitOfMeasure(
            userUnitsOfMeasure[
              getUnitOfMeasureType(recoveredOilUnitOfMeasure) ?? "volume"
            ]
          ) as Unit
        );
      finalRecoveredGas.current = convert(Number(recoveredGas ?? 0))
        .from(getConvertUnitOfMeasure(recoveredGasUnitOfMeasure) as Unit)
        .to(
          getConvertUnitOfMeasure(
            userUnitsOfMeasure[
              getUnitOfMeasureType(recoveredGasUnitOfMeasure) ?? "weight"
            ]
          ) as Unit
        );
      return;
    }
    if (
      procedureState ===
      FSMACRecoveryRecycleStates.FSM_AC_RECOVERY_RECYCLE_STATE_CLOSED
    ) {
      router.push({
        pathname: "/manualProcedures/recoveryRecycle/finished",
        params: {
          vin: vin,
          oilDischargeElapsedTime: finalOilDischargeElapsedTime.current,
          totalRecoveryTime: finalTotalRecoveryTime.current,
          recoveredOil: finalRecoveredOil.current.toFixed(2),
          recoveredGas: finalRecoveredGas.current.toFixed(2),
        },
      });
    }
  }, [procedureState]);

  const isWaiting = [
    FSMACRecoveryRecycleStates.FSM_AC_RECOVERY_RECYCLE_STATE_INITIAL_PRESSURE_CHECK,
  ].includes(procedureState);

  const isRunning = [
    FSMACRecoveryRecycleStates.FSM_AC_RECOVERY_RECYCLE_STATE_EV6_CYCLE_PRE,
    FSMACRecoveryRecycleStates.FSM_AC_RECOVERY_RECYCLE_STATE_EV6_CYCLE_POST,
    FSMACRecoveryRecycleStates.FSM_AC_RECOVERY_RECYCLE_STATE_EV9_CYCLE_PRE,
    FSMACRecoveryRecycleStates.FSM_AC_RECOVERY_RECYCLE_STATE_EV9_CYCLE_POST,
    FSMACRecoveryRecycleStates.FSM_AC_RECOVERY_RECYCLE_STATE_RUNNING,
    FSMACRecoveryRecycleStates.FSM_AC_RECOVERY_RECYCLE_STATE_SECOND_PHASE,
    FSMACRecoveryRecycleStates.FSM_AC_RECOVERY_RECYCLE_STATE_DISCHARGE_OIL,
    FSMACRecoveryRecycleStates.FSM_AC_RECOVERY_RECYCLE_STATE_VACUUM_ASSIST_PHASE,
    FSMACRecoveryRecycleStates.FSM_AC_RECOVERY_RECYCLE_STATE_FINAL_PHASE,
  ].includes(procedureState);

  const isInOilDishargeFullContainerWarning = [
    FSMACRecoveryRecycleStates.FSM_AC_RECOVERY_RECYCLE_STATE_DISCHARGE_OIL_FULL,
  ].includes(procedureState);

  const isPaused = [
    FSMACRecoveryRecycleStates.FSM_AC_RECOVERY_RECYCLE_STATE_RUNNING_PAUSE,
  ].includes(procedureState);

  const isInAlarmState = RECOVERY_ALARM_STATES.includes(procedureState);

  const onPauseTogglePress = async () => {
    try {
      if (isPaused) {
        await HttpClient.resumeProcedure("ac-recovery");
      } else {
        await HttpClient.pauseProcedure("ac-recovery");
      }
    } catch (e: any) {
      console.error(e);
      errorToast(e.message ?? e?.description ?? t("errors.genericError"));
    }
  };

  const handleBackButtonPress = async () => {
    router.dismissTo("/manualProcedures");
  };

  const RecoveryBackButton = () => {
    if (
      procedureState ===
      FSMACRecoveryRecycleStates.FSM_AC_RECOVERY_RECYCLE_STATE_MESSAGE_CONNECT_HP_LP
    )
      return <BackButton onPress={handleBackButtonPress} />;
    if (isRunning || isPaused)
      return <PauseButton isPaused={isPaused} onPress={onPauseTogglePress} />;
  };

  return (
    <Page
      title={t("operationTitles.recoveryRecycle")}
      border={isWaiting ? "basic" : "popOver"}
      noBackButton={isWaiting || isInAlarmState}
      backButton={<RecoveryBackButton />}
    >
      {procedureState ===
        FSMACRecoveryRecycleStates.FSM_AC_RECOVERY_RECYCLE_STATE_MESSAGE_CONNECT_HP_LP && (
        <ConnectDeviceFragment onContinuePress={sendMessageRead} />
      )}
      {isWaiting && <PleaseWaitFragment />}
      {(isRunning || isPaused) && <RecoveryRecycleRunningFragment />}
      {isInOilDishargeFullContainerWarning && (
        <ProcedureMessageFragment
          type="warning"
          messageKey="errors.recoveryRecycle.pleaseEmptyUsedOilContainer"
          onOKPress={sendMessageRead}
        />
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
        FSMACRecoveryRecycleStates.FSM_AC_RECOVERY_RECYCLE_STATE_MESSAGE_DISCONNECT_HP_LP && (
        <DisconnectDeviceFragment onContinuePress={sendMessageRead} />
      )}
    </Page>
  );
}
