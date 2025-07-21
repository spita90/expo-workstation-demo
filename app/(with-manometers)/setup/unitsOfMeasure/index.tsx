import UnitOfMeasureSvg from "@/assets/svgs/unit_of_measure.svg";
import { Page } from "@/components/Page";
import { TabItem } from "@/components/TabItem";
import { Separator } from "@/components/ui/separator";
import { SetupIcon } from "@/components/ui/SetupIcon";
import { Text } from "@/components/ui/text";
import { useToast } from "@/hooks/use-toast";
import {
  UnitOfMeasure,
  UnitOfMeasureType,
  unitsOfMeasureByType,
} from "@/lib/utils";
import { useGlobalStore } from "@/stores/globalStore";
import { UnitOfMeasureSettings } from "@/stores/slices/appConfigSlice";
import { UNITS_OF_MEASURE_SYMBOLS } from "@/types";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import { FlatList, View } from "react-native";
import { useShallow } from "zustand/shallow";

const labelsByType: Record<UnitOfMeasureType, string> = {
  pressure: "fields.pressure",
  weight: "fields.weight",
  temperature: "fields.temperature",
  volume: "fields.volume",
};

export default function UnitsOfMeasureSetupScreen() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { userSettings, setUserSettings } = useGlobalStore(
    useShallow((state) => ({
      userSettings: state.userSettings,
      setUserSettings: state.setUserSettings,
    }))
  );

  const setUnitOfMeasure = async (
    unitKey: keyof UnitOfMeasureSettings,
    unitOfMeasure: UnitOfMeasure
  ) => {
    try {
      setUserSettings(_.set({}, `unitOfMeasures.${unitKey}`, unitOfMeasure));
    } catch (e: any) {
      console.error(e);
      toast({
        title: t("misc.error"),
        description: e.message ?? e.description ?? t("errors.genericError"),
      });
    }
  };

  return (
    <Page title={t("operations.setup_.unitsOfMeasure")} border="popOver">
      <View className="flex-1 flex-col">
        <View className="flex-1 flex-row gap-4">
          <SetupIcon
            Icon={() => <UnitOfMeasureSvg />}
            text={t("fields.unitsOfMeasure")}
          />
          <View className="flex-1 gap-2">
            <FlatList
              data={
                Object.keys(unitsOfMeasureByType) as Array<
                  keyof typeof unitsOfMeasureByType
                >
              }
              renderItem={({ item: unitKey }) => (
                <View
                  key={unitKey}
                  className="flex-row items-center justify-between"
                >
                  <Text className="paragraph-semibold-large">
                    {t(labelsByType[unitKey])}
                  </Text>
                  <View className="flex-row gap-2">
                    {unitsOfMeasureByType[unitKey].map((unitOfMeasure) => (
                      <TabItem
                        key={unitOfMeasure}
                        variant="glass"
                        state={
                          unitOfMeasure ===
                          _.get(userSettings.unitOfMeasures, unitKey)
                            ? "selected"
                            : "unselected"
                        }
                        onPress={() => setUnitOfMeasure(unitKey, unitOfMeasure)}
                      >
                        <Text className="paragraph-semibold-large">
                          {UNITS_OF_MEASURE_SYMBOLS[unitOfMeasure]}
                        </Text>
                      </TabItem>
                    ))}
                  </View>
                </View>
              )}
              ItemSeparatorComponent={() => (
                <Separator
                  orientation="horizontal"
                  className="mt-2 mb-3 bg-zinc-400"
                />
              )}
            />
          </View>
        </View>
      </View>
    </Page>
  );
}
