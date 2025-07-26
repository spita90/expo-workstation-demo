import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { useGlobalStore } from "@/stores/globalStore";
import reactLogoLottie from "@/assets/lottie/react-logo.json";
import Lottie from "lottie-react";
import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";
import { FlatList, View } from "react-native";
import { useShallow } from "zustand/shallow";

const LabelValueRow = ({ label, value }: { label: string; value: string }) => {
  return (
    <View className="flex-row py-3 justify-between">
      <Text className="paragraph-regular-medium">{label}</Text>
      <Text className="paragraph-semibold-medium">{value}</Text>
    </View>
  );
};

export default function InfoScreen() {
  const { t } = useTranslation();
  const { systemConfig } = useGlobalStore(
    useShallow((state) => ({
      systemConfig: state.systemConfig,
    }))
  );

  const leftLabelValues = [
    { label: t("fields.software"), value: systemConfig.serialNumber },
  ];

  const rightLabelValues = [
    { label: t("fields.software"), value: systemConfig.serialNumber },
  ];

  return (
    <>
      <Stack.Screen name="info" />
      <View className="flex-1 flex-row gap-4">
        <View className="flex-1 items-center justify-between bg-white/10 rounded">
          <View className="p-8">
            <Lottie
              className="w-[220px] bg-white/20 overflow-hidden border-2 border-white/20 rounded-full"
              animationData={reactLogoLottie}
              autoplay
              loop
            />
          </View>
          <FlatList
            className="w-full justify-end p-4"
            data={leftLabelValues}
            renderItem={({ item }) => (
              <LabelValueRow label={item.label} value={item.value} />
            )}
            keyExtractor={(_, idx) => idx.toString()}
            ItemSeparatorComponent={() => (
              <Separator orientation="horizontal" className="bg-white/40" />
            )}
          />
        </View>
        <View className="flex-1 gap-4">
          <View className="flex-1 flex-row gap-4">
            <View className="flex-1 bg-white/10 p-4 rounded">
              <Text>other infos</Text>
            </View>
            <View className="flex-1 bg-white/10 p-4 rounded">
              <Text>other infos</Text>
            </View>
          </View>
          <View className="flex-1 bg-white/10 p-4 rounded">
            <Text>other infos</Text>
          </View>
          <FlatList
            className="p-4 bg-white/10 rounded"
            data={rightLabelValues}
            renderItem={({ item }) => (
              <LabelValueRow label={item.label} value={item.value} />
            )}
            keyExtractor={(_, idx) => idx.toString()}
            ItemSeparatorComponent={() => (
              <Separator orientation="horizontal" className="bg-white/40" />
            )}
          />
        </View>
      </View>
    </>
  );
}
