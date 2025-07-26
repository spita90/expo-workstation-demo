import LanguageSvg from "@/assets/svgs/language.svg";
import { Page } from "@/components/Page";
import { TabItem } from "@/components/TabItem";
import { SetupIcon } from "@/components/ui/SetupIcon";
import { Text } from "@/components/ui/text";
import { useToast } from "@/hooks/use-toast";
import i18n, {
  availableLanguages,
  LOCALE_NAMES,
  LOCALE_RESOURCES,
} from "@/localizations";
import { useGlobalStore } from "@/stores/globalStore";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { useShallow } from "zustand/shallow";

export default function LanguageSetupScreen() {
  const { t } = useTranslation();
  const { toast } = useToast();

  const { userSettings, setUserSettings } = useGlobalStore(
    useShallow((state) => ({
      userSettings: state.userSettings,
      setUserSettings: state.setUserSettings,
    }))
  );
  const userLanguage = userSettings.userLanguage;

  const setUserLanguage = async (language: keyof typeof LOCALE_RESOURCES) => {
    try {
      i18n.changeLanguage(language);
      setUserSettings({ userLanguage: language });
    } catch (e: any) {
      console.error(e);
      toast({
        title: t("misc.error"),
        description: e.message ?? e.description ?? t("errors.genericError"),
      });
    }
  };

  return (
    <Page title={t("operations.setup_.language")} border="popOver">
      <View className="flex-1 flex-col">
        <View className="flex-1 flex-row gap-4">
          <SetupIcon Icon={() => <LanguageSvg />} text={t("fields.language")} />
          <View className="flex-1 gap-2">
            {availableLanguages.map((language) => (
              <TabItem
                key={language}
                variant="glass"
                state={language === userLanguage ? "selected" : "unselected"}
                onPress={() =>
                  setUserLanguage(language as keyof typeof LOCALE_RESOURCES)
                }
              >
                <Text>
                  {LOCALE_NAMES[language as keyof typeof LOCALE_RESOURCES]}
                </Text>
              </TabItem>
            ))}
          </View>
        </View>
      </View>
    </Page>
  );
}
