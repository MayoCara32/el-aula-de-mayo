"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface RecommendPieChartProps {
  recommendRate: { yes: number; no: number };
}

export function RecommendPieChart({ recommendRate }: RecommendPieChartProps) {
  const data = [
    { name: "Sí lo recomienda", value: recommendRate.yes, color: "hsl(142.1 76.2% 36.3%)" }, // green-600
    { name: "No lo recomienda", value: recommendRate.no, color: "hsl(346.8 77.2% 49.8%)" }, // destructive
  ];

  const total = recommendRate.yes + recommendRate.no;

  if (total === 0) {
    return <div className="h-[300px] flex items-center justify-center text-muted-foreground">Sin datos suficientes</div>;
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border p-3 rounded-lg shadow-lg">
          <p className="font-semibold" style={{ color: payload[0].payload.color }}>
            {payload[0].name}
          </p>
          <p className="text-muted-foreground">{payload[0].value} alumnos ({(payload[0].value / total * 100).toFixed(0)}%)</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
