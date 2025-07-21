import { Text } from "@/components/ui/text";
import { getUnitOfMeasureType, UnitOfMeasure } from "@/lib/utils";
import { useGlobalStore } from "@/stores/globalStore";
import { UnitOfMeasureSettings } from "@/stores/slices/appConfigSlice";
import { UNITS_OF_MEASURE_SYMBOLS } from "@/types";
import {
  Color,
  LinearGradient,
  useFont,
  vec,
} from "@shopify/react-native-skia";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import {
  Area,
  CartesianChart,
  type ChartBounds,
  Line,
  type PointsArray,
} from "victory-native";
import { useShallow } from "zustand/shallow";

export interface ChartProps {
  metric?: {
    // if no metric is provided, chart will render random values
    metricName: string;
    chartValueType: "converted" | "raw";
  };
  graphColor?: Color;
  yScale?: { minValue: number; maxValue: number };
  maxValues?: number;
  throttleMs?: number;
  bottomRightLabel?: string;
}

interface DataPoint extends Record<string, number> {
  count: number;
  value: number;
}

const chartValueTypeLabel = {
  converted: "misc.converted",
  raw: "misc.raw",
};

const chartDefaultColorByType = {
  converted: "#3B82F6",
  raw: "#FF050D",
};

const getMetricRelatedUserUnitOfMeasure = (
  metricUnitOfMeasure: UnitOfMeasure,
  userUnitOfMeasures: UnitOfMeasureSettings
) => {
  if (!metricUnitOfMeasure) return undefined;
  const unitOfMeasureType = getUnitOfMeasureType(metricUnitOfMeasure);
  if (!unitOfMeasureType) return undefined;
  return userUnitOfMeasures[unitOfMeasureType];
};

export const Chart = ({
  metric,
  yScale,
  graphColor = metric && "chartValueType" in metric
    ? chartDefaultColorByType[metric.chartValueType]
    : "#3B82F6",
  maxValues = 30,
  throttleMs = 500,
  bottomRightLabel,
}: ChartProps) => {
  const font = useFont(require("@/assets/fonts/Roboto-Variable.ttf"), 12);
  const { t } = useTranslation();
  const [data, setData] = useState<DataPoint[]>([]);
  const { userUnitOfMeasures } = useGlobalStore(
    useShallow((state) => ({
      userUnitOfMeasures: state.userSettings.unitOfMeasures,
    }))
  );
  const lastUpdateRef = useRef<number>(0);
  const metricUnitOfMeasure = useRef<UnitOfMeasure>();

  const userUnitOfMeasure: UnitOfMeasure | undefined = useMemo(() => {
    if (!metricUnitOfMeasure.current) return undefined;
    return getMetricRelatedUserUnitOfMeasure(
      metricUnitOfMeasure.current,
      userUnitOfMeasures
    );
  }, [userUnitOfMeasures, metricUnitOfMeasure.current]);

  useEffect(() => {
    if (metric) {
      const unsub = useGlobalStore.subscribe((state) => {
        const newVal = Number(
          state.pbdMetrics[metric.metricName]?.[metric.chartValueType]
        );

        if (!newVal || Number.isNaN(newVal)) return;
        if (
          state.pbdMetrics[metric.metricName].unitOfMeasure !==
          metricUnitOfMeasure.current
        ) {
          metricUnitOfMeasure.current =
            state.pbdMetrics[metric.metricName].unitOfMeasure;
        }

        const now = Date.now();
        if (throttleMs > 0 && now - lastUpdateRef.current < throttleMs) return;
        lastUpdateRef.current = now;
        setData((currentData) => {
          const newData = [...currentData, { count: 0, value: newVal }];
          if (newData.length > maxValues) {
            newData.shift();
          }
          if (newData.length === maxValues) {
            for (let i = 0; i < newData.length; i++) {
              newData[i].count = i;
            }
          } else {
            newData[newData.length - 1].count = newData.length - 1;
          }
          return newData;
        });
      });
      return unsub;
    } else {
      // if no metric is provided, chart will render random values (take care of throttleMs and maxValues)
      const interval = setInterval(() => {
        setData((currentData) => {
          const newData = [
            ...currentData,
            { count: 0, value: Math.random() * 100 },
          ];
          if (newData.length > maxValues) {
            newData.shift();
          }
          if (newData.length === maxValues) {
            for (let i = 0; i < newData.length; i++) {
              newData[i].count = i;
            }
          } else {
            newData[newData.length - 1].count = newData.length - 1;
          }
          return newData;
        });
      }, throttleMs);
      return () => clearInterval(interval);
    }
  }, [metric, maxValues, throttleMs]);

  const autoYMin = useMemo(() => {
    if (!data.length) return -1;
    return Math.min(...data.map((d) => d.value));
  }, [data]);

  const autoYMax = useMemo(() => {
    if (!data.length) return 1;
    return Math.max(...data.map((d) => d.value));
  }, [data]);

  const autoYPadding = 0.1 * Math.max(1, autoYMax - autoYMin);

  const chartDomain = useMemo(
    () => ({
      y: [
        yScale?.minValue ?? autoYMin - autoYPadding,
        yScale?.maxValue ?? autoYMax + autoYPadding,
      ] as [number, number],
      x: [0, Math.max(data.length, maxValues)] as [number, number],
    }),
    [yScale, autoYMin, autoYMax, autoYPadding, data.length, maxValues]
  );
  if (!font) return null;

  return (
    <View className="bg-white/10 rounded">
      <CartesianChart
        data={data}
        xKey="count"
        yKeys={["value"]}
        domainPadding={{ top: 4, bottom: 4, left: 0, right: 0 }}
        domain={chartDomain}
        frame={{ lineWidth: 0 }}
        xAxis={{ tickCount: 1, tickValues: [0] }}
        yAxis={[
          {
            labelPosition: "outset",
            tickCount: 6,
            formatYLabel: (label) => label.toFixed(0),
            font,
            labelColor: "white",
          },
        ]}
      >
        {({ chartBounds, points }) =>
          !!data.length && (
            <StockArea
              points={points.value}
              graphColor={graphColor}
              {...chartBounds}
            />
          )
        }
      </CartesianChart>
      <View className="flex-row px-2 bg-zinc-800 py-1 items-center rounded-b">
        {metric?.chartValueType === "converted" && !!userUnitOfMeasure && (
          <Text className="flex-1 text-left">
            {UNITS_OF_MEASURE_SYMBOLS[userUnitOfMeasure]}
          </Text>
        )}
        <Text className="flex-1 paragraph-semibold-medium text-right">
          {bottomRightLabel
            ? bottomRightLabel
            : metric && t(chartValueTypeLabel[metric.chartValueType])}
        </Text>
      </View>
    </View>
  );
};

const StockArea = ({
  points,
  graphColor,
  top,
  bottom,
}: {
  points: PointsArray;
  graphColor: Color;
} & ChartBounds) => {
  return (
    <>
      <Area
        y0={bottom}
        points={points}
        color={graphColor}
        curveType="monotoneX"
      >
        <LinearGradient
          start={vec(0, 0)}
          end={vec(top, bottom)}
          colors={[graphColor, `${graphColor.valueOf()}00`]}
        />
      </Area>
      <Line
        points={points}
        strokeWidth={2}
        color={graphColor}
        curveType="monotoneX"
      />
    </>
  );
};
