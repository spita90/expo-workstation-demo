import { Text, TextClassContext } from "@/components/ui/text";
import { useGlobalStore } from "@/stores/globalStore";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { useShallow } from "zustand/shallow";
import { Separator } from "./ui/separator";

const TopBarSeparator = () => (
  <Separator orientation="vertical" className="h-4 bg-zinc-200" />
);

export const TOP_BAR_HEIGHT = 50;

export const TopBar = () => {
  const { userLanguage, wifiConnected } = useGlobalStore(
    useShallow((state) => ({
      userLanguage: state.userSettings.userLanguage,
      wifiConnected: state.wifiConnected,
    }))
  );
  const [date, setDate] = useState<string>(dayjs().format("L"));
  const [time, setTime] = useState<string>(dayjs().format("LT"));

  useEffect(() => {
    const updateTime = () => {
      const dateTime = dayjs();
      const _date = dateTime.format("L");
      const _time = dateTime.format("LT");
      if (_date !== date) {
        setDate(_date);
      }
      if (_time !== time) {
        setTime(_time);
      }
    };

    updateTime();
    const interval = setInterval(() => {
      updateTime();
    }, 1000);
    return () => clearInterval(interval);
  }, [userLanguage]);

  return (
    <View className="flex">
      <View
        className={`flex flex-row w-full p-3 items-center justify-between border-b-[1px] border-zinc-200 z-10 bg-background`}
        style={{ height: TOP_BAR_HEIGHT }}
      >
        <View className="flex-row gap-2 items-center">
          <TextClassContext.Provider value="paragraph-regular-medium">
            <Text>{time}</Text>
            <TopBarSeparator />
            <Text>{date}</Text>
            {wifiConnected && (
              <>
                <TopBarSeparator />
                {/* wifi icon */}
              </>
            )}
          </TextClassContext.Provider>
        </View>
      </View>
    </View>
  );
};
