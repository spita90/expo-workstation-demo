import { Text } from "@/components/ui/text";
import {
  TANK_TEMPERATURE_CELSIUS_MAX,
  TANK_TEMPERATURE_CELSIUS_MIN,
  TANK_TEMPERATURE_METRIC,
} from "@/lib/constants";
import { useGlobalStore } from "@/stores/globalStore";
import { UNITS_OF_MEASURE_SYMBOLS } from "@/types";
import { clamp } from "lodash";
import { View } from "react-native";
import { useShallow } from "zustand/shallow";

export const BottomBar = () => {
  const { temperatureUnitOfMeasure, temperatureMetric } = useGlobalStore(
    useShallow((state) => ({
      temperatureUnitOfMeasure: state.userSettings.unitOfMeasures.temperature,
      temperatureMetric: state.pbdMetrics[TANK_TEMPERATURE_METRIC],
    }))
  );

  const temperatureConverted = Number(temperatureMetric?.converted ?? 0);
  const temperatureClampedCelsius = clamp(
    Number(temperatureMetric?.raw ?? 0),
    TANK_TEMPERATURE_CELSIUS_MIN,
    TANK_TEMPERATURE_CELSIUS_MAX
  );

  const ICON_YELLOW_THRESHOLD = 20;
  const ICON_RED_THRESHOLD = 10;
  const BAR_YELLOW_THRESHOLD = 2;
  const BAR_RED_THRESHOLD = 1;

  const Bars = ({
    id,
    barQty,
    fillMode,
    colored,
  }: {
    id: string;
    barQty: number;
    fillMode: "rtl" | "ltr";
    colored?: boolean;
  }) => {
    const barsValue = barQty < 0 ? 0 : barQty > 10 ? 10 : barQty;
    const activeBarStopColor = colored
      ? barsValue <= BAR_RED_THRESHOLD
        ? "red"
        : barsValue <= BAR_YELLOW_THRESHOLD
        ? "yellow"
        : "#B3B3B3"
      : "#B3B3B3";

    return (
      <svg
        width="188"
        height="33"
        viewBox="0 0 188 33"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {Array.from({ length: barsValue }).map((_, index) => (
          <rect
            key={index}
            x={((fillMode === "ltr" ? 0 : 10 - barsValue) + index) * 19.2}
            width="15.2"
            height="33"
            fill={`url(#paint0_linear_2326_68787_${id})`}
          />
        ))}
        {Array.from({ length: 10 - barsValue }).map((_, index) => (
          <rect
            key={index}
            x={((fillMode === "ltr" ? barsValue : 0) + index) * 19.2}
            width="15.2"
            height="33"
            fill="#FE2727"
            fillOpacity="0.2"
          />
        ))}
        <defs>
          <linearGradient
            id={`paint0_linear_2326_68787_${id}`}
            x1="8.968"
            y1="33"
            x2="8.96802"
            y2="7.58002e-07"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={activeBarStopColor} stopOpacity="0.8" />
            <stop offset="0.49" stopColor="white" />
            <stop
              offset="0.965"
              stopColor={activeBarStopColor}
              stopOpacity="0.8"
            />
          </linearGradient>
        </defs>
      </svg>
    );
  };

  return (
    <View className="flex flex-row h-20 justify-between items-center px-4">
      <View className="flex flex-row gap-4 items-center">
        {/* tank */}
        <svg
          width="59"
          height="59"
          viewBox="0 0 59 59"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            width="59"
            height="59"
            rx="29.5"
            fill="white"
            fillOpacity="0.2"
          />
          <rect
            x="6"
            y="6"
            width="47"
            height="47"
            rx="23.5"
            fill="white"
            fillOpacity="0.2"
          />
          <rect
            x="19.8187"
            y="24.5462"
            width="18.8312"
            height="15.5385"
            fill="#D9D9D9"
            fillOpacity="0.3"
          />
          <path
            d="M28.8217 25.8887C28.4269 25.8887 28.0483 26.0376 27.7691 26.3025C27.49 26.5674 27.3331 26.9267 27.3331 27.3013V32.5325C26.8551 32.8355 26.4925 33.2764 26.2989 33.79C26.1052 34.3036 26.0907 34.8627 26.2576 35.3847C26.4245 35.9067 26.7638 36.364 27.2255 36.6889C27.6873 37.0139 28.2469 37.1893 28.8217 37.1893C29.3966 37.1893 29.9562 37.0139 30.4179 36.6889C30.8797 36.364 31.219 35.9067 31.3859 35.3847C31.5528 34.8627 31.5383 34.3036 31.3446 33.79C31.151 33.2764 30.7884 32.8355 30.3104 32.5325V27.3013C30.3104 26.9267 30.1535 26.5674 29.8744 26.3025C29.5952 26.0376 29.2166 25.8887 28.8217 25.8887Z"
            stroke="white"
          />
          <path
            d="M25.3109 19.8855V17.3529H26.6716V19.8855"
            stroke="#F4F4F5"
            strokeWidth="1.5"
            strokeMiterlimit="10"
          />
          <path
            d="M31.1371 19.8855V17.3529H32.4977V19.8855"
            stroke="#F4F4F5"
            strokeWidth="1.5"
            strokeMiterlimit="10"
          />
          <path
            d="M33.8494 16.212H24.1504C23.8373 16.212 23.5835 16.4529 23.5835 16.75C23.5835 17.0471 23.8373 17.288 24.1504 17.288H33.8494C34.1625 17.288 34.4164 17.0471 34.4164 16.75C34.4164 16.4529 34.1625 16.212 33.8494 16.212Z"
            stroke="#F4F4F5"
            strokeWidth="1.5"
            strokeMiterlimit="10"
          />
          <path
            d="M20.3486 39.9814C20.5941 42.1222 22.5049 43.7887 24.8264 43.7887H33.174C35.4955 43.7887 37.4063 42.1222 37.6518 39.9814"
            fill="#D9D9D9"
            fillOpacity="0.3"
          />
          <path
            d="M20.3486 39.9814C20.5941 42.1222 22.5049 43.7887 24.8264 43.7887H33.174C35.4955 43.7887 37.4063 42.1222 37.6518 39.9814"
            stroke="#F4F4F5"
            strokeWidth="1.5"
            strokeMiterlimit="10"
          />
          <path
            d="M37.6787 24.5529V24.2422C37.6787 21.8814 35.662 19.9676 33.1741 19.9676H24.8265C22.3386 19.9676 20.3219 21.8814 20.3219 24.2422V24.5529"
            fill="#D9D9D9"
            fillOpacity="0.3"
          />
          <path
            d="M37.6787 24.5529V24.2422C37.6787 21.8814 35.662 19.9676 33.1741 19.9676H24.8265C22.3386 19.9676 20.3219 21.8814 20.3219 24.2422V24.5529"
            stroke="#F4F4F5"
            strokeWidth="1.5"
            strokeMiterlimit="10"
          />
          <path
            d="M37.6782 38.0942V26.4407"
            stroke="#F4F4F5"
            strokeWidth="1.5"
            strokeMiterlimit="10"
          />
          <path
            d="M20.3212 26.4407V38.0942"
            stroke="#F4F4F5"
            strokeWidth="1.5"
            strokeMiterlimit="10"
          />
          <path
            d="M37.6782 26.4415H38.3523C38.5869 26.4415 38.7772 26.2609 38.7772 26.0383V24.9577C38.7772 24.7351 38.5869 24.5545 38.3523 24.5545H37.6782"
            stroke="#F4F4F5"
            strokeWidth="1.5"
            strokeMiterlimit="10"
          />
          <path
            d="M20.3214 24.5545H19.6474C19.4127 24.5545 19.2224 24.7351 19.2224 24.9577V26.0383C19.2224 26.2609 19.4127 26.4415 19.6474 26.4415H20.3214"
            stroke="#F4F4F5"
            strokeWidth="1.5"
            strokeMiterlimit="10"
          />
          <path
            d="M20.3214 38.0939H19.6474C19.4127 38.0939 19.2224 38.2745 19.2224 38.4971V39.5777C19.2224 39.8003 19.4127 39.9809 19.6474 39.9809H20.3483"
            stroke="#F4F4F5"
            strokeWidth="1.5"
            strokeMiterlimit="10"
          />
          <path
            d="M37.6515 39.9809H38.3524C38.587 39.9809 38.7773 39.8003 38.7773 39.5777V38.4971C38.7773 38.2745 38.587 38.0939 38.3524 38.0939H37.6784"
            stroke="#F4F4F5"
            strokeWidth="1.5"
            strokeMiterlimit="10"
          />
        </svg>
        <Text className="w-14 text-center font-agdasima text-2xl">{`${Math.ceil(
          temperatureConverted
        )}${UNITS_OF_MEASURE_SYMBOLS[temperatureUnitOfMeasure]}`}</Text>
        <Bars
          id="tank"
          barQty={Math.ceil(
            (Number(temperatureClampedCelsius) / TANK_TEMPERATURE_CELSIUS_MAX) *
              10
          )}
          fillMode="ltr"
        />
      </View>
    </View>
  );
};
