"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface RatingBarChartProps {
  distribution: { 1: number; 2: number; 3: number; 4: number; 5: number };
}

export function RatingBarChart({ distribution }: RatingBarChartProps) {
  const data = [
    { name: "1 ★", value: distribution[1] || 0 },
    { name: "2 ★", value: distribution[2] || 0 },
    { name: "3 ★", value: distribution[3] || 0 },
    { name: "4 ★", value: distribution[4] || 0 },
    { name: "5 ★", value: distribution[5] || 0 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border p-3 rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          <p className="text-muted-foreground">{payload[0].value} opiniones</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted)/0.4)' }} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill="hsl(47.9 95.8% 53.1%)" /> // Tailwind yellow-500 equivalent
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
