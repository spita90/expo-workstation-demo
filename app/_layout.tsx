import { Text } from "@/components/ui/text";
import { Toaster } from "@/components/ui/toaster";
import { useGlobalStore } from "@/stores/globalStore";
import { InitializationType } from "@/stores/slices/appConfigSlice";
import { useFonts } from "expo-font";
import { Stack, router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import "react-native-reanimated";
import { useShallow } from "zustand/shallow";
import "../global.css";
import { useTranslation } from "react-i18next";
import { metricsEmulator } from "@/lib/metricsEmulator";

const MIN_WIDTH = 1280;
const MIN_HEIGHT = 800;

export default function RootLayout() {
  const [isValidSize, setIsValidSize] = useState(true);
  const { t } = useTranslation();
  const { initializationType, setInitializationType, error } = useGlobalStore(
    useShallow((state) => ({
      initializationType: state.initializationType,
      setInitializationType: state.setInitializationType,
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
    if (!isValidSize) return;
    if (error) {
      router.replace("/error");
      return;
    }
    if (initializationType === InitializationType.INITIALIZING) {
      setTimeout(() => {
        // fake initilization delay
        setInitializationType(InitializationType.USER);
      }, 2000);
    }
    if (!appIsReady) return;
    if (initializationType === InitializationType.USER) {
      const clearInterval = metricsEmulator();
      router.replace("/home");
      return () => clearInterval();
    }
  }, [appIsReady, initializationType, error, isValidSize]);

  useEffect(() => {
    const checkSize = () => {
      setIsValidSize(
        window.innerWidth >= MIN_WIDTH && window.innerHeight >= MIN_HEIGHT
      );
    };

    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  if (!appIsReady && !error) {
    return null; //TODO splash
  }

  if (!isValidSize) {
    return (
      <div className="w-screen h-screen flex items-center justify-center text-center p-4">
        <p className="text-xl font-semibold text-red-600">
          {t("errors.minimumResolution", {
            width: MIN_WIDTH,
            height: MIN_HEIGHT,
          })}
        </p>
      </div>
    );
  }

  return (
    <View className="w-screen h-screen items-center justify-center">
      <View className="w-[1280px] h-[800px] bg-white shadow-xl overflow-hidden">
        <Stack screenOptions={{ headerShown: false }} />
      </View>
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
