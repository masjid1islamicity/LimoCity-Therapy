import React from "react";
import { Check, Plus } from "lucide-react";

interface GoalProgressRingToggleProps {
  completed: boolean;
  targetCount?: number;
  currentCount?: number;
  isAnimating?: boolean;
  unitLabel?: string;
  onToggle: (e: React.MouseEvent) => void;
  size?: number; // e.g. 40 or 44
}

export const GoalProgressRingToggle: React.FC<GoalProgressRingToggleProps> = ({
  completed,
  targetCount = 1,
  currentCount = 0,
  isAnimating = false,
  unitLabel = "kali",
  onToggle,
  size = 42,
}) => {
  const isMultiStep = targetCount > 1;
  const effectiveCount = completed ? targetCount : (currentCount ?? 0);
  const percentage = isMultiStep
    ? Math.min(100, Math.max(0, Math.round((effectiveCount / targetCount) * 100)))
    : completed
    ? 100
    : 0;

  // SVG Geometry
  const strokeWidth = 3;
  const center = size / 2;
  const radius = center - strokeWidth - 1; // Radius for circle
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Determine colors based on status
  const isFinished = completed || percentage >= 100;
  const strokeColor = isFinished
    ? "#10B981" // Emerald
    : percentage > 0
    ? "#C5A267" // Gold
    : "transparent";

  return (
    <div
      onClick={onToggle}
      role="button"
      tabIndex={0}
      title={
        isMultiStep
          ? `Kemajuan: ${effectiveCount}/${targetCount} ${unitLabel} (${percentage}%) • Klik untuk +1 / ubah status`
          : completed
          ? "Target tuntas hari ini • Klik untuk batal"
          : "Tandai tuntas hari ini"
      }
      className={`relative inline-flex items-center justify-center shrink-0 cursor-pointer select-none group focus:outline-hidden transition-transform duration-200 ${
        isAnimating ? "scale-110 animate-pulse" : "hover:scale-105 active:scale-95"
      }`}
      style={{ width: size, height: size }}
    >
      {/* SVG Progress Ring */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0 transform -rotate-90 origin-center pointer-events-none"
      >
        {/* Track Circle (Background) */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#252E3E"
          strokeWidth={strokeWidth}
          fill="none"
          className="transition-colors duration-300"
        />

        {/* Progress Percentage Ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-out"
        />
      </svg>

      {/* Center Core Button */}
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${
          isFinished
            ? "bg-emerald-500 text-black shadow-emerald-500/30 scale-100"
            : percentage > 0
            ? "bg-[#181C26] text-[#C5A267] border border-[#C5A267]/40"
            : "bg-[#0E1015] border border-[#2A3344] group-hover:border-[#C5A267]/70 text-transparent"
        }`}
      >
        {isFinished ? (
          <Check className="w-4 h-4 text-black stroke-[3]" />
        ) : isMultiStep && percentage > 0 ? (
          <div className="flex flex-col items-center justify-center leading-none">
            <span className="text-[9px] font-mono font-bold text-[#F3E8D2] group-hover:hidden">
              {percentage}%
            </span>
            <Plus className="w-3 h-3 text-[#C5A267] stroke-[3] hidden group-hover:block transition-transform duration-150" />
          </div>
        ) : (
          <Check className="w-3.5 h-3.5 text-[#C5A267] opacity-0 group-hover:opacity-40 transition-opacity" />
        )}
      </div>

      {/* Floating Micro Badge for Percentage on Hover if in Progress */}
      {isMultiStep && percentage > 0 && !isFinished && (
        <div className="absolute -top-2 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
          <span className="px-1 py-0.2 bg-[#C5A267] text-black text-[8px] font-bold font-mono rounded-full shadow-xs">
            +{1}
          </span>
        </div>
      )}
    </div>
  );
};
