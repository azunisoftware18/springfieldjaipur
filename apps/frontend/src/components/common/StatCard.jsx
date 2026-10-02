import React from 'react';
import { TrendingUp, TrendingDown, Users } from 'lucide-react';

const StatCard = ({
  title,
  value,
  percentage,
  isUp,
  trendingText,
  subText,
}) => {
  // Trend based colors (OKLCH format for better perception)
  const badgeStyles = {
    backgroundColor: isUp ? "oklch(0.95 0.05 140)" : "oklch(0.92 0.04 28)", // Light Green vs Light Red
    color: isUp ? "oklch(0.35 0.12 140)" : "oklch(0.45 0.18 13.6)",        // Dark Green vs Dark Red
  };

  return (
    <div
      style={{
        backgroundColor: "var(--card)",
        color: "var(--card-foreground)",
        borderColor: "var(--border)",
      }}
      className="p-6 rounded-[calc(var(--radius)*1.5)] border shadow-sm flex flex-col gap-1.5 transition-all hover:shadow-md"
    >
      {/* Header: Title & Badge */}
      <div className="flex items-center justify-between">
        <p
          style={{ color: "var(--muted-foreground)" }}
          className="text-xs font-semibold uppercase tracking-wider"
        >
          {title}
        </p>
        
        <div
          style={badgeStyles}
          className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black"
        >
          {isUp ? (
            <TrendingUp size={12} strokeWidth={3} />
          ) : (
            <TrendingDown size={12} strokeWidth={3} />
          )}
          {percentage}%
        </div>
      </div>

      {/* Main Value */}
      <p
        style={{ color: "var(--foreground)" }}
        className="text-3xl font-extrabold tracking-tight mt-1"
      >
        {value}
      </p>

      {/* Footer Info */}
      <div
        style={{ color: "var(--muted-foreground)" }}
        className="text-[11px] leading-relaxed mt-3 border-t border-dashed border-gray-100 pt-3"
      >
        <p className="flex items-center gap-1.5 font-medium mb-0.5">
          {trendingText} <Users size={12} className="opacity-70" />
        </p>
        <p className="opacity-80">{subText}</p>
      </div>
    </div>
  );
};

export default StatCard;