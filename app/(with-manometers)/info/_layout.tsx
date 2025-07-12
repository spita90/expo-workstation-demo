import { Page } from "@/components/Page";
import { Slot } from "expo-router";
import { t } from "i18next";

export default function InfoLayout() {
  return (
    <Page title={t("operationTitles.info")} border="popOver">
      <Slot />
    </Page>
  );
}
