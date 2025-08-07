import { Text } from "@/components/ui/text";
import {
  FILTER_METRIC,
  TEMPERATURE_CELSIUS_MAX,
  TEMPERATURE_CELSIUS_MIN,
  TEMPERATURE_METRIC,
} from "@/lib/constants";
import { useGlobalStore } from "@/stores/globalStore";
import { UNITS_OF_MEASURE_SYMBOLS } from "@/types";
import { clamp } from "lodash";
import { View } from "react-native";
import { useShallow } from "zustand/shallow";

export const BottomBar = () => {
  const { temperatureUnitOfMeasure, temperatureMetric, filterMetric } =
    useGlobalStore(
      useShallow((state) => ({
        temperatureUnitOfMeasure: state.userSettings.unitOfMeasures.temperature,
        temperatureMetric: state.pbdMetrics[TEMPERATURE_METRIC],
        filterMetric: state.pbdMetrics[FILTER_METRIC],
      }))
    );

  const temperatureConverted = Number(temperatureMetric?.converted ?? 0);
  const temperatureClampedCelsius = clamp(
    Number(temperatureMetric?.raw ?? 0),
    TEMPERATURE_CELSIUS_MIN,
    TEMPERATURE_CELSIUS_MAX
  );

  const filterConverted = Number(filterMetric?.raw ?? 0); // using raw, since it is percentage

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
            (Number(temperatureClampedCelsius) / TEMPERATURE_CELSIUS_MAX) * 10
          )}
          fillMode="ltr"
        />
      </View>
      <View className="flex flex-row gap-4 items-center">
        <Bars
          id="filter"
          barQty={Math.ceil(filterConverted / 10)}
          fillMode="rtl"
          colored
        />
        <Text className="w-14 text-center font-agdasima text-2xl">{`${filterConverted}%`}</Text>
        {/* filter */}
        <svg
          width="58"
          height="59"
          viewBox="0 0 58 59"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="58" height="59" rx="29" fill="white" fillOpacity="0.2" />
          <rect
            x="6"
            y="6"
            width="46"
            height="47"
            rx="23"
            fill="white"
            fillOpacity="0.2"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M29 24.5491C34.4228 24.5491 38.819 22.6353 38.819 20.2746C38.819 17.9138 34.4228 16 29 16C23.5771 16 19.181 17.9138 19.181 20.2746C19.181 22.6353 23.5771 24.5491 29 24.5491ZM29 22.0814C31.6739 22.0814 33.8416 21.1541 33.8416 20.0102C33.8416 18.8663 31.6739 17.939 29 17.939C26.326 17.939 24.1583 18.8663 24.1583 20.0102C24.1583 21.1541 26.326 22.0814 29 22.0814Z"
            fill={
              filterConverted <= ICON_RED_THRESHOLD
                ? "red"
                : filterConverted <= ICON_YELLOW_THRESHOLD
                ? "yellow"
                : "white"
            }
          />
          <path
            d="M35.2983 40.2333C36.3019 39.8924 37.1921 39.4612 37.8923 38.9485C37.8801 38.9615 37.8677 38.9744 37.8552 38.9874C37.4087 39.4479 36.7383 39.8856 35.8711 40.2639C34.1382 41.0199 31.7093 41.5 29 41.5C26.2907 41.5 23.8618 41.0199 22.1289 40.2639C21.2617 39.8856 20.5913 39.4479 20.1448 38.9874C20.1323 38.9745 20.1199 38.9615 20.1078 38.9486C20.8079 39.4612 21.6981 39.8924 22.7016 40.2333C24.4553 40.8289 26.6406 41.178 29 41.178C31.3594 41.178 33.5447 40.8289 35.2983 40.2333Z"
            fill="white"
            fillOpacity={filterConverted <= 20 ? "0.6" : "0.2"}
            stroke={
              filterConverted <= ICON_RED_THRESHOLD
                ? "red"
                : filterConverted <= ICON_YELLOW_THRESHOLD
                ? "yellow"
                : "white"
            }
          />
          <path
            d="M19.0012 22.4089C19.0074 22.2367 19.2445 22.2194 19.3347 22.3675C20.4707 24.2325 24.3675 25.6068 29 25.6068C33.6325 25.6068 37.5293 24.2325 38.6653 22.3675C38.7555 22.2194 38.9927 22.2367 38.9988 22.4089C38.9996 22.4318 39 22.4549 39 22.4779C39 22.9144 38.8531 23.3359 38.5796 23.7336C38.559 23.7636 38.5475 23.7987 38.5475 23.8347V36.5918C38.5475 36.6279 38.5363 36.663 38.5147 36.6922C38.0655 37.2967 37.3221 37.8434 36.3581 38.3001C36.2399 38.3561 36.1041 38.2711 36.1041 38.143V25.8215C36.1041 25.6935 35.9682 25.6079 35.847 25.6576C35.4087 25.8373 34.9332 26 34.4261 26.1432C34.3482 26.1652 34.2941 26.2344 34.2941 26.3135V38.9139C34.2941 38.9929 34.2401 39.0624 34.1618 39.0831C32.9373 39.4057 31.5413 39.6169 30.0477 39.6848C29.9451 39.6895 29.8597 39.6094 29.8597 39.5094V27.0079C29.8597 26.9079 29.7744 26.828 29.6718 26.831C29.4498 26.8374 29.2257 26.8407 29 26.8407C28.6519 26.8407 28.3081 26.8329 27.9692 26.8177C27.8655 26.8131 27.7783 26.8935 27.7783 26.9946V39.4901C27.7783 39.5912 27.6911 39.6717 27.5874 39.6652C26.0817 39.5724 24.6839 39.3332 23.4718 38.9818C23.3957 38.9597 23.3439 38.8912 23.3439 38.8139V26.2064C23.3439 26.1291 23.292 26.0608 23.2163 26.0373C22.7061 25.8793 22.2313 25.7008 21.7982 25.5047C21.676 25.4494 21.5339 25.535 21.5339 25.6662V38.1499C21.5339 38.1832 21.5062 38.2101 21.4721 38.2101C21.4622 38.2101 21.4525 38.2078 21.4437 38.2035C20.2447 37.6005 19.4185 36.8527 19.1216 36.0282C19.1191 36.0213 19.109 36.0214 19.1066 36.0284C19.1038 36.0369 19.0905 36.0349 19.0905 36.026V23.0934C19.0905 23.0761 19.0879 23.059 19.0829 23.0425C19.0282 22.8577 19 22.6692 19 22.4779C19 22.4549 19.0004 22.4318 19.0012 22.4089Z"
            fill={
              filterConverted <= ICON_RED_THRESHOLD
                ? "red"
                : filterConverted <= ICON_YELLOW_THRESHOLD
                ? "yellow"
                : "white"
            }
          />
        </svg>
      </View>
    </View>
  );
};
