import { Page } from "@/components/Page";
import { Slot } from "expo-router";

export default function ErrorLayout() {
  return (
    <Page className="bg-background" title="Error" noBackButton>
      <Slot />
    </Page>
  );
}
