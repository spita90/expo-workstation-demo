import { View } from "react-native";
import { Text } from "./ui/text";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { PRIMARY_BUTTON_STYLE, OUTLINE_BUTTON_STYLE } from "./ui/button";
import { useTranslation } from "react-i18next";

type EnterKeyMode = "continue" | "skipAndContinue";

export interface KeyboardProps {
  onChange: (text?: string) => void;
  onEnterPress: (text?: string) => void;
  enterKeyMode: EnterKeyMode;
  maxLength?: number;
}

const KeyboardButton = ({
  button,
  enterKeyMode,
  onButtonPress,
}: {
  button: string;
  enterKeyMode: EnterKeyMode;
  onButtonPress: (button: string) => void;
}) => {
  const { t } = useTranslation();

  let keyText = button;
  if (button === "space") {
    keyText = "";
  } else if (button === "enter") {
    keyText =
      enterKeyMode === "continue"
        ? t("misc.continue")
        : t("misc.skipAndContinue");
  } else if (button === "backSpace") {
    keyText = "⌫";
  }

  return (
    <button
      className={cn(
        "flex items-center justify-center w-[64px] h-[64px] m-1 active:bg-primary-500 border-[1.5px] rounded border-white/20",
        button === "enter" &&
          enterKeyMode === "continue" &&
          `w-[200px] ${PRIMARY_BUTTON_STYLE}`,
        button === "enter" &&
          enterKeyMode === "skipAndContinue" &&
          `w-[200px] ${OUTLINE_BUTTON_STYLE}`,
        button === "space" && "w-[368px]"
      )}
      onClick={() => onButtonPress(button)}
    >
      <Text
        className={cn({
          "title-regular-large": button !== "enter",
          "paragraph-semibold-large": button === "enter",
        })}
      >
        {keyText}
      </Text>
    </button>
  );
};

export const Keyboard = ({
  onChange,
  onEnterPress,
  enterKeyMode,
  maxLength,
}: KeyboardProps) => {
  const KEYBOARD_BUTTONS: string[][] = [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", "backSpace"],
    ["Z", "X", "C", "V", "B", "N", "M", ".", ","],
    ["space", "enter"],
  ];
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    onChange(value);
  }, [value]);

  return (
    <View className="flex-col items-center">
      {KEYBOARD_BUTTONS.map((rowButtons, idx) => (
        <View key={idx} className="flex-row">
          {rowButtons.map((button, idx) => {
            return (
              <KeyboardButton
                onButtonPress={(k) => {
                  if (k === "enter") {
                    onEnterPress(value);
                    return;
                  }

                  if (k === "backSpace") {
                    setValue((v) => v?.slice(0, -1));
                    return;
                  }

                  if (k === "space") {
                    setValue((v) => v + " ");
                    return;
                  }

                  if (maxLength && value.length >= maxLength) {
                    return;
                  }

                  setValue((v) => v + k);
                }}
                button={button}
                enterKeyMode={enterKeyMode}
                key={idx}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
};
