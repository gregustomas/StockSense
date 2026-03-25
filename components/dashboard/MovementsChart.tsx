"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { StockMovement } from "@/types";
import { timestampToDate } from "@/lib/utils";

interface MovementsChartProps {
  movements: StockMovement[];
}

export function MovementsChart({ movements }: MovementsChartProps) {
  const chartData = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      date.setHours(0, 0, 0, 0);
      return date;
    });

    return days.map((day) => {
      const nextDay = new Date(day);
      nextDay.setDate(nextDay.getDate() + 1);

      const dayMovements = movements.filter((m) => {
        const date = timestampToDate(m.createdAt);
        return date >= day && date < nextDay;
      });

      return {
        date: day.toLocaleDateString("cs-CZ", {
          weekday: "short",
          day: "numeric",
        }),
        in: dayMovements.filter((m) => m.type === "in").length,
        out: dayMovements.filter((m) => m.type === "out").length,
      };
    });
  }, [movements]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Movements — Last 7 Days</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData}>
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="in" fill="#18181b" radius={[4, 4, 0, 0]} />
            <Bar dataKey="out" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
