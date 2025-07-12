import * as React from "react";
import { TextInput, View, type TextInputProps } from "react-native";
import { cn } from "@/lib/utils";
import { Text } from "./text";

export interface ExtendedInputProps extends TextInputProps {
  focused?: boolean;
  rightLabel?: string;
}

const Input = React.forwardRef<
  React.ElementRef<typeof TextInput>,
  ExtendedInputProps
>(({ className, placeholderClassName, focused, rightLabel, ...props }, ref) => {
  return (
    <View className="relative">
      <TextInput
        ref={ref}
        className={cn(
          `flex h-10 w-full rounded border text-white
        border-zinc-500 bg-white/20 ring-offset-zinc-100
        px-3 py-2 paragraph-regular-medium placeholder:text-zinc-400
        file:border-0 file:bg-transparent file:font-medium
        focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white focus-visible:ring-offset-1
        disabled:bg-transparent disabled:text-zinc-500 disabled:cursor-not-allowed`,
          {
            "opacity-50 cursor-not-allowed": props.editable === false,
            "ring-2 ring-zinc-100": focused,
          },
          className
        )}
        placeholderClassName={cn(placeholderClassName)}
        {...props}
      />
      {rightLabel && (
        <Text
          className={cn(
            `absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400`
          )}
        >
          {rightLabel}
        </Text>
      )}
    </View>
  );
});

Input.displayName = "Input";

export { Input };
