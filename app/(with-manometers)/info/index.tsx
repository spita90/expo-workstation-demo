import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import {
  AMBIENT_TEMPERATURE_METRIC,
  TANK_PRESSURE_METRIC,
  TANK_TEMPERATURE_METRIC,
} from "@/lib/constants";
import { useGlobalStore } from "@/stores/globalStore";
import { UNITS_OF_MEASURE_SYMBOLS } from "@/types";
import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";
import { FlatList, Image, View } from "react-native";
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

  const {
    temperatureUnitOfMeasure,
    pressureUnitOfMeasure,
    tankTemperatureMetric,
    tankPressureMetric,
    ambientTemperatureMetric,
  } = useGlobalStore(
    useShallow((state) => ({
      temperatureUnitOfMeasure: state.userSettings.unitOfMeasures.temperature,
      pressureUnitOfMeasure: state.userSettings.unitOfMeasures.pressure,
      tankTemperatureMetric: state.pbdMetrics[TANK_TEMPERATURE_METRIC],
      tankPressureMetric: state.pbdMetrics[TANK_PRESSURE_METRIC],
      ambientTemperatureMetric: state.pbdMetrics[AMBIENT_TEMPERATURE_METRIC],
    }))
  );

  const leftLabelValues = [
    { label: t("fields.software"), value: systemConfig.serialNumber },
    {
      label: t("fields.serialNumber"),
      value: systemConfig.wiringDiagram.toString(),
    },
  ];

  const rightLabelValues = [
    { label: t("fields.software"), value: systemConfig.serialNumber },
    {
      label: t("fields.serialNumber"),
      value: systemConfig.wiringDiagram.toString(),
    },
  ];

  const rightMetricValues = [
    {
      label: t("fields.ambientTemperature"),
      value: `${ambientTemperatureMetric.converted}${UNITS_OF_MEASURE_SYMBOLS[temperatureUnitOfMeasure]}`,
    },
    {
      label: t("fields.tankTemperature"),
      value: `${tankTemperatureMetric.converted}${UNITS_OF_MEASURE_SYMBOLS[temperatureUnitOfMeasure]}`,
    },
    {
      label: t("fields.tankPressure"),
      value: `${tankPressureMetric.converted} ${UNITS_OF_MEASURE_SYMBOLS[pressureUnitOfMeasure]}`,
    },
  ];

  return (
    <>
      <Stack.Screen name="info" />
      <View className="flex-1 flex-row gap-4">
        <View className="flex-1 items-center justify-between bg-white/10 rounded">
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
          <FlatList
            className="p-4 bg-white/10 rounded"
            data={rightMetricValues}
            renderItem={({ item }) => (
              <LabelValueRow label={item.label} value={item.value} />
            )}
            keyExtractor={(_, idx) => idx.toString()}
            ItemSeparatorComponent={() => (
              <Separator orientation="horizontal" className="bg-white/40" />
            )}
          />
          <View className="flex-1 flex-row gap-4">
            <View className="flex-1 bg-white/10 rounded"></View>
            <View className="flex-1 bg-white/10 rounded"></View>
          </View>
          <View className="flex-1 bg-white/10 rounded"></View>
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
