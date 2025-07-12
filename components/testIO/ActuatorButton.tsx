import TestIoEvIconSvg from "@/assets/svgs/test_io_ev_icon.svg";
import TestIoLoadIconSvg from "@/assets/svgs/test_io_load_icon.svg";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import React from "react";
import { Pressable } from "react-native";

export type ActuatorButtonIconType = "EV" | "LOAD";

const IconMap: Record<ActuatorButtonIconType, JSX.Element> = {
  EV: <TestIoEvIconSvg width={24} height={24} />,
  LOAD: <TestIoLoadIconSvg width={24} height={24} />,
};

export type ActuatorButtonProps = React.ComponentPropsWithoutRef<
  typeof Pressable
> & {
  label: string;
  icon: ActuatorButtonIconType;
  active: boolean;
};

export const ActuatorButton = React.forwardRef<
  React.ElementRef<typeof Pressable>,
  ActuatorButtonProps
>(({ className, label, icon, active, ...props }, ref) => {
  return (
    <Pressable
      className={cn(
        "flex-row px-1 py-1 gap-0.5 rounded-full items-center bg-white active:opacity-50",
        { "bg-neutral-600 border-[0.5px] border-neutral-300": active },
        className
      )}
      ref={ref}
      {...props}
    >
      {IconMap[icon]}
      <Text
        className={cn("text-[16px]", {
          "text-black": !active,
          "text-white": active,
        })}
      >
        {label}
      </Text>
    </Pressable>
  );
});
