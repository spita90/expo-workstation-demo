import { Keyboard } from "@/components/Keyboard";
import { NumPad } from "@/components/NumPad";
import { Page } from "@/components/Page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { useToast } from "@/hooks/use-toast";
import { useGlobalStore } from "@/stores/globalStore";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { z } from "zod";
import { useShallow } from "zustand/shallow";

export default function VacuumScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { errorToast } = useToast();

  const { vacuumTimeMetric, vacuumHoldTimeMetric, vacuumMaximumRisingMetric } =
    useGlobalStore(
      useShallow((state) => ({
        vacuumTimeMetric: state.currentProcedureMetrics[VACUUM_TIME_METRIC],
        vacuumHoldTimeMetric:
          state.currentProcedureMetrics[VACUUM_HOLD_TIME_METRIC],
        vacuumMaximumRisingMetric:
          state.currentProcedureMetrics[VACUUM_MAXIMUM_RISING_METRIC],
      }))
    );
  const vacuumTime = getMetricValue(vacuumTimeMetric);
  const vacuumTimeMin = getMetricPropertyValue(vacuumTimeMetric, "min_value");
  const vacuumTimeMax = getMetricPropertyValue(vacuumTimeMetric, "max_value");
  const vacuumHoldTime = getMetricValue(vacuumHoldTimeMetric);
  const vacuumMaximumRising = getMetricValue(vacuumMaximumRisingMetric);

  const [insertVinMode, setInsertVinMode] = useState(false);
  const [editingVacuumTime, setEditingVacuumTime] = useState(
    vacuumTime?.toString()
  );
  const [editingVin, setEditingVin] = useState("");

  const vacuumTimeSchema = z
    .number()
    .min(
      Number(vacuumTimeMin),
      t("misc.mustBeAtLeast", {
        field: t("operations.manual_.vacuum_.vacuumTime"),
        minValue: vacuumTimeMin,
        unit: t("units.minutes"),
      })
    )
    .max(
      Number(vacuumTimeMax),
      t("misc.mustBeAtMost", {
        field: t("operations.manual_.vacuum_.vacuumTime"),
        maxValue: vacuumTimeMax,
        unit: t("units.minutes"),
      })
    );

  const handleVacuumTimeConfirmPress = () => {
    try {
      const vacuumTimeValue = Number(editingVacuumTime);
      vacuumTimeSchema.parse(vacuumTimeValue);
      setInsertVinMode(true);
    } catch (error) {
      if (error instanceof z.ZodError) {
        errorToast(error.errors[0].message);
      }
    }
  };

  const handleVinContinuePress = async () => {
    if (!editingVacuumTime || !vacuumHoldTime || !vacuumMaximumRising) {
      console.error(
        "Missing values:",
        "editingVacuumTime",
        editingVacuumTime,
        "vacuumHoldTime",
        vacuumHoldTime,
        "vacuumMaximumRising",
        vacuumMaximumRising
      );
      return;
    }
    try {
      router.push({
        pathname: "/manualProcedures/vacuum/running",
        params: {
          vin: editingVin,
        },
      });
    } catch (e: any) {
      console.error(e);
      errorToast(e.message ?? e?.description ?? t("errors.genericError"));
    }
  };

  const handleBackButtonPress = async () => {
    router.back();
  };

  if (!vacuumTime || !vacuumHoldTime) {
    return null;
  }

  return (
    <Page
      title={t("operationTitles.vacuum")}
      border={insertVinMode ? "popOver" : "basic"}
      onBackButtonPress={handleBackButtonPress}
    >
      {!insertVinMode && (
        <View className="flex-1 flex-row gap-2">
          {/* left side */}
          <View className="flex-1 rounded p-4 bg-background">
            <View className="gap-4">
              <View className="flex-row justify-between items-center">
                <Text className="paragraph-regular-medium">
                  {t("operations.manual_.vacuum_.vacuumTime")}
                </Text>
                <Input
                  className="w-40"
                  rightLabel="min"
                  value={editingVacuumTime?.toString() || "0"}
                  focused
                />
              </View>
              <Separator orientation="horizontal" className="bg-white/40" />
              <View className="flex-row justify-between items-center">
                <Text className="paragraph-regular-medium">
                  {t("operations.manual_.vacuum_.vacuumHoldTime")}
                </Text>
                <Text className="paragraph-regular-medium">
                  {vacuumHoldTime?.toString()} min
                </Text>
              </View>
            </View>
          </View>
          {/* right side */}
          <View className="flex-1 bg-background rounded">
            <View className="flex-1 gap-4 items-center justify-center">
              <NumPad
                initialValue={vacuumTime.toString() || "0"}
                onChange={(v) => setEditingVacuumTime(v?.toString() || "0")}
                mode={"number"}
              />
              <View className="flex-row gap-4 w-[72%]">
                <Button
                  className="flex-1"
                  onPress={handleVacuumTimeConfirmPress}
                >
                  <Text>{t("misc.confirm")}</Text>
                </Button>
              </View>
            </View>
          </View>
        </View>
      )}
      {insertVinMode && (
        <View className="flex-1 gap-4">
          <View className="flex-row gap-4 mx-6 items-center">
            <Text className="w-[120px] paragraph-semibold-large">
              {t("misc.insertVin")}
            </Text>
            <Input autoFocus value={editingVin} focused />
          </View>
          <Keyboard
            enterKeyMode={editingVin ? "continue" : "skipAndContinue"}
            onChange={(v) => setEditingVin(v || "")}
            onEnterPress={handleVinContinuePress}
          />
        </View>
      )}
    </Page>
  );
}
