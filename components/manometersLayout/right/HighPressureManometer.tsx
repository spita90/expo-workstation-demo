import { Text, TextClassContext } from "@/components/ui/text";
import {
  HIGH_PRESSURE_METRIC,
  HP_MANOMETER_BAR_MAX,
  HP_MANOMETER_BAR_MIN,
  HP_MANOMETER_PSI_MAX,
  HP_MANOMETER_PSI_MIN,
  MANOMETER_MOTION_TRANSITION,
} from "@/lib/constants";
import { getManometerHeight, UnitOfMeasure } from "@/lib/utils";
import { useGlobalStore } from "@/stores/globalStore";
import { clamp } from "lodash";
import { motion } from "motion/react";
import { useShallow } from "zustand/shallow";

export const HighPressureManometer = () => {
  const { pressureUnitOfMeasure, pressureMetric } = useGlobalStore(
    useShallow((state) => ({
      pressureUnitOfMeasure: state.userSettings.unitOfMeasures.pressure,
      pressureMetric: state.pbdMetrics[HIGH_PRESSURE_METRIC],
    }))
  );
  const pressure = Number(pressureMetric?.converted ?? 0);

  const isPsi =
    pressureUnitOfMeasure ===
    (UnitOfMeasure.POUND_PER_SQUARE_INCH as UnitOfMeasure);

  const highPressureHeight = getManometerHeight({
    pressureValue: clamp(
      pressure,
      isPsi ? HP_MANOMETER_PSI_MIN : HP_MANOMETER_BAR_MIN,
      isPsi ? HP_MANOMETER_PSI_MAX : HP_MANOMETER_BAR_MAX
    ),
    unitOfMeasure: pressureUnitOfMeasure,
    scale: [
      { psi: HP_MANOMETER_PSI_MIN, bar: HP_MANOMETER_BAR_MIN, height: 0 },
      { psi: 0, bar: 0, height: 68 },
      { psi: 20, bar: 2, height: 133 },
      { psi: 40, bar: 4, height: 194 },
      { psi: 60, bar: 6, height: 256 },
      { psi: 80, bar: 8, height: 331 },
      { psi: 100, bar: 10, height: 416 },
      { psi: 200, bar: 20, height: 478 },
      { psi: 500, bar: 35, height: 543 },
      { psi: 750, bar: 50, height: 614 },
      { psi: HP_MANOMETER_PSI_MAX, bar: HP_MANOMETER_BAR_MAX, height: 642 },
    ],
  });

  return (
    <>
      <TextClassContext.Provider value="absolute font-agdasima text-[24px] leading-[32px] tracking-[8%] uppercase">
        {!isPsi && (
          <>
            <Text className="-bottom-[0.7%] right-[36%]">
              {HP_MANOMETER_BAR_MIN}
            </Text>
            <Text className="bottom-[9.5%] right-[30%]">0</Text>
            <Text className="bottom-[19%] right-[22%]">2</Text>
            <Text className="bottom-[28.5%] right-[16%]">4</Text>
            <Text className="bottom-[38.5%] right-[8%]">6</Text>
            <Text className="bottom-[49.5%] right-[1%]">8</Text>
            <Text className="top-[32.5%] -right-[1%]">10</Text>
            <Text className="top-[23%] right-[6%]">20</Text>
            <Text className="top-[12.5%] right-[16%]">35</Text>
            <Text className="top-[2.2%] right-[26%]">50</Text>
          </>
        )}
        {isPsi && (
          <>
            <Text className="-bottom-[0.7%] right-[29%]">
              {HP_MANOMETER_PSI_MIN}
            </Text>
            <Text className="bottom-[9.5%] right-[30%]">0</Text>
            <Text className="bottom-[19%] right-[18%]">20</Text>
            <Text className="bottom-[28.5%] right-[11%]">40</Text>
            <Text className="bottom-[38.5%] right-[4%]">60</Text>
            <Text className="bottom-[49.5%] -right-[2%]">80</Text>
            <Text className="top-[32.5%] -right-[3%]">100</Text>
            <Text className="top-[23%] right-[2%]">200</Text>
            <Text className="top-[12.5%] right-[12%]">500</Text>
            <Text className="top-[2.2%] right-[23%]">750</Text>
          </>
        )}
      </TextClassContext.Provider>
      <Text className="absolute right-0 bottom-[9.5%] font-agdasima text-3xl font-bold px-1.5 py-0 rounded bg-[#EC2424]">
        HIGH
      </Text>
      <svg
        className="relative left-0 top-0 h-full"
        viewBox="0 0 219 655"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M170.226 263.452L85.5181 6.07422H37.0896C41.3643 9.77688 44.6092 14.5216 46.5095 19.8481L137.362 274.5C140.362 282.5 142.862 294 139.862 306L65.0293 654H85.0293L171.211 285.825C172.945 278.418 172.604 270.677 170.226 263.452Z"
          fill="#3F3F46"
        />
        <path
          d="M113.62 581.251L112.458 586H127.43V581.251H113.62Z"
          fill="url(#paint9_linear_2326_89893)"
        />
        <path
          d="M141.095 456.667L139.933 461.416H155.646V456.667H141.095Z"
          fill="url(#paint9_linear_2326_89893)"
        />
        <path
          d="M155.78 393.804L154.617 398.554H169.662V393.804H155.78Z"
          fill="url(#paint9_linear_2326_89893)"
        />
        <path
          d="M171.586 319.621L170.423 324.37H185.128V319.621H171.586Z"
          fill="url(#paint9_linear_2326_89893)"
        />
        <path
          d="M170.205 234.25C170.599 235.807 170.899 237.395 171.105 239H184.458V234.25H170.205Z"
          fill="url(#paint9_linear_2326_89893)"
        />
        <path
          d="M149.28 171.9L151.134 176.645H166.63V171.896H149.28V171.9Z"
          fill="url(#paint9_linear_2326_89893)"
        />
        <path
          d="M126.95 107.016L128.805 111.766H143.844V107.016H126.95Z"
          fill="url(#paint9_linear_2326_89893)"
        />
        <path
          d="M102.369 36L104.225 40.7493H119.674V36H102.369Z"
          fill="url(#paint9_linear_2326_89893)"
        />
        <path
          d="M127.764 517.202L126.602 521.951H142.315V517.202H127.764Z"
          fill="url(#paint9_linear_2326_89893)"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M115.655 0.440755L196.523 234.305C205.863 260.5 205.362 271.5 199.966 295.451L113.79 654.353H106.044L189.208 302.097C193.362 281.5 194.362 266 189.208 252.914L104.116 5.67058H27.761C30.7735 7.52868 33.4433 9.92372 35.6287 12.7554C38.5225 16.5049 40.228 21.3417 43.3426 30.1749L43.4735 30.5461L129.29 273.898L129.352 274.073C131.79 280.988 133.082 284.652 133.751 288.432C134.345 291.788 134.57 295.199 134.422 298.604C134.255 302.439 133.456 306.242 131.946 313.417L131.908 313.599L60.2289 654.352H60.2007L56.8311 653.643L128.511 312.884C130.068 305.483 130.802 301.971 130.954 298.453C131.091 295.301 130.883 292.144 130.334 289.037C129.72 285.57 128.532 282.184 126.017 275.052L40.2002 31.7004C36.9194 22.3971 35.3924 18.1301 32.881 14.8761C29.7018 10.7567 25.361 7.68472 20.4188 6.05644C19.9821 5.91258 19.5376 5.78454 19.0786 5.67058H0.332672L2.05391 0.353516H102.286H115.625H115.655V0.440755Z"
          fill="url(#paint9_linear_2326_89893)"
        />
        <mask
          id="mask0_2326_89893"
          type="alpha"
          maskUnits="userSpaceOnUse"
          x="27"
          y="0"
          width="152"
          height="655"
        >
          <motion.rect
            x="27"
            y="655"
            width="152"
            height="655"
            fill="#D9D9D9"
            animate={{ y: -highPressureHeight }}
            transition={MANOMETER_MOTION_TRANSITION}
          />
        </mask>
        <g mask="url(#mask0_2326_89893)">
          <path
            d="M170.226 263.452L85.5181 6.07422H37.0896C41.3643 9.77688 44.6092 14.5216 46.5095 19.8481L137.362 274.5C140.362 282.5 142.862 294 139.862 306L65.0293 654H85.0293L171.211 285.825C172.945 278.418 172.604 270.677 170.226 263.452Z"
            fill="url(#paint10_linear_2326_89893)"
          />
        </g>
        <mask
          id="mask1_2326_89893"
          type="alpha"
          maskUnits="userSpaceOnUse"
          x="21"
          y="0"
          width="275"
          height="655"
        >
          <motion.rect
            height={8}
            width={275}
            y={655 - 8}
            fill="white"
            animate={{ y: -highPressureHeight }}
            transition={MANOMETER_MOTION_TRANSITION}
          />
        </mask>
        <g mask="url(#mask1_2326_89893)">
          <path
            d="M201.863 286L113.363 654.5H56.3623C79.5 545.5 123.5 336 129.862 306.5C131.895 297.077 131 291.5 129.862 286.5L29.3623 1.5H115.862C139.201 71.8704 188.205 209.585 195.862 232.5C203.874 256.475 205.5 259.5 201.863 286Z"
            fill="white"
          />
        </g>
        <defs>
          <linearGradient
            id="paint9_linear_2326_89893"
            x1="106.422"
            y1="56.8474"
            x2="442.664"
            y2="301.784"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FF7B74" />
            <stop offset="0.333333" stopColor="#FE2727" />
            <stop offset="0.666667" stopColor="#8F1515" />
            <stop offset="1" stopColor="#F16666" />
          </linearGradient>
          <linearGradient
            id="paint10_linear_2326_89893"
            x1="108.395"
            y1="62.0434"
            x2="386.413"
            y2="199.44"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FF7B74" />
            <stop offset="0.333333" stopColor="#FE2727" />
            <stop offset="0.666667" stopColor="#8F1515" />
            <stop offset="1" stopColor="#F16666" />
          </linearGradient>
        </defs>
      </svg>
    </>
  );
};
