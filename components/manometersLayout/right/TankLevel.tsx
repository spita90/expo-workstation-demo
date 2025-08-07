import { Text, TextClassContext } from "@/components/ui/text";
import {
  MANOMETER_MOTION_TRANSITION,
  OTHER_MANOMETER_BAR_MAX,
  OTHER_MANOMETER_BAR_MIN,
  OTHER_MANOMETER_PSI_MAX,
  OTHER_MANOMETER_PSI_MIN,
  OTHER_PRESSURE_METRIC,
} from "@/lib/constants";
import { UnitOfMeasure } from "@/lib/utils";
import { useGlobalStore } from "@/stores/globalStore";
import { clamp } from "lodash";
import { motion } from "motion/react";
import { View } from "react-native";
import { useShallow } from "zustand/shallow";

export const TankLevel = () => {
  const { pressureUnitOfMeasure, pressureMetric } = useGlobalStore(
    useShallow((state) => ({
      pressureUnitOfMeasure: state.userSettings.unitOfMeasures.pressure,
      pressureMetric: state.pbdMetrics[OTHER_PRESSURE_METRIC],
    }))
  );
  const pressure = Number(pressureMetric?.converted ?? 0);

  const isPsi =
    pressureUnitOfMeasure ===
    (UnitOfMeasure.POUND_PER_SQUARE_INCH as UnitOfMeasure);

  const tankPressureHeight =
    (clamp(
      pressure,
      isPsi ? OTHER_MANOMETER_PSI_MIN : OTHER_MANOMETER_BAR_MIN,
      isPsi ? OTHER_MANOMETER_PSI_MAX : OTHER_MANOMETER_BAR_MAX
    ) /
      (isPsi ? OTHER_MANOMETER_PSI_MAX : OTHER_MANOMETER_BAR_MAX)) *
    194; // no need to interpolate using getManometerHeight since it's a linear scale

  return (
    <View className="absolute right-[58%] bottom-[1px] h-1/3">
      <TextClassContext.Provider value="absolute font-agdasima text-[20px] leading-[28px] tracking-[0%] uppercase">
        {!isPsi && (
          <>
            <Text className="-bottom-[2%] right-[90%]">
              {OTHER_MANOMETER_BAR_MIN}
            </Text>
            <Text className="bottom-[16%] right-[80%]">5</Text>
            <Text className="bottom-[35%] right-[68%]">10</Text>
            <Text className="bottom-[54%] right-[59%]">15</Text>
            <Text className="bottom-[72%] right-[48%]">20</Text>
            <Text className="bottom-[90%] right-[39%]">
              {OTHER_MANOMETER_BAR_MAX}
            </Text>
          </>
        )}
        {isPsi && (
          <>
            <Text className="-bottom-[2%] right-[90%]">
              {OTHER_MANOMETER_PSI_MIN}
            </Text>
            <Text className="bottom-[16%] right-[79%]">70</Text>
            <Text className="bottom-[35%] right-[68%]">145</Text>
            <Text className="bottom-[54%] right-[58%]">215</Text>
            <Text className="bottom-[72%] right-[48%]">290</Text>
            <Text className="bottom-[90%] right-[38%]">
              {OTHER_MANOMETER_PSI_MAX}
            </Text>
          </>
        )}
      </TextClassContext.Provider>
      <svg
        className="relative right-0 top-0 h-full"
        viewBox="0 0 80 208"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M70.7373 14.2402H56.7373L49.1075 50.5996H62.9191L70.7373 14.2402ZM62.274 53.5996L54.5331 89.5996H40.9235L48.478 53.5996H62.274ZM40.294 92.5996H53.888L46.1471 128.6H32.7396L40.294 92.5996ZM32.1101 131.6H45.502L37.7611 167.6H24.5557L32.1101 131.6ZM23.9261 170.6H37.116L29.2373 207.24H16.2373L23.9261 170.6Z"
          fill="white"
          fillOpacity="0.2"
        />
        <mask
          id="mask0_4877_104169"
          type="alpha"
          maskUnits="userSpaceOnUse"
          x="16"
          y="14"
          width="55"
          height="194"
        >
          <motion.rect
            x="-15"
            y="15"
            width="92"
            height="194"
            fill="#D9D9D9"
            animate={{ y: 194 - tankPressureHeight }}
            transition={MANOMETER_MOTION_TRANSITION}
          />
        </mask>
        <g mask="url(#mask0_4877_104169)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M70.5 14.5H56.5L48.9589 50.5996H62.7716L70.5 14.5ZM62.1294 53.5996L54.4223 89.5996H40.812L48.3322 53.5996H62.1294ZM40.1853 92.5996H53.7801L46.073 128.6H32.665L40.1853 92.5996ZM32.0383 131.6H45.4308L37.7237 167.6H24.5181L32.0383 131.6ZM23.8914 170.6H37.0815L29.2373 207.24H16.2373L23.8914 170.6Z"
            fill="url(#paint1_linear_4877_104169)"
          />
        </g>
        <path d="M71 38H74.5L38.5 207.141H35L71 38Z" fill="#F4F4F5" />
        <path
          d="M76.0001 14H79.5L75.0889 35.7763H71.5L76.0001 14Z"
          fill="#EF4444"
        />
        <defs>
          <linearGradient
            id="paint1_linear_4877_104169"
            x1="68.9023"
            y1="-14.5389"
            x2="117.88"
            y2="175.384"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#BFDBFE" />
            <stop offset="1" stopColor="#EFF6FF" />
          </linearGradient>
        </defs>
      </svg>
    </View>
  );
};
