import { Keyboard } from "@/components/Keyboard";
import { Page } from "@/components/Page";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

export default function RecoveryRecycleScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { errorToast } = useToast();

  const [editingVin, setEditingVin] = useState("");

  const handleVinContinuePress = async () => {
    try {
      const vin = editingVin.length === 0 ? undefined : editingVin; // to have undefined if empty string
      router.push({
        pathname: "/manualProcedures/recoveryRecycle/running",
        params: {
          vin: editingVin, // using empty string if empty
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
      title={t("operationTitles.recoveryRecycle")}
      border={"popOver"}
      onBackButtonPress={handleBackButtonPress}
    >
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
    </Page>
  );
}
