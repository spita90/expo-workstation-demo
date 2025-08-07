import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useGlobalStore } from "@/stores/globalStore";
import { Stack } from "expo-router";
import { View } from "react-native";
import { useShallow } from "zustand/shallow";

export default function ErrorScreen() {
  const { error } = useGlobalStore(
    useShallow((state) => ({
      error: state.error,
    }))
  );

  return (
    <>
      <Stack.Screen name="error" />
      <View className="gap-4">
        <Text>
          {error?.message ?? (error as any)?.description ?? "Generic error"}
        </Text>
        <View className="items-start">
          <Button
            variant="secondary"
            onPress={() => {
              // restart the app
              window.location.replace("/");
            }}
          >
            <Text>Restart</Text>
          </Button>
        </View>
      </View>
    </>
  );
}
