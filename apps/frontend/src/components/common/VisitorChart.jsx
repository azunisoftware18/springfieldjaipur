"use client";

import {
  AreaChart,
  Area,
  XAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { useMemo } from "react";

export default function VisitorChart({ tickets  = [] }) {

  // =====================
  // CHART DATA
  // =====================

  const chartData = useMemo(() => {

  const groupedData = {};

  tickets.forEach((ticket) => {

    const date = new Date(
      ticket.createdAt
    ).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    if (!groupedData[date]) {
      groupedData[date] = 0;
    }

    // 🔥 Every ticket = 1 visitor
    groupedData[date] += 1;
  });

  return Object.entries(groupedData).map(
    ([date, visitors]) => ({
      name: date,
      visitors,
    })
  );

}, [tickets]);

  // =====================
  // TOTAL VISITORS
  // =====================

  const totalVisitors = chartData.reduce(
    (sum, item) => sum + item.visitors,
    0
  );

  return (
    <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">

        <div>
          <h2 className="text-2xl font-black text-slate-900">
            Total Visitors
          </h2>

          <p className="text-slate-500 font-medium mt-1">
            {totalVisitors} total visitors 
          </p>
        </div>

        <div className="flex items-center bg-slate-100 rounded-2xl p-1 gap-1 w-fit">

          
        </div>
      </div>

      {/* CHART */}
      <div className="h-87.5 w-full">
        <ResponsiveContainer width="100%" height="100%">

          <AreaChart data={chartData}>

            <defs>
              <linearGradient
                id="visitorGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#ff004f"
                  stopOpacity={0.25}
                />

                <stop
                  offset="100%"
                  stopColor="#ff004f"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tick={{
                fill: "#64748b",
                fontSize: 12,
              }}
            />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="visitors"
              stroke="#ff004f"
              strokeWidth={3}
              fill="url(#visitorGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}