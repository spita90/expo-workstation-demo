import { BottomBar } from "@/components/manometersLayout/BottomBar";
import { Slot } from "expo-router";
import { Image, View } from "react-native";
import { LeftManometers } from "../../components/manometersLayout/LeftManometers";
import { RightManometers } from "../../components/manometersLayout/RightManometers";
import { TopBar } from "../../components/TopBar";

export default function ManometerLayout() {
  return (
    <>
      <TopBar />
      <View className="w-full h-[calc(100%-50px)] bg-background">
        <View className="flex flex-col w-full h-full pt-2">
          <View className="flex flex-row flex-1 px-3 justify-between">
            <LeftManometers />
            <RightManometers />
          </View>
          <BottomBar />
        </View>
        <View className="absolute z-10 top-0 bottom-0 left-56 right-56 h-full mt-0 pb-36 items-center justify-center">
          <View className="relative w-full h-full items-center">
            <Slot />
            <Image
              className="absolute -z-10 opacity-70 -bottom-10"
              source={require("assets/images/page-shadow.png")}
            />
          </View>
        </View>
        <Image
          className="absolute -z-10 bottom-0 opacity-70"
          source={require("assets/images/blur-red.png")}
        />
      </View>
    </>
  );
}
