import { Page } from "@/components/Page";
import { Slot } from "expo-router";
import { t } from "i18next";

export default function FactorySetupLayout() {
  return (
    <Page
      className="bg-background"
      title={t("operationTitles.factorySetup")}
      noBackButton
    >
      <Slot />
    </Page>
  );
}
