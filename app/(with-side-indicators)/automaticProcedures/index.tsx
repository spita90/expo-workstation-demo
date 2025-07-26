import { Keyboard } from "@/components/Keyboard";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Stack } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

export default function AutomaticProceduresScreen() {
  const { toast } = useToast();
  const [value, setValue] = useState("");

  return (
    <>
      <Stack.Screen name="automaticProcedures" />
      <View className="flex-1 gap-4">
        <Input autoFocus value={value} focused />
        <Keyboard
          enterKeyMode="continue"
          onChange={(v) => setValue(v || "")}
          onEnterPress={() =>
            toast({
              title: "info",
              description: "OK!",
              duration: 3000,
            })
          }
        />
      </View>
    </>
  );
}
