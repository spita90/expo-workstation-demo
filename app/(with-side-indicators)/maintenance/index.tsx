import { Page } from "@/components/Page";
import {
  ActuatorButton,
  ActuatorButtonIconType,
} from "@/components/testIO/ActuatorButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Peripheral } from "@/types";
import { useRouter } from "expo-router";
import { PlayIcon, SquareIcon, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DimensionValue, FlatList, Pressable, View } from "react-native";

type ActuatorView = {
  icon: ActuatorButtonIconType;
  position: {
    top?: DimensionValue;
    bottom?: DimensionValue;
    left?: DimensionValue;
    right?: DimensionValue;
  };
};

type TestRunCode =
  | "firstProcedure"
  | "secondProcedure"
  | "thirdProcedure"
  | "fourthProcedure"
  | "fifthProcedure"
  | "sixthProcedure";

const actuatorButtonsMap: Partial<Record<Peripheral, ActuatorView>> = {
  [Peripheral.EV_01]: {
    position: { top: "14%", left: "22%" },
    icon: "EV",
  },
  [Peripheral.EV_02]: {
    position: { top: "3%", left: "22%" },
    icon: "EV",
  },
  [Peripheral.EV_03]: {
    position: { top: "20%", left: "45%" },
    icon: "EV",
  },
  [Peripheral.EV_04]: {
    position: { top: "10%", left: "40%" },
    icon: "EV",
  },
  [Peripheral.EV_05]: {
    position: { top: "13%", right: "34%" },
    icon: "EV",
  },
  [Peripheral.EV_06]: {
    position: { top: "41%", right: "6.5%" },
    icon: "EV",
  },
  [Peripheral.EV_07]: {
    position: { bottom: "40%", right: "25%" },
    icon: "EV",
  },
  [Peripheral.EV_08]: {
    position: { bottom: "18%", left: "25%" },
    icon: "EV",
  },
  [Peripheral.EV_09]: {
    position: { bottom: "41%", right: "45%" },
    icon: "EV",
  },
  [Peripheral.EV_10]: {
    position: { top: "39%", left: "38%" },
    icon: "EV",
  },
  [Peripheral.EV_11]: {
    position: { top: "10%", right: "21%" },
    icon: "EV",
  },
  [Peripheral.EV_12]: {
    position: { bottom: "43%", left: "14%" },
    icon: "EV",
  },
  [Peripheral.EV_13]: {
    position: { bottom: "23%", left: "14%" },
    icon: "EV",
  },
  [Peripheral.EV_14]: {
    position: { bottom: "33%", left: "14%" },
    icon: "EV",
  },
  [Peripheral.EV_15]: {
    position: { top: "31%", right: "24%" },
    icon: "EV",
  },
  [Peripheral.EV_18]: {
    position: { bottom: "42%", left: "35%" },
    icon: "EV",
  },
  [Peripheral.EV_19]: {
    position: { bottom: "5%", left: "25%" },
    icon: "EV",
  },
  [Peripheral.EV_20]: {
    position: { top: "31%", left: "13%" },
    icon: "EV",
  },
  [Peripheral.EV_21]: {
    position: { top: "31%", left: "3%" },
    icon: "EV",
  },
  [Peripheral.EV_22]: {
    position: { top: "36%", left: "24%" },
    icon: "EV",
  },
  [Peripheral.VACUUM_PUMP]: {
    position: { top: "2%", left: "48%" },
    icon: "LOAD",
  },
  [Peripheral.COMPRESSOR]: {
    position: { top: "22%", right: "11%" },
    icon: "LOAD",
  },
  [Peripheral.CONDENSER_FAN]: {
    position: { bottom: "16%", right: "19%" },
    icon: "LOAD",
  },
  [Peripheral.HEATER]: {
    position: { bottom: "10%", right: "46%" },
    icon: "LOAD",
  },
};

const actuators: Peripheral[] = [
  Peripheral.COMPRESSOR,
  Peripheral.CONDENSER_FAN,
  Peripheral.VACUUM_PUMP,
  Peripheral.HEATER,
  Peripheral.EV_01,
  Peripheral.EV_02,
  Peripheral.EV_03,
  Peripheral.EV_04,
  Peripheral.EV_05,
  Peripheral.EV_06,
  Peripheral.EV_07,
  Peripheral.EV_08,
  Peripheral.EV_09,
  Peripheral.EV_10,
  Peripheral.EV_18,
  Peripheral.EV_11,
  Peripheral.EV_12,
  Peripheral.EV_13,
  Peripheral.EV_14,
  Peripheral.EV_15,
  Peripheral.EV_19,
  Peripheral.EV_20,
  Peripheral.EV_21,
  Peripheral.EV_22,
];

type TestRun = {
  code: TestRunCode;
  nameKey: string;
  actuators: Peripheral[];
};

const testRuns: TestRun[] = [
  {
    code: "firstProcedure",
    nameKey: "operations.maintenance_.runs.firstProcedure",
    actuators: [
      Peripheral.EV_01,
      Peripheral.EV_02,
      Peripheral.EV_03,
      Peripheral.EV_15,
      Peripheral.COMPRESSOR,
    ],
  },
  {
    code: "secondProcedure",
    nameKey: "operations.maintenance_.runs.secondProcedure",
    actuators: [
      Peripheral.EV_01,
      Peripheral.EV_02,
      Peripheral.EV_04,
      Peripheral.VACUUM_PUMP,
    ],
  },
  {
    code: "thirdProcedure",
    nameKey: "operations.maintenance_.runs.thirdProcedure",
    actuators: [Peripheral.EV_01, Peripheral.EV_02, Peripheral.EV_12],
  },
  {
    code: "fourthProcedure",
    nameKey: "operations.maintenance_.runs.fourthProcedure",
    actuators: [Peripheral.EV_01, Peripheral.EV_02, Peripheral.EV_13],
  },
  {
    code: "fifthProcedure",
    nameKey: "operations.maintenance_.runs.fifthProcedure",
    actuators: [Peripheral.EV_01, Peripheral.EV_02, Peripheral.EV_14],
  },
  {
    code: "sixthProcedure",
    nameKey: "operations.maintenance_.runs.sixthProcedure",
    actuators: [Peripheral.EV_01, Peripheral.EV_02, Peripheral.EV_08],
  },
];

const warningModalCaptions = {
  actuatorPressButRunningProcedure:
    "operations.maintenance_.actuatorPressButRunningProcedure",
  testRunPressButActiveActuators:
    "operations.maintenance_.testRunPressButActiveActuators",
};

const getActuatorLabel = (actuator: Peripheral) => {
  const customLabelActuators = {
    [Peripheral.VACUUM_PUMP]: "PMP",
    [Peripheral.COMPRESSOR]: "CMP",
    [Peripheral.CONDENSER_FAN]: "CND",
    [Peripheral.HEATER]: "HTR",
  } as Record<Peripheral, string>;
  if (actuator in customLabelActuators) {
    return customLabelActuators[actuator];
  }
  return `AC${actuator}`;
};

export default function TestIOScreen() {
  const { t } = useTranslation();
  const { back } = useRouter();
  const { errorToast } = useToast();

  const [testRunModalOpen, setTestRunModalOpen] = useState<boolean>(false);
  const [warningModalOpenReason, setWarningModalOpenReason] = useState<
    "actuatorPressButRunningProcedure" | "testRunPressButActiveActuators"
  >();
  const [activeActuators, setActiveActuators] = useState<Peripheral[]>([]);
  const [runningTestRunCode, setRunningTestRunCode] = useState<
    TestRunCode | undefined
  >(undefined);

  const turnOffAllActuators = async () => {
    setActiveActuators([]);
  };

  const launchTestRun = async (testRun: TestRun) => {
    try {
      setRunningTestRunCode(testRun.code);
      setActiveActuators(testRun.actuators);
      setTestRunModalOpen(false);
    } catch (error: any) {
      console.error(error);
      errorToast(
        error.message ?? error.description ?? t("errors.genericError")
      );
    }
  };

  const stopTestRun = async () => {
    await turnOffAllActuators();
    setRunningTestRunCode(undefined);
  };

  const handleTestRunButtonPress = () => {
    if (testRunModalOpen) {
      setTestRunModalOpen(false);
      return;
    }
    if (activeActuators.length > 0) {
      setWarningModalOpenReason("testRunPressButActiveActuators");
      return;
    }
    setTestRunModalOpen(true);
  };

  const toggleActuator = async (actuator: Peripheral) => {
    try {
      const newActiveActuators = activeActuators.includes(actuator)
        ? activeActuators.filter((a) => a !== actuator)
        : [...activeActuators, actuator];
      setActiveActuators(newActiveActuators);
    } catch (error: any) {
      console.error(error);
      errorToast(
        error.message ?? error.description ?? t("errors.genericError")
      );
    }
  };

  const handleActuatorPress = (actuator: Peripheral) => {
    if (runningTestRunCode) {
      setWarningModalOpenReason("actuatorPressButRunningProcedure");
      return;
    }
    toggleActuator(actuator);
  };

  const handleBackPress = async () => {
    try {
      if (runningTestRunCode) {
        await stopTestRun();
      } else if (activeActuators.length > 0) {
        await turnOffAllActuators();
      }
      back();
    } catch (error: any) {
      console.error(error);
      errorToast(
        error.message ?? error.description ?? t("errors.genericError")
      );
    }
  };

  return (
    <Page
      title={t("operationTitles.maintenance")}
      border="popOver"
      onBackButtonPress={handleBackPress}
    >
      <Dialog className="flex-1" open={warningModalOpenReason !== undefined}>
        <View className="flex-1 mb-2 items-center justify-center">
          <Pressable
            className={cn(
              "absolute top-0 bottom-0 left-0 right-0 h-full w-full rounded bg-black",
              {
                "opacity-50": testRunModalOpen,
                "opacity-0": !testRunModalOpen,
              }
            )}
            onPress={() => {
              setTestRunModalOpen(false);
            }}
          />
          {/* actuators */}
          {actuators.map((actuator) => {
            const actuatorView = actuatorButtonsMap[actuator];
            if (!actuatorView) return null;
            return (
              <ActuatorButton
                key={actuator}
                onPress={() => handleActuatorPress(actuator)}
                className={cn("absolute", {
                  "opacity-50": testRunModalOpen,
                })}
                style={{
                  top: actuatorView.position.top,
                  bottom: actuatorView.position.bottom,
                  left: actuatorView.position.left,
                  right: actuatorView.position.right,
                }}
                active={activeActuators.includes(actuator)}
                icon={actuatorView.icon}
                label={getActuatorLabel(actuator)}
              />
            );
          })}
          <svg
            className={cn({ "opacity-50": testRunModalOpen })}
            viewBox="0 0 673 390"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              opacity="0.11"
              d="M368.29 38.0303H337.7C330.41 38.0303 324.49 44.0703 324.49 51.5303C324.49 58.9903 330.4 65.0303 337.7 65.0303H368.29C375.58 65.0303 381.5 58.9903 381.5 51.5303C381.5 44.0703 375.59 38.0303 368.29 38.0303Z"
              fill="#3B82F6"
            />
            <path
              opacity="0.11"
              d="M569.5 148.03C580.55 148.03 589.5 139.08 589.5 128.03C589.5 116.98 580.55 108.03 569.5 108.03C558.45 108.03 549.5 116.98 549.5 128.03C549.5 139.08 558.45 148.03 569.5 148.03Z"
              fill="#3B82F6"
            />
            <path
              d="M99.2998 31.1797H201.66V73.8797H99.7398"
              stroke="#3B82F6"
              strokeWidth="1.42"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M202 52.3203H321.2"
              stroke="#3B82F6"
              strokeWidth="1.42"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M226.92 52.5V199.85H379.9V123.43H408.56"
              stroke="#3B82F6"
              strokeWidth="1.42"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M258.5 52.46V82.28H376.03V116.24H408.64"
              stroke="#3B82F6"
              strokeWidth="1.42"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M366.31 65.9297V69.4997H425.51V110.17"
              stroke="#3B82F6"
              strokeWidth="1.42"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M440.54 110.17V85.28H545.29V10.21"
              stroke="#3B82F6"
              strokeWidth="1.42"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* analyzer */}
            <path
              d="M584.5 48.0996H467M584.5 48.0996V31M584.5 48.0996H599.5"
              stroke="#3B82F6"
              strokeWidth="1.42"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect
              opacity="0.5"
              x="445.5"
              y="39.5"
              width="32"
              height="18"
              rx="1"
              fill="#3B82F6"
            />
            <path
              d="M545.5 48.0996H584.5V31"
              stroke="#3B82F6"
              strokeWidth="1.42"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M451.56 127.29H493.54"
              stroke="#3B82F6"
              strokeWidth="1.42"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M647.86 103.91H671.26V185.46H455.43V150.03H448.46"
              stroke="#3B82F6"
              strokeWidth="1.42"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M619.71 103.64H564.88V107.99"
              stroke="#3B82F6"
              strokeWidth="1.42"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M503.61 125.09V116.7H552.62"
              stroke="#3B82F6"
              strokeWidth="1.42"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M559.98 146.05V164.06H633.68V148.76"
              stroke="#3B82F6"
              strokeWidth="1.42"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M427.87 163.58V210.78H558.89V237"
              stroke="#3B82F6"
              strokeWidth="1.42"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M552.34 224.9H402.5V141.52V136.02V125.52M402.5 123.02V75.0195"
              stroke="#3B82F6"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="2 2"
            />
            <path
              d="M416.76 130.48H391.24V267.05H419.61"
              stroke="#3B82F6"
              strokeWidth="1.42"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M402.28 69.7695V71.8895"
              stroke="#3B82F6"
              strokeWidth="1.42"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M400.5 132.03C400.5 130.93 401.4 130.03 402.5 130.03C403.6 130.03 404.5 130.93 404.5 132.03"
              fill="#333333"
            />
            <path
              d="M400.5 125.03C400.5 123.93 401.4 123.03 402.5 123.03C403.6 123.03 404.5 123.93 404.5 125.03"
              fill="#333333"
            />
            <path
              d="M288.96 304.48V171.5H321.72"
              stroke="#3B82F6"
              strokeWidth="1.42"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M415.88 293.37H145.21V199.86H226.8"
              stroke="#3B82F6"
              strokeWidth="1.42"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              opacity="0.5"
              d="M288.83 298.03C301.15 298.03 311.16 308.97 311.16 322.44V369.21H266.5V322.44C266.5 308.97 276.51 298.03 288.83 298.03Z"
              fill="#3B82F6"
            />
            <path
              d="M416.61 267.21H459.46V270.55H421.15V274.26H459.02V277.72H421.15V281.43H459.31V285.39H421.15V289.6H459.02V293.19H416.61"
              stroke="#6F8BDE"
              strokeWidth="2.13"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M457.62 264.4V295.21"
              stroke="#3B82F6"
              strokeWidth="0.91"
              strokeMiterlimit="10"
              strokeLinecap="round"
            />
            <path
              d="M454.49 264.4V295.21"
              stroke="#3B82F6"
              strokeWidth="0.91"
              strokeMiterlimit="10"
              strokeLinecap="round"
            />
            <path
              d="M451.35 264.4V295.21"
              stroke="#3B82F6"
              strokeWidth="0.91"
              strokeMiterlimit="10"
              strokeLinecap="round"
            />
            <path
              d="M448.21 264.4V295.21"
              stroke="#3B82F6"
              strokeWidth="0.91"
              strokeMiterlimit="10"
              strokeLinecap="round"
            />
            <path
              d="M445.07 264.4V295.21"
              stroke="#3B82F6"
              strokeWidth="0.91"
              strokeMiterlimit="10"
              strokeLinecap="round"
            />
            <path
              d="M441.93 264.4V295.21"
              stroke="#3B82F6"
              strokeWidth="0.91"
              strokeMiterlimit="10"
              strokeLinecap="round"
            />
            <path
              d="M438.79 264.4V295.21"
              stroke="#3B82F6"
              strokeWidth="0.91"
              strokeMiterlimit="10"
              strokeLinecap="round"
            />
            <path
              d="M435.65 264.4V295.21"
              stroke="#3B82F6"
              strokeWidth="0.91"
              strokeMiterlimit="10"
              strokeLinecap="round"
            />
            <path
              d="M432.51 264.4V295.21"
              stroke="#3B82F6"
              strokeWidth="0.91"
              strokeMiterlimit="10"
              strokeLinecap="round"
            />
            <path
              d="M429.37 264.4V295.21"
              stroke="#3B82F6"
              strokeWidth="0.91"
              strokeMiterlimit="10"
              strokeLinecap="round"
            />
            <path
              d="M426.23 264.4V295.21"
              stroke="#3B82F6"
              strokeWidth="0.91"
              strokeMiterlimit="10"
              strokeLinecap="round"
            />
            <path
              d="M423.09 264.4V295.21"
              stroke="#3B82F6"
              strokeWidth="0.91"
              strokeMiterlimit="10"
              strokeLinecap="round"
            />
            <path
              opacity="0.5"
              d="M499.17 282.45L495.49 283.97L495.52 284.1L498.17 286.95C500.13 289.04 499.78 292.14 497.4 293.87C495.02 295.59 491.51 295.29 489.55 293.19L486.6 290.02L486.31 290.2L483.31 294.06C481.56 296.31 478.4 296.63 476.27 294.79C474.13 292.94 473.82 289.62 475.58 287.37L478.04 284.21L477.46 283.75L473.67 282.03C471 280.82 469.73 277.46 470.84 274.53C471.95 271.6 475.01 270.21 477.68 271.42L481.44 273.13V269.39C481.44 266.4 483.9 263.98 486.94 263.98C489.98 263.98 492.44 266.4 492.44 269.39V273.24L492.7 273.47L495.37 272.36C498.03 271.26 501.03 272.63 502.08 275.42C503.13 278.2 501.83 281.35 499.17 282.45Z"
              fill="#3B82F6"
            />
            <path
              opacity="0.11"
              d="M489.04 285.05L490.53 284.62L490.58 284.58L490.23 284.37C489.84 284.58 489.4 284.75 488.94 284.88L489.04 285.06V285.05Z"
              fill="#3B82F6"
            />
            <path
              opacity="0.11"
              d="M482.88 284.26L483.8 285.08L483.96 285.13L484.21 284.69C483.81 284.54 483.44 284.35 483.1 284.14L482.89 284.27L482.88 284.26Z"
              fill="#3B82F6"
            />
            <path
              opacity="0.5"
              d="M487 286.03C490.04 286.03 492.5 283.57 492.5 280.53C492.5 277.49 490.04 275.03 487 275.03C483.96 275.03 481.5 277.49 481.5 280.53C481.5 283.57 483.96 286.03 487 286.03Z"
              fill="#3B82F6"
            />
            <path
              d="M486.5 275.03L499.5 267.03"
              stroke="#3B82F6"
              strokeWidth="0.91"
              strokeMiterlimit="10"
              strokeLinecap="round"
            />
            <path
              d="M491.44 283.98V297.98"
              stroke="#3B82F6"
              strokeWidth="0.91"
              strokeMiterlimit="10"
              strokeLinecap="round"
            />
            <path
              d="M483.5 285.03L469.5 276.03"
              stroke="#3B82F6"
              strokeWidth="0.91"
              strokeMiterlimit="10"
              strokeLinecap="round"
            />
            <path
              d="M486.94 298.98C497.16 298.98 505.44 290.7 505.44 280.48C505.44 270.26 497.16 261.98 486.94 261.98C476.72 261.98 468.44 270.26 468.44 280.48C468.44 290.7 476.72 298.98 486.94 298.98Z"
              stroke="#3B82F6"
              strokeWidth="0.91"
              strokeMiterlimit="10"
              strokeLinecap="round"
            />
            <path
              d="M486.94 285.98C489.98 285.98 492.44 283.52 492.44 280.48C492.44 277.44 489.98 274.98 486.94 274.98C483.9 274.98 481.44 277.44 481.44 280.48C481.44 283.52 483.9 285.98 486.94 285.98Z"
              stroke="#3B82F6"
              strokeWidth="0.91"
              strokeMiterlimit="10"
              strokeLinecap="round"
            />
            <path
              opacity="0.5"
              d="M368 65.0303C375.46 65.0303 381.5 58.9903 381.5 51.5303C381.5 44.0703 375.46 38.0303 368 38.0303C360.54 38.0303 354.5 44.0703 354.5 51.5303C354.5 58.9903 360.54 65.0303 368 65.0303Z"
              fill="#3B82F6"
            />
            <path
              opacity="0.5"
              d="M338 65.0303C345.46 65.0303 351.5 58.9903 351.5 51.5303C351.5 44.0703 345.46 38.0303 338 38.0303C330.54 38.0303 324.5 44.0703 324.5 51.5303C324.5 58.9903 330.54 65.0303 338 65.0303Z"
              fill="#3B82F6"
            />
            <path
              d="M368.29 38.0303H337.7C330.41 38.0303 324.49 44.0703 324.49 51.5303C324.49 58.9903 330.4 65.0303 337.7 65.0303H368.29C375.58 65.0303 381.5 58.9903 381.5 51.5303C381.5 44.0703 375.59 38.0303 368.29 38.0303Z"
              stroke="#3B82F6"
              strokeWidth="1.42"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M337.34 51.4404H368.64"
              stroke="#3B82F6"
              strokeWidth="1.42"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M91.3501 68.4805H99.3701V78.7505H91.3501"
              stroke="#3B82F6"
              strokeWidth="1.42"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M78.9798 78.7602H71.5898V68.4902H79.1898"
              stroke="#3B82F6"
              strokeWidth="1.42"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M76.5498 73.6201H94.1698"
              stroke="#3B82F6"
              strokeWidth="1.42"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M91.3501 26H99.3701V36.27H91.3501"
              stroke="#3B82F6"
              strokeWidth="1.42"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M78.9798 36.27H71.5898V26H79.1898"
              stroke="#3B82F6"
              strokeWidth="1.42"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M76.5498 31.1299H94.1698"
              stroke="#3B82F6"
              strokeWidth="1.42"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* PAG oil tank */}
            <path
              d="M145.21 199.86H57.9199V204.68"
              stroke="#3B82F6"
              strokeWidth="1.42"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              opacity="0.5"
              d="M59 193.03C64.24 193.03 68.5 197.54 68.5 203.09V226.03H49.5V203.09C49.5 197.54 53.76 193.03 59 193.03Z"
              fill="#3B82F6"
            />
            {/* POE and DYE oil tanks */}
            <path
              d="M145.29 241.87H57.9902V246.69"
              stroke="#3B82F6"
              strokeWidth="1.42"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M145.29 277.61H57.9902V282.43"
              stroke="#3B82F6"
              strokeWidth="1.42"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              opacity="0.5"
              d="M59 267.03C64.24 267.03 68.5 271.54 68.5 277.09V300.03H49.5V277.09C49.5 271.54 53.76 267.03 59 267.03Z"
              fill="#3B82F6"
            />
            <path
              opacity="0.5"
              d="M59 230.03C64.24 230.03 68.5 234.54 68.5 240.09V263.03H49.5V240.09C49.5 234.54 53.76 230.03 59 230.03Z"
              fill="#3B82F6"
            />
            <path
              opacity="0.5"
              d="M559 228.03C565.35 228.03 570.5 232.95 570.5 239.01V264.03H547.5V239.01C547.5 232.95 552.65 228.03 559 228.03Z"
              fill="#3B82F6"
            />
            <path
              opacity="0.5"
              d="M503.54 119.21C507.4 119.21 510.54 122.12 510.54 125.71V166.21H496.54V125.71C496.54 122.12 499.68 119.21 503.54 119.21Z"
              fill="#3B82F6"
            />
            <path
              opacity="0.5"
              d="M562 137.03C566.69 137.03 570.5 133.22 570.5 128.53C570.5 123.84 566.69 120.03 562 120.03C557.31 120.03 553.5 123.84 553.5 128.53C553.5 133.22 557.31 137.03 562 137.03Z"
              fill="#3B82F6"
            />
            <path
              opacity="0.5"
              d="M580 137.03C584.69 137.03 588.5 133.22 588.5 128.53C588.5 123.84 584.69 120.03 580 120.03C575.31 120.03 571.5 123.84 571.5 128.53C571.5 133.22 575.31 137.03 580 137.03Z"
              fill="#3B82F6"
            />
            <path
              d="M561.5 128.03H579.5"
              stroke="#3B82F6"
              strokeWidth="1.42"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M569.5 148.03C580.55 148.03 589.5 139.08 589.5 128.03C589.5 116.98 580.55 108.03 569.5 108.03C558.45 108.03 549.5 116.98 549.5 128.03C549.5 139.08 558.45 148.03 569.5 148.03Z"
              stroke="#3B82F6"
              strokeWidth="1.42"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* hoses flushing */}
            <path
              d="M190.83 293.53V339.1H144.62"
              stroke="#3B82F6"
              strokeWidth="1.42"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M114.51 321.23H144.34V356.76H114.95"
              stroke="#3B82F6"
              strokeWidth="1.42"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M106.23 315.92H114.25V326.19H106.23"
              stroke="#3B82F6"
              strokeWidth="1.42"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M106.23 351.34H114.25V361.61H106.23"
              stroke="#3B82F6"
              strokeWidth="1.42"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              opacity="0.5"
              d="M418.65 92.21H446.39C448.13 92.21 449.54 93.79 449.54 95.73V159.02H415.5V95.73C415.5 93.79 416.91 92.21 418.65 92.21Z"
              fill="#3B82F6"
            />
            <path
              opacity="0.5"
              d="M627.7 99.0303H638.29C639.51 99.0303 640.5 100.14 640.5 101.5V147.03H625.5V101.5C625.5 100.13 626.49 99.0303 627.71 99.0303H627.7Z"
              fill="#3B82F6"
            />
            <path
              d="M416.52 130.03H424.56V133.78H441.78V137.98H424.85V142.18H442.07V146.38H424.99V150.23H448.52"
              stroke="#3B82F6"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* nitrogen */}
            <path
              d="M143.37 74.3203V148.64H182.72"
              stroke="#3B82F6"
              strokeWidth="1.42"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M142.29 126.33H59.54"
              stroke="#3B82F6"
              strokeWidth="1.42"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M183.5 143.03H189.5V154.03H183.5"
              stroke="#3B82F6"
              strokeWidth="1.42"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M322.04 165.71H328.04V176.71H322.04"
              stroke="#3B82F6"
              strokeWidth="1.42"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* active paths */}
            {runningTestRunCode === "sixthProcedure" && (
              <path
                d="M289.5 305V293.5H146V200.5H227V52H202M202 52V31H102M202 52V73.5H102"
                stroke="#FF3B30"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="15 15"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="150"
                  to="0"
                  dur="2s"
                  begin="0s"
                  fill="freeze"
                  repeatCount="indefinite"
                />
              </path>
            )}
            {runningTestRunCode === "firstProcedure" && (
              <path
                d="M289.5 306.5V293H458V289H422V285.5H459.5V281.5H422V277.5H459.5V274H422V270.5H459.5V267.5H391V131H424.5V134.5H441V138.5H424.5V142.5H441V146.5H424.5V150.5H455V184.5H671.5V103.5H546.5V116H449H376.5V82.5H258.5V52H202.5M202.5 52V31.5H98.5M202.5 52V73.5H98.5"
                stroke="#A8F0FF"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="15 15"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="0"
                  to="150"
                  dur="2s"
                  begin="0s"
                  fill="freeze"
                  repeatCount="indefinite"
                />
              </path>
            )}
            {runningTestRunCode === "secondProcedure" && (
              <path
                d="M559 238V224.5H402.5V68H367.5V51.5H202.5M202.5 51.5V31.5H98M202.5 51.5V73.5H98"
                stroke="#00C7BE"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="15 15"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="0"
                  to="150"
                  dur="2s"
                  begin="0s"
                  fill="freeze"
                  repeatCount="indefinite"
                />
              </path>
            )}
            {runningTestRunCode === "fourthProcedure" && (
              <path
                d="M58 283V277H145V199.5H227V51.5H202.5M202.5 51.5V31H98.5M202.5 51.5V73H98.5"
                stroke="#FFCC00"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="15 15"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="150"
                  to="0"
                  dur="2s"
                  begin="0s"
                  fill="freeze"
                  repeatCount="indefinite"
                />
              </path>
            )}
            {runningTestRunCode === "fifthProcedure" && (
              <path
                d="M58 247V241H145V199.5H227V51.5H202.5M202.5 51.5V31H98.5M202.5 51.5V73H98.5"
                stroke="#FFCC00"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="15 15"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="150"
                  to="0"
                  dur="2s"
                  begin="0s"
                  fill="freeze"
                  repeatCount="indefinite"
                />
              </path>
            )}
            {runningTestRunCode === "thirdProcedure" && (
              <path
                d="M58 205V199H145L227 198.5V51.5H202.5M202.5 51.5V31H98.5M202.5 51.5V73H98.5"
                stroke="#FFCC00"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="15 15"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="150"
                  to="0"
                  dur="2s"
                  begin="0s"
                  fill="freeze"
                  repeatCount="indefinite"
                />
              </path>
            )}
          </svg>
          <View className="absolute flex-row bottom-2 right-2 gap-2">
            {/* test runs */}
            {testRunModalOpen && (
              <View className="bg-background p-2 rounded">
                <FlatList
                  className="rounded"
                  data={testRuns}
                  renderItem={({ item: testRun, index }) => (
                    <Pressable
                      key={index}
                      className="flex flex-row items-center px-2 py-1.5 gap-4 bg-white/20 active:bg-white/10"
                      onPress={() => launchTestRun(testRun)}
                    >
                      <PlayIcon color="white" />
                      <View>
                        <Text className="title-regular-small">
                          {t(testRun.nameKey)}
                        </Text>
                        <Text>
                          {testRun.actuators
                            .map((actuator) => getActuatorLabel(actuator))
                            .join(" - ")}
                        </Text>
                      </View>
                    </Pressable>
                  )}
                  keyExtractor={(item) => item.nameKey}
                  ItemSeparatorComponent={() => (
                    <Separator
                      orientation="horizontal"
                      className="bg-white/40"
                    />
                  )}
                />
              </View>
            )}
            {!runningTestRunCode && (
              <Button
                className="flex-row gap-2 h-fit self-end"
                variant="secondary"
                onPress={handleTestRunButtonPress}
              >
                {!testRunModalOpen && <PlayIcon color="white" fill="white" />}
                {!testRunModalOpen && (
                  <Text>{t("operations.maintenance_.testRun")}</Text>
                )}
                {testRunModalOpen && <X color="white" className="h-7" />}
              </Button>
            )}
            {runningTestRunCode && (
              <Button
                className="flex-row gap-2"
                variant="secondary"
                onPress={async () => {
                  try {
                    await stopTestRun();
                  } catch (error: any) {
                    console.error(error);
                    errorToast(
                      error.message ??
                        error.description ??
                        t("errors.genericError")
                    );
                  }
                }}
              >
                <SquareIcon color="white" fill="white" />
                <Text>{t("misc.stop")}</Text>
              </Button>
            )}
          </View>
        </View>
        {warningModalOpenReason && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("misc.warning")}</DialogTitle>
              <DialogDescription>
                {t(warningModalCaptions[warningModalOpenReason])}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button onPress={() => setWarningModalOpenReason(undefined)}>
                  <Text>{t("buttons.ok")}</Text>
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </Page>
  );
}
