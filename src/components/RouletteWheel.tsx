"use client";

import { motion } from "framer-motion";

interface WheelProps {
  rotation: number;
  onStopSpinning: () => void;
}

const WHEEL_NUMBERS = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24,
  16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
];
const REDS = [
  1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
];

export default function RouletteWheel({
  rotation,
  onStopSpinning,
}: WheelProps) {
  const size = 320;
  const center = size / 2;
  const radius = center - 10;
  const totalSegments = 37;
  const anglePerSegment = 360 / totalSegments;

  const round = (n: number) => Math.round(n * 1000) / 1000;

  return (
    <div className="relative flex justify-center items-center">
      {/* Top Indicator Arrow (Exactly at 12 o'clock) */}
      <div className="absolute top-[-12px] z-50 flex flex-col items-center">
        <div className="w-6 h-6 bg-white rounded-full shadow-[0_0_15px_white]" />
        <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-white" />
      </div>

      <motion.div
        className="relative"
        animate={{ rotate: -rotation }} // Rotates counter-clockwise
        transition={{ duration: 5, ease: [0.15, 0, 0.15, 1] }}
        onAnimationComplete={onStopSpinning}
      >
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* 
            Fixed Geometry: 
            Standard SVG 0deg is at 3 o'clock. 
            We rotate the whole group by -90deg so Index 0 starts exactly at the top (12 o'clock).
          */}
          <g transform={`rotate(-90 ${center} ${center})`}>
            {WHEEL_NUMBERS.map((num, i) => {
              const startA = i * anglePerSegment;
              const endA = (i + 1) * anglePerSegment;

              const x1 = round(
                center + radius * Math.cos((Math.PI * startA) / 180),
              );
              const y1 = round(
                center + radius * Math.sin((Math.PI * startA) / 180),
              );
              const x2 = round(
                center + radius * Math.cos((Math.PI * endA) / 180),
              );
              const y2 = round(
                center + radius * Math.sin((Math.PI * endA) / 180),
              );

              const color =
                num === 0
                  ? "#10b981"
                  : REDS.includes(num)
                    ? "#ef4444"
                    : "#111827";

              const midAngle = startA + anglePerSegment / 2;
              const tx = round(
                center + (radius - 25) * Math.cos((Math.PI * midAngle) / 180),
              );
              const ty = round(
                center + (radius - 25) * Math.sin((Math.PI * midAngle) / 180),
              );
              const tr = round(midAngle + 90);

              return (
                <g key={num}>
                  <path
                    d={`M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`}
                    fill={color}
                    stroke="#ffffff15"
                    strokeWidth="0.5"
                  />
                  <text
                    x={tx}
                    y={ty}
                    fill="white"
                    fontSize="9"
                    fontWeight="900"
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    transform={`rotate(${tr} ${tx} ${ty})`}
                  >
                    {num}
                  </text>
                </g>
              );
            })}
          </g>
          {/* Decorative Rings */}
          <circle
            cx={center}
            cy={center}
            r={radius - 45}
            fill="#070b14"
            stroke="#eab30820"
            strokeWidth="2"
          />
        </svg>

        {/* Center Hub */}
        <div className="absolute inset-0 m-auto w-16 h-16 bg-gradient-to-br from-[#fde68a] to-[#78350f] rounded-full flex items-center justify-center border-4 border-[#070b14] shadow-2xl">
          <span className="text-[12px] font-black text-white italic">88</span>
        </div>
      </motion.div>

      {/* Outer Static Frame */}
      <div className="absolute w-[332px] h-[332px] rounded-full border-[12px] border-[#1f2937] shadow-inner pointer-events-none opacity-60" />
    </div>
  );
}
