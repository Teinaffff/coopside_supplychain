import React, { useState } from "react";
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Legend,
  Tooltip,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../common/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../common/ui/select";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

const data = [
  { name: "Soap", value: 400 },
  { name: "Oil", value: 300 },
  { name: "Grains", value: 300 },
  { name: "Spices", value: 200 },
  { name: "Others", value: 278 },
];
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28ED0"];

const SalesDistributionChart = () => {
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [loading, setLoading] = useState(false);

  const handleYearChange = (value: string) => {
    setSelectedYear(parseInt(value, 10));
  };

  const totalValue = data.reduce((sum, entry) => sum + entry.value, 0);
  const renderCustomLabel = ({ name, value }: any) => {
    const percent = ((value / totalValue) * 100).toFixed(1);
    return `${name}: ${percent}%`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Sales Distribution</CardTitle>
            <CardDescription>{selectedYear} yearly data.</CardDescription>
          </div>
          <div>
            <Select
              onValueChange={(value) => handleYearChange(value)}
              value={selectedYear.toString()}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString() || ""}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>Loading...</div>
        ) : data.length === 0 ? (
          <div className="flex justify-center items-center">
            No data available for the selected year.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                dataKey="value"
                startAngle={0}
                endAngle={360}
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label={renderCustomLabel}
                legendType="circle"
                labelLine={false}
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default SalesDistributionChart;
