import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useToast } from "@/hooks/use-toast";
import { useGlobalStore } from "@/stores/globalStore";
import { InitializationType } from "@/stores/slices/appConfigSlice";
import { WiringDiagram } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "expo-router";
import { t } from "i18next";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import { z } from "zod";
import { useShallow } from "zustand/shallow";

const wiringDiagramOptions = Object.entries(WiringDiagram).reduce(
  (acc, [key, value]) => {
    if (isNaN(Number(key)) && value !== WiringDiagram.UNDETERMINED)
      acc.push({
        value: Number(value),
        label: key,
      });
    return acc;
  },
  [] as { value: WiringDiagram; label: string }[]
);

const StorageUnitSchema = z.object({
  "Serial Number": z
    .string()
    .toUpperCase()
    .regex(/^([A-Z]{2}\d{2}\d{5})$/, {
      // 2 letters (plant letter, month letter), 2 digits (production year), 5 digits (progressive integer on an annual basis. Each year restarts from 1)
      message: "errors.invalidSerialNumber",
    }),
  "Wiring Diagram": z
    .string()
    .refine(
      (val) =>
        wiringDiagramOptions.map(({ value }) => value).includes(Number(val)),
      {
        message: "errors.invalidWiringDiagram",
      }
    ),
});

export type StorageUnit = z.infer<typeof StorageUnitSchema>;

export default function FactorySetupScreen() {
  const { errorToast } = useToast();
  const { setSystemConfig, setInitializationType } = useGlobalStore(
    useShallow((state) => ({
      setSystemConfig: state.setSystemConfig,
      setInitializationType: state.setInitializationType,
    }))
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<StorageUnit>({
    resolver: zodResolver(StorageUnitSchema),
  });

  const onSubmit = async (data: StorageUnit) => {
    try {
      setSystemConfig({
        serialNumber: data["Serial Number"].toUpperCase(),
        wiringDiagram: Number(data["Wiring Diagram"]),
      });
      setInitializationType(InitializationType.USER);
    } catch (e: any) {
      console.error(e);
      errorToast(e.message ?? t("errors.genericError"));
    }
  };

  return (
    <>
      <Stack.Screen name="factorySetup" />
      <View className="mt-4 gap-4 grid grid-cols-2">
        {Object.keys(StorageUnitSchema.shape).map((key, idx) => {
          if (key === "Wiring Diagram") {
            return (
              <View
                className="bg-zinc-700 text-white p-4 gap-2 rounded"
                key={key}
              >
                <Text className="text-lg font-bold">{key}</Text>
                <select
                  className="bg-zinc-600 text-white p-2 rounded"
                  {...register(key as keyof StorageUnit)}
                  onChange={(e) =>
                    setValue(key as keyof StorageUnit, e.target.value)
                  }
                >
                  {wiringDiagramOptions.map((diagram) => (
                    <option key={diagram.value} value={diagram.value}>
                      {diagram.label}
                    </option>
                  ))}
                </select>
              </View>
            );
          }
          return (
            <View
              key={key}
              className="flex flex-col p-4 gap-2 rounded bg-zinc-700"
            >
              <Text className="text-lg font-bold">{key}</Text>
              <Input
                {...register(key as keyof StorageUnit)}
                autoFocus={idx === 0}
                onChangeText={(text) =>
                  setValue(key as keyof StorageUnit, text)
                }
              />
              {errors[key as keyof StorageUnit] && (
                <Text className="text-red-500">
                  {t(errors[key as keyof StorageUnit]?.message ?? "")}
                </Text>
              )}
            </View>
          );
        })}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="h-full py-8">
              <Text>{t("misc.confirm")}</Text>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("misc.warning")}</DialogTitle>
            </DialogHeader>
            <DialogDescription>{t("dialogs.sureToSave")}</DialogDescription>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">
                  <Text>{t("misc.cancel")}</Text>
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  onPress={handleSubmit(onSubmit, (e) =>
                    errorToast(
                      e["Serial Number"]?.message ??
                        e["Wiring Diagram"]?.message ??
                        t("errors.genericError")
                    )
                  )}
                >
                  <Text>{t("misc.yes")}</Text>
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </View>
    </>
  );
}
