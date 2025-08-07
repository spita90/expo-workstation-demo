import { animate, motion, useMotionValue } from "motion/react";
import { useEffect, useRef } from "react";

export interface SemicircleGaugeProps {
  fillPercentage: number;
  width?: number;
  height?: number;
}

export const SemicircleGauge = ({
  fillPercentage,
  width,
  height,
}: SemicircleGaugeProps) => {
  const pathRef = useRef<SVGPathElement | null>(null);
  const pathLengthMV = useMotionValue(0);
  const xMV = useMotionValue(0);
  const yMV = useMotionValue(0);
  let totalLen = 0;

  useEffect(() => {
    const pathEl = pathRef.current;
    if (!pathEl) return;

    totalLen = pathEl.getTotalLength();
    const initialLen = 0;
    pathLengthMV.set(initialLen);

    const pt = pathEl.getPointAtLength(initialLen);
    xMV.set(pt.x);
    yMV.set(pt.y);

    const unsubscribe = pathLengthMV.on("change", (currentLen) => {
      const newPt = pathEl.getPointAtLength(currentLen);
      xMV.set(newPt.x);
      yMV.set(newPt.y);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const pathEl = pathRef.current;
    if (!pathEl) return;

    totalLen = pathEl.getTotalLength();
    const newTargetLen = (fillPercentage / 100) * totalLen;

    animate(pathLengthMV, newTargetLen, {
      duration: 0.4,
      ease: "easeInOut",
    });
  }, [fillPercentage]);

  return (
    <svg
      width={width || "420"}
      height={height || "247"}
      viewBox="0 0 420 247"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M52 178C52 90.7408 122.9646 20 210.5 20C298.035 20 369 90.7408 369 178"
        stroke="white"
        strokeMiterlimit="10"
        strokeWidth="25"
        strokeOpacity="0.2"
      />
      <motion.path
        ref={pathRef}
        d="M52 178C52 90.7408 122.9646 20 210.5 20C298.035 20 369 90.7408 369 178"
        stroke="#EF4444"
        strokeMiterlimit="10"
        strokeWidth="25"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: fillPercentage / 100 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      />
      <motion.circle cx={xMV} cy={yMV} r="18.5" fill="white" />
    </svg>
  );
};
