import { Keyboard } from "@/components/Keyboard";
import { NumPad } from "@/components/NumPad";
import { Page } from "@/components/Page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { z } from "zod";

const PROCEDURE_MIN_SECONDS = 20;
const PROCEDURE_MAX_SECONDS = 120;

export default function SecondProcedureScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { errorToast } = useToast();

  const [insertVinMode, setInsertVinMode] = useState(false);
  const [procedureSeconds, SetProcedureSeconds] = useState(20);
  const [editingVin, setEditingVin] = useState("");

  const vacuumTimeSchema = z
    .number()
    .min(
      Number(PROCEDURE_MIN_SECONDS),
      t("misc.mustBeAtLeast", {
        field: t("operations.manual_.secondProcedure_.secondProcedureTime"),
        minValue: PROCEDURE_MIN_SECONDS,
        unit: t("units.seconds"),
      })
    )
    .max(
      Number(PROCEDURE_MAX_SECONDS),
      t("misc.mustBeAtMost", {
        field: t("operations.manual_.secondProcedure_.secondProcedureTime"),
        maxValue: PROCEDURE_MAX_SECONDS,
        unit: t("units.seconds"),
      })
    );

  const handleSecondProcedureTimeConfirmPress = () => {
    try {
      vacuumTimeSchema.parse(procedureSeconds);
      setInsertVinMode(true);
    } catch (error) {
      if (error instanceof z.ZodError) {
        errorToast(error.errors[0].message);
      }
    }
  };

  const handleVinContinuePress = async () => {
    if (!procedureSeconds) {
      console.error(
        "Missing values:",
        "editingSecondProcedureTime",
        procedureSeconds
      );
      return;
    }
    try {
      router.push({
        pathname: "/manualProcedures/second/running",
        params: {
          vin: editingVin,
          durationSeconds: procedureSeconds,
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

  return (
    <Page
      title={t("operationTitles.secondProcedure")}
      border={insertVinMode ? "popOver" : "basic"}
      onBackButtonPress={handleBackButtonPress}
    >
      {!insertVinMode && (
        <View className="flex-1 flex-row gap-2">
          {/* left side */}
          <View className="flex-1 rounded p-4 bg-background">
            <View className="flex-row justify-between items-center">
              <Text className="paragraph-regular-medium">
                {t("operations.manual_.secondProcedure_.secondProcedureTime")}
              </Text>
              <Input
                className="w-40"
                rightLabel="s"
                value={procedureSeconds?.toString() || "0"}
                focused
              />
            </View>
          </View>
          {/* right side */}
          <View className="flex-1 bg-background rounded">
            <View className="flex-1 gap-4 items-center justify-center">
              <NumPad
                initialValue={procedureSeconds.toString() || "0"}
                onChange={(v) => SetProcedureSeconds(parseInt(v || "0"))}
                mode={"number"}
              />
              <View className="flex-row gap-4 w-[72%]">
                <Button
                  className="flex-1"
                  onPress={handleSecondProcedureTimeConfirmPress}
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
