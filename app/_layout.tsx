import { Text } from "@/components/ui/text";
import { Toaster } from "@/components/ui/toaster";
import { useGlobalStore } from "@/stores/globalStore";
import { InitializationType } from "@/stores/slices/appConfigSlice";
import { useFonts } from "expo-font";
import { Stack, router } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";
import "react-native-reanimated";
import { useShallow } from "zustand/shallow";
import "../global.css";

export default function RootLayout() {
  const { initializationType, error } = useGlobalStore(
    useShallow((state) => ({
      initializationType: state.initializationType,
      error: state.error,
    }))
  );
  const [fontsLoaded] = useFonts({
    Roboto: require("@/assets/fonts/Roboto-Variable.ttf"),
    Agdasima: require("@/assets/fonts/Agdasima-Regular.ttf"),
  });

  useEffect(() => {
    document.documentElement.classList.add("bg-background");
  }, []);

  const appIsReady =
    fontsLoaded && initializationType !== InitializationType.INITIALIZING;

  useEffect(() => {
    if (error) {
      router.replace("/error");
      return;
    }
    if (!appIsReady) return;
    if (initializationType === InitializationType.FIRST_INIT) {
      router.replace("/factorySetup");
      return;
    }
    if (initializationType === InitializationType.USER) {
      router.replace("/home");
      return;
    }
  }, [appIsReady, initializationType, error]);

  if (!appIsReady && !error) {
    return null; //TODO splash
  }

  return (
    <View className="w-screen h-screen">
      <Stack screenOptions={{ headerShown: false }} />
      <Toaster />
      {__DEV__ && (
        <View className="fixed h-6 items-center justify-center bottom-0 right-2 px-1 bg-primary-400 rounded-t">
          <Text className="text-[14px] font-bold text-black">DEVELOPMENT</Text>
        </View>
      )}
    </View>
  );
}
//TODO add error boundary (which sets error in the globalStore)
