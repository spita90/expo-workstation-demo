import { View } from "react-native";
import { Text } from "./text";
import { FunctionComponent, SVGProps } from "react";

export type SetupIconProps = {
  Icon: FunctionComponent<
    SVGProps<SVGSVGElement> & {
      title?: string;
    }
  >;
  text: string;
};

export const SetupIcon = ({ Icon, text }: SetupIconProps) => {
  return (
    <View className="w-[140px] h-fit items-center bg-white/10 p-6 gap-2 rounded-lg">
      <Icon />
      <Text className="title-semibold-medium text-center">{text}</Text>
    </View>
  );
};
