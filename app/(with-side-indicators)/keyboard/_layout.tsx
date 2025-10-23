import { Page } from "@/components/Page";
import { Slot } from "expo-router";
import { t } from "i18next";

export default function KeyboardLayout() {
  return (
    <Page title={t("operationTitles.keyboard")} border="popOver">
      <Slot />
    </Page>
  );
}
