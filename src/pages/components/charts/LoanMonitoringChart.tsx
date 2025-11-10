import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface LoanMonitoringChartProps {
  data: Array<{
    status: string;
    count: number;
    amount: number;
  }>;
}

const LoanMonitoringChart: React.FC<LoanMonitoringChartProps> = ({ data }) => {
  // Use cyan blue as leading color and orange as secondary
  const cyanBlue = "#00BCD4"; // true cyan blue
  const orange = "#f97316"; // orange
  
  const getStatusColor = (index: number) => {
    // Alternate between cyan blue (leading) and orange
    // Start with cyan blue for index 0, then alternate
    return index % 2 === 0 ? cyanBlue : orange;
  };

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="status" 
            className="text-xs"
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            className="text-xs"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => value.toLocaleString()}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
            }}
            formatter={(value: number, name: string, props: any) => [
              name === "count" ? `${value} loans` : `$${value.toLocaleString()}`,
              name === "count" ? "Count" : "Amount"
            ]}
            labelFormatter={(label) => `Status: ${label}`}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getStatusColor(index)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LoanMonitoringChart;
