import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface SystemPerformanceChartProps {
  data: Array<{
    metric: string;
    value: string;
    status: string;
  }>;
}

const SystemPerformanceChart: React.FC<SystemPerformanceChartProps> = ({ data }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "#10b981";
      case "good":
        return "#3b82f6";
      case "warning":
        return "#f59e0b";
      case "critical":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getNumericValue = (value: string) => {
    return parseFloat(value.replace(/[^\d.]/g, ""));
  };

  const chartData = data.map(item => ({
    ...item,
    numericValue: getNumericValue(item.value)
  }));

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="metric" 
            className="text-xs"
            tick={{ fontSize: 10 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            className="text-xs"
            tick={{ fontSize: 10 }}
            domain={[0, 100]}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
            }}
            formatter={(value: number, name: string, props: any) => [
              props.payload.value,
              "Value"
            ]}
            labelFormatter={(label) => `Metric: ${label}`}
          />
          <Bar dataKey="numericValue" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getStatusColor(entry.status)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SystemPerformanceChart;
