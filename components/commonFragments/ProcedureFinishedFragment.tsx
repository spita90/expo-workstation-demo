import PrintIcon from "@/assets/svgs/print.svg";
import { getMinutesLabelFromSeconds } from "@/lib/utils";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { FlatList, View } from "react-native";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Text } from "../ui/text";
import { useToast } from "@/hooks/use-toast";

export interface ProcedureFinishedFragmentProps {
  reportData?: {
    fieldKey: string;
    value: number | string;
    valueType: "label" | "duration";
  }[];
  onGoToHomepagePress?: () => void;
}

export const ProcedureFinishedFragment = ({
  reportData,
  onGoToHomepagePress,
}: ProcedureFinishedFragmentProps) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { toast } = useToast();

  const usableReportData = reportData?.filter((item) => item.value) ?? [];

  const defaultGoToHomepagePressHandler = () => {
    router.replace("/home");
  };

  const handlePrintPress = () => {
    // TODO implement print
    toast({
      title: "Printing report...",
      description: "This feature is not implemented yet.",
    });
  };

  return (
    <View className="flex-1 justify-center p-8 gap-6 bg-white/10 rounded">
      <Text className="paragraph-semibold-large">
        {t("misc.endOfProcedure")}
      </Text>
      <View className="gap-2">
        <FlatList
          data={usableReportData}
          keyExtractor={(item) => item.fieldKey}
          renderItem={({ item }) => {
            return (
              <View className="flex-row justify-between">
                <Text className="paragraph-regular-medium">
                  {t(item.fieldKey)}
                </Text>
                <Text className="paragraph-regular-medium">
                  {item.valueType === "label"
                    ? item.value
                    : item.valueType === "duration"
                    ? `${getMinutesLabelFromSeconds(item.value as number)} min`
                    : ""}
                </Text>
              </View>
            );
          }}
          ItemSeparatorComponent={() => (
            <Separator orientation="horizontal" className="my-2 bg-white/20" />
          )}
        />
      </View>
      <View className="flex-row gap-4 justify-end">
        {usableReportData.length > 0 && (
          <Button variant="outline" onPress={handlePrintPress}>
            <View className="flex-row gap-2 items-center">
              <PrintIcon />
              <Text className="paragraph-semibold-medium">
                {t("buttons.print")}
              </Text>
            </View>
          </Button>
        )}
        <Button
          onPress={onGoToHomepagePress ?? defaultGoToHomepagePressHandler}
        >
          <Text className="paragraph-semibold-medium">
            {t("buttons.goToHomepage")}
          </Text>
        </Button>
      </View>
    </View>
  );
};
