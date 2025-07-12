import {
  AMBIENT_TEMPERATURE_METRIC,
  EVAPORATOR_PRESSURE_METRIC,
  FSM_STATE_METRIC,
  RECOVERY_RECYCLE_OIL_DISCHARGE_TIMER_METRIC,
  RECOVERY_RECYCLE_RECOVERED_GAS_METRIC,
  RECOVERY_RECYCLE_RECOVERED_OIL_METRIC,
  RECOVERY_RECYCLE_TOTAL_RECOVERY_METRIC,
  TANK_PRESSURE_METRIC,
  TANK_TEMPERATURE_METRIC,
} from "@/lib/constants";
import { cn, getMinutesLabelFromSeconds } from "@/lib/utils";
import { useGlobalStore } from "@/stores/globalStore";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { useShallow } from "zustand/shallow";
import { Chart } from "../Chart";
import { LinearProgressBar } from "../LinearProgressBar";
import { Text } from "../ui/text";

export interface RecoveryRecycleRunningFragmentProps {}

const getDescriptionKeyByState = (
  procedureState: FSMACRecoveryRecycleStates
) => {
  switch (procedureState) {
    case FSMACRecoveryRecycleStates.FSM_AC_RECOVERY_RECYCLE_STATE_INITIAL_PRESSURE_CHECK:
    case FSMACRecoveryRecycleStates.FSM_AC_RECOVERY_RECYCLE_STATE_EV6_CYCLE_PRE:
    case FSMACRecoveryRecycleStates.FSM_AC_RECOVERY_RECYCLE_STATE_EV9_CYCLE_PRE:
    case FSMACRecoveryRecycleStates.FSM_AC_RECOVERY_RECYCLE_STATE_RUNNING:
      return "operations.manual_.recoveryRecycle_.firstPhase";
    case FSMACRecoveryRecycleStates.FSM_AC_RECOVERY_RECYCLE_STATE_DISCHARGE_OIL:
      return "operations.manual_.recoveryRecycle_.oilDischarge";
    case FSMACRecoveryRecycleStates.FSM_AC_RECOVERY_RECYCLE_STATE_SECOND_PHASE:
    case FSMACRecoveryRecycleStates.FSM_AC_RECOVERY_RECYCLE_STATE_VACUUM_ASSIST_PHASE:
    case FSMACRecoveryRecycleStates.FSM_AC_RECOVERY_RECYCLE_STATE_EV6_CYCLE_POST:
    case FSMACRecoveryRecycleStates.FSM_AC_RECOVERY_RECYCLE_STATE_EV9_CYCLE_POST:
      return "operations.manual_.recoveryRecycle_.secondPhase";
    case FSMACRecoveryRecycleStates.FSM_AC_RECOVERY_RECYCLE_STATE_RUNNING_PAUSE:
      return "misc.paused";
  }
};

export const RecoveryRecycleRunningFragment =
  ({}: RecoveryRecycleRunningFragmentProps) => {
    const { t } = useTranslation();
    const {
      procedureStateMetric,
      oilDischargeTimerMetric,
      totalRecoveryTimerMetric,
    } = useGlobalStore(
      useShallow((state) => ({
        procedureStateMetric: state.currentProcedureMetrics[FSM_STATE_METRIC],
        oilDischargeTimerMetric:
          state.currentProcedureMetrics[
            RECOVERY_RECYCLE_OIL_DISCHARGE_TIMER_METRIC
          ],
        totalRecoveryTimerMetric:
          state.currentProcedureMetrics[RECOVERY_RECYCLE_TOTAL_RECOVERY_METRIC],
      }))
    );
    const procedureState = (getMetricValue(procedureStateMetric) ??
      0) as FSMACRecoveryRecycleStates;

    const oilDischargeElapsed = oilDischargeTimerMetric
      ? Number(getMetricValue(oilDischargeTimerMetric))
      : undefined;
    const oilDischargeElapsedMax = oilDischargeTimerMetric
      ? Number(getMetricPropertyValue(oilDischargeTimerMetric, "max_value"))
      : undefined;

    const totalRecoveryElapsed = totalRecoveryTimerMetric
      ? Number(getMetricValue(totalRecoveryTimerMetric))
      : undefined;
    const totalRecoveryElapsedMax = totalRecoveryTimerMetric
      ? Number(getMetricPropertyValue(totalRecoveryTimerMetric, "max_value"))
      : undefined;

    const isPaused = [
      FSMACRecoveryRecycleStates.FSM_AC_RECOVERY_RECYCLE_STATE_RUNNING_PAUSE,
    ].includes(procedureState);

    const isInEVState = [
      FSMACRecoveryRecycleStates.FSM_AC_RECOVERY_RECYCLE_STATE_EV6_CYCLE_PRE,
      FSMACRecoveryRecycleStates.FSM_AC_RECOVERY_RECYCLE_STATE_EV6_CYCLE_POST,
      FSMACRecoveryRecycleStates.FSM_AC_RECOVERY_RECYCLE_STATE_EV9_CYCLE_PRE,
      FSMACRecoveryRecycleStates.FSM_AC_RECOVERY_RECYCLE_STATE_EV9_CYCLE_POST,
    ].includes(procedureState);

    const isInRunningState = [
      FSMACRecoveryRecycleStates.FSM_AC_RECOVERY_RECYCLE_STATE_RUNNING,
      FSMACRecoveryRecycleStates.FSM_AC_RECOVERY_RECYCLE_STATE_SECOND_PHASE,
      FSMACRecoveryRecycleStates.FSM_AC_RECOVERY_RECYCLE_STATE_VACUUM_ASSIST_PHASE,
      FSMACRecoveryRecycleStates.FSM_AC_RECOVERY_RECYCLE_STATE_FINAL_PHASE,
    ].includes(procedureState);

    const isInOilDischargeState = [
      FSMACRecoveryRecycleStates.FSM_AC_RECOVERY_RECYCLE_STATE_DISCHARGE_OIL,
    ].includes(procedureState);

    const getTimerLabel = () => {
      if (isInRunningState || isInEVState) {
        return getMinutesLabelFromSeconds(
          totalRecoveryElapsed !== undefined ? totalRecoveryElapsed : 0
        );
      } else if (isInOilDischargeState) {
        return getMinutesLabelFromSeconds(
          oilDischargeElapsed !== undefined ? oilDischargeElapsed : 0
        );
      } else {
        return undefined;
      }
    };

    return (
      <View
        className={cn("gap-2 rounded", isPaused && "bg-black/20 opacity-60")}
      >
        <View className="flex-row gap-4">
          <View className="flex-1 gap-2">
            <Chart
              metric={{
                type: "procedure",
                metricName: RECOVERY_RECYCLE_RECOVERED_GAS_METRIC,
              }}
              bottomRightLabel={t(
                "operations.manual_.recoveryRecycle_.recoveredGas"
              )}
            />
            {isInEVState && (
              <Chart
                metric={{
                  type: "pbd",
                  metricName: AMBIENT_TEMPERATURE_METRIC,
                  chartValueType: "converted",
                }}
                bottomRightLabel={t("fields.ambientTemperature")}
                graphColor={"#34D399"}
              />
            )}
            {isInRunningState && (
              <Chart
                metric={{
                  type: "pbd",
                  metricName: EVAPORATOR_PRESSURE_METRIC,
                  chartValueType: "converted",
                }}
                bottomRightLabel={t("fields.evaporatorPressure")}
                graphColor={"#DD3B20"}
              />
            )}
            {isInOilDischargeState && (
              <Chart
                metric={{
                  type: "procedure",
                  metricName: RECOVERY_RECYCLE_RECOVERED_OIL_METRIC,
                }}
                bottomRightLabel={t(
                  "operations.manual_.recoveryRecycle_.recoveredOil"
                )}
                graphColor={"#A4A319"}
              />
            )}
          </View>
          <View className="flex-1 gap-2">
            <Chart
              metric={{
                type: "pbd",
                metricName: TANK_PRESSURE_METRIC,
                chartValueType: "converted",
              }}
              bottomRightLabel={t("fields.tankPressure")}
            />
            <Chart
              metric={{
                type: "pbd",
                metricName: TANK_TEMPERATURE_METRIC,
                chartValueType: "converted",
              }}
              bottomRightLabel={t("fields.tankTemperature")}
            />
          </View>
        </View>
        <View className="flex-row gap-4 border-white/20 items-center rounded">
          <View className="flex-1 justify-center">
            <Text>
              {t(getDescriptionKeyByState(procedureState) ?? "misc.waiting")}
            </Text>
          </View>
          <View className="flex-1 flex-row">
            {(isInRunningState || isInEVState) && (
              <LinearProgressBar
                fillPercentage={
                  totalRecoveryElapsed !== undefined && totalRecoveryElapsedMax
                    ? (totalRecoveryElapsed / totalRecoveryElapsedMax) * 100
                    : 0
                }
                hidePercentageLabel
              />
            )}
            {isInOilDischargeState && (
              <LinearProgressBar
                fillPercentage={
                  oilDischargeElapsed !== undefined && oilDischargeElapsedMax
                    ? (oilDischargeElapsed / oilDischargeElapsedMax) * 100
                    : 0
                }
                hidePercentageLabel
              />
            )}
            {getTimerLabel() !== undefined && (
              <Text className="paragraph-semibold-medium">
                {`${getTimerLabel()} min`}
              </Text>
            )}
          </View>
        </View>
      </View>
    );
  };
