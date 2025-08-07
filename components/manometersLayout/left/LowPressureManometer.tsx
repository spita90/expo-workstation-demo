import { Text, TextClassContext } from "@/components/ui/text";
import {
  LOW_PRESSURE_METRIC,
  LP_MANOMETER_BAR_MAX,
  LP_MANOMETER_BAR_MIN,
  LP_MANOMETER_PSI_MAX,
  LP_MANOMETER_PSI_MIN,
  MANOMETER_MOTION_TRANSITION,
} from "@/lib/constants";
import { getManometerHeight, UnitOfMeasure } from "@/lib/utils";
import { useGlobalStore } from "@/stores/globalStore";
import { clamp } from "lodash";
import { motion } from "motion/react";
import { useShallow } from "zustand/shallow";

export const LowPressureManometer = () => {
  const { pressureUnitOfMeasure, pressureMetric } = useGlobalStore(
    useShallow((state) => ({
      pressureUnitOfMeasure: state.userSettings.unitOfMeasures.pressure,
      pressureMetric: state.pbdMetrics[LOW_PRESSURE_METRIC],
    }))
  );
  const pressure = Number(pressureMetric?.converted ?? 0);

  const isPsi =
    pressureUnitOfMeasure ===
    (UnitOfMeasure.POUND_PER_SQUARE_INCH as UnitOfMeasure);

  const lowPressureHeight = getManometerHeight({
    pressureValue: clamp(
      pressure,
      isPsi ? LP_MANOMETER_PSI_MIN : LP_MANOMETER_BAR_MIN,
      isPsi ? LP_MANOMETER_PSI_MAX : LP_MANOMETER_BAR_MAX
    ),
    unitOfMeasure: pressureUnitOfMeasure,
    scale: [
      { psi: LP_MANOMETER_PSI_MIN, bar: LP_MANOMETER_BAR_MIN, height: 0 },
      { psi: 0, bar: 0, height: 68 },
      { psi: 10, bar: 1, height: 133 },
      { psi: 30, bar: 2, height: 194 },
      { psi: 50, bar: 3, height: 256 },
      { psi: 70, bar: 4, height: 331 },
      { psi: 90, bar: 6, height: 416 },
      { psi: 120, bar: 9, height: 478 },
      { psi: 170, bar: 13, height: 543 },
      { psi: 250, bar: 17, height: 614 },
      { psi: LP_MANOMETER_PSI_MAX, bar: LP_MANOMETER_BAR_MAX, height: 642 },
    ],
  });

  return (
    <>
      <TextClassContext.Provider value="absolute font-agdasima text-[24px] leading-[32px] tracking-[8%] uppercase">
        {!isPsi && (
          <>
            <Text className="-bottom-[0.7%] left-[34%]">
              {LP_MANOMETER_BAR_MIN}
            </Text>
            <Text className="bottom-[9.3%] left-[29.5%]">0</Text>
            <Text className="bottom-[19%] left-[22%]">1</Text>
            <Text className="bottom-[28.5%] left-[14%]">2</Text>
            <Text className="bottom-[38%] left-[7%]">3</Text>
            <Text className="bottom-[49.5%] left-[1%]">4</Text>
            <Text className="top-[32.5%] left-[1%]">6</Text>
            <Text className="top-[23%] left-[9%]">9</Text>
            <Text className="top-[13%] left-[17%]">13</Text>
            <Text className="top-[2.2%] left-[30%]">17</Text>
          </>
        )}
        {isPsi && (
          <>
            <Text className="-bottom-[0.7%] left-[28%]">
              {LP_MANOMETER_PSI_MIN}
            </Text>
            <Text className="bottom-[9.3%] left-[29.5%]">0</Text>
            <Text className="bottom-[19%] left-[20%]">10</Text>
            <Text className="bottom-[28.5%] left-[11%]">30</Text>
            <Text className="bottom-[38%] left-[4%]">50</Text>
            <Text className="bottom-[49.5%] -left-[1%]">70</Text>
            <Text className="top-[32.5%] -left-[1%]">90</Text>
            <Text className="top-[23%] left-[4%]">120</Text>
            <Text className="top-[13%] left-[14%]">170</Text>
            <Text className="top-[2.2%] left-[23%]">250</Text>
          </>
        )}
      </TextClassContext.Provider>
      <Text className="absolute left-0.5 bottom-[9.3%] font-agdasima text-3xl font-bold px-1.5 py-0 rounded bg-[#0B99E4]">
        LOW
      </Text>
      <svg
        className="relative left-0 top-0 h-full"
        viewBox="0 0 219 655"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M48.3032 263.452L133.011 6.07422H181.44C177.165 9.77688 173.92 14.5216 172.02 19.8481L81.167 274.5C78.167 282.5 75.667 294 78.667 306L153.5 654H133.5L47.318 285.825C45.5842 278.418 45.9251 270.677 48.3032 263.452Z"
          fill="#3F3F46"
        />
        <mask
          id="mask0_2326_89892"
          type="alpha"
          maskUnits="userSpaceOnUse"
          x="44"
          y="0"
          width="148"
          height="655"
        >
          <motion.rect
            x="44"
            y="655"
            width="148"
            height="655"
            fill="#D9D9D9"
            animate={{ y: -lowPressureHeight }}
            transition={MANOMETER_MOTION_TRANSITION}
          />
        </mask>
        <g mask="url(#mask0_2326_89892)">
          <path
            d="M48.3031 263.452L133.011 6.07422H181.44C177.165 9.77688 173.92 14.5216 172.02 19.8481L81.167 274.5C78.167 282.5 75.667 294 78.667 306L153.5 654H133.5L47.3179 285.825C45.5842 278.418 45.9251 270.677 48.3031 263.452Z"
            fill="url(#paint0_linear_2326_89892)"
          />
        </g>
        <path
          d="M104.909 581.251L106.071 586H91.0986V581.251H104.909Z"
          fill="url(#paint0_linear_2326_89892)"
        />
        <path
          d="M77.4339 456.667L78.5965 461.416H62.8834V456.667H77.4339Z"
          fill="url(#paint0_linear_2326_89892)"
        />
        <path
          d="M62.7495 393.804L63.9121 398.554H48.8666V393.804H62.7495Z"
          fill="url(#paint0_linear_2326_89892)"
        />
        <path
          d="M46.9432 319.621L48.1058 324.37H33.4012V319.621H46.9432Z"
          fill="url(#paint0_linear_2326_89892)"
        />
        <path
          d="M48.324 234.25C47.9303 235.807 47.6306 237.395 47.4246 239H34.0713V234.25H48.324Z"
          fill="url(#paint0_linear_2326_89892)"
        />
        <path
          d="M69.2489 171.9L67.3954 176.645H51.8987V171.896H69.2489V171.9Z"
          fill="url(#paint0_linear_2326_89892)"
        />
        <path
          d="M91.5794 107.016L89.7243 111.766H74.6851V107.016H91.5794Z"
          fill="url(#paint0_linear_2326_89892)"
        />
        <path
          d="M116.16 36L114.305 40.7493H98.8554V36H116.16Z"
          fill="url(#paint0_linear_2326_89892)"
        />
        <path
          d="M90.7646 517.202L91.9272 521.951H76.2141V517.202H90.7646Z"
          fill="url(#paint0_linear_2326_89892)"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M102.874 0.440755L22.0063 234.305C12.6668 260.5 13.167 271.5 18.5637 295.451L104.739 654.353H112.485L29.3214 302.097C25.1669 281.5 24.1669 266 29.3214 252.914L114.414 5.67058H190.768C187.756 7.52868 185.086 9.92372 182.901 12.7554C180.007 16.5049 178.301 21.3417 175.187 30.1749L175.056 30.5461L89.2394 273.898L89.1776 274.073C86.7392 280.988 85.4469 284.652 84.778 288.432C84.1843 291.788 83.9593 295.199 84.1073 298.604C84.2739 302.439 85.0738 306.242 86.5831 313.417L86.6214 313.599L158.301 654.352H158.329L161.698 653.643L90.018 312.884C88.4612 305.483 87.7278 301.971 87.5749 298.453C87.438 295.301 87.6462 292.144 88.1958 289.037C88.8093 285.57 89.9976 282.184 92.5127 275.052L178.329 31.7004C181.61 22.3971 183.137 18.1301 185.648 14.8761C188.828 10.7567 193.168 7.68472 198.111 6.05644C198.547 5.91258 198.992 5.78454 199.451 5.67058H218.197L216.475 0.353516H116.244H102.904H102.874V0.440755Z"
          fill="url(#paint10_linear_2326_89892)"
        />
        <mask
          id="mask1_2326_89892"
          type="alpha"
          maskUnits="userSpaceOnUse"
          x="-77"
          y="0"
          width="275"
          height="655"
        >
          <motion.rect
            height={8}
            width={275}
            y={655 - 8}
            fill="white"
            animate={{ y: -lowPressureHeight }}
            transition={MANOMETER_MOTION_TRANSITION}
          />
        </mask>
        <g mask="url(#mask1_2326_89892)">
          <path
            d="M16.6612 286.5L105.078 656H162.025C139.5 547.5 95.5 337.5 88.5941 307C87.0295 300.09 87 292.5 88.5941 287L189 2H102.581C79 69.5 30.3065 210.085 22.6559 233C14.6516 256.975 12.5 264.5 16.6612 286.5Z"
            fill="white"
          />
        </g>
        <defs>
          <linearGradient
            id="paint0_linear_2326_89892"
            x1="110.134"
            y1="62.0434"
            x2="-167.884"
            y2="199.44"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#77CEF5" />
            <stop offset="0.333333" stopColor="#2BB3EB" />
            <stop offset="0.666667" stopColor="#0997E3" />
            <stop offset="1" stopColor="#2BB3EB" />
          </linearGradient>
          <linearGradient
            id="paint10_linear_2326_89892"
            x1="112.107"
            y1="56.8474"
            x2="-224.135"
            y2="301.784"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#77CEF5" />
            <stop offset="0.333333" stopColor="#2BB3EB" />
            <stop offset="0.666667" stopColor="#0997E3" />
            <stop offset="1" stopColor="#2BB3EB" />
          </linearGradient>
        </defs>
      </svg>
    </>
  );
};
