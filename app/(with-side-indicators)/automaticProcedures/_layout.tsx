import { Page } from "@/components/Page";
import { Slot } from "expo-router";
import { t } from "i18next";

export default function AutomaticProceduresLayout() {
  return (
    <Page title={t("operationTitles.automatic")} border="popOver">
      <Slot />
    </Page>
  );
}
