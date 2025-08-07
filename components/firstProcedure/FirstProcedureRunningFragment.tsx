import {
  FIRST_PROCEDURE_INNER_PHASE_TIME_MAX_SEC,
  FIRST_PROCEDURE_TOTAL_TIME_MAX_SEC,
  FirstProcedureState,
} from "@/app/(with-side-indicators)/manualProcedures/first/running";
import { TEMPERATURE_METRIC } from "@/lib/constants";
import { cn, getMinutesLabelFromSeconds } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Chart } from "../Chart";
import { LinearProgressBar } from "../LinearProgressBar";
import { Text } from "../ui/text";
import { useEffect, useState } from "react";

export interface FirstProcedureRunningFragmentProps {
  procedureState: FirstProcedureState;
  innerPhaseElapsedTimeSeconds: number;
  totalElapsedTimeSeconds: number;
}

const getDescriptionKeyByState = (procedureState: FirstProcedureState) => {
  switch (procedureState) {
    case FirstProcedureState.INITIAL_CHECK:
    case FirstProcedureState.RUNNING:
      return "operations.manual_.firstProcedure_.running";
    case FirstProcedureState.INNER_PHASE:
      return "operations.manual_.firstProcedure_.innerPhase";
    case FirstProcedureState.PAUSED:
      return "misc.paused";
  }
};

export const FirstProcedureRunningFragment = ({
  procedureState,
  innerPhaseElapsedTimeSeconds,
  totalElapsedTimeSeconds,
}: FirstProcedureRunningFragmentProps) => {
  const { t } = useTranslation();

  const [previousProcedureState, setPreviousProcedureState] =
    useState<FirstProcedureState>(FirstProcedureState.UNKNOWN);

  useEffect(() => {
    if (
      procedureState !== previousProcedureState &&
      procedureState !== FirstProcedureState.PAUSED
    ) {
      setPreviousProcedureState(procedureState);
    }
  }, [procedureState, previousProcedureState]);

  const isPaused = [FirstProcedureState.PAUSED].includes(procedureState);

  const isInRunningState = [FirstProcedureState.RUNNING].includes(
    isPaused ? previousProcedureState : procedureState
  );
  const isInInnerPhase = [FirstProcedureState.INNER_PHASE].includes(
    isPaused ? previousProcedureState : procedureState
  );

  const getTimerLabel = () => {
    if (isInRunningState) {
      return getMinutesLabelFromSeconds(
        totalElapsedTimeSeconds !== undefined ? totalElapsedTimeSeconds : 0
      );
    } else if (isInInnerPhase) {
      return getMinutesLabelFromSeconds(
        innerPhaseElapsedTimeSeconds !== undefined
          ? innerPhaseElapsedTimeSeconds
          : 0
      );
    } else {
      return undefined;
    }
  };

  return (
    <View className={cn("gap-2 rounded", isPaused && "bg-black/20 opacity-60")}>
      <View className="flex-row gap-4">
        <View className="flex-1 gap-2">
          <Chart bottomRightLabel={"Value 1"} />
          {isInRunningState && (
            <Chart bottomRightLabel={"Value 3"} graphColor={"#DD3B20"} />
          )}
          {isInInnerPhase && (
            <Chart bottomRightLabel={"Value A"} graphColor={"#A4A319"} />
          )}
        </View>
        <View className="flex-1 gap-2">
          <Chart bottomRightLabel={"Value 2"} />
          <Chart
            metric={{
              metricName: TEMPERATURE_METRIC,
              chartValueType: "converted",
            }}
            bottomRightLabel={"Value 4"}
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
          {isInRunningState && (
            <LinearProgressBar
              fillPercentage={
                totalElapsedTimeSeconds !== undefined &&
                FIRST_PROCEDURE_TOTAL_TIME_MAX_SEC
                  ? (totalElapsedTimeSeconds /
                      FIRST_PROCEDURE_TOTAL_TIME_MAX_SEC) *
                    100
                  : 0
              }
              hidePercentageLabel
            />
          )}
          {isInInnerPhase && (
            <LinearProgressBar
              fillPercentage={
                innerPhaseElapsedTimeSeconds !== undefined &&
                FIRST_PROCEDURE_INNER_PHASE_TIME_MAX_SEC
                  ? (innerPhaseElapsedTimeSeconds /
                      FIRST_PROCEDURE_INNER_PHASE_TIME_MAX_SEC) *
                    100
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
