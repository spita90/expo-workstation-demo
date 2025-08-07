import { View } from "react-native";
import { Text } from "./ui/text";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type NumPadMode = "code" | "number" | "decimal";

export interface NumPadProps {
  onChange: (text?: string) => void;
  mode: NumPadMode;
  initialValue?: string;
  maxLength?: number;
}

const NumPadButton = ({
  button,
  mode,
  onButtonPress,
}: {
  button: string;
  mode: NumPadMode;
  onButtonPress: (button: string) => void;
}) => {
  return (
    <button
      className={cn(
        "flex items-center justify-center w-[84px] h-[84px] active:bg-primary-500 border-[1.5px] rounded border-white/20",
        { "col-span-2 w-[176px]": button === "backSpace" && mode !== "decimal" }
      )}
      onClick={() => onButtonPress(button)}
    >
      <Text className="title-regular-large">
        {button === "backSpace" ? `⌫` : button === "comma" ? "." : button}
      </Text>
    </button>
  );
};

export const NumPad = ({
  onChange,
  mode,
  initialValue,
  maxLength,
}: NumPadProps) => {
  const NUMPAD_BUTTONS: {
    [key in NumPadMode]: (string | undefined)[];
  } = {
    code: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backSpace"],
    number: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backSpace"],
    decimal: [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "comma",
      "0",
      "backSpace",
    ],
  };
  const [value, setValue] = useState<string>(initialValue ?? "");

  useEffect(() => {
    onChange(value);
  }, [value]);

  return (
    <View className="grid grid-cols-3 gap-spacing-8">
      {NUMPAD_BUTTONS[mode].map((button, idx) => {
        if (button === undefined) return <View key={idx} />;
        return (
          <NumPadButton
            onButtonPress={(k) => {
              if (k === "backSpace") {
                setValue((v) => v?.slice(0, -1));
                return;
              }

              if (maxLength && value.length >= maxLength) {
                return;
              }

              if (mode === "number" && value === "0") {
                setValue(k);
                return;
              }
              if (mode === "decimal") {
                const hasComma = value.includes(".");
                if (hasComma && k === "comma") return; // only one comma
                if (k === "comma" && value === "") {
                  setValue("0.");
                  return;
                }
                if (k === "comma") k = ".";
                if (value.startsWith("0") && !hasComma && k !== ".") {
                  setValue(k);
                  return;
                }
                setValue((v) => v + k);
                return;
              }
              setValue((v) => v + k);
            }}
            button={button}
            mode={mode}
            key={idx}
          />
        );
      })}
    </View>
  );
};
